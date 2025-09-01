// Initialize Lucide icons
document.addEventListener('DOMContentLoaded', function () {
    lucide.createIcons();

    // Initialize all functionality
    initNavigation();
    initThemeToggle();
    initScrollReveal();
    initContactForm();
    initScrollEffects();
    initSkillBars();
});

// Navigation functionality
function initNavigation() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    mobileMenuBtn.addEventListener('click', function () {
        const isOpen = !mobileMenu.classList.contains('hidden');

        if (isOpen) {
            mobileMenu.classList.add('hidden');
            document.body.classList.remove('mobile-nav-open');
            mobileMenuBtn.innerHTML = '<i data-lucide="menu"></i>';
        } else {
            mobileMenu.classList.remove('hidden');
            document.body.classList.add('mobile-nav-open');
            mobileMenuBtn.innerHTML = '<i data-lucide="x"></i>';
        }

        lucide.createIcons();
    });

    // Close mobile menu when clicking on a link
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', function () {
            mobileMenu.classList.add('hidden');
            document.body.classList.remove('mobile-nav-open');
            mobileMenuBtn.innerHTML = '<i data-lucide="menu"></i>';
            lucide.createIcons();
        });
    });

    // Smooth scroll for navigation links
    [...navLinks, ...mobileNavLinks].forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            scrollToSection(targetId.substring(1));
        });
    });
}

// Theme toggle functionality
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeToggleMobile = document.getElementById('theme-toggle-mobile');

    // Check for saved theme preference or default to light
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
        updateThemeIcons(true);
    }

    // Theme toggle handlers
    [themeToggle, themeToggleMobile].forEach(toggle => {
        toggle.addEventListener('click', function () {
            const isDark = document.documentElement.classList.toggle('dark');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            updateThemeIcons(isDark);
        });
    });
}

function updateThemeIcons(isDark) {
    const themeToggle = document.getElementById('theme-toggle');
    const themeToggleMobile = document.getElementById('theme-toggle-mobile');

    const iconName = isDark ? 'sun' : 'moon';
    themeToggle.innerHTML = `<i data-lucide="${iconName}"></i>`;
    themeToggleMobile.innerHTML = `<i data-lucide="${iconName}"></i>`;

    lucide.createIcons();
}

// Scroll effects
function initScrollEffects() {
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', function () {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// Scroll reveal animation
function initScrollReveal() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');

                // Trigger skill bar animations when skills section is revealed
                if (entry.target.classList.contains('skill-category')) {
                    animateSkillBars(entry.target);
                }
            }
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.scroll-reveal');
    revealElements.forEach(el => observer.observe(el));
}

// Skill bars animation
function initSkillBars() {
    // This will be triggered by scroll reveal
}

function animateSkillBars(skillCategory) {
    const skillBars = skillCategory.querySelectorAll('.skill-progress');
    skillBars.forEach((bar, index) => {
        setTimeout(() => {
            const width = bar.style.width;
            bar.style.width = '0%';
            setTimeout(() => {
                bar.style.width = width;
            }, 100);
        }, index * 200);
    });
}

// Contact form functionality
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    const submitText = document.getElementById('form-submit-text');

    contactForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        // Get form data
        const formData = new FormData(contactForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const message = formData.get('message');

        // Validate form
        if (!name || !email || !message) {
            showToast('Please fill in all fields', 'error');
            return;
        }

        // Show loading state
        submitText.textContent = 'Sending...';
        contactForm.querySelector('button[type="submit"]').disabled = true;

        // Simulate form submission
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Show success message
            showToast('Message sent successfully! I\'ll get back to you soon.');

            // Reset form
            contactForm.reset();

        } catch (error) {
            showToast('Failed to send message. Please try again.', 'error');
        } finally {
            // Reset button state
            submitText.textContent = 'Send Message';
            contactForm.querySelector('button[type="submit"]').disabled = false;
        }
    });
}

// Utility functions
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        const offsetTop = element.offsetTop - 80; // Account for fixed header
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

