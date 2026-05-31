const pages = document.querySelectorAll('.page, section');
let currentPage = 0;
let isAnimating = false;

function render() {
    pages.forEach((page, index) => {
        if (index === currentPage) {
            page.classList.add('active');
            page.scrollTop = 0; 
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

// Навигация кнопками
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

// Навигация стрелочками клавиатуры на ПК
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') goNextPage();
    if (e.key === 'ArrowLeft') goPrevPage();
});

// ТАЙМЕР ОБРАТНОГО ОТСЧЕТА (Раздельный разбор даты специально для iOS Safari)
function updateCountdown() {
    // Явно задаем компоненты даты, чтобы ни один браузер не запутался в форматах
    const target = new Date(2026, 7, 1, 14, 0, 0).getTime(); // 7 — это август (отсчет с 0)
    const now = new Date().getTime();
    const distance = target - now;

    const dEl = document.getElementById('days');
    const hEl = document.getElementById('hours');
    const mEl = document.getElementById('minutes');
    const sEl = document.getElementById('seconds'); // Добавили секунды для динамики

    if (distance <= 0) {
        if (dEl) dEl.textContent = "00";
        if (hEl) hEl.textContent = "00";
        if (mEl) mEl.textContent = "00";
        if (sEl) sEl.textContent = "00";
        return;
    }

    // Правильный расчет временных промежутков
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((distance / (1000 * 60)) % 60); // Было: (distance / (1000 * 60 * 60)) % 60
    const seconds = Math.floor((distance / 1000) % 60);       // Высчитываем остаток секунд

    if (dEl) dEl.textContent = days < 10 ? "0" + days : days;
    if (hEl) hEl.textContent = hours < 10 ? "0" + hours : hours;
    if (mEl) mEl.textContent = minutes < 10 ? "0" + minutes : minutes;
    if (sEl) sEl.textContent = seconds < 10 ? "0" + seconds : seconds;
}
// Запускаем таймер сразу и ставим интервал
updateCountdown();
setInterval(updateCountdown, 1000);

/// ИМЯ ИЗ ССЫЛКИ И ДИНАМИЧЕСКОЕ ОБРАЩЕНИЕ
const params = new URLSearchParams(window.location.search);
const guestName = params.get('name');
const gender = params.get('g'); // 'm' - он, 'f' - она, 'p' - они/семья

if (guestName) {
    const formatted = guestName.replace(/\+/g, ' ');
    
    // Подставляем имя во вторую строку
    const nameEl = document.getElementById('guest-target-name');
    if (nameEl) nameEl.innerText = formatted;
    
    // Меняем обращение в первой строке в зависимости от &g=
    const greetingEl = document.getElementById('greeting-type');
    if (greetingEl) {
        if (gender === 'm') {
            greetingEl.innerText = 'Шановний';
        } else if (gender === 'f') {
            greetingEl.innerText = 'Шановна';
        } else if (gender === 'p') {
            greetingEl.innerText = 'Шановні';
        } else {
            greetingEl.innerText = 'Шановні'; // Если параметр &g= забыли указать
        }
    }

    // Автозаполнение имени в скрытом инпуте формы RSVP (чтобы в таблицу уходило имя)
    const input = document.querySelector('input[name="name"]');
    if (input) input.value = formatted;
}

// ОТПРАВКА RSVP
const form = document.getElementById('rsvp-form');
if (form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = form.querySelector('.submit-btn') || form.querySelector('button[type="submit"]');
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

// Запуск стартового состояния страницы
render();
