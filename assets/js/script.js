// ===== Configuration =====
const CONFIG = {
    scrollThreshold: 100,
    animationDuration: 1000,
    particleCount: 50,
    cursorTrailLength: 10
};

// ===== DOM Ready =====
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavigation();
    initSmoothScrolling();
    initBackToTop();
    initContactForm();
    initScrollAnimations();
    initParticles();
    initScrollProgress();
    initTypingEffect();
    initProjectCards();
    setCurrentYear();
});

// ===== NAVIGATION =====
function initNavigation() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbar = document.querySelector('.navbar');
    
    // Toggle mobile menu
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }
    
    // Close menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            if (menuToggle) {
                const icon = menuToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    });
    
    // Navbar scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Add scrolled class
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Update active link
        updateActiveLink();
        
        lastScroll = currentScroll;
    });
}

function updateActiveLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset + 100;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
            });
            navLink?.classList.add('active');
        }
    });
}

// ===== SMOOTH SCROLLING =====
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== BACK TO TOP BUTTON =====
function initBackToTop() {
    const backToTopButton = document.getElementById('backToTop');
    
    if (backToTopButton) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > CONFIG.scrollThreshold) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        });
        
        backToTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// ===== CONTACT FORM =====
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const name = this.querySelector('#name')?.value || this.querySelector('[name="name"]')?.value;
            const email = this.querySelector('#email')?.value || this.querySelector('[name="email"]')?.value;
            const subject = this.querySelector('#subject')?.value || this.querySelector('[name="subject"]')?.value || 'Contact depuis le portfolio';
            const message = this.querySelector('#message')?.value || this.querySelector('[name="message"]')?.value;
            
            // Validation
            if (!name || !email || !message) {
                showNotification('Veuillez remplir tous les champs obligatoires.', 'error');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showNotification('Veuillez entrer une adresse email valide.', 'error');
                return;
            }
            
            // Show loading state
            const submitButton = this.querySelector('button[type="submit"]');
            const originalText = submitButton.innerHTML;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
            submitButton.disabled = true;
            
            // Construct mailto link
            const mailtoLink = `mailto:aymanesarhane999@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Nom: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;
            
            // Open email client
            setTimeout(() => {
                window.location.href = mailtoLink;
                
                // Show success message
                showNotification('Votre client email va s\'ouvrir. Merci pour votre message !', 'success');
                
                // Reset form
                contactForm.reset();
                
                // Reset button
                submitButton.innerHTML = originalText;
                submitButton.disabled = false;
            }, 500);
        });
    }
}

// ===== NOTIFICATION SYSTEM =====
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const icon = type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle';
    
    notification.innerHTML = `
        <i class="fas ${icon}"></i>
        <span>${message}</span>
        <button class="notification-close" aria-label="Close notification">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Show notification with animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Auto remove after 5 seconds
    const autoRemoveTimer = setTimeout(() => {
        removeNotification(notification);
    }, 5000);
    
    // Close button
    notification.querySelector('.notification-close').addEventListener('click', () => {
        clearTimeout(autoRemoveTimer);
        removeNotification(notification);
    });
    
    // Add CSS for notification if not exists
    injectNotificationStyles();
}

function removeNotification(notification) {
    notification.classList.remove('show');
    setTimeout(() => {
        notification.remove();
    }, 300);
}