function downloadCV() {
    // Create a simple PDF link or show a message
    const link = document.createElement('a');
    link.href = 'data:text/plain;charset=utf-8,Rudraksh Makvana - Frontend Developer CV\n\nThis is a placeholder CV file. In a real application, this would be a proper PDF file.';
    link.download = 'Rudraksh_Makvana_CV.txt';
    link.click();

    showToast('CV download started!');
}

function openLink(url) {
    window.open(url, '_blank');
}



// Smooth scroll behavior for older browsers
if (!('scrollBehavior' in document.documentElement.style)) {
    function smoothScrollTo(targetPosition, duration = 800) {
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;

        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = ease(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        }

        function ease(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        }

        requestAnimationFrame(animation);
    }

    // Override the scrollToSection function for older browsers
    window.scrollToSection = function (sectionId) {
        const element = document.getElementById(sectionId);
        if (element) {
            const offsetTop = element.offsetTop - 80;
            smoothScrollTo(offsetTop);
        }
    };
}

// Performance optimization: Debounce scroll events
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

// Apply debounce to scroll handler
window.addEventListener('scroll', debounce(function () {
    // Any additional scroll-based functionality can be added here
}, 10));

// Handle window resize
window.addEventListener('resize', debounce(function () {
    // Close mobile menu on resize to desktop
    if (window.innerWidth >= 768) {
        const mobileMenu = document.getElementById('mobile-menu');
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');

        mobileMenu.classList.add('hidden');
        document.body.classList.remove('mobile-nav-open');
        mobileMenuBtn.innerHTML = '<i data-lucide="menu"></i>';
        lucide.createIcons();
    }
}, 250));

// Intersection observer for navbar highlight (optional enhancement)
function initNavHighlight() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

    const observerOptions = {
        threshold: 0.3,
        rootMargin: '-80px 0px -50% 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${entry.target.id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));
}

// Initialize nav highlight on load
document.addEventListener('DOMContentLoaded', function () {
    setTimeout(initNavHighlight, 100);
});

// Add CSS for active nav links
const activeNavStyles = `
    .nav-link.active,
    .mobile-nav-link.active {
        color: var(--primary) !important;
        position: relative;
    }
    
    .nav-link.active::after {
        content: '';
        position: absolute;
        bottom: -0.5rem;
        left: 0;
        right: 0;
        height: 2px;
        background: var(--primary);
        border-radius: 1px;
    }
`;

// Inject active nav styles
const style = document.createElement('style');
style.textContent = activeNavStyles;
document.head.appendChild(style);





function showToast(message = "Message sent successfully!", type = "success") {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toast-message');
    if (!toast || !toastMsg) return;

    toastMsg.textContent = message;

    // Optionally change icon based on type
    const icon = toast.querySelector('i[data-lucide]');
    if (icon && window.lucide) {
        icon.setAttribute("data-lucide", type === "success" ? "check-circle" : "alert-circle");
        lucide.createIcons();
    }

    toast.classList.remove('hidden');
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
        toast.classList.add('hidden');
    }, 3000);
}



// ...existing code...

function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    const submitText = document.getElementById('form-submit-text');

    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Get form data
        const formData = new FormData(contactForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const message = formData.get('message');

        // Validate form
        if (!name || !email || !message) {
            showToast('Please fill in all fields', 'error');
            return;
        }

        // Show loading state
        submitText.textContent = 'Sending...';
        contactForm.querySelector('button[type="submit"]').disabled = true;

        // Send email using EmailJS
        emailjs.sendForm('service_3oc03le', 'template_ghei6bw', contactForm)
            .then(function(response) {
                showToast('Message sent successfully! I\'ll get back to you soon.');
                contactForm.reset();
            }, function(error) {
                showToast('Failed to send message. Please try again.', 'error');
            })
            .finally(function() {
                submitText.textContent = 'Send Message';
                contactForm.querySelector('button[type="submit"]').disabled = false;
            });
    });
}
// ...existing code...




