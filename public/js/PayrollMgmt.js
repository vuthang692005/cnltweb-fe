const menuButton = document.getElementById('menuButton');
const menuDropdown = document.getElementById('menuDropdown');

// Toggle menu khi click vào button
menuButton.addEventListener('click', (event) => {
  event.stopPropagation(); 
  menuDropdown.classList.toggle('active');
});

// Đóng menu khi click ra ngoài
document.addEventListener('click', (event) => {
  if (!menuDropdown.contains(event.target) && event.target !== menuButton) {
    menuDropdown.classList.remove('active');
  }
});

const selectNam = document.getElementById("nam");
const currentYear = new Date().getFullYear();

for (let y = currentYear; y >= 2020; y--) {
    let option = document.createElement("option");
    option.value = y;
    option.textContent = y;
    selectNam.appendChild(option);
}

let currentPage = 1;
let totalPages = 1;

async function loadLuong(page) {
    const token = localStorage.getItem("token");
    currentPage = page;
    let maNhanVien = document.getElementById("maNhanVien").value;
    let hoTen = document.getElementById("hoTen").value;
    let thang = document.getElementById("thang").value;
    let nam = document.getElementById("nam").value.toLowerCase();

    let url = `http://thang689904-001-site1.jtempurl.com/api/admin/luong?page=${page}`;
    if (maNhanVien) url += `&maNhanVien=${maNhanVien}`;
    if (hoTen) url += `&hoTen=${hoTen}`;
    if (thang) url += `&thang=${thang}`;
    if (nam) url += `&nam=${nam}`;

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`, // Đính kèm token trong header
                "Content-Type": "application/json"
            }
        });
        if (!response.ok) throw new Error("Không tìm thấy dữ liệu");
        const data = await response.json();

        totalPages = data.totalPages;
        document.getElementById("pageInfo").innerText = `Trang ${currentPage} / ${totalPages}`;

        let tableBody = document.getElementById("luongTable");
        tableBody.innerHTML = "";

        data.data.forEach(nv => {
            let row = `
                    <tr>
                        <td>${nv.maNhanVien}</td>
                        <td>${nv.hoTen}</td>
                        <td>${nv.nam}</td>
                        <td>${nv.thang}</td>
                        <td>${nv.luongCoBan}</td>
                        <td>${nv.luongTangCa}</td>
                        <td>${nv.tienPhat}</td>
                        <td>${nv.tongCong}</td>
                        <td>
                            <a onclick="chiTiet('${nv.maNhanVien}','${nv.thang}','${nv.nam}')" style="background-color: #007bff">📄 Chi tiết</a>
                        </td>
                    </tr>`;
            tableBody.innerHTML += row;
        });
    } catch (error) {
        alert(error.message);
    }
}

async function tinhLuong() {
    const token = localStorage.getItem("token");

    const response = await fetch(`http://thang689904-001-site1.jtempurl.com/api/admin/TinhLuongThang`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    });
    if (!response.ok) {
        let result = await response.text();
        console.error("Lỗi Server:", result);
        alert(result);
    } else {
        const result = await response.json();
        alert(result.message);
    }
    loadLuong(currentPage);
}

function prevPage() {
    if (currentPage > 1) {
        loadLuong(currentPage - 1);
    }
}

function nextPage() {
    if (currentPage < totalPages) {
        loadLuong(currentPage + 1);
    }
}

async function chiTiet(maNhanVien, thang, nam) {
    const token = localStorage.getItem("token");

    const response = await fetch(`http://thang689904-001-site1.jtempurl.com/api/admin/chiTietLuong?maNhanVien=${maNhanVien}&thang=${thang}&nam=${nam}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`, // Đính kèm token trong header
            "Content-Type": "application/json"
        }
    });

    if (!response.ok) {
        let result = await response.text();
        console.error("Lỗi Server:", result);
        alert(result);
        closeForm();
    }

    const data = await response.json();

    document.getElementById("tongGioTangCa").value = data.tongGioTangCa;
    document.getElementById("soNgayDiMuon").value = data.ngayDiMuon;
    document.getElementById("soNgayNghiPhep").value = data.nghiPhep;
    document.getElementById("soNgayVang").value = data.nghiKoPhep;

    document.getElementById("overlay").style.display = "block";
    document.getElementById("formChiTiet").style.display = "block";
}

function closeForm() {
    document.getElementById("overlay").style.display = "none";
    document.getElementById("formChiTiet").style.display = "none";
}

function logout() {
    localStorage.clear();
    window.location.href = '/src/views/auth/login.html';
}

loadLuong(1);