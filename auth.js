
/*

todo lista: password validation!!! brojaci ili naci neki RegExp 

napraviti funkciju kojoj se prosledjuje polje da ga oboji u crveno, ili mu dodavati klasu 
koja ga boji kada se ustanovi greska na njemu...

*/


const register = document.getElementById('submit_reg');
const login = document.getElementById('submit_login');
const registrationForm = document.getElementById('user_registration');
const loginForm = document.getElementById('user_login');

const logout = document.getElementById('nav_logout');

logout.style.display = 'none';

window.onload = () => {
    document.getElementById("user_registration").style.display = 'none';
    document.getElementById("user_login").style.display = 'none';
}

let users = [];
var loggedUser = {};


document.getElementById('nav_login').addEventListener('click', () => {
    document.getElementById("user_registration").style.display = 'none';
    document.getElementById("user_login").style.display = 'block';
})
document.getElementById('nav_register').addEventListener('click', () => {
    document.getElementById("user_registration").style.display = 'block';
    document.getElementById("user_login").style.display = 'none';
})

registrationForm.onsubmit = registerUser;

loginForm.onsubmit = logUserIn;



// User registration handling 



function registerUser(e){
    e.preventDefault();

    const errorMsg = document.getElementById('registration__errors');

    let registeredUsers = retrieveUsersLS();

    const name = document.getElementById('reg_name').value;
    const email = document.getElementById('reg_email').value;
    const username = document.getElementById('reg_username').value;
    const password = document.getElementById('reg_password').value;

    const name_error = document.getElementsByClassName('reg_name--error')[0];
    const email_error = document.getElementsByClassName('reg_email--error')[0];
    const username_error = document.getElementsByClassName('reg_username--error')[0];
    const password_error = document.getElementsByClassName('reg_password--error')[0];

    // All the fields must be populated 

    if(name == "" || email == "" || username == "" || password == ""){
        errorMsg.innerHTML = "Please fill in all the fields"
        return;
    }

    // NAME

    if(name.length <2){
        name_error.innerHTML = "Name must contain at least 2 letters";
        return;
    }

    let name_regexp = /^[a-zA-Z ]+$/.test(name);

    if(!name_regexp){
        name_error.innerHTML="Name should contain only letters and spaces";
        return;
    }

    // EMAIL
    const email_pattern = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

    if (email_pattern.test(email) == false){
        email_error.innerHTML = "Invalid email address";
        return;
    }


    // USERNAME

    if(registeredUsers != null){
        for( let i = 0; i < registeredUsers.length; i++){
            if((registeredUsers[i].username).toUpperCase() === username.toUpperCase()) {
                document.getElementById('reg_username').style.border = '2px solid red'
                username_error.innerHTML = "Username already taken";
                return;
            }
        }
    }

    // PASSWORD 


    let number = 0;
    let upperCaseLetters = 0;
    let lowerCaseLetters = 0;

    for ( i = 0; i < password.length; i++){
        if(!isNaN(password[i])){
            number++;
        }else if(password[i].toUpperCase() == password[i] && password[i].toLowerCase() !== password[i].toUpperCase){
            upperCaseLetters++;
        }else if(password[i].toLowerCase() == password[i] && password[i].toLowerCase() !== password[i].toUpperCase){
            lowerCaseLetters++;
        }
    }

    if(number == 0 || upperCaseLetters == 0 || lowerCaseLetters == 0){
        password_error.innerHTML = "Password must contain one number, one Upper case and one Lower case letter";
        console.log(number, upperCaseLetters, lowerCaseLetters);
        return;
    }

    
    let user = {
        name: name,
        email: email,
        username: username,
        password: password
    }

    if(registeredUsers != null){
        registeredUsers.push(user);
        var usersLS = JSON.stringify(registeredUsers);
    }else{
        users.push(user);
        var usersLS = JSON.stringify(users);
    }
    localStorage.setItem('users', usersLS);

    window.location.reload();

    console.log(user);
}



// ==========================================================================
// user login handling 


function logUserIn(e){
    e.preventDefault(); 


    let registeredUsers = retrieveUsersLS();
    // console.log(registeredUsers.length);

    let username = document.getElementById('login_username').value.trim();
    let password = document.getElementById('login_password').value.trim();


    if(registeredUsers){
        for(let i = 0; i < registeredUsers.length; i++){
            if(registeredUsers[i].username == username){
                document.getElementById('login__username--error').style.display= "none";
                console.log(password+" "+registeredUsers[i].password); 
                if(registeredUsers[i].password == password){
                    loggedUser.username = username;
                    loggedUser.password = password;
                    sessionStorage.setItem('loggedUser', JSON.stringify(loggedUser));
                    window.location.reload();
                    // return;
                }else{
                    document.getElementById('login__password--error').innerText="Wrong password";
                    return false;
                }
    
            }else{
                document.getElementById('login__username--error').innerText="Invalid username";
                
            }
    
            
        }
    }else{
        document.getElementById('login__username--error').innerText="No registered users";
    }
    
}

let currentylyLoggedUser = JSON.parse(sessionStorage.getItem('loggedUser'));
if(currentylyLoggedUser != null){
    if(currentylyLoggedUser.username != null){
        logout.style.display = 'inline';
        document.getElementById('nav_login').style.display = "none";
        document.getElementById('nav_register').style.display = "none";
    }
}

// logout
logout.addEventListener('click', () => {
    let empty = {};
    sessionStorage.setItem('loggedUser', JSON.stringify(empty));
    window.location.reload();
})


function retrieveUsersLS() {
    let usersLS = JSON.parse(localStorage.getItem('users'));
    return usersLS;
}


// TODO : patterns, style error div, stil za okvir polja koje je pogresno, 



// RADI OVO ZA STILIZOVANJE FINO LEPO  

// function prikaziGresku(){
//     document.getElementsByClassName('reg_name--error')[0].innerText = "greska jbg";
//     document.getElementById('reg_name').style.border = '2px solid red';
// }

document.getElementById("agree_terms").addEventListener('change', allowRegistration);

function allowRegistration(){
    // alert('change');

    if(document.getElementById("agree_terms").checked){
        document.getElementById('submit_reg').removeAttribute('disabled');
    }else{
        document.getElementById('submit_reg').setAttribute('disabled', 'disabled');
    }
    console.log(document.getElementById("agree_terms").checked);
}

const cancelBtns = document.getElementsByClassName('cancel_auth_form');

for(let i = 0; i< cancelBtns.length; i++){
    cancelBtns[i].addEventListener('click', (e) =>{
        e.preventDefault();
        document.getElementById("user_registration").style.display = 'none';
        document.getElementById("user_login").style.display = 'none';
    })
}