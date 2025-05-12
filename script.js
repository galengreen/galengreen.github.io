// Loading state management
function handleLoadingState() {
    const loader = document.querySelector('.loader');
    const body = document.body;
    
    // Add loading class to body
    body.classList.add('loading');
    
    // Wait for all resources to load
    window.addEventListener('load', () => {
        // Wait for the code animation to complete (1.2s for last line + 0.5s buffer)
        setTimeout(() => {
            loader.classList.add('fade-out');
            body.classList.remove('loading');
            body.classList.add('loaded');
            
            // Remove loader from DOM after animation
            setTimeout(() => {
                loader.remove();
            }, 500);
        }, 1700); // Total animation time
    });
}

// Initialize loading state
handleLoadingState();

// Animation utilities
const AnimationUtils = {
    // Check if user prefers reduced motion
    prefersReducedMotion: () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    
    // Safely add animation class with reduced motion check
    addAnimationClass: (element, className) => {
        if (!AnimationUtils.prefersReducedMotion()) {
            element.classList.add(className);
        }
    },
    
    // Safely remove animation class
    removeAnimationClass: (element, className) => {
        element.classList.remove(className);
    }
};

// Custom cursor
const cursor = document.querySelector('.cursor');

if (cursor) {
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = `${e.clientX - 10}px`;
        cursor.style.top = `${e.clientY - 10}px`;
    });

    // Add cursor effect to interactive elements
    document.querySelectorAll('a, button, .nav-button, .project-button, .interest-tag, .photo-item').forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('active'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('active'));
    });
}

// Function to load images from the images directory
async function loadImages() {
    try {
        const response = await fetch('images/');
        const text = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');
        
        const imageFiles = Array.from(doc.querySelectorAll('a'))
            .map(a => a.getAttribute('href'))
            .filter(href => {
                const ext = href.split('.').pop().toLowerCase();
                return ['jpg', 'jpeg', 'png'].includes(ext) && !href.includes('profile/');
            })
            .map(href => '/images/' + href.replace(/^.*[\\/]/, ''));

        imageFiles.sort();

        const photoGrid = document.querySelector('.photo-grid');
        if (!photoGrid) return;

        photoGrid.innerHTML = '';

        const column1 = document.createElement('div');
        const column2 = document.createElement('div');
        column1.className = 'photo-column';
        column2.className = 'photo-column';
        photoGrid.appendChild(column1);
        photoGrid.appendChild(column2);

        imageFiles.forEach((imagePath, index) => {
            const photoItem = document.createElement('div');
            photoItem.className = 'photo-item';
            
            const img = document.createElement('img');
            img.src = imagePath;
            img.alt = 'Photography by Galen Green';
            img.loading = 'lazy'; // Add lazy loading
            
            photoItem.addEventListener('click', () => openLightbox(imagePath));
            photoItem.appendChild(img);
            
            if (index % 2 === 0) {
                column1.appendChild(photoItem);
            } else {
                column2.appendChild(photoItem);
            }
        });

    } catch (error) {
        console.error('Error loading images:', error);
    }
}

// Lightbox functionality
function openLightbox(imagePath) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    
    if (!lightbox || !lightboxImg) return;
    
    lightboxImg.src = imagePath;
    lightbox.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;
    
    lightbox.style.display = 'none';
    document.body.style.overflow = '';
}

function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const closeBtn = document.querySelector('.lightbox-close');
    
    if (!lightbox || !closeBtn) return;
    
    closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeLightbox();
    });
    
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeLightbox();
        }
    });
}

// Scroll animations
function handleScrollAnimations() {
    const main = document.getElementById('main');
    if (!main) return;

    const sections = document.querySelectorAll('.content');
    const timelineItems = document.querySelectorAll('.timeline-item');
    const educationItems = document.querySelectorAll('.education-item');
    const skillProgresses = document.querySelectorAll('.skill-progress');

    const observerOptions = {
        root: main,
        rootMargin: '0px',
        threshold: 0.15
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                AnimationUtils.addAnimationClass(entry.target, 'visible');
            } else {
                AnimationUtils.removeAnimationClass(entry.target, 'visible');
            }
        });
    }, observerOptions);

    const itemObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                AnimationUtils.addAnimationClass(entry.target, 'visible');
                if (entry.target.classList.contains('skill-progress')) {
                    const width = entry.target.getAttribute('style')?.match(/width: (\d+)%/)?.[1];
                    if (width) {
                        entry.target.style.setProperty('--progress-width', `${width}%`);
                    }
                }
            } else {
                AnimationUtils.removeAnimationClass(entry.target, 'visible');
            }
        });
    }, observerOptions);

    sections.forEach(section => sectionObserver.observe(section));
    timelineItems.forEach(item => itemObserver.observe(item));
    educationItems.forEach(item => itemObserver.observe(item));
    skillProgresses.forEach(progress => itemObserver.observe(progress));
}

