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


function togglePasswordVisibility(inputId, button) {
    var input = document.getElementById(inputId);

    if (input.type === "password") {
        input.type = "text";
        button.innerHTML = '<i class="fa fa-eye"></i>'; // Change icon to eye-slash
    } else {
        input.type = "password";
        button.innerHTML = '<i class="fa fa-eye-slash"></i>'; // Change icon back to eye
    }
}

async function xacNhan() {
    const token = localStorage.getItem("token");
    matKhauCu = document.getElementById("matKhauCu").value;
    matKhauMoi = document.getElementById("matKhauMoi").value;
    nhapLaiMatKhau = document.getElementById("nhapLaiMatKhau").value;

    if (confirm("Bạn có chắc chắn muốn đổi mật khẩu không?")) {
        try {
            // Tạo đối tượng request chứa dữ liệu cần gửi
            const requestBody = {
                matKhauCu: matKhauCu,
                matKhauMoi: matKhauMoi,
                nhapLaiMatKhau: nhapLaiMatKhau
            };

            // Gọi API đổi mật khẩu
            const response = await fetch(`http://thang689904-001-site1.jtempurl.com/api/NhanVien/change-password`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                const result = await response.text();
                alert(result);
            } else {
                alert("Đổi mật khẩu thành công!");
                location.reload();
            }

        } catch (error) {
            alert(error.message);
        }
    }
}

function logout() {
    localStorage.clear();
    window.location.href = '/src/views/auth/login.html';
}


//CODE CHO EYE 
document.addEventListener('DOMContentLoaded', function() {
    // Khởi tạo GSAP plugins
    gsap.registerPlugin(ScrambleTextPlugin, MorphSVGPlugin);

    const TOGGLE_SPEED = 0.125;
    const ENCRYPT_SPEED = 1;
    const BLINK_SPEED = 0.075;
    
    // Lấy tất cả các nút toggle mật khẩu
    const toggleButtons = document.querySelectorAll('.input-container button');
    
    // Khởi tạo cho từng nút
    toggleButtons.forEach(TOGGLE => {
        const INPUT = TOGGLE.parentElement.querySelector('input');
        const PROXY = document.createElement('div');
        let busy = false;
        
        // Thiết lập animation chớp mắt
        let blinkTl;
        const EYE = TOGGLE.querySelector('.eye');
        
        const BLINK = () => {
            const delay = gsap.utils.random(2, 8);
            const duration = BLINK_SPEED;
            const repeat = Math.random() > 0.5 ? 3 : 1;
            blinkTl = gsap.timeline({
                delay,
                onComplete: () => BLINK(),
                repeat,
                yoyo: true
            })
            .to(TOGGLE.querySelector('.lid--upper'), {
                morphSVG: TOGGLE.querySelector('.lid--lower'),
                duration
            })
            .to(TOGGLE.querySelector('defs path:first-child'), {
                morphSVG: TOGGLE.querySelector('defs path:last-child'),
                duration
            }, 0);
        };
        
        BLINK();
        
        // Xử lý di chuyển con mắt
        if (EYE) {
            const posMapper = gsap.utils.mapRange(-100, 100, 30, -30);
            let reset;
            
            const MOVE_EYE = ({ x, y }) => {
                if (reset) reset.kill();
                reset = gsap.delayedCall(2, () => {
                    gsap.to(EYE, {
                        xPercent: 0, 
                        yPercent: 0,
                        duration: 0.2
                    });
                });
                
                const BOUNDS = EYE.getBoundingClientRect();
                gsap.set(EYE, {
                    xPercent: gsap.utils.clamp(-30, 30, posMapper(BOUNDS.x - x)),
                    yPercent: gsap.utils.clamp(-30, 30, posMapper(BOUNDS.y - y))
                });
            };
            
            window.addEventListener('pointermove', MOVE_EYE);
        }
        
        // Xử lý sự kiện click để toggle mật khẩu
        TOGGLE.addEventListener('click', () => {
            if (busy) return;
            
            const isPassword = INPUT.type === 'password';
            const val = INPUT.value;
            busy = true;
            
            TOGGLE.setAttribute('aria-pressed', isPassword);
            const duration = TOGGLE_SPEED;
            
            const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789`~,.<>?/;":][}{+_)(*&^%$#@!±=-§';
            
            if (isPassword) {
                // Chuyển từ password sang text
                if (blinkTl) blinkTl.kill();
                if (EYE) {
                    gsap.to(EYE, { autoAlpha: 0, duration: 0.2 }); // Ẩn mắt khi nhắm
                }
                
                gsap.timeline({
                    onComplete: () => {
                        busy = false;
                    }
                })
                .to(TOGGLE.querySelector('.lid--upper'), {
                    morphSVG: TOGGLE.querySelector('.lid--lower'),
                    duration
                })
                .to(TOGGLE.querySelector('defs path:first-child'), {
                    morphSVG: TOGGLE.querySelector('defs path:last-child'),
                    duration
                }, 0)
                .to(PROXY, {
                    duration: ENCRYPT_SPEED,
                    onStart: () => {
                        INPUT.type = 'text';
                    },
                    onComplete: () => {
                        PROXY.innerHTML = '';
                        INPUT.value = val;
                    },
                    scrambleText: {
                        chars,
                        text: val.charAt(val.length - 1) === ' ' ?
                            `${val.slice(0, val.length - 1)}${chars.charAt(Math.floor(Math.random() * chars.length))}` :
                            val
                    },
                    onUpdate: () => {
                        const len = val.length - PROXY.innerText.length;
                        INPUT.value = `${PROXY.innerText}${new Array(len).fill('•').join('')}`;
                    }
                }, 0);
            } else {
                // Chuyển từ text sang password
                if (EYE) {
                    gsap.to(EYE, { autoAlpha: 1, duration: 0.2 }); // Mở mắt trở lại
                }
                
                gsap.timeline({
                    onComplete: () => {
                        BLINK();
                        busy = false;
                    }
                })
                .to(TOGGLE.querySelector('.lid--upper'), {
                    morphSVG: TOGGLE.querySelector('.lid--upper'),
                    duration
                })
                .to(TOGGLE.querySelector('defs path:first-child'), {
                    morphSVG: TOGGLE.querySelector('defs path:first-child'),
                    duration
                }, 0)
                .to(PROXY, {
                    duration: ENCRYPT_SPEED,
                    onComplete: () => {
                        INPUT.type = 'password';
                        INPUT.value = val;
                        PROXY.innerHTML = '';
                    },
                    scrambleText: {
                        chars,
                        text: new Array(INPUT.value.length).fill('•').join('')
                    },
                    onUpdate: () => {
                        INPUT.value = `${PROXY.innerText}${val.slice(PROXY.innerText.length, val.length)}`;
                    }
                }, 0);
            }
        });
    });
});