
var ballistic = function(shipx, shipy, rotation, velocity, gunmountx, gunmounty, vel0x, vel0y) {
  gunmountx = gunmountx || 0
  gunmounty = gunmounty || 0
  vel0x     = vel0x || 0
  vel0y     = vel0y || 0

  this.x = shipx + Math.cos(-rotation)*gunmountx + Math.sin(-rotation)*gunmounty;
  this.y = shipy + Math.cos(-rotation)*gunmounty - Math.sin(-rotation)*gunmountx;
    
  this.velx = -velocity*Math.sin(-rotation) + vel0x;
  this.vely = -velocity*Math.cos(-rotation) + vel0y;
  
  this.rotation = rotation;
  
  this.update = function(time) {
    if(! isNaN(time)) {
  
      this.x += this.velx * time;
      this.y += this.vely * time;
    
      if(this.x < 20 || this.x > 480 || this.y < 20 || this.y > 480) {
        this.dead = true;
      } 
    }
  }
}

var LaserShot = function(shipx, shipy, rotation, gunmountx, gunmounty, level) {
  const laserSpeed = 0.2
  this.ball = new ballistic(shipx, shipy, rotation, laserSpeed, gunmountx, gunmounty);
  
  this.x = this.ball.x
  this.y = this.ball.y
  this.rotation = this.ball.rotation;

  this.length = 20;
  this.hitRadius = 2;
  
  this.level = level;
  if(level === 1) {
    this.damage = 16; 
    this.brightColor = "#FF0000";
    this.dimColor = "#880000";
  } else if (level ===2) {
    this.damage = 20;
    this.brightColor = "#FF00FF";
    this.dimColor = "#880088";    
  } else if (level ===3) {
    this.damage = 24;
    this.brightColor = "#00CCFF";
    this.dimColor = "#007788";    
  } else if (level ===4) {
    this.damage = 28;
    this.brightColor = "#00FF00";
    this.dimColor = "#008800";    
  }  

  this.xLength = -Math.sin(-rotation) * this.length;
  this.yLength = -Math.cos(-rotation) * this.length;
  
  this.update = function(time) {
    this.ball.update(time);
    
    this.x = this.ball.x;
    this.y = this.ball.y;

    if(this.rotation != this.ball.rotation) {
      this.rotation = this.ball.rotation;
    }
    
    this.dead = this.ball.dead;
  }
  
  this.draw = function(c) {

  
    if(this.dead) return;
    c.save();    
    
    c.translate(this.x, this.y);
    c.strokeStyle = this.dimColor;
    c.lineWidth = 1;
    c.beginPath();
    c.moveTo(0,0);
    c.lineTo(this.xLength, this.yLength);
    c.stroke();
    
    //console.log("Drew laser shot in " + this.dimColor + " from " + this.x + ", " + this.y + "; length " + this.xLength + ", " + this.yLength);
    
    c.strokeStyle = this.brightColor;
    c.lineWidth = 1;
    c.beginPath();
    c.moveTo(this.xLength/2, this.yLength/2);
    c.lineTo(this.xLength, this.yLength);
    c.stroke();
    
    c.restore();
  }
}

var VulcanShot = function(shipx, shipy, rotation, gunmountx, gunmounty) {
  const speed = 1.0
  this.ball = new ballistic(shipx, shipy, rotation, speed, gunmountx, gunmounty);
  
  this.x = this.ball.x
  this.y = this.ball.y
  
  this.hitRadius = 1;  
  this.damage = 4; 
  
  this.length = 4;
  this.xLength = -Math.sin(-rotation) * this.length;
  this.yLength = -Math.cos(-rotation) * this.length;
  
  this.update = function(time) {
    this.ball.update(time);
    
    this.x = this.ball.x;
    this.y = this.ball.y;
    
    this.dead = this.ball.dead;
  }
  
  this.draw = function(c) {
    if(this.dead) return;
  
    c.save();    
    
    c.translate(this.x, this.y);
    c.strokeStyle = "#444444";
    c.lineWidth = 1;
    c.beginPath();
    c.moveTo(0,0);
    c.lineTo(this.xLength, this.yLength);
    c.stroke();
    
    c.restore();
  }
}

