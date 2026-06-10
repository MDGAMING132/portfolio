/* -------------------------------------------------------------
 * PREMIUM PORTFOLIO INTERACTION LOGIC
 * Portfolio for Madhukanth M
 * ------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
    initCanvasParticles();
    initMobileNav();
    initStickyHeader();
    initScrollReveal();
    initContactForm();
});

/* ==========================================================================
   1. Interactive Canvas Particle Background (Constellation System)
   ========================================================================== */
function initCanvasParticles() {
    const canvas = document.getElementById('canvas-particles');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationFrameId;

    // Configuration
    const isMobile = window.innerWidth < 768;
    const config = {
        particleCount: isMobile ? 25 : 80,
        maxDistance: isMobile ? 80 : 120,
        mouseDistance: isMobile ? 0 : 160,
        particleSpeed: isMobile ? 0.2 : 0.4,
        particleColor: 'rgba(124, 58, 237, 0.25)',  /* Violet primary base */
        lineColor: 'rgba(0, 242, 254, 0.08)',      /* Aqua accent base */
        minSize: 1,
        maxSize: 3
    };

    // Track Mouse Coordinates
    const mouse = {
        x: null,
        y: null,
        radius: config.mouseDistance
    };

    window.addEventListener('mousemove', (e) => {
        if (isMobile) return;
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    // Resize Handler
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initParticles();
    }

    window.addEventListener('resize', resizeCanvas);

    // Particle Constructor
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * config.particleSpeed;
            this.vy = (Math.random() - 0.5) * config.particleSpeed;
            this.size = Math.random() * (config.maxSize - config.minSize) + config.minSize;
        }

        update() {
            // Move
            this.x += this.vx;
            this.y += this.vy;

            // Bounce off boundaries
            if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
            if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;

            // Optional mouse repulsion or attraction
            if (!isMobile && mouse.x !== null && mouse.y !== null) {
                const dx = this.x - mouse.x;
                const dy = this.y - mouse.y;
                const dist = Math.hypot(dx, dy);
                if (dist < mouse.radius) {
                    const force = (mouse.radius - dist) / mouse.radius;
                    // Gently push away from mouse
                    this.x += (dx / dist) * force * 1.5;
                    this.y += (dy / dist) * force * 1.5;
                }
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = config.particleColor;
            ctx.fill();
        }
    }

    // Populate Particles array
    function initParticles() {
        particles = [];
        const count = Math.min(config.particleCount, (canvas.width * canvas.height) / 18000);
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }
    }

    // Main Draw Loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Update and draw particles
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
        }

        // Connect particles
        for (let i = 0; i < particles.length; i++) {
            const p1 = particles[i];

            // Connect to mouse
            if (!isMobile && mouse.x !== null && mouse.y !== null) {
                const dxMouse = p1.x - mouse.x;
                const dyMouse = p1.y - mouse.y;
                const distMouse = Math.hypot(dxMouse, dyMouse);
                if (distMouse < config.mouseDistance) {
                    const alpha = (1 - distMouse / config.mouseDistance) * 0.18;
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.strokeStyle = `rgba(124, 58, 237, ${alpha})`;
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
            }

            // Connect to other particles
            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const dist = Math.hypot(dx, dy);

                if (dist < config.maxDistance) {
                    const alpha = (1 - dist / config.maxDistance) * 0.12;
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = `rgba(0, 242, 254, ${alpha})`;
                    ctx.lineWidth = 0.6;
                    ctx.stroke();
                }
            }
        }

        animationFrameId = requestAnimationFrame(animate);
    }

    resizeCanvas();
    animate();
}

/* ==========================================================================
   2. Sticky Header & Scroll Top Management
   ========================================================================== */
function initStickyHeader() {
    const header = document.getElementById('header');
    if (!header) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

/* ==========================================================================
   3. Mobile Drawer Navigation Overlay
   ========================================================================== */
function initMobileNav() {
    const hamburger = document.getElementById('hamburger');
    const mobileNav = document.getElementById('mobile-nav');
    const mobileLinks = document.querySelectorAll('.mobile-nav a');

    if (!hamburger || !mobileNav) return;

    // Toggle menu open/close
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        mobileNav.classList.toggle('active');
        document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
    });

    // Close when clicking overlay links
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            mobileNav.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

/* ==========================================================================
   4. Scroll Animations & Navigation Section Highlighting
   ========================================================================== */
function initScrollReveal() {
    // 4.1 Scroll Reveal elements via IntersectionObserver
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                
                // Animate child elements like skills progress bar fill inside this card
                const skillFills = entry.target.querySelectorAll('.skill-progress-fill');
                skillFills.forEach(fill => {
                    const value = fill.dataset.width || '0%';
                    fill.style.width = value;
                });

                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // 4.2 Nav Link Section Highlighting
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    const mobileLinks = document.querySelectorAll('.mobile-nav a');

    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        const scrollPosition = window.scrollY + 160; // Offset for header height

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        if (currentSectionId) {
            updateActiveLinks(navLinks, currentSectionId);
            updateActiveLinks(mobileLinks, currentSectionId);
        }
    });

    function updateActiveLinks(links, activeId) {
        links.forEach(link => {
            if (link.getAttribute('href') === `#${activeId}`) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    // 4.3 Stagger reveal grid child lists for achievements, contact, etc.
    const staggerGrids = document.querySelectorAll('.skills-container, .projects-grid, .achievements-grid, .contact-grid');
    staggerGrids.forEach(grid => {
        const children = grid.children;
        Array.from(children).forEach((child, i) => {
            child.classList.add('reveal');
            child.style.transitionDelay = `${i * 0.12}s`;
            revealObserver.observe(child);
        });
    });
}

/* ==========================================================================
   5. Form Validator & Simulation Toasts
   ========================================================================== */
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const subjectInput = document.getElementById('subject');
    const messageInput = document.getElementById('message');

    // Textarea auto-grow height logic
    if (messageInput) {
        messageInput.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = (this.scrollHeight) + 'px';
        });
    }

    // Handle Form Submit Event
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // 1. Basic validation checks
        if (!nameInput.value.trim() || !emailInput.value.trim() || !messageInput.value.trim()) {
            showToast('Please fill out all required fields.', 'warning');
            return;
        }

        if (!validateEmail(emailInput.value)) {
            showToast('Please enter a valid email address.', 'warning');
            return;
        }

        // 2. Submit loading feedback simulation
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending Message...';

        setTimeout(() => {
            // Success state reset
            showToast('Message sent successfully! Madhukanth will get back to you soon.', 'success');
            form.reset();
            if (messageInput) messageInput.style.height = 'auto';
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }, 1200);
    });

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email.toLowerCase());
    }
}

/* ==========================================================================
   6. Custom Toast Notification Generator
   ========================================================================== */
function showToast(message, type = 'success') {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    
    // Customize border/color indicators
    if (type === 'success') {
        toast.style.borderLeftColor = '#10b981';
        toast.innerHTML = `<i class="fas fa-check-circle toast-icon" style="color:#10b981;"></i><span>${message}</span>`;
    } else if (type === 'warning') {
        toast.style.borderLeftColor = '#f59e0b';
        toast.innerHTML = `<i class="fas fa-exclamation-circle toast-icon" style="color:#f59e0b;"></i><span>${message}</span>`;
    }

    container.appendChild(toast);

    // Trigger Entrance animation after insertion
    setTimeout(() => {
        toast.classList.add('show');
    }, 50);

    // Trigger Dismissal timeline
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 350);
    }, 4500);
}
