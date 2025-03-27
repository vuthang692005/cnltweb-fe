window.onload = function () {
  chiTiet();
};

document.addEventListener("DOMContentLoaded", function () {
  const chiTietButton = document.querySelector(".button:nth-child(1)");
  if (chiTietButton) {
    chiTietButton.classList.add("active");
  }

  document.querySelectorAll(".button").forEach(button => {
    button.addEventListener("click", function () {
      document.querySelectorAll(".button").forEach(btn => btn.classList.remove("active")); // Xóa active khỏi tất cả
      this.classList.add("active"); // Thêm active vào nút được bấm
    });
  });
});

const menuButton = document.getElementById('menuButton');
const menuDropdown = document.getElementById('menuDropdown');

menuButton.addEventListener('click', () => {
  menuDropdown.classList.toggle('active');
});

let currentDate = new Date();
let selectedDates1 = new Set();
let selectedDates2 = new Set();
let today = new Date();
let selectedDate2 = today.toLocaleDateString("sv-SE");

function xoa() {
  let datesDiv = document.getElementById("dates");
  let buttenthem = document.getElementById("them");
  let datesDiv1 = document.getElementById("dates1");
  let datesDiv2 = document.getElementById("dates2");
  let buttenxoa = document.getElementById("xoa");
  datesDiv.classList.add("hidden");
  datesDiv2.classList.add("hidden");
  buttenthem.classList.add("hidden");
  datesDiv1.classList.remove("hidden");
  buttenxoa.classList.remove("hidden");
}

function them() {
  let datesDiv = document.getElementById("dates1");
  let datesDiv2 = document.getElementById("dates2");
  let buttenxoa = document.getElementById("xoa");
  let datesDiv1 = document.getElementById("dates");
  let buttenthem = document.getElementById("them");
  datesDiv.classList.add("hidden");
  datesDiv2.classList.add("hidden");
  buttenxoa.classList.add("hidden");
  datesDiv1.classList.remove("hidden");
  buttenthem.classList.remove("hidden");
}

function chiTiet() {
  let datesDiv = document.getElementById("dates1");
  let datesDiv2 = document.getElementById("dates2");
  let buttenxoa = document.getElementById("xoa");
  let datesDiv1 = document.getElementById("dates");
  let buttenthem = document.getElementById("them");
  datesDiv.classList.add("hidden");
  datesDiv2.classList.remove("hidden");
  buttenxoa.classList.add("hidden");
  datesDiv1.classList.add("hidden");
  buttenthem.classList.add("hidden");
}

async function checkExistingDates() {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;
  const datesContainer = document.getElementById("dates");
  const token = localStorage.getItem("token");

  let existingDates = new Set();

  for (let day = 1; day <= 31; day++) {
    let formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

    try {
      const response = await fetch(`https://localhost:7219/api/admin/KiemTraNgay?ngayChamCong=${formattedDate}`, {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" }
      });

      if (response.ok) {
        existingDates.add(formattedDate); // Ngày đã tồn tại
      }
    } catch (error) {
      console.error(`Lỗi khi kiểm tra ngày ${formattedDate}:`, error);
    }
  }

  // Cập nhật giao diện
  datesContainer.childNodes.forEach(dateElement => {
    const day = dateElement.innerText;
    if (!isNaN(day)) {
      let dateKey = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      if (existingDates.has(dateKey)) {
        dateElement.style.background = "#ccc";
        dateElement.style.color = "white";
        dateElement.style.pointerEvents = "none"; // Vô hiệu hóa click

      }
    }

  });
}

function renderCalendar() {
  const monthYear = document.getElementById("monthYear");
  const datesContainer = document.getElementById("dates");

  // Vô hiệu hóa lịch trước khi kiểm tra ngày
  datesContainer.classList.add("disabled");

  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();

  monthYear.innerText = `${year} - Tháng ${month + 1}`;
  datesContainer.innerHTML = "";

  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();

  for (let i = 0; i < firstDay; i++) {
    datesContainer.innerHTML += `<div></div>`;
  }

  for (let i = 1; i <= lastDate; i++) {
    let dateKey = `${year}-${month + 1}-${i}`;

    let className = "date";
    let dateElement = document.createElement("div");
    dateElement.className = className;
    dateElement.innerText = i;
    dateElement.onclick = () => toggleDate(dateElement, dateKey);
    datesContainer.appendChild(dateElement);
  }

  // Kiểm tra ngày tồn tại xong thì kích hoạt lại lịch
  checkExistingDates().then(() => {
    datesContainer.classList.remove("disabled");
  });
}

