document.addEventListener('DOMContentLoaded', () => {
    const cursor = document.querySelector('.cursor');
    const body = document.body;
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function updateInteractables() {
        const interactables = document.querySelectorAll('a, button, .avatar-frame, .project-card, .close, .cv-label, .skill-node');
        interactables.forEach(el => {
            el.addEventListener('mouseenter', () => body.classList.add('cursor-hover'));
            el.addEventListener('mouseleave', () => body.classList.remove('cursor-hover'));
        });
    }
    updateInteractables();

    const typewriter = document.querySelector('.typewriter-text');
    const words = JSON.parse(typewriter.getAttribute('data-words'));
    let wordIdx = 0, charIdx = 0, isDeleting = false;

    function type() {
        const currentWord = words[wordIdx % words.length];
        typewriter.textContent = isDeleting ? currentWord.substring(0, charIdx--) : currentWord.substring(0, charIdx++);
        let speed = isDeleting ? 50 : 100;
        if (!isDeleting && charIdx === currentWord.length + 1) { speed = 2000; isDeleting = true; }
        else if (isDeleting && charIdx === 0) { isDeleting = false; wordIdx++; speed = 500; }
        setTimeout(type, speed);
    }
    if (typewriter) type();

    const canvas = document.getElementById('hero-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height, particles = [];
        let textZone = { x: -1000, y: -1000, w: 0, h: 0 }; 

        const DOT_COLOR = '#FDE6D1';
        const LINE_RGB = '253, 230, 209';
        const MOUSE_LINE_RGB = '53, 242, 223';

        function resize() {
            width = canvas.width = window.innerWidth;
            const hero = document.querySelector('.hero');
            const about = document.querySelector('#about');

            const heroHeight = hero ? hero.offsetHeight : 0;
            const aboutHeight = about ? about.offsetHeight : 0;
            height = canvas.height = heroHeight + aboutHeight;

            const textEl = document.querySelector('.about-text');
            if (textEl && canvas) {
                const canvasRect = canvas.getBoundingClientRect();
                const textRect = textEl.getBoundingClientRect();
                textZone = {
                    x: textRect.left - canvasRect.left,
                    y: textRect.top - canvasRect.top,
                    w: textRect.width,
                    h: textRect.height
                };
            }
        }
        window.addEventListener('resize', resize);
        resize();

        function isInTextZone(x, y) {
            const pad = 20;
            return (x > textZone.x - pad &&
                x < textZone.x + textZone.w + pad &&
                y > textZone.y - pad &&
                y < textZone.y + textZone.h + pad);
        }

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 1.5;
                this.vy = (Math.random() - 0.5) * 1.5;
                this.size = Math.random() * 2 + 1;
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;
            }
            draw() {
                if (!isInTextZone(this.x, this.y)) {
                    ctx.fillStyle = DOT_COLOR;
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
        }

        for (let i = 0; i < 130; i++) particles.push(new Particle());

        function animate() {
            ctx.clearRect(0, 0, width, height);

            const rect = canvas.getBoundingClientRect();
            const localMouseX = mouseX - rect.left;
            const localMouseY = mouseY - rect.top;

            particles.forEach(p => {
                p.update();
                p.draw();

                particles.forEach(p2 => {
                    const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
                    if (dist < 100) {
                        if (!isInTextZone(p.x, p.y) && !isInTextZone(p2.x, p2.y)) {
                            ctx.strokeStyle = `rgba(${LINE_RGB}, ${1 - dist / 100})`;
                            ctx.lineWidth = 0.5;
                            ctx.beginPath();
                            ctx.moveTo(p.x, p.y);
                            ctx.lineTo(p2.x, p2.y);
                            ctx.stroke();
                        }
                    }
                });

                if (localMouseY >= 0 && localMouseY <= height && localMouseX >= 0 && localMouseX <= width) {
                    const mouseDist = Math.hypot(p.x - localMouseX, p.y - localMouseY);
                    if (mouseDist < 150) {
                        if (!isInTextZone(p.x, p.y) && !isInTextZone(localMouseX, localMouseY)) {
                            ctx.strokeStyle = `rgba(${MOUSE_LINE_RGB}, ${1 - mouseDist / 150})`;
                            ctx.lineWidth = 1;
                            ctx.beginPath();
                            ctx.moveTo(p.x, p.y);
                            ctx.lineTo(localMouseX, localMouseY);
                            ctx.stroke();
                        }
                    }
                }
            });
            requestAnimationFrame(animate);
        }
        animate();
    }

    const tabNav = document.getElementById('skill-tabs-nav');
    if (tabNav) {
        let isScrolling;
        tabNav.addEventListener('scroll', () => {
            if (window.innerWidth > 800) return;

            window.clearTimeout(isScrolling);

            isScrolling = setTimeout(() => {
                const navCenter = tabNav.getBoundingClientRect().left + (tabNav.offsetWidth / 2);
                let closestBtn = null;
                let minDiff = Infinity;

                document.querySelectorAll('.skill-tab-btn').forEach(btn => {
                    const rect = btn.getBoundingClientRect();
                    const btnCenter = rect.left + (rect.width / 2);
                    const diff = Math.abs(navCenter - btnCenter);

                    if (diff < minDiff) {
                        minDiff = diff;
                        closestBtn = btn;
                    }
                });

                if (closestBtn && !closestBtn.classList.contains('active')) {
                    const evt = new Event('click');
                    const tabId = closestBtn.getAttribute('onclick').match(/'([^']+)'/)[1];
                    openSkillTab({ currentTarget: closestBtn }, tabId);
                }
            }, 130); 
        });
    }

    const sections = document.querySelectorAll('#about, #projects, #contact');
    const navLinks = document.querySelectorAll('.nav-links a');

    const observerOptions = {
        root: null,
        rootMargin: '-30% 0px -50% 0px',
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => link.classList.remove('active'));

                const activeLink = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
                if (activeLink) activeLink.classList.add('active');
            }
        });
    }, observerOptions);

    sections.forEach(sec => observer.observe(sec));

    const heroObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            navLinks.forEach(link => link.classList.remove('active'));
        }
    }, { rootMargin: '-10% 0px 0px 0px' });

    const hero = document.querySelector('.hero');
    if (hero) heroObserver.observe(hero);

    const secretLogo = document.getElementById('secret-logo');
    if (secretLogo) {
        secretLogo.addEventListener('click', () => {
            const originalText = secretLogo.textContent;

            secretLogo.textContent = 'LEVEL UP! +100XP';
            secretLogo.classList.add('hacked');

            const randomHue1 = Math.floor(Math.random() * 360);
            const randomHue2 = Math.floor(Math.random() * 360);
            document.documentElement.style.setProperty('--accent-cyan', `hsl(${randomHue1}, 100%, 60%)`);
            document.documentElement.style.setProperty('--accent-magenta', `hsl(${randomHue2}, 100%, 60%)`);

            setTimeout(() => {
                secretLogo.textContent = originalText;
                secretLogo.classList.remove('hacked');
            }, 1500);
        });
    }
});

