// ========================================
// PAGES
// ========================================

const pages = document.querySelectorAll('.page');

let currentPage = 0;

// ========================================
// SHOW PAGE
// ========================================

function showPage(index){

pages.forEach((page)=>{
page.classList.remove('active');
});

pages[index].classList.add('active');

updateDots();

}

// ========================================
// DOTS
// ========================================

function updateDots(){

pages.forEach((page, pageIndex)=>{

const dots = page.querySelectorAll('.dot');

dots.forEach((dot)=>{
dot.classList.remove('active-dot');
});

if(dots[pageIndex]){
dots[pageIndex].classList.add('active-dot');
}

});

}

// ========================================
// PREMIUM SWIPE LOGIC
// ========================================

let touchStartX = 0;
let touchEndX = 0;

let touchStartY = 0;
let touchEndY = 0;

let isSwiping = false;

// START TOUCH

document.addEventListener(
'touchstart',
(e)=>{

touchStartX =
e.changedTouches[0].screenX;

touchStartY =
e.changedTouches[0].screenY;

isSwiping = true;

},
{ passive:true }
);

// END TOUCH

document.addEventListener(
'touchend',
(e)=>{

if(!isSwiping) return;

touchEndX =
e.changedTouches[0].screenX;

touchEndY =
e.changedTouches[0].screenY;

handleGesture();

isSwiping = false;

},
{ passive:true }
);

// HANDLE SWIPE

function handleGesture(){

const diffX =
touchStartX - touchEndX;

const diffY =
touchStartY - touchEndY;

// IGNORE VERTICAL SCROLL

if(
Math.abs(diffY)
>
Math.abs(diffX)
){

return;

}

// SWIPE LEFT → NEXT PAGE

if(diffX > 60){

goNextPage();

}

// SWIPE RIGHT → PREVIOUS PAGE

if(diffX < -60){

goPrevPage();

}

}

// ========================================
// PAGE FUNCTIONS
// ========================================

function goNextPage(){

if(currentPage < pages.length - 1){

pages[currentPage]
.classList.remove('active');

currentPage++;

pages[currentPage]
.classList.add('active');

updateDots();

animatePageTurn('next');

}

}

function goPrevPage(){

if(currentPage > 0){

pages[currentPage]
.classList.remove('active');

currentPage--;

pages[currentPage]
.classList.add('active');

updateDots();

animatePageTurn('prev');

}

}

}

// ========================================
// PAGE TURN EFFECT
// ========================================

function animatePageTurn(direction){

const current =
pages[currentPage];

if(direction === 'next'){

current.animate(

[
{
transform:
'translateX(100px) scale(.96)',
opacity:.5
},

{
transform:
'translateX(0px) scale(1)',
opacity:1
}
],

{
duration:700,
easing:'cubic-bezier(.77,0,.18,1)'
}

);

}else{

current.animate(

[
{
transform:
'translateX(-100px) scale(.96)',
opacity:.5
},

{
transform:
'translateX(0px) scale(1)',
opacity:1
}
],

{
duration:700,
easing:'cubic-bezier(.77,0,.18,1)'
}

);

}

}

// ========================================
// CLICK NAVIGATION
// ========================================

pages.forEach((page)=>{

page.addEventListener(
'click',
(e)=>{

const tag =
e.target.tagName;

// IGNORE BUTTONS / FORM

if(
tag === 'BUTTON' ||
tag === 'INPUT' ||
tag === 'SELECT' ||
tag === 'OPTION' ||
tag === 'TEXTAREA' ||
tag === 'A' ||
tag === 'IFRAME'
){

return;

}

// RIGHT SIDE → NEXT

if(
e.clientX >
window.innerWidth / 2
){

goNextPage();

}else{

// LEFT SIDE → PREV

goPrevPage();

}

}
);

});

// ========================================
// BUTTON NAVIGATION
// ========================================

document
.querySelectorAll('.next-btn')
.forEach((btn)=>{

btn.addEventListener(
'click',
(e)=>{

e.stopPropagation();

goNextPage();

}
);

});

