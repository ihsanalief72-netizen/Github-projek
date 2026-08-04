// Fungsi untuk Membuka Modal
function bukaKalkulator(event) {
  event.preventDefault(); // Mencegah halaman ter-refresh saat diklik
  const modal = document.getElementById("modalKalkulator");
  if (modal) {
    modal.style.display = "flex";
  } else {
    alert("Elemen modalKalkulator tidak ditemukan di HTML!");
  }
}

// Fungsi untuk Menutup Modal
function tutupKalkulator() {
  const modal = document.getElementById("modalKalkulator");
  if (modal) {
    modal.style.display = "none";
  }
}

// Fungsi untuk Hitung Total Biaya
function hitungTotal() {
  const hargaJam = parseFloat(document.getElementById("hargaJam").value) || 0;
  const durasi = parseFloat(document.getElementById("durasi").value) || 0;
  const total = hargaJam * durasi;

  const formattedTotal = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(total);

  document.getElementById("totalBayar").innerText = formattedTotal;
}
