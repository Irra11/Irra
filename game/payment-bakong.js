/**
 * payment.js — IRRA TOPUP
 * Bakong KHQR Payment — packages loaded from server (/api/packages)
 * Depends on: QRCode.js, ml-check-id.js (exposes window.isVerified)
 */

// =============================================================================
// CONFIG
// =============================================================================

const PAYMENT_API      = "https://oval-demand-width-beverage.trycloudflare.com"; // replace with Cloudflare tunnel URL when deployed
const POLL_INTERVAL_MS = 4000;
const MAX_POLL_MS      = 10 * 60 * 1000; // 10 minutes

// =============================================================================
// STATE
// =============================================================================

let packages        = [];   // loaded from /api/packages on DOMContentLoaded
let selectedPackage = null;
let pollInterval    = null;
let pollStartTime   = null;

// =============================================================================
// 1. LOAD + RENDER PACKAGES FROM SERVER
// =============================================================================

async function loadPackages() {
    const container = document.getElementById('packageContainer');
    if (!container) return;

    // Show skeleton while loading
    container.innerHTML = `
        <div class="col-span-full text-center text-white/40 text-sm py-8">
            <i class="fas fa-circle-notch fa-spin mr-2"></i> Loading packages...
        </div>`;

    try {
        const res  = await fetch(`${PAYMENT_API}/api/packages`);
        const data = await res.json();

        if (data.status !== "SUCCESS" || !data.packages?.length) {
            container.innerHTML = `<p class="col-span-full text-center text-red-400 text-sm py-8">
                Failed to load packages. Please refresh.</p>`;
            return;
        }

        packages = data.packages;
        renderPackages();

    } catch (e) {
        console.error("[loadPackages]", e);
        container.innerHTML = `<p class="col-span-full text-center text-red-400 text-sm py-8">
            SERVER ERROR</p>`;
    }
}

function renderPackages() {
    const container = document.getElementById('packageContainer');
    if (!container) return;

    container.innerHTML = packages.map(pkg => `
        <div onclick="selectPackage(${pkg.id})"
             id="pkg-${pkg.id}"
             class="bg-card border-2 border-slate-700 p-3 rounded-xl cursor-pointer package-card
                    flex items-center space-x-3 transition-all hover:border-blue-400 relative">

            <!-- ✅ CHECK ICON -->
            <div class="check-icon absolute top-1 right-1 w-5 h-5 bg-blue-600 text-white text-xs 
                        flex items-center justify-center rounded-full hidden shadow-md">
                ✓
            </div>

            <!-- PRODUCT IMAGE -->
            <div class="relative">
                <img src="${pkg.image}" 
                     class="w-10 h-10 rounded-lg object-cover shadow-lg"
                     alt="${pkg.name}" loading="lazy">
            </div>

            <div class="flex-1">
                <p class="text-blue-custom font-bold text-base leading-tight">
                    $${pkg.price.toFixed(2)}
                </p>
                <p class="text-[9px] text-white/60 leading-tight uppercase font-medium mt-0.5">
                    ${pkg.name}
                </p>
            </div>
        </div>
    `).join('');
}

// =============================================================================
// 2. SELECT PACKAGE
// =============================================================================
function selectPackage(id) {
    selectedPackage = packages.find(p => p.id === id) || null;
    if (!selectedPackage) return;

    // Update UI
    document.getElementById('displayTotal').innerText =
        `$${selectedPackage.price.toFixed(2)}`;

    document.getElementById('displayProduct').innerText =
        selectedPackage.name;

    // Remove all selected
    document.querySelectorAll('.package-card').forEach(el => {
        el.classList.remove('selected');
    });

    // Add selected
    const card = document.getElementById(`pkg-${id}`);
    if (card) card.classList.add('selected');

    updateButtonState();
}

// =============================================================================
// 3. PAY BUTTON STATE
// =============================================================================

function updateButtonState() {
    const payBtn = document.getElementById('payBtn');
    if (!payBtn) return;
    const verified = (typeof isVerified !== 'undefined' && isVerified === true);

    if (selectedPackage && verified) {
        payBtn.disabled = false;
        payBtn.classList.remove('bg-slate-700', 'text-gray-400', 'cursor-not-allowed');
        payBtn.classList.add('bg-blue-600', 'text-white', 'shadow-lg', 'active:scale-95');
        payBtn.innerHTML = "Pay Now";
    } else {
        payBtn.disabled = true;
        payBtn.classList.add('bg-slate-700', 'text-gray-400', 'cursor-not-allowed');
        payBtn.classList.remove('bg-blue-600', 'text-white', 'shadow-lg', 'active:scale-95');
        payBtn.innerHTML = !verified ? "PAY NOW" : "PAY NOW";
    }
}