var SpreadfireShot = function(shipx, shipy, rotation, gunmountx, gunmounty) {
  const speed = 0.4
  this.ball = new ballistic(shipx, shipy, rotation, speed, gunmountx, gunmounty);
  
  this.x = this.ball.x
  this.y = this.ball.y
  
  this.outerRadius = 4;
  this.innerRadius = 2;
  this.hitRadius = 3;  
  this.damage = 15; 

  this.darkBlue = "#4444CC";
  this.lightBlue = "#8888FF";
  
  this.update = function(time) {
    this.ball.update(time);
    
    this.x = this.ball.x;
    this.y = this.ball.y;
    
    this.dead = this.ball.dead;
  }
  
  this.draw = function(c) {
    if(this.dead) return;
  
    c.save();    
    
    c.translate(this.x, this.y);
    c.fillStyle = this.darkBlue;
    c.beginPath();
    c.arc(0,0,this.outerRadius,0,Math.PI*2,false);
    c.closePath();
    c.fill();
    
    c.fillStyle = this.lightBlue;
    c.beginPath();
    c.arc(0,0,this.innerRadius,0,Math.PI*2,false);
    c.closePath();
    c.fill();
    
    c.restore();
  }
}

var PlasmaShot = function(shipx, shipy, rotation, gunmountx, gunmounty) {
  const speed = 0.3
  this.ball = new ballistic(shipx, shipy, rotation, speed, gunmountx, gunmounty);
  
  this.x = this.ball.x
  this.y = this.ball.y
  
  this.outerRadius = 7;
  this.hitRadius = 7;  
  this.damage = 11; 

  this.darkGreen = "#448844";
  this.lightGreen = "#00FF00";
  
  this.update = function(time) {
    this.ball.update(time);
    
    this.x = this.ball.x;
    this.y = this.ball.y;
    
    this.dead = this.ball.dead;
  }
  
  this.draw = function(c) {
    if(this.dead) return;
  
    c.save();    
    
    c.translate(this.x, this.y);
    c.fillStyle = this.darkGreen;
    c.beginPath();
    c.arc(0,0,this.outerRadius,0,Math.PI*2,false);
    c.closePath();
    c.fill();
     
    c.strokeStyle = this.lightGreen;
    c.lineWidth = 1;
    c.beginPath();
    c.moveTo(-this.outerRadius, 0);
    c.lineTo(this.outerRadius, 0);
    c.moveTo(0, this.outerRadius);
    c.lineTo(0, -this.outerRadius);
    c.closePath();
    c.stroke();

    c.lineWidth = 2;
    c.beginPath();
    c.moveTo(-this.outerRadius*0.75, 0);
    c.lineTo(this.outerRadius*0.75, 0);
    c.moveTo(0, this.outerRadius*0.75);
    c.lineTo(0, -this.outerRadius*0.75);
    c.closePath();
    c.stroke();
    
    c.restore();
  }
}

