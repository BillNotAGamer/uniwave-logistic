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

const icon = document.getElementById('icon-need-help');
        const chatBox = document.getElementById('chat-box');
        const popupForm = document.getElementById('popup-form');
        const closeButton = document.getElementById('close-popup');

        function showPopup() {
            popupForm.style.display = 'block';
            chatBox.style.display = 'none';
        }

        function hidePopup() {
            popupForm.style.display = 'none';
            chatBox.style.display = 'block';
        }

        icon.addEventListener('click', showPopup);
        closeButton.addEventListener('click', hidePopup);
