mybutton = document.getElementById("myBtn");

window.onscroll = function () { scrollFunction() };

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
}

function topFunction() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}

// BUTTON MENU
let navMenuContainer = document.querySelector('.navMenuContainer')
let navMenuButton = document.querySelector('.navMenuButton')

navMenuButton.addEventListener('click', () => {
  navMenuContainer.classList.toggle('navMenuAction')
})


// SCROLL TO TOP BUTTON