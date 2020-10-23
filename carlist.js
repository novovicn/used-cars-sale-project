
/*
AKO neulogovan gledas carlist, ne treba nijedno dugme da se prikazuje, samo da pise LOG IN to buy a car -d o n e

*/ 

const container = document.getElementsByClassName('sale-container')[0];
const carlist = JSON.parse(localStorage.getItem('cars'));
const buyCheckout = document.getElementById('buy-checkout');
const moreInfoSection = document.getElementsByClassName('more-info-section')[0];
const carlistHeading = document.getElementsByClassName('carlist-heading')[0];





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
                var mainButton = "<button class='main-button delete-car'>Delete</button>"
            }else{
                var mainButton = "<button class='main-button buy-car'>Buy</button>"
            }
            if(elements[i].sold === true){
                image_url = "https://www.benchmarkrealty.co.nz/wp-content/uploads/2018/06/sold-stamp-3.png";
                if(elements[i].owner !== currentUser){
                    var mainButton = ''; // can't be bought anymore, but stll can be deleted by owner!
                }    
            }else{
                image_url = elements[i].imageURL;
            }
            let car = document.createElement('div');
            car.innerHTML = `
            <div class="car-card">
                <img class="carlist-image" src="${image_url}"/>
                <div class="carlist-about">
                    <h2 class='carlist-brand-and-model'>${elements[i].brand}  ${elements[i].model}</h2>
                    <h3>€<span class="carlist-price"> ${elements[i].price}</span></h3>
                    <h4 class="carlist-vin hidden">${elements[i].VIN}</h4>
                </div>
                <div class="carlist-buttons">
                    <button class="see-more">Details</button>
                    ${mainButton}
                </div>
            </div>
            `
            container.appendChild(car);
            // console.log('Uradjeno!');
        }
    }else{
        container.innerHTML= "<h1 class='no-cars'>There aren't any cars for sale at the moment!</h1>";
    }
    await addListeners();
        
}

function addListeners(){
    let buyButtons = document.getElementsByClassName('buy-car');
    let deleteButtons = document.getElementsByClassName('delete-car');
    let moreInfoButtons = document.getElementsByClassName('see-more');

    for(let i = 0; i < buyButtons.length; i++){
        buyButtons[i].addEventListener('click', addItemToCart);
    }

    for(let i = 0; i < deleteButtons.length; i++){
        deleteButtons[i].addEventListener('click', deleteItem);
    }

    for(let i = 0; i < moreInfoButtons.length; i++){
        moreInfoButtons[i].addEventListener('click', moreInfo);
    }

}

function addItemToCart(e){

    console.log(e);
    if(currentUser){
        document.getElementById('carlist').style.display = 'none';
    carlistHeading.style.display = 'none';

    buyCheckout.style.display='block';

    const itemToBuy = e.target.parentNode.parentNode;

    let imageURL = itemToBuy.getElementsByClassName('carlist-image')[0].src;
    let modelInfo = itemToBuy.getElementsByClassName('carlist-brand-and-model')[0].textContent;
    // let year = itemToBuy.getElementsByClassName('carlist-year')[0].textContent;
    // let owner = itemToBuy.getElementsByClassName('carlist__owner')[0].textContent;
    let vin = itemToBuy.getElementsByClassName('carlist-vin')[0].textContent;
    let price = itemToBuy.getElementsByClassName('carlist-price')[0].textContent;

    let vinDiv = document.createElement('div');
    vinDiv.setAttribute('id', 'vin-num');
    vinDiv.style.display = 'none';
    vinDiv.innerHTML = `${vin}`;

    let cart = document.getElementById('buy-checkout-table');

    cart.style.display = 'inherit';
    
    let cart_row = document.createElement('div');
    cart_row.setAttribute('class', 'second-row');

    cart_row.innerHTML = 
    `
        <div class="buy-checkout-image" ><img src="${imageURL}"></img></div>
        <div class="buy-checkout-model">${modelInfo}</div>
        <div class="buy-checkout-price">€ ${price}</div>
    `
    cart.appendChild(cart_row);
    cart.appendChild(vinDiv);

    }else{
        alert('Please log in first!');
    }

    
}

