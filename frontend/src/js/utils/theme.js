const themeSwitch = document.getElementById('switcherTheme');
const themeText = document.getElementById('themeText');
const body = document.body;

const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    body.classList.add('dark-theme');
    themeSwitch.checked = true;
    themeText.textContent = 'Темная тема';
}

themeSwitch.addEventListener('change', function () {
    if (themeSwitch.checked) {
        body.classList.add('dark-theme');
        localStorage.setItem('theme', 'dark');
        themeText.textContent = 'Темная тема';
    } else {
        body.classList.remove('dark-theme');
        localStorage.setItem('theme', 'light');
        themeText.textContent = 'Светлая тема';
    }
});