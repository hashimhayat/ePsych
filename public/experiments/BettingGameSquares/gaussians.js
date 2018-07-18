/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function attachGaussian(acolor, angle){

  //var colors = acolor.replace("rgb(", "").replace(")","").split(',');
  //this.bettingGame.currentBlob.c = {r: colors[0], g: colors[1], b: colors[2]}
  var intAngle = int(angle.replace('d',''));
    this.bettingGame.currentBets.push(intAngle);
  
  for (var tempAngle=0; tempAngle<25;tempAngle++)
  {
      var realAngle = (intAngle-(25-tempAngle));
      if (realAngle < 0)
      {
          realAngle = 360 - Math.abs(realAngle);
      }
      GaussianValues[realAngle] = GaussianValues[realAngle] + getGaussian(25,5,25,tempAngle);
      
  }
  for (var tempAngle=25; tempAngle<=50;tempAngle++)
  {
      var realAngle = (intAngle+(tempAngle-25))%360;
      GaussianValues[realAngle] = GaussianValues[realAngle] + getGaussian(25,5,25,tempAngle);
      
  }
  displayGaussians();
}

function displayGaussian(acolor, angle){
  
  //var colors = acolor.replace("rgb(", "").replace(")","").split(',');
  //this.bettingGame.currentBlob.c = {r: colors[0], g: colors[1], b: colors[2]}
  var angle = int(angle.replace('d',''))
  
  angleMode(DEGREES);
  
    stroke(255);
    strokeWeight(6);
    
    push();
    translate(width/2,height/2+offsetTop);
    rotate(angle-(25)%360);
     for (var tempAngle=0; tempAngle<25;tempAngle++)
  {
      rotate(1);
      var realAngle = (angle-(25-tempAngle));
      
      if (realAngle < 0)
      {
          realAngle = 360 - Math.abs(realAngle);
      }
       line(RING_RADIUS+140,0,RING_RADIUS+140+GaussianValues[realAngle]+getGaussian(25,5,25,tempAngle),0);
      
  }
  for (var tempAngle=25; tempAngle<=50;tempAngle++)
  {
      rotate(1);
      var realAngle = (angle+(tempAngle-25))%360;
      
       line(RING_RADIUS+140,0,RING_RADIUS+140+GaussianValues[realAngle]+getGaussian(25,5,25,tempAngle),0);
      
  }
}

function displayGaussians(){
    
    angleMode(DEGREES);
  
    stroke(255);
    strokeWeight(6);
    push();
    translate(width/2,height/2+offsetTop);
    for (var angle=0; angle<360;angle++)
    {
       rotate(1);
       if (GaussianValues[angle] > 0)
       {           
           line(RING_RADIUS+140,0,RING_RADIUS+140+GaussianValues[angle],0);
       }
    }
    pop();
      
}

function getGaussian(mean, standardDeviation, maxHeight,x) {
    return maxHeight * Math.pow(Math.E, -Math.pow(x - mean, 2) / (2 * (standardDeviation * standardDeviation)));
}