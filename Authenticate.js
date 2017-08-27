// Authentication for the Todo App

var emailInput = document.getElementById("email");
var passwordInput = document.getElementById("password");
var userNameInput = document.getElementById("userName");
var singinEmail = document.getElementById("signinEmail");
var signinPass = document.getElementById("signinPassword");

// firebase database and authentication
var database = firebase.database().ref('/');
var auth = firebase.auth();

// function for signup
function signup() {
    var email = emailInput.value;
    var password = passwordInput.value;
    var userName = userNameInput.value;

    // firebase method to create user
    auth.createUserWithEmailAndPassword(email, password)            //promises, then and catch
        .then(function (result) {
            // firebase method to update the user object
            return result.updateProfile({ displayName: userName })  // cannot be customize
                .then(function () {
                    // redirects to Sign In Page
                    window.location.assign("SignIn.html");
                })

        })
        .catch(function (error) {
            console.log(error.message);
            // user alert goes here ...
        })

}


//function to sign in
function signin() {
    var email = singinEmail.value;
    var password = signinPass.value;

    // firebase signin method
    auth.signInWithEmailAndPassword(email, password)            //promises, then and catch
        .then(function (result) {
            //redirects to home page
            window.location.assign("index.html");
        })
        .catch(function (error) {
            console.log(error.message);
            // user alert goes here ...
        })

}