var FusionShot = function(shipx, shipy, rotation, gunmountx, gunmounty, charge) {
  const speed = 0.25
  this.ball = new ballistic(shipx, shipy, rotation, speed, gunmountx, gunmounty);
  
  this.x = this.ball.x
  this.y = this.ball.y
  
  this.outerRadius = 8;
  this.innerRadius = 5;
  this.backOuterRadius = 6;
  this.backInnerRadius = 3;
  
  var chargeBonus = charge * 120 / 1500;
  if(chargeBonus > 120) chargeBonus = 120;
  
  this.hitRadius = 8;  
  this.damage = 40 + chargeBonus;

  this.darkPurple = "#884488";
  this.lightPurple = "#FF00FF";
  
  this.rotation = this.ball.rotation;
  this.length = 10;  

  this.fusion = true;
  this.hitDrones = [];

  this.xLength = -Math.sin(-rotation) * this.length;
  this.yLength = -Math.cos(-rotation) * this.length;
  

  
  this.update = function(time) {
    this.ball.update(time);
    
    this.x = this.ball.x;
    this.y = this.ball.y;
    
    this.dead = this.ball.dead;
  }
  
  this.draw = function(c) {
    if(this.dead) return;
  
    c.save();    
    
    c.translate(this.x, this.y);
    c.rotate(this.rotation);
    
    c.fillStyle = this.darkPurple;
    c.beginPath();
    c.arc(0,0,this.outerRadius,0,Math.PI*2,false);
    c.closePath();
    c.fill();
     
    c.beginPath();
    c.arc(0, 10,this.backOuterRadius,0,Math.PI*2,false);
    c.closePath();
    c.fill();
    
    c.beginPath();
    c.moveTo(this.outerRadius, 0);
    c.lineTo(-this.outerRadius, 0);
    c.lineTo(-this.backOuterRadius, 10);
    c.lineTo( this.backOuterRadius, 10);
    c.closePath();
    c.fill();
    
    c.fillStyle = this.lightPurple;
    c.beginPath();
    c.arc(0,0,this.innerRadius,0,Math.PI*2,false);
    c.closePath();
    c.fill();
     
    c.beginPath();
    c.arc(0, 6,this.backInnerRadius,0,Math.PI*2,false);
    c.closePath();
    c.fill();
    
    c.beginPath();
    c.moveTo(this.innerRadius, 0);
    c.lineTo(-this.innerRadius, 0);
    c.lineTo(-this.backInnerRadius, 6);
    c.lineTo( this.backInnerRadius, 6);
    c.closePath();
    c.fill();
    
    c.restore();
  }
  
  
  this.getDamage = function (drone) {
    if(this.hitDrones.indexOf(drone) != -1) {

      return 0;
    } else {
      this.hitDrones.push(drone)
      return this.damage;
    }
  }
}

var C1DroneShot = function(shipx, shipy, rotation, gunmountx, gunmounty) {
  const speed = 0.4
  this.ball = new ballistic(shipx, shipy, rotation, speed, gunmountx, gunmounty);
  
  this.x = this.ball.x
  this.y = this.ball.y
  
  this.outerRadius = 5;
  this.innerRadius = 3;
  this.hitRadius = 5;  
  this.damage = 8; 

  this.darkOrange = "#FF8800";
  this.lightOrange = "#FFCC88";
  
  this.update = function(time) {
    this.ball.update(time);
    
    this.x = this.ball.x;
    this.y = this.ball.y;
    
    this.dead = this.ball.dead;
  }
  
  this.draw = function(c) {
    if(this.dead) return;
  
    c.save();    
    
    c.translate(this.x, this.y);
    c.fillStyle = this.darkOrange;
    c.beginPath();
    c.arc(0,0,this.outerRadius,0,Math.PI*2,false);
    c.closePath();
    c.fill();
    
    c.fillStyle = this.lightOrange;
    c.beginPath();
    c.arc(0,0,this.innerRadius,0,Math.PI*2,false);
    c.closePath();
    c.fill();
    
    c.restore();
  }
}

