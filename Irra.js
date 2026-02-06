// Global variables to track state
let selectedProduct = null;
let totalAmount = 0;
const API_URL = 'https://adminpanel-jtf9.onrender.com'; // Your Python Backend URL

document.addEventListener('DOMContentLoaded', function() {
    // --- 1. INITIALIZATION ---
    const gmailInput = document.getElementById('gmail_address');
    const checkoutButton = document.getElementById('checkout_button');
    const searchButton = document.querySelector('.action-btn .fa-search'); // Search Icon in Header

    // Disable checkout initially
    if (checkoutButton) checkoutButton.disabled = true;

    // Initialize Checkout Bar
    updateCheckoutBar();

    // --- 2. SEARCH FUNCTIONALITY (NEW) ---
    if (searchButton) {
        // Find the parent button of the icon and add click event
        searchButton.closest('button').addEventListener('click', createSearchOverlay);
    }

    // --- 3. GMAIL VALIDATION ---
    if (gmailInput) {
        gmailInput.addEventListener('input', function() {
            validateGmail();
        });
        
        gmailInput.addEventListener('blur', function() {
            validateGmail();
        });
    }

    // --- 4. PRODUCT SELECTION ---
    setupProductClickListeners();

    // --- 5. MOBILE MENU ---
    setupMobileMenu();
});

