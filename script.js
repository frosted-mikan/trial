//establishes root of db
var rootRef = firebase.database().ref();
    
//creates ref for node
var ref = rootRef.child('Players');

//creates ref for locations 
var locref = rootRef.child('Locations');

//Write list of suspects on pre-game screen
function writeList(roomcode){
    // gets values from database and changes html
    ref.on('value', function(snap) { 
        //re-initializes answer in html, so doesn't repeat
        document.getElementById("answer").innerHTML = "";
        //gets values for each element in data set   
    
        snap.forEach(function(child){
            if (child.val().roomcode == roomcode) { 
                document.getElementById("answer").innerHTML += "<li>" + child.val().name + "</li>";
            }
        });
    });        
    checkCondition(roomcode); //call and keep checking
}

//List all suspects on in-game screen and vote screen 
function listSuspects(roomcode){
    ref.on('value', function(snap) { 
        //re-initializes answer in html, so doesn't repeat
        document.getElementById("answer").innerHTML = "";
        //gets values for each element in data set   
    
        snap.forEach(function(child){
            if (child.val().roomcode == roomcode) { 
                document.getElementById("answer").innerHTML += "<li>" + child.val().name + "</li>";
            }
        });
    });    
}

//Write list of locations on host screen, in-game screen, and vote screen
function writeLocations(roomcode) {
    locref.on('value', function(snap) { 
        document.getElementById("location").innerHTML = "";        
        snap.forEach(function(child){
            if (child.val().roomcode == roomcode) { 
                document.getElementById("location").innerHTML += "<li>" + child.val().location + "</li>";
            }
        });
    });        
}

//Get role of player for in-game 
function getRole(playername){
    ref.on('value', function(snap) { 
        document.getElementById("role").innerHTML = "";    
        snap.forEach(function(child){
            if (child.val().name == playername) { 
                if (child.val().role == "spy") {
                    document.getElementById("role").innerHTML += "<li>" + child.val().role + "</li>";
                }else {
                    getLocation(child.val().roomcode);
                }
            }
        });
    });     
}

//Get location that all non-spy players are at for in-game
function getLocation(roomcode) {
    locref.on('value', function(snap) { 
        document.getElementById("role").innerHTML = "";        
        snap.forEach(function(child){
            if (child.val().roomcode == roomcode && child.val().role == "here") { 
                document.getElementById("role").innerHTML += "<li>" + child.val().location + "</li>";
            }
        });
    });        
}

//For vote page: global var to keep track of role
var roleSpy = false;
//Generate list of locations or suspects for vote 
function getVoteList(name, roomcode){
    ref.on('value', function(snap) { 
        snap.forEach(function(child){
            if (child.val().name == name) { 
                if (child.val().role == "none") {
                    listSuspects(roomcode);
                }else {
                    roleSpy = true;
                    writeLocations(roomcode);
                }
            }
        });
    });        
}

//Generate results from vote 
function voteResult(choice, roomcode) {
    var winner;
    if (roleSpy) {
        //check if choice is correct location 
        var resulttrack = false;
        locref.on('value', function(snap){
            snap.forEach(function(child){
                if (child.val().location == choice && child.val().role == "here"){
                    resulttrack = true;
                    winner = "spy";
                }
            });
        });
        if (!resulttrack){
            winner = "none";
        }
    }else {
        //check if choice is correct player
        var resulttrack = false;
        ref.on('value', function(snap){
            snap.forEach(function(child){
                if (child.val().name == choice && child.val().role == "spy"){
                    resulttrack = true;
                    winner = "none";
                }
            });
        });
        if (!resulttrack){
            winner = "spy";
        }
    }
    updateVote(winner, roomcode);
}

//voter updates winner to whoever won
function updateVote(winner, roomcode){
    var gameRef = rootRef.child('Games');
    var updateStatus = gameRef.child(roomcode); 
    updateStatus.on('value', function(snap){
        updateStatus.update({
            "winner": winner
        });
    });
}
  
//check to see if winner status has been determined (calls itself recursively if not)
function checkWin(roomcode) {
    var gameref = rootRef.child('Games');
    var status = gameref.child(roomcode);
    status.on('value', function(snap){
        if (snap.val().winner == "spy"){
            if (roleSpy){
                document.getElementById("gameresult").innerHTML = "YOU WIN!";
            }else {
                document.getElementById("gameresult").innerHTML = "YOU FAILED";
            }
            deleteGame(roomcode);
        }else if (snap.val().winner == "none"){
            if (roleSpy){
                document.getElementById("gameresult").innerHTML = "YOU FAILED";
            }else {
                document.getElementById("gameresult").innerHTML = "YOU WIN!";
            }
            deleteGame(roomcode);
        }
        else {
            checkWin();
        }
    });
}

