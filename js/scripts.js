/*****************************************
 * TỔNG HỢP SCRIPTS CHO PHẦN MENU HEADER *
 *****************************************/
document.addEventListener('DOMContentLoaded', function () {
  // Danh sách các liên kết và route
  const navItems = [
    { route: '', selector: '.primary-nav-item:nth-child(1)' },
    { route: 'introduce', selector: '.primary-nav-item:nth-child(2)' },
    { route: 'services', selector: '.primary-nav-item:nth-child(3)' },
    { route: 'tracking-shipment', selector: '.primary-nav-item:nth-child(4)' },
    { route: 'price-check', selector: '.primary-nav-item:nth-child(5)' },
    { route: 'guidance', selector: '.primary-nav-item:nth-child(6)' },
    { route: 'contact', selector: '.primary-nav-item:nth-child(7)' }
  ];

  // Hàm xóa lớp selected
  function clearSelectedClasses() {
    document.querySelectorAll('.primary-nav-item').forEach(item => {
      item.classList.remove('selected-desktop', 'selected-mobile');
    });
  }

  // Hàm thêm lớp selected
  function setSelectedClass(currentRoute) {
    const currentItem = navItems.find(item => currentRoute === item.route || (currentRoute === '' && item.route === ''));
    if (currentItem) {
      const navItem = document.querySelector(currentItem.selector);
      if (navItem) {
        navItem.classList.add('selected-desktop', 'selected-mobile');
      }
    }
  }

  // Lấy route từ URL
  let currentPath = window.location.pathname;
  let currentRoute = currentPath.replace(/^\/(vi|en)\/?/, '') || '';
  if (currentRoute === 'index') currentRoute = '';

  clearSelectedClasses();
  setSelectedClass(currentRoute);

  // Xử lý sự kiện nhấp chuột
  const navLinks = document.querySelectorAll('.primary-nav-item > .primary-nav-link:not(.clickable), .secondary-nav-item > .secondary-nav-link[href="/services"]');
  navLinks.forEach(link => {
    link.addEventListener('click', function (event) {
      event.preventDefault();
      let route = this.getAttribute('href').replace(/^\/(vi|en)\/?/, '') || '';
      if (route === 'index') route = '';

      let href = `/${currentLang}${route ? '/' + route : ''}`;
      clearSelectedClasses();
      setSelectedClass(route);

      const timestamp = new Date().getTime();
      window.location.href = href + `?t=${timestamp}`;
    });
  });
});

document.addEventListener('DOMContentLoaded', function () {
  const navLinks = document.querySelectorAll('.primary-nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', function (event) {
      if (this.parentElement.classList.contains('expandable')) {
        return;
      }
      document.querySelectorAll('.primary-nav-item').forEach(item => {
        item.classList.remove('selected-desktop', 'selected-mobile');
      });
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
        e.stopPropagation();
        const parent = item.parentElement;
        const isPrimary = item.classList.contains('primary-nav-link');
        const isSecondary = item.classList.contains('secondary-nav-link');

        if (isPrimary) {
          document.querySelectorAll('.primary-nav-item.toggle-mobile').forEach((otherParent) => {
            if (otherParent !== parent) {
              otherParent.classList.remove('toggle-mobile');
            }
          });
        } else if (isSecondary) {
          const primaryParent = parent.closest('.primary-nav-item');
          if (primaryParent) {
            primaryParent.querySelectorAll('.secondary-nav-item.toggle-mobile').forEach((otherParent) => {
              if (otherParent !== parent) {
                otherParent.classList.remove('toggle-mobile');
              }
            });
          }
        }
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
  const servicesSection = document.getElementById('services');
  if (servicesSection) {
    servicesSection.classList.add('visible');
  }

  const sections = document.querySelectorAll(
    '.services, .partners, .cta, .cta-container, #fbot, .container-about, .reasons__container, .mission__background'
  );
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          if (entry.target.id === 'services') {
            const services = entry.target.querySelectorAll('.service');
            services.forEach((service) => {
              service.style.animation = 'none';
              service.offsetHeight;
              service.style.animation = null;
            });
          }
        } else {
          entry.target.classList.remove('visible');
        }
      });
    },
    { threshold: 0.1 }
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

  function showChatBoxTemporarily() {
    chatBox.style.display = 'block';
    setTimeout(() => {
      chatBox.style.display = 'none';
    }, 7000);
  }

  window.togglePopup = function () {
    popupForm.style.display = popupForm.style.display === 'block' ? 'none' : 'block';
    chatBox.style.display = 'none';
  }

  iconNeedHelp.querySelector('a').addEventListener('click', function (e) {
    e.preventDefault();
    popupForm.style.display = 'block';
    if (popupForm.style.display === 'block') {
      chatBox.style.display = 'none';
    }
  });

  chatBox.addEventListener('click', function () {
    chatBox.style.display = 'none';
    popupForm.style.display = 'block';
  });

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

