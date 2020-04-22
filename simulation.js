function speedSort(heroA, heroB) {
  if (heroA._currentStats["speed"] > heroB._currentStats["speed"]) {
    return -1;
  } else if (heroA._currentStats["speed"] < heroB._currentStats["speed"]) {
    return 1;
  } else if (heroA._attOrDef == "att" && heroB._attOrDef == "def") {
    return -1;
  } else if (heroA._attOrDef == "def" && heroB._attOrDef == "att") {
    return 1;
  } else if (heroA._heroPos < heroB._heroPos) {
    return -1;
  } else {
    return 1;
  }
}


function checkForWin() {
  var attAlive = 0;
  var defAlive = 0;
  var numOfHeroes = 0;
  
  numOfHeroes = attHeroes.length;
  for (var i = 0; i < numOfHeroes; i++) {
    if (attHeroes[i]._currentStats["totalHP"] > 0) {
      attAlive++;
    }
  }
  
  numOfHeroes = defHeroes.length;
  for (var i = 0; i < numOfHeroes; i++) {
    if (defHeroes[i]._currentStats["totalHP"] > 0) {
      defAlive++;
    }
  }
  
  if (attAlive == 0 && defAlive >= 0) {
    return "def";
  } else if (attAlive > 0 && defAlive == 0) {
    return "att";
  } else {
    return "";
  }
}


