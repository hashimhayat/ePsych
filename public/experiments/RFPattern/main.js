/*
Radial Frequency (RF) Pattern Experiment

This experiment uses Radial Frequency (RF) Patterns to test short term memory. 
The user is shown a grid of images, and an image is picked at random and moved at random. The user is then shown an updated grid, 
and is asked to determine if the grid is as per the update shown or not. 
If it is, then the user presses the RIGHT arrow key, if it is not, then the user presses the LEFT arrow key.
It is then repeated for a certain number of trials.

*/



var canvasSize = 450; //This is the size of the Grid
var resolution = 5; //Number of rows
var NUM_IMG = 6; //Number of images in the set
var offSet = 5; //Offst to display the images in the list
var currentTrial = 0; //Current Trial being played
var numTrials = 3; //total number of the trials

var screenW = window.innerWidth;    // Screen Width
var screenH = window.innerHeight; //Screen Height
 
var grid = []; //the grid of pixels
var RFPatterns = []; //the array holding the images
var RFPatternNames = ["Circle","Reuleaux Triangle","Bumpy Circle","Jagged Circle","Circular Pentagon","Star Pentagon","Star"]; //names of the images in the file
var rows = 0; 
var nextRow = 0;
var canvas;
var realMove = false;
var fakeMove = false;
var keyPressedDone = false;
var gameMode = false;
var startTime;
var this_ms =0;
var waitingForEnter = true;
var scoringPhase = false;
var msg;

var randomPosList = []; //A list containing the random positions on the grid that were picked out
var numRandPatterns = 0; //Number of random patterns that will be used
var randNum =0; //used in picking a random image
var index; //index of the picked image
var randImg = 0; //random image in the img array
var randPos = 0; //position of the random image
var pickedPos = 0; //the actual random image picked
var newPos = 0; //the new position determined
var eventRandomiser = 2; //a randomiser that holds the value 0 or 1. If it is 0 then the true updated grid is shown, else the fake one is shown
var randName; //the name of the random image
var randArraySize = 0; //size of the random image array
var randImgArray = []; //the random image list
var randNameArray = []; //list of names corresponding to the random images
var generatedRandom = false; //used to generate random images just once
var redrawn = false; //checks if the canvas has been redrawn 

var xOffset = screenW/3; //offset to position grid in the centre
var yOffset = screenH/4; //offset to position grid in the centre

var x1; //xpos of the randomly picked image
var x2; //ypos of the randomly picked image
var y1; //xpos of the new position
var y2; //ypos of the new position

var isMoved = false;


//this function preloads al the images before runtime of the experiment
function preload(){
    for(var i= 0; i<NUM_IMG; ++i){
        RFPatterns[i]=loadImage("images/"+i+".jpg");
    }
}

//this is used to show the instructions that appear at the top of the screen
function showInstruction(_text){
	instructions.show();
	var pText = "<p>" + _text + "</p>";
  instructions.html(pText, false);
}


//checks for keypress events
function keyPressed(){
	if(keyPressedDone === false && scoringPhase === true){
	console.log(keyCode);
	instructions.hide();	
		if((keyCode === 39) && (realMove === true) && (fakeMove === false)){
			msg = "Correct!";
			console.log("Correct!");
			showInstruction("Correct!");
			keyPressedDone = true;

		}
		else if((keyCode === 39) && (realMove === false) && (fakeMove === true)){
			msg = "Wrong!";
			console.log("Wrong!");
			showInstruction("Wrong!");
			keyPressedDone = true;

		}
		else if((keyCode === 37) && (realMove === false) && (fakeMove === true)){
			msg = "Correct!";
			console.log("Correct!");
			showInstruction("Correct!");
			keyPressedDone = true;

		}
		else if((keyCode === 37) && (realMove === true) && (fakeMove === false)){
			msg = "Wrong!";
			console.log("Wrong!");
			showInstruction("Wrong!");
			keyPressedDone = true;

		}
	}
	
	if (keyCode === ENTER && gameMode === false) {
		instructions.hide();
		instructions.attribute("align", "center"); 
		gameMode = true;
		startTime = millis();
	  }
}


//sets up the canvas and generates the grid
function setup() {
	canvas = createCanvas(screenW, screenH);	
	refreshBackground();
	createGrid();
    instructions = select('#instructions');
}


