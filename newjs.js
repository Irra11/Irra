// Global variables
let selectedProduct = null;
let totalAmount = 0;
const API_URL = 'https://adminpanel-1-m4ok.onrender.com'; // Python Backend

document.addEventListener('DOMContentLoaded', function() {
    // --- 1. SETUP FOOTER DISPLAY ---
    setupFooterLayout();

    // --- 2. INITIALIZATION ---
    const gmailInput = document.getElementById('gmail_address');
    const checkoutButton = document.getElementById('checkout_button');
    
    // Disable button initially
    if (checkoutButton) checkoutButton.disabled = true;

    // --- 3. EVENT LISTENERS ---
    
    // Gmail Input Listener (Updates footer in real-time)
    if (gmailInput) {
        gmailInput.addEventListener('input', function() {
            validateGmail();
            updateFooterUI(); // Update footer when typing
        });
    }

    // Search Button Logic
    const searchButton = document.querySelector('.action-btn .fa-search');
    if (searchButton) {
        searchButton.closest('button').addEventListener('click', createSearchOverlay);
    }

    // Mobile Menu
    setupMobileMenu();

    // Setup Product Clicks
    setupProductClickListeners();
});

// --- FUNCTION: Setup Footer HTML Structure ---
function setupFooterLayout() {
    const checkoutBarInfo = document.querySelector('.checkout-bar > div:first-child');
    
    // Replace default text with a structured layout
    if (checkoutBarInfo) {
        checkoutBarInfo.className = 'footer-info-container';
        checkoutBarInfo.innerHTML = `
            <div class="footer-row-top">
                <i class="fas fa-envelope-open-text"></i> 
                <span id="footer-gmail">Enter your Gmail...</span>
            </div>
            <div class="footer-row-bottom">
                <span id="footer-skin">Select a skin</span>
                <span class="footer-divider">•</span>
                <span id="footer-price">$0.00</span>
            </div>
        `;
    }
}

// --- FUNCTION: Update Footer Content ---
function updateFooterUI() {
    const gmailInput = document.getElementById('gmail_address');
    const footerGmail = document.getElementById('footer-gmail');
    const footerSkin = document.getElementById('footer-skin');
    const footerPrice = document.getElementById('footer-price');

    // 1. Update Gmail
    const emailValue = gmailInput.value.trim();
    if (emailValue) {
        footerGmail.textContent = emailValue;
        footerGmail.style.color = "#333";
    } else {
        footerGmail.textContent = "Enter your Gmail...";
        footerGmail.style.color = "#888";
    }

    // 2. Update Product & Price
    if (selectedProduct) {
        footerSkin.textContent = selectedProduct.name;
        footerSkin.style.color = "#333";
        footerPrice.textContent = `$${totalAmount.toFixed(2)}`;
        footerPrice.classList.add('price-active');
    } else {
        footerSkin.textContent = "Select a skin";
        footerSkin.style.color = "#888";
        footerPrice.textContent = "$0.00";
        footerPrice.classList.remove('price-active');
    }
}

// --- FUNCTION: Validate Gmail & Enable Button ---
function validateGmail() {
    const gmailInput = document.getElementById('gmail_address');
    const userFoundDiv = document.getElementById('user_found');
    const email = gmailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let isValid = false;

    if (email === '') {
        renderAlert(false, 'សូមបញ្ចូល Gmail របស់អ្នក');
    } else if (!emailRegex.test(email)) {
        renderAlert(false, 'Gmail មិនត្រឹមត្រូវ (ex: name@gmail.com)');
    } else {
        renderAlert(true, 'បានបញ្ចូល Gmail ត្រឹមត្រូវ!');
        isValid = true;
    }
    updateCheckoutButtonState(isValid);
}

