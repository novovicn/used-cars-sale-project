
document.getElementById('submit').addEventListener('click', addCartoLS);


function addCartoLS(){

    const brand = document.getElementById('brand').value;
    const model = document.getElementById('model').value;
    const year = document.getElementById('year').value;
    let imageURL = document.getElementById('imageURL').value;
    const mileage = document.getElementById('mileage').value;

    if(imageURL == ""){
        imageURL = "https://lh3.googleusercontent.com/proxy/oly9gbPaLge9AROjT2BL0OGv5ytkxgkOkH-1iqg7e-Xibmz-GfSvkNdSGEHJMJvjBAeyM9-SAXljql0Q7aA_nrc-3boVfbH3sYjUYKIz3eSVfTWBFlER_mhQ_KPqww"
    }


    let cars=[];

    let car = {
        brand: brand,
        model: model, 
        year: year, 
        imageURL: imageURL,
        mileage: mileage
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