// =============================================================================
// 4. HANDLE PAYMENT
// =============================================================================

async function handlePayment() {
    if (!selectedPackage) return;

    const gid = (document.getElementById('gameId')   || {}).value?.trim() || '';
    const sid = (document.getElementById('serverId') || {}).value?.trim() || '';
    if (!gid) { showToast("Please enter your Game ID.", "error"); return; }

    const btn = document.getElementById('payBtn');
    const originalHTML = btn ? btn.innerHTML : '';
    if (btn) {
        btn.innerHTML = '<i class="fas fa-circle-notch fa-spin mr-2"></i> Processing...';
        btn.disabled  = true;
    }

    try {
        const response = await fetch(`${PAYMENT_API}/create-payment`, {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                packageId: selectedPackage.id,   // server looks up price + SKU by id
                gameId:    gid,
                serverId:  sid,
            }),
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();

        if (data.status) {
            showModal(data.qrString, data.orderId, selectedPackage.price);
            startPolling(data.orderId);
        } else {
            showToast("Error: " + (data.message || "Unknown error"), "error");
            if (btn) { btn.innerHTML = originalHTML; updateButtonState(); }
        }
    } catch (e) {
        showToast("Cannot reach server. Is main.py running?", "error");
        console.error("[handlePayment]", e);
        if (btn) { btn.innerHTML = originalHTML; updateButtonState(); }
    }
}

// =============================================================================
// 5. POLLING
// =============================================================================

function startPolling(orderId) {
    stopPolling();
    pollStartTime = Date.now();

    pollInterval = setInterval(async () => {
        if (Date.now() - pollStartTime > MAX_POLL_MS) {
            stopPolling();
            showToast("Payment window expired. Please try again.", "error");
            closeModal();
            return;
        }
        try {
            const res  = await fetch(`${PAYMENT_API}/check-status/${orderId}`);
            const data = await res.json();

            switch (data.status) {
                case "SUCCESS":
                    stopPolling();
                    showSuccessScreen(
                        orderId,
                        data.product  || (selectedPackage ? selectedPackage.name : ''),
                        data.game_id  || (document.getElementById('gameId') || {}).value?.trim() || ''
                    );
                    break;

                case "PAID_BUT_DELIVERY_FAILED":
                    stopPolling();
                    showToast(
                        `Payment received! Delivery issue on #${orderId}. Staff will process manually.`,
                        "warning", 8000
                    );
                    closeModal();
                    break;

                case "NOT_FOUND":
                    stopPolling();
                    showToast("Order not found. Contact support.", "error");
                    closeModal();
                    break;

                case "ERROR":
                    console.warn("[poll] Server error:", data.message);
                    break;

                default:
                    break; // UNPAID — keep polling silently
            }
        } catch (e) {
            console.log("[poll] Waiting for payment...");
        }
    }, POLL_INTERVAL_MS);
}

function stopPolling() {
    if (pollInterval) { clearInterval(pollInterval); pollInterval = null; }
}

// =============================================================================
// 6. MODAL — open / close
// =============================================================================

function showModal(qr, orderId, price) {
    const modal = document.getElementById('paymentModal');
    if (!modal) return;

    modal.classList.remove('hidden');
    modal.classList.add('modal-active');

    const amountEl  = document.getElementById('modalAmount');
    const orderEl   = document.getElementById('modalOrderId');
    const qrWrapper = document.getElementById('qrcode');

    if (amountEl) amountEl.innerText = price.toFixed(2);
    if (orderEl)  orderEl.innerText  = `#${orderId}`;

    if (qrWrapper) {
        qrWrapper.innerHTML = "";
        new QRCode(qrWrapper, {
            text:         qr,
            width:        160,
            height:       160,
            correctLevel: QRCode.CorrectLevel.M,
        });
    }
}

function closeModal() {
    stopPolling();
    const modal = document.getElementById('paymentModal');
    if (!modal) return;
    modal.classList.remove('modal-active');
    modal.classList.add('hidden');
}

// =============================================================================
// 7. SUCCESS SCREEN
// =============================================================================

