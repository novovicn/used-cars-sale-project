
const container = document.getElementsByClassName('container')[0];


const carlist = JSON.parse(localStorage.getItem('cars'));



if(carlist !== null){
    for ( let i = 0; i < carlist.length; i++){
        console.log(carlist[i]);
    }
}else{
    console.log('No cars at the moment');
}
