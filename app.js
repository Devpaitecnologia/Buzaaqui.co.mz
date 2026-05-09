

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
document.querySelector('.perfil').style.display = "none";

}

//sobre
function  sobre(){
  document.querySelector('.sobre').style.display = "block";
  document.querySelector('.tudo').style.display = "none";
document.querySelector('.perfil').style.display = "none";

}
//sobre
function  perfil(){
  document.querySelector('.sobre').style.display = "none";
  document.querySelector('.tudo').style.display = "none";
document.querySelector('.perfil').style.display = "block";
  
}




document.getElementById('botao2').addEventListener('click', function() {
  console.log('Clicou no botão 1');
  
  // Dispara o clique do botão 2 automaticamente
  document.getElementById('imageInput').click();
});

/*document.getElementById('imageInput').addEventListener('click', function() {
  console.log('Botão 2 foi clicado automaticamente');
  //alert('Botão 2 ativado!');
});
*/