function injectNotificationStyles() {
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 100px;
                right: 20px;
                padding: 1rem 1.5rem;
                border-radius: 10px;
                color: var(--white);
                display: flex;
                align-items: center;
                gap: 1rem;
                max-width: 400px;
                z-index: 10000;
                transform: translateX(120%);
                transition: transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
                box-shadow: var(--shadow-lg);
                backdrop-filter: blur(10px);
            }
            
            .notification.show {
                transform: translateX(0);
            }
            
            .notification-success {
                background: linear-gradient(135deg, var(--primary-green), var(--secondary-green));
                color: var(--black);
            }
            
            .notification-error {
                background: linear-gradient(135deg, #ff4444, #cc0000);
            }
            
            .notification-info {
                background: linear-gradient(135deg, var(--primary-green), var(--dark-green));
            }
            
            .notification i:first-child {
                font-size: 1.5rem;
            }
            
            .notification span {
                flex: 1;
                font-weight: 500;
            }
            
            .notification-close {
                background: rgba(255, 255, 255, 0.2);
                border: none;
                color: inherit;
                font-size: 1rem;
                cursor: pointer;
                padding: 0.25rem 0.5rem;
                border-radius: 5px;
                transition: background 0.2s;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .notification-close:hover {
                background: rgba(255, 255, 255, 0.3);
            }
            
            @media (max-width: 768px) {
                .notification {
                    left: 20px;
                    right: 20px;
                    max-width: none;
                    top: 80px;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Animate skill bars
                if (entry.target.classList.contains('skill-item')) {
                    animateSkillBar(entry.target);
                }
                
                // Animate stat cards
                if (entry.target.classList.contains('stat-card')) {
                    animateStatCard(entry.target);
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements
    const elementsToObserve = document.querySelectorAll(
        '.project-card, .skill-category, .skill-item, .cert-card, .contact-card, .stat-card, .about-text'
    );
    
    elementsToObserve.forEach(el => observer.observe(el));
}

function animateSkillBar(skillItem) {
    const skillLevel = skillItem.querySelector('.skill-level');
    const skillPercent = skillItem.querySelector('.skill-percent');
    
    if (skillLevel && skillPercent) {
        const targetWidth = skillLevel.getAttribute('data-width') || skillLevel.style.width;
        const targetPercent = parseInt(skillPercent.textContent);
        
        skillLevel.style.width = '0';
        
        setTimeout(() => {
            skillLevel.style.width = targetWidth;
            
            // Animate percentage counter
            animateCounter(skillPercent, 0, targetPercent, 1500);
        }, 100);
    }
}

function animateStatCard(statCard) {
    const statNumber = statCard.querySelector('.stat-number');
    if (statNumber) {
        const targetValue = parseInt(statNumber.textContent.replace(/\D/g, ''));
        const suffix = statNumber.textContent.replace(/[0-9]/g, '');
        
        animateCounter(statNumber, 0, targetValue, 2000, suffix);
    }
}

function animateCounter(element, start, end, duration, suffix = '') {
    const increment = (end - start) / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
            current = end;
            clearInterval(timer);
        }
        element.textContent = Math.round(current) + suffix;
    }, 16);
}

// ===== TYPING EFFECT =====
function initTypingEffect() {
    const heroTitle = document.querySelector('.hero h1');
    if (heroTitle) {
        const originalText = heroTitle.innerHTML;
        heroTitle.style.opacity = '0';
        
        setTimeout(() => {
            heroTitle.style.opacity = '1';
            typeWriter(heroTitle, originalText, 80);
        }, 500);
    }
}

function typeWriter(element, html, speed = 100) {
    // Parse HTML to handle tags
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    const text = tempDiv.textContent;
    
    element.textContent = '';
    let i = 0;
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        } else {
            // Restore HTML with classes
            element.innerHTML = html;
        }
    }
    
    type();
}

// ===== PARTICLES BACKGROUND =====
function initParticles() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    // Check if particles already exist
    if (hero.querySelector('.particles-container')) return;
    
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles-container';
    
    for (let i = 0; i < CONFIG.particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.opacity = `${Math.random() * 0.5 + 0.2}`;
        particle.style.animationDuration = `${Math.random() * 10 + 5}s`;
        particle.style.animationDelay = `${Math.random() * 5}s`;
        
        particlesContainer.appendChild(particle);
    }
    
    hero.insertBefore(particlesContainer, hero.firstChild);
}

// ===== SCROLL PROGRESS BAR =====
function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);
    
    let ticking = false;
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateScrollProgress(progressBar);
                ticking = false;
            });
            ticking = true;
        }
    });
}

function updateScrollProgress(progressBar) {
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (window.pageYOffset / windowHeight) * 100;
    progressBar.style.width = `${scrolled}%`;
}

// ===== CURSOR TRAIL EFFECT =====
let cursorTrail = [];

function initCursorTrail() {
    if (window.innerWidth <= 968) return; // Disable on mobile
    
    document.addEventListener('mousemove', createCursorTrail);
}