function renderAlert(isValid, msg) {
    const userFoundDiv = document.getElementById('user_found');
    const gmailInput = document.getElementById('gmail_address');
    
    if (isValid) {
        gmailInput.classList.remove('is-invalid');
        gmailInput.classList.add('is-valid');
        userFoundDiv.innerHTML = `<div class="alert alert-success mt-2 py-2"><small><i class="fas fa-check-circle"></i> ${msg}</small></div>`;
    } else {
        gmailInput.classList.remove('is-valid');
        if(gmailInput.value.length > 0) gmailInput.classList.add('is-invalid');
        userFoundDiv.innerHTML = ''; // Don't show error immediately to keep UI clean, show only success or nothing
    }
}

// --- FUNCTION: Product Selection ---
function setupProductClickListeners() {
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        // Clone to remove old listeners
        const newCard = card.cloneNode(true);
        card.parentNode.replaceChild(newCard, card);
        
        newCard.addEventListener('click', function() {
            // UI Selection
            document.querySelectorAll('.product-card').forEach(c => c.classList.remove('selected'));
            this.classList.add('selected');

            // Data Update
            const name = this.querySelector('.product-name').textContent;
            const priceStr = this.querySelector('.product-price').textContent;
            const price = parseFloat(priceStr.replace('$', ''));

            selectedProduct = { name, price };
            totalAmount = price;

            // Trigger Footer Update
            updateFooterUI();
            
            // Re-validate button state
            const gmailInput = document.getElementById('gmail_address');
            const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(gmailInput.value.trim());
            updateCheckoutButtonState(isEmailValid);
        });
    });
}

function updateCheckoutButtonState(isEmailValid) {
    const checkoutButton = document.getElementById('checkout_button');
    const checkBtn = document.getElementById('check_btn');
    const isTermsChecked = checkBtn ? checkBtn.checked : true;

    // Button enabled ONLY if: Email Valid AND Product Selected AND Terms Checked
    checkoutButton.disabled = !(isEmailValid && selectedProduct !== null && isTermsChecked);
}

