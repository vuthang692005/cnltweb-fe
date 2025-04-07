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
  await loadQuyDinh();
});

async function loadQuyDinh() {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch("http://thang689904-001-site1.jtempurl.com/api/admin/quydinh", {
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

    document.getElementById("diMuon").value = data.mucPhatDiMuon;
    document.getElementById("nghiQuaPhep").value = data.tienPhatNghiQuaPhep;
    document.getElementById("nghiKhongPhep").value = data.tienPhatNghiKhongPhep;
    document.getElementById("tangCa").value = data.tienThuongTangCa;
    document.getElementById("soNgayPhepMotThang").value = data.soNgayPhepMotThang;

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
  let MucPhatDiMuon = parseFloat(document.getElementById("diMuon").value);
  let TienPhatNghiQuaPhep = parseFloat(document.getElementById("nghiQuaPhep").value);
  let TienPhatNghiKhongPhep = parseFloat(document.getElementById("nghiKhongPhep").value);
  let TienThuongTangCa = parseFloat(document.getElementById("tangCa").value);
  let SoNgayPhepMotThang = parseInt(document.getElementById("soNgayPhepMotThang").value);
  const token = localStorage.getItem("token");

  if (MucPhatDiMuon < 0 || TienPhatNghiQuaPhep < 0 || TienPhatNghiKhongPhep < 0 || TienThuongTangCa < 0 || SoNgayPhepMotThang < 0) {
    alert("Phải nhập số lớn hơn 0.");
    return;
  }

  const data = {
    mucPhatDiMuon: MucPhatDiMuon || 0,
    tienPhatNghiQuaPhep: TienPhatNghiQuaPhep || 0,
    tienPhatNghiKhongPhep: TienPhatNghiKhongPhep || 0,
    tienThuongTangCa: TienThuongTangCa || 0,
    soNgayPhepMotThang: SoNgayPhepMotThang || 0
  };

  try {
    const response = await fetch("http://thang689904-001-site1.jtempurl.com/api/admin/quydinh", {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error("Cập nhật thất bại!");
    }

    alert("Cập nhật thành công!");

    location.reload();

  } catch (error) {
    console.error("Lỗi:", error);
    alert("Lưu thất bại, vui lòng thử lại!");
  }
}

function logout() {
  localStorage.clear();
  window.location.href = '/src/views/auth/login.html';
}