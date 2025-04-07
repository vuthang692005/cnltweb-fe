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
async function loadLuong() {
    const token = localStorage.getItem("token");

    const response = await fetch("http://thang689904-001-site1.jtempurl.com/api/NhanVien/luong", {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`, // Đính kèm token trong header
            "Content-Type": "application/json"
        }
    });
    if (!response.ok) throw new Error("Không tìm thấy dữ liệu");
    const data = await response.json();

    let tableBody = document.getElementById("luongTable");
    tableBody.innerHTML = "";

    data.forEach(nv => {
        let row = `
                    <tr>
                        <td>${nv.thang}</td>
                        <td>${nv.nam}</td>
                        <td>${nv.luongCoBan}</td>
                        <td>${nv.luongTangCa}</td>
                        <td>${nv.tienPhat}</td>
                        <td>${nv.luongTongCong}</td>
                        <td>
                            <a onclick="chiTiet('${nv.thang}','${nv.nam}')" style="background-color: #007bff">📄 Chi tiết</a>
                        </td>
                    </tr>`;
        tableBody.innerHTML += row;
    });
}

async function chiTiet(thang, nam) {
    const token = localStorage.getItem("token");

    const response = await fetch(`http://thang689904-001-site1.jtempurl.com/api/NhanVien/chiTietLuong?thang=${thang}&nam=${nam}`, {
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

loadLuong();