document.addEventListener('DOMContentLoaded', () => {
    const carousel = document.querySelector('.carousel');
    const cards = document.querySelectorAll('.card');
    const dotsContainer = document.querySelector('.carousel-dots');
    let currentIndex = 0;
    let startX, isDragging = false;
    let visibleCards = window.innerWidth <= 768 ? 1 : 2;
    let cardWidth;
    let totalSlides;
    let autoPlayInterval;

    function updateCarouselDimensions() {
        visibleCards = window.innerWidth <= 768 ? 1 : 2;
        cardWidth = cards[0].offsetWidth + parseInt(getComputedStyle(carousel).gap);
        totalSlides = Math.ceil(cards.length / visibleCards);
        updateDots();
        goToSlide(Math.min(currentIndex, totalSlides - 1), false);
    }

    function createDots() {
        dotsContainer.innerHTML = '';
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => {
                goToSlide(i);
                resetAutoPlay();
            });
            dotsContainer.appendChild(dot);
        }
    }

    function updateDots() {
        const dots = document.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }

    function goToSlide(index, smooth = true) {
        currentIndex = index;
        const offset = -currentIndex * cardWidth * visibleCards;
        carousel.style.transition = smooth ? 'transform 0.5s ease-in-out' : 'none';
        carousel.style.transform = `translateX(${offset}px)`;
        updateDots();
    }

    function nextSlide() {
        if (currentIndex >= totalSlides - 1) {
            currentIndex = 0;
            goToSlide(currentIndex);
        } else {
            goToSlide(currentIndex + 1);
        }
    }

    function prevSlide() {
        if (currentIndex <= 0) {
            currentIndex = totalSlides - 1;
            goToSlide(currentIndex);
        } else {
            goToSlide(currentIndex - 1);
        }
    }

    function startAutoPlay() {
        autoPlayInterval = setInterval(nextSlide, 5000);
    }

    function resetAutoPlay() {
        clearInterval(autoPlayInterval);
        startAutoPlay();
    }

    // Touch events
    carousel.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
        carousel.style.transition = 'none';
        clearInterval(autoPlayInterval);
    });

    carousel.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const x = e.touches[0].clientX;
        const walk = x - startX;
        const offset = -currentIndex * cardWidth * visibleCards + walk;
        carousel.style.transform = `translateX(${offset}px)`;
    });

    carousel.addEventListener('touchend', (e) => {
        isDragging = false;
        const walk = e.changedTouches[0].clientX - startX;
        if (Math.abs(walk) > cardWidth / 3) {
            if (walk > 0) {
                prevSlide();
            } else {
                nextSlide();
            }
        } else {
            goToSlide(currentIndex);
        }
        startAutoPlay();
    });

    // Mouse events
    carousel.addEventListener('mousedown', (e) => {
        startX = e.clientX;
        isDragging = true;
        carousel.style.transition = 'none';
        carousel.style.cursor = 'grabbing';
        clearInterval(autoPlayInterval);
    });

    carousel.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const x = e.clientX;
        const walk = x - startX;
        const offset = -currentIndex * cardWidth * visibleCards + walk;
        carousel.style.transform = `translateX(${offset}px)`;
    });

    carousel.addEventListener('mouseup', () => {
        handleDragEnd();
    });

    carousel.addEventListener('mouseleave', () => {
        if (isDragging) {
            handleDragEnd();
        }
    });

    function handleDragEnd() {
        isDragging = false;
        carousel.style.cursor = 'grab';
        goToSlide(currentIndex, true);
        startAutoPlay();
    }

    // Initialize carousel
    updateCarouselDimensions();
    createDots();
    startAutoPlay();

    // Handle window resize
    window.addEventListener('resize', () => {
        updateCarouselDimensions();
        createDots();
    });

    // Add keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevSlide();
            resetAutoPlay();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
            resetAutoPlay();
        }
    });

    // Clone first set of cards and append to end for smooth infinite rotation
    const updateClones = () => {
        // Remove existing clones
        const clones = carousel.querySelectorAll('.clone');
        clones.forEach(clone => clone.remove());

        // Add new clones
        const firstCards = Array.from(cards).slice(0, visibleCards);
        firstCards.forEach(card => {
            const clone = card.cloneNode(true);
            clone.classList.add('clone');
            carousel.appendChild(clone);
        });
    };
    
    updateClones();
});
