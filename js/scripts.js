document.addEventListener('DOMContentLoaded', () => {
    // Immediately add 'visible' class to footer
    const footer = document.getElementById('fbot');
    if (footer) {
        footer.classList.add('visible');
    }

    // Observe other sections for animation
    const sections = document.querySelectorAll('.services, .partners, .cta, .cta-container');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            } else {
                entry.target.classList.remove('visible');
            }
        });
    }, { threshold: 0.1 });

    sections.forEach(section => observer.observe(section));
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


/********************************
 * IMPORTANT MAIL SENDING POPUP *
 ********************************/
// Script cho phần chat-box và popup-form trang home
document.addEventListener('DOMContentLoaded', function () {
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
    window.togglePopup = function () {
        popupForm.style.display = popupForm.style.display === 'block' ? 'none' : 'block';
        chatBox.style.display = 'none'; // Ẩn chat-box khi toggle popup-form
    }

    // Hiển thị chat-box khi click vào icon
    iconNeedHelp.querySelector('a').addEventListener('click', function (e) {
        e.preventDefault();
        popupForm.style.display = 'block';
        if (popupForm.style.display === 'block') {
            chatBox.style.display = 'none';
        }
    });

    // Hiển thị popup-form khi click vào chat-box
    chatBox.addEventListener('click', function () {
        chatBox.style.display = 'none';
        popupForm.style.display = 'block';
    });
    // Gọi hàm hiển thị chat-box khi load trang
    showChatBoxTemporarily();
});
/********************************
 * IMPORTANT MAIL SENDING POPUP *
 ********************************/

/********************************
 * SECTION VỀ CHÚNG TÔI TRANG HOME *
 ********************************/
 // Văn bản cần đánh chữ
    const textToType = "UniWave chuyên cung cấp các dịch vụ logistics tối ưu, linh hoạt theo nhu cầu thực tế của doanh nghiệp, được triển khai bởi đội ngũ chuyên gia giàu kinh nghiệm.";
    
    // Hàm định dạng số với dấu phân cách hàng nghìn
    function formatNumber(number, prefix = '') {
      return prefix + Math.floor(number).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }

    // Hàm tạo hiệu ứng đếm số
    function startCounter(element, target, duration = 3000) {
      let start = 0;
      const increment = target / (duration / 16); // Tính bước tăng dựa trên 60fps (~16ms mỗi frame)
      const prefix = element.dataset.prefix || '';
      
      function update() {
        start += increment;
        if (start >= target) {
          element.textContent = formatNumber(target, prefix);
          return;
        }
        element.textContent = formatNumber(start, prefix);
        requestAnimationFrame(update);
      }
      requestAnimationFrame(update);
    }

    // Hàm tạo hiệu ứng đánh chữ
    function startTyping(element, text, speed = 50) {
      let index = 0;
      element.classList.add('uw_typing_effect');

      function type() {
        if (index < text.length) {
          element.textContent = text.slice(0, index + 1);
          index++;
          setTimeout(type, speed);
        } else {
          element.classList.remove('uw_typing_effect'); // Xóa con trỏ khi hoàn tất
        }
      }
      type();
    }

    // Sử dụng IntersectionObserver để phát hiện khi section xuất hiện
    const section = document.querySelector('.uw_section_container');
    const counters = document.querySelectorAll('.uw_stat_item h3');
    const introText = document.querySelector('#intro-text');
    let hasStarted = false; // Đảm bảo chỉ chạy một lần

    const observerSectionAbout = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasStarted) {
            hasStarted = true; // Đánh dấu đã chạy
            // Kích hoạt hiệu ứng đánh chữ
            startTyping(introText, textToType);
            // Kích hoạt hiệu ứng đếm số
            counters.forEach((counter) => {
              const target = parseInt(counter.dataset.target);
              startCounter(counter, target);
            });
            observerSectionAbout.disconnect(); // Ngắt observer sau khi chạy
          }
        });
      },
      { threshold: 0.5 } // Kích hoạt khi 50% section xuất hiện
    );

    observerSectionAbout.observe(section);
/********************************
 * SECTION VỀ CHÚNG TÔI TRANG HOME *
 ********************************/
