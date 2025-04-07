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

let currentPage = 1;
let totalPages = 1;

async function loadNhanVien(page) {
  const token = localStorage.getItem("token");
  currentPage = page;
  let maNhanVien = document.getElementById("maNhanVien").value;
  let hoTen = document.getElementById("hoTen").value;
  let maPhongBan = document.getElementById("maPhongBan").value;
  let chucvu = document.getElementById("chucvu").value.toLowerCase();

  let url = `http://thang689904-001-site1.jtempurl.com/api/admin/nhanvien?page=${page}`;
  if (maNhanVien) url += `&maNhanVien=${maNhanVien}`;
  if (hoTen) url += `&hoTen=${hoTen}`;
  if (maPhongBan) url += `&maPhongBan=${maPhongBan}`;
  if (chucvu) url += `&chucVu=${chucvu}`;

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

    let tableBody = document.getElementById("nhanVienTable");
    tableBody.innerHTML = "";

    data.data.forEach(nv => {
      let row = `
                    <tr>
                        <td>${nv.maNhanVien}</td>
                        <td>${nv.hoTen}</td>
                        <td>${nv.ngaySinh}</td>
                        <td>${nv.gioiTinh}</td>
                        <td>${nv.soDienThoai}</td>
                        <td>${nv.email}</td>
                        <td>${nv.maPhongBan}</td>
                        <td>${nv.chucVu}</td>
                        <td>${nv.ngayVaoLam}</td>
                        <td>${nv.luongCoBan}</td>
                        <td>
                            <a onclick="formSua()">✏️ Sửa</a>
                            <a onclick="xoa('${nv.maNhanVien}')">🗑️ Xóa</a>
                        </td>
                    </tr>`;
      tableBody.innerHTML += row;
    });
  } catch (error) {
    alert(error.message);
  }
}
function formThem() {
  document.getElementById("overlay").style.display = "block";
  document.getElementById("formThem").style.display = "block";
}

async function themNhanVien() {
  // Lấy dữ liệu từ form
  let hoTen = document.getElementById("name").value.trim();
  let ngaySinh = document.getElementById("ngaySinh").value;
  let gioiTinh = document.getElementById("gioiTinh").value;
  let soDienThoai = document.getElementById("sdt").value.trim();
  let email = document.getElementById("email").value.trim();
  let maPhongBan = document.getElementById("phongBan2").value;
  let chucVu = document.getElementById("ChucVu").value.trim();
  let luongCoBan = document.getElementById("Luong").value.trim();
  const token = localStorage.getItem("token");

  // Kiểm tra dữ liệu không được trống
  if (!hoTen || !ngaySinh || !gioiTinh || !soDienThoai || !email || !maPhongBan || !chucVu || !luongCoBan) {
    alert("Vui lòng điền đầy đủ thông tin.");
    return;
  }

  // Kiểm tra số điện thoại (phải có đúng 10 chữ số, không chứa chữ hoặc ký tự đặc biệt)
  let phoneRegex = /^[0-9]{10}$/;
  if (!phoneRegex.test(soDienThoai)) {
    alert("Số điện thoại phải có đúng 10 chữ số và không chứa ký tự khác.");
    return;
  }

  // Kiểm tra email (phải kết thúc bằng @gmail.com)
  let emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
  if (!emailRegex.test(email)) {
    alert("Email phải có dạng xxx@gmail.com.");
    return;
  }

  // Kiểm tra lương có phải số hợp lệ không
  let luongSo = parseFloat(luongCoBan);
  if (isNaN(luongSo) || luongSo <= 0) {
    alert("Lương phải là một số hợp lệ và lớn hơn 0.");
    return;
  }

  // Tạo đối tượng gửi lên API
  let nhanVienDto = {
    HoTen: hoTen,
    NgaySinh: ngaySinh,
    GioiTinh: gioiTinh,
    SoDienThoai: soDienThoai,
    Email: email,
    MaPhongBan: parseInt(maPhongBan), // Chuyển về số nguyên
    ChucVu: chucVu,
    LuongCoBan: parseFloat(luongCoBan) // Chuyển về số thực nếu cần
  };

  try {
    let response = await fetch("http://thang689904-001-site1.jtempurl.com/api/admin/nhanvien", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(nhanVienDto)
    });

    let result;
    let contentType = response.headers.get("content-type");

    if (contentType && contentType.includes("application/json")) {
      result = await response.json();
    } else {
      result = await response.text(); // Đọc phản hồi dạng chuỗi nếu không phải JSON
    }

    if (response.ok) {
      alert("Thêm thành công!");
      closeForm();
      loadNhanVien(currentPage);
    } else {
      alert(result || "Có lỗi xảy ra!");
    }
  } catch (error) {
    console.error("Lỗi:", error);
    alert("Không thể kết nối đến máy chủ.");
  }

}

