/*****************************************
 * TỔNG HỢP SCRIPTS CHO PHẦN MENU HEADER *
 *****************************************/
document.addEventListener('DOMContentLoaded', function () {
  // Danh sách các liên kết và trang tương ứng
  const navItems = [
    { href: 'index.html', selector: '.primary-nav-item:nth-child(1)' },
    { href: 'about.html', selector: '.primary-nav-item:nth-child(2)' },
    { href: 'services.html', selector: '.primary-nav-item:nth-child(3)' },
    { href: 'tracking-shipment.html', selector: '.primary-nav-item:nth-child(4)' },
    { href: 'price-check.html', selector: '.primary-nav-item:nth-child(5)' },
    { href: 'guidance.html', selector: '.primary-nav-item:nth-child(6)' },
    { href: 'contact.html', selector: '.primary-nav-item:nth-child(7)' }
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

  // Lấy tên file từ URL hiện tại, loại bỏ tiền tố /en/
  let currentPath = window.location.pathname.split('/').pop() || 'index.html';
  if (currentPath.startsWith('en/')) {
    currentPath = currentPath.replace('en/', '');
  }

  // Xóa và gán lớp selected dựa trên trang hiện tại
  clearSelectedClasses();
  setSelectedClass(currentPath);

  // Xử lý sự kiện nhấp chuột
  const navLinks = document.querySelectorAll('.primary-nav-item > .primary-nav-link:not(.clickable), .secondary-nav-item > .secondary-nav-link[href="services.html"]');
  navLinks.forEach(link => {
    link.addEventListener('click', function (event) {
      event.preventDefault();
      let href = this.getAttribute('href');

      // Điều chỉnh href dựa trên ngôn ngữ hiện tại và môi trường
      if (currentLang === 'en' && window.location.protocol !== 'file:') {
        if (!href.startsWith('/en/')) {
          href = '/en/' + href;
        }
      } else {
        href = href.replace('/en/', '');
      }

      // Xóa và gán lớp selected
      clearSelectedClasses();
      setSelectedClass(href);

      // Thêm cache-busting và chuyển hướng
      const timestamp = new Date().getTime();
      window.location.href = href + `?t=${timestamp}`;
    });
  });
});

document.addEventListener('DOMContentLoaded', function () {
  // Select all primary navigation links
  const navLinks = document.querySelectorAll('.primary-nav-link');

  navLinks.forEach(link => {
    link.addEventListener('click', function (event) {
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

// Script cho mở rộng sub-menu trên mobile
document.addEventListener('DOMContentLoaded', () => {
  const clickableItems = document.querySelectorAll('.primary-nav-link.clickable, .secondary-nav-link.clickable');

  clickableItems.forEach((item) => {
    item.addEventListener('click', (e) => {
      if (window.innerWidth <= 991) {
        e.preventDefault();
        e.stopPropagation(); // Ngăn sự kiện nổi bọt

        const parent = item.parentElement;
        const isPrimary = item.classList.contains('primary-nav-link');
        const isSecondary = item.classList.contains('secondary-nav-link');

        // Đóng tất cả menu cùng cấp trước khi mở menu mới
        if (isPrimary) {
          document.querySelectorAll('.primary-nav-item.toggle-mobile').forEach((otherParent) => {
            if (otherParent !== parent) {
              otherParent.classList.remove('toggle-mobile');
            }
          });
        } else if (isSecondary) {
          // Đóng tất cả secondary-nav-item khác cùng cấp
          const primaryParent = parent.closest('.primary-nav-item');
          if (primaryParent) {
            primaryParent.querySelectorAll('.secondary-nav-item.toggle-mobile').forEach((otherParent) => {
              if (otherParent !== parent) {
                otherParent.classList.remove('toggle-mobile');
              }
            });
          }
        }

        // Toggle menu hiện tại
        parent.classList.toggle('toggle-mobile');
      }
    });
  });
});
/*****************************************
 * TỔNG HỢP SCRIPTS CHO PHẦN MENU HEADER *
 *****************************************/

// Script scroll hiện section
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

/*****************
 * ADD ANIMATION *
 *****************/
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const animationName = entry.target.getAttribute("data-animation");
      entry.target.classList.add(animationName || "fade-in-down");
      entry.target.style.opacity = 1;
    }
  });
});

document.querySelectorAll(".animation").forEach((element) => {
  const animationDelay = element.getAttribute("data-animation-delay");
  element.style.animationDelay = animationDelay || "0.2s";
  element.style.opacity = 0;
  observer.observe(element);
});

// Remove animation after click header to change URL
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
document.addEventListener('DOMContentLoaded', function () {
  const iconNeedHelp = document.getElementById('icon-need-help');
  const chatBox = document.getElementById('chat-box');
  const popupForm = document.getElementById('popup-form');

  // Hàm hiển thị chat-box trong 7 giây khi load trang
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
 * SONG NGỮ *
 ***********************************/
const languageSwitcher = document.querySelector(".language-switcher");
const languageDropdown = document.querySelector(".language-dropdown");
const languageTitle = document.querySelector(".language-switcher .language-title");
const languageImg = document.querySelector("#current-flag");
const languageOptions = document.querySelectorAll(".language-dropdown li a");

// Load ngôn ngữ từ localStorage hoặc mặc định là 'vi'
let currentLang = localStorage.getItem("language") || "vi";

// Đặt mặc định tiếng Việt nếu localStorage trống
if (!localStorage.getItem("language")) {
  localStorage.setItem("language", "vi");
}

// Hàm tải file JSON ngôn ngữ
async function loadLanguage(lang, isUserTriggered = false) {
  try {
    // Thêm cache-busting vào URL file JSON
    const timestamp = new Date().getTime();
    const response = await fetch(`/languages/${lang}.json?t=${timestamp}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const translations = await response.json();
    applyTranslations(translations);
    currentLang = lang;
    localStorage.setItem("language", lang);

    // Cập nhật tiêu đề và cờ
    languageTitle.textContent = translations[languageTitle.getAttribute("data-key")];
    languageImg.src = translations[`flag_${lang}`] || (lang === "vi" ? "/image/icon/vn.38e19a45.png" : "/image/icon/en.5a569d53.png");

    // Cập nhật lớp visible cho dropdown
    document.querySelectorAll(".language-dropdown li").forEach(li => {
      li.classList.toggle("visible", li.getAttribute("data-lang") === lang);
    });

    // Chỉ reload trang nếu chạy trên server và ngôn ngữ thay đổi
    if (isUserTriggered && window.location.protocol !== "file:") {
      let newUrl = window.location.pathname;
      if (lang === "en" && !newUrl.startsWith("/en")) {
        newUrl = "/en" + newUrl;
      } else if (lang === "vi" && newUrl.startsWith("/en")) {
        newUrl = newUrl.replace("/en", "");
      }
      newUrl += `?t=${timestamp}`;
      window.location.href = newUrl; // Reload trang
    }

    // Cập nhật hiệu ứng đánh chữ khi ngôn ngữ thay đổi
    const introText = document.querySelector("#intro-text");
    const aboutSection = document.querySelector(".uw_section_container");
    if (introText && aboutSection && getComputedStyle(aboutSection).display !== 'none') {
      startTypingEffect(introText, translations["about_intro_text"] || "");
    }

    // Cập nhật thẻ hreflang
    updateHreflang(lang);
  } catch (error) {
    console.error("Error loading language:", error);
    if (lang !== "vi") loadLanguage("vi");
  }
}

// Hàm áp dụng bản dịch
function applyTranslations(translations) {
  document.querySelectorAll("[data-key]").forEach(element => {
    const key = element.getAttribute("data-key");
    if (translations[key]) {
      if (element.tagName === "INPUT" || element.tagName === "TEXTAREA") {
        element.placeholder = translations[key];
      } else if (element.id !== "intro-text") { // Bỏ qua intro-text để xử lý riêng
        element.textContent = translations[key];
      }
    }
  });
  document.title = translations.title || "UNIWAVE LOGISTICS";
}

// Hàm cập nhật hreflang
function updateHreflang(lang) {
  document.querySelectorAll('link[hreflang]').forEach(link => link.remove());
  let hreflangDefault = document.createElement("link");
  hreflangDefault.rel = "alternate";
  hreflangDefault.hreflang = "x-default";
  hreflangDefault.href = lang === "vi" ? window.location.pathname.replace("/en", "") : "/en" + window.location.pathname.replace("/en", "");
  document.head.appendChild(hreflangDefault);
  let hreflangVi = document.createElement("link");
  hreflangVi.rel = "alternate";
  hreflangVi.hreflang = "vi";
  hreflangVi.href = window.location.pathname.replace("/en", "");
  document.head.appendChild(hreflangVi);
  let hreflangEn = document.createElement("link");
  hreflangEn.rel = "alternate";
  hreflangEn.hreflang = "en";
  hreflangEn.href = window.location.pathname.startsWith("/en") ? window.location.pathname : "/en" + window.location.pathname;
  document.head.appendChild(hreflangEn);
}

// Xử lý chọn ngôn ngữ
languageOptions.forEach(option => {
  option.addEventListener("click", function (event) {
    event.preventDefault();
    event.stopPropagation();
    const selectedLang = this.getAttribute("data-lang");
    if (selectedLang !== currentLang) { // Chỉ reload nếu ngôn ngữ thay đổi
      loadLanguage(selectedLang, true);
      languageDropdown.classList.remove("visible");
    }
  });
});

// Đóng dropdown khi nhấp ra ngoài
document.addEventListener("click", function (event) {
  if (!languageSwitcher.contains(event.target) && !languageDropdown.contains(event.target)) {
    languageDropdown.classList.remove("visible");
  }
});

// Mở/đóng dropdown khi click
languageSwitcher.addEventListener("click", function (event) {
  event.preventDefault();
  languageDropdown.classList.toggle("visible");
});
/***********************************
 * SONG NGỮ *
 ***********************************/

/***********************************
 * ĐẾM SỐ VÀ CHẠY CHỮ FUNCTIONS *
 ***********************************/
function formatNumber(number, prefix = '') {
  return prefix + Math.floor(number).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

function startCounter(element, target, duration = 3000) {
  let start = 0;
  const increment = target / (duration / 16);
  const prefix = element.dataset.prefix || '';

  const interval = setInterval(() => {
    start += increment;
    if (start >= target) {
      element.textContent = formatNumber(target, prefix);
      clearInterval(interval);
      return;
    }
    element.textContent = formatNumber(start, prefix);
  }, 16);
}

function startTypingEffect(element, text, speed = 50) {
  if (!element) {
    console.warn('Intro text element not found.');
    return;
  }
  element.textContent = "";
  element.classList.add('uw_typing_effect');
  let index = 0;

  function type() {
    if (index < text.length) {
      element.textContent = text.slice(0, index + 1);
      index++;
      setTimeout(type, speed);
    } else {
      element.classList.remove('uw_typing_effect');
    }
  }
  type();
}

// Kiểm tra IntersectionObserver
if (!('IntersectionObserver' in window)) {
  const polyfill = document.createElement('script');
  polyfill.src = 'https://polyfill.io/v3/polyfill.min.js?features=IntersectionObserver';
  document.head.appendChild(polyfill);
}

/***********************************
 * MODULE HIỆU ỨNG ĐÁNH CHỮ *
 ***********************************/
const introText = document.querySelector('#intro-text');
const aboutSection = document.querySelector('.uw_section_container');
let typingHasStarted = false;

if (aboutSection && introText && getComputedStyle(aboutSection).display !== 'none') {
  const observerTyping = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !typingHasStarted) {
          console.log('Typing effect observer triggered');
          typingHasStarted = true;
          const textToType = introText.getAttribute("data-key") ? document.querySelector("[data-key='about_intro_text']").textContent : "";
          startTypingEffect(introText, textToType);
          observerTyping.disconnect();
        }
      });
    },
    { threshold: 0.1 }
  );
  observerTyping.observe(aboutSection);
} else {
  console.warn('About section or intro-text not found or not visible.');
}

/***********************************
 * MODULE ĐẾM SỐ TRANG HOME *
 ***********************************/
const aboutCounters = document.querySelectorAll('.uw_stat_item h3');
let counterHasStarted = false;

if (aboutSection && aboutCounters.length > 0 && getComputedStyle(aboutSection).display !== 'none') {
  const observerCounter = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !counterHasStarted) {
          console.log('Counter effect observer triggered');
          counterHasStarted = true;
          aboutCounters.forEach((counter) => {
            const target = parseInt(counter.dataset.target);
            if (!isNaN(target)) {
              startCounter(counter, target);
            } else {
              console.warn('Invalid target value for counter:', counter);
            }
          });
          observerCounter.disconnect();
        }
      });
    },
    { threshold: 0.1 }
  );
  observerCounter.observe(aboutSection);
} else {
  console.warn('About section or counters not found or not visible.');
}

/************************************
 * SECTION MISSION STATS TRANG ABOUT *
 ************************************/
const missionStatsSection = document.querySelector('.mission__stats');
const missionCounters = document.querySelectorAll('.mission__stat-number');
let missionHasStarted = false;

if (missionStatsSection && getComputedStyle(missionStatsSection).display !== 'none') {
  const observerMissionStats = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !missionHasStarted) {
          console.log('Mission stats observer triggered');
          missionHasStarted = true;
          missionCounters.forEach((counter) => {
            const target = parseInt(counter.dataset.target);
            if (!isNaN(target)) {
              startCounter(counter, target);
            } else {
              console.warn('Invalid target value for mission counter:', counter);
            }
          });
          observerMissionStats.disconnect();
        }
      });
    },
    { threshold: 0.1 }
  );
  observerMissionStats.observe(missionStatsSection);
} else {
  console.warn('Mission stats section is not visible or not found.');
}

/***********************************
 * KHỞI TẠO NGÔN NGỮ *
 ***********************************/
const urlParams = new URLSearchParams(window.location.search);
let urlLang = urlParams.get("lang") || localStorage.getItem("language") || (window.location.pathname.startsWith("/en") ? "en" : "vi");
loadLanguage(urlLang);