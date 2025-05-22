function updateProgress(step) {
    document.getElementById('step-choice').classList.remove('active');
    document.getElementById('step-1').classList.remove('active');
    document.getElementById('step-2').classList.remove('active');
    if (step === 'choice') document.getElementById('step-choice').classList.add('active');
    if (step === 'drh' || step === 'emp1') document.getElementById('step-1').classList.add('active');
    if (step === 'emp2') document.getElementById('step-2').classList.add('active');
}

function chooseRole(role) {
    document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
    if (role === 'drh') {
        document.getElementById('drh-form-step').classList.add('active');
        updateProgress('drh');
    } else {
        document.getElementById('employee-form-step1').classList.add('active');
        updateProgress('emp1');
    }
}

function goBackToChoice() {
    document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
    document.getElementById('choice-step').classList.add('active');
    updateProgress('choice');
}

function goToEmployeeStep2() {
    document.getElementById('employee-form-step1').classList.remove('active');
    document.getElementById('employee-form-step2').classList.add('active');
    updateProgress('emp2');
}

function goToEmployeeStep1() {
    document.getElementById('employee-form-step2').classList.remove('active');
    document.getElementById('employee-form-step1').classList.add('active');
    updateProgress('emp1');
}

function setProgress(step) {
    const dots = document.querySelectorAll('.progress-dot');
    dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === step);
    });
}

// Custom select logic (gère tous les custom-selects dynamiquement)
document.querySelectorAll('.custom-select').forEach(function(select) {
    select.addEventListener('click', function(e) {
        e.stopPropagation();
        document.querySelectorAll('.custom-select').forEach(s => {
            if (s !== select) s.classList.remove('open');
        });
        select.classList.toggle('open');
    });
    select.querySelectorAll('.option').forEach(function(option) {
        option.addEventListener('click', function(e) {
            select.querySelector('.selected').textContent = option.textContent;
            // Met à jour le input caché correspondant
            const input = select.parentElement.querySelector('input[type="hidden"]');
            if (input) input.value = option.textContent;
            select.classList.remove('open');
        });
    });
});
document.addEventListener('click', function() {
    document.querySelectorAll('.custom-select').forEach(s => s.classList.remove('open'));
});