//runs the loop
function draw() {
	//wait until the user hits enter
	if(gameMode === false){
		refreshBackground();
	}
	
	//check game over condition
	if(currentTrial > numTrials){
		gameMode = false;
		refreshBackground();
		instructions.hide();
        showInstruction("The experiment is now over. Please don't close the window just yet.");
	}
	if(gameMode === true){
		this_ms = millis()-startTime;
		instructions.hide();

		if(this_ms < 500){
			refreshBackground();
			showGrid();
		}
		if(this_ms > 500 && this_ms < 1500){
			if(generatedRandom ===  false){
				createRandomLists();
				pickRandomPos();
			}
		generatedRandom = true;
		
		}
		if(this_ms > 1500 && this_ms < 3500){
			displayRandImages();
		}

		if(this_ms > 3500 && this_ms < 6500){
			if(isMoved === false){
				eventRandomise();
			}
		isMoved = true;
		showInstruction("The "+ randName +" in Row "+(x1+1)+" and Column "+ (y1+1) +" has been moved to Row "+ (x2+1) +" and Column "+ (y2+1));
		}

		if(this_ms > 6500 && this_ms < 8500){
			scoringPhase = true;
		if(msg === "Correct!"){
			showInstruction("Correct!");
		}
		if (msg === "Wrong!"){
			showInstruction("Wrong!");
		}
		}

		if(this_ms > 8500){
			instructions.hide();
			refreshBackground();
			generatedRandom = false;
			isMoved = false;
			realMove = false;
			fakeMove = false;
			keyPressedDone = false;
			scoringPhase = false;
			msg = "";
			this_ms = 0;
			randomPosList = [];
			randImgArray = [];
			randNameArray = [];
            startTime = millis();
            currentTrial++;
		}
	}
}

//forms the basis of the grid
function Pixel() {
	this.size = canvasSize / resolution;
	this.color = (128,128,128);

	this.x = nextRow * this.size + xOffset;
	this.y = rows * this.size + yOffset;

	grid.push(this);

	if(grid.length % resolution == 0) rows++;

	nextRow++;
	if(nextRow == resolution) nextRow = 0;

	this.show = function() {
		stroke(0);
		strokeWeight(5);
		fill(this.color);
		rect(this.x, this.y, this.size, this.size);
    }
}

function showGrid() {
	for(var i = 0; i < grid.length; i++)
	{
        grid[i].show();
	}

}

function createGrid() {
	for(var i = 0; i < resolution * resolution; i++)
	{
		new Pixel();
	}

}

function redrawGrid(){
	grid = [];
	createGrid();
	showGrid();
}

function refreshBackground(){
    background(128,128,128);
}


//this function picks the images and random positions on the grid
function createRandomLists(){
	// Returns a random integer between min (include) and max (include)
	//Math.floor(Math.random() * (max - min + 1)) + min;
	numRandPatterns = Math.floor(Math.random()*4 + 3);
	//console.log("Num of rand patterns is "+numRandPatterns);
	for(var i = 0; i<numRandPatterns; i++){
		randNum = Math.floor(Math.random()*25+ 0);
		randImg = Math.floor(Math.random()*6);
		while(randomPosList.includes(randNum)){
			randNum = Math.floor(Math.random()*25+ 0);
		}
		while(randImgArray.includes(randImg)){
			randImg = Math.floor(Math.random()*6);
		}
		//console.log("pushing random number");
		randomPosList.push(randNum);
		randImgArray.push(randImg);
		randNameArray.push(RFPatternNames[randImg]);	
	}
}


//display the images picked from the previous function
function displayRandImages(){
	for(var i = 0; i<randomPosList.length; i++){
		fill(128);
		image(RFPatterns[randImgArray[i]], grid[randomPosList[i]].x+offSet,grid[randomPosList[i]].y+offSet)
	}
}

//picks a random position on the grid
function pickRandomPos(){
	randArraySize = randomPosList.length;
	pickedPos = Math.floor(Math.random()*randArraySize);
	randNum = randomPosList[pickedPos];
	randName = randNameArray[pickedPos];
	//console.log("The Random Pos is "+randNum);
	x1 = Math.floor(randNum/resolution);
	y1 = randNum % resolution;
	console.log(x1,y1);
	newPos = Math.floor(Math.random()*25+ 0);
	while(randomPosList.includes(newPos)){
		newPos = Math.floor(Math.random()*25+ 0);		
	}
	x2 = Math.floor(newPos/resolution);
	y2 = newPos % resolution;
	console.log(newPos);
	
}

//true update of the grid
function movePosition(){
	showGrid();
	index = randomPosList.indexOf(randNum);
	randomPosList[index] = newPos;
	displayRandImages();
}

//fake update of the grid
function fakeMovePosition(){
	showGrid();
	index = randomPosList.indexOf(randNum);
	randomPosList.splice(index,1);
	newPos = Math.floor(Math.random()*25+ 0);
	while(randomPosList.includes(newPos)){
		newPos = Math.floor(Math.random()*25+ 0);		
	}
	randomPosList.push(newPos);
	displayRandImages();
}


//decides whether or not the next event is going to be the true update or not
function eventRandomise(){
	eventRandomiser = Math.floor(Math.random()*2);
	if(eventRandomiser === 0){
		movePosition();
		realMove = true;
		fakeMove = false;
	}
	else if(eventRandomiser === 1){
		fakeMovePosition();
		fakeMove = true;
		realMove = false;
	}
	else{
		realMove = false;
		fakeMove = false;
	}
	eventRandomiser = 2;	
}


function windowResized() {
	screenW = window.innerWidth;  
	screenH = window.innerHeight;  
	canvas.size(screenW, screenH);
	refreshBackground();
  }