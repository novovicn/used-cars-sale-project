const container = document.getElementsByClassName("sale-container")[0];
const buyCheckout = document.getElementById("buy-checkout");
const moreInfoSection = document.getElementsByClassName("more-info-section")[0];
const carlistHeading = document.getElementsByClassName("carlist-heading")[0];
const paginationContainer = document.querySelector('.pagination-container');

var current_page;

function retrieveCars() {
  return new Promise((resolve, reject) => {
    db.collection("cars")
      .get()
      .then((snapshot) => {
        let carsArray = [];
        console.log(snapshot.docs);
        snapshot.docs.forEach((doc) => carsArray.push(doc.data()));
        console.log(carsArray);
        resolve(carsArray);
      })
      .catch((err) => console.log(err));
  });
}

window.onload = () => {
  buyCheckout.style.display = "none";
  moreInfoSection.style.display = "none";
//   renderElements(carlist);

  db.collection("cars")
    .get()
    .then((snapshot) => {
      let carsArray = [];
      snapshot.docs.forEach((doc) =>
        carsArray.push({ ...doc.data(), id: doc.id })
      );
      renderElements(carsArray);
    });
};



if (sessionStorage.getItem("loggedUser") != null) {
  var currentUser = JSON.parse(sessionStorage.getItem("loggedUser")).username;
}

function renderElements(elements) {
  container.innerHTML = "";

  console.log(elements.length);

  if (elements != null) {
    // newest first
    for (let i = 0; i < elements.length - 1; i++) {
      for (let j = i + 1; j < elements.length; j++) {
        if (elements[i].created_at < elements[j].created_at) {
          let temp = elements[i];
          elements[i] = elements[j];
          elements[j] = temp;
        }
      }
    }

    const items_per_page = 6;
    current_page = 1;

    setupPagination(elements, paginationContainer, items_per_page);
    pagination(elements, container, items_per_page, current_page);
  } else {
    container.innerHTML =
      "<h1 class='no-cars'>There aren't any cars for sale at the moment!</h1>";
  }
}

function addListeners() {
  let buyButtons = document.getElementsByClassName("buy-car");
  let deleteButtons = document.getElementsByClassName("delete-car");
  let moreInfoButtons = document.getElementsByClassName("see-more");

  [...buyButtons].forEach(button => {
      button.addEventListener('click', addItemToCart);
  });

  [...deleteButtons].forEach(button => {
    button.addEventListener('click', deleteItem);
  });

  [...moreInfoButtons].forEach(button => {
    button.addEventListener('click', moreInfo);
  });

}

async function pagination(items, wrapper, items_per_page, page) {

  wrapper.innerHTML = '';
  page--;

  let start = items_per_page * page;
  let end = start + items_per_page;
  let paginatedElements = items.slice(start, end);
  
  for (let i = 0; i < paginatedElements.length; i++) {
    let image_url = paginatedElements[i].imageURL;

    if (paginatedElements[i].owner == currentUser) {
      var mainButton ="<button class='main-button delete-car'>Delete</button>";
    } else {
      var mainButton = "<button class='main-button buy-car'>Buy</button>";
    }
    if (paginatedElements[i].sold === true) {
      var sold = "<div class='is-sold'>SOLD</div>";
      if (paginatedElements[i].owner !== currentUser) {
        var mainButton = ""; 
      }
    } else {
      var sold = "";
    }
    let car = document.createElement("div");
    car.innerHTML = `
          <div class="car-card" data-id="${paginatedElements[i].id}">
              ${sold}
              <img class="carlist-image" src="${image_url}"/>
              <div class="carlist-about">
                  <h2 class='carlist-brand-and-model'>${paginatedElements[i].brand}  ${paginatedElements[i].model}</h2>
                  <h3>€<span class="carlist-price"> ${paginatedElements[i].price}</span></h3>
                  <h4 class="carlist-vin hidden">${paginatedElements[i].VIN}</h4>
              </div>
              <div class="carlist-buttons">
                  <button class="see-more">Details</button>
                  ${mainButton}
              </div>
          </div>
          `;
    container.appendChild(car);
  }
  await addListeners();
  
}

function setupPagination(items, wrapper, items_per_page){
  wrapper.innerHTML='';

  let page_count = Math.ceil(items.length / items_per_page);

  for( let i = 1; i < page_count + 1; i++){
    let btn = paginationButton(i, items, items_per_page);
    wrapper.append(btn);
  }
}

function paginationButton(page, items, items_per_page){

  let button = document.createElement('button');
  button.innerText = page;

  if(current_page === page){
    button.classList.add('active');
  }

  button.addEventListener('click', () => {
    current_page = page;
    pagination(items, container, items_per_page, current_page);
    
    let current_btn = document.querySelector('.pagination-container button.active');
    current_btn.classList.remove('active');
    
    button.classList.add('active');

  })

  return button;

}