document
.querySelectorAll('.back-btn')
.forEach((btn)=>{

btn.addEventListener(
'click',
(e)=>{

e.stopPropagation();

goPrevPage();

}
);

});

// ========================================
// KEYBOARD SUPPORT
// ========================================

document.addEventListener('keydown',(e)=>{

// RIGHT

if(e.key === 'ArrowRight'){

if(currentPage < pages.length - 1){

currentPage++;

showPage(currentPage);

}

}

// LEFT

if(e.key === 'ArrowLeft'){

if(currentPage > 0){

currentPage--;

showPage(currentPage);

}

}

});

// ========================================
// COUNTDOWN
// ========================================

const targetDate = new Date(
"August 1, 2026 14:00:00"
).getTime();

function updateCountdown(){

const now = new Date().getTime();

const distance = targetDate - now;

// TIME

const days = Math.floor(
distance / (1000 * 60 * 60 * 24)
);

const hours = Math.floor(
(distance % (1000 * 60 * 60 * 24))
/
(1000 * 60 * 60)
);

const minutes = Math.floor(
(distance % (1000 * 60 * 60))
/
(1000 * 60)
);

// ELEMENTS

const daysElement = document.getElementById('days');

const hoursElement = document.getElementById('hours');

const minutesElement = document.getElementById('minutes');

// INSERT

if(daysElement){

daysElement.innerText =
days < 10 ? "0" + days : days;

}

if(hoursElement){

hoursElement.innerText =
hours < 10 ? "0" + hours : hours;

}

if(minutesElement){

minutesElement.innerText =
minutes < 10 ? "0" + minutes : minutes;

}

// EXPIRED

if(distance < 0){

clearInterval(countdownInterval);

if(daysElement){
daysElement.innerText = "00";
}

if(hoursElement){
hoursElement.innerText = "00";
}

if(minutesElement){
minutesElement.innerText = "00";
}

}

}

// START TIMER

updateCountdown();

const countdownInterval =
setInterval(updateCountdown,1000);

// ========================================
// GUEST NAME FROM URL
// example:
// ?name=Марія
// ========================================

const params = new URLSearchParams(window.location.search);

const guestName = params.get('name');

const guestTitle =
document.querySelector('.guest-name');

const guestInput =
document.querySelector('input[name="name"]');

if(guestName){

const formattedName =
guestName.replace(/\+/g,' ');

if(guestTitle){
guestTitle.innerText = formattedName;
}

if(guestInput){
guestInput.value = formattedName;
}

}

// ========================================
// RSVP FORM
// ========================================

const form =
document.getElementById('rsvp-form');

if(form){

form.addEventListener('submit',async(e)=>{

e.preventDefault();

// BUTTON

const submitButton =
form.querySelector('button');

const originalText =
submitButton.innerText;

submitButton.innerText =
'Надсилання...';

submitButton.disabled = true;

try{

const response = await fetch(
form.action,
{
method:'POST',
body:new FormData(form),
headers:{
'Accept':'application/json'
}
}
);

// SUCCESS

if(response.ok){

form.innerHTML = `

<div style="
padding:40px 20px;
text-align:center;
">

<h2 style="
margin-bottom:20px;
">
Дякуємо ♥
</h2>

<p class="text">
Вашу відповідь успішно надіслано.
</p>

</div>

`;

}else{

alert(
'Помилка надсилання форми'
);

submitButton.innerText =
originalText;

submitButton.disabled = false;

}

}catch(error){

alert(
'Немає зʼєднання з інтернетом'
);

submitButton.innerText =
originalText;

submitButton.disabled = false;

}

});

}

// ========================================
// INITIAL PAGE
// ========================================

showPage(currentPage);

// Replace hearts
document.querySelectorAll('.heart').forEach(el=>{
  el.innerHTML = Illustrations.heart;
});

// Replace mini dividers
document.querySelectorAll('.mini-divider').forEach(el=>{
  el.innerHTML = Illustrations.divider;
});
