
const carForm = document.getElementById('add-car-form');
const loginPrompt = document.getElementById('login-prompt');

carForm.onsubmit = addCartoLS;
const loggedUser = JSON.parse(sessionStorage.getItem('loggedUser'));
const carlist = retrieveCarsLS();

const carFromHeading = document.getElementsByClassName('add-car-heading')[0];
const carAddedAlert = document.getElementsByClassName('car-added')[0];


const errorMessages = document.getElementById("car-form-errors");

console.log(errorMessages);


window.onload = function(){
    /*
     THERE MUST BE A BETTER way of doing this*---the problem : first if is when 
     ss is EMPTY, another if is when ss is just an empty object ( should I change the logout logic??)
     */

        if(loggedUser != null){
            if (loggedUser.username != null){
                carForm.style.display='block';
                loginPrompt.style.display= 'none';
                
            }else{
                carForm.style.display="none";
                loginPrompt.style.display="inherit";
            }
        }else{
                carForm.style.display="none";
                loginPrompt.style.display="inherit";
        }
    }

function addCartoLS(e){

    e.preventDefault();

    const brand = document.getElementById('brand').value;
    const model = document.getElementById('model').value;
    const year = document.getElementById('year').value;
    let imageURL = document.getElementById('image-url').value;
    const mileage = document.getElementById('mileage').value;
    const vin = document.getElementById('vin').value;
    const price = document.getElementById('price').value;


    if(imageURL == ""){
        imageURL = "img/unknown.png"
    }

    // INPUT VALIDATION 

    // must populate required fields
    if( brand == "" || model == "" || year == "" || vin == "" || price == ""){
        errorMessages.innerHTML +='<p>Please populate required fields</p>';
        return;
    }

    //year 

    if(year < 1900){
        errorMessages.innerHTML += '<p>Hmm..too old car for this brand new site!</p>';
        return;
    }

    if(year > 2021){
        errorMessages.innerHTML += '<p>Hmm..you are selling the car that isn\'t made yet!</p>';
        return;
    }

    // no two same vins
    if(carlist){
        for( let i = 0; i< carlist.length; i++){
            if(carlist[i].VIN === vin){
                errorMessages.innerHTML += '<p> Can\'t add two cars with the same VIN</p>';
                return;
            }
        }
    
    };

    // NECE DA GA SKLONI PRIJAVI GRESKU ALI NE IZADJE NEGO GA IPAK POSALJE U LS !!!!
   
    let cars=[];

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
        created_at: Date.now()
    }

    if(carlist != null){
        carlist.push(car);
        var carsLS = JSON.stringify(carlist);
    }else{
        cars.push(car);
        var carsLS = JSON.stringify(cars);
    }
    localStorage.setItem('cars', carsLS);   

    carForm.classList.add('vanish');
    carFromHeading.classList.add('vanish');
    carAddedAlert.classList.add('appear');

}

function retrieveCarsLS() {
    let carsLS = JSON.parse(localStorage.getItem('cars'));
    return carsLS;
}