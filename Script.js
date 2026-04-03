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

        const DOT_COLOR = '#FDE6D1';
        const LINE_RGB = '253, 230, 209';
        const MOUSE_LINE_RGB = '53, 242, 223';

        function resize() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = document.querySelector('.hero').offsetHeight;
        }
        window.addEventListener('resize', resize);
        resize();

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
                ctx.fillStyle = DOT_COLOR;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        for (let i = 0; i < 80; i++) particles.push(new Particle());

        function animate() {
            ctx.clearRect(0, 0, width, height);

            particles.forEach(p => {
                p.update();
                p.draw();

                particles.forEach(p2 => {
                    const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
                    if (dist < 100) {
                        ctx.strokeStyle = `rgba(${LINE_RGB}, ${1 - dist / 100})`;
                        ctx.lineWidth = 0.5;
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                });

                const heroRect = document.querySelector('.hero').getBoundingClientRect();
                if (mouseY >= heroRect.top && mouseY <= heroRect.bottom) {
                    const mouseDist = Math.hypot(p.x - mouseX, p.y - (mouseY - heroRect.top));
                    if (mouseDist < 150) {
                        ctx.strokeStyle = `rgba(${MOUSE_LINE_RGB}, ${1 - mouseDist / 150})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(mouseX, mouseY - heroRect.top);
                        ctx.stroke();
                    }
                }
            });
            requestAnimationFrame(animate);
        }
        animate();
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
}