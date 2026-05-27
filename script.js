// ========================================
// STATE
// ========================================

const pages = document.querySelectorAll('.page');
const dots = document.querySelectorAll('.dot');

let currentPage = 0;
let isAnimating = false;

// ========================================
// RENDER SYSTEM
// ========================================

function render(direction = 'next') {

    pages.forEach(p => p.classList.remove('active'));
    pages[currentPage].classList.add('active');

    updateDots();

    animatePageTurn(direction);
}

// ========================================
// DOTS
// ========================================

function updateDots() {

    dots.forEach(d => d.classList.remove('active-dot'));

    if (dots[currentPage]) {
        dots[currentPage].classList.add('active-dot');
    }
}

// ========================================
// NAVIGATION CORE
// ========================================

function setPage(index, direction = 'next') {

    if (index < 0 || index >= pages.length) return;

    if (isAnimating) return;
    isAnimating = true;

    currentPage = index;
    render(direction);

    setTimeout(() => {
        isAnimating = false;
    }, 800);
}

function goNextPage() {
    setPage(currentPage + 1, 'next');
}

function goPrevPage() {
    setPage(currentPage - 1, 'prev');
}

// ========================================
// PAGE ANIMATION
// ========================================

function animatePageTurn(direction) {

    const page = pages[currentPage];

    if (!page) return;

    const fromX = direction === 'next' ? 80 : -80;

    page.animate([
        {
            transform: `translateX(${fromX}px) scale(.97)`,
            opacity: 0.6
        },
        {
            transform: 'translateX(0px) scale(1)',
            opacity: 1
        }
    ], {
        duration: 700,
        easing: 'cubic-bezier(.77,0,.18,1)'
    });
}

// ========================================
// SWIPE (FIXED)
// ========================================

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

    if (Math.abs(diffY) > Math.abs(diffX)) return;

    if (Math.abs(diffX) < 60) return;

    if (diffX > 0) goNextPage();
    else goPrevPage();

}, { passive: true });

// ========================================
// CLICK NAVIGATION
// ========================================

pages.forEach(page => {

    page.addEventListener('click', (e) => {

        const tag = e.target.tagName;

        if (
            ['BUTTON', 'INPUT', 'SELECT', 'OPTION', 'TEXTAREA', 'A', 'IFRAME'].includes(tag)
        ) return;

        if (e.clientX > window.innerWidth / 2) {
            goNextPage();
        } else {
            goPrevPage();
        }

    });

});

// ========================================
// BUTTONS
// ========================================

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

// ========================================
// KEYBOARD
// ========================================

document.addEventListener('keydown', (e) => {

    if (e.key === 'ArrowRight') goNextPage();
    if (e.key === 'ArrowLeft') goPrevPage();

});

// ========================================
// COUNTDOWN (FIXED)
// ========================================

const targetDate = new Date("August 1, 2026 14:00:00").getTime();

function updateCountdown() {

    const now = Date.now();
    const distance = targetDate - now;

    if (distance <= 0) {
        document.getElementById('days').innerText = "00";
        document.getElementById('hours').innerText = "00";
        document.getElementById('minutes').innerText = "00";
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

updateCountdown();
setInterval(updateCountdown, 1000);

// ========================================
// URL NAME
// ========================================

const params = new URLSearchParams(window.location.search);
const guestName = params.get('name');

if (guestName) {

    const formatted = guestName.replace(/\+/g, ' ');

    const title = document.querySelector('.guest-name');
    if (title) title.innerText = formatted;

    const input = document.querySelector('input[name="name"]');
    if (input) input.value = formatted;
}

// ========================================
// FORM (FIXED SAFE VERSION)
// ========================================

const form = document.getElementById('rsvp-form');

if (form) {

    form.addEventListener('submit', async (e) => {

        e.preventDefault();

        const btn = form.querySelector('button');
        const old = btn.innerText;

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

            } else {
                throw new Error();
            }

        } catch (err) {

            alert("Помилка надсилання форми");

            btn.innerText = old;
            btn.disabled = false;
        }
    });
}

// ========================================
// INITIALIZE
// ========================================

render();

// ========================================
// SAFE ILLUSTRATIONS
// ========================================

if (window.Illustrations) {

    document.querySelectorAll('.heart').forEach(el => {
        el.innerHTML = Illustrations.heart;
    });

    document.querySelectorAll('.mini-divider').forEach(el => {
        el.innerHTML = Illustrations.divider;
    });

}
