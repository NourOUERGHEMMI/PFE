document.addEventListener('DOMContentLoaded', function () {
    const buttons = document.querySelectorAll('.role-btn-circle');
    const userChoiceInput = document.getElementById('userChoice');

    buttons.forEach(button => {
        button.addEventListener('click', function () {
            const choice = this.getAttribute('data-value');
            userChoiceInput.value = choice;

            document.getElementById('step-1').classList.remove('active');
            document.getElementById('step-1').style.display = 'none';

            document.getElementById('step-2').classList.add('active');
            document.getElementById('step-2').style.display = 'block';
        });
    });

    window.goBackToChoice = function () {
        document.getElementById('step-2').classList.remove('active');
        document.getElementById('step-2').style.display = 'none';

        document.getElementById('step-1').classList.add('active');
        document.getElementById('step-1').style.display = 'block';
    };
});