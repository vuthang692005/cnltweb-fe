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
    const response = await fetch("https://localhost:7219/api/admin/ChoDuyetDKTangCa", {
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
                    <td>${item.maNhanVien}</td>
                    <td>${item.hoTen}</td>
                    <td class="ngayLam">${new Date(item.ngayChamCong).toLocaleDateString()}</td>
                    <td>${item.tinhTrang}</td>
                    <td>
                          <a style="cursor: pointer; color: white; background-color:#007BFF; padding: 6px; border-radius: 5px;" onclick="DuyetDKTangCa('${item.maNhanVien}', '${item.ngayChamCong}')">Duyệt</a>
                          <a style="cursor: pointer; color: white; background-color:red; padding: 6px; border-radius: 5px;" onclick="TuChoiDKTangCa('${item.maNhanVien}', '${item.ngayChamCong}')">Từ chối</a>
                    </td>
                `;
      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu:", error);
    document.getElementById("tangCaTable").innerHTML = "<tr><td colspan='5'>Không có dữ liệu</td></tr>";
  }
}

async function fetchDangKyTangCaDD() {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch("https://localhost:7219/api/admin/DaDuyetDKTangCa", {
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
                    <td>${item.maNhanVien}</td>
                    <td>${item.hoTen}</td>
                    <td class="ngayLam">${new Date(item.ngayChamCong).toLocaleDateString()}</td>
                    <td>${item.tinhTrang}</td>
                    <td>
                          <a style="cursor: pointer; color: white; background-color:red; padding: 6px; border-radius: 5px;" onclick="TuChoiDKTangCa('${item.maNhanVien}', '${item.ngayChamCong}')">Từ chối</a>
                    </td>
                `;
      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu:", error);
    document.getElementById("tangCaTable").innerHTML = "<tr><td colspan='5'>Không có dữ liệu</td></tr>";
  }
}

