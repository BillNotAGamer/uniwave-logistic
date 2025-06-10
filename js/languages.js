// js/language.js
// Đối tượng lưu trữ bản dịch
let translations = {};

// Hàm tải tệp ngôn ngữ
async function loadLanguage(lang) {
  try {
    const response = await fetch(`languages/${lang}.json`);
    if (!response.ok) throw new Error('Không tìm thấy tệp ngôn ngữ');
    translations[lang] = await response.json();
    updateContent(lang);
  } catch (error) {
    console.error('Lỗi khi tải ngôn ngữ:', error);
    if (lang !== 'vi') loadLanguage('vi'); // Fallback về tiếng Việt
  }
}

// Hàm cập nhật nội dung trên trang
function updateContent(lang) {
  const main = document.querySelector('main');
  main.classList.add('language-loading');
  setTimeout(() => {
    // Cập nhật văn bản cho các phần tử có data-key
    document.querySelectorAll('[data-key]').forEach(element => {
      const key = element.getAttribute('data-key');
      if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
        element.placeholder = translations[lang][key] || key;
      } else if (element.tagName === 'BUTTON' || element.tagName === 'A') {
        element.textContent = translations[lang][key] || key;
      } else {
        element.innerHTML = translations[lang][key] || key;
      }
    });

    // Cập nhật tiêu đề trang
    document.title = translations[lang]['title'] || 'UNIWAVE LOGISTICS';

    // Cập nhật thuộc tính lang của HTML
    document.documentElement.lang = lang;

    // Cập nhật cờ và văn bản trong language-switcher
    const currentFlag = document.getElementById('current-flag');
    currentFlag.src = `./image/icon/${lang}.png`;
    document.querySelector('.language-title').innerHTML = translations[lang][`language_${lang === 'vi' ? 'vietnam' : 'english'}`] || lang;

    // Cập nhật lớp visible trong dropdown
    document.querySelectorAll('.language-dropdown li').forEach(li => {
      li.classList.toggle('visible', li.getAttribute('data-lang') === lang);
    });

    // Cập nhật thẻ hreflang cho SEO
    updateHreflang(lang);

    main.classList.remove('language-loading');
  }, 300);
}

// Hàm cập nhật thẻ hreflang
function updateHreflang(lang) {
  const head = document.head;
  const existingLinks = head.querySelectorAll('link[hreflang]');
  existingLinks.forEach(link => link.remove());

  const languages = ['vi', 'en'];
  languages.forEach(l => {
    const link = document.createElement('link');
    link.rel = 'alternate';
    link.hreflang = l;
    link.href = l === 'vi' ? window.location.origin : `${window.location.origin}/en`;
    head.appendChild(link);
  });
}

// Xử lý sự kiện click trên language-dropdown
document.addEventListener('DOMContentLoaded', () => {
  const languageItems = document.querySelectorAll('.language-dropdown li');
  languageItems.forEach(item => {
    item.addEventListener('click', (event) => {
      event.preventDefault();
      const selectedLang = item.getAttribute('data-lang');
      loadLanguage(selectedLang);
      localStorage.setItem('language', selectedLang);
      // Cập nhật URL
      const newUrl = selectedLang === 'vi' ? window.location.pathname : '/en';
      window.history.pushState({}, '', newUrl);
    });
  });

  // Khởi tạo ngôn ngữ
  const urlParams = new URLSearchParams(window.location.search);
  const urlLang = urlParams.get('lang') || localStorage.getItem('language') || (navigator.language.split('-')[0] === 'en' ? 'en' : 'vi');
  loadLanguage(urlLang);
});