// --- FUNCTION: Create Search Overlay ---
function createSearchOverlay() {
    // Check if overlay already exists
    if (document.querySelector('.search-overlay')) return;

    // Create Overlay HTML
    const overlay = document.createElement('div');
    overlay.className = 'search-overlay animate__animated animate__fadeIn';
    overlay.innerHTML = `
        <div class="search-container">
            <div class="search-box-wrapper">
                <i class="fas fa-search search-icon"></i>
                <input type="text" id="search-input" placeholder="Search for skins (e.g., Fanny, Chou)..." autocomplete="off">
                <button class="close-search"><i class="fas fa-times"></i></button>
            </div>
            <div id="search-results-container"></div>
        </div>
    `;

    document.body.appendChild(overlay);
    
    const input = document.getElementById('search-input');
    const closeBtn = overlay.querySelector('.close-search');
    const resultsContainer = document.getElementById('search-results-container');

    // Focus input immediately
    input.focus();

    // Close Events
    closeBtn.addEventListener('click', () => closeSearch(overlay));
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeSearch(overlay);
    });

    // Search Logic
    input.addEventListener('input', function() {
        const query = this.value.toLowerCase().trim();
        resultsContainer.innerHTML = ''; // Clear previous results

        if (query.length === 0) return;

        // Get all products from the DOM
        const allProducts = document.querySelectorAll('.product-card');
        let matchCount = 0;

        allProducts.forEach(card => {
            const productName = card.querySelector('.product-name').textContent;
            const productPrice = card.querySelector('.product-price').textContent;
            const productImg = card.querySelector('.product-img').src;

            // Check if name matches query
            if (productName.toLowerCase().includes(query)) {
                matchCount++;
                
                // Create Result Item
                const resultItem = document.createElement('div');
                resultItem.className = 'search-result-item';
                resultItem.innerHTML = `
                    <img src="${productImg}" alt="${productName}">
                    <div class="result-info">
                        <div class="result-name">${highlightMatch(productName, query)}</div>
                        <div class="result-price">${productPrice}</div>
                    </div>
                `;

                // Click to Select
                resultItem.addEventListener('click', () => {
                    closeSearch(overlay);
                    // Scroll to product
                    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    // Trigger click on actual card
                    card.click();
                    // Add temporary highlight effect
                    card.style.border = "3px solid #2979ff";
                    setTimeout(() => card.style.border = "", 2000);
                });

                resultsContainer.appendChild(resultItem);
            }
        });

        if (matchCount === 0) {
            resultsContainer.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-box-open"></i>
                    <p>No skins found for "${query}"</p>
                </div>`;
        }
    });
}

function closeSearch(overlay) {
    overlay.classList.remove('animate__fadeIn');
    overlay.classList.add('animate__fadeOut');
    setTimeout(() => overlay.remove(), 300);
}

function highlightMatch(text, query) {
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<span class="highlight">$1</span>');
}

// --- FUNCTION: Validate Gmail ---
function validateGmail() {
    const gmailInput = document.getElementById('gmail_address');
    const userFoundDiv = document.getElementById('user_found');
    const email = gmailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email === '') {
        setUserFoundStatus(false, 'សូមបញ្ចូល Gmail របស់អ្នក');
    } else if (!emailRegex.test(email)) {
        setUserFoundStatus(false, 'Gmail មិនត្រឹមត្រូវ (ex: name@gmail.com)');
    } else {
        setUserFoundStatus(true, 'បានបញ្ចូល Gmail ត្រឹមត្រូវ!');
    }
    updateCheckoutButtonState();
    updateCheckoutBar();
}

function setUserFoundStatus(isValid, message) {
    const gmailInput = document.getElementById('gmail_address');
    const userFoundDiv = document.getElementById('user_found');

    if (isValid) {
        gmailInput.classList.remove('is-invalid');
        gmailInput.classList.add('is-valid');
        userFoundDiv.innerHTML = `<div class="alert alert-success mt-3"><i class="fas fa-check-circle"></i> ${message}</div>`;
    } else {
        gmailInput.classList.remove('is-valid');
        gmailInput.classList.add('is-invalid');
        userFoundDiv.innerHTML = `<div class="alert alert-danger mt-3"><i class="fas fa-times-circle"></i> ${message}</div>`;
    }
}

// --- FUNCTION: Setup Product Clicks ---
function setupProductClickListeners() {
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        // Remove old listeners to prevent duplicates if function called twice
        const newCard = card.cloneNode(true);
        card.parentNode.replaceChild(newCard, card);
        
        newCard.addEventListener('click', function() {
            // Deselect others
            document.querySelectorAll('.product-card').forEach(c => c.classList.remove('selected'));
            
            // Select this one
            this.classList.add('selected');

            const name = this.querySelector('.product-name').textContent;
            const priceStr = this.querySelector('.product-price').textContent;
            const price = parseFloat(priceStr.replace('$', ''));

            selectedProduct = { name, price };
            totalAmount = price;

            updateCheckoutBar();
            updateCheckoutButtonState();
        });
    });
}

// --- FUNCTION: Update UI Elements ---
function updateCheckoutBar() {
    const gmailVal = document.getElementById('gmail_address') ? document.getElementById('gmail_address').value : '';
    
    // Update labels in the bottom bar
    const labels = document.querySelectorAll('.checkout-value');
    if(labels.length >= 3) {
        document.querySelector('.gmail-address').textContent = gmailVal || '-';
        document.querySelector('.product-name').textContent = selectedProduct ? selectedProduct.name : '-';
        document.querySelector('.price-amount').textContent = `$${totalAmount.toFixed(2)}`;
    }
}

function updateCheckoutButtonState() {
    const gmailInput = document.getElementById('gmail_address');
    const checkoutButton = document.getElementById('checkout_button');
    const checkBtn = document.getElementById('check_btn'); // Terms checkbox

    const isEmailValid = gmailInput.classList.contains('is-valid');
    const isProductSelected = selectedProduct !== null;
    const isTermsChecked = checkBtn ? checkBtn.checked : true;

    checkoutButton.disabled = !(isEmailValid && isProductSelected && isTermsChecked);
}

// --- FUNCTION: Process Payment (Backend + Telegram) ---
window.createPreOrder = function() {
    const gmail = document.getElementById('gmail_address').value.trim();
    const btn = document.getElementById('checkout_button');

    // 1. Double check validation
    if (!selectedProduct || !gmail) return;

    // 2. Disable button
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';

    // 3. Send to Python Backend
    fetch(`${API_URL}/api/save-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            gmailAddress: gmail,
            product: selectedProduct,
            totalAmount: totalAmount
        })
    })
    .then(response => {
        if (response.ok) {
            // 4. Send Notification to Telegram (Client Side backup)
            sendTelegramNotification(gmail, selectedProduct.name, totalAmount);
            
            // 5. Redirect to Payment
            setTimeout(() => {
                processPaymentRedirect(totalAmount);
            }, 1000);
        } else {
            throw new Error('Backend save failed');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert("System connection error. Redirecting to payment anyway...");
        processPaymentRedirect(totalAmount);
    });
};

