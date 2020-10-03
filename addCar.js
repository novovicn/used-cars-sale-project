
document.getElementById('submit').addEventListener('click', addCartoLS);

const loggedUser = JSON.parse(sessionStorage.getItem('loggedUser'));



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
                document.getElementById('please__login').innerHTML = "Please <a href='./index.html'>log in</a> to add your car";
            }
        }else{
            document.getElementById('add__car--form').style.display="none";
                document.getElementById('please__login').innerHTML = "Please <a href='./index.html'>log in</a> to add your car";
        }

    
       
    }


// TODO: Moras biti ulogovan da bi uopste dosao na ovu stranicu -- DONE

// TODO: Uhvatiti koji korisnik je trenutno u SS i na osnovu toga to ubaciti u polje VLASNIK vozila --DONE
// , i onda posle kad se klikne na obrisi oglas, to moze da se desi samo ako u tom trenutku u SS username je isto kao i vlasnik vozila


// tesko ce ici ovo sa ImageURL jer ce gugl verovatno zabraniti, tako da cu morati ako nema imageURL da izbacim 
// neku sliku koja je u mom folderu, ili da ukinem to nego da sam sa vikipedie vuce tu sliku 

function addCartoLS(){

    const brand = document.getElementById('brand').value;
    const model = document.getElementById('model').value;
    const year = document.getElementById('year').value;
    let imageURL = document.getElementById('imageURL').value;
    const mileage = document.getElementById('mileage').value;

    if(imageURL == ""){
        imageURL = "https://www.auto123.com/static/auto123/images/unknown.692d9ec5c563.png"
    }


    let cars=[];

    let car = {
        brand: brand,
        model: model, 
        year: year, 
        imageURL: imageURL,
        mileage: mileage,
        owner: loggedUser.username
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