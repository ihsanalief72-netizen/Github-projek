document.addEventListener("DOMContentLoaded", function () {
  // 1. Ambil elemen modal & input dari HTML
  const modal = document.getElementById("modalKalkulator");
  const inputHarga = document.getElementById("hargaJam");
  const bookingButtons = document.querySelectorAll(".btn-booking");

  // 2. Event ketika tombol "Detail & Booking" diklik
  bookingButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault(); // Mencegah reload/jumping

      // Ambil harga dari atribut data-price
      const harga = this.getAttribute("data-price");

      // Masukkan harga ke input di dalam modal
      if (inputHarga) {
        inputHarga.value = harga;
      }

      // Tampilkan modal pop-up
      if (modal) {
        modal.style.display = "flex"; // Atau 'block'
      }
    });
  });
});

// 3. Fungsi untuk menutup modal
function tutupKalkulator() {
  const modal = document.getElementById("modalKalkulator");
  if (modal) {
    modal.style.display = "none";
  }
}

// 4. Fungsi untuk menghitung total biaya
function hitungTotal() {
  const harga = parseFloat(document.getElementById("hargaJam").value) || 0;
  const durasi = parseFloat(document.getElementById("durasi").value) || 0;
  const total = harga * durasi;

  const totalBayarElem = document.getElementById("totalBayar");
  if (totalBayarElem) {
    totalBayarElem.innerText = "Rp " + total.toLocaleString("id-ID");
  }
}
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

// Fungsi detail & booking
const detailBooking = {};
