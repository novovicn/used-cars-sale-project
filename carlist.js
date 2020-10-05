
/*
AKO neulogovan gledas carlist, ne treba nijedno dugme da se prikazuje, samo da pise LOG IN to buy a car

*/ 
window.onload = () => {
    document.getElementById('buy__checkout').style.display = 'none';
}



const container = document.getElementsByClassName('container')[0];



const carlist = JSON.parse(localStorage.getItem('cars'));

if(sessionStorage.getItem('loggedUser') != null){
    var currentUser = JSON.parse(sessionStorage.getItem('loggedUser')).username;
}

if(carlist !== null){
    for ( let i = 0; i < carlist.length; i++){

        console.log(carlist[i]);

        // CONDITIONAL RENDERING - owner can delete the post, while other users can buy it
        if(carlist[i].owner == currentUser){
            var main_button = "<button class='delete__car'>Delete car </button>"
        }else{
            var main_button = "<button class='buy__car'>Buy this car </button>"
        }

        if(carlist[i].sold === true){
            image_url = "https://www.benchmarkrealty.co.nz/wp-content/uploads/2018/06/sold-stamp-3.png";
            if(carlist[i].owner !== currentUser){
                var main_button = ''; // can't be bought anymore, but stll can be deleted by owner!
            }
            
        }else{
            image_url = carlist[i].imageURL;
        }

        // TODO : sakriti dugme kad je auto vec prodat!
        

        let car = document.createElement('div');
        car.innerHTML = `
        <div class="car__card">
            <img class="carlist__image" src="${image_url}"/>
            <div class="carlist__about">
                <h2 class='carlist__brand_and_model'>${carlist[i].brand}  ${carlist[i].model}</h2>
                <h3 class='carlist__year'>${carlist[i].year}</h3>
                <h4 class='carlist__owner'>Owner:${carlist[i].owner}</h4>
                <p class="carlist__vin">${carlist[i].VIN}</p>
                <h1 class="carlist__price">${carlist[i].price}</h1>
            </div>
            <div class="carlist__buttons">
                <button class="see__more">More info</button>
                ${main_button}
            </div>
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




function addItemToCart(e){


    document.getElementsByClassName('container')[0].style.display = 'none';
    document.getElementsByClassName('carlist__heading')[0].style.display = 'none';

    document.getElementById('buy__checkout').style.display='block';

    // TODO: Ako je item u cart vec, ne moze dvaput da se unese, mada najbolje je da se odradi negde drugo 
    // jer nije ovo obican cart gde stavljas 5 elemenata
    const itemToBuy = e.target.parentNode.parentNode;
    // console.log(itemToBuy);

    let imageURL = itemToBuy.getElementsByClassName('carlist__image')[0].src;
    let modelInfo = itemToBuy.getElementsByClassName('carlist__brand_and_model')[0].textContent;
    let year = itemToBuy.getElementsByClassName('carlist__year')[0].textContent;
    let owner = itemToBuy.getElementsByClassName('carlist__owner')[0].textContent;
    let vin = itemToBuy.getElementsByClassName('carlist__vin')[0].textContent;
    let price = itemToBuy.getElementsByClassName('carlist__price')[0].textContent;

    let cart = document.getElementById('buy__checkout--table');

    cart.style.display = 'block';
    
    let cart_row = document.createElement('tr');

    cart_row.innerHTML = `
        <td><img src="${imageURL}"></img></td>
        <td>${modelInfo}</td>
        <td>${year}</td>
        <td>${vin}</td>
        <td>${price}</td>
    `
    cart.appendChild(cart_row);


    // code here to add item to cart...
}

function deleteItem(e){

    let deleteVin = e.target.parentNode.parentNode.children[1].children[3].textContent; //mozda postoji laksi nacin da se do ovoga dodje

    let stored_cars = JSON.parse(localStorage.getItem('cars'));

    stored_cars.forEach(( car, index ) => {
        if(car.VIN == deleteVin){
            stored_cars.splice( index, 1 );
        }
    });

    localStorage.setItem('cars', JSON.stringify(stored_cars));
    window.location.reload();

    
    // mora da postoji laksi nacin za dohvatiti

    // e.target.parentNode.parentNode.remove(); // deleting item from UI


    // code here to delete item...
}
// OVDE BI trebala neka promisa da padne jer nece uvek biti auta na sajtu........


const ApproveBuyBtns = document.getElementsByClassName('buy__approve');

for( let i = 0; i < ApproveBuyBtns.length; i++ ){
    ApproveBuyBtns[i].addEventListener('click', buyACar);
}


function buyACar(e){
    let VIN = e.target.parentNode.children[1].children[1].children[3].textContent; //getting VIN number

    let carsFromLS = JSON.parse(localStorage.getItem('cars'));

    // USPEO SAM DA PREBACIM AUTO SOLD SA FALSE NA TRUE !!!

    carsFromLS.forEach( car => {
        if( car.VIN === VIN ){
            car.sold = true;
        }
        console.log(car);
    });

    localStorage.setItem('cars', JSON.stringify(carsFromLS));

}