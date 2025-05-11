// Smooth scroll for nav links
document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href.startsWith('#')) {
            e.preventDefault();
            document.querySelector(href).scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});
// --- BURGER MENU ---
const burger = document.getElementById('burgerMenu');
const nav = document.getElementById('mainNav');
burger.addEventListener('click', () => {
    nav.classList.toggle('active');
    burger.classList.toggle('active');
});
// Fermer le menu si on clique sur un lien (mobile)
document.querySelectorAll('#mainNav a').forEach(link => {
    link.addEventListener('click', () => {
        nav.classList.remove('active');
        burger.classList.remove('active');
    });
});

// Sélecteur de langue (menu déroulant)
const langBtn = document.getElementById('langBtn');
const langMenu = document.getElementById('langMenu');
langBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    langMenu.style.display = langMenu.style.display === 'block' ? 'none' : 'block';
});
document.addEventListener('click', () => {
    langMenu.style.display = 'none';
});
langMenu.querySelectorAll('.lang-option').forEach(opt => {
    opt.addEventListener('click', (e) => {
        const lang = e.target.getAttribute('data-lang');
        // Ici tu peux ajouter la logique de changement de langue
        alert('Langue changée : ' + lang);
        langMenu.style.display = 'none';
    });
});

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', function() {
        document.querySelectorAll('.nav-links a').forEach(l => l.classList.remove('active'));
        this.classList.add('active');
    });
});