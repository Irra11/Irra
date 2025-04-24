 // Wait for the DOM to be fully loaded
 document.addEventListener('DOMContentLoaded', function() {
    // Get the telegram username input field
    const telegramInput = document.getElementById('telegram_username');
    const userFoundDiv = document.getElementById('user_found');
    const checkoutButton = document.getElementById('checkout_button');
    
    // Initially disable the checkout button
    checkoutButton.disabled = true;
    
    // Add event listener for input changes
    telegramInput.addEventListener('input', function() {
        validateTelegramUsername();
    });
    
    // Add event listener for blur (when user clicks away)
    telegramInput.addEventListener('blur', function() {
        if (telegramInput.value.trim() !== '') {
            validateTelegramUsername();
        }
    });
    
    // Function to validate the telegram username
    function validateTelegramUsername() {
        const username = telegramInput.value.trim();
        
        // Reset the user found message
        userFoundDiv.innerHTML = '';
        
        // Basic validation - username must start with @ and contain at least 5 characters
        if (username === '') {
            setInvalidState('Please enter your Telegram username');
            return;
        }
        
        // Check if username starts with @
        if (!username.startsWith('@')) {
            setInvalidState('Username must start with @');
            return;
        }
        
        // Check if username has enough characters (@ + at least 4 more)
        if (username.length < 5) {
            setInvalidState('Username must be at least 5 characters including @');
            return;
        }
        
        // Check if username only contains valid characters (letters, numbers, underscores)
        const validUsernameRegex = /^@[a-zA-Z0-9_]+$/;
        if (!validUsernameRegex.test(username)) {
            setInvalidState('Username can only contain letters, numbers, and underscores');
            return;
        }
        
        // If all validations pass, show success message
        setValidState();
    }
    
    // Function to display validation error
    function setInvalidState(message) {
        telegramInput.classList.add('is-invalid');
        telegramInput.classList.remove('is-valid');
        
        userFoundDiv.innerHTML = `
            <div class="alert alert-danger mt-3">
                <i class="fas fa-times-circle"></i> ${message}
            </div>
        `;
        
        // Disable checkout button
        checkoutButton.disabled = true;
    }
    
    // Function to display success state
    function setValidState() {
        telegramInput.classList.remove('is-invalid');
        telegramInput.classList.add('is-valid');
        
        userFoundDiv.innerHTML = `
            <div class="alert alert-success mt-3">
                <i class="fas fa-check-circle"></i> Valid Telegram username entered!
            </div>
        `;
        
        // Enable checkout button
        checkoutButton.disabled = false;
    }
});

// Update the createPreOrder function to include telegram username validation
function createPreOrder() {
    const telegramUsername = document.getElementById('telegram_username').value.trim();
    
    // Check if username is valid before proceeding
    if (!telegramUsername || telegramUsername.length < 5 || !telegramUsername.startsWith('@')) {
        alert('Please enter a valid Telegram username before proceeding.');
        return;
    }
    
    // Store the username in session storage for later use
    sessionStorage.setItem('telegramUsername', telegramUsername);
    
    // Continue with your existing order creation logic
    // This is a placeholder - you would replace this with your actual order creation code
    alert(`Creating order for Telegram user: ${telegramUsername}`);
    
    // Here you would typically:
    // 1. Collect selected product info
    // 2. Calculate total price
    // 3. Submit the form or make an API call to process the payment
}






