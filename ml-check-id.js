/** 
 * SCRIPT 1: MLBB ID CHECKER 
 */
const CHECK_ID_API = "https://ml-id-checker.vercel.app";
let isVerified = false; 

// 1. Manual Check Logic
async function checkNickname() {
    const gid = document.getElementById('gameId').value;
    const sid = document.getElementById('serverId').value;
    const display = document.getElementById('playerNickname');
    const btn = document.getElementById('checkBtn');
    
    // Reset state
    isVerified = false;
    if (typeof updateButtonState === "function") updateButtonState();

    if(gid.length >= 8 && sid.length >= 3) {
        // UI Loading State
        btn.disabled = true;
        btn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> <span>Checking...</span>`;
        display.innerHTML = `<i class="fas fa-circle-notch fa-spin"></i>`;

        try {
            const res = await fetch(`${CHECK_ID_API}/ml?id=${gid}&zone=${sid}`);
            const data = await res.json();
            
            if(data.status && data.nickname) {
                display.innerHTML = `<span class="text-green-400 font-bold"><i class="fas fa-check-circle mr-1"></i> ${data.nickname}</span>`;
                isVerified = true;
                btn.innerHTML = `<i class=""></i> <span>Check User</span>`;
                btn.className = btn.className.replace('bg-blue-600', 'bg-blue-600');
            } else {
                display.innerHTML = `<span class="text-red-400 font-bold">User Not Found</span>`;
                btn.innerHTML = `<span>Try Again</span>`;
            }
        } catch(e) { 
            display.innerText = "Check ID Offline"; 
            btn.innerHTML = `<span>Error</span>`;
        } finally {
            btn.disabled = false;
        }
    } else {
        display.innerText = "Not Checked";
        // Simple shake effect for button if input is too short
        btn.classList.add('animate-pulse');
        setTimeout(() => btn.classList.remove('animate-pulse'), 500);
    }
    
    if (typeof updateButtonState === "function") updateButtonState();
}

// 2. Restrict to Numbers Only & Reset Status if changed
function handleNumberInput(e) {
    e.target.value = e.target.value.replace(/[^0-9]/g, '');
    
    // If user changes the ID after verification, reset the green button
    const btn = document.getElementById('checkBtn');
    const display = document.getElementById('playerNickname');
    isVerified = false;
    btn.innerHTML = `<i class=" text-sm"></i> <span>Check User</span>`;
    btn.className = btn.className.replace('bg-green-600', 'bg-blue-600');
    display.innerText = "Waiting for check...";
    
    if (typeof updateButtonState === "function") updateButtonState();
}

// 3. Event Listeners
document.getElementById('gameId').addEventListener('input', handleNumberInput);
document.getElementById('serverId').addEventListener('input', handleNumberInput);
