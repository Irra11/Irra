// Global variables to track selection state
let selectedProduct = null;
let totalAmount = 0;
// CHANGED: Variable name from telegramUsername to gmailAddress
let gmailAddress = '';

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // CHANGED: Get the gmail address input field
    const gmailInput = document.getElementById('gmail_address');
    const userFoundDiv = document.getElementById('user_found');
    const checkoutButton = document.getElementById('checkout_button');
    const productNameElement = document.querySelector('.product-name');
    const priceAmountElement = document.querySelector('.price-amount');
    
    // Initially disable the checkout button
    checkoutButton.disabled = true;
    
    // Modify the checkout bar structure to add labels
    const checkoutBarInfo = document.querySelector('.checkout-bar > div');
    checkoutBarInfo.innerHTML = `
    <div class="checkout-info-item">
        <span class="checkout-label">Gmail:</span>
        <span class="checkout-value gmail-address">-</span>
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

    
    // CHANGED: Add event listener for gmail address input
    gmailInput.addEventListener('input', function() {
        validateGmailAddress();
        updateCheckoutBar();
    });
    
    // CHANGED: Add event listener for blur (when user clicks away)
    gmailInput.addEventListener('blur', function() {
        if (gmailInput.value.trim() !== '') {
            validateGmailAddress();
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
    
    // // CHANGED: Function to validate the gmail address
    // function validateGmailAddress() {
    //     const email = gmailInput.value.trim();
        
    //     // Reset the user found message
    //     userFoundDiv.innerHTML = '';
        
    //     // Basic email validation regex
    //     // This is a standard regex for basic email format validation
    //     const validEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
    //     if (email === '') {
    //         setInvalidState('សូមបញ្ចូល Gmail របស់អ្នក');
    //         return false;
    //     }
        
    //     // CHANGED: Check for valid email format
    //     if (!validEmailRegex.test(email)) {
    //         setInvalidState('សូមបញ្ចូលGmailដែលត្រឹមត្រូវ Ex. (irra11@gmail.com) ');
    //         return false;
    //     }
        
    //     // If all validations pass, show success message
    //     setValidState();
    //     gmailAddress = email; // Store the valid email
    //     return true;
    // }
    
    // Function to display validation error
    function setInvalidState(message) {
        // CHANGED: Use gmailInput
        gmailInput.classList.add('is-invalid');
        gmailInput.classList.remove('is-valid');
        
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
        // CHANGED: Use gmailInput
        gmailInput.classList.remove('is-invalid');
        gmailInput.classList.add('is-valid');
        
        userFoundDiv.innerHTML = `
            <div class="alert alert-success mt-3">
                <i class="fas fa-check-circle"></i> បានបញ្ចូល Gmail ត្រឹមត្រូវ!
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
    // CHANGED: Check for gmail_address input
    const gmailInput = document.getElementById('gmail_address');
    const checkoutButton = document.getElementById('checkout_button');
    checkoutButton.disabled = !(gmailInput.classList.contains('is-valid') && selectedProduct !== null);
}

