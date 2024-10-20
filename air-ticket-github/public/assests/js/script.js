let currentIndex = 0;

function updateCarousel() {
    const slides = document.querySelectorAll('.carousel-slide');
    const totalSlides = slides.length;

    if (totalSlides === 0) return; 
    const slideWidth = slides[0].clientWidth;
    const offset = -currentIndex * slideWidth;
    document.querySelector('.carousel-images').style.transform = `translateX(${offset}px)`;
}

function nextImage() {
    const slides = document.querySelectorAll('.carousel-slide');
    const totalSlides = slides.length;

    if (totalSlides === 0) return;

    currentIndex = (currentIndex + 1) % totalSlides;
    updateCarousel();
}

function prevImage() {
    const slides = document.querySelectorAll('.carousel-slide');
    const totalSlides = slides.length;

    if (totalSlides === 0) return; 

    currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
    updateCarousel();
}
window.addEventListener('load', updateCarousel);


document.addEventListener('DOMContentLoaded', function() {
    const doctorItems = document.querySelectorAll('.doctor-item');
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1 
    };

    const observerCallback = function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    doctorItems.forEach(item => {
        observer.observe(item);
    });

let isLoggedIn = false; 

document.querySelector('.appointment-form').addEventListener('submit', function(e) {
    e.preventDefault();


    if (!isLoggedIn) {
        alert('Please log in first to book an appointment.');
        window.location.href = 'login';  
    } else {
        alert('Your appointment has been booked!');
    }
});
});