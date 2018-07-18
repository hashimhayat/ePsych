
/*
  The Betting Game
  Fougnie Lab
  
  Purpose: The betting game is a task designed to give us information about the visual short-term memories 
           for different stimulus features (e.g., color, orientation) and the degree and type of uncertainty 
           with which they are stored. For this prototype, we will be focusing on color memory. 
           
           Each experiment using this task/paradigm consists of a large number of trials. In each trial the 
           observer is initially presented with a ring of colored dots/blobs (filled in circles), followed 
           by a blank screen during which they are required to remember the colors, followed by a response 
           screen in which a color wheel is presented and the participant can click on locations around the 
           color wheel to indicate where their memory of the color lies in color space.
  
  Stimuli (Blobs): The color of each blob is selected at random from a matrix containing 360 RGB values, which 
           varies continuously through the colors red-purple-blue-green-orange-red so that it can be represented 
           as a color wheel at the end of each trial. The blobs are presented on the screen for 1000msec (1 second). 
           The number of the blobs can be varied by a variable in the program, but the space between in each blob in 
           degrees should be an equal fraction of the total number of degrees in a circle (360). So, for example, when 
           six blobs are present, each blob should be 60 degrees from each neighboring blob. The radius of all blobs 
           is the same and should be able to be set using a variable in the program. The distance from the center of 
           the screen to each blob is the same and should also be set by a variable.
*/

var screenW = window.innerWidth;    // Screen Width
var screenH = window.innerHeight;   // Screen Height
var thecanvas;

// Timer Settings
var score_start_ms = 0;
var score_started = false;
var betting_phase = false;
var scoring_phase = false;
var trial_start = true;
var timer;            // Current Time Keeper
var duration = 1;     // The duration for which the ring stays on the screen.
var start_ms = 0;
var this_ms = 0;
// Color Wheel Settings
var colorwheel;
var COLORS = [];
// Instruction Text
var instructions;

// The Ring
var RING_RADIUS = 180;

// Betting Game Settings

var bettingGame = null;

var SHAPE = "Triangle";

// Ofsets
var offsetTop = 60;

var GaussianValues = new Array(360).fill(0);

var stimulus_timeup = false;
var delay_timeup = false;

var enterPressed = false;

var participant_code = 7788;
var date = new Date()
var gameID = (date.getDate()) + '-' + (date.getMonth() + 1) + '-' + (date.getFullYear()).toString().slice(-2) + '-' + (date.getHours()) + '-' + (date.getMinutes()) + '-' + participant_code;
console.log(gameID)

var bet_errors= [];

function setup() {
  
  thecanvas = createCanvas(screenW,screenH);
  
  refreshBackground();
    
  colorwheel = select("#colorwheel");
  calibrateColorWheel();
  instructions = select('#instructions');

    // Initialize Firebase
  var config = {
    apiKey: "AIzaSyAH7ClrZmtlcrpvuXOlMKvM3aHzkD2J94s",
    authDomain: "bettinggame-121212.firebaseapp.com",
    databaseURL: "https://bettinggame-121212.firebaseio.com",
    projectId: "bettinggame-121212",
    storageBucket: "",
    messagingSenderId: "568954546944"
  };
  firebase.initializeApp(config);

}

function drawFixationCross(size)
{
    
    stroke(0);
    strokeWeight(6);
    push();
    translate(width/2,height/2+offsetTop);
    line(-size,0,size,0);
    line(0,-size,0,size);
    pop();
}

