/** 
 * SCRIPT 1: MLBB ID CHECKER 
 */
const CHECK_ID_API = "https://ml-id-checker.vercel.app";
let isVerified = false; 

// 1. Function to Enable/Disable Button based on input length
function validateInputs() {
    const gid = document.getElementById('gameId').value;
    const sid = document.getElementById('serverId').value;
    const btn = document.getElementById('checkBtn');

    // Requirements: Game ID >= 8 digits, Server ID >= 3 digits
    if (gid.length >= 8 && sid.length >= 3) {
        btn.disabled = false;
        btn.classList.remove('opacity-50', 'cursor-not-allowed');
        btn.classList.add('opacity-100', 'cursor-pointer');
    } else {
        btn.disabled = true;
        btn.classList.add('opacity-50', 'cursor-not-allowed');
        btn.classList.remove('opacity-100', 'cursor-pointer');
    }
}

// 2. Manual Check Logic
async function checkNickname() {
    const gid = document.getElementById('gameId').value;
    const sid = document.getElementById('serverId').value;
    const display = document.getElementById('playerNickname');
    const btn = document.getElementById('checkBtn');
    
    isVerified = false;
    
    // UI Loading State
    btn.disabled = true;
    btn.innerHTML = `<i class="fas fa-spinner fa-spin mr-2"></i> Checking...`;
    display.innerHTML = `<i class="fas fa-circle-notch fa-spin"></i>`;
    display.className = "text-blue-400 font-bold italic text-right";

    try {
        const res = await fetch(`${CHECK_ID_API}/ml?id=${gid}&zone=${sid}`);
        const data = await res.json();
        
        if(data.status && data.nickname) {
            display.innerHTML = `<i class="fas fa-check-circle mr-1"></i> ${data.nickname}`;
            display.className = "text-green-400 font-bold italic text-right";
            isVerified = true;
            btn.innerHTML = `<span>Check User</span>`;
        } else {
            display.innerHTML = `User Not Found`;
            display.className = "text-red-400 font-bold italic text-right";
            btn.innerHTML = `<span>Try Again</span>`;
        }
    } catch(e) { 
        display.innerText = "Check ID Offline"; 
        btn.innerHTML = `<span>Error</span>`;
    } finally {
        btn.disabled = false;
        validateInputs(); // Re-check button status
        if (typeof updateButtonState === "function") updateButtonState();
    }
}

// 3. Restrict to Numbers Only & Reset Status if changed
function handleNumberInput(e) {
    // Force numbers only
    e.target.value = e.target.value.replace(/[^0-9]/g, '');
    
    const display = document.getElementById('playerNickname');
    
    // Reset verification if user changes the ID
    isVerified = false;
    display.innerText = "Not Checked";
    display.className = "text-red-400 font-bold italic text-right";
    
    // Check if we should enable the button
    validateInputs();
    
    if (typeof updateButtonState === "function") updateButtonState();
}

// 4. Event Listeners
document.getElementById('gameId').addEventListener('input', handleNumberInput);
document.getElementById('serverId').addEventListener('input', handleNumberInput);
