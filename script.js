const pages = document.querySelectorAll('.page');
let currentPage = 0;
let isAnimating = false;

function render() {
    pages.forEach((page, index) => {
        if (index === currentPage) {
            page.classList.add('active');
            page.scrollTop = 0; // Сбрасываем скролл наверх при открытии новой страницы
        } else {
            page.classList.remove('active');
        }
    });
}

function setPage(index) {
    if (index < 0 || index >= pages.length) return;
    if (isAnimating) return;

    isAnimating = true;
    currentPage = index;
    render();

    setTimeout(() => {
        isAnimating = false;
    }, 400);
}

function goNextPage() { setPage(currentPage + 1); }
function goPrevPage() { setPage(currentPage - 1); }

// КЛИКИ ПО КНОПКАМ НАВИГАЦИИ (Назначаем на все существующие стрелочки)
document.querySelectorAll('.next-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        goNextPage();
    });
});

document.querySelectorAll('.back-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        goPrevPage();
    });
});

// НАВИГАЦИЯ КЛАВИАТУРОЙ С ПК (Оставляем для удобства)
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') goNextPage();
    if (e.key === 'ArrowLeft') goPrevPage();
});

// ТАЙМЕР ОБРАТНОГО ОТСЧЕТА
const targetDate = new Date("August 1, 2026 14:00:00").getTime();

function updateCountdown() {
    const now = Date.now();
    const distance = targetDate - now;

    if (distance <= 0) {
        if(document.getElementById('days')) document.getElementById('days').innerText = "00";
        if(document.getElementById('hours')) document.getElementById('hours').innerText = "00";
        if(document.getElementById('minutes')) document.getElementById('minutes').innerText = "00";
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((distance / (1000 * 60 * 60)) % 60);

    const set = (id, value) => {
        const el = document.getElementById(id);
        if (el) el.innerText = value < 10 ? "0" + value : value;
    };

    set('days', days);
    set('hours', hours);
    set('minutes', minutes);
}
setInterval(updateCountdown, 1000);
updateCountdown();

// ИМЯ ИЗ ССЫЛКИ
const params = new URLSearchParams(window.location.search);
const guestName = params.get('name');
if (guestName) {
    const formatted = guestName.replace(/\+/g, ' ');
    const title = document.querySelector('.guest-name');
    if (title) title.innerText = formatted;
    const input = document.querySelector('input[name="name"]');
    if (input) input.value = formatted;
}

// ОТПРАВКА RSVP
const form = document.getElementById('rsvp-form');
if (form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = form.querySelector('.submit-btn');
        const oldText = btn.innerText;
        btn.innerText = "Надсилання...";
        btn.disabled = true;

        try {
            const res = await fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
                headers: { 'Accept': 'application/json' }
            });
            if (res.ok) {
                form.style.display = "none";
                const msg = document.getElementById('success-message');
                if (msg) msg.style.display = "block";
            } else { throw new Error(); }
        } catch (err) {
            alert("Помилка надсилання форми");
            btn.innerText = oldText;
            btn.disabled = false;
        }
    });
}

// Запуск стартового состояния
render();
