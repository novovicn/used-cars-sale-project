
/*

todo lista: password validation!!! brojaci ili naci neki RegExp 

napraviti funkciju kojoj se prosledjuje polje da ga oboji u crveno, ili mu dodavati klasu 
koja ga boji kada se ustanovi greska na njemu...

*/

const mainContainer = document.querySelector('.main-container');
const darkenDiv = document.getElementsByClassName('darken-hidden')[0];
const registerSubmit = document.getElementById('submit-reg');
const loginSubmit = document.getElementById('submit-login');
const registrationForm = document.getElementById('user-registration');
const loginForm = document.getElementById('user-login');

const logoutButton = document.getElementsByClassName('logout-btn')[0];

const loginButton = document.getElementsByClassName('login-btn')[0];
const registerButton = document.getElementsByClassName('register-btn')[0];

const mainPageContent = document.getElementsByClassName('main-page-content')[0];

logoutButton.style.display = 'none';



window.onload = () => {
    registrationForm.style.display = 'none';
    loginForm.style.display = 'none';

}

let users = [];
var loggedUser = {};


loginButton.addEventListener('click', () => {
    registrationForm.style.display = 'none';
    loginForm.style.display = 'block';
    darkenDiv.classList.add('darken-visible');
});
registerButton.addEventListener('click', () => {
    registrationForm.style.display = 'block';
    loginForm.style.display = 'none';
    darkenDiv.classList.add('darken-visible');
})

registrationForm.onsubmit = registerUser;

loginForm.onsubmit = logUserIn;



// User registration handling 



function registerUser(e){
    e.preventDefault();

    const errorMsg = document.getElementById('registration-errors');

    let registeredUsers = retrieveUsersLS();

    const name = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;
    const username = document.getElementById('reg-username').value;
    const password = document.getElementById('reg-password').value;

    const nameError = document.getElementsByClassName('reg-name-error')[0];
    const emailError = document.getElementsByClassName('reg-email-error')[0];
    const usernameError = document.getElementsByClassName('reg-username-error')[0];
    const passwordError = document.getElementsByClassName('reg-password-error')[0];

    // All the fields must be populated 

    if(name == "" || email == "" || username == "" || password == ""){
        errorMsg.innerHTML = "Please fill in all the fields"
        return;
    }

    // NAME

    if(name.length <2){
        nameError.innerHTML = "Name must contain at least 2 letters";
        return;
    }

    let nameRegExp = /^[a-zA-Z ]+$/.test(name);

    if(!nameRegExp){
        nameError.innerHTML="Name should contain only letters and spaces";
        return;
    }

    // EMAIL
    const emailPattern = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

    if (emailPattern.test(email) == false){
        emailError.innerHTML = "Invalid email address";
        return;
    }


    // USERNAME

    if(registeredUsers != null){
        for( let i = 0; i < registeredUsers.length; i++){
            if((registeredUsers[i].username).toUpperCase() === username.toUpperCase()) {
                document.getElementById('reg-username').style.border = '2px solid red'
                usernameError.innerHTML = "Username already taken";
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
        passwordError.innerHTML = "Password must contain one number, one Upper case and one Lower case letter";
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

    let username = document.getElementById('login-username').value.trim();
    let password = document.getElementById('login-password').value.trim();
    let usernameError = document.getElementById('login-username-error');
    let passwordError = document.getElementById('login-password-error');


    if(registeredUsers){
        for(let i = 0; i < registeredUsers.length; i++){
            if(registeredUsers[i].username == username){
                usernameError.style.display= "none";
                console.log(password+" "+registeredUsers[i].password); 
                if(registeredUsers[i].password == password){
                    loggedUser.username = username;
                    loggedUser.password = password;
                    sessionStorage.setItem('loggedUser', JSON.stringify(loggedUser));
                    window.location.reload();
                    // return;
                }else{
                    passwordError.innerText="Wrong password";
                    return false;
                }
    
            }else{
                usernameError.innerText="Invalid username";
                
            }
    
            
        }
    }else{
        usernameError.innerText="No registered users";
    }
    
}

let currentylyLoggedUser = JSON.parse(sessionStorage.getItem('loggedUser'));
if(currentylyLoggedUser != null){
    if(currentylyLoggedUser.username != null){
        logoutButton.style.display = 'inline';
        loginButton.style.display = "none";
        registerButton.style.display = "none";
    }
}

// logout
logoutButton.addEventListener('click', () => {
    let empty = {};
    sessionStorage.setItem('loggedUser', JSON.stringify(empty));
    window.location.reload();
})


function retrieveUsersLS() {
    let usersLS = JSON.parse(localStorage.getItem('users'));
    return usersLS;
}

const agreeTermsCheckbox = document.getElementById("agree-terms");

agreeTermsCheckbox.addEventListener('change', allowRegistration);

function allowRegistration(){
    if(agreeTermsCheckbox.checked){
        registerSubmit.removeAttribute('disabled');
    }else{
        registerSubmit.setAttribute('disabled', 'disabled');
    }
    console.log(agreeTermsCheckbox.checked);
}

const cancelBtns = document.getElementsByClassName('cancel-auth-form');

for(let i = 0; i< cancelBtns.length; i++){
    cancelBtns[i].addEventListener('click', (e) =>{
        e.preventDefault();
        registrationForm.style.display = 'none';
        darkenDiv.classList.remove('darken-visible');
        loginForm.style.display = 'none';
    })
}