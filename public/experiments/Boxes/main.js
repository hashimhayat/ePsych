var screenW = window.innerWidth; //screen Width
var screenH = window.innerHeight; //screen Height

var MAXTRIALS = 3;

var points = 0; //number of points accumulated
var draws = 25; //number of draws remaining
var trial = 1; //current trial

//these are the three boxes
var A;
var B;
var C;

var offSetNum = 65; //offset between text and number shown at the top
var offSetBox = 100;
var offSetTextY = 120;
var offSetTextX = 50;

var w = 300; //dimensions of the box;
var h = 150; //dimensions of the box


//these three are going to hold three random tokens, all of which are going to be in different ranges.
var rand1 = 0; 
var rand2 = 0;
var rand3 = 0;
var rand = [20,10,15]; //holds the randomised offsets for the start of each trial

//boolean flag to randomise the boxes at the start of each trial
var randomised = false;

//checks if a box is clicked or not(saves clicked state)
var aClicked = false;
var bClicked = false;
var cClicked = false;

//used to start and end experiment
var gameMode = false;

//saves state of box shuffling
var shuffled = false;



//this is used to show the instructions that appear at the top of the screen
function showInstruction(_text){
	instructions.show();
	var pText = "<p>" + _text + "</p>";
  instructions.html(pText, false);
}

//checks if enter key is pressed at the start of the trial
function keyPressed(){
    if (keyCode === ENTER && gameMode === false) {
		instructions.hide();
		instructions.attribute("align", "center"); 
		gameMode = true;
	  }
}

//checks if mouse is clicked inside the box
function mousePressed(){
    if( ((screenW/4-offSetBox < mouseX) && (mouseX<screenW/4-offSetBox+w)) && ((screenH/2-offSetBox < mouseY) && (mouseY<screenH/2-offSetBox+h))){
        checkDraws();
        aClicked = true;
    }
    if( ((screenW/2-offSetBox < mouseX) && (mouseX<screenW/2-offSetBox+w)) && ((screenH/2-offSetBox < mouseY) && (mouseY<screenH/2-offSetBox+h))){
        checkDraws();
        bClicked = true;
    }
    if( ((3*screenW/4-offSetBox < mouseX) && (mouseX<3*screenW/4-offSetBox+w)) && ((screenH/2-offSetBox < mouseY) && (mouseY<screenH/2-offSetBox+h))){
        checkDraws();
        cClicked = true;
    }
}

function setup(){
    createCanvas(screenW,screenH);
    refreshBackground();
    instructions = select('#instructions');
}

//create 3 boxes
A = new Box(screenW/4-offSetBox,screenH/2-offSetBox,w,h);
B = new Box(screenW/2-offSetBox,screenH/2-offSetBox,w,h);
C = new Box(3*screenW/4-offSetBox, screenH/2-offSetBox,w,h);


function draw(){
    if(gameMode === false){
		refreshBackground();
    }
    
    if(trial > MAXTRIALS){
        refreshBackground();
        gameMode = false;
        showInstruction("Your final score is "+points+". Please don't close the window just yet");
    }
    if(gameMode === true){
    refreshBackground();
    displayText();
    displayNumbers();
    drawLine();
    if(randomised === false){
        generateRandomNumbers();
    }
    randomised = true;
    A.display();
    B.display();
    C.display();
    checkClicked();
    delay(200);
    }
}

//clears the screen better than clear() ever did
function refreshBackground(){
    background(255);
}

//displays the text seen during the trials
function displayText(){
    fill(0);
    strokeWeight(0.5);
    textSize(25);
    textStyle(ITALIC);
    text("Current Trial", screenW/4,screenH/9);
    text("Points Earned", screenW/2,screenH/9);
    text("Draws Remaining",3*screenW/4, screenH/9);
    text("A",screenW/4 + offSetTextX, screenH/2 - offSetTextY);
    text("B",screenW/2 + offSetTextX, screenH/2 - offSetTextY);
    text("C",3*screenW/4 + offSetTextX, screenH/2 - offSetTextY);
}