function sendTelegramNotification(email, skinName, amount) {
    const botToken = '7950204890:AAHXGCh_WliNYd2TlnCScO_92EL0_QBkX7Y'; 
    const chatId = '5007619095'; 
    const text = `🛒 *New Order*\n\n📧: ${email}\n🎮: ${skinName}\n💵: $${amount.toFixed(2)}\n⏰: ${new Date().toLocaleString()}`;

    fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text: text, parse_mode: 'Markdown' })
    }).catch(err => console.log("Telegram Error ignored"));
}

function processPaymentRedirect(amount) {
    if (amount === 1) location.href = 'https://pay.ababank.com/oRF8/oq1z33v6';
    else if (amount === 4) location.href = 'https://pay.ababank.com/oRF8/irqyoyp2';
    else if (amount === 5) location.href = '2.7$.html';
    else location.href = '1.5$.html';
}

// --- FUNCTION: Mobile Menu ---
function setupMobileMenu() {
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('navMenu');
    
    if (mobileToggle) {
        mobileToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            navMenu.classList.toggle('active');
            const icon = mobileToggle.querySelector('i');
            icon.className = navMenu.classList.contains('active') ? 'fas fa-times' : 'fas fa-bars';
        });

        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
                navMenu.classList.remove('active');
                mobileToggle.querySelector('i').className = 'fas fa-bars';
            }
        });
    }
}

// --- CSS INJECTION FOR SEARCH ---
const style = document.createElement('style');
style.textContent = `
    /* Search Overlay */
    .search-overlay {
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0,0,0,0.85); z-index: 9999;
        display: flex; justify-content: center; align-items: flex-start;
        padding-top: 80px; backdrop-filter: blur(5px);
    }
    .search-container {
        width: 90%; max-width: 600px;
        background: transparent;
    }
    .search-box-wrapper {
        display: flex; align-items: center;
        background: white; border-radius: 12px;
        padding: 10px 15px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    }
    .search-icon { color: #666; font-size: 18px; margin-right: 10px; }
    #search-input {
        flex: 1; border: none; outline: none;
        font-size: 16px; padding: 5px;
    }
    .close-search {
        background: none; border: none; font-size: 20px;
        color: #999; cursor: pointer; transition: 0.3s;
    }
    .close-search:hover { color: #333; }

    /* Search Results */
    #search-results-container {
        margin-top: 15px; max-height: 60vh; overflow-y: auto;
        border-radius: 12px;
    }
    .search-result-item {
        display: flex; align-items: center;
        background: rgba(255, 255, 255, 0.95);
        padding: 10px; margin-bottom: 8px;
        border-radius: 10px; cursor: pointer;
        transition: transform 0.2s;
    }
    .search-result-item:hover { transform: scale(1.02); background: white; }
    .search-result-item img {
        width: 50px; height: 50px; border-radius: 8px; object-fit: cover;
        margin-right: 15px; border: 1px solid #eee;
    }
    .result-info { flex: 1; display: flex; justify-content: space-between; align-items: center; }
    .result-name { font-weight: 600; color: #333; }
    .result-price { 
        color: #2979ff; font-weight: bold; 
        background: rgba(41, 121, 255, 0.1); 
        padding: 4px 8px; border-radius: 6px; 
    }
    .highlight { background-color: #ffe082; color: #000; padding: 0 2px; border-radius: 2px; }
    .no-results {
        text-align: center; color: white; margin-top: 30px;
    }
    .no-results i { font-size: 40px; margin-bottom: 10px; opacity: 0.7; }
`;
document.head.appendChild(style);
