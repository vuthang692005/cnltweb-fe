const menuButton = document.getElementById('menuButton');
const menuDropdown = document.getElementById('menuDropdown');

menuButton.addEventListener('click', () => {
  menuDropdown.classList.toggle('active');
});

document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', function () {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    this.classList.add('active');
  });
});

document.querySelectorAll('.tab1').forEach(tab => {
  tab.addEventListener('click', function () {
    document.querySelectorAll('.tab1').forEach(t => t.classList.remove('active'));
    this.classList.add('active');
  });
});

document.querySelectorAll('.tab2').forEach(tab => {
  tab.addEventListener('click', function () {
    document.querySelectorAll('.tab2').forEach(t => t.classList.remove('active'));
    this.classList.add('active');
  });
});

async function fetchDangKyTangCaCD() {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch("https://localhost:7219/api/NhanVien/ChoDuyetDKTangCa", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`, // Đính kèm token trong header
        "Content-Type": "application/json"
      }
    });
    if (!response.ok) {
      throw new Error("Không tìm thấy dữ liệu.");
    }

    const data = await response.json();
    const tableBody = document.getElementById("tangCaTable");
    tableBody.innerHTML = ""; // Xóa dữ liệu cũ

    data.forEach(item => {
      const row = document.createElement("tr");
      row.innerHTML = `
                    <td class="ngayLam">${new Date(item.ngayChamCong).toLocaleDateString()}</td>
                    <td>${item.tinhTrang}</td>
                    <td style="color:red; cursor:pointer;" onclick="huyDangKyTangCa('${item.ngayChamCong}')">Hủy</td>
                `;
      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu:", error);
    document.getElementById("tangCaTable").innerHTML = "<tr><td colspan='2'>Không có dữ liệu</td></tr>";
  }
}

async function fetchDangKyTangCaDD() {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch("https://localhost:7219/api/NhanVien/DaDuyetDKTangCa", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`, // Đính kèm token trong header
        "Content-Type": "application/json"
      }
    });
    if (!response.ok) {
      throw new Error("Không tìm thấy dữ liệu.");
    }

    const data = await response.json();
    const tableBody = document.getElementById("tangCaTable");
    tableBody.innerHTML = ""; // Xóa dữ liệu cũ

    data.forEach(item => {
      const row = document.createElement("tr");
      row.innerHTML = `
                    <td class="ngayLam">${new Date(item.ngayChamCong).toLocaleDateString()}</td>
                    <td>${item.tinhTrang}</td>
                `;
      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu:", error);
    document.getElementById("tangCaTable").innerHTML = "<tr><td colspan='2'>Không có dữ liệu</td></tr>";
  }
}

async function fetchDangKyTangCaTC() {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch("https://localhost:7219/api/NhanVien/TuChoiDKTangCa", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`, // Đính kèm token trong header
        "Content-Type": "application/json"
      }
    });
    if (!response.ok) {
      throw new Error("Không tìm thấy dữ liệu.");
    }

    const data = await response.json();
    const tableBody = document.getElementById("tangCaTable");
    tableBody.innerHTML = ""; // Xóa dữ liệu cũ

    data.forEach(item => {
      const row = document.createElement("tr");
      row.innerHTML = `
                    <td class="ngayLam">${new Date(item.ngayChamCong).toLocaleDateString()}</td>
                    <td>${item.tinhTrang}</td>
                `;
      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu:", error);
    document.getElementById("tangCaTable").innerHTML = "<tr><td colspan='2'>Không có dữ liệu</td></tr>";
  }
}

async function huyDangKyTangCa(ngayLam) {
  if (!confirm("Bạn có chắc chắn muốn hủy đăng ký tăng ca này không?")) {
    return;
  }
  const token = localStorage.getItem("token");
  try {
    const response = await fetch(`https://localhost:7219/api/NhanVien/XoaDKTangCa?ngayLam=${ngayLam}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`, // Đính kèm token trong header
        "Content-Type": "application/json"
      }
    });

    const message = await response.text();

    if (!response.ok) {
      throw new Error(message);
    }

    alert(message); // Hiển thị thông báo thành công
    fetchDangKyTangCaCD();

  } catch (error) {
    alert("Lỗi: " + error.message);
    console.error("Lỗi:", error);
  }
}

