// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Mobile navigation toggle (to be implemented)
function toggleMobileNav() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('active');
}

// Add mobile navigation button
const nav = document.querySelector('nav');
const mobileNavButton = document.createElement('button');
mobileNavButton.classList.add('mobile-nav-toggle');
mobileNavButton.innerHTML = '<i class="fas fa-bars"></i>';
mobileNavButton.addEventListener('click', toggleMobileNav);
nav.appendChild(mobileNavButton);

// Update copyright year automatically
document.querySelector('footer p').innerHTML = 
    `&copy; ${new Date().getFullYear()} Euhemeria. Todos los derechos reservados.`;

// Slideshow for Últimas Publicaciones
let slideIndex = 0;
const showSlides = () => {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    slides.forEach(slide => slide.style.display = 'none');
    dots.forEach(dot => dot.classList.remove('active'));
    slideIndex++;
    if (slideIndex > slides.length) { slideIndex = 1; }
    if (slides[slideIndex - 1]) {
        slides[slideIndex - 1].style.display = 'block';
        dots[slideIndex - 1].classList.add('active');
    }
    setTimeout(showSlides, 4000); // Change image every 4 seconds
};

document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelectorAll('.slide').length > 0) {
        showSlides();
    }
    // Dots click event
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, idx) => {
        dot.addEventListener('click', () => {
            slideIndex = idx;
            const slides = document.querySelectorAll('.slide');
            slides.forEach(slide => slide.style.display = 'none');
            dots.forEach(dot => dot.classList.remove('active'));
            slides[slideIndex].style.display = 'block';
            dots[slideIndex].classList.add('active');
        });
    });
}); 