async function checkExistingDates1() {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;
  const datesContainer = document.getElementById("dates1");
  const datesContainer2 = document.getElementById("dates2");
  const token = localStorage.getItem("token");

  let existingDates = new Set();

  for (let day = 1; day <= 31; day++) {
    let formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

    try {
      const response = await fetch(`https://localhost:7219/api/admin/KiemTraNgay?ngayChamCong=${formattedDate}`, {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" }
      });

      if (response.ok) {
        existingDates.add(formattedDate); // Ngày đã tồn tại
      }
    } catch (error) {
      console.error(`Lỗi khi kiểm tra ngày ${formattedDate}:`, error);
    }
  }

  // Cập nhật giao diện chỉ với các phần tử có class "date"
  datesContainer.querySelectorAll('.date').forEach(dateElement => {
    const day = parseInt(dateElement.innerText, 10); // Chỉ lấy số
    if (!isNaN(day)) {
      let dateKey = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      if (!existingDates.has(dateKey)) {
        dateElement.style.background = "#ccc";
        dateElement.style.color = "white";
        dateElement.style.pointerEvents = "none"; // Vô hiệu hóa click
      }
    }
  });

  datesContainer2.querySelectorAll('.date').forEach(dateElement => {
    const day = parseInt(dateElement.innerText, 10); // Chỉ lấy số
    if (!isNaN(day)) {
      let dateKey = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      if (!existingDates.has(dateKey)) {
        dateElement.style.background = "#ccc";
        dateElement.style.color = "white";
        dateElement.style.pointerEvents = "none"; // Vô hiệu hóa click
      }
    }
  });
}


function renderCalendar1() {
  const monthYear = document.getElementById("monthYear");
  const datesContainer = document.getElementById("dates1");

  // Vô hiệu hóa lịch trước khi kiểm tra ngày
  datesContainer.classList.add("disabled");

  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();

  monthYear.innerText = `${year} - Tháng ${month + 1}`;
  datesContainer.innerHTML = "";

  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();

  for (let i = 0; i < firstDay; i++) {
    datesContainer.innerHTML += `<div></div>`;
  }

  for (let i = 1; i <= lastDate; i++) {
    let dateKey = `${year}-${month + 1}-${i}`;

    let className = "date";
    let dateElement = document.createElement("div");
    dateElement.className = className;
    dateElement.innerText = i;
    dateElement.onclick = () => removeDate(dateElement, dateKey);
    datesContainer.appendChild(dateElement);
  }

  // Kiểm tra ngày tồn tại xong thì kích hoạt lại lịch
  checkExistingDates1().then(() => {
    datesContainer.classList.remove("disabled");
  });
}

