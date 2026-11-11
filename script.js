
const password = document.getElementById('password');

const bar = document.getElementById('bar');
const strength = document.getElementById('strength');
const scoreText = document.getElementById('score');
const lengthText = document.getElementById('length');
const advice = document.getElementById('advice');
const toggle = document.getElementById('toggle');

// Show and hide password
toggle.addEventListener('click', () => {

    const showing = password.type === 'text';

    password.type = showing ? 'password' : 'text';

    toggle.textContent = showing ? 'SHOW' : 'HIDE';

});

// Update checklist
function updateCheck(id, passed) {

    document.getElementById(id)
        .classList.toggle('pass', passed);

}

// Password analysis
function analyze(value) {

    const tests = {

        length: value.length >= 12,

        upper: /[a-z]/.test(value) &&
               /[A-Z]/.test(value),

        number: /\d/.test(value),

        symbol: /[^A-Za-z0-9]/.test(value),

        repeat: value.length > 0 &&
                !/(.)\1{2,}/.test(value)

    };

    updateCheck('c-length', tests.length);
    updateCheck('c-upper', tests.upper);
    updateCheck('c-number', tests.number);
    updateCheck('c-symbol', tests.symbol);
    updateCheck('c-repeat', tests.repeat);

    // Calculate password score
    let score = 0;

    if (value.length >= 8) score += 15;
    if (value.length >= 12) score += 15;
    if (value.length >= 16) score += 10;

    if (/[a-z]/.test(value)) score += 10;
    if (/[A-Z]/.test(value)) score += 10;
    if (/\d/.test(value)) score += 10;
    if (/[^A-Za-z0-9]/.test(value)) score += 15;

    if (new Set(value).size >= 8) score += 10;

    if (value && !/(.)\1{2,}/.test(value))
        score += 5;

    // Detect common password patterns
    if (/password|123456|qwerty|admin/i.test(value)) {
        score = Math.min(score, 25);
    }

    score = Math.min(score, 100);

    // Classify strength
    let label = 'WEAK';
    let color = '#ff657a';

    if (score >= 75) {
        label = 'STRONG';
        color = '#53e0d0';
    }
    else if (score >= 45) {
        label = 'MEDIUM';
        color = '#ffc66d';
    }

    strength.textContent = value ? label : 'WAITING';

    strength.style.color = value ? color : '';

    bar.style.width = `${score}%`;

    bar.style.background = color;

    scoreText.textContent = `Score: ${score} / 100`;

    lengthText.textContent =
        `${value.length} characters`;

    // Security suggestions
    const tips = [];

    if (!tests.length)
        tips.push('use at least 12 characters');

    if (!tests.upper)
        tips.push('mix uppercase and lowercase letters');

    if (!tests.number)
        tips.push('add a number');

    if (!tests.symbol)
        tips.push('include a special character');

    if (!tests.repeat)
        tips.push('avoid long repeated-character runs');

    if (/password|123456|qwerty|admin/i.test(value))
        tips.push('avoid common words and patterns');

    if (!value) {
        advice.textContent =
            'Start typing to receive security recommendations.';
    }
    else if (tips.length) {
        advice.textContent =
            `Improve it: ${tips.join('; ')}.`;
    }
    else {
        advice.textContent =
            'Good work! Keep this password unique to one account and consider using a password manager.';
    }

}

// Check password whenever user types
password.addEventListener('input', () => {
    analyze(password.value);
});
