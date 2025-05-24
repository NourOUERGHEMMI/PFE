document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.role-btn-circle');
    const userChoiceInput = document.getElementById('userChoice');

    buttons.forEach(button => {
        button.addEventListener('click', function() {
            const choice = this.getAttribute('data-value');
            userChoiceInput.value = choice;

            document.getElementById('step-1').classList.remove('active');
            document.getElementById('step-1').style.display = 'none';

            document.getElementById('step-2').classList.add('active');
            document.getElementById('step-2').style.display = 'block';
        });
    });

    window.goBackToChoice = function() {
        document.getElementById('step-2').classList.remove('active');
        document.getElementById('step-2').style.display = 'none';

        document.getElementById('step-1').classList.add('active');
        document.getElementById('step-1').style.display = 'block';
    };

    window.goBackToPersonalInfo = function() {
        document.getElementById('step-3').classList.remove('active');
        document.getElementById('step-3').style.display = 'none';

        document.getElementById('step-2').classList.add('active');
        document.getElementById('step-2').style.display = 'block';
    };

    window.goToNextStep = function() {
        const choice = userChoiceInput.value;

        if (choice === 'employee') {
            document.getElementById('step-2').classList.remove('active');
            document.getElementById('step-2').style.display = 'none';

            document.getElementById('step-3').classList.add('active');
            document.getElementById('step-3').style.display = 'block';
        } else {
            // Si c'est un RH, on soumet directement le formulaire
            document.getElementById('multiStepForm').submit();
        }
    };
});