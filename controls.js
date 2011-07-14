var Controls = function (ship) {
  const forwardKey = 'U+0048'; 
  const backKey = 'U+0042'; 
  const slideRightKey = 'U+0043';
  const slideLeftKey = 'U+0041'; 
  const turnRightKey = 'U+0046'; 
  const turnLeftKey = 'U+0044'; 
  
  const fireKey = 'U+0020';
  
  const nextWep = 'U+0047';
  
  this.keyDown = function ( event ) {
    if(event.keyIdentifier === forwardKey)    ship.setEngine("forward",  true);
    if(event.keyIdentifier === backKey)       ship.setEngine("backward", true);
    if(event.keyIdentifier === slideRightKey) ship.setEngine("right",    true);
    if(event.keyIdentifier === slideLeftKey)  ship.setEngine("left",     true);
    if(event.keyIdentifier === turnRightKey)  ship.setEngine("tright",   true);
    if(event.keyIdentifier === turnLeftKey)   ship.setEngine("tleft",    true);

    if(event.keyIdentifier === fireKey)       ship.fire("primary",    true);

    //console.log(event.keyIdentifier);
  }

  this.keyUp = function ( event ) {
    if(event.keyIdentifier === forwardKey)    ship.setEngine("forward",  false);
    if(event.keyIdentifier === backKey)       ship.setEngine("backward", false);
    if(event.keyIdentifier === slideRightKey) ship.setEngine("right",    false);
    if(event.keyIdentifier === slideLeftKey)  ship.setEngine("left",     false);
    if(event.keyIdentifier === turnRightKey)  ship.setEngine("tright",   false);
    if(event.keyIdentifier === turnLeftKey)   ship.setEngine("tleft",    false);
    
    if(event.keyIdentifier === fireKey)       ship.fire("primary",    false);
    
    if(event.keyIdentifier === nextWep)       ship.nextWep();;
  }
}