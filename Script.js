

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Custom Cursor Logic ---
    const cursor = document.querySelector('.cursor');

    // Track mouse position
    document.addEventListener('mousemove', (e) => {
        // Position the cursor div
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    // Add interaction states (scale up) for links and buttons
    // בתוך ה-DOMContentLoaded ב-script.js
    const interactables = document.querySelectorAll('a, button, .hero-visual, .project-card, .close, .download-btn, .social-icon');
    interactables.forEach(link => {
        link.addEventListener('mouseenter', () => {
            document.body.classList.add('cursor-hover');
        });
        link.addEventListener('mouseleave', () => {
            document.body.classList.remove('cursor-hover');
        });
    });

    // --- 2. Dark/Light Mode Toggle Logic ---
    const themeToggleBtn = document.getElementById('theme-toggle');

    // Check local storage for preference
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme) {
        document.body.classList.add(currentTheme);
    }

    themeToggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');

        // Save preference
        let theme = 'light-mode';
        if (document.body.classList.contains('dark-mode')) {
            theme = 'dark-mode';
        }
        localStorage.setItem('theme', theme);
    });

    // --- 3. Typewriter Effect Logic ---
    const typewriterElement = document.querySelector('.typewriter-text');
    const wordsArray = JSON.parse(typewriterElement.getAttribute('data-words'));
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const currentWord = wordsArray[wordIndex % wordsArray.length];

        if (isDeleting) {
            typewriterElement.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typewriterElement.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
        }

        // Handle speed
        let typeSpeed = isDeleting ? 50 : 100;

        if (!isDeleting && charIndex === currentWord.length) {
            // Finished typing the word, pause before deleting
            typeSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            // Finished deleting, move to next word
            isDeleting = false;
            wordIndex++;
            typeSpeed = 500;
        }

        setTimeout(type, typeSpeed);
    }

    // Start typewriter if the element exists
    if (typewriterElement) {
        type();
    }
});

// --- 4. CV Popup Logic (Global functions for HTML onclick) ---
function openCV() {
    document.getElementById('cv-popup').style.display = 'flex';
}

function closeCV() {
    document.getElementById('cv-popup').style.display = 'none';
}

