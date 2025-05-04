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