function showSuccessScreen(orderId, productName, gameId) {
    const modal = document.getElementById('paymentModal');
    if (!modal) return;

    modal.classList.remove('hidden');
    modal.classList.add('modal-active');

    const inner = modal.querySelector('div');
    if (!inner) return;

    inner.innerHTML = `
        <div class="py-8 px-4 text-center">
            <div class="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center
                        mx-auto mb-5 shadow-xl shadow-green-200">
                <i class="fas fa-check text-4xl text-white"></i>
            </div>
            <h2 class="text-2xl font-black text-slate-800 mb-1 uppercase tracking-widest">SUCCESS!</h2>
            <p class="text-green-600 font-bold text-sm mb-5">Diamonds delivered! 💎</p>
            <div class="bg-slate-50 rounded-2xl p-4 mb-5 text-left space-y-2 border border-slate-200">
                <div class="flex justify-between text-sm">
                    <span class="text-slate-500 font-medium">Order ID</span>
                    <span class="text-slate-800 font-bold">#${orderId}</span>
                </div>
                <div class="flex justify-between text-sm">
                    <span class="text-slate-500 font-medium">Product</span>
                    <span class="text-slate-800 font-bold">${productName}</span>
                </div>
                <div class="flex justify-between text-sm">
                    <span class="text-slate-500 font-medium">Game ID</span>
                    <span class="text-slate-800 font-bold">${gameId}</span>
                </div>
            </div>
            <button onclick="window.location.reload()"
                    class="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-2xl
                           font-bold text-base active:scale-95 transition-all shadow-lg shadow-blue-200">
                <i class="fas fa-home mr-2"></i> BACK TO SHOP
            </button>
        </div>
    `;
}

// =============================================================================
// 8. TOAST NOTIFICATIONS
// =============================================================================

function showToast(message, type = "info", duration = 4000) {
    const existing = document.getElementById('irra-toast');
    if (existing) existing.remove();

    const colours = { success: "bg-green-600", error: "bg-red-600", warning: "bg-yellow-500", info: "bg-blue-600" };
    const icons   = { success: "fa-check-circle", error: "fa-times-circle", warning: "fa-exclamation-triangle", info: "fa-info-circle" };

    const toast = document.createElement('div');
    toast.id        = 'irra-toast';
    toast.className = `fixed bottom-24 left-1/2 -translate-x-1/2 z-[9999]
                       flex items-center gap-2 px-4 py-3 rounded-xl shadow-xl
                       text-white text-sm font-medium transition-all duration-300
                       opacity-0 translate-y-4 ${colours[type] || colours.info}`;
    toast.style.maxWidth = "90vw";
    toast.innerHTML = `<i class="fas ${icons[type] || icons.info}"></i> ${message}`;
    document.body.appendChild(toast);

    requestAnimationFrame(() => toast.classList.remove('opacity-0', 'translate-y-4'));
    setTimeout(() => {
        toast.classList.add('opacity-0', 'translate-y-4');
        toast.addEventListener('transitionend', () => toast.remove(), { once: true });
    }, duration);
}

// =============================================================================
// 9. CAMRAPID PROXY HELPERS (admin / dashboard use)
// =============================================================================

async function fetchResellerProfile() {
    try {
        const res  = await fetch(`${PAYMENT_API}/api/profile`);
        const data = await res.json();
        return data.status === "SUCCESS" ? data.profile : null;
    } catch (e) { console.error("[fetchResellerProfile]", e); return null; }
}

async function fetchProductCatalogue(catalogId = null) {
    try {
        const url  = catalogId
            ? `${PAYMENT_API}/api/products/${catalogId}`
            : `${PAYMENT_API}/api/products`;
        const res  = await fetch(url);
        const data = await res.json();
        return data.status === "SUCCESS" ? (data.products || []) : [];
    } catch (e) { console.error("[fetchProductCatalogue]", e); return []; }
}

async function fetchCatalogs() {
    try {
        const res  = await fetch(`${PAYMENT_API}/api/catalogs`);
        const data = await res.json();
        return data.status === "SUCCESS" ? (data.catalogs || []) : [];
    } catch (e) { console.error("[fetchCatalogs]", e); return []; }
}

async function fetchFundingHistory() {
    try {
        const res  = await fetch(`${PAYMENT_API}/api/funding-history`);
        const data = await res.json();
        return data.status === "SUCCESS" ? (data.funding_history || []) : [];
    } catch (e) { console.error("[fetchFundingHistory]", e); return []; }
}

async function fetchOrdersHistory() {
    try {
        const res  = await fetch(`${PAYMENT_API}/api/orders-history`);
        const data = await res.json();
        return data.status === "SUCCESS" ? (data.last_transactions || []) : [];
    } catch (e) { console.error("[fetchOrdersHistory]", e); return []; }
}

// =============================================================================
// 10. INIT
// =============================================================================

document.addEventListener('DOMContentLoaded', () => {
    loadPackages();       // fetch packages from server instead of hardcoded array
    updateButtonState();

    window.addEventListener('verificationChanged', updateButtonState);

    const modal = document.getElementById('paymentModal');
    if (modal) {
        modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
    }

    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
});