function draw() {

  if (bettingGame)
  {   
      if (bettingGame.gameOver()){
        showInstruction("Game Over. Please don't turn of the window yet.")

        bettingGame = null;
    
      } else {

        if (bettingGame.trialRunning) { 

            this_ms = millis()-start_ms;
            if (this_ms <= 1000)
            {
                
              colorwheel.style('display', 'none');
              bettingGame.ring.hide();
              refreshBackground();
              drawFixationCross(20);
            }
            else if (this_ms > 1000 && this_ms <= 2000)
            {
                bettingGame.ring.show();
                
                  drawFixationCross(20);
            }
            else if (this_ms > 2000 && this_ms <= 3000)
            {
                bettingGame.ring.hide();
                
              drawFixationCross(20);
            }
            else if (this_ms > 3000)
            {
                  drawFixationCross(20);
                  colorwheel.style('display', 'inline-block');
                  bettingGame.betsRemaining = bettingGame.totalBets - bettingGame.currentBets.length;
                  if (bettingGame.betsRemaining > 0)
                  {
                      if (bettingGame.startOfBettingPhase)
                      {
                          bettingGame.correctBlob.resetColor();
                          bettingGame.colorReset=true;
                          bettingGame.startOfBettingPhase = false;
                      }
                      if (bettingGame.betsRemaining > 0)
                      {
                          showInstruction("Place " + bettingGame.betsRemaining + " more bets.");
                      }
                  }
                  else
                  {
                      if (!bettingGame.scoringPhaseStarted)
                      {
                          score_start_ms = millis();
                          bettingGame.scoringPhaseStarted = true;
                          
                          refreshBackground();

                          var c = document.getElementById('d' + bettingGame.correctBlob.i).style.backgroundColor.replace("rgb(", "").replace(")","").split(',');
                          console.log(c)
                          bettingGame.correctBlob.c = {r: c[0], g: c[1], b: c[2]};
                          bettingGame.correctBlob.show();
                          displayGaussians();

                          angleMode(DEGREES);
                          push();
                            translate(width/2,height/2+offsetTop);
                            stroke(0,255,0);
                            strokeWeight(6);
                            rotate(bettingGame.correctBlob.i);
                            line(0,0,RING_RADIUS+140,0);
                          pop();

                          var heightAtCorrectValue = GaussianValues[bettingGame.correctBlob.i];
                          bettingGame.trialPoints = int(heightAtCorrectValue);
                          bettingGame.totalPoints = bettingGame.totalPoints + bettingGame.trialPoints;
                          showInstruction("You earned " + bettingGame.trialPoints+" points for a total of " +bettingGame.totalPoints + " points.");  
                          
                          console.log(bettingGame.currentTrial);

                          var trial = { 
                            trial_num: bettingGame.currentTrial,
                            block_num : 0,
                            trial_in_block : 0,
                            set_size : bettingGame.num_blobs,
                            correct_color : c[0].trim() + "-" + c[1].trim() + "-" + c[2].trim(),
                            color_index: bettingGame.correctBlob.i,
                            height_at_correct_color : heightAtCorrectValue,
                            num_bets : 8,
                            bet_errors : bet_errors
                          };
                          
                          firebase.database().ref('BettingGame/' + gameID + '/' + bettingGame.currentTrial).set(trial);
                      }
                      else
                      {
                          score_time = millis()-score_start_ms;
                          if (score_time > 3000)
                          {
                              score_time = 0;
                              bet_errors = []
                              bettingGame.waitingForEnter = true;
                              showInstruction("Press ENTER for next trial");
                              bettingGame.trialRunning=false;
                              enterPressed = false;
                          }
                      }
                  }
                      
            }
        }
      }
  } 

}

function keyPressed() {

if (keyCode === ENTER && bettingGame && bettingGame.waitingForEnter) {
    
    if (!enterPressed){
      bettingGame.isStart = true;
      bettingGame.runTrial();
      instructions.hide();
      instructions.attribute("align", "center"); 
      enterPressed = true;
    }
  } 
}

function showInstruction(_text){
	instructions.show();
	var pText = "<p>" + _text + "</p>"
  instructions.html(pText, false);
}

function textInCentre(_text){
  textSize(30)
  textAlign(CENTER);
  text(_text, width/2, height/2 + offsetTop);
}

function refreshBackground(){
  background(127,127,127);
}

function calibrateColorWheel(){
  colorwheel.position(width/2 + 240,height/2 - 14 + offsetTop);
}

function windowResized() {
  screenW = window.innerWidth;  
  screenH = window.innerHeight;  
  thecanvas.size(screenW, screenH);
  calibrateColorWheel();
  refreshBackground();
}

function initGame(data) {
    var colorLines = data.split(/\r\n|\n/);
    for (var c = 0; c < colorLines.length; c++){
      var aColor = colorLines[c];
      COLORS.push(aColor);
      var pointer = document.createElement("span");
  		pointer.setAttribute("id", "d" + c)
  		pointer.style.backgroundColor = 'rgb(' + aColor + ')';
  		pointer.style.msTransform = "rotate(" + c + "deg)"
  		pointer.style.webkitTransform = "rotate(" + c + "deg)"
  		pointer.style.MozTransform = "rotate(" + c + "deg)"
  		pointer.style.OTransform = "rotate(" + c + "deg)"
  		pointer.style.transform = "rotate(" + c + "deg)"
  		pointer.onclick = function(){
      
        if (bettingGame.currentBets.length < bettingGame.totalBets)
          {
              attachGaussian(this.style.backgroundColor, this.id);

              let phi = Math.abs(int(bettingGame.correctBlob.i) - int(this.id.replace('d',''))) % 360; 
              let distance = phi > 180 ? 360 - phi : phi;

              bet_errors.push(distance);
          }
  		}
      pointer.onmousemove = function(){
          
          if (bettingGame.betsRemaining > 0)
          {
              var colors = this.style.backgroundColor.replace("rgb(", "").replace(")","").split(',');
              bettingGame.correctBlob.unhide();
              
              bettingGame.correctBlob.c.r = int(colors[0]);
              bettingGame.correctBlob.c.g = int(colors[1]);
              bettingGame.correctBlob.c.b = int(colors[2]);

              refreshBackground();
              bettingGame.correctBlob.show();
              displayGaussians();
              displayGaussian(this.style.backgroundColor, this.id);
          }
      }
  		document.getElementById('colorwheel').appendChild(pointer);
                
    }
    
  bettingGame = new BettingGame(6, 6, 8);
    
}

