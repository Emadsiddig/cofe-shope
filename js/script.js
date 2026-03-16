// Omda Cafe - script.js | Dynamic Features

// DOM Elements
const nav = document.querySelector('.navbar');
const navLinks = document.querySelectorAll('.nav-links a');
const filterBtns = document.querySelectorAll('.filter-btn');
const menuItems = document.querySelectorAll('.menu-item');
const slides = document.querySelectorAll('.slide');
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');
const dotsContainer = document.querySelector('.dots');
const form = document.querySelector('.contact-form');
const submitBtn = document.querySelector('.submit-btn');

// State
let currentSlide = 0;
const totalSlides = slides.length;
let menuFilter = 'all';

// Smooth Scrolling & Navbar Active
navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = link.getAttribute('href').substring(1);
    const targetSection = document.getElementById(targetId);
    targetSection.scrollIntoView({ behavior: 'smooth' });
  });
});

window.addEventListener('scroll', () => {
  // Navbar background on scroll
if (window.scrollY > 100) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }

  // Active nav link
  const sections = document.querySelectorAll('section');
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (scrollY >= (sectionTop - 200)) {
      current = section.getAttribute('id');
    }
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });

  // Fade-in animations
  document.querySelectorAll('.fade-in').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      el.classList.add('visible');
    }
  });
});

// Menu Filter
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    menuFilter = btn.dataset.filter;

    menuItems.forEach(item => {
      const category = item.dataset.category;
      if (menuFilter === 'all' || category === menuFilter) {
        item.style.display = 'block';
        setTimeout(() => item.classList.add('visible'), 10);
      } else {
        item.classList.remove('visible');
        setTimeout(() => item.style.display = 'none', 300);
      }
    });
  });
});

// Gallery Slider
if (slides.length > 0) {
  // Dots
  dotsContainer.innerHTML = '';
  slides.forEach((_, index) => {
    const dot = document.createElement('span');
    dot.classList.add('dot');
    if (index === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(index));
    dotsContainer.appendChild(dot);
  });

  const dots = document.querySelectorAll('.dot');

  function updateSlider() {
    document.querySelector('.slider').style.transform = `translateX(-${currentSlide * 100}%)`;
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentSlide);
    });
  }

  function goToSlide(slide) {
    currentSlide = slide;
    updateSlider();
  }

  prevBtn.addEventListener('click', () => {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    updateSlider();
  });

  nextBtn.addEventListener('click', () => {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateSlider();
  });

  // Auto slide
  setInterval(() => {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateSlider();
  }, 5000);
}

// Contact Form
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const name = formData.get('name');
    const email = formData.get('email');
    if (name && email && formData.get('message')) {
      alert(`Thank you, ${name}! Your reservation request has been sent. We'll contact you at ${email}.`);
      form.reset();
    } else {
      alert('Please fill all fields.');
    }
  });
}

// Intersection Observer for menu items (fallback)
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
});

menuItems.forEach(item => observer.observe(item));

// Init
document.addEventListener('DOMContentLoaded', () => {
  // Set first filter active
  document.querySelector('.filter-btn[data-filter="all"]').classList.add('active');
});
