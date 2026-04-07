/** 
 * SCRIPT 2: BAKONG PAYMENT & UI (CamRapidReseller Full Catalog Integration)
 */

const PAYMENT_API = "https://charleston-meaning-reasonably-passenger.trycloudflare.com"; 
let selectedPackage = null;
let pollInterval = null;

// --- High Quality Image URLs ---
const IMG_DIAMOND = "https://www.netonlinestores.com/_next/image?url=https%3A%2F%2Fnet-cms.minttopup.xyz%2Fuploads%2FMLBB_1_8297da66a4.png&w=828&q=75";
const IMG_WEEKLY = "https://static.saktopup.com/bundles/image_20260202_220625_55a8e44742404f8cad936ec8df7afff0.png";
const IMG_TWILIGHT = "https://i.pinimg.com/736x/d6/15/22/d6152235c3a1be7da7fcdb515be41dc0.jpg";

/**
 * FULL PRODUCT LIST
 * Mapping: CamRapid Catalogue ID -> JS id, Code -> skuCode
 */
const packages = [
    // --- Top Sellers / Passes ---
    { id: 283, name: "330 Diamonds", price: 0.03, skuCode: "SMU_330DM", image: IMG_DIAMOND },
    { id: 282, name: "110 Diamonds", price: 0.02, skuCode: "SMU_110DM", image: IMG_DIAMOND },
    { id: 209, name: "Epic Monthly", price: 0.03, skuCode: "EpicMonthly", image: IMG_WEEKLY },
    { id: 208, name: "Elite Weekly", price: 0.02, skuCode: "EliteWeekly", image: IMG_WEEKLY },
    { id: 155, name: "Twilight Pass", price: 0.05, skuCode: "SMU_TwilightPassBR", image: IMG_TWILIGHT },
    
    // --- Weekly Pass Variations ---
    { id: 156, name: "Weekly Pass", price: 0.04, skuCode: "SMU_Weekly", image: IMG_WEEKLY },
    { id: 157, name: "Weekly Pass BR", price: 0.03, skuCode: "SMU_WeeklyBR", image: IMG_WEEKLY },
    { id: 153, name: "5x Weekly Pass", price: 0.02, skuCode: "SMU_Weeklyx5", image: IMG_WEEKLY },
    { id: 152, name: "4x Weekly Pass", price: 0.02, skuCode: "SMU_Weeklyx4", image: IMG_WEEKLY },
    { id: 151, name: "3x Weekly Pass", price: 0.02, skuCode: "SMU_Weeklyx3", image: IMG_WEEKLY },
    { id: 150, name: "2x Weekly Pass", price: 0.01, skuCode: "SMU_Weeklyx2", image: IMG_WEEKLY },
    
    // --- Combo Packs ---
    { id: 158, name: "Weekly + 257 Diamonds", price: 0.02, skuCode: "SMU_257xWeekly", image: IMG_DIAMOND },
    { id: 148, name: "Weekly + 172 Diamonds", price: 0.01, skuCode: "SMU_172xWeekly", image: IMG_DIAMOND },

    // --- Bonus Diamonds ---
    { id: 143, name: "500+500 BONUS", price: 0.02, skuCode: "SMU_500x500BONUS", image: IMG_DIAMOND },
    { id: 142, name: "250+250 BONUS", price: 0.05, skuCode: "SMU_250x250BONUS", image: IMG_DIAMOND },
    { id: 141, name: "150+150 BONUS", price: 0.03, skuCode: "SMU_150x150BONUS", image: IMG_DIAMOND },
    { id: 140, name: "50+50 BONUS", price: 0.04, skuCode: "SMU_50x50BONUS", image: IMG_DIAMOND },

    // --- Large Diamond Bulks ---
    { id: 154, name: "15526 Diamonds", price: 0.03, skuCode: "SMU_15526MLBB", image: IMG_DIAMOND },
    { id: 124, name: "13682 Diamonds", price: 0.05, skuCode: "SMU_13682DM", image: IMG_DIAMOND },
    { id: 123, name: "12189 Diamonds", price: 0.05, skuCode: "SMU_12189DM", image: IMG_DIAMOND },
    { id: 122, name: "11483 Diamonds", price: 0.05, skuCode: "SMU_11483DM", image: IMG_DIAMOND },
    { id: 121, name: "10700 Diamonds", price: 0.05, skuCode: "SMU_10700DM", image: IMG_DIAMOND },
    { id: 120, name: "10080 Diamonds", price: 0.06, skuCode: "SMU_10080DM", image: IMG_DIAMOND },
    { id: 119, name: "9288 Diamonds", price: 0.04, skuCode: "SMU_9288DM", image: IMG_DIAMOND },
    { id: 118, name: "8433 Diamonds", price: 0.03, skuCode: "SMU_8433DM", image: IMG_DIAMOND },
    { id: 117, name: "7727 Diamonds", price: 0.03, skuCode: "SMU_7727DM", image: IMG_DIAMOND },
    { id: 116, name: "6944 Diamonds", price: 0.03, skuCode: "SMU_6944DM", image: IMG_DIAMOND },
    { id: 115, name: "6238 Diamonds", price: 0.03, skuCode: "SMU_6238DM", image: IMG_DIAMOND },
    { id: 114, name: "5532 Diamonds", price: 0.03, skuCode: "SMU_5532DM", image: IMG_DIAMOND },
    { id: 113, name: "5100 Diamonds", price: 0.03, skuCode: "SMU_5100DM", image: IMG_DIAMOND },
    { id: 112, name: "4394 Diamonds", price: 0.03, skuCode: "SMU_4394DM", image: IMG_DIAMOND },
    { id: 111, name: "3688 Diamonds", price: 0.03, skuCode: "SMU_3688DM", image: IMG_DIAMOND },
    { id: 110, name: "2901 Diamonds", price: 0.02, skuCode: "SMU_2901DM", image: IMG_DIAMOND },
    { id: 109, name: "2539 Diamonds", price: 0.03, skuCode: "SMU_2539DM", image: IMG_DIAMOND },
    { id: 107, name: "2195 Diamonds", price: 0.05, skuCode: "SMU_2195DM", image: IMG_DIAMOND },
    { id: 106, name: "1928 Diamonds", price: 0.02, skuCode: "SMU_1928DM", image: IMG_DIAMOND },
    { id: 105, name: "1756 Diamonds", price: 0.02, skuCode: "SMU_1756DM", image: IMG_DIAMOND },
    { id: 104, name: "1584 Diamonds", price: 0.02, skuCode: "SMU_1584DM", image: IMG_DIAMOND },
    { id: 103, name: "1412 Diamonds", price: 0.02, skuCode: "SMU_1412DM", image: IMG_DIAMOND },
    { id: 102, name: "1222 Diamonds", price: 0.04, skuCode: "SMU_1222DM", image: IMG_DIAMOND },
    { id: 101, name: "1163 Diamonds", price: 0.03, skuCode: "SMU_1163DM", image: IMG_DIAMOND },
    { id: 100, name: "1136 Diamonds", price: 0.01, skuCode: "SMU_1136DM", image: IMG_DIAMOND },
    { id: 99,  name: "1050 Diamonds", price: 0.03, skuCode: "SMU_1050DM", image: IMG_DIAMOND },
    { id: 98,  name: "963 Diamonds", price: 0.01, skuCode: "SMU_963DM", image: IMG_DIAMOND },
    { id: 97,  name: "878 Diamonds", price: 0.01, skuCode: "SMU_878DM", image: IMG_DIAMOND },
    { id: 96,  name: "792 Diamonds", price: 0.03, skuCode: "SMU_792DM", image: IMG_DIAMOND },
    { id: 95,  name: "706 Diamonds", price: 0.04, skuCode: "SMU_706DM", image: IMG_DIAMOND },
    { id: 94,  name: "600 Diamonds", price: 0.03, skuCode: "SMU_600DM", image: IMG_DIAMOND },
    { id: 93,  name: "570 Diamonds", price: 0.03, skuCode: "SMU_570DM", image: IMG_DIAMOND },
    { id: 92,  name: "559 Diamonds", price: 0.03, skuCode: "SMU_559DM", image: IMG_DIAMOND },
    { id: 91,  name: "514 Diamonds", price: 0.04, skuCode: "SMU_514DM", image: IMG_DIAMOND },
    { id: 90,  name: "429 Diamonds", price: 0.03, skuCode: "SMU_429DM", image: IMG_DIAMOND },
    { id: 89,  name: "344 Diamonds", price: 0.03, skuCode: "SMU_344DM", image: IMG_DIAMOND },
    { id: 88,  name: "257 Diamonds", price: 0.03, skuCode: "SMU_257DM", image: IMG_DIAMOND },
    { id: 87,  name: "172 Diamonds", price: 0.02, skuCode: "SMU_172DM", image: IMG_DIAMOND },
    { id: 86,  name: "86 Diamonds", price: 0.03, skuCode: "SMU_86DM", image: IMG_DIAMOND },
    { id: 85,  name: "112 Diamonds", price: 0.03, skuCode: "SMU_112DM", image: IMG_DIAMOND },
    { id: 84,  name: "56 Diamonds", price: 0.02, skuCode: "SMU_56DM", image: IMG_DIAMOND },
    { id: 83,  name: "33 Diamonds", price: 0.01, skuCode: "SMU_33DM", image: IMG_DIAMOND },
    { id: 82,  name: "22 Diamonds", price: 0.01, skuCode: "SMU_22DM", image: IMG_DIAMOND },
    { id: 81,  name: "11 Diamonds", price: 0.01, skuCode: "SMU_11DM", image: IMG_DIAMOND }
];