async function fetchDangKyTangCaTC() {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch("https://localhost:7219/api/admin/TuChoiDKTangCa", {
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
                    <td>${item.maNhanVien}</td>
                    <td>${item.hoTen}</td>
                    <td class="ngayLam">${new Date(item.ngayChamCong).toLocaleDateString()}</td>
                    <td>${item.tinhTrang}</td>
                    <td>
                          <a style="cursor: pointer; color: white; background-color:#007BFF; padding: 6px; border-radius: 5px;" onclick="DuyetDKTangCa('${item.maNhanVien}', '${item.ngayChamCong}')">Duyệt</a>
                    </td>
                `;
      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu:", error);
    document.getElementById("tangCaTable").innerHTML = "<tr><td colspan='5'>Không có dữ liệu</td></tr>";
  }
}

async function DuyetDKTangCa(maNhanVien, ngayLam) {
  const token = localStorage.getItem("token");
  let activeTab = document.querySelector(".tab.active");
  try {
    const response = await fetch(`https://localhost:7219/api/admin/DuyetDKTC?maNhanVien=${maNhanVien}&ngayChamCong=${ngayLam}`, {
      method: "PUT",
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
    if (activeTab.innerText === "Chờ duyệt") {
      fetchDangKyTangCaCD();
    }else if(activeTab.innerText === "Đã duyệt"){
      fetchDangKyTangCaDD();
    }else{
      fetchDangKyTangCaTC();
    }

  } catch (error) {
    alert("Lỗi: " + error.message);
    console.error("Lỗi:", error);
  }
}

async function TuChoiDKTangCa(maNhanVien, ngayLam) {
  const token = localStorage.getItem("token");
  let activeTab = document.querySelector(".tab.active");
  try {
    const response = await fetch(`https://localhost:7219/api/admin/TuChoiDKTC?maNhanVien=${maNhanVien}&ngayChamCong=${ngayLam}`, {
      method: "PUT",
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
    if (activeTab.innerText === "Chờ duyệt") {
      fetchDangKyTangCaCD();
    }else if(activeTab.innerText === "Đã duyệt"){
      fetchDangKyTangCaDD();
    }else{
      fetchDangKyTangCaTC();
    }

  } catch (error) {
    alert("Lỗi: " + error.message);
    console.error("Lỗi:", error);
  }
}

async function fetchQuenCheckOutCD() {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch(`https://localhost:7219/api/admin/ChoDuyetQCO`, {
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
                    <td>${item.maNhanVien}</td>
                    <td>${item.hoTen}</td>
                    <td class="ngayLam">${new Date(item.ngayChamCong).toLocaleDateString()}</td>
                    <td>${item.liDo}</td>
                    <td>${item.tinhTrang}</td>
                    <td>
                          <a style="cursor: pointer; color: white; background-color:#007BFF; padding: 6px; border-radius: 5px;" onclick="DuyetQCO('${item.maNhanVien}', '${item.ngayChamCong}')">Duyệt</a>
                          <a style="cursor: pointer; color: white; background-color:red; padding: 6px; border-radius: 5px;" onclick="TuChoiQCO('${item.maNhanVien}', '${item.ngayChamCong}')">Từ chối</a>
                    </td>
                `;
      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu:", error);
    document.getElementById("quenCheckOutTable").innerHTML = "<tr><td colspan='6'>Không có dữ liệu</td></tr>";
  }
}

async function fetchQuenCheckOutDD() {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch(`https://localhost:7219/api/admin/DaDuyetQCO`, {
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
                    <td>${item.maNhanVien}</td>
                    <td>${item.hoTen}</td>
                    <td class="ngayLam">${new Date(item.ngayChamCong).toLocaleDateString()}</td>
                    <td>${item.liDo}</td>
                    <td>${item.tinhTrang}</td>
                    <td>
                          <a style="cursor: pointer; color: white; background-color:red; padding: 6px; border-radius: 5px;" onclick="TuChoiQCO('${item.maNhanVien}', '${item.ngayChamCong}')">Từ chối</a>
                    </td>
                `;
      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu:", error);
    document.getElementById("quenCheckOutTable").innerHTML = "<tr><td colspan='6'>Không có dữ liệu</td></tr>";
  }
}

async function fetchQuenCheckOutTC() {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch(`https://localhost:7219/api/admin/TuChoiQCO`, {
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
                    <td>${item.maNhanVien}</td>
                    <td>${item.hoTen}</td>
                    <td class="ngayLam">${new Date(item.ngayChamCong).toLocaleDateString()}</td>
                    <td>${item.liDo}</td>
                    <td>${item.tinhTrang}</td>
                    <td>
                          <a style="cursor: pointer; color: white; background-color:#007BFF; padding: 6px; border-radius: 5px;" onclick="DuyetQCO('${item.maNhanVien}', '${item.ngayChamCong}')">Duyệt</a>
                    </td>
                `;
      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu:", error);
    document.getElementById("quenCheckOutTable").innerHTML = "<tr><td colspan='6'>Không có dữ liệu</td></tr>";
  }
}

async function DuyetQCO(maNhanVien, ngayLam) {
  const token = localStorage.getItem("token");
  let activeTab = document.querySelector(".tab1.active");
  try {
    const response = await fetch(`https://localhost:7219/api/admin/DuyetQCO?maNhanVien=${maNhanVien}&ngayChamCong=${ngayLam}`, {
      method: "PUT",
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
    if (activeTab.innerText === "Chờ duyệt") {
      fetchQuenCheckOutCD();
    }else if(activeTab.innerText === "Đã duyệt"){
      fetchQuenCheckOutDD();
    }else{
      fetchQuenCheckOutTC();
    }

  } catch (error) {
    alert("Lỗi: " + error.message);
    console.error("Lỗi:", error);
  }
}

async function TuChoiQCO(maNhanVien, ngayLam) {
  const token = localStorage.getItem("token");
  let activeTab = document.querySelector(".tab1.active");

  try {
    const response = await fetch(`https://localhost:7219/api/admin/TuChoiQCO?maNhanVien=${maNhanVien}&ngayChamCong=${ngayLam}`, {
      method: "PUT",
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
    if (activeTab.innerText === "Chờ duyệt") {
      fetchQuenCheckOutCD();
    }else if(activeTab.innerText === "Đã duyệt"){
      fetchQuenCheckOutDD();
    }else{
      fetchQuenCheckOutTC();
    }
  } catch (error) {
    alert("Lỗi: " + error.message);
    console.error("Lỗi:", error);
  }
}

async function fetchNghiPhepCD() {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch(`https://localhost:7219/api/admin/ChoDuyetNghiPhep`, {
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
                    <td>${item.maNhanVien}</td>
                    <td>${item.hoTen}</td>
                    <td class="ngayLam">${new Date(item.ngayChamCong).toLocaleDateString()}</td>
                    <td>${item.liDo}</td>
                    <td>${item.tinhTrang}</td>
                    <td>
                          <a style="cursor: pointer; color: white; background-color:#007BFF; padding: 6px; border-radius: 5px;" onclick="DuyetNghiPhep('${item.maNhanVien}', '${item.ngayChamCong}')">Duyệt</a>
                          <a style="cursor: pointer; color: white; background-color:red; padding: 6px; border-radius: 5px;" onclick="TuChoiNghiPhep('${item.maNhanVien}', '${item.ngayChamCong}')">Từ chối</a>
                    </td>                `;
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
    const response = await fetch(`https://localhost:7219/api/admin/DaDuyetNghiPhep`, {
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
                    <td>${item.maNhanVien}</td>
                    <td>${item.hoTen}</td>
                    <td class="ngayLam">${new Date(item.ngayChamCong).toLocaleDateString()}</td>
                    <td>${item.liDo}</td>
                    <td>${item.tinhTrang}</td>
                    <td>
                          <a style="cursor: pointer; color: white; background-color:red; padding: 6px; border-radius: 5px;" onclick="TuChoiNghiPhep('${item.maNhanVien}', '${item.ngayChamCong}')">Từ chối</a>
                    </td> 
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
    const response = await fetch(`https://localhost:7219/api/admin/TuChoiNghiPhep`, {
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
                    <td>${item.maNhanVien}</td>
                    <td>${item.hoTen}</td>
                    <td class="ngayLam">${new Date(item.ngayChamCong).toLocaleDateString()}</td>
                    <td>${item.liDo}</td>
                    <td>${item.tinhTrang}</td>
                    <td>
                          <a style="cursor: pointer; color: white; background-color:#007BFF; padding: 6px; border-radius: 5px;" onclick="DuyetNghiPhep('${item.maNhanVien}', '${item.ngayChamCong}')">Duyệt</a>
                    </td> 
                `;
      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu:", error);
    document.getElementById("nghiPhepTable").innerHTML = "<tr><td colspan='3'>Không có dữ liệu</td></tr>";
  }
}

async function DuyetNghiPhep(maNhanVien, ngayLam) {
  const token = localStorage.getItem("token");
  let activeTab = document.querySelector(".tab2.active");
  try {
    const response = await fetch(`https://localhost:7219/api/admin/DuyetNghiPhep?maNhanVien=${maNhanVien}&ngayChamCong=${ngayLam}`, {
      method: "PUT",
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
    if (activeTab.innerText === "Chờ duyệt") {
      fetchQuenCheckOutCD();
    }else if(activeTab.innerText === "Đã duyệt"){
      fetchQuenCheckOutDD();
    }else{
      fetchQuenCheckOutTC();
    }

  } catch (error) {
    alert("Lỗi: " + error.message);
    console.error("Lỗi:", error);
  }
}

async function TuChoiNghiPhep(maNhanVien, ngayLam) {
  const token = localStorage.getItem("token");
  let activeTab = document.querySelector(".tab2.active");

  try {
    const response = await fetch(`https://localhost:7219/api/admin/TuChoiNghiPhep?maNhanVien=${maNhanVien}&ngayChamCong=${ngayLam}`, {
      method: "PUT",
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
    if (activeTab.innerText === "Chờ duyệt") {
      fetchQuenCheckOutCD();
    }else if(activeTab.innerText === "Đã duyệt"){
      fetchQuenCheckOutDD();
    }else{
      fetchQuenCheckOutTC();
    }
  } catch (error) {
    alert("Lỗi: " + error.message);
    console.error("Lỗi:", error);
  }
}

function logout() {
  localStorage.clear();
  window.location.href = '/src/views/auth/login.html';
}
fetchQuenCheckOutCD();
fetchDangKyTangCaCD();
fetchNghiPhepCD();