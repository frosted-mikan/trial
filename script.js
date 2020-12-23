    //WRITE TO PAGE:
    //establishes root of db
    var rootRef = firebase.database().ref();
     
    //creates ref for node
    var ref = rootRef.child('Players');
    
    // gets values from database and changes html
    ref.on('value', function(snap) { 
    //re-initializes answer in html, so doesn't repeat
    document.getElementById("answer").innerHTML = "";
    //gets values for each element in data set   

    snap.forEach(function(child){
        if (child.val().roomcode == "ABCDE") {
            document.getElementById("answer").innerHTML += "<li>" + child.val().name + "</li>";
        }
        
    });
});    

/*
What the database could look like: 
Game:
  --game1
     --Code: ABCD
     --Suspects:
        --player1:
           --name: Ambo
           --status: normal
        --player2:
           --name: Mikan
           --status: spy
     --Locations:
        --location1: airplane
        --location2: museum
  --game2
  --game3
*/
/* 
LESS NESTED VER:
Spyfall:
    --Games:
        --game1:
            code: ABCD
        --game2:
        --game3:
    --Players:
        --player1:
            name: Ambo
            role: norm
            code: ABCD
        --player2:
            name: Mikan
            role: spy
            code: ABCD
    --Locations:
        --location1:
            name: Airplane
            code: ABCD
        --location2:
            name: Museum
            code: ABCD
*/
/* 
Write: if (code == code) print out suspects or locations 
Delete game when finished?
*/