async function fetchQuenCheckOutCD() {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch(`https://localhost:7219/api/NhanVien/ChoDuyetQuenCO`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`, // Đính kèm token trong header
        "Content-Type": "application/json"
      }
    });
    if (!response.ok) {
      throw new Error("Không tìm thấy dữ liệu.");
    }

    const data = await response.json();
    const tableBody = document.getElementById("quenCheckOutTable");
    tableBody.innerHTML = ""; // Xóa dữ liệu cũ

    data.forEach(item => {
      const row = document.createElement("tr");
      row.innerHTML = `
                    <td class="ngayLam">${new Date(item.ngayChamCong).toLocaleDateString()}</td>
                    <td>${item.liDo}</td>
                    <td>${item.tinhTrang}</td>
                    <td style="color:red; cursor:pointer;" onclick="huyQuenCheckOut('${item.ngayChamCong}')">Hủy</td>
                `;
      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu:", error);
    document.getElementById("quenCheckOutTable").innerHTML = "<tr><td colspan='3'>Không có dữ liệu</td></tr>";
  }
}

async function fetchQuenCheckOutDD() {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch(`https://localhost:7219/api/NhanVien/DaDuyetQuenCO`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`, // Đính kèm token trong header
        "Content-Type": "application/json"
      }
    });
    if (!response.ok) {
      throw new Error("Không tìm thấy dữ liệu.");
    }

    const data = await response.json();
    const tableBody = document.getElementById("quenCheckOutTable");
    tableBody.innerHTML = ""; // Xóa dữ liệu cũ

    data.forEach(item => {
      const row = document.createElement("tr");
      row.innerHTML = `
                    <td class="ngayLam">${new Date(item.ngayChamCong).toLocaleDateString()}</td>
                    <td>${item.liDo}</td>
                    <td>${item.tinhTrang}</td>
                `;
      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu:", error);
    document.getElementById("quenCheckOutTable").innerHTML = "<tr><td colspan='3'>Không có dữ liệu</td></tr>";
  }
}

async function fetchQuenCheckOutTC() {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch(`https://localhost:7219/api/NhanVien/TuChoiQuenCO`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`, // Đính kèm token trong header
        "Content-Type": "application/json"
      }
    });
    if (!response.ok) {
      throw new Error("Không tìm thấy dữ liệu.");
    }

    const data = await response.json();
    const tableBody = document.getElementById("quenCheckOutTable");
    tableBody.innerHTML = ""; // Xóa dữ liệu cũ

    data.forEach(item => {
      const row = document.createElement("tr");
      row.innerHTML = `
                    <td class="ngayLam">${new Date(item.ngayChamCong).toLocaleDateString()}</td>
                    <td>${item.liDo}</td>
                    <td>${item.tinhTrang}</td>
                `;
      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu:", error);
    document.getElementById("quenCheckOutTable").innerHTML = "<tr><td colspan='3'>Không có dữ liệu</td></tr>";
  }
}

async function huyQuenCheckOut(ngayLam) {
  if (!confirm("Bạn có chắc chắn muốn hủy quên check-out này không?")) {
    return;
  }
  const token = localStorage.getItem("token");

  try {
    const response = await fetch(`https://localhost:7219/api/NhanVien/XoaQuenCO?ngayLam=${ngayLam}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`, // Đính kèm token trong header
        "Content-Type": "application/json"
      }
    });

    const message = await response.text();

    if (!response.ok) {
      throw new Error(message);
    }

    alert(message); // Hiển thị thông báo thành công
    fetchQuenCheckOutCD();

  } catch (error) {
    alert("Lỗi: " + error.message);
    console.error("Lỗi:", error);
  }
}

