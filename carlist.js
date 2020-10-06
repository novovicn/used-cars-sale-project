
/*
AKO neulogovan gledas carlist, ne treba nijedno dugme da se prikazuje, samo da pise LOG IN to buy a car

*/ 

const container = document.getElementsByClassName('container')[0];
const carlist = JSON.parse(localStorage.getItem('cars'));



window.onload = () => {
    document.getElementById('buy__checkout').style.display = 'none';
    renderElements(carlist);
}

if(sessionStorage.getItem('loggedUser') != null){
    var currentUser = JSON.parse(sessionStorage.getItem('loggedUser')).username;
}

async function renderElements(elements){

    container.innerHTML = '';
    
    if(elements != null){
        for ( let i = 0; i < elements.length; i++){
            // console.log(elements[i]);
            // CONDITIONAL RENDERING - owner can delete the post, while other users can buy it
            if(elements[i].owner == currentUser){
                var main_button = "<button class='delete__car'>Delete car </button>"
            }else{
                var main_button = "<button class='buy__car'>Buy this car </button>"
            }
            if(elements[i].sold === true){
                image_url = "https://www.benchmarkrealty.co.nz/wp-content/uploads/2018/06/sold-stamp-3.png";
                if(elements[i].owner !== currentUser){
                    var main_button = ''; // can't be bought anymore, but stll can be deleted by owner!
                }    
            }else{
                image_url = elements[i].imageURL;
            }
            // TODO : sakriti dugme kad je auto vec prodat! ---DONE
            let car = document.createElement('div');
            car.innerHTML = `
            <div class="car__card">
                <img class="carlist__image" src="${image_url}"/>
                <div class="carlist__about">
                    <h2 class='carlist__brand_and_model'>${elements[i].brand}  ${elements[i].model}</h2>
                    <h3>Year: <span class='carlist__year'>${elements[i].year}</span></h3>
                    <h4>Owner:<span class='carlist__owner'>${elements[i].owner}</span></h4>
                    <p class="carlist__vin">${elements[i].VIN}</p>
                    <h1>Price: <span class="carlist__price"> ${elements[i].price}</span>€</h1>
                </div>
                <div class="carlist__buttons">
                    <button class="see__more">More info</button>
                    ${main_button}
                </div>
            </div>
            `
            container.appendChild(car);
            console.log('Uradjeno!');
        }
    }else{
        container.innerHTML= "There aren't any cars for sale at the moment!";
    }

    await addListeners();
        
}


function addListeners(){
    let buy__buttons = document.getElementsByClassName('buy__car');
    let delete__buttons = document.getElementsByClassName('delete__car');
    let more__info__buttons = document.getElementsByClassName('see__more');

    for(let i = 0; i < buy__buttons.length; i++){
        buy__buttons[i].addEventListener('click', addItemToCart);
    }

    for(let i = 0; i < delete__buttons.length; i++){
        delete__buttons[i].addEventListener('click', deleteItem);
    }

    for(let i = 0; i < more__info__buttons.length; i++){
        more__info__buttons[i].addEventListener('click', moreInfo);
    }

}


function addItemToCart(e){

    document.getElementById('carlist').style.display = 'none';
    document.getElementsByClassName('carlist__heading')[0].style.display = 'none';

    document.getElementById('buy__checkout').style.display='block';

    const itemToBuy = e.target.parentNode.parentNode;

    let imageURL = itemToBuy.getElementsByClassName('carlist__image')[0].src;
    let modelInfo = itemToBuy.getElementsByClassName('carlist__brand_and_model')[0].textContent;
    let year = itemToBuy.getElementsByClassName('carlist__year')[0].textContent;
    let owner = itemToBuy.getElementsByClassName('carlist__owner')[0].textContent;
    let vin = itemToBuy.getElementsByClassName('carlist__vin')[0].textContent;
    let price = itemToBuy.getElementsByClassName('carlist__price')[0].textContent;

    let cart = document.getElementById('buy__checkout--table');

    cart.style.display = 'inherit';
    
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
}


function moreInfo(){
    alert('Coming soon! Stay tuned!!');
}



// OVDE BI trebala neka promisa da padne jer nece uvek biti auta na sajtu........


const ApproveBuyBtns = document.getElementsByClassName('buy__approve');
for( let i = 0; i < ApproveBuyBtns.length; i++ ){
    ApproveBuyBtns[i].addEventListener('click', buyACar);
}

function buyACar(e){
    let VIN = e.target.parentNode.children[1].children[1].children[3].textContent; //getting VIN number

    let carsFromLS = JSON.parse(localStorage.getItem('cars'));

    carsFromLS.forEach( car => {
        if( car.VIN === VIN ){
            car.sold = true;
        }
        console.log(car);
    });

    localStorage.setItem('cars', JSON.stringify(carsFromLS));

}

// FILTERING 

const searchByName = document.getElementById('search__brand')
searchByName.addEventListener('input', filterCarsByName);

function filterCarsByName(){

    let filteredCars = carlist.filter( car => {
        if((car.brand.toUpperCase()).indexOf(searchByName.value.trim().toUpperCase()) != -1 
        || (car.model.toUpperCase()).indexOf(searchByName.value.trim().toUpperCase()) != -1){
            return car;
        }
    });
    

    renderElements(filteredCars);

}

const btnSearch = document.getElementById('search__price');
btnSearch.addEventListener('click', filterByPrice);

function filterByPrice(){
    let lowestPrice = document.getElementById('search__price--lowest').value;
    let highestPrice = document.getElementById('search__price--highest').value;

    // RADI ALI NE BI BILO LOSE UBACITI I SORTIRANJE PO CENI ASC I DESC...

    if(highestPrice === ""){
        highestPrice = 99999999999;
    }

    if(lowestPrice === ""){
        lowestPrice = 0;
    }


    let filteredByPrice = carlist.filter( car => {
        if(car.price){  //zrelo za izbacivanje kada napravim da ne moze da se doda auto bez cene
            if(car.price >= parseInt(lowestPrice) && car.price <= parseInt(highestPrice)){
                return car;
            }
        }
            
    });
    renderElements(filteredByPrice);
}

// NAPRAVITI DA OBA SEARCHA VAZE U ISTO VREME AKO JE TO MOGUCE.....
