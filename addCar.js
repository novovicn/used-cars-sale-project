
document.getElementById('submit').addEventListener('click', addCartoLS);

const loggedUser = JSON.parse(sessionStorage.getItem('loggedUser'));

const carlist = JSON.parse(localStorage.getItem('cars'));



window.onload = function(){

    /*
     THERE MUST BE A BETTER way of doing this*---the problem : first if is when 
     ss is EMPTY, another if is when ss is just an empty object ( should I change the logout logic??)
     */

        if(loggedUser != null){

            if (loggedUser.username != null){
                document.getElementById('add__car--form').style.display='block';
                document.getElementById('please__login').style.display= 'none';
                
        
            }else{
                document.getElementById('add__car--form').style.display="none";
                document.getElementById('please__login').innerHTML = "Please <a href='./index.html'>log in</a> to add your car!";
            }
        }else{
            document.getElementById('add__car--form').style.display="none";
                document.getElementById('please__login').innerHTML = "Please <a href='./index.html'>log in</a> to add your car!";
        }

    
       
    }

    
function addCartoLS(){

    const brand = document.getElementById('brand').value;
    const model = document.getElementById('model').value;
    const year = document.getElementById('year').value;
    let imageURL = document.getElementById('imageURL').value;
    const mileage = document.getElementById('mileage').value;
    const vin = document.getElementById('vin').value;
    const price = document.getElementById('price').value;

    if(imageURL == ""){
        imageURL = "img/unknown.png"
    }




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

    let carList = retrieveCarsLS();

    if(carList != null){
        carList.push(car);
        var carsLS = JSON.stringify(carList);
    }else{
        cars.push(car);
        var carsLS = JSON.stringify(cars);
    }

    localStorage.setItem('cars', carsLS);    

}

function retrieveCarsLS() {
    let carsLS = JSON.parse(localStorage.getItem('cars'));
    return carsLS;
}