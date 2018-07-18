/*
  The Ring of Blobs.
  
  Attributed
  x : x position on screen
  y : y position on screen
  n : Number of Blobs
  r : radius of the Ring
  
  Functions
  create : creates the Ring
  show : shows the Ring
  hide: hides the Ring
*/
function Ring (x,y,n,r, shape){
  
  this.x = x;
  this.y = y;
  this.n_blobs = n;
  this.radius = r;
  this.blobs = [];
  this.shape = shape;
      
      var div = 360 / this.n_blobs;
      
      var temp_colors = [];
      temp_colors = COLORS.slice();
      
      for (var b = 0; b < this.n_blobs; b++){
          var x = Math.cos((div * b) * (Math.PI / 180)) * this.radius;
          var y = Math.sin((div * b) * (Math.PI / 180)) * this.radius; 
          
          // Creating Blobs of random colors.

          var idx = Math.floor(Math.random()*temp_colors.length);
          var random_color = temp_colors[idx].split(',')
          
          var rr = parseInt(random_color[0]);
          var rg = parseInt(random_color[1]);
          var rb = parseInt(random_color[2]);
          
          temp_colors.splice(idx,1);
          
          var shape;
          switch(this.shape) {
                case "Circle":
                    shape = new Blob(x + this.x, y + this.y, this.radius/2 ,{r:rr,g:rg,b:rb},idx);
                    break;
                case "Square":
                    shape = new Square(x + this.x, y + this.y, this.radius/4 ,{r:rr,g:rg,b:rb},idx);
                    break;
                case "Triangle":
                    shape = new Triangle(x + this.x, y + this.y, this.radius/4 ,{r:rr,g:rg,b:rb},idx);
                    break;
                default:
                    shape = new Blob(x + this.x, y + this.y, this.radius/2 ,{r:rr,g:rg,b:rb},idx);
                    break;
            }
          
          this.blobs.push(shape);
          
      }

      this.display = true;
  
  
  this.show = function(){

      for (var b = 0; b < this.n_blobs; b++){
        this.blobs[b].display = true;
        this.blobs[b].show();
    }
  }
  
  this.hide = function(){

      for (var b = 0; b < this.n_blobs; b++){
        this.blobs[b].hide();
      }
      refreshBackground();
  }

  this.calibrate = function(){
    
  }
}


/*
    The Blob Object.
    
    Attributes
    x : x position on screen
    y : y position on screen
    r : radius of the blob
    c : color of the blob {r,g,b}
    i : index (angle) of color
    
    Functions
    show : displays the blob
    hide : hides the blob
*/

function Blob(x,y,r,c,i){
  
  this.x = x;
  this.y = y;
  this.r = r;
  this.c = c;
  this.i = i;
  this.display = true;

  this.show = function(){
    
    if (this.display){
      noStroke();
      fill(this.c.r,this.c.g,this.c.b);
      ellipse(this.x,this.y,this.r, this.r);
    }
  } 
  
  this.hide = function(){
    this.display = false;
  }

  this.unhide = function(){
    this.display = true;
  }

  this.resetColor = function(){
      noStroke();
      fill('white');
      ellipse(this.x,this.y,this.r, this.r);
  }

}

function Square(x,y,w,c,i){
    this.x = x;
    this.y = y;
    this.w = w;
    this.c = c;
    this.i = i;
    this.display = true;
    
    this.show = function(){
    
        if (this.display){
          noStroke();
          rectMode(RADIUS);
          fill(this.c.r,this.c.g,this.c.b);
          rect(this.x,this.y,this.w, this.w);
        }
    } 

    this.hide = function(){
      this.display = false;
    }

    this.unhide = function(){
      this.display = true;
    }

    this.resetColor = function(){
        noStroke();
        fill('white');
        rectMode(RADIUS);
        rect(this.x,this.y,this.w, this.w);
    }
}

function Triangle(x,y,w,c,i){
    this.x = x;
    this.y = y;
    this.w = w*2;
    this.c = c;
    this.i = i;
    
    this.A = {x: this.x, y: this.y + (sqrt(3)/3)*this.w};
    this.B = {x: this.x - this.w/2, y: this.y - (((sqrt(3)/6))*this.w)};
    this.C = {x: this.x + this.w/2, y: this.y - ((sqrt(3)/6)*this.w)};
          
    this.display = true;
    
    this.show = function(){
    
        if (this.display){
          noStroke();
          fill(this.c.r,this.c.g,this.c.b);
          triangle(this.A.x, this.A.y, this.B.x, this.B.y, this.C.x, this.C.y);
        }
    } 

    this.hide = function(){
      this.display = false;
    }

    this.unhide = function(){
      this.display = true;
    }

    this.resetColor = function(){
        noStroke();
        fill('white');
        triangle(this.A.x, this.A.y, this.B.x, this.B.y, this.C.x, this.C.y);    
    }
}
