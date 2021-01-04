
const hamburgerBtn = document.getElementsByClassName('hamburger-btn')[0];
const hamburger = document.getElementsByClassName('hamburger-inside')[0];
const smallNav =  document.getElementsByClassName('small-nav')[0];
const smallNavMenu = document.getElementsByClassName('small-nav-menu')[0];
const navItems = document.getElementsByClassName('small-nav-item');

const addCarContainer = document.getElementsByClassName('add-car-container')[0];
const mainPageContainer = document.getElementsByClassName('.main-container')[0];
let smallNavVisible = false;


hamburgerBtn.addEventListener('click', () => {
    if(!smallNavVisible){
        smallNav.classList.add('open');
        smallNavMenu.classList.add('open');
        hamburger.classList.add('open');
        if(addCarContainer){
            addCarContainer.style.dipslay = 'none';
        }
        if(mainPageContainer){
            mainPageContainer.style.dipslay = 'none';
        }
        
        for(let i = 0; i < navItems.length; i++){
            navItems[i].classList.add('open');
        }
        smallNavVisible = true;
    }else{
        smallNav.classList.remove('open');
        smallNavMenu.classList.remove('open');
        hamburger.classList.remove('open');
        if(addCarContainer){
            addCarContainer.style.dipslay = 'block';
        }
        if(mainPageContainer){
            mainPageContainer.style.dipslay = 'block';
        }
        for(let i = 0; i < navItems.length; i++){
            navItems[i].classList.remove('open');
        }
        // navItems.forEach( item => item.classList.remove('open')); FOR EACH NIGDE NECE DA MI RADI
        smallNavVisible = false;
    }
});
