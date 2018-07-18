/*
  The Ring of Gabor Patches.
  
  Attributes
  x : x position on screen
  y : y position on screen
  n : Number of Gabor Patches
  r : radius of the Ring
  
  Functions
  create : creates the Ring
  show : shows the Ring
  hide: hides the Ring
*/

function Ring (x,y,n,r, imgsize){
  
    this.x = x;
    this.y = y;
    this.n_patches = n;
    this.radius = r;
    this.patches = [];
    this.xcords = [];
    this.ycords = [];
    this.size = imgsize;
    //Let's load a random set of images first, for the purpose of 
    //an example, lets say 4 and work from there
  
    var checkrepeats = []; //stores values already loaded 
    
  
    for(var numpatch =0; numpatch < n; numpatch++){
      var randint = Math.floor(Math.random() * 9 + 1); //generate random number from one to ten
          
      while(checkrepeats.includes(randint)){
        randint = Math.floor(Math.random() * 9 + 1); //keep generating random numbers if its already been generated
      }
      checkrepeats.push(randint); //store the number that was generated
  
      this.patches.push(img[randint]); //add the image corresponding to the index to the new array
      console.log(checkrepeats);
    }
  
    var div = 360/this.n_patches; //get the angle of separation 
  
    for (var b = 0; b < this.n_patches; b++){
      this.xcords[b] = Math.cos((div*b) * (Math.PI / 180)) * this.radius;
      this.ycords[b] = Math.sin((div*b) * (Math.PI / 180)) * this.radius; 
  }
      var cross = 20;
    this.show = function(){
      for(var b =0; b < this.n_patches; b++){
        image(this.patches[b],this.x+this.xcords[b]-cross,this.y+this.ycords[b]-cross,this.size, this.size);
      }
    };  
    this.printstuff = function(){
      console.log(this.xcords);
          console.log(this.ycords);
    };
      
      this.clearScreen = function(){
          background(220);
      };

  }
  
  