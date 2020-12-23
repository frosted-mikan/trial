    //WRITE TO PAGE:
    //establishes root of db
    var rootRef = firebase.database().ref();
     
    //creates ref for node
    var ref = rootRef.child('Registration');
    
    // gets values from database and changes html
    ref.on('value', function(snap) { 
    //re-initializes answer in html, so doesn't repeat
    document.getElementById("answer").innerHTML = "";
    //gets values for each element in data set   
    snap.forEach(function(child){
    document.getElementById("answer").innerHTML += "<li>" + child.val().name + "</li>";
        
    });
});    