function addItemToCart(e) {

  if (currentUser) {
    document.getElementById("carlist").style.display = "none";
    carlistHeading.style.display = "none";

    buyCheckout.style.display = "block";

    const itemToBuy = e.target.parentNode.parentNode;

    console.log(itemToBuy);

    let id = itemToBuy.getAttribute("data-id");
    console.log(id);

    let imageURL = itemToBuy.getElementsByClassName("carlist-image")[0].src;
    let modelInfo = itemToBuy.getElementsByClassName(
      "carlist-brand-and-model"
    )[0].textContent;
    // let vin = itemToBuy.getElementsByClassName('carlist-vin')[0].textContent;
    let price = itemToBuy.getElementsByClassName("carlist-price")[0]
      .textContent;

    let vinDiv = document.createElement("div");
    vinDiv.setAttribute("id", "vin-num");
    vinDiv.style.display = "none";
    vinDiv.innerHTML = `${id}`;

    let cart = document.getElementById("buy-checkout-table");

    cart.style.display = "inherit";

    let cart_row = document.createElement("div");
    cart_row.setAttribute("class", "second-row");

    cart_row.innerHTML = `
        <div class="buy-checkout-image" ><img src="${imageURL}"></img></div>
        <div class="buy-checkout-model">${modelInfo}</div>
        <div class="buy-checkout-price">€ ${price}</div>
    `;
    cart.appendChild(cart_row);
    cart.appendChild(vinDiv);
  } else {
    alert("Please log in first!");
  }
}

async function buyACar(e) {
  console.log(e.target.parentNode.parentNode);
  let id = document.getElementById("vin-num").textContent;

  await db.collection("cars").doc(id).update({ sold: true });

  alert("car successfully bought!");

  document.getElementById("carlist").style.display = "inherit";
  carlistHeading.style.display = "inherit";
  buyCheckout.style.display = "none";
  window.location.reload();
}

async function deleteItem(e) {
  let id = e.target.parentNode.parentNode.getAttribute("data-id"); //mozda postoji laksi nacin da se do ovoga dodje

  let ask = window.confirm(`Are you sure you want to delete?`);
  if (ask === false) {
    return false;
  } else {
    const data = await db
      .collection("cars")
      .doc(id)
      .delete()

    window.location.reload();
  }
}

async function moreInfo(e) {
  buyCheckout.style.display = "none";
  container.style.display = "none";
  moreInfoSection.style.display = "inherit";
  carlistHeading.style.display = "none";

  const carDetails = document.getElementsByClassName("car-details")[0];

  const moreInfoWiki = document.getElementsByClassName("more-info-wiki")[0];

  document
    .getElementsByClassName("more-info-cancel")[0]
    .addEventListener("click", funcX);

  const carlist = await retrieveCars();

  const carModelInfo =
    e.target.parentNode.parentNode.children[1].children[0].textContent;

  const moreInfoVin =
    e.target.parentNode.parentNode.children[1].children[2].textContent;

  for (let i = 0; i < carlist.length; i++) {
    if (carlist[i].VIN == moreInfoVin) {

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
            `;
    }
  }

  const wikiLink = `https://en.wikipedia.org/w/api.php?action=query&titles=${carModelInfo}&prop=extracts|pageimages|info&pithumbsize=400&inprop=url&redirects=&format=json&origin=*`;

  fetch(wikiLink)
    .then((response) => response.json())
    .then((data) => {
      const pages = data.query.pages;
      const article = Object.values(pages)[0];
      const imgSrc = article.thumbnail.source;

      document.getElementById("more-info-spinner").style.display = "none";

      moreInfoWiki.innerHTML = `
        <div class="wiki-image">
        <img  src="${imgSrc}"/>
        </div>
        <br/>
        <div class="wiki-textbox">
        <p class="wiki-text"> ${article.extract.substring(
          0,
          1000
        )}...<a class="read-more" href=${
        article.fullurl
      } target="_blank">[read more on wikipedia]</a></p>
        </div>
        `;
    })
    .catch((err) => {
      document.getElementById("more-info-spinner").style.display = "none";
      moreInfoWiki.innerHTML =
        "<h1 class='car-details-big'>Sorry, no wikipedia info for such car.</h1>";
    });
}

function funcX() {
  window.location.reload();
}

const ApproveBuyBtns = document.getElementsByClassName("buy-approve");
for (let i = 0; i < ApproveBuyBtns.length; i++) {
  ApproveBuyBtns[i].addEventListener("click", buyACar);
}

const searchByName = document.getElementById("search-brand");
searchByName.addEventListener("input", filterCarsByName);

async function filterCarsByName() {
  let carlist = await retrieveCars();

  let filteredCars = carlist.filter((car) => {
    if (
      car.brand
        .toUpperCase()
        .indexOf(searchByName.value.trim().toUpperCase()) != -1 ||
      car.model
        .toUpperCase()
        .indexOf(searchByName.value.trim().toUpperCase()) != -1
    ) {
      return car;
    }
  });

  renderElements(filteredCars);
}

const btnSearch = document.getElementById("search-price");
btnSearch.addEventListener("click", filterByPrice);

async function filterByPrice() {
  let lowestPrice = document.getElementById("search-price-lowest").value;
  let highestPrice = document.getElementById("search-price-highest").value;

  let carlist = await retrieveCars();

  if (highestPrice === "") {
    highestPrice = 99999999999;
  }

  if (lowestPrice === "") {
    lowestPrice = 0;
  }

  let filteredByPrice = carlist.filter((car) => {
      if (car.price >= parseInt(lowestPrice) &&car.price <= parseInt(highestPrice)) {
        return car;
      }
  });
  renderElements(filteredByPrice);
}

