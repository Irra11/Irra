
const _0x1a2b = "https://adminesign.onrender.com";

function _0x2a4f(_0x3e1a) {
    const _0x4d55 = document.getElementById('udidStatus');
    _0x4d55.innerText = _0x3e1a.length > 5 ? _0x3e1a : "Waiting for input...";
    _0x4d55.style.color = _0x3e1a.length > 5 ? "#00bcd4" : "#64748b";
    _0x3f1c();
}

function _0x3f1c() {
    const _0x11ab = document.getElementById('udidInput').value;
    const _0x22bc = document.getElementById('termsCheck').checked;
    const _0x33cd = document.getElementById('payBtn');
    if (_0x11ab.length >= 20 && _0x22bc) {
        _0x33cd.classList.add('active');
    } else {
        _0x33cd.classList.remove('active');
    }
}

function _0x8d2a() {
    document.getElementById('emailModal').classList.add('active');
}

function _0x11bc() {
    const _0x44dd = document.getElementById('emailInput').value;
    if (!_0x44dd.includes('@')) return alert("សូមបញ្ចូលអ៊ីមែលឱ្យបានត្រឹមត្រូវ!");
    document.getElementById('emailModal').classList.remove('active');
    document.getElementById('qrModal').classList.add('active');
}

async function _0x5e9f() {
    const _0x66ff = document.getElementById('receiptFile').files[0];
    if (!_0x66ff) return alert("សូម Upload រូបភាពវិក្កយបត្រ!");
    const _0x77ee = document.getElementById('submitBtn');
    _0x77ee.disabled = true;
    _0x77ee.innerText = "កំពុងបញ្ជូន...";
    const _0x88aa = new FormData();
    _0x88aa.append('udid', document.getElementById('udidInput').value);
    _0x88aa.append('email', document.getElementById('emailInput').value);
    _0x88aa.append('price', "10");
    _0x88aa.append('plan', "Standard");
    _0x88aa.append('receipt', _0x66ff);
    try {
        const _0x99bb = await fetch(_0x1a2b + '/verify-payment', {
            method: 'POST',
            body: _0x88aa
        });
        if (_0x99bb.ok) {
            alert("✅ រួចរាល់! ការបញ្ជាទិញរបស់អ្នកត្រូវបានបញ្ជូនទៅកាន់ Admin។");
            location.reload();
        } else {
            alert("មានបញ្ហាក្នុងការបញ្ជូន។ សូមព្យាយាមម្តងទៀត!");
            _0x77ee.disabled = false;
            _0x77ee.innerText = "Confirm & Send";
        }
    } catch (_0x00cc) {
        alert("ជោគជ័យ! (Offline Mode)");
        location.reload();
    }
}

// Anti-Inspect Security
document.addEventListener('contextmenu', e => e.preventDefault());
document.onkeydown = function(e) {
    if (e.keyCode == 123 || (e.ctrlKey && e.shiftKey && (e.keyCode == 73 || e.keyCode == 74 || e.keyCode == 67)) || (e.ctrlKey && e.keyCode == 85)) return false;
};
