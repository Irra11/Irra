/** 
 * SCRIPT 2: BAKONG PAYMENT & UI (Integrated with Digiflazz)
 */
const PAYMENT_API = "http://localhost:5000";
let selectedPackage = null;
let pollInterval = null;

// Common Image URLs
const IMG_DIAMOND = "https://static.saktopup.com/bundles/image_20260202_221225_c5242b0c640b41968f4b95b4f31d32cd.png";
const IMG_WEEKLY = "https://static.saktopup.com/bundles/image_20260202_220625_55a8e44742404f8cad936ec8df7afff0.png";

// Updated Package List with Images
const packages = [
    { id: 1, name: "11 (10+1) Diamonds", price: 0.25, skuCode: "ml11", image: IMG_DIAMOND },
    { id: 2, name: "22 (20+2) Diamonds", price: 0.40, skuCode: "ml22", image: IMG_DIAMOND },
    { id: 3, name: "56 (50+6) Diamonds", price: 0.85, skuCode: "ml56", image: IMG_DIAMOND },
    { id: 4, name: "86 (78+8) Diamonds", price: 1.25, skuCode: "ml86", image: IMG_DIAMOND },
    { id: 5, name: "172 (156+16) Diamonds", price: 2.35, skuCode: "ml172", image: IMG_DIAMOND },
    { id: 6, name: "257 (234+23) Diamonds", price: 3.50, skuCode: "ml257", image: IMG_DIAMOND },
    { id: 7, name: "343 (312+31) Diamonds", price: 4.65, skuCode: "ml343", image: IMG_DIAMOND },
    { id: 8, name: "429 (390+39) Diamonds", price: 5.80, skuCode: "ml429", image: IMG_DIAMOND },
    { id: 9, name: "514 (468+46) Diamonds", price: 6.95, skuCode: "ml514", image: IMG_DIAMOND },
    { id: 10, name: "600 (546+54) Diamonds", price: 8.10, skuCode: "ml600", image: IMG_DIAMOND },
    { id: 11, name: "706 (625+81) Diamonds", price: 9.35, skuCode: "ml706", image: IMG_DIAMOND },
    { id: 12, name: "878 (781+97) Diamonds", price: 11.60, skuCode: "ml878", image: IMG_DIAMOND },
    { id: 13, name: "1050 (937+113) Diamonds", price: 13.95, skuCode: "ml1050", image: IMG_DIAMOND },
    { id: 14, name: "2195 (1875+320) Diamonds", price: 27.50, skuCode: "ml2195", image: IMG_DIAMOND },
    { id: 15, name: "3688 (3125+563) Diamonds", price: 45.50, skuCode: "ml3688", image: IMG_DIAMOND },
    { id: 16, name: "Weekly Diamond Pass", price: 1.75, skuCode: "ml_weekly", image: IMG_WEEKLY }
];

// 1. Render Packages (Updated to show images)
function renderPackages() {
    const container = document.getElementById('packageContainer');
    if (!container) return;
    container.innerHTML = packages.map(pkg => `
        <div onclick="selectPackage(${pkg.id})" id="pkg-${pkg.id}" 
             class="bg-card border-2 border-slate-700 p-3 rounded-xl cursor-pointer package-card flex items-center space-x-3 transition-all">
            
            <!-- Product Image -->
            <img src="${pkg.image}" class="w-10 h-10 rounded-lg object-cover shadow-lg border border-slate-600" alt="icon">
            
            <div class="flex-1">
                <p class="text-blue-custom font-bold text-base leading-tight">$${pkg.price.toFixed(2)}</p>
                <p class="text-[9px] text-white/60 leading-tight uppercase font-medium mt-0.5">${pkg.name}</p>
            </div>
        </div>`).join('');
}

// 2. Select Package Logic
function selectPackage(id) {
    selectedPackage = packages.find(p => p.id === id);
    document.getElementById('displayTotal').innerText = `$${selectedPackage.price.toFixed(2)}`;
    document.getElementById('displayProduct').innerText = selectedPackage.name;
    
    document.querySelectorAll('.package-card').forEach(el => {
        el.classList.remove('selected', 'border-blue-500', 'bg-blue-500/10');
        el.classList.add('border-slate-700');
    });
    const selectedEl = document.getElementById(`pkg-${id}`);
    selectedEl.classList.add('selected', 'border-blue-500', 'bg-blue-500/10');
    selectedEl.classList.remove('border-slate-700');
    
    updateButtonState();
}

// 3. Update Pay Button State
function updateButtonState() {
    const payBtn = document.getElementById('payBtn');
    if (selectedPackage && typeof isVerified !== 'undefined' && isVerified) {
        payBtn.disabled = false;
        payBtn.className = "bg-blue-600 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-900/40 active:scale-95";
    } else {
        payBtn.disabled = true;
        payBtn.className = "bg-slate-700 text-gray-400 px-8 py-3 rounded-xl font-bold transition-all cursor-not-allowed";
    }
}

// 4. Handle Payment
async function handlePayment() {
    if(!selectedPackage) return;
    
    const btn = document.getElementById('payBtn');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Processing...';
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
        } else { 
            alert("Error: " + data.message); 
        }
    } catch (e) { 
        alert("Server Offline. Start your main.py first!"); 
    } finally {
        btn.innerHTML = originalText;
        updateButtonState();
    }
}

// 5. Polling for Status
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
                alert("Payment OK, but Digiflazz error. Contact Admin.");
            }
        } catch (e) { 
            console.log("Checking status..."); 
        }
    }, 4000);
}

// 6. UI Functions
function showModal(qr, id, price) {
    document.getElementById('paymentModal').classList.add('modal-active');
    document.getElementById('modalAmount').innerText = `$${price.toFixed(2)}`;
    document.getElementById('modalOrderId').innerText = `#${id}`;
    
    const qrContainer = document.getElementById('qrcode');
    qrContainer.innerHTML = "";
    new QRCode(qrContainer, { 
        text: qr, 
        width: 220, 
        height: 220,
        correctLevel: QRCode.CorrectLevel.M 
    });
}

function closeModal() {
    document.getElementById('paymentModal').classList.remove('modal-active');
    if(pollInterval) clearInterval(pollInterval);
}

function showSuccessScreen() {
    const modalInner = document.querySelector('#paymentModal > div');
    modalInner.innerHTML = `
        <div class="py-10 text-center animate-pulse">
            <div class="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/50">
                <i class="fas fa-check text-4xl text-white"></i>
            </div>
            <h2 class="text-2xl font-bold text-white mb-2 oswald italic tracking-widest uppercase">Payment Success!</h2>
            <p class="text-gray-400 text-sm mb-6 px-4">Diamonds have been sent to your MLBB account.</p>
            <button onclick="window.location.reload()" class="bg-blue-600 text-white px-12 py-3 rounded-2xl font-bold shadow-lg active:scale-95">
                BACK TO SHOP
            </button>
        </div>`;
}

renderPackages();
