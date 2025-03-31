async function Login() {
  const TaiKhoan = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  const response = await fetch('https://localhost:7219/api/Login/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ taiKhoan: TaiKhoan, matKhau: password })
  });

  

  if (response.ok) {
    const data = await response.json();
    localStorage.setItem('token', data.token);
    if (data.role === 'Admin') {
      window.location.href = '/src/views/admin/index.html';
    } else if (data.role === 'NhanVien') {
      window.location.href = '/src/views/employee/index.html';
    }
  } else {
    let result = await response.text();
    console.error("Lỗi Server:", result);
    alert(result);
  }
}