// --- FUNCTION: Create Order (Pay Now) ---
window.createPreOrder = function() {
    const gmail = document.getElementById('gmail_address').value.trim();
    const btn = document.getElementById('checkout_button');

    if (!selectedProduct || !gmail) return;

    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';

    fetch(`${API_URL}/api/save-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            gmailAddress: gmail,
            product: selectedProduct,
            totalAmount: totalAmount
        })
    })
    .then(res => {
        if (res.ok) {
            // Optional: Send Telegram
            sendTelegramBackup(gmail, selectedProduct.name, totalAmount);
            setTimeout(() => processPaymentRedirect(totalAmount), 1000);
        } else {
            alert("Connection Error. Redirecting to payment...");
            processPaymentRedirect(totalAmount);
        }
    })
    .catch(err => {
        console.error(err);
        processPaymentRedirect(totalAmount);
    });
};
let paymentTimerInterval; 

function processPaymentRedirect(amount) {
    let qrImageSource = '';
    
    // 1. DETERMINE IMAGE BASED ON AMOUNT
    if (amount === 1) {
        qrImageSource = '1.png';
    } else if (amount === 3) {
        qrImageSource = '3.png'; 
    } else if (amount === 5) {
        qrImageSource = '5$.png'; 
    } else {
        qrImageSource = 'photo/1.5$.jpg'; 
    }

    // 2. REMOVE EXISTING MODAL
    const existingModal = document.getElementById('payment-modal');
    if (existingModal) {
        existingModal.remove();
        clearInterval(paymentTimerInterval); 
    }

    // 3. CREATE MODAL HTML
    const modal = document.createElement('div');
    modal.id = 'payment-modal';
    modal.className = 'payment-overlay animate__animated animate__fadeIn';
    
    modal.innerHTML = `
        <div class="payment-box animate__animated animate__zoomIn">
            <div class="payment-header">
                <button class="close-btn-icon" onclick="closePaymentModal()"><i class="fas fa-times"></i></button>
                <h3>Scan to Pay</h3>
                <div class="amount-badge">$${amount.toFixed(2)}</div>
            </div>
            
            <div class="payment-body">
                <div class="qr-container">
                    <img src="${qrImageSource}" alt="Payment QR" class="qr-image" 
                         onerror="this.src='https://via.placeholder.com/250x250?text=QR+Not+Found'">
                </div>
                
                <!-- NEW CAPTION ADDED HERE -->
                <p style="margin-top: 15px; margin-bottom: 5px; font-size: 13px; color: #666; line-height: 1.4;">
                    សូមស្កេន QR Code ជាមួយកម្មវិធីធនាគាររបស់អ្នកដើម្បីទូទាត់ប្រាក់។
                </p>

             
            <div class="payment-footer">
                <!-- CLICKING THIS SHOWS THE KHMER ALERT -->
                <button class="btn-paid" onclick="showReceivedState()">
                  ខ្ញុំបានបង់ប្រាក់ហេីយ <i class="fas fa-check-circle"></i>
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // 4. START 3-MINUTE TIMER
    startPaymentTimer(180); 
}

// --- NEW FUNCTION: SHOW RECEIVED ALERT (KHMER) ---
function showReceivedState() {
    // 1. Stop Timer
    clearInterval(paymentTimerInterval);

    // 2. Get the Modal Box
    const paymentBox = document.querySelector('.payment-box');
    
    // 3. Replace Content with the Icon and Text you requested
    paymentBox.innerHTML = `
        <div style="padding: 40px 20px; text-align: center;">
            <div class="animate__animated animate__bounceIn">
                <i class="fas fa-clock" style="font-size:60px; color:#f39c12; margin-bottom:20px;"></i>
            </div>
            
            <h3 style="color:#333; margin-bottom:15px; font-weight:bold; font-family: 'Poppins', sans-serif;">
                សំណើត្រូវបានទទួល (Received)
            </h3>
            
            <p style="color:#666; font-size:14px; line-height:1.6; font-family: 'Poppins', sans-serif;">
                សូមរង់ចាំ Admin ត្រួតពិនិត្យការបង់ប្រាក់។<br>
                Script នឹងផ្ញើទៅអ៊ីមែលរបស់អ្នកឆាប់ៗនេះ។
            </p>
            
            <button onclick="closePaymentModal()" 
                style="margin-top:25px; padding:12px 40px; border:none; background:#f39c12; color:white; border-radius:50px; cursor:pointer; font-weight:bold; font-size:16px; box-shadow: 0 4px 15px rgba(243, 156, 18, 0.4);">
                OK
            </button>
        </div>
    `;
}


// Helper to close modal
function closePaymentModal() {
    clearInterval(paymentTimerInterval);
    const modal = document.getElementById('payment-modal');
    if (modal) {
        modal.classList.remove('animate__fadeIn');
        modal.classList.add('animate__fadeOut');
        setTimeout(() => modal.remove(), 300);
        
        const btn = document.getElementById('checkout_button');
        if(btn) {
            btn.disabled = false;
            btn.innerHTML = 'Pay Now';
        }
    }
}

// --- CLOSE MODAL ---
function closePaymentModal() {
    clearInterval(paymentTimerInterval);
    const modal = document.getElementById('payment-modal');
    if (modal) {
        modal.classList.remove('animate__fadeIn');
        modal.classList.add('animate__fadeOut');
        setTimeout(() => modal.remove(), 300);
        
        const btn = document.getElementById('checkout_button');
        if(btn) {
            btn.disabled = false;
            btn.innerHTML = 'Pay Now';
        }
    }
}
// Helper to close modal
function closePaymentModal() {
    const modal = document.getElementById('payment-modal');
    if (modal) {
        modal.classList.remove('animate__fadeIn');
        modal.classList.add('animate__fadeOut');
        setTimeout(() => modal.remove(), 300);
        
        // Re-enable button
        const btn = document.getElementById('checkout_button');
        if(btn) {
            btn.disabled = false;
            btn.innerHTML = 'Pay Now';
        }
    }
}

// --- FUNCTION: Search & Mobile Menu ---
function setupMobileMenu() {
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('navMenu');
    if (mobileToggle) {
        mobileToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            navMenu.classList.toggle('active');
            mobileToggle.querySelector('i').className = navMenu.classList.contains('active') ? 'fas fa-times' : 'fas fa-bars';
        });
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
                navMenu.classList.remove('active');
                mobileToggle.querySelector('i').className = 'fas fa-bars';
            }
        });
    }
}