// Global variables to track selection state
let selectedProduct = null;
let totalAmount = 0;
let telegramUsername = '';

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Get the telegram username input field and add event listener
    const telegramInput = document.getElementById('telegram_username');
    const userFoundDiv = document.getElementById('user_found');
    const checkoutButton = document.getElementById('checkout_button');
    const productNameElement = document.getElementById('product_name');
    const priceAmountElement = document.querySelector('.price-amount');
    
    // Initially disable the checkout button
    checkoutButton.disabled = true;
    
    // Modify the checkout bar structure to add labels
    const checkoutBarInfo = document.querySelector('.checkout-bar > div');
    checkoutBarInfo.innerHTML = `
    <div class="checkout-info-item">
        <span class="checkout-label">Telegram:</span>
        <span class="checkout-value telegram-username">-</span>
    </div>
    <div class="checkout-info-item">
        <span class="checkout-label">Skin:</span>
        <span class="checkout-value product-name">-</span>
    </div>
    <div class="checkout-info-item">
        <span class="checkout-label">Total:</span>
        <span class="checkout-value price-amount">$0.00</span>
    </div>
`;

    
    // Add event listener for telegram username input
    telegramInput.addEventListener('input', function() {
        validateTelegramUsername();
        updateCheckoutBar();
    });
    
    // Add event listener for blur (when user clicks away)
    telegramInput.addEventListener('blur', function() {
        if (telegramInput.value.trim() !== '') {
            validateTelegramUsername();
            updateCheckoutBar();
        }
    });
    
    // Find all product cards and add click event listeners
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        card.addEventListener('click', function() {
            // Get product information from the clicked card
            const productImg = this.querySelector('.product-img').getAttribute('src');
            const productPrice = this.querySelector('.product-price').textContent;
            const productName = this.querySelector('.product-name').textContent;
            
            // Handle product selection
            handleProductSelection(this, {
                id: this.id,
                name: productName,
                price: parseFloat(productPrice.replace('$', '')),
                img: productImg
            });
        });
    });
    
    // Function to validate the telegram username
    function validateTelegramUsername() {
        const username = telegramInput.value.trim();
        
        // Reset the user found message
        userFoundDiv.innerHTML = '';
        
        // Basic validation - username must start with @ and contain at least 5 characters
        if (username === '') {
            setInvalidState('Please enter your Telegram username');
            return false;
        }
        
        // Check if username starts with @
        if (!username.startsWith('@')) {
            setInvalidState('Username must start with @');
            return false;
        }
        
        // Check if username has enough characters (@ + at least 4 more)
        if (username.length < 5) {
            setInvalidState('Username must be at least 5 characters including @');
            return false;
        }
        
        // Check if username only contains valid characters (letters, numbers, underscores)
        const validUsernameRegex = /^@[a-zA-Z0-9_]+$/;
        if (!validUsernameRegex.test(username)) {
            setInvalidState('Username can only contain letters, numbers, and underscores');
            return false;
        }
        
        // If all validations pass, show success message
        setValidState();
        telegramUsername = username;
        return true;
    }
    
    // Function to display validation error
    function setInvalidState(message) {
        telegramInput.classList.add('is-invalid');
        telegramInput.classList.remove('is-valid');
        
        userFoundDiv.innerHTML = `
            <div class="alert alert-danger mt-3">
                <i class="fas fa-times-circle"></i> ${message}
            </div>
        `;
        
        // Disable checkout button
        checkoutButton.disabled = true;
    }
    
    // Function to display success state
    function setValidState() {
        telegramInput.classList.remove('is-invalid');
        telegramInput.classList.add('is-valid');
        
        userFoundDiv.innerHTML = `
            <div class="alert alert-success mt-3">
                <i class="fas fa-check-circle"></i> Valid Telegram username entered!
            </div>
        `;
        
        // Enable checkout button if there is a selected product
        checkoutButton.disabled = selectedProduct === null;
    }
});

// Function to handle product selection
function handleProductSelection(cardElement, product) {
    // Remove selection from all product cards
    const allProductCards = document.querySelectorAll('.product-card');
    allProductCards.forEach(card => {
        card.classList.remove('selected');
    });
    
    // If clicking on the same product, toggle selection
    if (selectedProduct && selectedProduct.id === product.id && selectedProduct.name === product.name) {
        selectedProduct = null;
    } else {
        // Select the new product
        selectedProduct = product;
        cardElement.classList.add('selected');
    }
    
    // Update the checkout bar with new selection
    updateCheckoutBar();
    
    // Update checkout button state
    const telegramInput = document.getElementById('telegram_username');
    const checkoutButton = document.getElementById('checkout_button');
    checkoutButton.disabled = !(telegramInput.classList.contains('is-valid') && selectedProduct !== null);
}

// Function to update the checkout bar content
function updateCheckoutBar() {
    const telegramUsernameElement = document.querySelector('.checkout-value.telegram-username');
    const productNameElement = document.querySelector('.checkout-value.product-name');
    const priceAmountElement = document.querySelector('.checkout-value.price-amount');
    const username = document.getElementById('telegram_username').value.trim();
    
    // Update telegram username
    telegramUsernameElement.textContent = username || '-';
    
    // Update product info and price
    if (selectedProduct === null) {
        productNameElement.textContent = '-';
        totalAmount = 0;
        priceAmountElement.textContent = '$0.00';
    } else {
        // Display product name
        productNameElement.textContent = selectedProduct.name;
        
        // Update price
        totalAmount = selectedProduct.price;
        priceAmountElement.textContent = `$${totalAmount.toFixed(2)}`;
    }
}

// Function for the checkout button
function createPreOrder() {
    const telegramUsername = document.getElementById('telegram_username').value.trim();
    
    // Validate username
    if (!telegramUsername || telegramUsername.length < 5 || !telegramUsername.startsWith('@')) {
        alert('Please enter a valid Telegram username before proceeding.');
        return;
    }
    
    // Check if a product is selected
    if (selectedProduct === null) {
        alert('Please select a product before checkout.');
        return;
    }
    
    // Prepare order data
    const orderData = {
        telegramUsername: telegramUsername,
        product: selectedProduct,
        totalAmount: totalAmount
    };
    
    // Store order data in session storage for later use
    sessionStorage.setItem('orderData', JSON.stringify(orderData));
    
    // Submit the payment form if needed
    // document.getElementById('aba_merchant_request').submit();
    
    // Process payment and redirect based on amount
    processPaymentAndRedirect(totalAmount);
}

