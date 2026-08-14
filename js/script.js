// ==========================================
// 1. DEKLARASI VARIABEL GLOBAL & DATABASE
// ==========================================
let dataKeranjang = [];
let namaLapanganAktif = "";

const dataDetailLapangan = {
  amman: {
    nama: "Amman Academy Court",
    harga: 100000,
    gambar: "img/lapangan-1.jpeg",
    lantai: "Vinyl Interlock Premium (Standar BWF)",
    fasilitas: "AC, Kantin, Wi-Fi, Ruang Ganti, Bench Pemain",
    deskripsi:
      "Lapangan vinyl berkualitas tinggi dengan peredam kejut yang aman untuk lutut dan persendian. Sangat cocok untuk pertandingan seru maupun latihan rutin.",
  },
  multipurpose: {
    nama: "Multipurpose Hall",
    harga: 55000,
    gambar: "img/lapangan-2.jpeg",
    lantai: "Polyurethane (PU) Seamless",
    fasilitas: "Lampu LED Terang, Area Parkir Luas, Toilet, Tribune",
    deskripsi:
      "Lantai PU elastis dengan daya cengkeram tinggi (anti-selip). Pilihan ekonomis berkualitas untuk bermain santai atau ganda bersama komunitas.",
  },
  tunaz: {
    nama: "Tunaz Sport",
    harga: 130000,
    gambar: "img/lapangan-3.jpeg",
    lantai: "Vinyl Pro Tournament",
    fasilitas: "Full AC, Shower Air Hangat, VIP Lounge, Sound System",
    deskripsi:
      "Fasilitas kelas privat premium dengan karpet vinyl tournament grade. Penerangan bebas silau untuk pengalaman bermain badminton maksimal.",
  },
};

// ==========================================
// 2. INISIALISASI EVENT SETELAH HTML DIMUAT
// ==========================================
document.addEventListener("DOMContentLoaded", function () {
  // Mobile Navbar Menu
  const navbarNav = document.querySelector(".navbar-nav");
  const bookingMenu = document.querySelector("#booking-menu");

  if (bookingMenu && navbarNav) {
    bookingMenu.addEventListener("click", function (e) {
      navbarNav.classList.toggle("active");
      e.preventDefault();
    });

    document.addEventListener("click", function (e) {
      if (!bookingMenu.contains(e.target) && !navbarNav.contains(e.target)) {
        navbarNav.classList.remove("active");
      }
    });
  }

  // Event Listener penutup panel keranjang jika klik di luar area
  const cartButton = document.getElementById("shopping-cart-button");
  const cartPanel = document.querySelector(".shopping-cart");

  document.addEventListener("click", function (e) {
    if (cartButton && cartPanel) {
      if (!cartButton.contains(e.target) && !cartPanel.contains(e.target)) {
        cartPanel.classList.remove("active");
      }
    }
  });

  // Event Penutup Modal jika klik area luar modal (overlay)
  window.onclick = function (event) {
    const modal = document.getElementById("modalKalkulator");
    if (event.target === modal) {
      tutupKalkulator();
    }
  };
});

// ==========================================
// 3. FUNGSI UTAMA MODAL & KALKULATOR
// ==========================================
function bukaKalkulator(keyLapangan) {
  const lapangan = dataDetailLapangan[keyLapangan];

  // Jika data key tidak ditemukan di database
  if (!lapangan) {
    console.error(`Data lapangan '${keyLapangan}' tidak ditemukan!`);
    return;
  }

  // Set Nama Lapangan Aktif untuk Keranjang
  namaLapanganAktif = lapangan.nama;

  // Isi Informasi Detail ke Modal (dengan pengecekan aman/guard)
  const elemNama = document.getElementById("modalNamaLapangan");
  const elemGambar = document.getElementById("modalGambar");
  const elemDeskripsi = document.getElementById("modalDeskripsi");
  const elemLantai = document.getElementById("modalLantai");
  const elemFasilitas = document.getElementById("modalFasilitas");

  if (elemNama) elemNama.innerText = lapangan.nama;
  if (elemGambar) elemGambar.src = lapangan.gambar;
  if (elemDeskripsi) elemDeskripsi.innerText = lapangan.deskripsi;
  if (elemLantai) elemLantai.innerText = lapangan.lantai;
  if (elemFasilitas) elemFasilitas.innerText = lapangan.fasilitas;

  // Set Harga & Reset Durasi Default
  const inputHarga = document.getElementById("hargaJam");
  const inputDurasi = document.getElementById("durasi");
  if (inputHarga) inputHarga.value = lapangan.harga;
  if (inputDurasi) inputDurasi.value = 2; // Default 2 Jam

  // Tampilkan Modal
  const modal = document.getElementById("modalKalkulator");
  if (modal) modal.style.display = "flex";

  // Hitung total harga otomatis
  hitungTotal();
}

function tutupKalkulator() {
  const modal = document.getElementById("modalKalkulator");
  if (modal) modal.style.display = "none";
}

function hitungTotal() {
  const hargaJam = parseFloat(document.getElementById("hargaJam")?.value) || 0;
  const durasi = parseFloat(document.getElementById("durasi")?.value) || 0;
  const total = hargaJam * durasi;

  const formattedTotal = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(total);

  const totalBayarElem = document.getElementById("totalBayar");
  if (totalBayarElem) {
    totalBayarElem.innerText = formattedTotal;
  }
}

// ==========================================
// 4. FUNGSI KERANJANG & KONFIRMASI PESANAN
// ==========================================
function toggleCart() {
  const cartPanel = document.querySelector(".shopping-cart");
  if (cartPanel) {
    cartPanel.classList.toggle("active");
  }
}

