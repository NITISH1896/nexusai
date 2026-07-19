document.addEventListener('DOMContentLoaded', () => {
  // 1. Custom Loading Animation
  const loader = document.getElementById('loader-overlay');
  
  const fadeOutLoader = () => {
    if (loader) {
      loader.classList.add('fade-out');
      setTimeout(() => {
        loader.remove();
      }, 500);
    }
  };

  // Fade out loader when window is fully loaded
  window.addEventListener('load', fadeOutLoader);
  // Fallback in case load event takes too long
  setTimeout(fadeOutLoader, 2500);

  // 2. Sticky Navigation Header
  const header = document.querySelector('header');
  const checkScroll = () => {
    if (!header) return;
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  // 3. Light/Dark Mode Infrastructure
  const themeToggleBtn = document.getElementById('theme-toggle');
  
  const updateThemeIcons = () => {
    const isLight = document.documentElement.classList.contains('light');
    const sunIcon = document.getElementById('theme-icon-sun');
    const moonIcon = document.getElementById('theme-icon-moon');
    
    if (sunIcon && moonIcon) {
      if (isLight) {
        sunIcon.classList.add('hidden');
        moonIcon.classList.remove('hidden');
      } else {
        sunIcon.classList.remove('hidden');
        moonIcon.classList.add('hidden');
      }
    }
  };

  const setTheme = (theme) => {
    if (theme === 'light') {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      localStorage.setItem('theme', 'dark');
    }
    updateThemeIcons();
    checkScroll(); // Update header style immediately
  };

  // Initialize Theme
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  
  if (savedTheme) {
    setTheme(savedTheme);
  } else if (systemPrefersLight) {
    setTheme('light');
  } else {
    setTheme('dark'); // Dark mode default
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.classList.contains('light') ? 'dark' : 'light';
      setTheme(currentTheme);
    });
  }

  window.addEventListener('scroll', checkScroll);
  checkScroll(); // Trigger initial check

  // 4. Mobile Menu Toggles
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileNav = document.getElementById('mobile-nav');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  const toggleMobileMenu = () => {
    const isOpen = mobileNav.classList.contains('translate-x-0');
    if (isOpen) {
      mobileNav.classList.remove('translate-x-0');
      mobileNav.classList.add('translate-x-full');
      menuBtn.classList.remove('menu-open');
      document.body.classList.remove('overflow-hidden');
    } else {
      mobileNav.classList.remove('translate-x-full');
      mobileNav.classList.add('translate-x-0');
      menuBtn.classList.add('menu-open');
      document.body.classList.add('overflow-hidden');
    }
  };

  if (menuBtn && mobileNav) {
    menuBtn.addEventListener('click', toggleMobileMenu);
  }

  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (mobileNav.classList.contains('translate-x-0')) {
        toggleMobileMenu();
      }
    });
  });

  // 5. Active Section Navigation Observer
  const sections = document.querySelectorAll('section[id], header[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const navObserverOptions = {
    root: null,
    rootMargin: '-30% 0px -60% 0px', // Target middle of the screen
    threshold: 0
  };

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, navObserverOptions);

  sections.forEach(section => {
    navObserver.observe(section);
  });

  // 6. Sticky Back-to-Top Button
  const backToTopBtn = document.getElementById('back-to-top');

  const toggleBackToTop = () => {
    if (window.scrollY > 500) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  };

  window.addEventListener('scroll', toggleBackToTop);
  
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // 7. Progressive Asset Lazy Loading
  const lazyImages = document.querySelectorAll('[data-src]');
  
  const lazyLoadObserverOptions = {
    root: null,
    rootMargin: '50px 0px',
    threshold: 0.01
  };

  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        const src = img.getAttribute('data-src');
        if (src) {
          img.setAttribute('src', src);
          img.removeAttribute('data-src');
          // Add smooth load transition
          img.style.opacity = 0;
          img.addEventListener('load', () => {
            img.style.transition = 'opacity 0.4s ease';
            img.style.opacity = 1;
          });
        }
        observer.unobserve(img);
      }
    });
  }, lazyLoadObserverOptions);

  lazyImages.forEach(img => {
    imageObserver.observe(img);
  });
});
