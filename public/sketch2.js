var socket = io();

//SET GENESYS DICE
//POSITIVE DICE [SUCCESS, ADV, TRIUMPH] | NEGATIVE DICE [FAILURE, DISADVANTAGE, DISPAIR]
const BOOST = [[0,0,0],[0,0,0],[1,0,0],[1,1,0],[0,2,0],[0,1,0]];
const ABILITY = [[0,0,0],[1,0,0],[1,0,0],[2,0,0],[0,1,0],[0,1,0],[1,1,0],[0,2,0]];
const PROFICIENCY = [[0,0,0],[1,0,0],[1,0,0],[2,0,0],[2,0,0],[0,1,0],[1,1,0],[1,1,0],[1,1,0],[0,2,0],[0,2,0],[0,0,1]];
const SETBACK = [[0,0,0],[0,0,0],[1,0,0],[1,0,0],[0,1,0],[0,1,0]];
const DIFFICULTY = [[0,0,0],[1,0,0],[2,0,0],[0,1,0],[0,1,0],[0,1,0],[0,2,0],[1,1,0]];
const CHALLENGE = [[0,0,0],[1,0,0],[1,0,0],[2,0,0],[2,0,0],[0,1,0],[0,1,0],[1,1,0],[1,1,0],[0,2,0],[0,2,0],[0,0,1]];


function setup() {
    // createCanvas(600, 400);
    // background(51);
    socket = io();
    // socket = io.connect('http://localhost:3000');
    // socket.on('mouse', newDrawing);
    socket.on('dice', recieveDie);
    socket.on('roll', updateDice);
    
}

var playerID = 0;
socket.on('newPlayer', setID);

var logContainer = document.getElementById('diceLog');


function setID(data) {
    playerID = data;
    playerIDContainer = document.querySelector('#playerID span');
    playerIDContainer.innerHTML = playerID;
}

function resetId() {
    playerID = document.getElementById('idInput').value;
    playerIDContainer = document.querySelector('#playerID span');
    playerIDContainer.innerHTML = playerID;
}

function addDie(value, type="poly") {
    var newDie = [value, type];
    socket.emit('dice', newDie);
    var dicePool = document.getElementById('diceTray');
    if (type === "poly") {
        dicePool.innerHTML += "<div class='dice' data-value='"+ value + "'>d" + value + "</div>";
        //Send message for log
        logContainer.innerHTML += playerID + " has added a d" + value + " to the pool.<br/>";
    } else {
        dicePool.innerHTML += "<div class='dice " + type + "' data-value='"+ value + "'>" + type[0] + "</div>";
        logContainer.innerHTML += playerID + " has added a " + type + " die to the pool.<br/>";
    }
}

function recieveDie(newDie) {
    var dicePool = document.getElementById('diceTray');
    if (newDie[1]=== "poly") {
        dicePool.innerHTML += "<div class='dice' data-value='"+ newDie[0] + "'>d" + newDie[0] + "</div>";
        //Recieve message for log
        logContainer.innerHTML += playerID + " has added a d" + newDie[0] + " to the pool.<br/>";
    } else {
        dicePool.innerHTML += "<div class='dice " + newDie[1] + "' data-value='"+ newDie[0] + "'>" + newDie[1][0] + "</div>";
        logContainer.innerHTML += playerID + " has added a " + newDie[1] + " die to the pool.<br/>";
    }
}

function rollDice() {
    var diceArray = document.getElementsByClassName('dice');
    var diceValue =[];
    for (i=0; i<diceArray.length; i++) {
        maxValue = diceArray[i].dataset.value;
        diceValue[i] = [];
        diceValue[i][1] = Math.floor(Math.random() * maxValue + 1);
        if (diceArray[i].classList.value === "dice") {
            diceArray[i].innerHTML = diceValue[i][1];
            diceValue[i][0] = "poly";
        } else {
            var dieType = diceArray[i].classList.value.split(' ')[1];
            diceValue[i][0] = dieType;
            if (dieType === "boost") {
                diceArray[i].innerHTML = BOOST[diceValue[i][1]-1];
                diceArray[i].classList = "dice boost " + (diceValue[i][1] - 1);
            } else if (dieType === "ability") {
                diceArray[i].innerHTML = ABILITY[diceValue[i][1]-1];
                diceArray[i].classList = "dice ability " + (diceValue[i][1] - 1);
            } else if (dieType === "proficiency") {
                diceArray[i].innerHTML = PROFICIENCY[diceValue[i][1]-1];
                diceArray[i].classList = "dice proficiency " + (diceValue[i][1] - 1);
            } else if (dieType === "setback") {
                diceArray[i].innerHTML = SETBACK[diceValue[i][1]-1];
                diceArray[i].classList = "dice setback " + (diceValue[i][1] - 1);
            } else if (dieType === "difficulty") {
                diceArray[i].innerHTML = DIFFICULTY[diceValue[i][1]-1];
                diceArray[i].classList = "dice difficulty " + (diceValue[i][1] - 1);
            } else if (dieType === "challenge") {
                diceArray[i].innerHTML = CHALLENGE[diceValue[i][1]-1];
                diceArray[i].classList = "dice challenge " + (diceValue[i][1] - 1);
            }
            diceValue[i][2] = diceArray[i].innerHTML;
        }
    }
    socket.emit('roll', diceValue);
    logContainer.innerHTML += playerID + " has rolled the dice."
}

function updateDice(newValues) {
    var diceArray = document.getElementsByClassName('dice');
    for (i=0; i<diceArray.length; i++) {
        if (newValues[i][0] === "poly") {
            diceArray[i].innerHTML = newValues[i][1];
        } else {
            diceArray[i].innerHTML = newValues[i][2];
            diceArray[i].classList = "dice " + newValues[i][0] + " " + newValues[i][1];
        }
        
    }
    logContainer.innerHTML += playerID + " has rolled the dice."
}

