// script.js — Modernized Premium Portfolio

document.addEventListener('DOMContentLoaded', () => {
    
    // --- Particle Canvas Animation ---
    const canvas = document.getElementById('particles');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        const particleCount = 60;
        const connectionDistance = 120;
        let mouse = { x: null, y: null };

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.4;
                this.vy = (Math.random() - 0.5) * 0.4;
                this.radius = Math.random() * 2 + 0.5;
                this.opacity = Math.random() * 0.5 + 0.1;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
                if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;

                // Subtle mouse repulsion
                if (mouse.x !== null) {
                    const dx = this.x - mouse.x;
                    const dy = this.y - mouse.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 100) {
                        this.x += dx * 0.01;
                        this.y += dy * 0.01;
                    }
                }
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(0, 255, 213, ${this.opacity})`;
                ctx.fill();
            }
        }

        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        function connectParticles() {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < connectionDistance) {
                        const opacity = (1 - dist / connectionDistance) * 0.15;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(0, 255, 213, ${opacity})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            connectParticles();
            requestAnimationFrame(animate);
        }
        animate();
    }

    // --- Mobile Menu Toggle ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links a');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // --- Navbar Scroll Effect ---
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // --- Typing Effect for Hero Section ---
    const words = ["REST APIs.", "Discord Bots.", "Python Scripts.", "Data Solutions."];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typingDelay = 100;
    const erasingDelay = 50;
    const newWordDelay = 2000;
    const textSpan = document.getElementById("typing-text");

    function type() {
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            textSpan.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
        } else {
            textSpan.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = isDeleting ? erasingDelay : typingDelay;

        if (!isDeleting && charIndex === currentWord.length) {
            typeSpeed = newWordDelay;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typeSpeed = typingDelay;
        }

        setTimeout(type, typeSpeed);
    }

    // Start typing effect
    if(words.length) setTimeout(type, newWordDelay);


    // --- 3D Tilt Effect on Project Cards ---
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
        });
    });


    // --- Scroll Animations & Active Nav Links ---
    const sections = document.querySelectorAll('section');
    const fadeElements = document.querySelectorAll('.fade-in');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // If the section is skills, animate progress bars
                if (entry.target.id === 'skills') {
                    const progressBars = document.querySelectorAll('.progress');
                    progressBars.forEach(bar => {
                        bar.style.width = bar.getAttribute('data-width');
                    });
                }
            }
        });
    }, observerOptions);

    fadeElements.forEach(el => sectionObserver.observe(el));
    
    // Highlight Active Link based on scroll position
    window.addEventListener('scroll', () => {
        let current = '';
        const scrollSections = document.querySelectorAll('header, section');

        scrollSections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href').includes(current)) {
                item.classList.add('active');
            }
        });
    });

    // --- Smooth Reveal on First Load ---
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.6s ease';
    requestAnimationFrame(() => {
        document.body.style.opacity = '1';
    });

    // --- Azerbaijani / English Language Toggle ---
    const translations = {
        en: {
            'nav.home': 'Home',
            'nav.about': 'About',
            'nav.skills': 'Skills',
            'nav.projects': 'Projects',
            'nav.contact': 'Contact',
            'hero.greeting': 'Hello, World! I am',
            'hero.name': 'A Passionate <span class="accent">Developer</span>',
            'hero.desc': "I'm a 14-year-old tech enthusiast specializing in Python for the backend. I love solving complex problems, building scalable APIs, and constantly learning new technologies.",
            'hero.cta1': 'View My Work',
            'hero.cta2': 'Get In Touch',
            'about.title': 'About <span class="accent">Me</span>',
            'skills.title': 'Technical <span class="accent">Skills</span>',
            'projects.title': 'Featured <span class="accent">Projects</span>',
            'contact.title': 'Get In <span class="accent">Touch</span>'
        },
        az: {
            'nav.home': 'Əsas',
            'nav.about': 'Haqqında',
            'nav.skills': 'Bacarıqlar',
            'nav.projects': 'Layihələr',
            'nav.contact': 'Əlaqə',
            'hero.greeting': 'Salam, Dünya! Mən',
            'hero.name': 'Həvəsli <span class="accent">Proqramçı</span>',
            'hero.desc': 'Mən 14 yaşlı texnologiya həvəskarıyam və əsasən backend üçün Python ilə işləyirəm. Mürəkkəb problemləri həll etməyi, genişlənə bilən API-lər qurmağı və daim yeni texnologiyalar öyrənməyi sevirəm.',
            'hero.cta1': 'İşlərimi Gör',
            'hero.cta2': 'Əlaqə Saxla',
            'about.title': 'Haqqımda <span class="accent">Mən</span>',
            'skills.title': 'Texniki <span class="accent">Bacarıqlar</span>',
            'projects.title': 'Layihələr',
            'contact.title': 'Əlaqə'
        }
    };

    function setLanguage(lang) {
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            const text = translations[lang]?.[key];
            if (!text) return;

            // Preserve HTML markup when the translation contains tags
            if (text.includes('<')) {
                el.innerHTML = text;
            } else {
                el.textContent = text;
            }
        });

        const toggleBtn = document.getElementById('lang-toggle');
        if (toggleBtn) {
            toggleBtn.textContent = lang === 'en' ? 'AZ' : 'EN';
        }

        localStorage.setItem('preferredLang', lang);
    }

    const preferredLang = localStorage.getItem('preferredLang') || 'en';
    setLanguage(preferredLang);

    const langToggle = document.getElementById('lang-toggle');
    if (langToggle) {
        langToggle.addEventListener('click', () => {
            const nextLang = (localStorage.getItem('preferredLang') === 'az') ? 'en' : 'az';
            setLanguage(nextLang);
        });
    }
});
