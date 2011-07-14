var Drone = new function (x, y, rotation, ship) {
  this.ship = ship
  
  this.x = x;
  this.y = y;
  this.rotation = rotation; 
  
  this.dead = false;
  this.respawnCount = 0;
  
  this.maxhp = 30;
  this.hp = 30;
  this.radius = 10;
  
  this.turnRate = 0.03;
  this.moveRate = 0.09;
  
  this.sightRange = 1000;
  this.seesShip = false;
  
  this.action = "";
  this.actionTime = 0;
  
  this.freezeOnHit = 100;
  this.freezeCount  = 0;
  
  this.attackCooldown = 300;
  this.attackCount = 0;
  this.canAttack = false;
  this.attack = function() { };
  
  this.awake = false;
  
  this.clipRotation = function () {
    while(this.rotation > Math.PI * 2) { this.rotation -= Math.PI*2 }
    while(this.rotation < 0          ) { this.rotation += Math.PI*2 }
  }
  
  this.frozen = function(time) {
    if(this.freezeCount <= 0) {
      return false;
    } else {
      this.freezeCount -= time;
      return true;
    }
  }
  
  this.updateShipVector = function () {
    var botx = this.x
    var boty = this.y
    var shipx = this.ship.posx
    var shipy = this.ship.posy
    
    this.dist    = Math.sqrt((botx - shipx)*(botx - shipx) + (boty - shipy)*(boty - shipy))
    this.bearing = angDist(botx, boty, shipx, shipy, this.rotation + Math.PI);    
  }
  
  this.updateSeesShip = function() {
    var oldSees = this.seesShip;
  
    if(this.ship.dead)                   this.seesShip = false;
    else if(this.dist < this.sightRange) this.seesShip = true;
    else if(this.awake)                  this.seesShip = true;
    else                                 this.seesShip = false;
    
    if(oldSees && ! this.seesShip)  this.hideShipFlag = true;
    if(! oldSees && this.seesShip)  this.showShipFlag = true;
    
  }
  
  this.turnTowardShip = function(time) {
    if(Math.abs(this.bearing) < this.turnRate * time) {
      this.rotation += this.bearing;
    } else {
      if(this.bearing < 0) {
        this.rotation -= this.turnRate * time;
      } else {
        this.rotation += this.turnRate * time;
      }
    }
  }
  
  this.slideRight = function(time) {
    this.x +=  -Math.sin(this.rotation + Math.PI/2) * this.moveRate * time;
    this.y +=   Math.cos(this.rotation + Math.PI/2) * this.moveRate * time;     
  }
  
  this.slideLeft = function(time) {
    this.x +=   Math.sin(this.rotation + Math.PI/2) * this.moveRate * time;
    this.y +=  -Math.cos(this.rotation + Math.PI/2) * this.moveRate * time;     
  }
  
  this.moveForward = function(time) {
    if(this.dist > this.radius + this.ship.radius + this.moveRate * time) {
      this.x +=  -Math.sin(this.rotation) * this.moveRate * time;
      this.y +=   Math.cos(this.rotation) * this.moveRate * time;
    }
  }
  
  this.moveBackward = function(time) {
    this.x +=  -Math.sin(this.rotation) * this.moveRate * time;
    this.y +=   Math.cos(this.rotation) * this.moveRate * time;
  }
  
  this.turnRight = function(time) {
    this.rotation += this.turnRate * time;
    this.clipRotation()
  }
  
  this.turnLeft = function(time) {
    this.rotation -= this.turnRate * time;
    this.clipRotation();
  }
  
  this.checkCollision = function() {
    if(this.dist < this.radius + this.ship.radius && ! this.dead && ! this.ship.dead ) {
      this.ship.takeHit(1);
      this.takeHit(1);
      
      if(this.dist < 1) this.dist = 1;
      
      this.x += (this.x - this.ship.posx) * (this.radius + this.ship.radius) / (this.dist*this.dist)
      this.y += (this.y - this.ship.posy) * (this.radius + this.ship.radius) / (this.dist*this.dist)
    }
  }
  
  this.checkBoundaries = function () {
    if(this.x > 480) {
      this.x = 480
    }
    
    if(this.x < 20) {
      this.x = 20;
    }
    
    if(this.y > 480) {
      this.y = 480
    }
    
    if(this.y < 20) {
      this.y = 20;
    }
  }
  
  this.takeHit = function(dmg) {
    this.hp -= dmg;
    
    this.freezeCount = this.freezeOnHit;
    
    if(this.hp < 0) {
      this.dead = true;
    }
  }
  
  var logs = 0;
  
  this.rotateColor = function(leftToRightAt, rightToLeftAt, transWidth, rleft, gleft, bleft, rrite, grite, brite) {
    var zero = 0;
    zero          = zeroize(leftToRightAt - transWidth);
    var zoneOne   = zeroize(leftToRightAt + transWidth);
    var zoneTwo   = zeroize(rightToLeftAt - transWidth);
    var zoneThree = zeroize(rightToLeftAt + transWidth);      
  
    // Make into [zero, zero + 2PI]
    function zeroize(t) {
      var rv = t;
      while(rv < zero)             { rv += Math.PI*2 }
      while(rv > zero + Math.PI*2) { rv -= Math.PI*2 }
      
      return rv;
    }
    
    var rot = zeroize(this.rotation);
    var pct;
    
    if(logs < 100) {
      //console.log(leftToRightAt + "; " + rightToLeftAt + "; " + this.rotation);
      //console.log(zero + ", " + zoneOne + ", " + zoneTwo + ", " + zoneThree + "; " + rot);
      
      logs++;
    }
    
    //console.log(zero + ", " + zoneOne + ", " + zoneTwo + ", " + zoneThree + ", " + (zero + Math.PI*2) + "; " + rot);
    
    if(rot < zoneOne) {
      pct = (rot - zero) / (transWidth*2);
      
      red   = (1 - pct) * rleft + (pct) * rrite;
      green = (1 - pct) * gleft + (pct) * grite;
      blue  = (1 - pct) * bleft + (pct) * brite; 
    } else if (rot < zoneTwo) {
      red = rrite;
      green = grite;
      blue = brite  
    } else if (rot < zoneThree) {
      pct = (rot - zoneTwo) / (transWidth*2);    
      
      red   = (pct) * rleft + (1 - pct) * rrite;
      green = (pct) * gleft + (1 - pct) * grite;
      blue  = (pct) * bleft + (1 - pct) * brite;   
    } else {
      red = rleft;
      green = gleft;
      blue = bleft;
    }
  
  
    //console.log("   " + myrgb(red, green, blue));
    return myrgb(red, green, blue);
  }  
  
}();