let currentRow = null;
function formSua() {
  currentRow = event.target.closest("tr");

  let MaNV = currentRow.children[0].textContent.trim();
  let tenPhongBan = currentRow.children[6].textContent.trim();
  let chucVu = currentRow.children[7].textContent.trim();
  let luong = currentRow.children[9].textContent.trim();

  document.getElementById("MaNV").value = MaNV;
  document.getElementById("chucVu").value = chucVu;
  document.getElementById("phongBan").value = tenPhongBan;
  document.getElementById("luong").value = luong;

  document.getElementById("overlay").style.display = "block";
  document.getElementById("formsua").style.display = "block";
}

async function luuChinhSua() {
  if (!currentRow) return;
  let MaNV = document.getElementById("MaNV").value;
  let tenPhongBan = document.getElementById("phongBan").value;
  let chucVu = document.getElementById("chucVu").value;
  let luong = document.getElementById("luong").value;
  const token = localStorage.getItem("token");

  if (!MaNV) {
    alert("Không có mã nhân viên!");
    return;
  }

  if (!chucVu || !phongBan || !luong) {
    alert("Vui lòng điền đầy đủ thông tin!");
    return;
  }

  // Kiểm tra lương có phải số hợp lệ không
  let luongSo = parseFloat(luong);
  if (isNaN(luongSo) || luongSo <= 0) {
    alert("Lương phải là một số hợp lệ và lớn hơn 0.");
    return;
  }

  let requestData = {
    tenPhongBan: tenPhongBan,
    chucVu: chucVu,
    luongCoBan: parseFloat(luong)
  };

  try {
    let response = await fetch(`http://thang689904-001-site1.jtempurl.com/api/admin/nhanvien/${MaNV}`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestData)
    });

    let result = await response.json();

    if (response.ok) {
      alert("Cập nhật thành công!");
      closeForm();
      loadNhanVien(currentPage);
    } else {
      alert(result.message || "Cập nhật thất bại!");
    }
  } catch (error) {
    console.error("Lỗi khi cập nhật:", error);
    alert("Có lỗi xảy ra, vui lòng thử lại!");
  }

  closeForm();
  loadNhanVien(currentPage);
}

async function xoa(maNhanVien) {
  const token = localStorage.getItem("token");
  if (confirm("Bạn có chắc chắn muốn xóa nhân viên này?")) {
    try {
      const response = await fetch(`http://thang689904-001-site1.jtempurl.com/api/admin/nhanvien/${maNhanVien}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`, // Đính kèm token trong header
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) throw new Error("Xóa thất bại!");

      alert("Xóa thành công!");
      loadNhanVien(currentPage); // Tải lại danh sách sau khi xóa
    } catch (error) {
      alert(error.message);
    }
  }
}

function prevPage() {
  if (currentPage > 1) {
    loadNhanVien(currentPage - 1);
  }
}

function nextPage() {
  if (currentPage < totalPages) {
    loadNhanVien(currentPage + 1);
  }
}

function closeForm() {
  document.getElementById("createForm").reset();
  document.getElementById("overlay").style.display = "none";
  document.getElementById("formsua").style.display = "none";
  document.getElementById("formThem").style.display = "none";
  currentRow = null;
}

function logout() {
  localStorage.clear();
  window.location.href = '/src/views/auth/login.html';
}

loadNhanVien(1);