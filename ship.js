var Ship = function() {

  this.shields = 100;
  
  this.dead = false;
  this.exploded = false;
  this.respawnCount = 0;

  this.posx = 200;
  this.posy = 200;
  
  this.velx = 0;
  this.vely = 0;
  
  this.rotation = 0;

  this.radius = 15

  this.leftEngine = false;
  this.rightEngine = false;
  this.forwardEngine = false;
  this.backwardEngine = false;
  this.tleftEngine = false;
  this.trightEngine = false;
  
  this.firingPrimary = false;
  this.firingSecondary = false;
  
  this.curGun = 0;
  
  this.gun = LaserGun;
  
  const enginePower = 0.0004;             // px per ms
  const tenginePower = Math.PI / 180 * 2; // deg per ms
  const staticFriction = 0.0005;
  const kineticFriction = 0.975;
  
  this.setEngine = function(which, on) {
    this[which + "Engine"] = on;
  }
  
  this.fire = function(which, on) {
    if(which == "primary") {
      this.firingPrimary = on
    } else {
      this.firingSecondary = on
    }
  }
  
  this.nextWep = function() {
    this.curGun += 1;
    if(this.curGun > 12) {
      this.curGun = 0;
    }
    
    if(this.curGun <= 7) {
      this.gun = LaserGun;
      
      if(this.curGun <= 3) {
        LaserGun.quad = false
      } else {
        LaserGun.quad = true
      }
      
      LaserGun.level = (this.curGun % 4) + 1
    }
    
    if(this.curGun == 8) {
      this.gun = VulcanGun;
    }
    
    if(this.curGun == 9) {
      this.gun = SpreadfireGun;
    }
    
    if(this.curGun == 10) {
      this.gun = PlasmaGun;
    }
    
    if(this.curGun == 11) {
      this.gun = FusionGun;
    }
  }
  
  this.update = function(time) {
    if(this.dead) {
      this.respawnCount -= time;
      
      if(this.respawnCount <= 0) {
        this.dead = false;
        this.exploded = false;
        this.posx = 250;
        this.posy = 250;
        this.shields = 100;
      } else {
        return;
      }
    }
  
    var enginex = 0;
    if(this.rightEngine) enginex += enginePower;
    if(this.leftEngine) enginex -= enginePower;

    var enginey = 0;
    if(this.forwardEngine) enginey -= enginePower;
    if(this.backwardEngine) enginey += enginePower;

    if(this.trightEngine) this.rotation += tenginePower;
    if(this.tleftEngine) this.rotation -= tenginePower;

    accx = Math.cos(-this.rotation)*enginex + Math.sin(-this.rotation)*enginey
    accy = Math.cos(-this.rotation)*enginey - Math.sin(-this.rotation)*enginex

    this.velx += time * accx;
    this.vely += time * accy;

    this.velx *= kineticFriction
    if(Math.abs(this.velx) < staticFriction) {
      this.velx = 0;
    }

    this.vely *= kineticFriction
    if(Math.abs(this.vely) < staticFriction) {
      this.vely = 0;
    }

    checkBounce(this);

    this.posx += time * this.velx;
    this.posy += time * this.vely;

    fireLasers(this, time);
  }
  
  function fireLasers(that, time) {
    that.gun.firing = that.firingPrimary;
    that.gun.update(time, that.posx, that.posy, that.rotation, that.lasers);
  }
  
  function checkBounce(that) {
    var lowxBnd = 20;
    var highxBnd = 480;

    var lowyBnd = 20;
    var highyBnd = 480;

    if(that.posy < lowyBnd) {
      that.posy = lowyBnd + (lowyBnd - that.posy);
      that.vely = -that.vely;
    }

    if(that.posy > highyBnd) {
      that.posy = 2*highyBnd - that.posy;
      that.vely = -that.vely
    }

    if(that.posx < lowxBnd) {
      that.posx = 2*lowxBnd - that.posx;
      that.velx = -that.velx;
    }

    if(that.posx > highxBnd) {
      that.posx = 2*highxBnd - that.posx;
      that.velx = -that.velx;
    }
  }
      

      
  this.draw = function(c) {
    if(this.dead) return;
  
    c.save();

    c.translate(this.posx, this.posy);
    c.rotate(this.rotation);

    var shipColor = 'rgb(132,130,132)';
    var finColor = "#444444";
    var engineColor = "#585858";
    var laserColor = "#FF0000";
    var panelColor = "#BB0000";
    var cockpitColor = "#383838";

        // Lasers
    c.fillStyle = laserColor;
    c.beginPath();
    c.moveTo(10,1);
    c.lineTo(10,-7);
    c.lineTo(12,-7);
    c.lineTo(12,0);
    c.closePath();
    c.fill();

    c.beginPath();
    c.moveTo(18,-3);
    c.lineTo(18,-14);
    c.lineTo(20,-14);
    c.lineTo(20,-4);
    c.closePath();
    c.fill();

    c.beginPath();
    c.moveTo(-10,1);
    c.lineTo(-10,-7);
    c.lineTo(-12,-7);
    c.lineTo(-12,0);
    c.closePath();
    c.fill();

    c.beginPath();
    c.moveTo(-18,-3);
    c.lineTo(-18,-14);
    c.lineTo(-20,-14);
    c.lineTo(-20,-4);
    c.closePath();
    c.fill();

        // Basic pyro outline
    c.fillStyle = shipColor
    c.beginPath();
    c.moveTo(4,-18);
    c.lineTo(7,-11);
    c.lineTo(5,-5);
    c.lineTo(8,1);
    c.lineTo(20,-5);
    c.lineTo(20,5);
    c.lineTo(8,15);
    c.lineTo(-8,15);
    c.lineTo(-20,5);
    c.lineTo(-20,-5);
    c.lineTo(-8,1);
    c.lineTo(-5,-5);
    c.lineTo(-7,-11);
    c.lineTo(-4,-18);
    c.lineTo(4,-18);
    c.closePath();
    c.fill();


        // Panels
    c.fillStyle = panelColor
    c.beginPath();
    c.moveTo(10, 3);
    c.lineTo(18, -1);
    c.lineTo(18, 4);
    c.lineTo(10, 11);
    c.closePath();
    c.fill();

    c.beginPath();
    c.moveTo(-10, 3);
    c.lineTo(-18, -1);
    c.lineTo(-18, 4);
    c.lineTo(-10, 11);
    c.closePath();
    c.fill();


        // Fins
    c.fillStyle = finColor;
    c.beginPath();
    c.moveTo(8,7);
    c.lineTo(14,4);
    c.lineTo(14,15);
    c.lineTo(8,13);
    c.closePath();
    c.fill();

    c.beginPath();
    c.moveTo(-8,7);
    c.lineTo(-14,4);
    c.lineTo(-14,15);
    c.lineTo(-8,13);
    c.closePath();
    c.fill();

        // Engines
    c.fillStyle = engineColor;
    c.beginPath();
    c.moveTo(6,10);
    c.lineTo(7,17);
    c.lineTo(4,19);
    c.lineTo(1,17);
    c.lineTo(2,10);
    c.closePath();
    c.fill();

    c.beginPath();
    c.moveTo(-6,10);
    c.lineTo(-7,17);
    c.lineTo(-4,19);
    c.lineTo(-1,17);
    c.lineTo(-2,10);
    c.closePath();
    c.fill();

        // Cockpit
    c.fillStyle = cockpitColor;
    c.beginPath();
    c.moveTo(2,-7);
    c.lineTo(2,-1);
    c.lineTo(-2,-1);
    c.lineTo(-2,-7);
    c.closePath();
    c.fill();

    c.beginPath();
    c.moveTo(3, -6);
    c.lineTo(6, 0);
    c.lineTo(3, 0);
    c.closePath();
    c.fill();

    c.beginPath();
    c.moveTo(-3, -6);
    c.lineTo(-6, 0);
    c.lineTo(-3, 0);
    c.closePath();
    c.fill();

    c.beginPath();
    c.moveTo(3, 1);
    c.lineTo(6, 1);
    c.lineTo(3, 5);
    c.closePath();
    c.fill();

    c.beginPath();
    c.moveTo(-3, 1);
    c.lineTo(-6, 1);
    c.lineTo(-3, 5);
    c.closePath();
    c.fill();


    c.restore();
  }
  
  this.takeHit = function (damage) {
    this.shields -= damage;
    
    if(this.shields < 0) {
      this.dead = true;
      this.respawnCount = 2000;
    }
  }

}