/////
// GREEN DRONE
/////

var GreenDrone = function(x, y, rotation, ship) {
  this.ship = ship;
  
  this.dead = false;
  this.respawnCount = 0;
  
  this.hp = 60;
  
  this.sightRange = 400;
  
  this.x = x;
  this.y = y; 
  this.rotation = rotation;
  this.radius = 10;
  
  this.clawFlip = 1000;
  this.clawUp = false;
  
  const body = [[0, -8], [8, 6], [0, 3]];
  const arm  = [[3, -2], [13, -12], [5, 2]];
  const clawDown = [[8, -9], [13, -12], [17, -9], [14, 3], [14, -9], [12, -9], [12, 3], [8, -9]];
  const clawUp = [[8, -11], [13, -8], [17, -11], [14, -23], [14, -11], [12, -11], [12, -23], [8, -11]];
  
  const eye = [[1, -4], [3, -1], [1, 2]];
  
  this.turnRate = 0.0015;
  this.moveRate = 0.09;
  
  this.checkDead = function(time) {
    if(this.dead) {
      this.respawnCount -= time;
      
      if(this.respawnCount <= 0) {
        this.dead = false;
        this.exploded = false;
        this.x = Math.random()*500;
        this.y = Math.random()*500;
        this.rotation = 0;
        this.hp = 60;
      } 
    }
    
    return this.dead;
  }
  
  this.canAttack = function() {
    return (
       this.seesShip && 
       this.dist < this.radius + ship.radius + 5 && 
       Math.abs(this.bearing) < Math.PI/4 && 
       this.attackCount <= 0
    );
  }
  
  this.update = function(time) {

    if(this.checkDead(time)) return;
    if(this.frozen(time)) return;  

    this.updateShipVector();
    this.updateSeesShip();


    // If we just now saw the ship, react before the rest of the update
    if(this.showShipFlag) {
      this.clawUp = true; 
      this.newAction();
      
      this.showShipFlag = false;
    }
    
    if(this.hideShipFlag) {
      this.clawUp = false; 
      this.newAction();
      
      this.hideShipFlag = false;
    }
    
    // Lifter always turns toward the ship
    if(this.seesShip) {
      this.turnTowardShip(time);
    } 

    
    // Handle attack -- independent of main action
    if(this.canAttack()) {  
      this.attackCount += this.attackCooldown
      ship.takeHit(15);
    }
    
    if(this.attackCount > 250) {
      this.clawUp = false
    } else if (this.attackCount > 0) {
      this.clawUp = true    
    }

    if(this.attackCount > 0) {
      this.attackCount -= time;
    }


    // Execute main action
    if(this.actionTime > 0) {
      this.action(time);      
      this.actionTime -= time;
    } else {
      this.newAction();
    }

    // Simple things...
    this.checkCollision();
    this.clipRotation();
    
    this.checkBoundaries();    
  }
  
  this.newAction = function() {
    var i = Math.random();
  
    if(this.seesShip) {
      if(i < 0.15) {
        this.action = this.slideRight
        this.actionTime = 600*Math.random() + 200;
      } else if (i < 0.3) {
        this.action = this.slideLeft
        this.actionTime = 600*Math.random() + 200;
      } else {
        this.action = this.moveForward
        this.actionTime = 1500;
      }
      
    } else {
      if(i < 0.2) {
        this.action = this.slideRight;
        this.actionTime = 600*Math.random() + 200;
      } else if (i < 0.4) {
        this.action = this.slideLeft;
        this.actionTime = 600*Math.random() + 200;
      } else if (i < 0.6) {
        this.action = this.moveForward
        this.actionTime = 600*Math.random() + 200;
      } else if (i < 0.8) {
        this.action = this.turnRight
        this.actionTime = 600*Math.random() + 200;
      } else  {
        this.action = this.turnLeft
        this.actionTime = 600*Math.random() + 200;
      }
      
      i = Math.random();
      
      if(i < 0.1) {
        this.clawUp = true;   
      } else {
        this.clawUp = false;   
      }
    }
  }
  
  this.draw = function(c) {
    if(this.dead) return;
  
    c.save();
    
    var rightGreen, leftGreen;
    
    var hiGreen = 170
    var darkGreen = 98;
    
    leftGreen  = this.rotateColor(Math.PI, 0      , Math.PI / 6, 0, hiGreen, 0, 0, darkGreen, 0);
    rightGreen = this.rotateColor(0,       Math.PI, Math.PI / 6, 0, hiGreen, 0, 0, darkGreen, 0);
    
    c.translate(this.x, this.y);
    c.rotate(this.rotation);
 
    fillPoly(c, arm, "#004400");     
    fillPoly(c, arm, "#004400", true);

    fillPoly(c, body, rightGreen);
    fillPoly(c, body, leftGreen, true);    

    if(this.clawUp) {
      fillPoly(c, clawUp, "#006600");
      fillPoly(c, clawUp, "#006600", true);
    } else {
      fillPoly(c, clawDown, "#006600");
      fillPoly(c, clawDown, "#006600", true);
    }
    
    fillPoly(c, eye,  "#FF0000");
    fillPoly(c, eye,  "#FF0000", true);
    
    c.restore();
  }
  
  this.takeHit = function(dmg) {
    this.hp -= dmg;    
    
    this.freezeCount = this.freezeOnHit;
    
    this.awake = true;
    
    if(this.hp < 0) {
      this.dead = true;
      this.awake = false;
      this.respawnCount = 2000;
    }
  }
}