function openCV() {
    const popup = document.getElementById('cv-popup');
    popup.style.display = 'flex';
}

function closeCV() {
    const popup = document.getElementById('cv-popup');
    popup.style.display = 'none';
}


function openSkillTab(evt, tabId) {
    const panes = document.querySelectorAll('.skill-tab-pane');
    panes.forEach(pane => {
        pane.classList.remove('active');
    });

    const btns = document.querySelectorAll('.skill-tab-btn');
    btns.forEach(btn => {
        btn.classList.remove('active');
    });

    const targetPane = document.getElementById(tabId);
    void targetPane.offsetWidth;

    targetPane.classList.add('active');
    evt.currentTarget.classList.add('active');

    evt.currentTarget.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
}


function moveCarousel(direction) {
    const grid = document.getElementById('projects-grid');
    if (grid) {
        const card = grid.querySelector('.project-card');
        if (card) {
            const scrollAmount = card.offsetWidth + 32;
            grid.scrollBy({
                left: direction * scrollAmount,
                behavior: 'smooth'
            });
        }
    }
}
function scrollTabs(direction) {
    const btns = Array.from(document.querySelectorAll('.skill-tab-btn'));
    const activeIndex = btns.findIndex(btn => btn.classList.contains('active'));
    let newIndex = activeIndex + direction;

    if (newIndex >= 0 && newIndex < btns.length) {
        btns[newIndex].click(); 
    }
}