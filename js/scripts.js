document.addEventListener('DOMContentLoaded', () => {
    // Kích hoạt animation khi scroll (nếu cần)
    const sections = document.querySelectorAll('.banner, .why-univave, .quote-form, .services, .partners, .cta');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
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
        }, 5000);
    }

    // Hàm toggle popup-form
    window.togglePopup = function() {
        popupForm.style.display = popupForm.style.display === 'block' ? 'none' : 'block';
        chatBox.style.display = 'none'; // Ẩn chat-box khi toggle popup-form
    }

    // Hiển thị chat-box khi click vào icon
    iconNeedHelp.querySelector('a').addEventListener('click', function(e) {
        e.preventDefault();
        chatBox.style.display = 'block';
        popupForm.style.display = 'none'; // Đảm bảo popup-form ẩn khi click icon
    });

    // Hiển thị popup-form khi click vào chat-box
    chatBox.addEventListener('click', function() {
        chatBox.style.display = 'none';
        popupForm.style.display = 'block';
    });

    // Gọi hàm hiển thị chat-box khi load trang
    showChatBoxTemporarily();
});

//script cho phần logo slider trang home
document.addEventListener('DOMContentLoaded', function() {
    const slider = document.querySelector('.slider');
    const slides = document.querySelectorAll('.slider img');
    const totalSlides = slides.length;
    let currentSlide = 0;
    const slidesPerView = 4; // Số logo hiển thị mỗi lần
    let autoSlideInterval;

    // Nhân bản danh sách logo 3 lần để đảm bảo lặp vô tận mượt mà
    slider.innerHTML += slider.innerHTML + slider.innerHTML;

    // Cập nhật danh sách slides sau khi nhân bản
    const allSlides = document.querySelectorAll('.slider img');
    const slideWidth = slides[0].offsetWidth + 40; // Chiều rộng logo + margin
    const maxSlides = totalSlides; // Số slide gốc
    const totalWidth = slideWidth * totalSlides * 3; // Tổng chiều rộng slider (sau khi nhân bản 3 lần)

    function getSlidesPerView() {
        if (window.innerWidth < 576) return 1; // Mobile: 1 logo
        if (window.innerWidth >= 576 && window.innerWidth < 992) return 3; // Tablet: 3 logo
        return 4; // Desktop: 4 logo
    }

    function updateSlider() {
        const slidesPerView = getSlidesPerView();
        const slideWidth = slides[0].offsetWidth + (window.innerWidth < 576 ? 20 : window.innerWidth < 992 ? 30 : 40); // Margin thay đổi theo màn hình
        const maxSlides = totalSlides;

        // Cập nhật maxWidth của container
        document.querySelector('.slider-container').style.maxWidth = `${slideWidth * slidesPerView}px`;

        // Cập nhật vị trí slider
        slider.style.transform = `translateX(-${currentSlide * slideWidth * slidesPerView}px)`;
    }

    function moveSlide() {
        const slidesPerView = getSlidesPerView();
        const slideWidth = slides[0].offsetWidth + (window.innerWidth < 576 ? 20 : window.innerWidth < 992 ? 30 : 40);
        const maxSlides = totalSlides;

        currentSlide++;
        slider.style.transition = 'transform 0.5s ease-in-out';
        slider.style.transform = `translateX(-${currentSlide * slideWidth * slidesPerView}px)`;

        // Reset khi gần cuối danh sách nhân bản
        if (currentSlide >= maxSlides * 2) {
            currentSlide = currentSlide - maxSlides;
            slider.style.transition = 'none';
            slider.style.transform = `translateX(-${currentSlide * slideWidth * slidesPerView}px)`;
            setTimeout(() => {
                slider.style.transition = 'transform 0.5s ease-in-out';
            }, 50);
        }
    }

    function startAutoSlide() {
        autoSlideInterval = setInterval(moveSlide, 3000); // Dừng 3 giây mỗi slide
    }

    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
    }

    // Khởi động slider
    startAutoSlide();

    // Tạm dừng khi hover
    document.querySelector('.slider-container').addEventListener('mouseenter', stopAutoSlide);
    document.querySelector('.slider-container').addEventListener('mouseleave', startAutoSlide);

    // Điều chỉnh kích thước container để hiển thị đúng số logo
    document.querySelector('.slider-container').style.maxWidth = `${slideWidth * slidesPerView}px`;
    
    // Cập nhật slider khi thay đổi kích thước màn hình
    window.addEventListener('resize', () => {
        currentSlide = 0; // Reset về đầu để tránh lệch
        updateSlider();
        stopAutoSlide();
        startAutoSlide();
    });
});