var MakeLaserGun = function() {

  const cooldown = 300;  //  = 200; // Vulcan 50; // Laser 300;
  
  this.firing = false;
  this.cooldown = 0;
    
  this.level = 1;
  this.quad = false;
    
  this.update = function (time, x, y, rotation, shots) {
    if(this.cooldown > 0) { this.cooldown -= time; }
    
    if(this.firing && this.cooldown <= 0) {
      if(this.quad) {
        newLaser(x, y, rotation,  10, -15, this.level, shots);
        newLaser(x, y, rotation, -10, -15, this.level, shots);     
        
        newLaser(x, y, rotation,  18, -12, this.level, shots);
        newLaser(x, y, rotation, -18, -12, this.level, shots);  
      } else {
        newLaser(x, y, rotation,  12, -15, this.level, shots);
        newLaser(x, y, rotation, -12, -15, this.level, shots);
      }
      
      this.cooldown += cooldown;
    }
  }
  
  function newLaser(x, y, rotation, xmount, ymount, level, shots) {
    var laser = new LaserShot(x, y, rotation, xmount, ymount, level);
    shots.push(laser);
    laser.update(-this.cooldown);
  }
}

var LaserGun = new MakeLaserGun();

var MakeVulcanGun = function() {

  const cooldown =  50; 
  
  this.firing = false;
  this.cooldown = 0;
    
  this.update = function (time, x, y, rotation, shots) {
    if(this.cooldown > 0) { this.cooldown -= time; }
    
    if(this.firing && this.cooldown <= 0) {
      newVulcan(x, y, rotation, shots);
      
      this.cooldown += cooldown;
    }
  }
  
  function newVulcan(x, y, rotation, shots) {
    var vulcan = new VulcanShot(x, y, rotation, Math.random()*8 - 4, 0);
    shots.push(vulcan);
    vulcan.update(-this.cooldown);
  }
}

var VulcanGun = new MakeVulcanGun();

var MakeSpreadfireGun = function() {

  const cooldown =  200; 
  
  this.firing = false;
  this.cooldown = 0;
    
  this.update = function (time, x, y, rotation, shots) {
    if(this.cooldown > 0) { this.cooldown -= time; }
    
    if(this.firing && this.cooldown <= 0) {
      newSpread(x, y, rotation, 0, -14, shots);
      newSpread(x, y, rotation + 0.3,  6, -12, shots);
      newSpread(x, y, rotation - 0.3, -6, -12, shots);
      
      this.cooldown += cooldown;
    }
  }
  
  function newSpread(x, y, rotation, mountx, mounty, shots) {
    var shot = new SpreadfireShot(x, y, rotation, mountx, mounty);
    shots.push(shot);
    shot.update(-this.cooldown);
  }
}

var SpreadfireGun = new MakeSpreadfireGun();
      
      
var PlasmaGun = new function() {

  const cooldown =  200; 
  
  this.firing = false;
  this.cooldown = 0;
    
  this.update = function (time, x, y, rotation, shots) {
    if(this.cooldown > 0) { this.cooldown -= time; }
    
    if(this.firing && this.cooldown <= 0) {
      newShot(x, y, rotation, 12, -14, shots);
      newShot(x, y, rotation, -12, -14, shots);

      
      this.cooldown += cooldown;
    }
  }
  
  function newShot(x, y, rotation, mountx, mounty, shots) {
    var shot = new PlasmaShot(x, y, rotation, mountx, mounty);
    shots.push(shot);
    shot.update(-this.cooldown);
  }
}();

var FusionGun = new function() {

  const cooldown =  300; 
  
  this.firing = false;
  this.cooldown = 0;
  
  this.charge = 0;
    
  this.fusion = true;
    
  this.hitDrones = [];
    
  this.update = function (time, x, y, rotation, shots) {
    if(this.cooldown > 0) { this.cooldown -= time; }
    
    if(this.firing && this.cooldown <= 0) {
      this.charge += time;
    }
    
    if(! this.firing && this.charge > 0) {
      newShot(x, y, rotation, 12, -14, this.charge, shots);
      newShot(x, y, rotation, -12, -14, this.charge, shots);
      
      this.cooldown += cooldown;
      this.charge = 0;
    }
  }
  
  function newShot(x, y, rotation, mountx, mounty, charge, shots) {
    var shot = new FusionShot(x, y, rotation, mountx, mounty, charge);
    shots.push(shot);
    shot.update(-this.cooldown);
  }
  

}();

