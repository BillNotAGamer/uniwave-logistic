document.addEventListener('DOMContentLoaded', function() {
    // Danh sách các liên kết và trang tương ứng
    const navItems = [
        { href: 'index.html', selector: '.primary-nav-item:nth-child(1)' },
        { href: 'about.html', selector: '.primary-nav-item:nth-child(2)' },
        { href: 'services.html', selector: '.primary-nav-item:nth-child(3)' }, // Mục "Dịch vụ"
        { href: 'tracking-shipment.html', selector: '.primary-nav-item:nth-child(4)' },
        { href: 'price-check.html', selector: '.primary-nav-item:nth-child(5)' },
        { href: 'contact.html', selector: '.primary-nav-item:nth-child(6)' }
    ];

    // Hàm xóa lớp selected khỏi tất cả các mục
    function clearSelectedClasses() {
        document.querySelectorAll('.primary-nav-item').forEach(item => {
            item.classList.remove('selected-desktop', 'selected-mobile');
        });
    }

    // Hàm thêm lớp selected cho mục tương ứng
    function setSelectedClass(path) {
        const currentItem = navItems.find(item => path.endsWith(item.href));
        if (currentItem) {
            const navItem = document.querySelector(currentItem.selector);
            if (navItem) {
                navItem.classList.add('selected-desktop', 'selected-mobile');
            }
        }
    }

    // Lấy tên file từ URL hiện tại
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';

    // Xóa và gán lớp selected dựa trên trang hiện tại
    clearSelectedClasses();
    setSelectedClass(currentPath);

    // Xử lý sự kiện nhấp chuột
    const navLinks = document.querySelectorAll('.primary-nav-item > .primary-nav-link:not(.clickable), .secondary-nav-item > .secondary-nav-link[href="services.html"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            // Ngăn hành vi mặc định để xử lý thủ công
            event.preventDefault();
            const href = this.getAttribute('href');
            
            // Xóa và gán lớp selected
            clearSelectedClasses();
            setSelectedClass(href);

            // Chuyển hướng tới trang
            window.location.href = href;
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
  // Existing code for services section
  const servicesSection = document.getElementById('services');
  if (servicesSection) {
    servicesSection.classList.add('visible');
  }

  // Observe sections for animation
  const sections = document.querySelectorAll(
    '.services, .partners, .cta, .cta-container, #fbot, .container-about, .reasons__container, .mission__background'
  );
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Reset animation for services (keeping your existing logic)
          if (entry.target.id === 'services') {
            const services = entry.target.querySelectorAll('.service');
            services.forEach((service) => {
              service.style.animation = 'none';
              service.offsetHeight; // Trigger reflow
              service.style.animation = null;
            });
          }
        } else {
          entry.target.classList.remove('visible'); // Optional: Remove visible class when out of view
        }
      });
    },
    { threshold: 0.1 } // Trigger when 10% of the section is visible
  );

  sections.forEach((section) => observer.observe(section));
});

document.addEventListener('DOMContentLoaded', function() {
    // Select all primary navigation links
    const navLinks = document.querySelectorAll('.primary-nav-item > .primary-nav-link');

    navLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            // Prevent default behavior for expandable items to avoid conflicts
            if (this.parentElement.classList.contains('expandable')) {
                return;
            }

            // Remove selected classes from all primary nav items
            document.querySelectorAll('.primary-nav-item').forEach(item => {
                item.classList.remove('selected-desktop', 'selected-mobile');
            });

            // Add selected classes to the clicked link's parent
            this.parentElement.classList.add('selected-desktop', 'selected-mobile');
        });
    });
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
 * ADD ANIMATION *
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
        }, 7000);
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

/***********************************
 * SECTION VỀ CHÚNG TÔI TRANG HOME *
 ***********************************/
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
/***********************************
 * SECTION VỀ CHÚNG TÔI TRANG HOME *
 ***********************************/
