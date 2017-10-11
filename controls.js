var Controls = function (ship) {
  const forwardKey = '8'; 
  const backKey = '2'; 
  const slideRightKey = '3';
  const slideLeftKey = '1'; 
  const turnRightKey = '6'; 
  const turnLeftKey = '4'; 
  
  const fireKey = ' ';
  
  const nextWep = '7';
  
  this.keyDown = function ( event ) {
    if(event.key === forwardKey)    ship.setEngine("forward",  true);
    if(event.key === backKey)       ship.setEngine("backward", true);
    if(event.key === slideRightKey) ship.setEngine("right",    true);
    if(event.key === slideLeftKey)  ship.setEngine("left",     true);
    if(event.key === turnRightKey)  ship.setEngine("tright",   true);
    if(event.key === turnLeftKey)   ship.setEngine("tleft",    true);

    if(event.key === fireKey)       ship.fire("primary",    true);

    //console.log(event.key);
  }

  this.keyUp = function ( event ) {
    if(event.key === forwardKey)    ship.setEngine("forward",  false);
    if(event.key === backKey)       ship.setEngine("backward", false);
    if(event.key === slideRightKey) ship.setEngine("right",    false);
    if(event.key === slideLeftKey)  ship.setEngine("left",     false);
    if(event.key === turnRightKey)  ship.setEngine("tright",   false);
    if(event.key === turnLeftKey)   ship.setEngine("tleft",    false);
    
    if(event.key === fireKey)       ship.fire("primary",    false);
    
    if(event.key === nextWep)       ship.nextWep();;
  }
}