function createCursorTrail(e) {
    const trail = document.createElement('div');
    trail.className = 'cursor-trail';
    trail.style.left = `${e.clientX - 5}px`;
    trail.style.top = `${e.clientY - 5}px`;
    
    document.body.appendChild(trail);
    cursorTrail.push(trail);
    
    if (cursorTrail.length > CONFIG.cursorTrailLength) {
        const oldTrail = cursorTrail.shift();
        oldTrail.style.opacity = '0';
        setTimeout(() => oldTrail.remove(), 500);
    }
    
    // Fade out trail
    setTimeout(() => {
        trail.style.opacity = '0';
    }, 100);
}

// ===== PROJECT CARDS HOVER EFFECT =====
function initProjectCards() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Create glow effect at cursor position
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.setProperty('--mouse-x', '50%');
            card.style.setProperty('--mouse-y', '50%');
        });
    });
    
    // Add glow effect CSS
    injectProjectCardStyles();
}

function injectProjectCardStyles() {
    if (!document.querySelector('#project-card-styles')) {
        const style = document.createElement('style');
        style.id = 'project-card-styles';
        style.textContent = `
            .project-card {
                --mouse-x: 50%;
                --mouse-y: 50%;
                position: relative;
            }
            
            .project-card::after {
                content: '';
                position: absolute;
                width: 300px;
                height: 300px;
                background: radial-gradient(
                    circle at center,
                    rgba(0, 255, 136, 0.15) 0%,
                    transparent 70%
                );
                left: var(--mouse-x);
                top: var(--mouse-y);
                transform: translate(-50%, -50%);
                pointer-events: none;
                opacity: 0;
                transition: opacity 0.3s;
            }
            
            .project-card:hover::after {
                opacity: 1;
            }
        `;
        document.head.appendChild(style);
    }
}

// ===== FLOATING ELEMENTS ANIMATION =====
function initFloatingElements() {
    const floatingElements = document.querySelectorAll('.floating-element');
    
    floatingElements.forEach((element, index) => {
        element.style.animationDelay = `${index * 0.5}s`;
    });
}

// ===== UTILITIES =====
function setCurrentYear() {
    const currentYear = new Date().getFullYear();
    const yearElements = document.querySelectorAll('.current-year, .footer-bottom');
    
    yearElements.forEach(element => {
        if (element.classList.contains('footer-bottom')) {
            element.innerHTML = element.innerHTML.replace(/&copy; \d{4}/, `&copy; ${currentYear}`);
        } else {
            element.textContent = currentYear;
        }
    });
}

// ===== PERFORMANCE OPTIMIZATIONS =====
// Debounce function for scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for frequent events
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ===== LOADING ANIMATION =====
window.addEventListener('load', () => {
    // Hide loading screen if exists
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => loader.remove(), 300);
    }
    
    // Initialize cursor trail after load
    initCursorTrail();
    
    // Initialize floating elements
    initFloatingElements();
    
    // Add loaded class to body
    document.body.classList.add('loaded');
});

// ===== KEYBOARD NAVIGATION =====
document.addEventListener('keydown', (e) => {
    // ESC key closes mobile menu
    if (e.key === 'Escape') {
        const navMenu = document.querySelector('.nav-menu');
        const menuToggle = document.querySelector('.menu-toggle');
        
        if (navMenu && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            if (menuToggle) {
                const icon = menuToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        }
    }
    
    // Close notification on ESC
    if (e.key === 'Escape') {
        const notification = document.querySelector('.notification');
        if (notification) {
            removeNotification(notification);
        }
    }
});

// ===== CONSOLE EASTER EGG =====
console.log('%c👋 Salut développeur!', 'color: #00ff88; font-size: 20px; font-weight: bold;');
console.log('%cMerci de visiter mon portfolio!', 'color: #00cc6f; font-size: 16px;');
console.log('%cSi tu cherches à me contacter, voici mon email: aymanesarhane999@gmail.com', 'color: #8a8a8a; font-size: 14px;');
console.log('%cDéveloppé avec 💚 et beaucoup de caféine ☕', 'color: #00ff88; font-size: 12px;');

// ===== EXPORT FOR DEBUGGING =====
window.portfolioDebug = {
    version: '2.0.0',
    features: [
        'Smooth Scrolling',
        'Animated Navigation',
        'Particle Effects',
        'Scroll Progress',
        'Cursor Trail',
        'Typing Effect',
        'Notification System',
        'Form Validation',
        'Responsive Design',
        'Performance Optimized'
    ],
    showNotification: showNotification
};
