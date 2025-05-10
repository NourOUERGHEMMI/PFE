// Newsletter form
const newsletterForm = document.getElementById('newsletterForm');
const newsletterEmail = document.getElementById('newsletterEmail');
const newsletterMsg = document.getElementById('newsletterMsg');
newsletterForm.addEventListener('submit', function(e) {
    e.preventDefault();
    if (newsletterEmail.value && newsletterEmail.value.includes('@')) {
        newsletterMsg.textContent = "Thank you for subscribing!";
        newsletterEmail.value = '';
    } else {
        newsletterMsg.textContent = "Please enter a valid email.";
    }
    setTimeout(() => {
        newsletterMsg.textContent = '';
    }, 3000);
});

// Animated counters for stats
function animateCounter(el, target, duration = 1200) {
    let start = 0;
    let startTime = null;

    function updateCounter(ts) {
        if (!startTime) startTime = ts;
        const progress = Math.min((ts - startTime) / duration, 1);
        el.textContent = Math.floor(progress * (target - start) + start);
        if (progress < 1) requestAnimationFrame(updateCounter);
        else el.textContent = target.toLocaleString();
    }
    requestAnimationFrame(updateCounter);
}
document.querySelectorAll('.stat-number').forEach(el => {
    const target = parseInt(el.getAttribute('data-count'), 10);
    animateCounter(el, target);
});