// Omda Cafe - Optimized Script | Perf Improvements: Throttled RAF Scroll, Observers, Cached DOM

// Cached DOM Elements (perf)
const elements = {
  nav: document.querySelector('.navbar'),
  hamburger: document.querySelector('.hamburger'),
  navLinks: document.querySelector('.nav-links'),
  mobileOverlay: document.querySelector('.mobile-overlay'),
  navLinkItems: document.querySelectorAll('.nav-links a'),
  filterBtns: document.querySelectorAll('.filter-btn'),
  menuItems: document.querySelectorAll('.menu-item'),
  slides: document.querySelectorAll('.slide'),
  prevBtn: document.querySelector('.prev'),
  nextBtn: document.querySelector('.next'),
  dotsContainer: document.querySelector('.dots'),
  form: document.querySelector('.contact-form'),
  fadeIns: document.querySelectorAll('.fade-in'),
  sections: document.querySelectorAll('section')
};

const state = {
  currentSlide: 0,
  totalSlides: elements.slides.length,
  menuFilter: 'all',
  ticking: false
};

// Utils
function throttle(fn, wait = 16) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.apply(this, args), wait);
  };
}

function raf(fn) {
  let ticking = false;
  return function() {
    if (!ticking) {
      requestAnimationFrame(() => {
        fn.apply(this, arguments);
        ticking = false;
      });
      ticking = true;
    }
  };
}

// IntersectionObserver for fade-ins & sections (replaces scroll loops)
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -100px 0px'
};

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Fade-in
      entry.target.classList.add('visible');
      
      // Nav active
      const id = entry.target.id;
      elements.navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    }
  });
}, observerOptions);

elements.sections.forEach(section => sectionObserver.observe(section));

// Navbar scroll bg (simple)
let rafHandle;
window.addEventListener('scroll', raf(() => {
  if (window.scrollY > 100) {
    elements.nav.classList.add('scrolled');
  } else {
    elements.nav.classList.remove('scrolled');
  }
}), { passive: true });

// Smooth scrolling
elements.navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = link.getAttribute('href').substring(1);
    document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
  });
});

// Menu Filter (optimized)
elements.filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    elements.filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    state.menuFilter = btn.dataset.filter;

    elements.menuItems.forEach(item => {
      const show = state.menuFilter === 'all' || item.dataset.category === state.menuFilter;
      item.style.display = show ? 'block' : 'none';
      if (show) {
        item.classList.add('visible');
      } else {
        item.classList.remove('visible');
      }
    });
  });
});

// Gallery Slider (optimized: pause on hover)
if (elements.slides.length > 0) {
  // Dots
  elements.dotsContainer.innerHTML = '';
  elements.slides.forEach((_, index) => {
    const dot = document.createElement('span');
    dot.classList.add('dot');
    if (index === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(index));
    elements.dotsContainer.appendChild(dot);
  });

  const dots = document.querySelectorAll('.dot');

  function updateSlider() {
    document.querySelector('.slider').style.transform = `translateX(-${state.currentSlide * 100}%)`;
    dots.forEach((dot, index) => dot.classList.toggle('active', index === state.currentSlide));
  }

  function goToSlide(slide) {
    state.currentSlide = slide;
    updateSlider();
  }

  elements.prevBtn.addEventListener('click', () => {
    state.currentSlide = (state.currentSlide - 1 + state.totalSlides) % state.totalSlides;
    updateSlider();
  });

  elements.nextBtn.addEventListener('click', () => {
    state.currentSlide = (state.currentSlide + 1) % state.totalSlides;
    updateSlider();
  });

  // Auto-slide with pause
  let autoInterval;
  function startAuto() {
    autoInterval = setInterval(() => {
      state.currentSlide = (state.currentSlide + 1) % state.totalSlides;
      updateSlider();
    }, 5000);
  }
  startAuto();

  // Pause on hover
  const sliderContainer = document.querySelector('.slider-container');
  sliderContainer.addEventListener('mouseenter', () => clearInterval(autoInterval));
  sliderContainer.addEventListener('mouseleave', startAuto);
}

// Form
if (elements.form) {
  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(elements.form);
    const name = formData.get('name');
    const email = formData.get('email');
    if (name && email && formData.get('message')) {
      alert(`Thank you, ${name}! Your reservation request has been sent. We'll contact you at ${email}.`);
      elements.form.reset();
    } else {
      alert('Please fill all fields.');
    }
  });
}

// Init observers for menu (already observed)
elements.menuItems.forEach(item => {
  if (!item.hasAttribute('data-observed')) {
    const menuObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    });
    menuObserver.observe(item);
    item.setAttribute('data-observed', true);
  }
});

// DOMContentLoaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

function init() {
  document.querySelector('.filter-btn[data-filter="all"]').classList.add('active');
  updateSlider(); // Init slider
}

