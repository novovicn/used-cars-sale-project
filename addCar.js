const carForm = document.getElementById("add-car-form");
const loginPrompt = document.getElementById("login-prompt");
const loggedUser = JSON.parse(sessionStorage.getItem("loggedUser"));
const carFromHeading = document.getElementsByClassName("add-car-heading")[0];
const carAddedAlert = document.getElementsByClassName("car-added")[0];
const errorMessages = document.getElementById("car-form-errors");
const hamburgerBtnSellCar = document.getElementsByClassName("hamburger-btn")[0];


function retrieveCars() {
  return new Promise((resolve, reject) => {
    db.collection("cars")
      .get()
      .then((snapshot) => {
        let carsArray = [];
        console.log(snapshot.docs);
        snapshot.docs.forEach((doc) => carsArray.push(doc.data()));
        resolve(carsArray);
      })
      .catch((err) => console.log(err));
  });
}

carForm.onsubmit = addCarToDB;

window.onload = function () {
  if (loggedUser != null) {
    if (loggedUser.username != null) {
      carForm.style.display = "block";
      loginPrompt.style.display = "none";
    } else {
      carForm.style.display = "none";
      loginPrompt.style.display = "inherit";
      carFromHeading.style.display = "none";
    }
  } else {
    carForm.style.display = "none";
    loginPrompt.style.display = "inherit";
    carFromHeading.style.display = "none";
  }
};

async function addCarToDB(e) {
  errorMessages.innerHTML = "";

  e.preventDefault();

  const brand = document.getElementById("brand").value;
  const model = document.getElementById("model").value;
  const year = document.getElementById("year").value;
  let imageURL = document.getElementById("image-url").value;
  const mileage = document.getElementById("mileage").value;
  const vin = document.getElementById("vin").value;
  const price = document.getElementById("price").value;

  if (imageURL == "") {
    imageURL = "img/unknown.png";
  }


  const isValid = await validateData(brand, model, year, vin, price);

  if(isValid){
    let car = {
      brand: brand,
      model: model,
      year: year,
      imageURL: imageURL,
      mileage: mileage,
      owner: loggedUser.username,
      VIN: vin,
      price: price,
      sold: false,
      created_at: Date.now(),
    };
  
    db.collection("cars").add(car);

    carForm.classList.add("vanish");
    carFromHeading.classList.add("vanish");
    carAddedAlert.classList.add("appear");
  }else{
    console.log('wrong data');
  }
}


async function validateData(brand, model, year, vin, price){

  // must populate required fields
  if (brand == "" || model == "" || year == "" || vin == "" || price == "") {
    errorMessages.innerHTML += "<p>Please populate required fields</p>";
    return false;
  }

  //year

  if (year < 1900) {
    errorMessages.innerHTML +=
      "<p>Hmm..too old car for this brand new site!</p>";
      return false;
  }

  if (year > 2021) {
    errorMessages.innerHTML +=
      "<p>Hmm..you are selling the car that isn't made yet!</p>";
      return false;
  }

  // no two same vins

  let carlist = await retrieveCars().then((res) => {
    return res;
  });


  if (carlist) {
    for (let i = 0; i < carlist.length; i++) {
      if (carlist[i].VIN === vin) {
        errorMessages.innerHTML +=
          "<p> Can't add two cars with the same VIN</p>";
          return false;
      }
    }
  }

  return true;
}