// 1. Render Packages UI
function renderPackages() {
    const container = document.getElementById('packageContainer');
    if (!container) return;
    container.innerHTML = packages.map(pkg => `
        <div onclick="selectPackage(${pkg.id})" id="pkg-${pkg.id}" 
             class="bg-card border-2 border-slate-700 p-3 rounded-xl cursor-pointer package-card flex items-center space-x-3 transition-all">
            <img src="${pkg.image}" class="w-10 h-10 rounded-lg object-cover shadow-lg" alt="icon">
            <div class="flex-1">
                <p class="text-blue-custom font-bold text-base leading-tight">$${pkg.price.toFixed(2)}</p>
                <p class="text-[9px] text-white/60 leading-tight uppercase font-medium mt-0.5">${pkg.name}</p>
            </div>
        </div>`).join('');
}

// 2. Select Logic
function selectPackage(id) {
    selectedPackage = packages.find(p => p.id === id);
    document.getElementById('displayTotal').innerText = `$${selectedPackage.price.toFixed(2)}`;
    document.getElementById('displayProduct').innerText = selectedPackage.name;
    
    document.querySelectorAll('.package-card').forEach(el => {
        el.classList.remove('selected', 'border-blue-500', 'bg-blue-500/10');
        el.classList.add('border-slate-700');
    });
    const selectedEl = document.getElementById(`pkg-${id}`);
    if(selectedEl) {
        selectedEl.classList.add('selected', 'border-blue-500', 'bg-blue-500/10');
        selectedEl.classList.remove('border-slate-700');
    }
    if (typeof updateButtonState === "function") updateButtonState();
}

