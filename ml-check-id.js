/** 
 * SCRIPT 1: MLBB ID CHECKER 
 */
const CHECK_ID_API = "https://ml-id-checker.vercel.app";
let isVerified = false; // Shared with payment script

// 1. ML ID Verification Logic
async function checkNickname() {
    const gid = document.getElementById('gameId').value;
    const sid = document.getElementById('serverId').value;
    const display = document.getElementById('playerNickname');
    
    isVerified = false;
    if (typeof updateButtonState === "function") updateButtonState();

    if(gid.length >= 8 && sid.length >= 3) {
        display.innerHTML = `<i class="fas fa-spinner fa-spin mr-1"></i> Checking...`;
        try {
            const res = await fetch(`${CHECK_ID_API}/ml?id=${gid}&zone=${sid}`);
            const data = await res.json();
            if(data.status && data.nickname) {
                display.innerHTML = `<span class="text-green-400 font-bold"><i class="fas fa-check-circle mr-1"></i> ${data.nickname}</span>`;
                isVerified = true;
            } else {
                display.innerHTML = `<span class="text-red-400 font-bold">User Not Found</span>`;
            }
        } catch(e) { 
            display.innerText = "Check ID Offline"; 
        }
    } else {
        display.innerText = "Waiting for ID...";
    }
    
    // Notify the payment script to update button
    if (typeof updateButtonState === "function") updateButtonState();
}

// 2. Restrict to Numbers Only (iPhone/Android fix)
function handleNumberInput(e) {
    e.target.value = e.target.value.replace(/[^0-9]/g, '');
    checkNickname();
}

// 3. Event Listeners for Input
document.getElementById('gameId').addEventListener('input', handleNumberInput);
document.getElementById('serverId').addEventListener('input', handleNumberInput);
