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
function processPaymentAndRedirect(amount) {
    console.log('Processing payment of $' + amount.toFixed(2));

    if (amount === 1) {
        location.href = '1$.html';
    } else if (amount === 3) {
        location.href = '1.5$.html';
    } else if (amount === 4) {
        location.href = '2.7$.html';
    } else {
        location.href = 'success_page_default.html';
    }
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


// Updated createPreOrder function with visual feedback
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

    // Disable the checkout button to prevent multiple clicks
    const checkoutButton = document.getElementById('checkout_button');
    if (checkoutButton) {
        checkoutButton.disabled = true;
        checkoutButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    }

    // Create a status element to show Telegram notification status
    const statusDiv = document.createElement('div');
    statusDiv.id = 'telegram_status';
  

    
    // Find a good place to add the status message
    const userFoundDiv = document.getElementById('user_found');
    if (userFoundDiv && userFoundDiv.parentNode) {
        userFoundDiv.parentNode.appendChild(statusDiv);
    } else {
        // If can't find user_found div, add it after the checkout button
        if (checkoutButton && checkoutButton.parentNode) {
            checkoutButton.parentNode.appendChild(statusDiv);
        }
    }

    // ✨ SEND ORDER TO TELEGRAM BOT
    const botToken = '7950204890:AAHXGCh_WliNYd2TlnCScO_92EL0_QBkX7Y'; // Bot token
    const chatId = '5007619095';     // Telegram user ID or group ID
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

    // Add message link to the status div
    const telegramApiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
    
    // Show the API URL we're calling (helps with debugging)
   
    
    // Send the message to Telegram
    fetch(telegramApiUrl, {
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
    .then(response => {
        console.log('Telegram API Response:', response);
        return response.json();
    })
    .then(data => {
        console.log('Telegram API Data:', data);
        
        if (data.ok) {
            // Success - show success message before redirecting
            statusDiv.className = 'alert alert-success mt-3';
           
            
            // Wait a moment to show the success message before redirecting
            setTimeout(() => {
                processPaymentAndRedirect(totalAmount);
            }, 1000);
        } else {
            // API returned an error
            statusDiv.className = 'alert alert-warning mt-3';
           
            
            // Still proceed to payment after a brief delay
            setTimeout(() => {
                processPaymentAndRedirect(totalAmount);
            }, 2000);
        }
    })
    .catch(error => {
        console.error('Error sending message to Telegram:', error);
        
       
        setTimeout(() => {
            processPaymentAndRedirect(totalAmount);
        }, 1000);
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


// Enhanced Product Search Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get the search button and add event listener
    const searchBtn = document.querySelector('.action-btn i.fas.fa-search');
    if (searchBtn) {
        const parentBtn = searchBtn.parentElement;
        parentBtn.addEventListener('click', toggleSearchBox);
    }
});

// Function to toggle search box visibility
function toggleSearchBox() {
    // Remove existing search box if it exists
    const existingSearchBox = document.querySelector('.search-overlay');
    if (existingSearchBox) {
        existingSearchBox.remove();
        return;
    }
    
    // Create search overlay
    const searchOverlay = document.createElement('div');
    searchOverlay.className = 'search-overlay animate__animated animate__fadeIn';
    
    // Create search container
    const searchContainer = document.createElement('div');
    searchContainer.className = 'search-container';
    
   // Create search form
const searchForm = document.createElement('form');
searchForm.className = 'search-form';
searchForm.onsubmit = function(e) {
    e.preventDefault();
    performSearch();
};

// Create search input
const searchInput = document.createElement('input');
searchInput.type = 'text';
searchInput.className = 'search-input';
searchInput.placeholder = 'Search for skins or heroes...';
searchInput.id = 'search-input';
searchInput.autocomplete = 'off';

// Create close button
const closeBtn = document.createElement('button');
closeBtn.type = 'button';
closeBtn.className = 'search-close-btn';
closeBtn.onclick = toggleSearchBox;
const closeIcon = document.createElement('i');
closeIcon.className = 'fas fa-times';
closeBtn.appendChild(closeIcon);

// Append input and close button only
searchForm.appendChild(searchInput);
searchForm.appendChild(closeBtn);
searchContainer.appendChild(searchForm);

    
    // Create search results container
    const resultsContainer = document.createElement('div');
    resultsContainer.className = 'search-results';
    resultsContainer.id = 'search-results';
    searchContainer.appendChild(resultsContainer);
    
    searchOverlay.appendChild(searchContainer);
    document.body.appendChild(searchOverlay);
    
    // Focus on the input
    searchInput.focus();
    
    // Add event listener for real-time search as user types
    searchInput.addEventListener('input', debounce(function() {
        performSearch();
    }, 300));
    
    // Close search on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            toggleSearchBox();
        }
    });
    
    // Close search when clicking outside the search container
    searchOverlay.addEventListener('click', function(e) {
        if (e.target === searchOverlay) {
            toggleSearchBox();
        }
    });
}

// Debounce function to prevent excessive searches while typing
function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(function() {
            func.apply(context, args);
        }, wait);
    };
}