function runSim() {
  var oCombatLog = document.getElementById("combatLog");
  var numSims = document.getElementById("numSims").value;
  var roundNum = 0;
  var winCount = 0;
  var orderOfAttack = [];
  var numOfHeroes = 0;
  var result = {};
  var someoneWon = "";
  
  oCombatLog.innerHTML = "";
  
  for (var i = 0; i < attHeroes.length; i++) {
    attHeroes[i]._damageDealt = 0;
    attHeroes[i]._damageHealed = 0;
  }
  
  for (var i = 0; i < defHeroes.length; i++) {
    defHeroes[i]._damageDealt = 0;
    defHeroes[i]._damageHealed = 0;
  }
  
  for (var x = 1; x <= numSims; x++) {
    // @ start of single simulation
    
    oCombatLog.innerHTML += "<p>Simulation #" + x +" Started.</p>";
    someoneWon = "";
    
    // snapshot stats as they are
    orderOfAttack = [];
    
    numOfHeroes = attHeroes.length;
    for (var i = 0; i < numOfHeroes; i++) {
      if (attHeroes[i]._heroName != "None") {
        attHeroes[i].snapshotStats();
        orderOfAttack.push(attHeroes[i]);
      }
    }
    
    numOfHeroes = defHeroes.length;
    for (var i = 0; i < numOfHeroes; i++) {
      if (defHeroes[i]._heroName != "None") {
        defHeroes[i].snapshotStats();
        orderOfAttack.push(defHeroes[i]);
      }
    }
    
    for (roundNum = 1; roundNum <= 15; roundNum++) {
      // @ start of round
      
      // Output detailed combat log only if running a single simulation
      if(numSims == 1) {oCombatLog.innerHTML += "<p>Round " + roundNum + "</p>";}
      
      orderOfAttack.sort(speedSort);
      
      for (var i = 0; i < orderOfAttack.length; i++) {
        // @ start of hero action
        
        if (orderOfAttack[i]._currentStats["totalHP"] > 0) {
        
          if(numSims == 1) {oCombatLog.innerHTML += "<p><div>" + orderOfAttack[i]._heroName + "'s turn in position " + orderOfAttack[i]._heroPos + " of " + orderOfAttack[i]._attOrDef + " team.</div>";}
          
          // decide on action
          if (orderOfAttack[i]._currentStats["energy"] >= 100) {
            // do active
            result = orderOfAttack[i].doActive();
            if(numSims == 1) {oCombatLog.innerHTML += "<div>" + result["description"] + "</div>" + result["takeDamageDescription"] + result["eventDescription"];}
            someoneWon = checkForWin();
          } else {
            // do basic
            result = orderOfAttack[i].doBasic();
            if(numSims == 1) {oCombatLog.innerHTML += "<div>" + result["description"] + "</div>" + result["takeDamageDescription"] + result["eventDescription"];}
            someoneWon = checkForWin();
          }
          
          // @ end of hero action
          if(numSims == 1) {oCombatLog.innerHTML += "</p>";}
          
          if (someoneWon != "") {
            break;
          }
        }
      }
      
      if (someoneWon != "") {
        break;
      }
      
      // trigger end of round stuff, decrement buffs and debuffs, tick dots
      
      // @ end of round
    }
    
    if (someoneWon == "att") {
      winCount++;
      if(numSims == 1) {oCombatLog.innerHTML += "<p>Attacker wins!</p>";}
    } else {
      if(numSims == 1) {oCombatLog.innerHTML += "<p>Defender wins!</p>";}
    }
    
    
    numOfHeroes = attHeroes.length;
    for (var i = 0; i < numOfHeroes; i++) {
      if (attHeroes[i]._heroName != "None") {
        attHeroes[i]._damageDealt += attHeroes[i]._currentStats["damageDealt"];
        attHeroes[i]._currentStats["damageDealt"] = 0;
        attHeroes[i]._damageHealed += attHeroes[i]._currentStats["damageHealed"];
        attHeroes[i]._currentStats["damageHealed"] = 0;
      }
    }
    
    numOfHeroes = defHeroes.length;
    for (var i = 0; i < numOfHeroes; i++) {
      if (defHeroes[i]._heroName != "None") {
        defHeroes[i]._damageDealt += defHeroes[i]._currentStats["damageDealt"];
        defHeroes[i]._currentStats["damageDealt"] = 0;
        defHeroes[i]._damageHealed += defHeroes[i]._currentStats["damageHealed"];
        defHeroes[i]._currentStats["damageHealed"] = 0;
      }
    }
    
    oCombatLog.innerHTML += "<p>Simulation #" + x +" Ended.</p>";
    
    // @ end of simulation
  }
  
  oCombatLog.innerHTML += "<p>Attacker won " + winCount + " out of " + numSims + " (" + (winCount/numSims * 100).toFixed(2) + "%).</p>";
  
  oCombatLog.innerHTML += "<p>Attacker average damage summary.";
  for (var i = 0; i < attHeroes.length; i++) {
    if (attHeroes[i]._heroName != "None") {
      oCombatLog.innerHTML += "<div>" + attHeroes[i]._heroName + ": " + Math.floor(attHeroes[i]._damageDealt / numSims).toLocaleString() + "</div>";
    }
  }
  oCombatLog.innerHTML += "</p>";
  
  oCombatLog.innerHTML += "<p>Defender average damage summary.";
  for (var i = 0; i < defHeroes.length; i++) {
    if (defHeroes[i]._heroName != "None") {
      oCombatLog.innerHTML += "<div>" + defHeroes[i]._heroName + ": " + Math.floor(defHeroes[i]._damageDealt / numSims).toLocaleString() + "</div>";
    }
  }
  oCombatLog.innerHTML += "</p>";
  
  oCombatLog.innerHTML += "<p>Attacker average healing summary.";
  for (var i = 0; i < attHeroes.length; i++) {
    if (attHeroes[i]._heroName != "None") {
      oCombatLog.innerHTML += "<div>" + attHeroes[i]._heroName + ": " + Math.floor(attHeroes[i]._damageHealed / numSims).toLocaleString() + "</div>";
    }
  }
  oCombatLog.innerHTML += "</p>";
  
  oCombatLog.innerHTML += "<p>Defender average healing summary.";
  for (var i = 0; i < defHeroes.length; i++) {
    if (defHeroes[i]._heroName != "None") {
      oCombatLog.innerHTML += "<div>" + defHeroes[i]._heroName + ": " + Math.floor(defHeroes[i]._damageHealed / numSims).toLocaleString() + "</div>";
    }
  }
  oCombatLog.innerHTML += "</p>";
  
  oCombatLog.scrollTop = 0;
}