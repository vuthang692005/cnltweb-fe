let currentDate = new Date(); // Ngày hiện tại
let selectedDate2 = currentDate.toLocaleDateString("sv-SE"); // Biến lưu ngày được chọn
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
  await formcong();
});


let currentController = null;
async function checkExistingDates() {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;
  const datesContainer = document.getElementById("dates");
  const token = localStorage.getItem("token");

  let existingDates = new Set();

  // Nếu có request cũ, cancel trước khi bắt đầu request mới
  if (currentController) {
    currentController.abort(); // Huỷ toàn bộ request cũ
  }

  // Tạo một AbortController mới cho lần gọi API này
  currentController = new AbortController();
  const signal = currentController.signal;

  const fetchPromises = [];

  for (let day = 1; day <= 31; day++) {
    const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    if (month !== currentDate.getMonth() + 1) { return; }

    const url = `http://thang689904-001-site1.jtempurl.com/api/NhanVien/chamcong?ngayChamCong=${formattedDate}`;

    const promise = fetch(url, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      signal // Truyền signal vào để fetch biết là có thể bị huỷ
    })
      .then(response => {
        if (response.ok) {
          existingDates.add(formattedDate);
        }
      })
      .catch(error => {
        if (error.name === 'AbortError') {
          console.log(`Request cho ngày ${formattedDate} đã bị huỷ.`);
        } else {
          console.error(`Lỗi khi kiểm tra ngày ${formattedDate}:`, error);
        }
      });

    fetchPromises.push(promise);
  }
  // Chờ tất cả fetch hoàn thành
  await Promise.all(fetchPromises);


  // Cập nhật giao diện
  datesContainer.querySelectorAll('.date').forEach(dateElement => {
    const day = parseInt(dateElement.innerText, 10);
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

function renderCalendar() {
  const monthYear = document.getElementById("monthYear");
  const datesContainer = document.getElementById("dates");
  const calendar = document.getElementById("calendar-content");
  const spinner_calendar = document.getElementById("spinner-calendar");
  const calendar_loading = document.getElementById("calendar-loading");
  const prevMonthButton = document.getElementById("prevMonth");
  const nextMonthButton = document.getElementById("nextMonth");

  calendar_loading.innerText = "Đang tải lịch...";
  // Vô hiệu hóa lịch trước khi kiểm tra ngày
  // datesContainer.classList.add("disabled");
  calendar.classList.add("disabled-calendar");
  spinner_calendar.classList.add("spinner-calendar");
  calendar_loading.classList.add("calendar-loading");
  prevMonthButton.classList.add("prevAndNext");
  nextMonthButton.classList.add("prevAndNext");

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
  checkExistingDates().then(() => {
    datesContainer.classList.remove("disabled");
    calendar.classList.remove("disabled-calendar");
    spinner_calendar.classList.remove("spinner-calendar");
    calendar_loading.classList.remove("calendar-loading");
    calendar_loading.innerText = "";
    prevMonthButton.classList.remove("prevAndNext");
    nextMonthButton.classList.remove("prevAndNext");
  });
}

function checkDate(element, dateKey) {
  if (selectedDate2) {
    document.querySelectorAll(".date").forEach(date => {
      date.classList.remove("check");
    });
  }
  selectedDate2 = dateKey;
  element.classList.add("check");
  console.log("selectedDate2:", selectedDate2);
  formcong();
}

function prevMonth() {
  let today = new Date();
  currentDate.setMonth(currentDate.getMonth() - 1);

  // setTimeout(() => {
    renderCalendar();
    formcong();
  // }, 200);

}


function nextMonth() {
  let today = new Date();
  currentDate.setMonth(currentDate.getMonth() + 1);
  // setTimeout(() => {
    renderCalendar();
    formcong();
  // }, 200);
}

function logout() {
  localStorage.clear();
  window.location.href = '/src/views/auth/login.html';
}

async function formcong() {
  const token = localStorage.getItem("token");

  const response = await fetch(`http://thang689904-001-site1.jtempurl.com/api/NhanVien/chamcong?ngayChamCong=${selectedDate2}`, {
    method: "GET",
    headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" }
  });

  if (!response.ok) {
    let result = await response.text();
    console.error("Lỗi Server:", result);
    // alert(result);
  }

  const data = await response.json();

  document.getElementById("ngayChamCong").value = data.ngayChamCong;
  document.getElementById("gioVao").value = data.gioVao;
  document.getElementById("gioRa").value = data.gioRa;
  document.getElementById("tinhTrang").value = data.tinhTrang;
  document.getElementById("tangCa").value = data.tangCa === "True" ? "Có" : "Không";
  document.getElementById("soGioTangCa").value = data.soGioTangCa;
}

async function checkIn() {
  let ngayChamCong = document.getElementById("ngayChamCong").value;
  const token = localStorage.getItem("token");

  const response = await fetch(`http://thang689904-001-site1.jtempurl.com/api/NhanVien/CheckIn?ngayChamCong=${ngayChamCong}`, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });

  if (!response.ok) {
    let result = await response.text();
    console.error("Lỗi Server:", result);
    alert("Check-in thất bại!");
  } else {
    alert("Check-in thành công!");
  }
  formcong();
}

async function checkOut() {
  let ngayChamCong = document.getElementById("ngayChamCong").value;
  const token = localStorage.getItem("token");

  const response = await fetch(`http://thang689904-001-site1.jtempurl.com/api/NhanVien/CheckOut?ngayChamCong=${ngayChamCong}`, {
    method: "PUT",
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
    alert("Check-out thành công!");
  }
  formcong();
}

async function dkTangCa() {
  let ngayChamCong = document.getElementById("ngayChamCong").value;
  const token = localStorage.getItem("token");

  const response = await fetch(`http://thang689904-001-site1.jtempurl.com/api/NhanVien/DKTangCa?ngayChamCong=${ngayChamCong}`, {
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
    alert("Đăng kí thành công!");
  }
}

function formQuenCheckOut() {
  document.getElementById("overlay").style.display = "block";
  document.getElementById("formLiDo").style.display = "block";
}

async function QuenCheckOut() {
  let ngayChamCong = document.getElementById("ngayChamCong").value;
  const token = localStorage.getItem("token");
  let liDo = document.getElementById("liDo2").value;

  const response = await fetch(`http://thang689904-001-site1.jtempurl.com/api/NhanVien/QuenCheckOut?ngayChamCong=${ngayChamCong}&LiDo=${liDo}`, {
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
    closeForm();
  } else {
    alert("Gửi thành công!");
    closeForm();
  }
}

function formNghiPhep() {
  document.getElementById("overlay").style.display = "block";
  document.getElementById("formLiDoNghi").style.display = "block";
}

async function nghiPhep() {
  let ngayChamCong = document.getElementById("ngayChamCong").value;
  const token = localStorage.getItem("token");
  let liDo = document.getElementById("liDo1").value;

  const response = await fetch(`http://thang689904-001-site1.jtempurl.com/api/NhanVien/XinNghiPhep?ngayChamCong=${ngayChamCong}&LiDo=${liDo}`, {
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
    closeForm();
  } else {
    alert("Gửi thành công!");
    closeForm();
  }
}

function closeForm() {
  document.getElementById("overlay").style.display = "none";
  document.getElementById("formLiDo").style.display = "none";
  document.getElementById("formLiDoNghi").style.display = "none";
  document.getElementById("liDo").value = "";
}

renderCalendar()