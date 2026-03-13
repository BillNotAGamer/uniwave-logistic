/*****************************************
 * TỔNG HỢP SCRIPTS CHO PHẦN MENU HEADER *
 *****************************************/
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


// Script đóng mở menu trên mobile
document.addEventListener("DOMContentLoaded", function () {
      const navbarToggler = document.querySelector(".menu-toggle");
      const navbarCollapse = document.querySelector(".menu-collapse");
      const closeButton = document.querySelector(".close-search");

      navbarToggler.addEventListener("click", function () {
        navbarCollapse.classList.toggle("visible");
      });

      closeButton.addEventListener("click", function () {
        navbarCollapse.classList.remove("visible");
      });
    });

/**************************************
 * HEADER SEARCH NAVIGATION (STATIC)
 **************************************/
document.addEventListener("DOMContentLoaded", () => {
  const pages = [
    { title: "Home", path: "/en", keywords: ["home", "homepage", "start"] },
    { title: "About Us", path: "/en/introduce", keywords: ["about", "introduce", "company"] },
    { title: "Services", path: "/en/services", keywords: ["services", "service", "logistics"] },
    { title: "Domestic Delivery", path: "/en/domestic-delivery-service", keywords: ["domestic", "delivery", "local"] },
    { title: "International Services", path: "/en/international-services", keywords: ["international", "global", "overseas"] },
    { title: "Tracking Shipment", path: "/en/tracking-shipment", keywords: ["tracking", "shipment", "track"] },
    { title: "Price Check", path: "/en/price-check", keywords: ["price", "pricing", "quote"] },
    { title: "Contact", path: "/en/contact", keywords: ["contact", "support", "help"] },
    { title: "Blog", path: "/en/blog", keywords: ["blog", "insights", "news"] },
    { title: "Authentication", path: "/en/authentication", keywords: ["login", "sign in", "register"] },
    { title: "User Dashboard", path: "/en/user-dashboard", keywords: ["dashboard", "account", "profile"] },
    { title: "Trang chu", path: "/vi", keywords: ["trang chu", "home", "homepage"] },
    { title: "Gioi thieu", path: "/vi/introduce", keywords: ["gioi thieu", "about", "company"] },
    { title: "Dich vu", path: "/vi/services", keywords: ["dich vu", "services", "logistics"] },
    { title: "Van chuyen noi dia", path: "/vi/domestic-delivery-service", keywords: ["noi dia", "domestic", "delivery"] },
    { title: "Dich vu quoc te", path: "/vi/international-services", keywords: ["quoc te", "international", "global"] },
    { title: "Theo doi don hang", path: "/vi/tracking-shipment", keywords: ["theo doi", "tracking", "don hang"] },
    { title: "Bao gia", path: "/vi/price-check", keywords: ["bao gia", "price", "quote"] },
    { title: "Lien he", path: "/vi/contact", keywords: ["lien he", "contact", "support"] },
    { title: "Blog", path: "/vi/blog", keywords: ["blog", "tin tuc", "bai viet"] },
    { title: "Dang nhap", path: "/vi/authentication", keywords: ["dang nhap", "login", "register"] },
    { title: "Tai khoan", path: "/vi/user-dashboard", keywords: ["tai khoan", "dashboard", "account"] }
  ];

  const searchBars = document.querySelectorAll(".search-bar");
  if (!searchBars.length) return;

  const normalize = (value) => (value || "").toLowerCase().trim();
  const filterPages = (term) => {
    if (!term) return pages.slice();
    return pages.filter((page) => {
      const titleMatch = normalize(page.title).includes(term);
      const keywordMatch = (page.keywords || []).some((keyword) =>
        normalize(keyword).includes(term)
      );
      return titleMatch || keywordMatch;
    });
  };

  searchBars.forEach((searchBar, index) => {
    const input = searchBar.querySelector("input");
    const closeButton = searchBar.querySelector(".close-search");
    const icon = searchBar.querySelector(".search-icon") || searchBar.querySelector("img");

    if (!input || !closeButton || !icon) return;

    icon.classList.add("search-icon");
    icon.setAttribute("role", "button");
    icon.setAttribute("tabindex", "0");
    icon.setAttribute("aria-label", "Open search");

    input.setAttribute("autocomplete", "off");
    input.setAttribute("aria-autocomplete", "list");
    input.setAttribute("aria-expanded", "false");

    let dropdown = searchBar.querySelector(".search-dropdown");
    if (!dropdown) {
      dropdown = document.createElement("div");
      dropdown.className = "search-dropdown";
      dropdown.setAttribute("role", "listbox");
      dropdown.setAttribute("aria-label", "Search suggestions");
      dropdown.id = `search-dropdown-${index}`;
      searchBar.appendChild(dropdown);
    }
    input.setAttribute("aria-controls", dropdown.id);

    let activeIndex = -1;
    let currentResults = [];

    const positionDropdown = () => {
      const left = input.offsetLeft;
      const width = input.offsetWidth;
      dropdown.style.left = `${left}px`;
      dropdown.style.width = `${width}px`;
      dropdown.style.right = "auto";
    };

    const renderSuggestions = () => {
      const term = normalize(input.value);
      currentResults = filterPages(term);
      dropdown.innerHTML = "";
      activeIndex = -1;

      if (!currentResults.length) {
        const empty = document.createElement("div");
        empty.className = "search-empty";
        empty.textContent = "No pages found";
        dropdown.appendChild(empty);
        positionDropdown();
        return;
      }

      currentResults.forEach((page, pageIndex) => {
        const item = document.createElement("button");
        item.type = "button";
        item.className = "search-suggestion";
        item.setAttribute("role", "option");
        item.setAttribute("data-index", String(pageIndex));

        const title = document.createElement("span");
        title.className = "search-suggestion-title";
        title.textContent = page.title;

        const path = document.createElement("span");
        path.className = "search-suggestion-path";
        path.textContent = page.path;

        item.append(title, path);
        item.addEventListener("click", () => navigateTo(page));
        dropdown.appendChild(item);
      });

      positionDropdown();
    };

    const setActiveIndex = (nextIndex) => {
      if (!currentResults.length) return;

      const maxIndex = currentResults.length - 1;
      if (nextIndex < 0) {
        activeIndex = maxIndex;
      } else if (nextIndex > maxIndex) {
        activeIndex = 0;
      } else {
        activeIndex = nextIndex;
      }

      dropdown.querySelectorAll(".search-suggestion").forEach((item, itemIndex) => {
        const isActive = itemIndex === activeIndex;
        item.classList.toggle("is-active", isActive);
        item.setAttribute("aria-selected", isActive ? "true" : "false");
      });
    };

    const openSearch = () => {
      searchBar.classList.add("active");
      input.setAttribute("aria-expanded", "true");
      input.focus();
      renderSuggestions();
    };

    const closeSearch = () => {
      searchBar.classList.remove("active");
      input.setAttribute("aria-expanded", "false");
      input.value = "";
      dropdown.innerHTML = "";
      activeIndex = -1;
      currentResults = [];
    };

    const navigateTo = (page) => {
      if (!page || !page.path) return;
      closeSearch();
      window.location.href = page.path;
    };

    icon.addEventListener("click", (event) => {
      event.preventDefault();
      openSearch();
    });

    icon.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openSearch();
      }
    });

    input.addEventListener("input", () => {
      if (!searchBar.classList.contains("active")) return;
      renderSuggestions();
    });

    input.addEventListener("keydown", (event) => {
      if (!searchBar.classList.contains("active")) return;

      if (event.key === "ArrowDown") {
        if (!currentResults.length) return;
        event.preventDefault();
        setActiveIndex(activeIndex + 1);
        return;
      }

      if (event.key === "ArrowUp") {
        if (!currentResults.length) return;
        event.preventDefault();
        setActiveIndex(activeIndex - 1);
        return;
      }

      if (event.key === "Enter") {
        if (!currentResults.length) return;
        event.preventDefault();
        const targetIndex = activeIndex >= 0 ? activeIndex : 0;
        navigateTo(currentResults[targetIndex]);
        return;
      }

      if (event.key === "Escape") {
        event.preventDefault();
        closeSearch();
      }
    });

    closeButton.addEventListener("click", () => {
      closeSearch();
    });

    document.addEventListener("click", (event) => {
      if (!searchBar.contains(event.target)) {
        closeSearch();
      }
    });

    window.addEventListener("resize", () => {
      if (searchBar.classList.contains("active")) {
        positionDropdown();
      }
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
    '.services, .partners, .cta, .cta-container, #fbot, .container-about, .reasons__container, .mission__background, .container_about_contact, .blog-preview, .blog-archive'
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
 * XỬ LÝ ROUTE *
 ***********************************/
function getCurrentLanguageFromURL() {
  const path = window.location.pathname;
  if (path.startsWith('/vi')) return 'vi';
  if (path.startsWith('/en')) return 'en';
  return 'en'; // Default tiếng Anh
}

function updateURLForLanguage(lang) {
  let currentPath = window.location.pathname;
  let newPath;

  if (lang === 'vi') {
    if (!currentPath.startsWith('/vi')) {
      newPath = currentPath === '/' || currentPath === '/en' ? '/vi' : `/vi${currentPath.replace(/^\/en/, '')}`;
    } else {
      newPath = currentPath;
    }
  } else if (lang === 'en') {
    if (!currentPath.startsWith('/en')) {
      newPath = currentPath === '/' || currentPath === '/vi' ? '/en' : `/en${currentPath.replace(/^\/vi/, '')}`;
    } else {
      newPath = currentPath;
    }
  }

  if (newPath !== currentPath) {
    const timestamp = new Date().getTime();
    window.location.assign(`${newPath}?t=${timestamp}`);
  }
}

function updateHeaderLinks(lang) {
  document.querySelectorAll('.nav-list a, .profile-menu a, [data-lang-link]').forEach(link => {
    const href = link.getAttribute('href');
    if (href && !href.startsWith('javascript:') && !href.startsWith('http')) {
      const cleanHref = href.replace(/^\/(vi|en)/, '');
      const newHref = `/${lang}${cleanHref.startsWith('/') ? cleanHref : '/' + cleanHref}`;
      link.setAttribute('href', newHref);
    }
  });
}

/***********************************
 * GÁN LỚP SELECTED CHO HEADER *
 ***********************************/
function SelectedNavItem() {
  const currentPath = window.location.pathname;
  const navItems = document.querySelectorAll('.primary-nav-item');

  // Xóa lớp selected khỏi tất cả mục
  navItems.forEach(item => {
    item.classList.remove('selected-desktop', 'selected-mobile');
  });

  // Danh sách ánh xạ URL và mục điều hướng
  const navMap = [
    { paths: ['/en', '/vi'], element: navItems[0] }, // Trang chủ
    { paths: ['/en/introduce', '/vi/introduce'], element: navItems[1] }, // Giới thiệu
    {
      paths: [
        '/en/services', '/vi/services',
        '/en/domestic-delivery-service', '/vi/domestic-delivery-service',
        '/en/international-services', '/vi/international-services',
        '/en/service/transportation/rail-transportation', '/vi/service/transportation/rail-transportation',
        '/en/service/transportation/sea-transport', '/vi/service/transportation/sea-transport',
        '/en/service/transportation/air-transport', '/vi/service/transportation/air-transport'
      ], element: navItems[2]
    }, // Dịch vụ (bao gồm các trang con)
    { paths: ['/en/tracking-shipment', '/vi/tracking-shipment'], element: navItems[3] }, // Theo dõi đơn hàng
    { paths: ['/en/price-check', '/vi/price-check'], element: navItems[4] }, // Báo giá
    { paths: ['/en/blog', '/vi/blog'], element: navItems[5] }, // Tin tức
    { paths: ['/en/contact', '/vi/contact'], element: navItems[6] }, // Liên hệ

  ];

  // Tìm và gán lớp selected
  const currentNav = navMap.find(nav => nav.paths.includes(currentPath));
  if (currentNav) {
    currentNav.element.classList.add('selected-desktop', 'selected-mobile');
  }
}

/***********************************
 * SONG NGỮ *
 ***********************************/
const languageSwitcher = document.querySelector('.language-switcher');
const languageDropdown = document.querySelector('.language-dropdown');
const languageTitle = document.querySelector('.language-switcher .language-title');
const languageImg = document.querySelector('#current-flag');
const languageOptions = document.querySelectorAll('.language-dropdown li a');

async function loadLanguage(lang, isUserTriggered = false) {
  try {
    const timestamp = new Date().getTime();
    const response = await fetch(`/languages/${lang}.json?t=${timestamp}`);
    if (!response.ok) throw new Error(`Failed to load ${lang}.json: ${response.status}`);
    const translations = await response.json();

    applyTranslations(translations);
    localStorage.setItem('language', lang);

    if (languageTitle && languageImg) {
      languageTitle.textContent = translations[languageTitle.getAttribute('data-key')];
      languageImg.src = translations[`flag_${lang}`] || (lang === 'en' ? '/image/icon/en.5a569d53.png' : '/image/icon/vn.38e19a45.png');
    }

    document.querySelectorAll('.language-dropdown li').forEach(li => {
      li.classList.toggle('visible', li.getAttribute('data-lang') === lang);
    });

    updateHeaderLinks(lang);
    SelectedNavItem(); // Cập nhật lớp selected sau khi chuyển ngôn ngữ

    if (isUserTriggered) {
      updateURLForLanguage(lang);
    }

    const introText = document.querySelector('#intro-text');
    const aboutSection = document.querySelector('.uw_section_container');
    if (introText && aboutSection && getComputedStyle(aboutSection).display !== 'none') {
      startTypingEffect(introText, translations['about_intro_text'] || '');
    }

    updateHreflang(lang);
  } catch (error) {
    console.error(`Lỗi khi tải ngôn ngữ ${lang}:`, error);
    if (lang !== 'en') {
      console.warn('Quay về ngôn ngữ mặc định: Tiếng Anh');
      updateURLForLanguage('en');
    }
  }
}

function applyTranslations(translations) {
  document.querySelectorAll('[data-key]').forEach(element => {
    const key = element.getAttribute('data-key');
    if (translations[key]) {
      if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
        element.placeholder = translations[key];
      } else if (element.id !== 'intro-text') {
        element.textContent = translations[key];
      }
    }
  });
  const hasDynamicTitle = document.body?.hasAttribute('data-dynamic-title');
  if (!hasDynamicTitle) {
    document.title = translations.title || 'UNIWAVE LOGISTICS';
  }
}

function updateHreflang(lang) {
  document.querySelectorAll('link[hreflang]').forEach(link => link.remove());

  const currentPath = window.location.pathname.replace(/^\/(vi|en)/, '') || '';
  const hrefEn = `/en${currentPath === '' ? '' : '/' + currentPath}`;
  const hrefVi = `/vi${currentPath === '' ? '' : '/' + currentPath}`;

  const hreflangTags = [
    { lang: 'x-default', href: hrefEn },
    { lang: 'en', href: hrefEn },
    { lang: 'vi', href: hrefVi }
  ];

  hreflangTags.forEach(item => {
    const link = document.createElement('link');
    link.rel = 'alternate';
    link.hreflang = item.lang;
    link.href = item.href;
    document.head.appendChild(link);
  });
}

languageOptions.forEach(option => {
  option.addEventListener('click', (event) => {
    event.preventDefault();
    const selectedLang = option.getAttribute('data-lang');
    if (selectedLang !== getCurrentLanguageFromURL()) {
      loadLanguage(selectedLang, true);
      languageDropdown.classList.remove('visible');
    }
  });
});

document.addEventListener('click', (event) => {
  if (!languageSwitcher.contains(event.target) && !languageDropdown.contains(event.target)) {
    languageDropdown.classList.remove('visible');
  }
});

languageSwitcher.addEventListener('click', (event) => {
  event.preventDefault();
  languageDropdown.classList.toggle('visible');
});

// Khởi tạo khi trang load
document.addEventListener('DOMContentLoaded', () => {
  const initialLang = getCurrentLanguageFromURL();
  loadLanguage(initialLang);
  SelectedNavItem(); // Gán lớp selected khi tải trang
});

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

/*********************
 * JS phần utilities *
 *********************/
document.addEventListener("DOMContentLoaded", () => {
  const menu = document.getElementById("ml-menu-fixed");
  const btn = document.querySelector(".btn-show-lk");
  const closeBtn = document.getElementById("close-lk");

  const toggleActive = () => {
    menu.classList.toggle("active");
    btn.classList.toggle("active");
  };

  // Gán sự kiện cho cả 2 nút
  [btn, closeBtn].forEach(el => {
    el?.addEventListener("click", toggleActive);
  });
});
/*********************
 * JS phần utilities *
 *********************/

/***** Slider banner trang home (Banner V2) *****/
(() => {
  const hero = document.querySelector('.uniwaveunique-hero-banner');
  if (!hero) return;

  const slides = Array.from(hero.querySelectorAll('.uniwaveunique-slide'));
  const prevBtn = hero.querySelector('.uniwaveunique-nav-btn--prev');
  const nextBtn = hero.querySelector('.uniwaveunique-nav-btn--next');
  const pagination = hero.querySelector('.uniwaveunique-pagination');

  if (!slides.length || !pagination) return;

  const AUTOPLAY_DELAY = 5000;
  const SWIPE_THRESHOLD = 50;
  const loadedSlides = new Set();
  const dots = [];

  let currentIndex = slides.findIndex((slide) => slide.classList.contains('is-active'));
  let autoplayTimer = null;
  let touchStartX = 0;
  let touchDeltaX = 0;
  let isHovering = false;

  if (currentIndex < 0) currentIndex = 0;

  const normalizedIndex = (index) => (index + slides.length) % slides.length;

  // Escape only characters that can break a CSS url("...") string.
  const escapeCssUrl = (url) => url.replace(/["\\]/g, '\\$&');

  function setAccessibilityState() {
    slides.forEach((slide, index) => {
      slide.setAttribute('aria-hidden', index === currentIndex ? 'false' : 'true');
    });
  }

  function loadSlideBackground(index) {
    const safeIndex = normalizedIndex(index);
    const slide = slides[safeIndex];
    const media = slide.querySelector('.uniwaveunique-slide-media');
    const source = slide.dataset.bg;

    if (!media || loadedSlides.has(safeIndex)) return Promise.resolve();

    if (media.style.backgroundImage) {
      loadedSlides.add(safeIndex);
      return Promise.resolve();
    }

    if (!source) {
      loadedSlides.add(safeIndex);
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      const image = new Image();
      image.decoding = 'async';
      image.src = source;
      image.onload = image.onerror = () => {
        media.style.backgroundImage = `url("${escapeCssUrl(source)}")`;
        loadedSlides.add(safeIndex);
        resolve();
      };
    });
  }

  function preloadAdjacentSlides(index) {
    loadSlideBackground(index + 1);
    loadSlideBackground(index - 1);
  }

  function updateDots() {
    dots.forEach((dot, dotIndex) => {
      const isActive = dotIndex === currentIndex;
      dot.classList.toggle('is-active', isActive);
      dot.setAttribute('aria-selected', String(isActive));
      dot.tabIndex = isActive ? 0 : -1;
    });
  }

  async function goToSlide(index) {
    const nextIndex = normalizedIndex(index);
    if (nextIndex === currentIndex) return;

    await loadSlideBackground(nextIndex);

    const currentSlide = slides[currentIndex];
    const nextSlide = slides[nextIndex];

    currentSlide.classList.remove('is-active');
    currentSlide.classList.add('is-exiting');

    nextSlide.classList.remove('is-exiting');
    nextSlide.classList.add('is-active');

    currentIndex = nextIndex;
    setAccessibilityState();
    updateDots();
    preloadAdjacentSlides(currentIndex);
  }

  function nextSlide() {
    goToSlide(currentIndex + 1);
  }

  function prevSlide() {
    goToSlide(currentIndex - 1);
  }

  function stopAutoplay() {
    if (autoplayTimer !== null) {
      window.clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  }

  function startAutoplay() {
    stopAutoplay();
    if (slides.length < 2 || isHovering) return;
    autoplayTimer = window.setInterval(nextSlide, AUTOPLAY_DELAY);
  }

  // Build dots once to keep runtime DOM updates minimal.
  pagination.textContent = '';
  slides.forEach((slide, index) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'uniwaveunique-dot';
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
    dot.addEventListener('click', () => {
      goToSlide(index);
      startAutoplay();
    });
    pagination.appendChild(dot);
    dots.push(dot);

    slide.addEventListener('transitionend', (event) => {
      if (event.propertyName !== 'opacity') return;
      if (!slide.classList.contains('is-active')) {
        slide.classList.remove('is-exiting');
      }
    });
  });

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prevSlide();
      startAutoplay();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      nextSlide();
      startAutoplay();
    });
  }

  hero.addEventListener('mouseenter', () => {
    isHovering = true;
    stopAutoplay();
  });

  hero.addEventListener('mouseleave', () => {
    isHovering = false;
    startAutoplay();
  });

  hero.addEventListener('focusin', stopAutoplay);
  hero.addEventListener('focusout', (event) => {
    if (hero.contains(event.relatedTarget)) return;
    startAutoplay();
  });

  hero.addEventListener('touchstart', (event) => {
    if (event.touches.length !== 1) return;
    touchStartX = event.touches[0].clientX;
    touchDeltaX = 0;
  }, { passive: true });

  hero.addEventListener('touchmove', (event) => {
    if (event.touches.length !== 1) return;
    touchDeltaX = event.touches[0].clientX - touchStartX;
  }, { passive: true });

  hero.addEventListener('touchend', () => {
    if (Math.abs(touchDeltaX) < SWIPE_THRESHOLD) return;
    if (touchDeltaX < 0) {
      nextSlide();
    } else {
      prevSlide();
    }
    startAutoplay();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;

    const activeElement = document.activeElement;
    if (
      activeElement &&
      (
        activeElement.tagName === 'INPUT' ||
        activeElement.tagName === 'TEXTAREA' ||
        activeElement.tagName === 'SELECT' ||
        activeElement.isContentEditable
      )
    ) {
      return;
    }

    const heroRect = hero.getBoundingClientRect();
    const heroInView = heroRect.bottom > 0 && heroRect.top < window.innerHeight;
    if (!heroInView) return;

    if (event.key === 'ArrowRight') {
      nextSlide();
    } else {
      prevSlide();
    }
    startAutoplay();
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopAutoplay();
      return;
    }
    startAutoplay();
  });

  slides.forEach((slide, index) => {
    slide.classList.toggle('is-active', index === currentIndex);
    slide.classList.remove('is-exiting');
  });
  setAccessibilityState();

  loadSlideBackground(currentIndex).then(() => {
    updateDots();
    preloadAdjacentSlides(currentIndex);
    startAutoplay();
  });

  if ('IntersectionObserver' in window) {
    const lazyObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        preloadAdjacentSlides(currentIndex);

        for (let index = 0; index < slides.length; index += 1) {
          const skipNext = normalizedIndex(currentIndex + 1);
          if (index === currentIndex || index === skipNext) continue;
          loadSlideBackground(index);
        }

        observer.disconnect();
      });
    }, { rootMargin: '200px 0px' });

    lazyObserver.observe(hero);
  } else {
    preloadAdjacentSlides(currentIndex);
    for (let index = 0; index < slides.length; index += 1) {
      if (index === currentIndex) continue;
      loadSlideBackground(index);
    }
  }
})();
/***** Slider banner trang home (Banner V2) *****/

// ===============================================
// WAKE BACKEND RENDER FREE (không loading screen)
// ===============================================
const BACKEND_URL = "https://uniwave-logistics-server-1.onrender.com/";

async function wakeBackend() {
    try {
        const res = await fetch(`${BACKEND_URL}/ping`, {
            method: "GET",
            cache: "no-store",
            headers: { "Accept": "application/json" }
        });

        if (res.ok) {
            const data = await res.json();
            console.log("✅ Backend đã awake:", data);
        }
    } catch (err) {
        // Render đang sleep → thử lại sau 10 giây (tối đa 2-3 lần là tỉnh)
        console.log("Backend đang khởi động, thử lại sau 10 giây...");
        setTimeout(wakeBackend, 10000);
    }
}

// Gọi ngay khi trang load (chạy trên mọi trang)
document.addEventListener('DOMContentLoaded', wakeBackend);
// Hoặc dùng window.addEventListener('load', wakeBackend); nếu muốn chắc chắn hơn