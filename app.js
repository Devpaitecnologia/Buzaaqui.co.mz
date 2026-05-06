

const menuBtn = document.getElementById('menuBtn');
const menu = document.getElementById('menu');
const overlay = document.getElementById('overlay');

function toggleMenu() {
  menuBtn.classList.toggle('active');
  menu.classList.toggle('active');
  overlay.classList.toggle('active');
}

menuBtn.addEventListener('click', toggleMenu);
overlay.addEventListener('click', toggleMenu);

// Fecha ao clicar num link
document.querySelectorAll('.menu a').forEach(link => {
  link.addEventListener('click', toggleMenu);
});


// deslizar header


const header = document.getElementById('header');
//let lastScroll = 0;

let lastScroll = 0;
let ticking = false;

function updateHeader() {
  const currentScroll = window.pageYOffset;
  
  if (currentScroll <= 0) {
    header.classList.remove('hide');
  } else if (currentScroll > lastScroll && currentScroll > 100) {
    header.classList.add('hide');
  } else {
    header.classList.remove('hide');
  }
  
  lastScroll = currentScroll;
  ticking = false;
}

window.addEventListener('scroll', () => {
  if (!ticking) {
    window.requestAnimationFrame(updateHeader);
    ticking = true;
  }
});

// add 

const addBtn = document.getElementById('addBtn');
const postt = document.getElementById('post');
  
const tudo = document.querySelector('.tudo');
  
addBtn.addEventListener('click', function(){
  postt.classList.toggle('active');
  tudo.classList.toggle('active');
})

//home
function  home(){
  document.querySelector('.sobre').style.display = "none";
  document.querySelector('.tudo').style.display = "flex";

}

//sobre
function  sobre(){
  document.querySelector('.sobre').style.display = "block";
  document.querySelector('.tudo').style.display = "none";

}
