<!DOCTYPE html>
<html lang="en" oncontextmenu="return false;">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>IRRATOPUP - Mobile Legends</title>
    
    <!-- Scripts -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&family=Oswald:wght@400;700&display=swap');
        * { -webkit-tap-highlight-color: transparent; user-select: none; -webkit-user-select: none; }
        body { background-color: #0f172a; color: white; font-family: 'Inter', sans-serif; overflow-x: hidden; }
        .oswald { font-family: 'Oswald', sans-serif; }
        .bg-card { background-color: #1e293b; }
        .bg-input { background-color: #0f172a; }
        .text-blue-custom { color: #0d9bdd; }
        
        .bottom-bar { position: fixed; bottom: 0; left: 0; right: 0; background-color: #1e293b; padding: 15px 20px; border-top: 1px solid #334155; display: flex; justify-content: space-between; align-items: center; z-index: 50; }
        
        input { user-select: text !important; -webkit-user-select: text !important; }
        .package-card { border: 2px solid transparent; transition: all 0.2s; }
        .package-card.selected { border-color: #0d9bdd; background-color: rgba(13, 155, 221, 0.1); transform: scale(1.02); }
        
        /* Modal Animation */
        .modal-active { display: flex !important; animation: fadeIn 0.3s ease-out; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    </style>
</head>
<body class="pb-32">

   <!-- Navbar -->
<nav class="flex justify-between items-center p-4 bg-slate-900 shadow-lg sticky top-0 z-50">
    <div class="flex items-center space-x-3">
        <!-- Logo Image -->
        <img src="https://i.pinimg.com/736x/26/ee/96/26ee9656dbdc7cadb5f7656c00ff2dcc.jpg" 
             alt="Logo" 
             class="w-10 h-10 rounded-full border-2 border-blue-500 object-cover">
        <h1 class="text-3xl font-bold oswald text-blue-custom italic tracking-tighter">IRRATOPUP</h1>
    </div>
    <button class="text-2xl"><i class="fas fa-bars"></i></button>
</nav>
    <!-- Banner -->
    <div class="p-4">
        <div class="rounded-xl overflow-hidden shadow-2xl border border-slate-700">
            <img src="https://i.pinimg.com/1200x/f4/ee/16/f4ee16078895763d549f02259b9078c1.jpg" alt="Banner" class="w-full object-cover h-44">
        </div>
    </div>

    <!-- Title Info -->
    <div class="px-4 py-2 flex items-center space-x-3">
        <img src="https://play-lh.googleusercontent.com/Op7v9XdsyxjrKImMD5RLyiLRCAHs3DMQFANwfsuMTw1hq0lH4j8tOqD3Fd7zyr4ixmC0xoqqRkQDBjAd46NsFQ=w240-h480" class="w-12 h-12 rounded-lg shadow-lg" alt="ML Icon">
        <div>
            <h2 class="text-xl font-bold oswald uppercase italic text-orange-500">Mobile Legends</h2>
            <div class="flex items-center text-[10px] text-gray-400 space-x-2">
                <span><i class="fas fa-lock text-green-500"></i> Safety guarantees</span>
                <span><i class="fas fa-bolt text-yellow-500"></i> Instant delivery</span>
            </div>
        </div>
    </div>

    <!-- Information Section -->
    <div class="p-4">
        <div class="bg-card rounded-2xl p-5 shadow-lg border border-slate-700">
            <div class="flex items-center mb-4 space-x-2">
                <span class="bg-blue-600 w-8 h-8 rounded-full flex items-center justify-center text-sm"><i class="fas fa-user text-white"></i></span>
                <h3 class="font-bold">Enter Your Information</h3>
            </div>
            <div class="grid grid-cols-2 gap-4">
                <div class="relative">
                    <label class="absolute -top-2 left-3 bg-card px-1 text-[10px] text-gray-400">Game ID</label>
                    <input type="text" id="gameId" placeholder="ID" class="w-full bg-input border border-slate-600 rounded-lg p-3 text-sm focus:border-blue-500 outline-none">
                </div>
                <div class="relative">
                    <label class="absolute -top-2 left-3 bg-card px-1 text-[10px] text-gray-400">Server ID</label>
                    <input type="text" id="serverId" placeholder="Zone" class="w-full bg-input border border-slate-600 rounded-lg p-3 text-sm focus:border-blue-500 outline-none">
                </div>
            </div>
            <div class="mt-4 flex justify-between text-sm px-1 border-t border-slate-700 pt-3">
                <span class="text-gray-400">Player:</span>
                <span id="playerNickname" class="text-blue-400 font-bold italic">Waiting for ID...</span>
            </div>
        </div>
    </div>

    <!-- Packages Grid -->
    <div class="px-4 mt-2">
        <h3 class="oswald uppercase font-bold text-lg mb-3 tracking-widest flex items-center"><i class="fas fa-gem text-blue-400 mr-2"></i> SAVING PACKAGES</h3>
        <div class="grid grid-cols-2 gap-3" id="packageContainer"></div>
    </div>

    <!-- Payment Method -->
    <div class="p-4 mt-4">
        <h3 class="font-bold text-lg mb-3 flex items-center">
            <span class="bg-blue-400/20 text-blue-400 p-1 rounded-lg mr-2"><i class="fas fa-money-check"></i></span> Payment Method
        </h3>
        <div class="bg-card rounded-2xl border-2 border-blue-500 relative p-3">
            <div class="flex items-center">
                <div class="w-14 h-14 mr-3 bg-white rounded-xl p-1">
                    <img src="https://saktopup.com/assets/icon/KHQR.png" class="w-full h-full object-contain">
                </div>
                <div>
                    <p class="font-bold text-md">BAKONG KHQR</p>
                    <p class="text-[11px] text-gray-400">Scan to pay with any banking app</p>
                </div>
            </div>
            <div class="absolute top-0 right-0 bg-blue-400 text-slate-900 w-8 h-7 rounded-bl-xl flex items-center justify-center">
                <i class="fas fa-check font-bold"></i>
            </div>
        </div>
    </div>

    <!-- Footer -->
    <footer class="mt-10 px-4 mb-32 opacity-50">
        <h2 class="font-bold text-2xl oswald italic">IRRA TOPUP</h2>
        <p class="text-gray-400 text-sm">Official Game Partner. Fast & Secure.</p>
    </footer>

    <!-- Bottom Action Bar -->
    <div class="bottom-bar shadow-2xl">
        <div>
            <p class="text-sm text-gray-400">Total: <span class="text-blue-custom font-bold text-lg" id="displayTotal">$0.00</span></p>
            <p class="text-[10px] text-gray-500 uppercase">Product: <span id="displayProduct" class="text-white">-</span></p>
        </div>
        <button id="payBtn" disabled onclick="handlePayment()" class="bg-slate-700 text-gray-400 px-8 py-3 rounded-xl font-bold transition-all">
            Pay Now
        </button>
    </div>

    <!-- Payment Modal (Hidden by Default) -->
    <div id="paymentModal" class="fixed inset-0 bg-black/90 z-[100] hidden flex-col items-center justify-center p-6">
        <div class="bg-slate-900 border border-slate-700 w-full max-w-sm rounded-3xl p-6 text-center shadow-2xl">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-xl font-bold oswald text-blue-400 italic">BAKONG KHQR</h2>
                <button onclick="closeModal()" class="text-gray-400"><i class="fas fa-times"></i></button>
            </div>
            
            <div class="bg-white p-4 rounded-2xl inline-block mb-4">
                <div id="qrcode"></div>
            </div>

            <div class="bg-slate-800 p-4 rounded-2xl mb-6">
                <div class="flex justify-between text-sm mb-1">
                    <span class="text-gray-400">Order ID:</span>
                    <span id="modalOrderId" class="font-bold text-white">#---</span>
                </div>
                <div class="flex justify-between text-lg">
                    <span class="text-gray-400 font-bold">Total:</span>
                    <span id="modalAmount" class="font-black text-blue-400">$0.00</span>
                </div>
            </div>

            <div class="flex items-center justify-center space-x-3 text-sm text-gray-300">
                <div class="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                <span>Waiting for payment...</span>
            </div>
            
            <p class="text-[10px] text-gray-500 mt-6 uppercase tracking-widest">Do not close this window until finished</p>
        </div>
    </div>

    <script src="ml-check-id.js"></script>
    <script src="payment-bakong.js"></script>
</body>
</html>
