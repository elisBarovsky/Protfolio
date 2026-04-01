document.addEventListener('DOMContentLoaded', () => {
    const cursor = document.querySelector('.cursor');
    const body = document.body;

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });
    function updateInteractables() {
        const interactables = document.querySelectorAll('a, button, .avatar-frame, .project-card, .close, .cv-label');
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

        if (!isDeleting && charIdx === currentWord.length + 1) {
            speed = 2000;
            isDeleting = true;
        }
        else if (isDeleting && charIdx === 0) {
            isDeleting = false;
            wordIdx++;
            speed = 500;
        }
        setTimeout(type, speed);
    }

    if (typewriter) type();
});

function openCV() {
    document.getElementById('cv-popup').style.display = 'flex';
}

function closeCV() {
    document.getElementById('cv-popup').style.display = 'none';
}