// Smooth scrolling
function initSmoothScroll() {
    const main = document.getElementById('main');
    if (!main) return;

    const navLinks = document.querySelectorAll('.nav-link, .landing-nav-link, .mobile-nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetId = link.getAttribute('href')?.substring(1);
            if (!targetId) return;
            
            const targetSection = document.getElementById(targetId);
            if (!targetSection) return;
            
            if (!AnimationUtils.prefersReducedMotion()) {
                main.style.scrollSnapType = 'none';
                
                main.scrollTo({
                    top: targetSection.offsetTop,
                    behavior: 'smooth'
                });
                
                setTimeout(() => {
                    main.style.scrollSnapType = 'y proximity';
                }, 1000);
            } else {
                // For users who prefer reduced motion, use instant scroll
                main.scrollTo({
                    top: targetSection.offsetTop,
                    behavior: 'auto'
                });
            }
            
            const mobileMenu = document.querySelector('.mobile-menu');
            const burger = document.querySelector('.burger-menu');
            if (mobileMenu?.classList.contains('active')) {
                mobileMenu.classList.remove('active');
                burger?.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });
    });
}

// Sticky navigation
function handleStickyNav() {
    const nav = document.getElementById('sticky-nav');
    const main = document.getElementById('main');
    const landingSection = document.querySelector('.landing');
    
    if (!nav || !main || !landingSection) return;
    
    const landingMiddle = landingSection.offsetHeight / 2;
    nav.classList.toggle('visible', main.scrollTop > landingMiddle);
}

// Mobile menu
function initMobileMenu() {
    const burger = document.querySelector('.burger-menu');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (!burger || !mobileMenu) return;
    
    burger.addEventListener('click', () => {
        burger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.classList.toggle('menu-open', mobileMenu.classList.contains('active'));
    });
}

// Landing animations
function initLandingAnimations() {
    const main = document.getElementById('main');
    const landingSection = document.querySelector('.landing');
    const landingLinks = document.querySelectorAll('.landing-nav-link');
    
    if (!main || !landingSection || !landingLinks.length) return;
    
    let animationFrame;
    const landingObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                landingLinks.forEach((link, i) => {
                    animationFrame = requestAnimationFrame(() => {
                        setTimeout(() => {
                            AnimationUtils.addAnimationClass(link, 'animated');
                        }, 700 + i * 200);
                    });
                });
            } else {
                landingLinks.forEach((link) => {
                    AnimationUtils.removeAnimationClass(link, 'animated');
                });
                if (animationFrame) {
                    cancelAnimationFrame(animationFrame);
                }
            }
        });
    }, { 
        root: main,
        threshold: 0.1
    });
    
    landingObserver.observe(landingSection);
}

// Carousel functionality
document.addEventListener('DOMContentLoaded', function() {
  const track = document.querySelector('.carousel-track');
  const items = document.querySelectorAll('.project-item');
  const prevButton = document.querySelector('.carousel-prev');
  const nextButton = document.querySelector('.carousel-next');
  
  let currentIndex = 0;
  const itemWidth = items[0].offsetWidth;
  const gap = 32; // 2rem gap between items
  
  // Clone first and last items for infinite loop
  const firstClone = items[0].cloneNode(true);
  const lastClone = items[items.length - 1].cloneNode(true);
  
  track.appendChild(firstClone);
  track.insertBefore(lastClone, items[0]);
  
  // Set initial position and active state
  track.style.transform = `translateX(-${itemWidth + gap}px)`;
  updateActiveState();
  
  function updateCarousel() {
    track.style.transition = 'transform 0.6s ease';
    track.style.transform = `translateX(-${(currentIndex + 1) * (itemWidth + gap)}px)`;
    updateActiveState();
  }
  
  function updateActiveState() {
    // Remove active class from all items
    items.forEach(item => item.classList.remove('active'));
    
    // Add active class to current item and adjacent items
    const realItems = Array.from(items);
    const currentItem = realItems[currentIndex];
    const prevItem = realItems[currentIndex - 1] || realItems[realItems.length - 1];
    const nextItem = realItems[currentIndex + 1] || realItems[0];
    
    if (currentItem) currentItem.classList.add('active');
    if (prevItem) prevItem.classList.add('adjacent');
    if (nextItem) nextItem.classList.add('adjacent');
  }
  
  function handleTransitionEnd() {
    if (currentIndex === -1) {
      track.style.transition = 'none';
      currentIndex = items.length - 1;
      track.style.transform = `translateX(-${(currentIndex + 1) * (itemWidth + gap)}px)`;
    }
    if (currentIndex === items.length) {
      track.style.transition = 'none';
      currentIndex = 0;
      track.style.transform = `translateX(-${(currentIndex + 1) * (itemWidth + gap)}px)`;
    }
  }
  
  prevButton.addEventListener('click', () => {
    if (currentIndex <= -1) return;
    currentIndex--;
    updateCarousel();
  });
  
  nextButton.addEventListener('click', () => {
    if (currentIndex >= items.length) return;
    currentIndex++;
    updateCarousel();
  });
  
  track.addEventListener('transitionend', handleTransitionEnd);
  
  // Handle window resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const newItemWidth = items[0].offsetWidth;
      track.style.transition = 'none';
      track.style.transform = `translateX(-${(currentIndex + 1) * (newItemWidth + gap)}px)`;
      updateActiveState();
    }, 250);
  });
});

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Set copyright year
    const copyrightYear = document.getElementById('copyright-year');
    if (copyrightYear) {
        copyrightYear.textContent = new Date().getFullYear();
    }

    // Initialize all features
    loadImages();
    handleScrollAnimations();
    initLightbox();
    initMobileMenu();
    initSmoothScroll();
    initLandingAnimations();
    
    // Add scroll event listener
    const main = document.getElementById('main');
    if (main) {
        main.addEventListener('scroll', handleStickyNav);
    }
}); 