// Function to perform search
function performSearch() {
    const searchInput = document.getElementById('search-input');
    const searchTerm = searchInput.value.toLowerCase().trim();
    const resultsContainer = document.getElementById('search-results');
    
    // Clear previous results
    resultsContainer.innerHTML = '';
    
    // If search term is too short, show a message
    if (searchTerm.length === 0) {
        resultsContainer.innerHTML = '<div class="search-prompt"><i class="fas fa-keyboard"></i><p>Type to search for skins or heroes</p></div>';
        return;
    }
    
    // Show loading indicator
    resultsContainer.innerHTML = '<div class="search-loading"><i class="fas fa-spinner fa-spin"></i><p>Searching...</p></div>';
    
    // Short delay to simulate search
    setTimeout(() => {
        // Get all product cards
        const productCards = document.querySelectorAll('.product-card');
        let results = [];
        
        // Filter products based on search term
        productCards.forEach(card => {
            const productName = card.querySelector('.product-name').textContent.toLowerCase();
            if (productName.includes(searchTerm)) {
                // Calculate relevance (exact match gets higher score)
                let relevance = 1;
                if (productName === searchTerm) relevance = 3;
                else if (productName.startsWith(searchTerm)) relevance = 2;
                
                results.push({
                    name: card.querySelector('.product-name').textContent,
                    price: card.querySelector('.product-price').textContent,
                    image: card.querySelector('.product-img').src,
                    element: card,
                    relevance: relevance
                });
            }
        });
        
        // Sort results by relevance
        results.sort((a, b) => b.relevance - a.relevance);
        
        // Clear loading indicator
        resultsContainer.innerHTML = '';
        
        // Display results
        if (results.length > 0) {
            // Create header for results
            const resultsHeader = document.createElement('div');
            resultsHeader.className = 'results-header';
            resultsHeader.textContent = `Found ${results.length} ${results.length === 1 ? 'item' : 'items'}`;
            resultsContainer.appendChild(resultsHeader);
            
            // Create results list
            results.forEach(result => {
                const resultItem = document.createElement('div');
                resultItem.className = 'search-result-item';
                resultItem.innerHTML = `
                    <img src="${result.image}" alt="${result.name}" class="result-img">
                    <div class="result-info">
                        <div class="result-name">${highlightSearchTerm(result.name, searchTerm)}</div>
                        <div class="result-price">${result.price}</div>
                    </div>
                    <div class="result-action">
                        <i class="fas fa-chevron-right"></i>
                    </div>
                `;
                
                // Add click event to navigate to the product
                resultItem.addEventListener('click', function() {
                    // Close search overlay
                    toggleSearchBox();
                    
                    // Scroll to product section
                    const sectionElement = document.querySelector('#box-item');
                    if (sectionElement) {
                        sectionElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                    
                    // Remove any existing highlights
                    document.querySelectorAll('.product-card').forEach(card => {
                        card.classList.remove('highlight-product');
                    });
                    
                    // Add highlight to the selected product
                    result.element.classList.add('highlight-product');
                    
                    // Scroll product into view with a slight delay to ensure section is in view first
                    setTimeout(() => {
                        result.element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }, 500);
                    
                    // Remove highlight after a few seconds
                    setTimeout(() => {
                        result.element.classList.remove('highlight-product');
                    }, 3000);
                    
                    // Save to recent searches
                    saveToRecentSearches(result.name);
                });
                
                resultsContainer.appendChild(resultItem);
            });
        } else {
            // No results found
            resultsContainer.innerHTML = `
                <div class="empty-search">
                    <i class="fas fa-search"></i>
                    <p>No results found for "${searchTerm}"</p>
                    <p class="search-suggestions">Try different keywords or check for typos</p>
                </div>
            `;
        }
        
        // Show recent searches if there are any
        if (searchTerm.length < 2) {
            showRecentSearches(resultsContainer);
        }
    }, 300);
}

// Function to highlight search term in results
function highlightSearchTerm(text, searchTerm) {
    if (!searchTerm) return text;
    
    const regex = new RegExp(`(${escapeRegExp(searchTerm)})`, 'gi');
    return text.replace(regex, '<span class="highlight">$1</span>');
}

// Helper function to escape regex special characters
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Function to save to recent searches
function saveToRecentSearches(term) {
    if (!term) return;
    
    // Get existing searches from localStorage
    let recentSearches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
    
    // Remove this term if it exists already
    recentSearches = recentSearches.filter(item => item !== term);
    
    // Add term to beginning of array
    recentSearches.unshift(term);
    
    // Keep only the most recent 5 searches
    recentSearches = recentSearches.slice(0, 5);
    
    // Save back to localStorage
    localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
}

// Function to show recent searches
function showRecentSearches(container) {
    const recentSearches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
    
    if (recentSearches.length === 0) return;
    
    const recentSearchesDiv = document.createElement('div');
    recentSearchesDiv.className = 'recent-searches';
    
    const header = document.createElement('div');
    header.className = 'recent-searches-header';
    header.innerHTML = `
        <span>Recent Searches</span>
        <button class="clear-recent-searches">Clear All</button>
    `;
    recentSearchesDiv.appendChild(header);
    
    // Add clear button functionality
    header.querySelector('.clear-recent-searches').addEventListener('click', function(e) {
        e.stopPropagation();
        localStorage.removeItem('recentSearches');
        recentSearchesDiv.remove();
    });
    
    // Add recent search items
    const itemsList = document.createElement('div');
    itemsList.className = 'recent-searches-list';
    
    recentSearches.forEach(search => {
        const item = document.createElement('div');
        item.className = 'recent-search-item';
        item.innerHTML = `
            <i class="fas fa-history"></i>
            <span>${search}</span>
        `;
        
        item.addEventListener('click', function() {
            const searchInput = document.getElementById('search-input');
            searchInput.value = search;
            performSearch();
        });
        
        itemsList.appendChild(item);
    });
    
    recentSearchesDiv.appendChild(itemsList);
    container.appendChild(recentSearchesDiv);
}
