import { createPlanet3D } from './earth.js';

// Initialiser la planète après le chargement du DOM
document.addEventListener('DOMContentLoaded', createPlanet3D);

// --- KEY FEATURES REVEAL & CIRCLE ROTATION ---
document.addEventListener('DOMContentLoaded', function() {
    const keyFeaturesSection = document.getElementById('features');
    const circleContainer = document.querySelector('.fixed-circle-container');
    const sectionsContainer = document.querySelector('.sections-container');
    const navDots = document.querySelectorAll('.nav-dot');
    const sections = document.querySelectorAll('.section');
    const circleDots = document.querySelectorAll('.circle-dot');
    let currentSection = 0;
    let isAnimating = false;
    let isLocked = false;

    // Fonction pour activer/désactiver le scroll du body
    function lockBodyScroll(lock) {
        if (lock) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }

    // Fonction pour savoir si on est dans la section Key Features
    function isInKeyFeatures() {
        const rect = keyFeaturesSection.getBoundingClientRect();
        return rect.top <= 0 && rect.bottom > window.innerHeight;
    }

    // Gestion du scroll principal
    function onScroll() {
        const rect = keyFeaturesSection.getBoundingClientRect();
        // Si on est dans la section Key Features
        if (rect.top <= 0 && rect.bottom > window.innerHeight) {
            if (!isLocked) {
                lockBodyScroll(true);
                circleContainer.classList.add('fixed');
                isLocked = true;

                // S'assurer que la section actuelle est correctement positionnée
                goToSection(currentSection, false);
            }
        } else {
            // On sort de la section par le haut (scroll up) et on est à la première feature
            if (rect.top > 0 && isLocked && currentSection === 0) {
                lockBodyScroll(false);
                circleContainer.classList.remove('fixed');
                isLocked = false;
            }
            // On sort de la section par le bas (scroll down) et on est à la dernière feature
            else if (rect.bottom <= window.innerHeight && isLocked && currentSection === sections.length - 1) {
                lockBodyScroll(false);
                circleContainer.classList.remove('fixed');
                isLocked = false;
            }
        }
    }

    window.addEventListener('scroll', onScroll);
    window.addEventListener('resize', onScroll);
    onScroll();

    // Gestion du scroll interne dans Key Features
    function goToSection(index, animate = true) {
        if ((isAnimating && animate) || index === currentSection) return;
        if (animate) isAnimating = true;
        currentSection = index;

        // Mettre à jour la position des sections
        sectionsContainer.style.transform = `translateY(-${index * 100}vh)`;

        // Faire tourner le cercle
        const rotation = sections[index].getAttribute('data-rotation');
        document.getElementById('rotating-circle').style.transform = `rotate(${rotation}deg)`;

        // Mettre à jour les indicateurs de navigation
        navDots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });

        // Mettre à jour les dots sur le cercle
        updateActiveDot(index);

        if (animate) {
            setTimeout(() => {
                isAnimating = false;
            }, 700);
        }
    }

    function updateActiveDot(index) {
        // S'assurer que tous les dots sur le cercle sont mis à jour correctement
        circleDots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    }

    // Initialiser les dots du cercle
    function initCircleDots() {
        circleDots.forEach((dot, index) => {
            // S'assurer que chaque dot a le bon attribut data-index
            dot.setAttribute('data-index', index);

            // Ajouter l'événement click sur chaque dot
            dot.addEventListener('click', () => {
                if (!isLocked) return;
                goToSection(index);
            });

            // Activer le premier dot par défaut
            if (index === 0) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    // Appeler cette fonction pour initialiser les dots correctement
    initCircleDots();

    // Navigation par la molette de la souris
    window.addEventListener('wheel', (e) => {
        if (!isLocked) return;
        if (isAnimating) return;

        if (e.deltaY > 0 && currentSection < sections.length - 1) {
            goToSection(currentSection + 1);
        } else if (e.deltaY < 0 && currentSection > 0) {
            goToSection(currentSection - 1);
        } else if (e.deltaY > 0 && currentSection === sections.length - 1) {
            // On sort de la section Key Features vers le bas
            lockBodyScroll(false);
            circleContainer.classList.remove('fixed');
            isLocked = false;
            // Scroll la page juste après la section
            window.scrollTo({ top: keyFeaturesSection.offsetTop + keyFeaturesSection.offsetHeight, behavior: 'smooth' });
        } else if (e.deltaY < 0 && currentSection === 0) {
            // On sort de la section Key Features vers le haut
            lockBodyScroll(false);
            circleContainer.classList.remove('fixed');
            isLocked = false;
            // Scroll la page juste avant la section
            window.scrollTo({ top: keyFeaturesSection.offsetTop - window.innerHeight, behavior: 'smooth' });
        }
    });

    // Navigation par les points de navigation
    navDots.forEach((dot) => {
        dot.addEventListener('click', () => {
            if (!isLocked) return;
            const index = parseInt(dot.getAttribute('data-index'));
            goToSection(index);
        });
    });

    // Navigation par les flèches du clavier
    window.addEventListener('keydown', (e) => {
        if (!isLocked) return;
        if (isAnimating) return;

        if ((e.key === 'ArrowDown' || e.key === 'PageDown') && currentSection < sections.length - 1) {
            goToSection(currentSection + 1);
        } else if ((e.key === 'ArrowUp' || e.key === 'PageUp') && currentSection > 0) {
            goToSection(currentSection - 1);
        }
    });

    // Support pour le toucher mobile (swipe)
    let touchStartY = 0;
    let touchEndY = 0;
    document.addEventListener('touchstart', (e) => {
        if (!isLocked) return;
        touchStartY = e.touches[0].clientY;
    });

    document.addEventListener('touchend', (e) => {
        if (!isLocked) return;
        if (isAnimating) return;

        touchEndY = e.changedTouches[0].clientY;
        const diff = touchStartY - touchEndY;

        if (Math.abs(diff) > 50) {
            if (diff > 0 && currentSection < sections.length - 1) {
                goToSection(currentSection + 1);
            } else if (diff < 0 && currentSection > 0) {
                goToSection(currentSection - 1);
            } else if (diff > 0 && currentSection === sections.length - 1) {
                lockBodyScroll(false);
                circleContainer.classList.remove('fixed');
                isLocked = false;
                window.scrollTo({ top: keyFeaturesSection.offsetTop + keyFeaturesSection.offsetHeight, behavior: 'smooth' });
            } else if (diff < 0 && currentSection === 0) {
                lockBodyScroll(false);
                circleContainer.classList.remove('fixed');
                isLocked = false;
                window.scrollTo({ top: keyFeaturesSection.offsetTop - window.innerHeight, behavior: 'smooth' });
            }
        }
    });
});

// Demo video modal
document.addEventListener('DOMContentLoaded', function() {
    const demoVideoBox = document.getElementById('demoVideoBox');
    const videoModal = document.getElementById('videoModal');
    const closeModal = document.getElementById('closeModal');
    const demoVideo = document.getElementById('demoVideo');

    if (demoVideoBox) {
        demoVideoBox.addEventListener('click', () => {
            videoModal.classList.add('active');
            demoVideo.currentTime = 0;
            demoVideo.play();
        });
    }

    if (closeModal) {
        closeModal.addEventListener('click', () => {
            videoModal.classList.remove('active');
            demoVideo.pause();
        });
    }

    if (videoModal) {
        videoModal.addEventListener('click', (e) => {
            if (e.target === videoModal) {
                videoModal.classList.remove('active');
                demoVideo.pause();
            }
        });
    }
});

// --- Placement des dots sur la grande cercle ---
function placeCircleDots() {
    const circle = document.getElementById('rotating-circle');
    if (!circle) return;

    const dots = circle.querySelectorAll('.circle-dot');
    const dotSize = 17; // doit correspondre à .circle-dot { width: 17px; height: 17px; }
    const R = circle.offsetWidth / 2 - dotSize / 2; // Rayon jusqu'au centre du dot
    const centerX = circle.offsetWidth / 2;
    const centerY = circle.offsetHeight / 2;
    const total = dots.length;

    for (let i = 0; i < total; i++) {
        const angle = (i / total) * 2 * Math.PI - Math.PI / 2; // commence en haut
        const x = centerX + R * Math.cos(angle) - dotSize / 2;
        const y = centerY + R * Math.sin(angle) - dotSize / 2;
        dots[i].style.left = `${x}px`;
        dots[i].style.top = `${y}px`;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    placeCircleDots();

    // Vérifier que les dots sont correctement initialisés dès le départ
    const circleDots = document.querySelectorAll('.circle-dot');
    if (circleDots.length > 0) {
        circleDots[0].classList.add('active');
        for (let i = 1; i < circleDots.length; i++) {
            circleDots[i].classList.remove('active');
        }
    }
});

window.addEventListener('resize', placeCircleDots);