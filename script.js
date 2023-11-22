'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const containerOfTabs = document.querySelector('.operations__tab-container');
const tabs = document.querySelectorAll('.operations__tab');
const contentOfTabs = document.querySelectorAll('.operations__content');
const containerOfNav = document.querySelector('.nav');
const headerNavigation = document.querySelector('.header');
const navHeight = containerOfNav.getBoundingClientRect().height;
const obsSections = document.querySelectorAll('.section');
const allImgLazing = document.querySelectorAll('img[data-src]');

// Opens the window for creating a new user
const openModal = function (event) {
    event.preventDefault();
    modal.classList.remove('hidden');
    overlay.classList.remove('hidden');
};

// Closes the window of creating a new user
const closeModal = function () {
    modal.classList.add('hidden');
    overlay.classList.add('hidden');
};

btnsOpenModal.forEach((button) => button.addEventListener(('click'), openModal));
btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !modal.classList.contains('hidden'))
        closeModal();
});

btnScrollTo.addEventListener('click', function (event){
    section1.scrollIntoView({behavior: 'smooth'});
    /*// The old code before the update
    const s1_coords = section1.getBoundingClientRect();
    window.scrollTo({
        left: s1_coords.left + window.pageXOffset,
        top: s1_coords.top + window.pageYOffset,
        behavior: 'smooth'});*/
});

document.querySelector('.nav__links').addEventListener('click', function (event){
    event.preventDefault();
    if (event.target.classList.contains('nav__link')){
        const idEvent = event.target.getAttribute('href');
        if (idEvent !== '#') document.querySelector(idEvent).scrollIntoView({behavior: 'smooth'});
    }
});

containerOfTabs.addEventListener('click', function (event){
    const clickedTab = event.target.closest('.operations__tab');
    if (!clickedTab) return;

    tabs.forEach((tab) => tab.classList.remove('operations__tab--active'));
    clickedTab.classList.add('operations__tab--active');

    contentOfTabs.forEach((content) => content.classList
        .remove('operations__content--active'));
    document.querySelector(`.operations__content--${clickedTab.dataset.tab}`)
        .classList.add('operations__content--active');
});

const handleHover = function (event){
    if (event.target.classList.contains('nav__link')){
        const currentLink = event.target;
        const logo = currentLink.closest('.nav').querySelector('img');
        const siblingsLink = currentLink.closest('.nav')
            .querySelectorAll('.nav__link');

        siblingsLink.forEach((element) => {
            if (element !== currentLink) element.style.opacity = this;
        });
        logo.style.opacity = this;
    }
}
containerOfNav.addEventListener('mouseover', handleHover.bind(0.5));
containerOfNav.addEventListener('mouseout', handleHover.bind(1));

const obsStickyNav = function (entries){
    const [entry] = entries;
    if (!entry.isIntersecting) containerOfNav.classList.add('sticky');
    else containerOfNav.classList.remove('sticky');
}
const obsOptions = {root: null, threshold: 0, rootMargin: `-${navHeight}px`};
const headerObserver = new IntersectionObserver(obsStickyNav, obsOptions);
headerObserver.observe(headerNavigation);

const revealSection = function (entries, observer){
    const [entry] = entries;
    if (!entry.isIntersecting) return;
    entry.target.classList.remove('section--hidden');
    observer.unobserve(entry.target);
}

const sectionObserver = new IntersectionObserver(revealSection, {root: null, threshold: 0.1});
obsSections.forEach(function (section) {
    sectionObserver.observe(section);
    section.classList.add('section--hidden');
});

const loadImage = function (entries, observer){
    const [entry] = entries;
    if (!entry.isIntersecting) return;
    entry.target.src = entry.target.dataset.src;
    entry.target.addEventListener('load', function (){
        entry.target.classList.remove('lazy-img');
    });
    observer.unobserve(entry.target);
}
const loadImageObserver = new IntersectionObserver(loadImage, {root: null, threshold: 0,
rootMargin: '200px'});
allImgLazing.forEach((img) => loadImageObserver.observe(img));

const managementSlider = function (){
    const allSlides = document.querySelectorAll('.slide');
    const btnRight = document.querySelector('.slider__btn--right');
    const btnLeft = document.querySelector('.slider__btn--left');
    const dots = document.querySelector('.dots');
    const maxSlides = allSlides.length;
    let currentSlide = 0;

    const movementSlide = function (slide){
        allSlides.forEach((sElement, index) =>
            sElement.style.transform = `translateX(${(index - slide)* 100}%)`);
    }

    const createDots = function (){
        allSlides.forEach(function (_, index){
            dots.insertAdjacentHTML('beforeend',
                `<button class="dots__dot" data-slide=${index} </button>`);
        });
    }

    const activatedDot = function (currentSlide){
        document.querySelectorAll('.dots__dot').forEach((dot) =>
            dot.classList.remove('dots__dot--active'));
        document.querySelector(`.dots__dot[data-slide="${currentSlide}"]`).classList.add('dots__dot--active');
    }

    const nextSlide = function (){
        if (currentSlide === maxSlides - 1) currentSlide = 0;
        else currentSlide += 1;
        movementSlide(currentSlide);
        activatedDot(currentSlide);
    }

    const previousSlide = function (){
        if (currentSlide === 0) currentSlide = maxSlides - 1;
        else currentSlide -= 1;
        movementSlide(currentSlide);
        activatedDot(currentSlide);
    }

    const init = function (){
        movementSlide(0);
        createDots();
        activatedDot(0);
    }
    init();

    // Event Handler
    btnRight.addEventListener('click', nextSlide);
    btnLeft.addEventListener('click', previousSlide);

    document.addEventListener('keydown', function (event){
        if (event.key === 'ArrowRight') nextSlide();
        if (event.key === 'ArrowLeft') previousSlide();
    });

    dots.addEventListener('click', function (event){
        if (event.target.classList.contains('dots__dot')){
            const curSlide = event.target.dataset.slide;
            movementSlide(curSlide);
            activatedDot(curSlide);
        }
    });
}
managementSlider();