let currentLang = localStorage.getItem("language") || "vi";
if (!localStorage.getItem("language")) {
  localStorage.setItem("language", "vi");
}

async function loadLanguage(lang, isUserTriggered = false) {
  try {
    const timestamp = new Date().getTime();
    const response = await fetch(`/languages/${lang}.json?t=${timestamp}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const translations = await response.json();
    applyTranslations(translations);
    currentLang = lang;
    localStorage.setItem("language", lang);

    languageTitle.textContent = translations[languageTitle.getAttribute("data-key")];
    languageImg.src = translations[`flag_${lang}`] || (lang === "vi" ? "/image/icon/vn.38e19a45.png" : "/image/icon/en.5a569d53.png");

    document.querySelectorAll(".language-dropdown li").forEach(li => {
      li.classList.toggle("visible", li.getAttribute("data-lang") === lang);
    });

    if (isUserTriggered) {
      let currentRoute = window.location.pathname.replace(/^\/(vi|en)\/?/, '') || '';
      if (currentRoute === 'index') currentRoute = '';
      const newUrl = `/${lang}${currentRoute ? '/' + currentRoute : ''}?t=${timestamp}`;
      window.location.href = newUrl;
    }

    const introText = document.querySelector("#intro-text");
    const aboutSection = document.querySelector(".uw_section_container");
    if (introText && aboutSection && getComputedStyle(aboutSection).display !== 'none') {
      startTypingEffect(introText, translations["about_intro_text"] || "");
    }

    updateHreflang(lang);
  } catch (error) {
    console.error("Error loading language:", error);
    if (lang !== "vi") loadLanguage("vi");
  }
}

function applyTranslations(translations) {
  document.querySelectorAll("[data-key]").forEach(element => {
    const key = element.getAttribute("data-key");
    if (translations[key]) {
      if (element.tagName === "INPUT" || element.tagName === "TEXTAREA") {
        element.placeholder = translations[key];
      } else if (element.id !== "intro-text") {
        element.textContent = translations[key];
      }
    }
  });
  document.title = translations.title || "UNIWAVE LOGISTICS";
}

function updateHreflang(lang) {
  document.querySelectorAll('link[hreflang]').forEach(link => link.remove());
  let currentRoute = window.location.pathname.replace(/^\/(vi|en)\/?/, '') || '';
  if (currentRoute === 'index') currentRoute = '';

  let hreflangDefault = document.createElement("link");
  hreflangDefault.rel = "alternate";
  hreflangDefault.hreflang = "x-default";
  hreflangDefault.href = `/vi${currentRoute ? '/' + currentRoute : ''}`;
  document.head.appendChild(hreflangDefault);

  let hreflangVi = document.createElement("link");
  hreflangVi.rel = "alternate";
  hreflangVi.hreflang = "vi";
  hreflangVi.href = `/vi${currentRoute ? '/' + currentRoute : ''}`;
  document.head.appendChild(hreflangVi);

  let hreflangEn = document.createElement("link");
  hreflangEn.rel = "alternate";
  hreflangEn.hreflang = "en";
  hreflangEn.href = `/en${currentRoute ? '/' + currentRoute : ''}`;
  document.head.appendChild(hreflangEn);
}

languageOptions.forEach(option => {
  option.addEventListener("click", function (event) {
    event.preventDefault();
    event.stopPropagation();
    const selectedLang = this.getAttribute("data-lang");
    if (selectedLang !== currentLang) {
      loadLanguage(selectedLang, true);
      languageDropdown.classList.remove("visible");
    }
  });
});

document.addEventListener("click", function (event) {
  if (!languageSwitcher.contains(event.target) && !languageDropdown.contains(event.target)) {
    languageDropdown.classList.remove("visible");
  }
});

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
let urlLang = urlParams.get("lang") || localStorage.getItem("language") || "vi";
if (!window.location.pathname.startsWith("/vi") && !window.location.pathname.startsWith("/en")) {
  window.location.href = `/vi?t=${new Date().getTime()}`;
} else {
  loadLanguage(urlLang);
}