document.addEventListener("DOMContentLoaded", () => {
    document.querySelector('#shop')?.addEventListener("click", function(e) {
        const btn = e.target.closest('.btn'); // Check if an "Inbox" button was clicked
        if (!btn) return;

        const product = btn.closest('.product');
        if (product) {
            // Extract product details
            const productName = product.querySelector(".product-name")?.textContent.trim() || "Unknown Product";
            const productNeed = product.querySelector(".product-need")?.textContent.trim() || "No description available";

            // Construct Telegram message
            const message = `សួរស្តីបងខ្ញុំចង់បាន Skin ${productName} (${productNeed})`;

            // Replace "irra_11" with your actual Telegram username
            const telegramUsername = "irra_11";
            const telegramUrl = `https://t.me/${telegramUsername}?text=${encodeURIComponent(message)}`;

            // Open Telegram chat in a new tab
            window.open(telegramUrl, "_blank");
        }
    });
});



document.addEventListener("DOMContentLoaded", () => {
    document.querySelector('#shop')?.addEventListener("click", function(e) {
        const btn = e.target.closest('.btn');
        if (!btn) return;

        const item = btn.closest('.item');
        if (item) {
            const productName = item.querySelector(".product-name")?.textContent.trim() || "Unknown Product";

            // Construct Telegram message
            const message = `សួរស្តីបងខ្ញុំចង់ទិញ ${productName}(Premium)`;

            // Replace "irra_11" with your actual Telegram username
            const telegramUsername = "irra_11";
            const telegramUrl = `https://t.me/${telegramUsername}?text=${encodeURIComponent(message)}`;

            // Open Telegram chat in a new tab
            window.open(telegramUrl, "_blank");
        }
    });
});