function renderCalendar2() {
  const monthYear = document.getElementById("monthYear");
  const datesContainer = document.getElementById("dates2");

  // Vô hiệu hóa lịch trước khi kiểm tra ngày
  datesContainer.classList.add("disabled");

  // Lấy tháng và năm hiện tại của lịch
  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();

  monthYear.innerText = `${year} - Tháng ${month + 1}`;
  datesContainer.innerHTML = "";

  // Xác định ngày đầu tiên của tháng và tổng số ngày
  const firstDayIndex = new Date(year, month, 1).getDay(); // Thứ của ngày 1 trong tháng (0: CN, 1: T2, ...)
  const lastDate = new Date(year, month + 1, 0).getDate(); // Ngày cuối tháng

  // Lấy ngày hiện tại
  let today = new Date();
  let todayMonth = today.getMonth();
  let todayYear = today.getFullYear();
  let todayStr = `${todayYear}-${todayMonth + 1}-${today.getDate()}`;
  let firstDayStr = `${year}-${month + 1}-1`; // Ngày đầu tiên của tháng

  // Thêm khoảng trống trước ngày 1 để lịch đúng thứ
  for (let i = 0; i < (firstDayIndex === 0 ? 6 : firstDayIndex); i++) {
    datesContainer.innerHTML += `<div class="empty"></div>`;
  }

  // Hiển thị ngày trong tháng
  for (let i = 1; i <= lastDate; i++) {
    let dateKey = `${year}-${month + 1}-${i}`;
    let className = "date";

    // Nếu đang hiển thị tháng hiện tại, đánh dấu ngày hôm nay
    if (year === todayYear && month === todayMonth && dateKey === todayStr) {
      className += " check";
      selectedDate2 = dateKey;
      console.log("selectedDate2:", selectedDate2);
    }
    // Nếu không phải tháng hiện tại, đánh dấu ngày đầu tiên
    else if (year !== todayYear || month !== todayMonth) {
      if (dateKey === firstDayStr) {
        className += " check";
        selectedDate2 = dateKey;
        console.log("selectedDate2:", selectedDate2);
      }
    }

    let dateElement = document.createElement("div");
    dateElement.className = className;
    dateElement.innerText = i;
    dateElement.onclick = () => checkDate(dateElement, dateKey);

    datesContainer.appendChild(dateElement);
  }

  // Kiểm tra ngày tồn tại xong thì kích hoạt lại lịch
  checkExistingDates1().then(() => {
    datesContainer.classList.remove("disabled");
  });
}


function toggleDate(element, dateKey) {
  if (selectedDates1.has(dateKey)) {
    selectedDates1.delete(dateKey);
    element.classList.remove("selected");
  } else {
    selectedDates1.add(dateKey);
    element.classList.add("selected");
  }
}

function removeDate(element, dateKey) {
  if (selectedDates2.has(dateKey)) {
    selectedDates2.delete(dateKey);
    element.classList.remove("delete");
  } else {
    selectedDates2.add(dateKey);
    element.classList.add("delete");
  }
}

function checkDate(element, dateKey) {
  if (selectedDate2) {
    document.querySelectorAll(".date").forEach(date => {
      date.classList.remove("check");
    });
  }
  selectedDate2 = dateKey;
  element.classList.add("check");
  fetchChamCong()
}


function prevMonth() {
  selectedDates1.clear();
  selectedDates2.clear();
  let today = new Date();
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar();
  renderCalendar1();
  renderCalendar2();
  fetchChamCong()

}


function nextMonth() {
  selectedDates1.clear();
  selectedDates2.clear();
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar();
  renderCalendar1();
  renderCalendar2();
  fetchChamCong()
}

async function submitSelectedDates() {
  const selectedArray = Array.from(selectedDates1);
  const token = localStorage.getItem("token");
  if (selectedArray.length === 0) {
    alert("Vui lòng chọn ít nhất một ngày!");
    return;
  }

  for (const date of selectedArray) {
    const formattedDate = date.split('-').map(num => num.padStart(2, '0')).join('-');
    try {
      const response = await fetch(`https://localhost:7219/api/admin/tao-cham-cong?ngayChamCong=${formattedDate}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error(`Lỗi khi gửi ngày ${formattedDate}: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Lỗi API:", error);
      alert("Có lỗi xảy ra khi gửi dữ liệu!");
      return;
    }
  }

  alert("Thêm ngày làm thành công cho các ngày đã chọn!");
  selectedDates1.clear();
  renderCalendar();
  renderCalendar1();
  renderCalendar2();
  fetchChamCong()
}

async function deleteSelectedDates() {
  const selectedArray = Array.from(selectedDates2);
  const token = localStorage.getItem("token");
  if (selectedArray.length === 0) {
    alert("Vui lòng chọn ít nhất một ngày!");
    return;
  }

  for (const date of selectedArray) {
    const formattedDate = date.split('-').map(num => num.padStart(2, '0')).join('-');
    try {
      const response = await fetch(`https://localhost:7219/api/admin/XoaChamCong?ngayChamCong=${formattedDate}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error(`Lỗi khi gửi ngày ${formattedDate}: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Lỗi API:", error);
      alert("Có lỗi xảy ra khi gửi dữ liệu!");
      return;
    }
  }

  alert("Xóa thành công cho các ngày đã chọn!");
  selectedDates2.clear();
  renderCalendar();
  renderCalendar1();
  renderCalendar2();
  fetchChamCong()
}

async function fetchChamCong() {
  const token = localStorage.getItem("token");
  try {
    let response = await fetch(`https://localhost:7219/api/admin/KiemTraNgay?ngayChamCong=${selectedDate2}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`, // Đính kèm token trong header
        "Content-Type": "application/json"
      }
    });

    let data = await response.json();

    if (!response.ok) {
      throw new Error(data);
    }
    renderTable(data);
  } catch (error) {
    document.querySelector(".body").innerHTML = `<p style="color:red;">Lỗi: ${error.message}</p>`;
  }
}

