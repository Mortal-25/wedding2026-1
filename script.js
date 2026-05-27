const pages = document.querySelectorAll('.page');
const dots = document.querySelectorAll('.dot');
let currentPage = 0;
let isAnimating = false;

function render() {
    pages.forEach((page, index) => {
        if (index === currentPage) {
            page.classList.add('active');
        } else {
            page.classList.remove('active');
        }
    });

    // Обновляем точки навигации
    dots.forEach((dot, index) => {
        if (index === currentPage) {
            dot.classList.add('active-dot');
        } else {
            dot.classList.remove('active-dot');
        }
    });

    // Сбрасываем внутренний скролл страницы наверх при перелистывании
    const activePage = document.querySelector('.page.active');
    if (activePage) activePage.scrollTop = 0;
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

// КЛИКИ ПО СТРЕЛОЧКАМ
document.querySelector('.next-btn')?.addEventListener('click', (e) => { e.stopPropagation(); goNextPage(); });
document.querySelector('.back-btn')?.addEventListener('click', (e) => { e.stopPropagation(); goPrevPage(); });

// СВАЙПЫ ДЛЯ СМАРТФОНОВ
let startX = 0;
let startY = 0;

document.addEventListener('touchstart', (e) => {
    startX = e.changedTouches[0].screenX;
    startY = e.changedTouches[0].screenY;
}, { passive: true });

document.addEventListener('touchend', (e) => {
    const endX = e.changedTouches[0].screenX;
    const endY = e.changedTouches[0].screenY;

    const diffX = startX - endX;
    const diffY = startY - endY;

    // Если движение было больше по вертикали (скролл внутри страницы), игнорируем свайп книги
    if (Math.abs(diffY) > Math.abs(diffX)) return;
    if (Math.abs(diffX) < 50) return; // Минимальное расстояние для свайпа

    if (diffX > 0) goNextPage();
    else goPrevPage();
}, { passive: true });

// НАВИГАЦИЯ КЛАВИАТУРОЙ С ПК
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') goNextPage();
    if (e.key === 'ArrowLeft') goPrevPage();
});

// КЛИКИ ПО БОКОВЫМ ОБЛАСТЯМ ЭКРАНА (Исключая интерактивные элементы)
pages.forEach(page => {
    page.addEventListener('click', (e) => {
        const tag = e.target.tagName;
        if (['BUTTON', 'INPUT', 'SELECT', 'OPTION', 'A', 'IFRAME'].includes(tag)) return;
        if (e.target.closest('form') || e.target.closest('.nav-buttons')) return;

        if (e.clientX > window.innerWidth / 2) {
            goNextPage();
        } else {
            goPrevPage();
        }
    });
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
    const minutes = Math.floor((distance / (1000 * 60)) % 60);

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
        const btn = form.querySelector('button');
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
