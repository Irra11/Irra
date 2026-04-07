/** 
 * SCRIPT 2: BAKONG PAYMENT & UI (CamRapidReseller Full MLBB Catalog)
 */
const PAYMENT_API = "https://charleston-meaning-reasonably-passenger.trycloudflare.com"; 
let selectedPackage = null;
let pollInterval = null;

const IMG_DIAMOND = "https://www.netonlinestores.com/_next/image?url=https%3A%2F%2Fnet-cms.minttopup.xyz%2Fuploads%2FMLBB_1_8297da66a4.png&w=828&q=75";
const IMG_WEEKLY = "https://static.saktopup.com/bundles/image_20260202_220625_55a8e44742404f8cad936ec8df7afff0.png";
const IMG_TWILIGHT = "https://i.pinimg.com/736x/d6/15/22/d6152235c3a1be7da7fcdb515be41dc0.jpg";

/**
 * FULL PRODUCT LIST (Mapped from your CamRapid Reseller List)
 */
const packages = [
    // Top Products
    { id: 283, name: "330 Diamonds", price: 4.35, skuCode: "SMU_330DM", image: IMG_DIAMOND },
    { id: 282, name: "110 Diamonds", price: 1.45, skuCode: "SMU_110DM", image: IMG_DIAMOND },
    { id: 156, name: "Weekly Pass", price: 1.40, skuCode: "SMU_Weekly", image: IMG_WEEKLY },
    { id: 155, name: "Twilight Pass", price: 8.00, skuCode: "SMU_TwilightPassBR", image: IMG_TWILIGHT },
    { id: 209, name: "Epic Monthly", price: 15.00, skuCode: "EpicMonthly", image: IMG_WEEKLY },
    { id: 208, name: "Elite Weekly", price: 5.00, skuCode: "EliteWeekly", image: IMG_WEEKLY },

    // Weekly Variations
    { id: 153, name: "5x Weekly Pass", price: 7.00, skuCode: "SMU_Weeklyx5", image: IMG_WEEKLY },
    { id: 151, name: "3x Weekly Pass", price: 4.20, skuCode: "SMU_Weeklyx3", image: IMG_WEEKLY },
    { id: 150, name: "2x Weekly Pass", price: 2.80, skuCode: "SMU_Weeklyx2", image: IMG_WEEKLY },

    // SMU Standard List
    { id: 119, name: "9288 Diamonds", price: 118.00, skuCode: "SMU_9288DM", image: IMG_DIAMOND },
    { id: 111, name: "3688 Diamonds", price: 45.50, skuCode: "SMU_3688DM", image: IMG_DIAMOND },
    { id: 107, name: "2195 Diamonds", price: 27.50, skuCode: "SMU_2195DM", image: IMG_DIAMOND },
    { id: 97,  name: "878 Diamonds", price: 11.60, skuCode: "SMU_878DM", image: IMG_DIAMOND },
    { id: 86,  name: "86 Diamonds", price: 1.25, skuCode: "SMU_86DM", image: IMG_DIAMOND },
    { id: 84,  name: "56 Diamonds", price: 0.85, skuCode: "SMU_56DM", image: IMG_DIAMOND },
    { id: 81,  name: "11 Diamonds", price: 0.20, skuCode: "SMU_11DM", image: IMG_DIAMOND },

    // Large Packs
    { id: 124, name: "13682 Diamond", price: 175.00, skuCode: "SMU_13682DM", image: IMG_DIAMOND },
    { id: 114, name: "5532 Diamond", price: 69.00, skuCode: "SMU_5532DM", image: IMG_DIAMOND },
    { id: 103, name: "1412 Diamond", price: 18.50, skuCode: "SMU_1412DM", image: IMG_DIAMOND },
    { id: 91,  name: "514 Diamond", price: 6.95, skuCode: "SMU_514DM", image: IMG_DIAMOND },
    { id: 89,  name: "344 Diamond", price: 4.65, skuCode: "SMU_344DM", image: IMG_DIAMOND }
];

function renderPackages() {
    const container = document.getElementById('packageContainer');
    if (!container) return;
    container.innerHTML = packages.map(pkg => `
        <div onclick="selectPackage(${pkg.id})" id="pkg-${pkg.id}" 
             class="bg-card border-2 border-slate-700 p-3 rounded-xl cursor-pointer package-card flex items-center space-x-3 transition-all">
            <img src="${pkg.image}" class="w-10 h-10 rounded-lg object-cover shadow-lg border border-slate-600" alt="icon">
            <div class="flex-1">
                <p class="text-blue-custom font-bold text-base leading-tight">$${pkg.price.toFixed(2)}</p>
                <p class="text-[9px] text-white/60 leading-tight uppercase font-medium mt-0.5">${pkg.name}</p>
            </div>
        </div>`).join('');
}

function selectPackage(id) {
    selectedPackage = packages.find(p => p.id === id);
    document.getElementById('displayTotal').innerText = `$${selectedPackage.price.toFixed(2)}`;
    document.getElementById('displayProduct').innerText = selectedPackage.name;
    document.querySelectorAll('.package-card').forEach(el => el.classList.remove('selected', 'border-blue-500', 'bg-blue-500/10'));
    document.getElementById(`pkg-${id}`).classList.add('selected', 'border-blue-500', 'bg-blue-500/10');
    if (typeof updateButtonState === "function") updateButtonState();
}

async function handlePayment() {
    if(!selectedPackage) return;
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
                gameId: document.getElementById('gameId').value,
                serverId: document.getElementById('serverId').value,
                skuCode: selectedPackage.skuCode,
                productName: selectedPackage.name
            })
        });
        const data = await response.json();
        if(data.status) {
            showModal(data.qrString, data.orderId, selectedPackage.price);
            startPolling(data.orderId);
        } else { alert("Error: " + data.message); }
    } catch (e) { alert("Backend Offline!"); } finally {
        btn.innerHTML = originalText;
    }
}

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
                alert("Payment Received! Delivery Error: " + (data.error || "Check Provider Balance"));
                closeModal();
            }
        } catch (e) {}
    }, 4000);
}

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
        <div class="py-10 text-center animate-in zoom-in duration-300">
            <div class="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <i class="fas fa-check text-3xl text-white"></i>
            </div>
            <h2 class="text-xl font-bold text-slate-800 mb-2 oswald uppercase tracking-widest">SUCCESS!</h2>
            <p class="text-gray-500 text-[11px] mb-6">Diamonds sent to account <b>${document.getElementById('gameId').value}</b>.</p>
            <button onclick="window.location.reload()" class="bg-blue-600 text-white px-10 py-3 rounded-2xl font-bold active:scale-95 transition-all">DONE</button>
        </div>`;
}

document.addEventListener('DOMContentLoaded', renderPackages);