async function fetchNghiPhepCD() {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch(`https://localhost:7219/api/NhanVien/ChoDuyetNghiPhep`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`, // Đính kèm token trong header
        "Content-Type": "application/json"
      }
    });
    if (!response.ok) {
      throw new Error("Không tìm thấy dữ liệu.");
    }

    const data = await response.json();
    const tableBody = document.getElementById("nghiPhepTable");
    tableBody.innerHTML = ""; // Xóa dữ liệu cũ

    data.forEach(item => {
      const row = document.createElement("tr");
      row.innerHTML = `
                    <td class="ngayLam">${new Date(item.ngayChamCong).toLocaleDateString()}</td>
                    <td>${item.liDo}</td>
                    <td>${item.tinhTrang}</td>
                    <td style="color:red; cursor:pointer;" onclick="huyNghiPhep('${item.ngayChamCong}')">Hủy</td>
                `;
      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu:", error);
    document.getElementById("nghiPhepTable").innerHTML = "<tr><td colspan='3'>Không có dữ liệu</td></tr>";
  }
}

async function fetchNghiPhepDD() {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch(`https://localhost:7219/api/NhanVien/DaDuyetNghiPhep`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`, // Đính kèm token trong header
        "Content-Type": "application/json"
      }
    });
    if (!response.ok) {
      throw new Error("Không tìm thấy dữ liệu.");
    }

    const data = await response.json();
    const tableBody = document.getElementById("nghiPhepTable");
    tableBody.innerHTML = ""; // Xóa dữ liệu cũ

    data.forEach(item => {
      const row = document.createElement("tr");
      row.innerHTML = `
                    <td class="ngayLam">${new Date(item.ngayChamCong).toLocaleDateString()}</td>
                    <td>${item.liDo}</td>
                    <td>${item.tinhTrang}</td>
                `;
      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu:", error);
    document.getElementById("nghiPhepTable").innerHTML = "<tr><td colspan='3'>Không có dữ liệu</td></tr>";
  }
}

async function fetchNghiPhepTC() {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch(`https://localhost:7219/api/NhanVien/TuChoiNghiPhep`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`, // Đính kèm token trong header
        "Content-Type": "application/json"
      }
    });
    if (!response.ok) {
      throw new Error("Không tìm thấy dữ liệu.");
    }

    const data = await response.json();
    const tableBody = document.getElementById("nghiPhepTable");
    tableBody.innerHTML = ""; // Xóa dữ liệu cũ

    data.forEach(item => {
      const row = document.createElement("tr");
      row.innerHTML = `
                    <td class="ngayLam">${new Date(item.ngayChamCong).toLocaleDateString()}</td>
                    <td>${item.liDo}</td>
                    <td>${item.tinhTrang}</td>
                `;
      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu:", error);
    document.getElementById("nghiPhepTable").innerHTML = "<tr><td colspan='3'>Không có dữ liệu</td></tr>";
  }
}

async function huyNghiPhep(ngayLam) {
  if (!confirm("Bạn có chắc chắn muốn hủy nghỉ phép này không?")) {
    return;
  }
  const token = localStorage.getItem("token");

  try {
    const response = await fetch(`https://localhost:7219/api/NhanVien/XoaNghiPhep?ngayLam=${ngayLam}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`, // Đính kèm token trong header
        "Content-Type": "application/json"
      }
    });

    const message = await response.text();

    if (!response.ok) {
      throw new Error(message);
    }

    alert(message); // Hiển thị thông báo thành công
    fetchNghiPhepCD();

  } catch (error) {
    alert("Lỗi: " + error.message);
    console.error("Lỗi:", error);
  }
}
fetchQuenCheckOutCD();
fetchDangKyTangCaCD();
fetchNghiPhepCD();