// Function to update the checkout bar content
function updateCheckoutBar() {
    // CHANGED: Get the element for the gmail address
    const gmailAddressElement = document.querySelector('.checkout-value.gmail-address');
    const productNameElement = document.querySelector('.checkout-value.product-name');
    const priceAmountElement = document.querySelector('.checkout-value.price-amount');
    
    // CHANGED: Get value from gmail_address input
    const email = document.getElementById('gmail_address').value.trim();
    
    // Update gmail address
    gmailAddressElement.textContent = email || '-';
    
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
    // CHANGED: Get value from gmail_address input
    const email = document.getElementById('gmail_address').value.trim();
    const validEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    // CHANGED: Validate email
    if (!email || !validEmailRegex.test(email)) {
        alert('Please enter a valid Gmail address before proceeding.');
        return;
    }
    
    // Check if a product is selected
    if (selectedProduct === null) {
        alert('Please select a product before checkout.');
        return;
    }
    
    // Prepare order data
    const orderData = {
        // CHANGED: Key is now gmailAddress
        gmailAddress: email,
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
    const chatId = '5007619095';     // Telegram user ID or group ID
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
📧 Gmail: ${email}
🎮 Skin: ${selectedProduct.name}
💵 Total: $${totalAmount.toFixed(2)}`;

    // Add message link to the status div
    const telegramApiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
    
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
function processPaymentAndRedirect(amount) {
    console.log('Processing payment of $' + amount.toFixed(2));

    if (amount === 1) {
        location.href = 'https://pay.ababank.com/oRF8/oq1z33v6';
    } else if (amount === 4) {
        location.href = 'https://pay.ababank.com/oRF8/irqyoyp2';
    } else if (amount === 5) {
        location.href = '2.7$.html';
    } else {
        location.href = '1.5$.html';
    }
}


// Function to toggle terms checkbox and update checkout button state
function toggleTerms() {
    const checkBtn = document.getElementById('check_btn');
    const checkoutButton = document.getElementById('checkout_button');
    
    // CHANGED: Check if gmail is valid and a product is selected
    const gmailValid = document.getElementById('gmail_address').classList.contains('is-valid');
    const hasProduct = selectedProduct !== null;
    
    // Only enable the checkout button if all conditions are met
    checkoutButton.disabled = !(gmailValid && hasProduct && checkBtn.checked);
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
            performSearch(); // Re-run search with recent term
        });
        
        itemsList.appendChild(item);
    });
    
    recentSearchesDiv.appendChild(itemsList);
    container.appendChild(recentSearchesDiv);

}


/**
 * IRRA STORE - FULL INTEGRATED JAVASCRIPT
 */

(function() {
    // Variables
    let selectedProduct = null;
    let totalAmount = 0;

    document.addEventListener('DOMContentLoaded', function() {
        // --- 1. INITIALIZATION ---
        const gmailInput = document.getElementById('gmail_address');
        const userFoundDiv = document.getElementById('user_found');
        const checkoutButton = document.getElementById('checkout_button');
        const checkoutBarInfo = document.querySelector('.checkout-bar > div');

        if (checkoutButton) checkoutButton.disabled = true;

        // Setup Checkout Bar HTML
        if (checkoutBarInfo) {
            checkoutBarInfo.innerHTML = `
                <div class="checkout-info-item"><span class="checkout-label">Gmail:</span> <span class="checkout-value gmail-address">-</span></div>
                <div class="checkout-info-item"><span class="checkout-label">Skin:</span> <span class="checkout-value product-name">-</span></div>
                <div class="checkout-info-item"><span class="checkout-label">Total:</span> <span class="checkout-value price-amount">$0.00</span></div>`;
        }

        // --- 2. GMAIL VALIDATION ---
        if (gmailInput) {
            gmailInput.addEventListener('input', function() {
                const email = gmailInput.value.trim();
                const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
                
                if (email === '') {
                    updateUI(false, 'សូមបញ្ចូល Gmail របស់អ្នក');
                } else if (!isValid) {
                    updateUI(false, 'Gmail មិនត្រឹមត្រូវ (ex: name@gmail.com)');
                } else {
                    updateUI(true, 'បានបញ្ចូល Gmail ត្រឹមត្រូវ!');
                }
                syncBar();
            });
        }

        function updateUI(isValid, msg) {
            gmailInput.classList.toggle('is-valid', isValid);
            gmailInput.classList.toggle('is-invalid', !isValid);
            userFoundDiv.innerHTML = `<div class="alert alert-${isValid?'success':'danger'} mt-3">${msg}</div>`;
            checkBtn();
        }

        // --- 3. PRODUCT SELECTION ---
        document.querySelectorAll('.product-card').forEach(card => {
            card.addEventListener('click', function() {
                document.querySelectorAll('.product-card').forEach(c => c.classList.remove('selected'));
                this.classList.add('selected');

                selectedProduct = {
                    name: this.querySelector('.product-name').textContent,
                    price: parseFloat(this.querySelector('.product-price').textContent.replace('$', ''))
                };
                totalAmount = selectedProduct.price;

                syncBar();
                checkBtn();
            });
        });

        function syncBar() {
            document.querySelector('.gmail-address').textContent = gmailInput.value || '-';
            document.querySelector('.product-name').textContent = selectedProduct ? selectedProduct.name : '-';
            document.querySelector('.price-amount').textContent = `$${totalAmount.toFixed(2)}`;
        }

        function checkBtn() {
            const emailOk = gmailInput.classList.contains('is-valid');
            checkoutButton.disabled = !(emailOk && selectedProduct);
        }

        // --- 4. MOBILE MENU ---
        const mobileToggle = document.getElementById('mobile-toggle');
        const navMenu = document.getElementById('navMenu');
        if (mobileToggle) {
            mobileToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                mobileToggle.querySelector('i').className = navMenu.classList.contains('active') ? 'fas fa-times' : 'fas fa-bars';
            });
        }

        // --- 5. SEARCH SYSTEM ---
        const searchBtn = document.querySelector('.action-btn i.fa-search');
        if (searchBtn) searchBtn.parentElement.onclick = toggleSearchBox;
    });

    // --- 6. CORE: SAVE TO PANEL & REDIRECT ---
    window.createPreOrder = function() {
        const gmail = document.getElementById('gmail_address').value.trim();
        const btn = document.getElementById('checkout_button');

        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';

        // Save to Python Backend (Port 5001 to avoid conflicts)
        fetch('https://adminpanel-jtf9.onrender.com/api/save-order', {
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
                // REDIRECT TO PAYMENT
                processPaymentAndRedirect(totalAmount);
            } else {
                alert("Error saving to panel.");
                btn.disabled = false;
            }
        })
        .catch(() => {
            alert("Error: សូមបើក Python app.py ជាមុនសិន!");
            btn.disabled = false;
            btn.innerHTML = 'Pay Now';
        });
    };

    function processPaymentAndRedirect(amount) {
        if (amount === 1) window.location.href = 'https://pay.ababank.com/oRF8/oq1z33v6';
        else if (amount === 4) window.location.href = 'https://pay.ababank.com/oRF8/irqyoyp2';
        else if (amount === 5) window.location.href = '2.7$.html';
        else window.location.href = '1.5$.html';
    }

    // --- 7. SEARCH LOGIC ---
    function toggleSearchBox() {
        let overlay = document.querySelector('.search-overlay');
        if (overlay) { overlay.remove(); return; }

        overlay = document.createElement('div');
        overlay.className = 'search-overlay animate__animated animate__fadeIn';
        overlay.innerHTML = `
            <div class="search-container">
                <div class="search-form">
                    <input type="text" class="search-input" placeholder="Search skins..." id="search-input">
                    <button class="search-close-btn" onclick="this.closest('.search-overlay').remove()"><i class="fas fa-times"></i></button>
                </div>
                <div id="search-results" class="search-results"></div>
            </div>`;
        document.body.appendChild(overlay);

        const input = document.getElementById('search-input');
        input.focus();
        input.oninput = function() {
            const term = this.value.toLowerCase().trim();
            const results = document.getElementById('search-results');
            results.innerHTML = '';
            if (!term) return;

            document.querySelectorAll('.product-card').forEach(card => {
                const name = card.querySelector('.product-name').textContent;
                if (name.toLowerCase().includes(term)) {
                    const div = document.createElement('div');
                    div.className = 'search-result-item';
                    div.innerHTML = `<span>${name}</span> <i class="fas fa-chevron-right"></i>`;
                    div.onclick = () => {
                        overlay.remove();
                        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        card.style.outline = "4px solid #2979ff";
                        setTimeout(() => card.style.outline = "none", 2000);
                    };
                    results.appendChild(div);
                }
            });
        };
    }

    // Styles for search
    const style = document.createElement('style');
    style.textContent = `
        .search-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); z-index: 10000; display: flex; justify-content: center; padding-top: 80px; }
        .search-container { width: 90%; max-width: 500px; }
        .search-form { display: flex; background: white; border-radius: 50px; padding: 5px 20px; align-items: center; }
        .search-input { border: none; flex: 1; padding: 10px; outline: none; font-size: 16px; }
        .search-results { margin-top: 20px; max-height: 60vh; overflow-y: auto; }
        .search-result-item { background: rgba(255,255,255,0.1); color: white; padding: 15px; border-radius: 10px; margin-bottom: 5px; cursor: pointer; display: flex; justify-content: space-between; }
    `;
    document.head.appendChild(style);
})();
(function() {
    let selectedProduct = null;
    let totalAmount = 0;

    document.addEventListener('DOMContentLoaded', function() {
        const gmailInput = document.getElementById('gmail_address');
        const checkoutButton = document.getElementById('checkout_button');

        // Product Click
        document.querySelectorAll('.product-card').forEach(card => {
            card.addEventListener('click', function() {
                document.querySelectorAll('.product-card').forEach(c => c.classList.remove('selected'));
                this.classList.add('selected');

                selectedProduct = {
                    name: this.querySelector('.product-name').textContent,
                    price: parseFloat(this.querySelector('.product-price').textContent.replace('$', ''))
                };
                totalAmount = selectedProduct.price;
                
                const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(gmailInput.value);
                checkoutButton.disabled = !(isEmail && selectedProduct);
            });
        });

        // Pay Now Click
        window.createPreOrder = function() {
            const email = gmailInput.value.trim();
            checkoutButton.disabled = true;
            checkoutButton.innerHTML = "PROCESSING...";

            fetch('https://adminpanel-jtf9.onrender.com/api/save-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    gmailAddress: email,
                    product: selectedProduct,
                    totalAmount: totalAmount
                })
            })
            .then(res => {
                if (res.ok) {
                    // បើក Link បង់ប្រាក់
                    if (totalAmount === 1) window.location.href = 'https://pay.ababank.com/oRF8/oq1z33v6';
                    else if (totalAmount === 4) window.location.href = 'https://pay.ababank.com/oRF8/irqyoyp2';
                    else window.location.href = '1.5$.html';
                } else {
                    alert("Error saving order!");
                    checkoutButton.disabled = false;
                }
            })
            .catch(() => {
                alert("សូមបើក Python app.py ជាមុនសិន!");
                checkoutButton.disabled = false;
            });
        };
    });
})();
// --- មុខងារផ្ញើសារជោគជ័យ ---
async function sendSuccess(id, gmail) {
    const link = await showModal({
        title: "ផ្ញើ Link File",
        body: `ផ្ញើ Link ទៅកាន់: ${gmail}`,
        icon: '<i class="fas fa-check-circle"></i>',
        showInput: true,
        confirmText: "ផ្ញើឥឡូវនេះ",
        color: "#27ae60"
    });

    if (link) {
        const subject = "ការទិញរបស់អ្នកបានជោគជ័យ ✅"; // Subject សម្រាប់ជោគជ័យ
        const msg = `ការទិញរបស់អ្នកបានជោគជ័យ ✅\n\nសូមជម្រាបជូន,\n• ការបញ្ជាទិញរបស់អ្នកបានបញ្ចប់ដោយជោគជ័យសូម Save File\n\nLink Download: ${link}\n\nសូមអរគុណ!`;
        await postResponse(id, gmail, msg, subject);
    }
}

// --- មុខងារផ្ញើសារបរាជ័យ ---
async function sendFailed(id, gmail) {
    const confirmAction = await showModal({
        title: "បដិសេធការទិញ",
        body: `ផ្ញើសារ 'ការទិញបរាជ័យ' ទៅកាន់: ${gmail}?`,
        icon: '<i class="fas fa-exclamation-triangle"></i>',
        showInput: false,
        confirmText: "បដិសេធ & ផ្ញើសារ",
        color: "#f39c12"
    });

    if (confirmAction) {
        const subject = "ការទិញរបស់អ្នកបានបរាជ័យ ❌"; // Subject សម្រាប់បរាជ័យ
        const msg = `ការទិញរបស់អ្នកបានបរាជ័យ ❌\n\nសូមជម្រាបជូន,\n• ការបញ្ជាទិញរបស់អ្នកត្រូវបានបដិសេធ ដោយសារមិនមានការបង់ប្រាក់ត្រឹមត្រូវ។ សូមព្យាយាមម្ដងទៀត!`;
        await postResponse(id, gmail, msg, subject);
    }
}

// --- មុខងារផ្ញើទិន្នន័យទៅ Python (កែបន្ថែម subject parameter) ---
async function postResponse(id, gmail, message, subject) {
    const res = await fetch(`${API}/admin/send-response`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            id: id, 
            gmail: gmail, 
            message: message, 
            subject: subject // បញ្ជូន Subject ទៅ Backend
        })
    });
    
    if(res.ok) {
        alert("Email ត្រូវបានផ្ញើរួចរាល់!");
        fetchOrders();
    } else {
        alert("ការផ្ញើបរាជ័យ!");
    }

}