// Hàm hiển thị dữ liệu lên bảng
function renderTable(data) {
  let bodyDiv = document.querySelector(".body");
  bodyDiv.innerHTML = `
<div class="table-container">
  <table class="custom-table">
      <thead>
          <tr>
              <th>Mã NV</th>
              <th>Mã CC</th>
              <th>Tên NV</th>
              <th>Giờ Vào</th>
              <th>Giờ Ra</th>
              <th>Tình Trạng</th>
              <th>Tăng Ca</th>
              <th>Giờ Tăng Ca</th>
              <th></th>
          </tr>
      </thead>
      <tbody>
          ${data.map(row => `
              <tr>
                  <td>${row.maNhanVien}</td>
                  <td>${row.maChamCong}</td>
                  <td>${row.tenNhanVien}</td>
                  <td>${row.gioVao || "-"}</td>
                  <td>${row.gioRa || "-"}</td>
                  <td>${row.tinhTrang || "-"}</td>
                  <td>${row.tangCa === "True" ? "Có" : "Không"}</td>
                  <td>${row.soGioTangCa}</td>
                  <td><a onclick="sua()" style="color: blue; cursor: pointer;">sửa</a></td>
              </tr>
          `).join("")}
      </tbody>
  </table>
</div>
`;
}
let currentRow = null;
function sua() {
  // Tìm dòng <tr> chứa nút "sửa" được nhấn
  currentRow = event.target.closest("tr");

  // Lấy dữ liệu từ các ô trong hàng
  let MaCC = currentRow.children[1].textContent.trim();
  let tinhTrang = currentRow.children[5].textContent.trim();
  let tangCa = currentRow.children[6].textContent.trim() === "Có" ? "True" : "False";

  // Gán giá trị vào form
  document.getElementById("MaCC").value = MaCC;
  document.getElementById("editTinhTrang").value = tinhTrang === "-" ? "" : tinhTrang;
  document.getElementById("editTangCa").value = tangCa;

  // Hiển thị form
  document.getElementById("overlay").style.display = "block";
  document.getElementById("formsua").style.display = "block";
}

async function luuChinhSua() {
  if (!currentRow) return;
  let MaCC = document.getElementById("MaCC").value;
  let newTinhTrang = document.getElementById("editTinhTrang").value;
  let newTangCa = document.getElementById("editTangCa").value;
  const token = localStorage.getItem("token");

  if (newTinhTrang === "") {
    newTinhTrang = null;
  }

  if (!MaCC) {
    alert("Không có mã chấm công!");
    return;
  }

  let requestData = {
    tinhTrang: newTinhTrang,
    tangCa: newTangCa
  };

  try {
    let response = await fetch(`https://localhost:7219/api/admin/SuaChamCong?maChamCong=${MaCC}`, {
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
      fetchChamCong();
    } else {
      alert(result.message || "Cập nhật thất bại!");
    }
  } catch (error) {
    console.error("Lỗi khi cập nhật:", error);
    alert("Có lỗi xảy ra, vui lòng thử lại!");
  }

  closeForm();
  fetchChamCong()
}

function closeForm() {
  document.getElementById("overlay").style.display = "none";
  document.getElementById("formsua").style.display = "none";
  currentRow = null;
}

function logout() {
  localStorage.clear();
  window.location.href = '/src/views/auth/login.html';
}

// Gọi API khi trang tải
document.addEventListener("DOMContentLoaded", fetchChamCong);

renderCalendar();
renderCalendar1();
renderCalendar2();