//displays the scores and other number stuff
function displayNumbers(){
    fill(0);
    strokeWeight(0.5);
    textSize(36);
    text(trial, screenW/4+offSetNum, screenH/6);
    text(points, screenW/2 + offSetNum, screenH/6);
    text(draws, 3*screenW/4 + offSetNum, screenH/6);
}

//draws that borderline you see at the top of the screen
function drawLine(){
    stroke(153);
    strokeWeight(0.5);  
    line(0,screenH/5,screenW,screenH/5); 
}

//Math.floor(Math.random() * (max - min + 1)) + min;

//generates numbers for the boxes
function generateRandomNumbers(){
    rand1 = Math.floor(Math.random()*31-rand[0]); //random numbers between 10 and -20
    rand2 = Math.floor(Math.random()*31-rand[1]); //generates random numbers between -10 and 20
    rand3 = Math.floor(Math.random()*31-rand[2])//generates random numbers between -15 and 15
}

//box class
function Box(x,y,w,h){
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;

    this.display = function(){
        stroke(0);
        fill(200,200,200);
        strokeWeight(1);
        rect(this.x, this.y, this.w, this.h);

        if(((this.x<mouseX)&&(mouseX<this.x+this.w)) && ((mouseY>this.y) &&(mouseY<this.y+h))){
            fill(240,240,240);
            strokeWeight(1);
            rect(this.x, this.y, this.w, this.h);
        }
    }
}

//checks the status of the remaining draws
function checkDraws(){
    if(draws != 0){
        draws--;
    }
    else if(draws === 0){
        console.log(rand);
        draws = 25;
        trial++;
        rand = shuffleArray(rand);
    }
}

//does stuff when a box is clicked, shows scores and whatnot
function checkClicked(){
    if(aClicked === true){
        points = points + rand1;
        if(rand1 > 0){
            fill(10,240,10);
            textSize(50);
            strokeWeight(0.5);
            text("+"+rand1,screenW/4-offSetBox+110,screenH/2-offSetBox+80); 
            aClicked = false;

        }
        else if(rand1 < 0){
            fill(240,10,10);
            textSize(50);
            strokeWeight(0.5);
            text(rand1,screenW/4-offSetBox+110,screenH/2-offSetBox+80);
            aClicked = false;

        }
    }
    if(bClicked === true){
        points = points + rand2;
        if(rand2 > 0){
            fill(10,240,10);
            textSize(50);
            strokeWeight(0.5);
            text("+"+rand2,screenW/2-offSetBox+110,screenH/2-offSetBox+80);
            bClicked = false;
        }
        else if(rand2 < 0){
            fill(240,10,10);
            textSize(50);
            strokeWeight(0.5);
            text(rand2,screenW/2-offSetBox+110,screenH/2-offSetBox+80);
            bClicked = false;
        }
    }
    if(cClicked === true){
        points = points + rand3;    
        if(rand3 > 0){
            fill(10,240,10);
            textSize(50);
            strokeWeight(0.5);
            text("+"+rand3,3*screenW/4-offSetBox+110,screenH/2-offSetBox+80);
            cClicked = false;
        }
        else if(rand3 < 0){
            fill(240,10,10);
            textSize(50);
            strokeWeight(0.5);
            text(rand3,3*screenW/4-offSetBox+110,screenH/2-offSetBox+80);
            cClicked = false;
        }
    }
    generateRandomNumbers();
}


//Fisher Yates Shuffle algorithm used to shuffle the array of rand
function shuffleArray(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
  
    
    while (0 !== currentIndex) {
  
      
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
  }

function delay(ms) {
    var cur_d = new Date();
    var cur_ticks = cur_d.getTime();
    var ms_passed = 0;
    while(ms_passed < ms) {
    var d = new Date(); // Possible memory leak?
    var ticks = d.getTime();
    ms_passed = ticks - cur_ticks;
    // d = null; // Prevent memory leak?
    }
}
    
    