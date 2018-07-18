
var screenW = window.innerWidth; //canvas width
var screenH = window.innerHeight; //canvas height

var MAXBALLOONS = 10; //Max number of balloons
var offSet = 50; //offset to space apart text and numbers at the top
var offSetText = 25;

var rad = 150; //radius of the fixed outer circle
var numPumps = 0; //keep track of the number of pumps
var numBalloons = 1; //keep track of number of balloons
var points = 0; //keep track of number of points accumulated
var saved = false; //saves the state of the save button 
var popNum = 0; //the number at which the balloon pops
var randgen = false; //saves the state of the genPopNum() function;
var baseRad = 0;
var gameMode = false;
var incremented = false;



//checks if the buttons are clicked
function mousePressed(){
    //this is for pump button
    if(((screenW/8<mouseX)&&(mouseX<screenW/8+120)) && ((mouseY>screenH/2+rad) &&(mouseY<screenH/2+rad+40))){
        if(numPumps != popNum){
            baseRad += 10;
            numPumps++;
        }
        
    }

    //for the save button
    if(((screenW/8<mouseX)&&(mouseX<screenW/8+120)) && ((mouseY>screenH/2+1.5*rad) &&(mouseY<screenH/2+1.5*rad+40))){
        saved = true;
        points = points + numPumps;
        baseRad = 0;
        numPumps = 0;
        randgen = false;
        drawBalloon();
        if(incremented === false){
            numBalloons++
            incremented = true;
        }
    }

}
function showInstruction(_text){
	instructions.show();
	var pText = "<p>" + _text + "</p>";
  instructions.html(pText, false);
}

function keyPressed(){
    if (keyCode === ENTER && gameMode === false) {
		instructions.hide();
		instructions.attribute("align", "center"); 
		gameMode = true;
	  }
}

function setup(){
    createCanvas(screenW, screenH);
    //refreshBackground();
    instructions = select('#instructions');
    
}



function draw(){
    refreshBackground();
    if((gameMode === false) && (numBalloons === MAXBALLOONS)){
        refreshBackground();
        showInstruction("You earned a total of "+points+". Please don't close the window just yet");
    }
    if (gameMode === false){
		refreshBackground();
    }
    
    if(gameMode === true){
    refreshBackground();
    drawBaseEllipse();
    displayText();
    displayNumbers();
    displayButtons();
    drawBaseEllipse();
    if(randgen === false){
        genPopNum();
    }
    randgen = true;

    if(numBalloons === MAXBALLOONS){
        refreshBackground();
        gameMode = false;
    }

    if(numPumps != popNum){
        drawBalloon();
        incremented = false;
    }
    if (numPumps === popNum){
        popBalloon();
        baseRad = 0;
        numPumps = 0;
        drawBalloon();
        randgen = false;
        if(incremented === false){
            numBalloons++;
            incremented = true;
        }
    }
    
}
    
    
    
}

//draws the balloon with each click of pump
function drawBalloon(){
    fill(120,120,120);
    ellipse(screenW/2,screenH/2,baseRad,baseRad);
}

//shows the balloon in red once it pops
function popBalloon(){
    fill(255,0,0);
    ellipse(screenW/2,screenH/2,baseRad,baseRad);
}


//clears screen better than the clear() function ever did
function refreshBackground(){
    background(255);
}

//draws the outline ellipse
function drawBaseEllipse(){
    noFill();
    strokeWeight(2);  
    ellipse(screenW/2,screenH/2,150,150);
}

//displays headers for counters + scores
function displayText(){
    fill(0);
    textSize(25);
    textStyle(ITALIC);
    strokeWeight(0.001);
    text("Balloon",screenW/8, screenH/8);
    text("Pumps",screenW/2-rad/4,screenH/8);
    text("Points",(screenW*3)/4,screenH/8);
}

//displays counters + score
function displayNumbers(){
    fill(0);
    textSize(30);
    strokeWeight(0.001);
    text(numBalloons + " of " + MAXBALLOONS, screenW/8, screenH/8 + offSet);
    text(numPumps, screenW/2-rad/8, screenH/8+offSet);
    text(points, (screenW*3)/4+rad/8,screenH/8+offSet);

}

function displayButtons(){
  //displays the rectangular outline of the buttons
  fill(200,200,200);
  strokeWeight(2);
  rect(screenW/8, screenH/2+rad, 120, 40);
  rect(screenW/8,screenH/2+ 1.5*rad,120,40);
  
  //displays the text in the buttons
  fill(0)
  textSize(22);
  textStyle(BOLD);
  strokeWeight(0.001);
  text("Pump!", screenW/8+offSetText, screenH/2+rad+offSetText);
  text("Save!",screenW/8+offSetText, screenH/2+1.5*rad+offSetText);

  //adds glow effect when mouse hovers over a button
  if(((screenW/8<mouseX)&&(mouseX<screenW/8+120)) && ((mouseY>screenH/2+rad) &&(mouseY<screenH/2+rad+40))){
      fill(240,240,240);
      strokeWeight(2);
      rect(screenW/8, screenH/2+rad, 120, 40);
      fill(0);
      text("Pump!", screenW/8+offSetText, screenH/2+rad+offSetText);
  }

  if(((screenW/8<mouseX)&&(mouseX<screenW/8+120)) && ((mouseY>screenH/2+1.5*rad) &&(mouseY<screenH/2+1.5*rad+40))){
    fill(240,240,240);
    strokeWeight(2);
    rect(screenW/8, screenH/2+1.5*rad, 120, 40);
    fill(0);
    text("Save!", screenW/8+offSetText, screenH/2+1.5*rad+offSetText);
}

}


function genPopNum(){
    //this generates a random number between 1 and 12 that determines the number at which the balloon pops
    popNum = Math.floor(Math.random()*12);
}



