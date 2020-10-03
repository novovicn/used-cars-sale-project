
const container = document.getElementsByClassName('container')[0];


const carlist = JSON.parse(localStorage.getItem('cars'));

if(sessionStorage.getItem('loggedUser') != null){
    var currentUser = JSON.parse(sessionStorage.getItem('loggedUser')).username;
}

if(carlist !== null){
    for ( let i = 0; i < carlist.length; i++){

        // CONDITIONAL RENDERING - owner can delete the post, while other users can buy it
        if(carlist[i].owner == currentUser){
            var main_button = "<button class='delete__car'>Delete car </button>"
        }else{
            var main_button = "<button class='buy__car'>Buy this car </button>"
        }

        let car = document.createElement('div');
        car.innerHTML = `
        <div class="car__card">
        <img class="carlist__image" src="${carlist[i].imageURL}"/>
        <h1>${carlist[i].brand}</h1>
        <h2>${carlist[i].model}</h2>
        <h3>${carlist[i].year}</h3>
        <h4>Owner:${carlist[i].owner}</h4>
        <button class="see__more">More info</button>
        ${main_button}
        </div>
        `
        container.appendChild(car);
    }
}else{
    container.innerHTML= "There aren't any cars for sale at the moment!";
}


// ne znam zasto ne izbacuje gresku ispod kada nema nijednog dugmeta sa klasom buy__car onda kada je sve prazno..

const buy__buttons = document.getElementsByClassName('buy__car');


for( let i = 0; i < buy__buttons.length; i++){
    buy__buttons[i].addEventListener('click', addItemToCart);
}

const delete__buttons = document.getElementsByClassName('delete__car');

for(let i = 0; i < delete__buttons.length; i++){
    delete__buttons[i].addEventListener('click', deleteItem);
}




function addItemToCart(){
    alert('Item added to cart');

    // code here to add item to cart...
}

function deleteItem(){
    alert('are you sure you want to delete this item?');

    // code here to delete item...
}
// OVDE BI trebala neka promisa da padne jer nece uvek biti auta na sajtu........