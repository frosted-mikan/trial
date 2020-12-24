//establishes root of db
var rootRef = firebase.database().ref();
    
//creates ref for node
var ref = rootRef.child('Players');

function writeList(roomcode){
    // gets values from database and changes html
    ref.on('value', function(snap) { 
        //re-initializes answer in html, so doesn't repeat
        document.getElementById("answer").innerHTML = "";
        //gets values for each element in data set   
    
        snap.forEach(function(child){
            if (child.val().roomcode == roomcode) { //==roomcode
                document.getElementById("answer").innerHTML += "<li>" + child.val().name + "</li>";
            }
        });
    });        
    checkCondition(roomcode); //call and keep checking
}

// //makes count
// function makeCount(count) {
//     firebase.database().ref('Count/').set({
//         count: count
//     });
// }

// //add one to count (also need to subtract 1 when player leaves)
// function updateCount() {
//     firebase.database().ref('Count').once('value').then((snapshot) => {
//         makeCount(snapshot.val().count + 1);
//         return snapshot.val().count+1;
//     });
// }

// function pickAgain () {
//     alert("called");
//     firebase.database().ref('Count').once('value').then((snapshot) => {
//         pickSpy2(snapshot.val().count);
//     });
// }

// function pickSpy2(numPlayers) {
//     alert("called2");
//     const randomIndex = Math.floor(Math.random() * numPlayers);
//     alert(randomIndex);

//     var updateRef = ref.orderByKey().startAt(randomIndex).limitToLast(1);
//     updateRef.on('value', function(snap){
//         alert("entered");
//         // if (snap.val().roomcode == roomcode) {
//             updateRef.update({
//                 "role":"spy"
//             });
//         // }
//     });
// }

function pickSpy(numPlayers, roomcode) {
    var pick = false;
    while (!pick){
        var i = Math.floor(Math.random() * numPlayers);
        var updateRole = ref.child(i);    
        updateRole.on('value', function(snap){
            if (snap.val().roomcode == roomcode){ //==roomcode
                updateRole.update({
                    "role":"spy"    
                }); 
                pick = true;       
            }
        });     
    }

    startGame(roomcode);
}

//Redirect all players with roomcode ABCDE to ingame.html on press Start
//Idea: update game status (in database) onclick start on host page
//all join pages check for game status
//if game status == true all join pages update to ingame 
function startGame(roomcode){
    //Host updates game status to true
    var gameRef = rootRef.child('Games');
    var updateStatus = gameRef.child(roomcode); //child(roomcode)
    updateStatus.on('value', function(snap){
        updateStatus.update({
            "status": true
        });
    });
}
  
//check to see if game status has been set to true (calls itself recursively if not)
function checkCondition(roomcode) {
    var gameref = rootRef.child('Games');
    var status = gameref.child(roomcode);
    status.on('value', function(snap){
        if (snap.val().status == true){
            goInGame();
        }
        else {
            checkCondition();
        }
    });
}


//load ingame page
function goInGame() {
    window.location.href='ingame.html';
}


// //check to see if game status has been set to true
// async function fetchGame() {
//     const response = await fetch(getGameUrl);
//     return response.json();
// }

// //Checks if condition is met (calls itself recursively if not)
// async function playerLobbyLongPoll() {
//     const game = await fetchGame();
//     if (game.is_started === true) {
//       startGame();
//     } else {
//         //wait four seconds and check again
//       setTimeout(() => {
//         playerLobbyLongPoll(lobby);
//       }, 4000);
//     }
// }

/*
What the database could look like: 
Game:
  --game1
     --Code: ABCD
     --Time: 5
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
            time: 5
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
