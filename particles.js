var Explosion = function(x, y) {
  this.tick = 0;

  this.x = x;
  this.y = y;

  this.dead = false;
  
  this.update = function(time) {
    this.tick += (time/15)*1.7;
  }
  
  this.draw = function(c) {
    var x = this.x
    var y = this.y
    var tick = this.tick
    

    if(this.tick < 20) {
      scatter(x, y, tick*2, (125 - tick)/10, 5, tickToColor(tick), c); 
      scatter(x, y, tick  , (125 - tick)/20, 10 - (5*tick)/40, tickToColor(0), c);
    } else if(tick < 40) {
      scatter(x, y, tick*2, (125 - tick)/10, 5, tickToColor(tick), c); 
      scatter(x, y, tick  , (125 - tick)/20, 10 - (5*tick)/40, tickToColor(tick - 20), c);
    } else if(tick < 60) {
      scatter(x, y, 80 + ((tick-40)*45)/85, (125 - tick) / 10, 5 - (4*(tick - 40))/85, tickToColor(tick), c); 
      scatter(x, y, tick, (125 - tick)/20, 5 - (4*(tick - 40))/85, tickToColor(tick - 20), c);
    } else if(tick < 80) {
      scatter(x, y, 80 + ((tick-40)*45)/85, (125 - tick) / 10, 5 - (4*(tick - 40))/85, tickToColor(tick), c); 
      scatter(x, y, tick, (125 - tick)/20, 5 - (4*(tick - 40))/85, tickToColor(tick - 20), c);
    } else if(tick < 100) {
      scatter(x, y,  80 + ((tick-40)*45)/85, (125 - tick) / 10, 5 - (4*(tick - 40))/85, tickToColor(tick), c); 
      scatter(x, y,  tick, (125 - tick)/20, 5 - (4*(tick - 40))/85, tickToColor(tick - 20), c);
    } else if(tick < 125) {
      scatter(x, y,  80 + ((tick-40)*45)/85, (125 - tick) / 10, 5 - (4*(tick - 40))/85, tickToColor(tick), c); 
      scatter(x, y,   tick, (125 - tick)/20, 5 - (4*(tick - 40))/85, tickToColor(tick - 20), c);
    } else {
      this.dead = true;
    }    
  }
  
  
  function tickToColor(tick) {
    if(tick < 25 ) return myrgb(255,              255,               255 - 5*tick       );
    if(tick < 50 ) return myrgb(255,              255 - 5*(tick-25), 130 - 5*(tick-25)  );
    if(tick < 75 ) return myrgb(255,              130 - 2*(tick-50), 0                  );
    if(tick < 100) return myrgb(255 - 5*(tick-75), 80 - 3*(tick-75), 0                  );
    if(tick < 125) return myrgb(130,                3*(tick - 100),  3*(tick - 100)     );
  }

  function scatter(x, y, radius, particles, length, color, c) {
    var vecx, vecy;
  
    for(var i = 0; i < particles; i++) {
      var r = Math.random() * radius;
      var t = Math.random() * Math.PI * 2;     
  
    
      vecx = r * Math.sin(t);
      vecy = r * Math.cos(t);
      
      //console.log(x + ", " + y + "; " + vecx + ", " + vecy);
      
      var thisLength = Math.random() * length;
      
      c.strokeStyle = color;
      c.lineWidth = 1;
      c.beginPath();
      c.moveTo(x + vecx, y + vecy)
      c.lineTo(x + vecx + Math.sin(t)*thisLength, y + vecy + Math.cos(t)*thisLength);
      c.stroke();    
      
      //console.log("Drew path from " + (x + vecx) + ", " + (y + vecy) + " to " +
      //            (x + vecx + Math.sin(t)*thisLength) + ", " + (y + vecy + Math.cos(t)*thisLength) + " in " + color);
    }
  }
}

var Spark = function(x, y) {
  this.x = x;
  this.y = y;
  
  this.tick = 0;
  
  const offWhite = "#FFFFC8";
  const brightYellow = "#FFFF96";
  const darkYellow   = "#C8C800";
  const lowOrange    = "#C89600";
  
  this.update = function(time) {
    this.tick += time/15;
  }
  
  this.draw = function(c) {
    var x = this.x
    var y = this.y
    var tick = this.tick
    
    c.lineWidth = 1;
    
    if(tick < 3) {
      c.strokeStyle = brightYellow;
      c.beginPath();
      c.moveTo(x-1, y)
      c.lineTo(x+1, y);
      c.moveTo(x, y-1);
      c.lineTo(x, y+1);
      c.stroke(); 
    } else if(tick < 6) {
      c.strokeStyle = brightYellow;
      c.beginPath();
      c.moveTo(x-3, y)
      c.lineTo(x+3, y);
      c.moveTo(x, y-3);
      c.lineTo(x, y+3);
      c.stroke(); 
      
      c.strokeStyle = darkYellow;
      c.beginPath();
      c.moveTo(x-1, y)
      c.lineTo(x+1, y);
      c.moveTo(x, y-1);
      c.lineTo(x, y+1);
      c.stroke(); 
    } else if(tick < 9) {
      c.strokeStyle = brightYellow;
      c.beginPath();
      c.moveTo(x-3, y)
      c.lineTo(x+3, y);
      c.moveTo(x, y-3);
      c.lineTo(x, y+3);
      c.stroke(); 
      
      c.strokeStyle = darkYellow;
      c.beginPath();
      c.moveTo(x-2, y)
      c.lineTo(x+2, y);
      c.moveTo(x, y-2);
      c.lineTo(x, y+2);
      c.stroke(); 
      
      c.strokeStyle = offWhite;
      c.beginPath();
      c.moveTo(x-1, y)
      c.lineTo(x+1, y);
      c.moveTo(x, y-1);
      c.lineTo(x, y+1);
      c.stroke(); 
    } else if(tick < 12) {
      c.strokeStyle = darkYellow;
      c.beginPath();
      c.moveTo(x-3, y)
      c.lineTo(x+3, y);
      c.moveTo(x, y-3);
      c.lineTo(x, y+3);
      c.stroke(); 
      
      c.strokeStyle = lowOrange;
      c.beginPath();
      c.moveTo(x-2, y)
      c.lineTo(x+2, y);
      c.moveTo(x, y-2);
      c.lineTo(x, y+2);
      c.stroke(); 
      
      c.strokeStyle = "#000000";
      c.beginPath();
      c.moveTo(x-1, y)
      c.lineTo(x+1, y);
      c.moveTo(x, y-1);
      c.lineTo(x, y+1);
      c.stroke(); 
    }
  }
}