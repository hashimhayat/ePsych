/*
  The Betting Game
  
  Attributes

  Functions
  
*/

function BettingGame(trials, num_blobs, total_bets){
  
      this.trials = trials;
      this.correctBlobColor = null;
      this.correctBlob = null;
      this.num_blobs = num_blobs;
      this.ring = null;
      this.totalBets = total_bets;
      // Current Session
      this.trialRunning = false;
      this.currentTrial = 0;
      this.currentBets = [];
      this.waitingForEnter = true;
      this.fixationPhase = true;
      this.stimulusPhase = false;
      this.delayPhase = false;
      this.bettingPhase = false;
      this.scoringPhase = false;
      this.isStart = false;
      this.totalPoints = 0;
      this.trialPoints = 0;
      this.betsRemaining = 0;
      this.scoringPhaseStarted = false;
      this.colorReset = false;
      this.startOfBettingPhase = false;
      this.displayBlob = false;
  
  
  this.runTrial = function(){   
      
      if (this.isStart){
          
            this.ring = new Ring (window.innerWidth/2,window.innerHeight/2 + offsetTop, this.num_blobs, RING_RADIUS, SHAPE);
            this.currentBlob = null;
            this.scoringPhaseStarted = false;
            this.betsRemaining = this.totalBets;
            this.currentBets = [];
            this.trialPoints = 0;
            this.trialRunning = true;
            this.waitingForEnter = false;
            this.currentTrial++;
            GaussianValues = new Array(360).fill(0);
            this.isStart = false;
            start_ms = millis();
            this.colorReset = false;
            this.startOfBettingPhase = true;
        
        var randIdx = int(random(0, this.ring.blobs.length));
        this.correctBlob = this.ring.blobs[randIdx];
        return this.ring.blobs[randIdx].c;
    }
  }

  this.showBets = function(){
      displayGaussians();
  }

  this.gameOver = function(){
    if (this.currentTrial > this.trials){
      return true;
    } 
    return false;
  }
  
  
}