function buyACar(e){

    console.log(e.target.parentNode.children[1]);
    let VIN = document.getElementById('vin-num').textContent;
     //getting VIN number

    let carsFromLS = JSON.parse(localStorage.getItem('cars'));

    carsFromLS.forEach( car => {
        if( car.VIN === VIN ){
            car.sold = true;
        }
    });

    alert('car successfully bought!');
    
    document.getElementById('carlist').style.display = 'inherit';
    carlistHeading.style.display = 'inherit';
    buyCheckout.style.display='none';
    window.location.reload();


    localStorage.setItem('cars', JSON.stringify(carsFromLS));

}

function deleteItem(e){


    let deleteVin = e.target.parentNode.parentNode.children[1].children[2].textContent; //mozda postoji laksi nacin da se do ovoga dodje

    let storedCars = JSON.parse(localStorage.getItem('cars'));

    let ask = window.confirm(
        `Are you sure you want to delete?`
      );
      if (ask === false) {
        return false;
      } else {
        storedCars.forEach(( car, index ) => {
            if(car.VIN == deleteVin){
                storedCars.splice( index, 1 );
            }
        });
    
        localStorage.setItem('cars', JSON.stringify(storedCars));
        window.location.reload();
    
    }

}


function moreInfo(e){

    buyCheckout.style.display="none";
    container.style.display = 'none';
    moreInfoSection.style.display = 'inherit';
    carlistHeading.style.display = 'none';

    const carDetails = document.getElementsByClassName('car-details')[0];

    const moreInfoWiki = document.getElementsByClassName('more-info-wiki')[0];

    document.getElementsByClassName('more-info-cancel')[0].addEventListener('click', funcX)


    const carModelInfo = e.target.parentNode.parentNode.children[1].children[0].textContent;
  
    let moreInfoVin = e.target.parentNode.parentNode.children[1].children[2].textContent;

    for( let i = 0; i< carlist.length; i++){
        if(carlist[i].VIN == moreInfoVin){
            // console.log(carlist[i]);

            carDetails.innerHTML = `
                <div class="car-details-image">
                    <img src="${carlist[i].imageURL}" alt="${carlist[i].brand}${carlist[i].model}" />
                </div>
                <div class="car-details-text">
                    <h1 class="car-details-big">Car details</h1>
                    <br/>
                    <p><span class='bold'>Brand:</span> ${carlist[i].brand}</p>
                    <p><span class='bold'>Model:</span> ${carlist[i].model}</p>
                    <p><span class='bold'>Year:</span> ${carlist[i].year}</p>
                    <p><span class='bold'>Owner:</span> ${carlist[i].owner}</p>
                    <p><span class='bold'>Mileage:</span> ${carlist[i].mileage}</p>
                    <p><span class='bold'>VIN:</span> ${carlist[i].VIN}</p>
                    <h1 class="car-details-big" ><span class='bold'>Price:</span> ${carlist[i].price} €</h1>
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
 
        document.getElementById('more-info-spinner').style.display='none';

        moreInfoWiki.innerHTML = `
        <div class="wiki-image">
        <img  src="${imgSrc}"/>
        </div>
        <br/>
        <div class="wiki-textbox">
        <p class="wiki-text"> ${article.extract.substring(0,1000)}...<a class="read-more" href=${article.fullurl} target="_blank">[read more on wikipedia]</a></p>
        </div>
        `;
    }).catch(err => {
        document.getElementById('more-info-spinner').style.display='none';
        moreInfoWiki.innerHTML = "<h1 class='car-details-big'>Sorry, no wikipedia info for such car.</h1>";
    })

    
}

// exit from more info...
function funcX(){
    window.location.reload();
}


const ApproveBuyBtns = document.getElementsByClassName('buy-approve');
for( let i = 0; i < ApproveBuyBtns.length; i++ ){
    ApproveBuyBtns[i].addEventListener('click', buyACar);
}



// FILTERING 

const searchByName = document.getElementById('search-brand')
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

const btnSearch = document.getElementById('search-price');
btnSearch.addEventListener('click', filterByPrice);

function filterByPrice(){
    let lowestPrice = document.getElementById('search-price-lowest').value;
    let highestPrice = document.getElementById('search-price-highest').value;

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
