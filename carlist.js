
/*
AKO neulogovan gledas carlist, ne treba nijedno dugme da se prikazuje, samo da pise LOG IN to buy a car --d o n e

*/ 

const container = document.getElementsByClassName('container')[0];
const carlist = JSON.parse(localStorage.getItem('cars'));
const buyCheckout = document.getElementById('buy__checkout');
const moreInfoSection = document.getElementsByClassName('more__info__section')[0];



window.onload = () => {
    buyCheckout.style.display = 'none';
    moreInfoSection.style.display = 'none';
    renderElements(carlist);
}

if(sessionStorage.getItem('loggedUser') != null){
    var currentUser = JSON.parse(sessionStorage.getItem('loggedUser')).username;
}

async function renderElements(elements){

    container.innerHTML = '';
    
    if(elements != null){

        // newest first
        for(let i = 0; i < elements.length -1; i++){
            for( let j = i+1; j < elements.length; j++){
                if(elements[i].created_at < elements[j].created_at){
                    let temp = elements[i];
                    elements[i] = elements[j];
                    elements[j] = temp;
                }
            }
        }

        for ( let i = 0; i < elements.length; i++){
            // console.log(elements[i]);
            // CONDITIONAL RENDERING - owner can delete the post, while other users can buy it
            if(elements[i].owner == currentUser){
                var main_button = "<button class='main__button delete__car'>Delete</button>"
            }else{
                var main_button = "<button class='main__button buy__car'>Buy</button>"
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
                    <h3>€<span class="carlist__price"> ${elements[i].price}</span></h3>
                    <h4 class="carlist__vin hidden">${elements[i].VIN}</h4>
                </div>
                <div class="carlist__buttons">
                    <button class="see__more">Details</button>
                    ${main_button}
                </div>
            </div>
            `
            container.appendChild(car);
            // console.log('Uradjeno!');
        }
    }else{
        container.innerHTML= "<h1 class='no_cars'>There aren't any cars for sale at the moment!</h1>";
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


    if(currentUser){
        document.getElementById('carlist').style.display = 'none';
    document.getElementsByClassName('carlist__heading')[0].style.display = 'none';

    buyCheckout.style.display='block';

    const itemToBuy = e.target.parentNode.parentNode;

    let imageURL = itemToBuy.getElementsByClassName('carlist__image')[0].src;
    let modelInfo = itemToBuy.getElementsByClassName('carlist__brand_and_model')[0].textContent;
    // let year = itemToBuy.getElementsByClassName('carlist__year')[0].textContent;
    // let owner = itemToBuy.getElementsByClassName('carlist__owner')[0].textContent;
    let vin = itemToBuy.getElementsByClassName('carlist__vin')[0].textContent;
    let price = itemToBuy.getElementsByClassName('carlist__price')[0].textContent;

    let cart = document.getElementById('buy__checkout--table');

    cart.style.display = 'inherit';
    
    let cart_row = document.createElement('tr');

    cart_row.innerHTML = `
        <td><img src="${imageURL}"></img></td>
        <td>${modelInfo}</td>
        <td>${vin}</td>
        <td>${vin}</td>
        <td>${price}</td>
    `
    cart.appendChild(cart_row);

    }else{
        alert('Please log in first!'); //SREDITI.....
    }

    
}

function buyACar(e){

    console.log(e.target.parentNode.children[1]);

    let VIN = e.target.parentNode.children[1].children[1].children[2].textContent;
     //getting VIN number

    let carsFromLS = JSON.parse(localStorage.getItem('cars'));

    carsFromLS.forEach( car => {
        if( car.VIN === VIN ){
            car.sold = true;
        }
    });

    alert('car successfully bought!');
    
    document.getElementById('carlist').style.display = 'inherit';
    document.getElementsByClassName('carlist__heading')[0].style.display = 'inherit';
    buyCheckout.style.display='none';
    window.location.reload();


    localStorage.setItem('cars', JSON.stringify(carsFromLS));

}

function deleteItem(e){



    let deleteVin = e.target.parentNode.parentNode.children[1].children[2].textContent; //mozda postoji laksi nacin da se do ovoga dodje

    let stored_cars = JSON.parse(localStorage.getItem('cars'));

    stored_cars.forEach(( car, index ) => {
        if(car.VIN == deleteVin){
            stored_cars.splice( index, 1 );
        }
    });

    localStorage.setItem('cars', JSON.stringify(stored_cars));
    window.location.reload();
}


function moreInfo(e){

    buyCheckout.style.display="none";
    container.style.display = 'none';
    moreInfoSection.style.display = 'inherit';
    document.getElementsByClassName('carlist__heading_and_search')[0].style.display = 'none';

    const carDetails = document.getElementsByClassName('car__details')[0];

    const moreInfoWiki = document.getElementsByClassName('more__info--wiki')[0];

    document.getElementsByClassName('more__info--cancel')[0].addEventListener('click', funcX)


    const carModelInfo = e.target.parentNode.parentNode.children[1].children[0].textContent;
  
    let moreInfoVin = e.target.parentNode.parentNode.children[1].children[2].textContent;

    for( let i = 0; i< carlist.length; i++){
        if(carlist[i].VIN == moreInfoVin){
            // console.log(carlist[i]);

            carDetails.innerHTML = `
                <div class="car_details_image">
                    <img src="${carlist[i].imageURL}" alt="${carlist[i].brand}${carlist[i].model}" />
                </div>
                <div class="car_details_text">
                    
                    <h1>Car details</h1>
                    <br/>

                    <p><span class='bold'>Brand:</span> ${carlist[i].brand}</p>
                    <p><span class='bold'>Model:</span> ${carlist[i].model}</p>
                    <p><span class='bold'>Year:</span> ${carlist[i].year}</p>
                    <p><span class='bold'>Owner:</span> ${carlist[i].owner}</p>
                    <p><span class='bold'>Mileage:</span> ${carlist[i].mileage}</p>
                    <p><span class='bold'>VIN:</span> ${carlist[i].VIN}</p>
                    <h1><span class='bold'>Price:</span> ${carlist[i].price} €</h1>
                </div>
            `

        }
    }


    // console.log(moreInfoVin);

    let wikiLink = `https://en.wikipedia.org/w/api.php?action=query&titles=${carModelInfo}&prop=extracts|pageimages|info&pithumbsize=400&inprop=url&redirects=&format=json&origin=*`;

    fetch(wikiLink)
    .then(response => response.json())
    .then(data => {
        const pages = data.query.pages;
        const article = Object.values(pages)[0];
        const imgSrc = article.thumbnail.source;
 
        document.getElementById('more__info--spinner').style.display='none';

        moreInfoWiki.innerHTML = `
        <img src="${imgSrc}"/>
        <br/>
        <div>
        <p> ${article.extract.substring(0,1000)}<a href=${article.fullurl}>[read more on wikipedia..]</a></p>
        </div>
        `;
    }).catch(err => {
        document.getElementById('more__info--spinner').style.display='none';
        moreInfoWiki.innerHTML = "No such car on this planet!";
    })

    
}

// exit from more info...
function funcX(){
    window.location.reload();
}


const ApproveBuyBtns = document.getElementsByClassName('buy__approve');
for( let i = 0; i < ApproveBuyBtns.length; i++ ){
    ApproveBuyBtns[i].addEventListener('click', buyACar);
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