GreenDrone.prototype = Drone;



/////
// ORANGE DRONE
/////

var Class1Drone = function(x, y, rotation, ship) {
  this.ship = ship;
  
  this.dead = false;
  this.respawnCount = 0;
  
  this.hp = 30;
  this.maxhp = 30;
  
  this.turnRate = .03/15;
  this.moveRate = 1/15;
  this.moveRate = 
  
  this.x = x;
  this.y = y; 
  this.rotation = rotation;
  this.radius = 10;
  
  const centerFront = [[0,11], [3, 2], [-3, 2]];
  const centerBack  = [[3,2], [0, -18], [-3, 2]];
  const rightForward = [[0,11], [6, 8], [3, 2]];
  const rightMid = [[6, 8], [7, 2], [3, 2]];
  const rightBack = [[3, 2], [7, 2], [0, -18]];
  
  const arm = [[7, 1], [15, 2], [15, 8], [17,8], [17,0], [7,-1]];
  
  const innerTriangle = [[14, 2], [17, 2], [14, -10]];
  const outerTriangle = [[17,2], [19,2], [14,-10]];
  
  const eye = [[2,9], [5, 7], [6, 3], [3, 5]];
  
  this.turnRate = 0.0015;
  this.moveRate = 0.09;
  
  this.checkDead = function(time) {
    if(this.dead) {
      this.respawnCount -= time;
      
      if(this.respawnCount <= 0) {
        this.dead = false;
        this.exploded = false;
        this.x = Math.random()*500;
        this.y = Math.random()*500;
        this.rotation = 0;
        this.hp = this.maxhp;
        
        this.attackCount = 0;
        this.actionTime = 0;
      } 
    }
    
    return this.dead;
  }
  
  this.update = function(time, shots) {

    if(this.checkDead(time)) return;
    if(this.frozen(time)) return;  

    this.updateShipVector();
    this.updateSeesShip();

    this.shots = shots;

    if(this.hideShipFlag) {
      this.newAction();
      this.hideShipFlag = false
    }
    
    if(this.showShipFlag) {
      this.newAction();
      this.showShipFlag = false
    }
   
    if(this.seesShip && this.attackCount <= 0) {
      //console.log(this.attackCount);
      this.turnTowardShip(time);
    } 

    
    // Execute main action
    if(this.actionTime > 0) {
      this.action(time);      
      this.actionTime -= time;
    } else {
      this.newAction();
    }

    // Simple things...
    this.checkCollision();
    this.clipRotation();
    
    this.checkBoundaries();    
  }
  
  this.attack = function(time) {
  //console.log(this.fireCount + ", " + this.attackCount + "; " + this.shots + "/" + this.shotsThisAttack);
  
    this.fireCount -= time;
    this.attackCount -= time;
    if(this.fireCount < 0 && this.shotsTaken < this.shotsThisAttack) {
      var shot = new C1DroneShot(this.x, this.y, this.rotation + Math.PI, 13, 0);
      shot.update(-this.fireCount);
      this.shots.push(shot);
      
      shot = new C1DroneShot(this.x, this.y, this.rotation + Math.PI, -13, 0);
      shot.update(-this.fireCount);
      this.shots.push(shot);
      
      this.fireCount += this.attackCooldown;
      this.shotsTaken++;
      // Make a new laser; send it ahead by -fireCount; fireCount += cooldown
    }
  }
  
  this.newAction = function() {
    var i = Math.random();
  
    this.attackCount = 0;
    this.shotsThisAttack = 0;
  
    if(! this.seesShip) {
      if(i < .2) {
        this.action = this.slideRight;
        this.actionTime = 80*15;
      } else if(i < .4) {
        this.action = this.slideLeft;
        this.actionTime = 80*15;
      } else if(i < .6) {
        this.action = this.moveForward;
        this.actionTime = 20*15;
      } else if(i < .8) {
        this.action = this.turnRight;
        this.actionTime = 10*15;
      } else  {
        this.action = this.turnLeft;
        this.actionTime = 10*15;
      }
    } else {
      if(Math.abs(this.bearing) < .05) {
             if(this.dist > 350) { if(Math.random() < .1 )  this.setAttack(39*15, 1); }
        else if(this.dist > 200) { if(Math.random() < .2 )  this.setAttack(80*15, 3); }
        else if(this.dist > 150) { if(Math.random() < .35)  this.setAttack(80*15, 3); }
        else                     { if(Math.random() < .7 )  this.setAttack(80*15, 3); }                
        
      }
      
      if(this.actionTime <= 0) {
        if(this.dist > 150) {
               if(i < .1) { this.action = this.slideRight;  this.actionTime = 30*15; }
          else if(i < .2) { this.action = this.slideLeft;   this.actionTime = 30*15; }
          else            { this.action = this.moveForward; this.actionTime = 40*15; }
        } else {
               if(i < .4) { this.action = this.slideRight;  this.actionTime = 50*15; }
          else if(i < .5) { this.action = this.slideLeft;   this.actionTime = 50*15; }
          else            { this.action = this.moveForward; this.actionTime = 15*15; }        
        }
      }
    }
    
    //if(this.action == this.slideRight) console.log("Slide Right");
    //if(this.action == this.slideLeft)  console.log("Slide Left");
    //if(this.action == this.moveForward) console.log("Charge");
    //if(this.action == this.attack)      console.log("Attack " + this.attackTime);
  }
  
  this.setAttack = function(time, shots) {
    //console.log("Set attack");
  
    this.action = this.attack;
    this.actionTime = time;
    this.attackCount = time;
    this.fireCount = 100;
    
    this.shotsTaken = 0;
    this.shotsThisAttack = shots;
  }
  
  this.draw = function(c) {
    if(this.dead) return;
  
    c.save();
    
    c.translate(this.x, this.y);
    c.rotate(this.rotation);
 
    var rbrite = 256;
    var rdim   = 128;
    var gbrite = 128;
    var gdim   = 64;
    
    var trbrite = 196
    var trdim   = 144
    var tgbrite = 96
    var tgdim   = 80
    
    var trans = .3;
 
    // Works??
    //fillPoly(c, centerFront, this.rotateColor(-1.57,  1.57, trans, trbrite, tgbrite, 0, trdim, tgdim, 0  ));
    //fillPoly(c, centerBack,  this.rotateColor( 1.57, -1.57, trans, trbrite, tgbrite, 0, trdim, tgdim, 0  ));
    
    fillPoly(c, centerFront, "#DD8800");
    fillPoly(c, centerBack, "#CC7700");
    
    // Fails??!
    //fillPoly(c, rightForward, this.rotateColor( -.46 + Math.PI,  .35 + Math.PI,   trans,  rdim, gdim, 0, rbrite, gbrite, 0  ));
    //fillPoly(c, rightForward, this.rotateColor( -.35 + Math.PI , .46 + Math.PI,  trans,  rdim, gdim, 0, rbrite, gbrite, 0  ), true);
    //fillPoly(c, rightForward, this.rotateColor( -.46,  -.35 + Math.PI,   trans,  rdim, gdim, 0, rbrite, gbrite, 0  ));

    fillPoly(c, rightForward, "#CC7700");
    fillPoly(c, rightForward, "#CC7700", true);
    
    
    fillPoly(c, rightMid, "#AA6600");
    fillPoly(c, rightMid, "#AA6600", true);
    
    fillPoly(c, rightBack, "#995500");
    fillPoly(c, rightBack, "#995500", true);
    
    fillPoly(c, arm, "#888888");
    fillPoly(c, arm, "#888888", true);
    
    fillPoly(c, innerTriangle, "#CC7700");
    fillPoly(c, innerTriangle, "#CC7700", true);
    
    fillPoly(c, outerTriangle, "#AA6600");
    fillPoly(c, outerTriangle, "#AA6600", true);    
 
    fillPoly(c, eye, "#880000");
    fillPoly(c, eye, "#880000", true);
    
    c.restore();
  }
  
  this.takeHit = function(dmg) {
    this.hp -= dmg;    
    
    this.freezeCount = this.freezeOnHit;
    
    this.awake = true;
    
    if(this.hp < 0) {
      this.dead = true;
      this.awake = false;
      this.respawnCount = 2000;
    }
  }
}