function createSearchOverlay() {
    // Check existing
    if (document.querySelector('.search-overlay')) return;
    
    const overlay = document.createElement('div');
    overlay.className = 'search-overlay animate__animated animate__fadeIn';
    overlay.innerHTML = `
        <div class="search-container">
            <div class="search-box-wrapper">
                <i class="fas fa-search search-icon"></i>
                <input type="text" id="search-input" placeholder="Find skin..." autocomplete="off">
                <button onclick="this.closest('.search-overlay').remove()" class="close-search"><i class="fas fa-times"></i></button>
            </div>
            <div id="search-results-container"></div>
        </div>`;
    document.body.appendChild(overlay);
    
    const input = document.getElementById('search-input');
    input.focus();
    
    input.addEventListener('input', function() {
        const query = this.value.toLowerCase().trim();
        const container = document.getElementById('search-results-container');
        container.innerHTML = '';
        if(!query) return;

        document.querySelectorAll('.product-card').forEach(card => {
            const name = card.querySelector('.product-name').textContent;
            const img = card.querySelector('.product-img').src;
            const price = card.querySelector('.product-price').textContent;
            
            if(name.toLowerCase().includes(query)) {
                const item = document.createElement('div');
                item.className = 'search-result-item';
                item.innerHTML = `<img src="${img}"><div><div class="result-name">${name}</div><div class="result-price">${price}</div></div>`;
                item.onclick = () => {
                    overlay.remove();
                    card.scrollIntoView({behavior:'smooth', block:'center'});
                    card.click();
                };
                container.appendChild(item);
            }
        });
    });
}

// --- 4. CSS FOR FOOTER (Sticky & Styled) ---
const style = document.createElement('style');
style.textContent = `
    /* Checkout Bar Styles */
    .checkout-bar {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(10px);
        box-shadow: 0 -5px 20px rgba(0,0,0,0.1);
        padding: 12px 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        z-index: 1000;
        border-top: 1px solid rgba(0,0,0,0.05);
    }

    .footer-info-container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        font-family: 'Poppins', sans-serif;
    }

    .footer-row-top {
        font-size: 11px;
        color: #666;
        margin-bottom: 2px;
        display: flex;
        align-items: center;
        gap: 5px;
    }

    .footer-row-top i {
        color: #2979ff;
    }

    .footer-row-bottom {
        font-size: 14px;
        font-weight: 500;
        color: #333;
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .footer-divider {
        color: #ccc;
        font-size: 8px;
    }

    #footer-skin {
        max-width: 150px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    #footer-price {
        font-weight: 700;
        color: #888;
        transition: color 0.3s ease;
    }

    #footer-price.price-active {
        color: #2979ff;
        font-size: 16px;
    }

    /* Button Style override */
    #checkout_button {
        padding: 10px 25px;
        border-radius: 50px;
        font-weight: 600;
        box-shadow: 0 4px 15px rgba(41, 121, 255, 0.3);
        transition: all 0.3s ease;
    }
    
    #checkout_button:disabled {
        background: #ccc;
        box-shadow: none;
        cursor: not-allowed;
    }

    /* Search Styles (Included here for completeness) */
    .search-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); z-index: 9999; display: flex; justify-content: center; padding-top: 80px; }
    .search-container { width: 90%; max-width: 500px; }
    .search-box-wrapper { display: flex; align-items: center; background: white; border-radius: 12px; padding: 12px; }
    #search-input { flex: 1; border: none; outline: none; margin: 0 10px; font-size: 16px; }
    .search-result-item { display: flex; align-items: center; background: rgba(255,255,255,0.9); padding: 10px; margin-top: 8px; border-radius: 8px; cursor: pointer; }
    .search-result-item img { width: 40px; height: 40px; border-radius: 5px; margin-right: 10px; }
    .result-name { font-weight: 600; font-size: 14px; }
    .result-price { color: #2979ff; font-weight: bold; font-size: 12px; }
`;
document.head.appendChild(style);