// 3. Update Pay Button
function updateButtonState() {
    const payBtn = document.getElementById('payBtn');
    if (!payBtn) return;
    if (selectedPackage && typeof isVerified !== 'undefined' && isVerified) {
        payBtn.disabled = false;
        payBtn.className = "bg-blue-600 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg active:scale-95";
    } else {
        payBtn.disabled = true;
        payBtn.className = "bg-slate-700 text-gray-400 px-8 py-3 rounded-xl font-bold transition-all cursor-not-allowed";
    }
}

// 4. Handle Payment Action
async function handlePayment() {
    if(!selectedPackage) return;
    const gid = document.getElementById('gameId').value;
    const sid = document.getElementById('serverId').value;
    const btn = document.getElementById('payBtn');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-circle-notch fa-spin mr-2"></i> Initializing...';
    btn.disabled = true;

    try {
        const response = await fetch(`${PAYMENT_API}/create-payment`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                amount: selectedPackage.price,
                gameId: gid,
                serverId: sid,
                skuCode: selectedPackage.skuCode,
                productName: selectedPackage.name
            })
        });
        const data = await response.json();
        if(data.status) {
            showModal(data.qrString, data.orderId, selectedPackage.price);
            startPolling(data.orderId);
        } else { alert("Error: " + data.message); }
    } catch (e) { alert("Backend Offline!"); } 
    finally { btn.innerHTML = originalText; }
}

// 5. Status Polling
function startPolling(orderId) {
    if(pollInterval) clearInterval(pollInterval);
    pollInterval = setInterval(async () => {
        try {
            const res = await fetch(`${PAYMENT_API}/check-status/${orderId}`);
            const data = await res.json();
            if(data.status === "SUCCESS") {
                clearInterval(pollInterval);
                showSuccessScreen();
            } else if (data.status === "PAID_BUT_DELIVERY_FAILED") {
                clearInterval(pollInterval);
                alert("Payment OK, but provider error. ID: #" + orderId);
                closeModal();
            }
        } catch (e) {}
    }, 4000);
}

// 6. UI Modals
function showModal(qr, id, price) {
    document.getElementById('paymentModal').classList.add('modal-active');
    document.getElementById('modalAmount').innerText = price.toFixed(2);
    document.getElementById('modalOrderId').innerText = `#${id}`;
    const qrContainer = document.getElementById('qrcode');
    qrContainer.innerHTML = "";
    new QRCode(qrContainer, { text: qr, width: 160, height: 160 });
}

function closeModal() {
    document.getElementById('paymentModal').classList.remove('modal-active');
    if(pollInterval) clearInterval(pollInterval);
}

function showSuccessScreen() {
    const modalInner = document.querySelector('#paymentModal > div');
    modalInner.innerHTML = `
        <div class="py-10 text-center animate-in zoom-in">
            <div class="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <i class="fas fa-check text-3xl text-white"></i>
            </div>
            <h2 class="text-xl font-bold text-slate-800 mb-2 oswald uppercase tracking-widest">SUCCESS!</h2>
            <p class="text-gray-500 text-[11px] mb-6 px-4">Diamonds added to account: <b>${document.getElementById('gameId').value}</b></p>
            <button onclick="window.location.reload()" class="bg-blue-600 text-white px-10 py-3 rounded-2xl font-bold active:scale-95 transition-all">DONE</button>
        </div>`;
}

document.addEventListener('DOMContentLoaded', renderPackages);