function tambahKeKeranjang() {
  const totalElem = document.getElementById("totalBayar");
  const durasiElem = document.getElementById("durasi");

  const total = totalElem ? totalElem.innerText : "Rp 0";
  const durasi = durasiElem ? durasiElem.value : 0;

  if (total === "Rp 0" || total === "Rp 0,-" || total === "Rp 0,00") {
    alert("Silakan hitung total biaya terlebih dahulu!");
    return;
  }

  const itemBaru = {
    nama: namaLapanganAktif || "Lapangan Badminton",
    durasi: durasi,
    total: total,
  };
  dataKeranjang.push(itemBaru);

  // Update counter badge
  const badgeCart = document.getElementById("cart-count");
  if (badgeCart) {
    badgeCart.innerText = dataKeranjang.length;
  }

  alert(`${itemBaru.nama} (${durasi} Jam) berhasil dimasukkan ke keranjang!`);

  renderCart();
  tutupKalkulator();
}

function renderCart() {
  const container = document.getElementById("cart-items-container");
  const grandTotalElem = document.getElementById("cart-grand-total");
  if (!container) return;

  if (dataKeranjang.length === 0) {
    container.innerHTML = `<p class="empty-cart-msg">Keranjang kamu masih kosong.</p>`;
    if (grandTotalElem) grandTotalElem.innerText = "Rp 0";
    return;
  }

  let html = "";
  let grandTotal = 0;

  dataKeranjang.forEach((item, index) => {
    html += `
      <div class="cart-item">
        <div class="cart-item-info">
          <h4>${item.nama}</h4>
          <p>${item.durasi} Jam — ${item.total}</p>
        </div>
        <button class="btn-hapus" onclick="hapusItemKeranjang(${index})">🗑️</button>
      </div>
    `;

    const nominal = parseInt(item.total.replace(/[^0-9]/g, "")) || 0;
    grandTotal += nominal;
  });

  container.innerHTML = html;

  if (grandTotalElem) {
    grandTotalElem.innerText = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(grandTotal);
  }
}

function hapusItemKeranjang(index) {
  dataKeranjang.splice(index, 1);

  const badgeCart = document.getElementById("cart-count");
  if (badgeCart) {
    badgeCart.innerText = dataKeranjang.length;
  }

  renderCart();
}

function konfirmasiPesanan() {
  const totalElem = document.getElementById("totalBayar");
  const total = totalElem ? totalElem.innerText : "Rp 0";

  if (total === "Rp 0" || total === "Rp 0,-" || total === "Rp 0,00") {
    alert("Silakan hitung total biaya terlebih dahulu!");
  } else {
    alert("Pesanan berhasil dikonfirmasi!");
    tutupKalkulator();
  }
}

// ==========================================
// 5. EVENT LISTENER SEARCH MODAL
// ==========================================
document.addEventListener("DOMContentLoaded", function () {
  // Buka search modal saat tombol ikon search di navbar diklik
  const btnSearch = document.getElementById("search");
  if (btnSearch) {
    btnSearch.addEventListener("click", function (e) {
      e.preventDefault();
      bukaSearch();
    });
  }

  // Tutup search modal jika klik area overlay luar modal
  const modalSearch = document.getElementById("modalSearch");
  if (modalSearch) {
    modalSearch.addEventListener("click", function (e) {
      if (e.target === modalSearch) {
        tutupSearch();
      }
    });
  }
});

// ==========================================
// FUNGSI UTAMA LIVE SEARCH
// ==========================================
function bukaSearch() {
  const modal = document.getElementById("modalSearch");
  const input = document.getElementById("searchInput");
  if (modal) {
    modal.style.display = "flex";
    if (input) {
      input.value = "";
      input.focus();
    }
    // Tampilkan pesan awal
    document.getElementById("searchResults").innerHTML =
      `<p class="search-placeholder">Mulai mengetik untuk mencari...</p>`;
  }
}

function tutupSearch() {
  const modal = document.getElementById("modalSearch");
  if (modal) modal.style.display = "none";
}

function liveSearch() {
  const keyword = document
    .getElementById("searchInput")
    .value.toLowerCase()
    .trim();
  const container = document.getElementById("searchResults");

  if (keyword === "") {
    container.innerHTML = `<p class="search-placeholder">Mulai mengetik untuk mencari...</p>`;
    return;
  }

  // Filter objek dataDetailLapangan
  const hasil = Object.keys(dataDetailLapangan).filter((key) => {
    const item = dataDetailLapangan[key];
    return (
      item.nama.toLowerCase().includes(keyword) ||
      item.lantai.toLowerCase().includes(keyword) ||
      item.deskripsi.toLowerCase().includes(keyword)
    );
  });

  if (hasil.length === 0) {
    container.innerHTML = `<p class="no-results">Sewa lapangan "${keyword}" tidak ditemukan.</p>`;
    return;
  }

  // Render hasil ke HTML
  let html = "";
  hasil.forEach((key) => {
    const item = dataDetailLapangan[key];
    const hargaFormat = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(item.harga);

    html += `
      <div class="search-result-card" onclick="pilihHasilSearch('${key}')">
        <img src="${item.gambar}" alt="${item.nama}" />
        <div class="search-result-info">
          <h4>${item.nama}</h4>
          <p>${hargaFormat} / Jam</p>
          <span>Lantai: ${item.lantai}</span>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

// Fungsi ketika salah satu hasil pencarian diklik
function pilihHasilSearch(keyLapangan) {
  tutupSearch();
  bukaKalkulator(keyLapangan);
}
