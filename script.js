// function success() {
//     window.alert("Success!");
//     console.log('error');
// }

// function error() {
//     window.alert("Failure!");
//     console.log('success');
// }

// var input = document.getElementById("playcode");
// function getLength() {
//     return input.value.length;
// };  
// function keyPress() {
//     if (getLength() > 0 && event.which === 13) {
//         window.alert("yes");
//       saveToFirebase(input.value);
//     }
// };
  
var config = {
    apiKey: "AIzaSyBWQZYESrRt2aryonDptE9voG6an0f3sAs",
    authDomain: "trial-b8d07.firebaseapp.com",
    projectId: "trial-b8d07",
    storageBucket: "trial-b8d07.appspot.com",
    messagingSenderId: "464877621417",
    appId: "1:464877621417:web:78c8d9d5a29afd719bd9b8",
    measurementId: "G-X58DME4P64"
};
  firebase.initializeApp(config);
  firebase.database().goOnline();

// Get a reference to the database service
var database = firebase.database();

function pressButton() {
    window.alert("Wenaaaa sotooo")
    firebase.database().ref().child("Value").set("Some value")
}

// var database = firebase.database();

// function saveToFirebase(email) {
//     var emailObject = {
//         email: email
//     };

//     firebase.database().ref('subscription-entries').push().set(emailObject)
//         // .then(function(snapshot) {
//         //     success(); // some success method
//         // }, function(error) {
//         //     // console.log('error' + error);
//         //     error(); // some error method
//         // });
// }

// input.addEventListener("keypress", keyPress);
// saveToFirebase(email);