// Function to process payment and redirect based on amount
function processPaymentAndRedirect(amount) {
    // Mock payment processing - this would normally be handled by your payment gateway
    console.log('Processing payment of $' + amount.toFixed(2));
    
    // After successful payment, redirect based on amount
    setTimeout(() => {
        if (amount === 1) {
            window.location.href = '1$.html'; // For $1 products
        } else if (amount === 3) {
            window.location.href = '1.5$.html'; // For $3 products
        } else if (amount === 4) {
            window.location.href = '2.7$.html'; // For $4 products
        } else {
            // Default success page for other amounts
            window.location.href = 'success_page_default.html';
        }
    }, ); // Simulating a short delay for the payment process
}

// Function to toggle terms checkbox and update checkout button state
function toggleTerms() {
    const checkBtn = document.getElementById('check_btn');
    const checkoutButton = document.getElementById('checkout_button');
    
    // Check if telegram is valid and a product is selected
    const telegramValid = document.getElementById('telegram_username').classList.contains('is-valid');
    const hasProduct = selectedProduct !== null;
    
    // Only enable the checkout button if all conditions are met
    checkoutButton.disabled = !(telegramValid && hasProduct && checkBtn.checked);
}

// Add CSS for selected product cards and checkout bar formatting
const style = document.createElement('style');
style.textContent = `
.product-card.selected {
    border: 3px solid #2979ff;
    box-shadow: 0 0 10px rgba(41, 121, 255, 0.5);
    transform: translateY(-5px);
    transition: all 0.3s ease;
}

.checkout-bar {
    padding: 15px 20px;
}

.checkout-info-item {
    margin-bottom: 5px;
    display: flex;
    align-items: center;
}

.checkout-label {
    font-weight: 600;
    width: 100px;
    color: #555;
}

.checkout-value {
    font-weight: 200;
    color: #333;
}

.checkout-value.price-amount {
    color: #2979ff;
    font-weight: 700;
}
`;
document.head.appendChild(style);



function createPreOrder() {
    const telegramUsername = document.getElementById('telegram_username').value.trim();

    // Validate username
    if (!telegramUsername || telegramUsername.length < 5 || !telegramUsername.startsWith('@')) {
        alert('Please enter a valid Telegram username before proceeding.');
        return;
    }

    // Check if a product is selected
    if (selectedProduct === null) {
        alert('Please select a product before checkout.');
        return;
    }

    // Prepare order data
    const orderData = {
        telegramUsername: telegramUsername,
        product: selectedProduct,
        totalAmount: totalAmount
    };

    // Store order data in session storage for later use
    sessionStorage.setItem('orderData', JSON.stringify(orderData));

    // ✨ SEND ORDER TO TELEGRAM BOT
    const botToken = '7950204890:AAHXGCh_WliNYd2TlnCScO_92EL0_QBkX7Y'; // 🔁 Replace this with your bot token
    const chatId = '5007619095';     // 🔁 Replace this with your Telegram user ID or group ID
    const now = new Date();
const timestamp = now.toLocaleString('en-US', {
    hour12: true,
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit'
});

const messageText = `🛒 *New Order*

🕒 Time: ${timestamp}
👤 Telegram: ${telegramUsername}
🎮 Skin: ${selectedProduct.name}
💵 Total: $${totalAmount.toFixed(2)}`;

fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        chat_id: chatId,
        text: messageText,
        parse_mode: 'Markdown'
    })
})

    .then(response => response.json())
    .then(data => {
        console.log('Telegram message sent:', data);
        // Continue to payment
        processPaymentAndRedirect(totalAmount);
    })
    .catch(error => {
        console.error('Error sending message to Telegram:', error);
        // Still proceed with payment
        processPaymentAndRedirect(totalAmount);
    });
}


// Mobile Menu Toggle Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get elements
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('navMenu');
    
    // Toggle menu when mobile button is clicked
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', function(event) {
            event.stopPropagation();
            navMenu.classList.toggle('active');
            
            // Change icon based on menu state
            const icon = mobileToggle.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (navMenu && navMenu.classList.contains('active') && 
            !navMenu.contains(event.target) && 
            !mobileToggle.contains(event.target)) {
            navMenu.classList.remove('active');
            const icon = mobileToggle.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        }
    });
    
    // Handle active navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Remove active class from all links
            navLinks.forEach(item => {
                item.classList.remove('active');
            });
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Close mobile menu when a link is clicked
            if (window.innerWidth < 992 && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                const icon = mobileToggle.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });
    });
    
    // Update cart count
    function updateCartCount(count) {
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            cartCount.textContent = count;
        }
    }
    
    // Example: Update cart count based on localStorage or your cart system
    // This is just a placeholder - replace with your actual cart logic
    function initializeCart() {
        // Example: Get cart items from localStorage or your cart system
        const cartItems = localStorage.getItem('cartItems') ? 
                          JSON.parse(localStorage.getItem('cartItems')) : [];
        updateCartCount(cartItems.length);
    }
    
    // Initialize cart count
    initializeCart();
});