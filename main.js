


const hamburger = document.getElementsByClassName('hamburger')[0];
const smallNav =  document.getElementsByClassName('small-nav')[0];
let smallNavVisible = false;


hamburger.addEventListener('click', () => {
    if(!smallNavVisible){
        smallNav.setAttribute('class', 'small-nav-visible');
        smallNavVisible = !smallNavVisible;
    }else{
        smallNav.setAttribute('class', 'small-nav');
        smallNavVisible = !smallNavVisible;
    }
});