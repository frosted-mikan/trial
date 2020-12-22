// function success() {
//     window.alert("Success!");
//     console.log('error');
// }

// function error() {
//     window.alert("Failure!");
//     console.log('success');
// }

var input = document.getElementById("playcode");
function getLength() {
    return input.value.length;
};  
function keyPress() {
    if (getLength() > 0 && event.which === 13) {
        window.alert("yes");
      saveToFirebase(input.value);
    }
};
  

function saveToFirebase(email) {
    var emailObject = {
        email: email
    };

    firebase.database().ref('subscription-entries').push().set(emailObject)
        // .then(function(snapshot) {
        //     success(); // some success method
        // }, function(error) {
        //     // console.log('error' + error);
        //     error(); // some error method
        // });
}

input.addEventListener("keypress", keyPress);
// saveToFirebase(email);