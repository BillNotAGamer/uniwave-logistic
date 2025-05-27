// Script trang home
document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('.services, .partners, .cta, .cta-container, #fbot');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
            else {
                entry.target.classList.remove('visible'); // Ẩn lại khi không còn trong viewport
            }
        });
    }, { threshold: 0.1 });

    sections.forEach(section => observer.observe(section));
});

// Script cho phần chat-box và popup-form trang home
document.addEventListener('DOMContentLoaded', function() {
    const iconNeedHelp = document.getElementById('icon-need-help');
    const chatBox = document.getElementById('chat-box');
    const popupForm = document.getElementById('popup-form');

    // Hàm hiển thị chat-box trong 5 giây khi load trang
    function showChatBoxTemporarily() {
        chatBox.style.display = 'block';
        setTimeout(() => {
            chatBox.style.display = 'none';
        }, 4000);
    }

    // Hàm toggle popup-form
    window.togglePopup = function() {
        popupForm.style.display = popupForm.style.display === 'block' ? 'none' : 'block';
        chatBox.style.display = 'none'; // Ẩn chat-box khi toggle popup-form
    }

    // Hiển thị chat-box khi click vào icon
    iconNeedHelp.querySelector('a').addEventListener('click', function(e) {
        e.preventDefault();      
        popupForm.style.display = 'block';
        if (popupForm.style.display === 'block') {
            chatBox.style.display = 'none';
        }
    });

    // Hiển thị popup-form khi click vào chat-box
    chatBox.addEventListener('click', function() {
        chatBox.style.display = 'none';
        popupForm.style.display = 'block';
    });

    

    // Gọi hàm hiển thị chat-box khi load trang
    showChatBoxTemporarily();
});

document.addEventListener("DOMContentLoaded", function () {
    // Đóng/mở input tìm kiếm
    const searchBar = document.querySelector(".search-bar");
    const searchIcon = document.querySelector(".search-bar > img:first-child");
    const searchInput = document.querySelector(".search-bar input");
    const closeSearch = document.querySelector(".search-bar .close-search");

    searchIcon.addEventListener("click", function () {
        searchBar.classList.toggle("open");
        searchInput.classList.toggle("visible");
        closeSearch.classList.toggle("visible");
        if (searchBar.classList.contains("open")) {
            searchInput.focus(); // Đặt con trỏ vào input khi mở
        } else {
            searchInput.value = ""; // Xóa nội dung input khi đóng
        }
    });

    closeSearch.addEventListener("click", function () {
        searchBar.classList.remove("open");
        searchInput.classList.remove("visible");
        closeSearch.classList.remove("visible");
        searchInput.value = ""; // Xóa nội dung input
    });

    // Chọn ngôn ngữ
    const languageSwitcher = document.querySelector(".language-switcher");
    const languageDropdown = document.querySelector(".language-dropdown");
    const languageTitle = document.querySelector(".language-switcher .language-title");
    const languageImg = document.querySelector(".language-switcher > img");
    const languageOptions = document.querySelectorAll(".language-dropdown li a");

    languageSwitcher.addEventListener("click", function (event) {
        event.preventDefault(); // Ngăn chặn hành vi mặc định của liên kết
        languageDropdown.classList.toggle("visible");
    });

    languageOptions.forEach(option => {
        option.addEventListener("click", function (event) {
            event.preventDefault(); // Ngăn chặn chuyển trang ngay lập tức
            const selectedLang = this.textContent.trim();
            const selectedImgSrc = this.querySelector("img").src;

            // Cập nhật tiêu đề và hình ảnh ngôn ngữ
            languageTitle.textContent = selectedLang;
            languageImg.src = selectedImgSrc;

            // Ẩn dropdown sau khi chọn
            languageDropdown.classList.remove("visible");

            // Chuyển trang theo href của liên kết (nếu cần)
            window.location.href = this.href;
        });
    });

    // Đóng dropdown ngôn ngữ khi nhấp ra ngoài
    document.addEventListener("click", function (event) {
        if (!languageSwitcher.contains(event.target) && !languageDropdown.contains(event.target)) {
            languageDropdown.classList.remove("visible");
        }
    });
});

/*****************
 * ADD ANIMATION *
 *****************/
const observer = new IntersectionObserver((entries) => {
  // Loop over the entries
  entries.forEach((entry) => {
    // If the element is visible
    if (entry.isIntersecting) {
      // Add the animation class
      const animationName = entry.target.getAttribute("data-animation");
      entry.target.classList.add(animationName || "fade-in-down");
      entry.target.style.opacity = 1;
    }
  });
});

// Tell the observer which elements to track

document.querySelectorAll(".animation").forEach((element) => {
  const animationDelay = element.getAttribute("data-animation-delay");
  element.style.animationDelay = animationDelay || "0.2s";
  element.style.opacity = 0;
  observer.observe(element);
});

// remove animation after click header to change URL
const navBar = document.querySelector("nav");
navBar.addEventListener("click", (e) => {
  navBar.querySelectorAll(".animation").forEach((navItem) => {
    navItem.style.animation = "none";
  });
});

/*****************
 * END ADD ANIMATION *
 *****************/

/*****************
 * KEY BUILD KEYBUILD*
 *****************/
const publicKey = process.env.EMAILJS_PUBLIC_KEY;
const serviceId = process.env.EMAILJS_SERVICE_ID;
const salesTemplateId = process.env.EMAILJS_SALES_TEMPLATE_ID;
const thankYouTemplateId = process.env.EMAILJS_THANKYOU_TEMPLATE_ID;
/*****************
 * KEY BUILD END *
 *****************/

/********************************
 * IMPORTANT MAIL SENDING POPUP *
 ********************************/
(function(){
            try {
                emailjs.init({ 
                    publicKey: import.meta.env.EMAILJS_PUBLIC_KEY
                });
                console.log("EmailJS initialized successfully");
            } catch (error) {
                console.error("Error initializing EmailJS:", error);
            }
        })();

        function togglePopup() {
            document.getElementById("popup-form").classList.toggle("active");
        }

        const contactForm = document.getElementById("contact-form");
        if (contactForm) {
            contactForm.addEventListener("submit", function(event) {
                event.preventDefault();
                console.log("Form submitted, sending email...");

                emailjs.sendForm(
                    import.meta.env.EMAILJS_SERVICE_ID,
                    import.meta.env.EMAILJS_SALES_TEMPLATE_ID,
                    this
                )
                .then(function(response) {
                    console.log("Sales email sent successfully:", response);
                    emailjs.sendForm(
                        import.meta.env.EMAILJS_SERVICE_ID,
                        import.meta.env.EMAILJS_THANKYOU_TEMPLATE_ID,
                        this
                    )
                    .then(function(response) {
                        console.log("Thank you email sent successfully:", response);
                        alert("Thông tin đã được gửi thành công! Vui lòng kiểm tra email của bạn.");
                        document.getElementById("contact-form").reset();
                        togglePopup();
                    }, function(error) {
                        console.error("Error sending thank you email:", error);
                        alert("Đã có lỗi xảy ra khi gửi email cảm ơn, vui lòng thử lại.");
                    });
                }, function(error) {
                    console.error("Error sending sales email:", error);
                    alert("Đã có lỗi xảy ra khi gửi email đến sales, vui lòng thử lại.");
                });
            });
        } else {
            console.error("Contact form not found");
        }
/********************************
 * IMPORTANT MAIL SENDING POPUP *
 ********************************/