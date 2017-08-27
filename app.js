// *********************************************************************************
// ********************************** FIREBASE *************************************
// *********************************************************************************



// accessing the database
// with the ref('/') we access the child of database
var database = firebase.database().ref('/');
// accessing the authentication of firebase
var auth = firebase.auth();

// reference to DOM
var input = document.getElementById('inDemo');
var list = document.getElementById('listItem');

// function stored in var globally to get visible for submit button
var demoInUse = null;

// Firebase method to check if someone is logged in
auth.onAuthStateChanged(function (user) {
    // if user gets an object
    if (user) {
        var currUserName = auth.currentUser;     // getting the login user object

        var authBtn = document.getElementById("authBtn");
        // changing the state to sign out when logged in
        authBtn.innerHTML = '<button type="button" class="btn btn-warning" onclick="signOut()">Sign out</button>';

        demoInUse = function demo() {

            // object to be used in database
            var user = {
                userTask: input.value
            }

            database.child("users/" + currUserName.uid).push(user);         //set() overwrites
            input.value = "";
        }

        // on() method retrives the data from the database, it takes two params
        database.child("users/" + currUserName.uid).on("child_added", function (snapshot) {
            var obj = snapshot.val();       //val() gives the object in database
            obj.id = snapshot.key;          // key gives the unique key of user in database

            render(obj);    // render function
        })

        //function to render UI
        function render(user) {
            var li = document.createElement("LI");
            li.setAttribute("class", "list-group-item");
            var textPara = document.createElement("P");
            var text = document.createTextNode(user.userTask);
            textPara.setAttribute("class", "paraWrap");
            textPara.appendChild(text);

            li.setAttribute("id", user.id);

            var deleteBtn = document.createElement("BUTTON");
            var deleteTxt = document.createTextNode("Delete");

            var editBtn = document.createElement("BUTTON");
            var editTxt = document.createTextNode("Edit");

            editBtn.appendChild(editTxt);
            editBtn.setAttribute("class", "btn btn-warning float-right");
            editBtn.style.marginRight = "10px";
            editBtn.onclick = function () { edit(user.id, user.userTask); };
            deleteBtn.appendChild(deleteTxt);
            deleteBtn.setAttribute("class", "btn btn-danger float-right");
            deleteBtn.onclick = function () { remove(user.id) };


            li.appendChild(textPara);
            li.appendChild(deleteBtn);
            li.appendChild(editBtn);
            list.appendChild(li);
        }

        // remove function to remove the key from database
        function remove(key) {
            database.child("users/" + currUserName.uid + "/" + key).remove();     //firebase method
        }

        // event listner to remove from UI
        database.child("users/" + currUserName.uid).on("child_removed", function (data) {
            var deletedLi = document.getElementById(data.key);
            deletedLi.remove();     //JS method
        })

        // function to edit the text
        function edit(id, text) {
            var newTxt = prompt("Edit Text", text);
            var newData = {
                userTask: newTxt
            }

            database.child("users/" + currUserName.uid + "/" + id).update(newData);     // replaces the current object with new one
        }

        // Event listener to update text on UI
        database.child("users/" + currUserName.uid).on("child_changed", function (data) {
            var updateLi = document.getElementById(data.key);
            var getPara = updateLi.firstChild;

            getPara.innerHTML = data.val().userTask;

        })

    }

        // if user doesn't get an object
    else {
        demoInUse = function demo() {
            var userNotSignIn = document.getElementById("userNotSignIn");
            // Alert user
            userNotSignIn.innerHTML = '<div class="alert alert-danger"><strong>Alert!</strong> You are not Signed In.</div>';
        }
    }
});


// function is defined after the firebase method state Changed
function useDemo() { demoInUse(); };

// function to Sign out
function signOut() {
    // firebase method to sign out
    auth.signOut()
    .then(function () {
        // reload the DOM to Sign out
        document.location.reload(true);
    }, function (error) {
        console.log(error.message);
        // User alert code goes here ...
    })

}