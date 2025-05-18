// Script trang home
document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('.why-univave, .services, .partners, .cta');
    
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

