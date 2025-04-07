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

document.addEventListener("DOMContentLoaded", async function () {
  await loadForm();
});

async function loadForm() {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch("http://thang689904-001-site1.jtempurl.com/api/NhanVien/nhanvien", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`, // Đính kèm token trong header
        "Content-Type": "application/json"
      }
    });
    if (!response.ok) {
      throw new Error("Không thể lấy dữ liệu");
    }

    const data = await response.json();

    document.getElementById("ID").value = data.maNhanVien;
    document.getElementById("hoTen").value = data.hoTen;
    document.getElementById("ngaySinh").value = data.ngaySinh;
    document.getElementById("gioiTinh").value = data.gioiTinh;
    document.getElementById("phongBan").value = data.tenPhongBan;
    document.getElementById("chucVu").value = data.chucVu;
    document.getElementById("ngayVaoLam").value = data.ngayVaoLam;
    document.getElementById("luongCoBan").value = data.luongCoBan;
    document.getElementById("Email").value = data.email;
    document.getElementById("SDT").value = data.soDienThoai;

  } catch (error) {
    console.error("Lỗi:", error);
    alert("Không thể lấy dữ liệu!");
  }
}

function Sua() {
  let inputs = document.querySelectorAll("#editForm input");
  inputs.forEach(input => {
    input.removeAttribute("readonly");
  });
  document.getElementById("sua").style.display = "none";
  document.getElementById("luu").style.display = "block";
}

async function Luu() {
  const token = localStorage.getItem("token");
  let Email = document.getElementById("Email").value;
  let SDT = document.getElementById("SDT").value;

  if (!SDT || !Email) {
    alert("Vui lòng điền đầy đủ thông tin.");
    return;
  }

  let phoneRegex = /^[0-9]{10}$/;
  if (!phoneRegex.test(SDT)) {
    alert("Số điện thoại phải có đúng 10 chữ số và không chứa ký tự khác.");
    return;
  }

  let emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
  if (!emailRegex.test(Email)) {
    alert("Email phải có dạng xxx@gmail.com.");
    return;
  }

  const data = {
    email: Email,
    soDienThoai: SDT,
  };


  const response = await fetch("http://thang689904-001-site1.jtempurl.com/api/NhanVien/nhanvien", {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  let result = await response.text();

  if (!response.ok) {
    console.error("Lỗi Server:", result);
    alert(result);
  } else {
    console.log("Thành công:", result);
    alert("Cập nhật thành công!");
    location.reload();
  }
}

function logout() {
  localStorage.clear();
  window.location.href = '/src/views/auth/login.html';
}