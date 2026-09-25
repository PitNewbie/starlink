function toggleMenu(){ document.getElementById('navMenu').classList.toggle('active'); }
function closeMenu(){ document.getElementById('navMenu').classList.remove('active'); }

// MODAL KOPI LOGIC
function bukaModalKopi() {
  document.getElementById('modalKopi').style.display = 'flex';
}
function tutupModalKopi() {
  document.getElementById('modalKopi').style.display = 'none';
}

// FUNGSI DOWNLOAD GAMBAR QRIS
function downloadQRIS() {
  const qrUrl = document.getElementById('gambarQRIS').src;
  
  // Fetch gambar supaya bisa langsung didownload sebagai file (tidak numpang buka tab baru)
  fetch(qrUrl)
    .then(response => response.blob())
    .then(blob => {
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = blobUrl;
      a.download = 'QRIS_Kopi_Admin.jpg'; // Nama file pas di-download
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(blobUrl);
      document.body.removeChild(a);
      alert('Gambar QRIS berhasil didownload! Silakan buka aplikasi pembayaran Anda untuk scan.');
    })
    .catch(() => {
      // Fallback kalau kena error sistem keamanan browser
      alert('Tidak dapat mendownload otomatis. Silakan screenshot atau tahan gambar (Long Press) untuk menyimpan.');
    });
}

// LOGIKA REDIRECT PADA LOAD HALAMAN
window.onload = function() {
    const urlParams = new URLSearchParams(window.location.search);
    const encodedId = urlParams.get('id');
    
    if (encodedId) {
        document.getElementById('mainApp').style.display = 'none';
        document.getElementById('redirectView').style.display = 'block';
        
        try {
            const decodedData = JSON.parse(atob(encodedId));
            
            if (decodedData.p) {
                let targetUrl = `https://wa.me/${decodedData.p}`;
                if (decodedData.m) {
                    targetUrl += `?text=${encodeURIComponent(decodedData.m)}`;
                }
                
                setTimeout(() => {
                    window.location.href = targetUrl;
                }, 1200);
            }
        } catch (e) {
            alert("Tautan tidak valid atau rusak.");
            document.getElementById('mainApp').style.display = 'block';
            document.getElementById('redirectView').style.display = 'none';
        }
    }
};

// GENERATE LINK WA
function generateLink() {
    let phone = document.getElementById('waNumber').value.trim();
    let msg = document.getElementById('waMessage').value.trim();

    if (!phone) {
        alert("Nomor WhatsApp wajib diisi!");
        return;
    }

    phone = phone.replace(/[^0-9]/g, '');

    const payload = { p: phone, m: msg };
    const encodedString = btoa(JSON.stringify(payload));

    const baseUrl = window.location.href.split('?')[0];
    const finalUrl = `${baseUrl}?id=${encodedString}`;

    document.getElementById('generatedLink').innerText = finalUrl;
    document.getElementById('resultBox').style.display = 'block';
}

// COPY MANUAL BUTTON
function copyManual() {
    const linkText = document.getElementById('generatedLink').innerText;
    if (!linkText) return;

    navigator.clipboard.writeText(linkText).then(() => {
        const btn = document.getElementById('copyBtn');
        const originalText = btn.innerText;
        
        btn.innerText = "✓ Tersalin!";
        btn.style.color = "#10b981";
        btn.style.borderColor = "#10b981";

        setTimeout(() => {
            btn.innerText = originalText;
            btn.style.color = "";
            btn.style.borderColor = "";
        }, 2000);
    }).catch(() => {
        alert("Gagal menyalin tautan.");
    });
}