//TODO: fix this 
//Delete the game, all players, and locations from database when finished
//(should this also happen when "Back to Start" is clicked?)
function deleteGame(roomcode){
    //delete Game
    var gameref = rootRef.child('Games');
    gameref.child(roomcode).remove();


    //delete individual player
    // ref.child(sessionStorage["playerid"]).remove();

    //delete Players (except host??)
    var query = ref.orderByChild('roomcode').equalTo(roomcode);
    query.on('child_added', (snapshot) => {
        snapshot.ref.remove();
        // snapshot.forEach(function(child) {
        //     child.remove();
        // });
    });

    //delete Locations?? Doesn't work???
    // var locquery = locref.orderByChild("roomcode").equalTo(roomcode);
    // locquery.on("value", function(snapshot) {
    //     snapshot.forEach(function(child) {
    //         child.remove();
    //     });
    // });
}

// var ref = firebase.database().ref("dinosaurs");
// ref.orderByKey().on("child_added", function(snapshot) {
//   console.log(snapshot.key);
// });

// var ref = new Firebase('https://yours.firebaseio.com/items');
// var lastKnownKey = null;
// var firstQuery = ref.orderByKey().limitToFirst(100);
// firstQuery.once('value', function(snapshot) {
//   snapshot.forEach(function(childSnapshot) {
//     lastKnownKey = childSnapshot.key();
//   });
// });

// function getprofile() {
//     return firebase.database().ref('users/'+useruid+'/')
//     .once('value')
//     .then(function(bref) {
//         var username= bref.val().username;
//         var provider= bref.val().provider;
//         var submitedpic=bref.val().profilepic;
//         var storageRef = firebase.storage().ref();
//         console.log("The current ID is: "+useruid+" and the current username is: "+username+'/provider is: '+provider+'/pic is :'+submitedpic);
//         // return the values here, in the form of an object
//         return {
//             useruid: useruid,
//             username: username,
//             provider: provider,
//             submitedpic: submitedpic,
//             storageRef: storageRef
//         };
//         // or simply return the value returned by firebase
//         /*
//         return bref;
//         */
//     });
// }

// async function getIndex() {
//     // var lastKey = null;
//     firstQuery.once('value', function(snap){
//         snap.forEach(function(childSnap){
//             // lastKey = childSnap.key();
//             // return lastKey;
//             // return childSnap.key();
//             // var lastKey = childSnap.key;
//             // return lastKey;
//             const lastKey = await childSnap.key();
//             return lastKey;
//         });
//     });
// }


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

//pick a spy by putting all keys of players in game in array, and picking random index 
//putting child.key() in an array doesn't work 
// function pickSpyArray(roomcode) {
//     var playarr = [];
//     ref.on('value', function(snap) { 
//         snap.forEach(function(child){
//             if (child.val().roomcode == roomcode) { 
//                 playarr.push(child.key());
//             }
//         });
//     });    
    
//     var i = Math.floor(Math.random() * playarr.length);
//     var updateRole = ref.child(playarr[i]);
//     updateRole.on('value', function(snap){
//         updateRole.update({
//             "role":"spy"    
//         }); 
//     });     
// }

//due to the overriding index of key names for players, this doesn't work in practical situations
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
    pickLocation(3, roomcode);
    startGame(roomcode);
}

//Attempt to save here-location under Games instead of Locations 
//due to the overriding index of key names for locations, this doesn't work in practical situations
// function pickLocation(numLoc, roomcode) {
//     alert("entered");
//     var pick = false;
//     var locref = rootRef.child('Locations');
//     var hereloc;
//     while (!pick){
//         var i = Math.floor(Math.random() * numLoc);
//         var herelocref = locref.child(i);
//         herelocref.on('value', function(snap){
//             if (snap.val().roomcode == roomcode){
//                 hereloc = snap.val().location;
//                 pick = true;
//             }
//         });
//     }
//     var gameref = rootref.child('Games');
//     var updateLoc = gameref.child(roomcode);
//     updateLoc.on('value', function(snap){
//         updateLoc.update({
//             "location": hereloc
//         });
//     });
// }

//due to the overriding index of key names for locations, this doesn't work in practical situations
function pickLocation(numLoc, roomcode) {
    var pick = false;
    while (!pick){
        var i = Math.floor(Math.random() * numLoc);
        var updateRole = locref.child(i);    
        updateRole.on('value', function(snap){
            if (snap.val().roomcode == roomcode){ 
                updateRole.update({
                    "role":"here"    
                }); 
                pick = true;       
            }
        });     
    }
}

//Redirect all players with roomcode to ingame.html on press Start
//Idea: update game status (in database) onclick start on host page
//all join pages check for game status
//if game status == true all join pages update to ingame 
function startGame(roomcode){
    //Host updates game status to true
    var gameRef = rootRef.child('Games');
    var updateStatus = gameRef.child(roomcode); 
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


//Functions to go from ingame to vote screen
function startVote(roomcode){
    //Any player updates game vote status to true
    var gameRef = rootRef.child('Games');
    var updateStatus = gameRef.child(roomcode); 
    updateStatus.on('value', function(snap){
        updateStatus.update({
            "vote": true
        });
    });
}
  
//check to see if vote status has been set to true (calls itself recursively if not)
function checkVote(roomcode) {
    var gameref = rootRef.child('Games');
    var status = gameref.child(roomcode);
    status.on('value', function(snap){
        if (snap.val().vote == true){
            goVote();
        }
        else {
            checkVote(roomcode);
        }
    });
}


//load vote page 
function goVote() {
    window.location.href='vote.html';
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
