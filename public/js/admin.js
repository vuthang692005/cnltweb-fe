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
    if (month !== currentDate.getMonth() + 1) {return;} 
    try {
      const response = await fetch(`http://thang689904-001-site1.jtempurl.com/api/admin/KiemTraNgay?ngayChamCong=${formattedDate}`, {
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
  const calendar = document.getElementById("calendar-content");
  const spinner_calendar = document.getElementById("spinner-calendar");
  const calendar_loading = document.getElementById("calendar-loading");


  calendar_loading.innerText = "Đang tải lịch...";
  // Vô hiệu hóa lịch trước khi kiểm tra ngày
  datesContainer.classList.add("disabled");
  calendar.classList.add("disabled-calendar");
  spinner_calendar.classList.add("spinner-calendar");
  calendar_loading.classList.add("calendar-loading");

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
    calendar.classList.remove("disabled-calendar");
    spinner_calendar.classList.remove("spinner-calendar");
    calendar_loading.classList.remove("calendar-loading");
    calendar_loading.innerText = "";
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
    if (month !== currentDate.getMonth() + 1) {return;} 
    try {
      const response = await fetch(`http://thang689904-001-site1.jtempurl.com/api/admin/KiemTraNgay?ngayChamCong=${formattedDate}`, {
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
  fetchChamCong(1)
}




function prevMonth() {
  selectedDates1.clear();
  selectedDates2.clear();
  currentDate.setMonth(currentDate.getMonth() - 1);

  setTimeout(() => {}, 10000);

  renderCalendar();
  renderCalendar1();
  renderCalendar2();
  fetchChamCong(1)

}


function nextMonth() {
  selectedDates1.clear();
  selectedDates2.clear();
  currentDate.setMonth(currentDate.getMonth() + 1);

  setTimeout(() => {
    renderCalendar();
    renderCalendar1();
    renderCalendar2();
    fetchChamCong(1);
  }, 888); 
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
      const response = await fetch(`http://thang689904-001-site1.jtempurl.com/api/admin/tao-cham-cong?ngayChamCong=${formattedDate}`, {
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
  fetchChamCong(1)
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
      const response = await fetch(`http://thang689904-001-site1.jtempurl.com/api/admin/XoaChamCong?ngayChamCong=${formattedDate}`, {
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
  fetchChamCong(1)
}

let currentPage = 1;
let totalPages = 1;

async function fetchChamCong(page) {
  const token = localStorage.getItem("token");
  currentPage = page;
  let maNhanVien = document.getElementById("maNhanVien").value;
  let hoTen = document.getElementById("hoTen").value;
  let tangCa = document.getElementById("tinhTrangtangCa").value;

  let url = `http://thang689904-001-site1.jtempurl.com/api/admin/KiemTraNgay?page=${page}&ngayChamCong=${selectedDate2}`;
  if (maNhanVien) url += `&maNhanVien=${maNhanVien}`;
  if (hoTen) url += `&hoTen=${hoTen}`;
  if (tangCa) url += `&tangCa=${tangCa}`;
 
  try {
    let response = await fetch(url, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`, // Đính kèm token trong header
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      // Nếu có lỗi, hiển thị dòng thông báo
      tableBody.innerHTML = `<tr><td colspan="9" style="text-align: center;">Không có dữ liệu chấm công</td></tr>`;
      return;
    }    const data = await response.json();

    totalPages = data.totalPages;
    document.getElementById("pageInfo").innerText = `Trang ${currentPage} / ${totalPages}`;

    let tableBody = document.getElementById("luongTable");
    tableBody.innerHTML = "";

    data.data.forEach(nv => {
      let row = `
                    <tr>
                        <td>${nv.maNhanVien}</td>
                        <td>${nv.maChamCong}</td>
                        <td>${nv.tenNhanVien}</td>
                        <td>${nv.gioVao || "-"}</td>
                        <td>${nv.gioRa || "-"}</td>
                        <td>${nv.tinhTrang || "-"}</td>
                        <td>${nv.tangCa === "True" ? "Có" : "Không"}</td>
                        <td>${nv.soGioTangCa}</td>
                        <td><a onclick="sua()" style="color: blue; cursor: pointer;">Sửa</a></td>
                    </tr>`;
      tableBody.innerHTML += row;
    });
  } catch (error) {
    // alert(error.message);
    let tableBody = document.getElementById("luongTable");
    tableBody.innerHTML = `<tr><td colspan="9" style="text-align: center;">Không có dữ liệu chấm công </td></tr>`;
    console.error(error);
  }
}

function prevPage() {
  if (currentPage > 1) {
    fetchChamCong(currentPage - 1);
  }
}

function nextPage() {
  if (currentPage < totalPages) {
    fetchChamCong(currentPage + 1);
  }
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
    let response = await fetch(`http://thang689904-001-site1.jtempurl.com/api/admin/SuaChamCong?maChamCong=${MaCC}`, {
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
      fetchChamCong(currentPage);
    } else {
      alert(result.message || "Cập nhật thất bại!");
    }
  } catch (error) {
    console.error("Lỗi khi cập nhật:", error);
    alert("Có lỗi xảy ra, vui lòng thử lại!");
  }
  closeForm();
  fetchChamCong(currentPage)
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
document.addEventListener("DOMContentLoaded", fetchChamCong(1));

renderCalendar();
renderCalendar1();
renderCalendar2();