Class1Drone.prototype = Drone;


function fillPoly(c, pts, color, mirrorx) {
  var xmult = 1;
  if(mirrorx) xmult = -1

  c.fillStyle = color;

  c.beginPath();
  c.moveTo(xmult * pts[0][0], pts[0][1]);
  for(var i = 1; i < pts.length; i++) {
    c.lineTo(xmult * pts[i][0], pts[i][1]);
  }
  c.closePath();
  
  c.fill();
}

function interpColor(r1, g1, b1, r2, g2, b2, pct) {
  var r = (1 - pct)*r1 + pct*r2
  var g = (1 - pct)*g1 + pct*g2
  var b = (1 - pct)*b1 + pct*b2
  
  var color = Math.floor(r) * 256 * 256 + Math.floor(g) * 256 + Math.floor(b);
  color = color.toString(16);
  while(color.length < 6) { color = "0" + color };
  
  return "#" + color;
}

function myrgb(r, g, b) {

  if(r > 255) r = 255;
  if(g > 255) g = 255;
  if(b > 255) b = 255;

  var color = Math.floor(r) * 256 * 256 + Math.floor(g) * 256 + Math.floor(b);
  color = color.toString(16);
  while(color.length < 6) { color = "0" + color };
  
  return "#" + color;

}

// Get angle
function angDist(botx, boty, shipx, shipy, rotation) {
  var dx = shipx - botx;
  var dy = shipy - boty;
  
  var dist = Math.sqrt(dx*dx + dy*dy);
  if(dist < 1) {
    return 0;
  }
  
  dx = dx/dist;
  dy = dy/dist;
  
  var ox =  Math.sin(rotation);
  var oy = -Math.cos(rotation);
  
  var angle = Math.acos(dx * ox + dy * oy);
  if(dx*oy - dy*ox > 0) {
    angle = -angle;
  }
  
  return angle;
}