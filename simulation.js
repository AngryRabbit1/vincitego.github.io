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


function formatNum(num) {
  return "<span class ='num'>" + num.toLocaleString() + "</span>";
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
  var monsterResult = "";
  var someoneWon = "";
  var endRoundDesc = "";
  var numLiving = 0;
  
  var attMonsterName = document.getElementById("attMonster").value;
  var attMonster = new baseMonsterStats[attMonsterName]["className"](attMonsterName, "att");
  
  var defMonsterName = document.getElementById("defMonster").value;
  var defMonster = new baseMonsterStats[defMonsterName]["className"](defMonsterName, "def");
  
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
    
    if(numSims == 1) {oCombatLog.innerHTML += "<p class ='logSeg'>Simulation #" + formatNum(x) +" Started.</p>"};
    someoneWon = "";
    attMonster._energy = 0;
    defMonster._energy = 0;
    
    // snapshot stats as they are
    orderOfAttack = [];
    
    numOfHeroes = attHeroes.length;
    for (var i = 0; i < numOfHeroes; i++) {
      if (attHeroes[i]._heroName != "None") {
        attHeroes[i].snapshotStats();
        attHeroes[i]._buffs = {};
        attHeroes[i]._debuffs = {};
        orderOfAttack.push(attHeroes[i]);
      }
    }
    
    numOfHeroes = defHeroes.length;
    for (var i = 0; i < numOfHeroes; i++) {
      if (defHeroes[i]._heroName != "None") {
        defHeroes[i].snapshotStats();
        defHeroes[i]._buffs = {};
        defHeroes[i]._debuffs = {};
        orderOfAttack.push(defHeroes[i]);
      }
    }
    
    for (roundNum = 1; roundNum <= 15; roundNum++) {
      // @ start of round
      
      // Output detailed combat log only if running a single simulation
      if(numSims == 1) {oCombatLog.innerHTML += "<p class='logSeg'>Round " + formatNum(roundNum) + " Start</p>";}
      
      orderOfAttack.sort(speedSort);
      
      for (var i = 0; i < orderOfAttack.length; i++) {
        // @ start of hero action
        
        if (orderOfAttack[i]._currentStats["totalHP"] > 0) {
        
          if(numSims == 1) {oCombatLog.innerHTML += "<p>";}
          
          // decide on action
          if (orderOfAttack[i]._currentStats["energy"] >= 100) {
            // do active
            result = orderOfAttack[i].doActive();
            if(numSims == 1) {oCombatLog.innerHTML += "<div>" + result["description"] + "</div>" + result["eventDescription"];}
            
            if (orderOfAttack[i]._attOrDef == "att") {
              if (attMonster._monsterName != "None") {
                monsterResult = "<div>" + attMonster.monsterDesc() + " gained " + formatNum(10) + " energy. ";
                attMonster._energy += 10;
                monsterResult += "Energy at " + formatNum(attMonster._energy) + ".</div>"
                if(numSims == 1) {oCombatLog.innerHTML += monsterResult;}
              }
            } else {
              if (defMonster._monsterName != "None") {
                monsterResult = "<div>" + defMonster.monsterDesc() + " gained " + formatNum(10) + " energy. ";
                defMonster._energy += 10;
                monsterResult += "Energy at " + formatNum(defMonster._energy) + ".</div>"
                if(numSims == 1) {oCombatLog.innerHTML += monsterResult;}
              }
            }
            
            someoneWon = checkForWin();
          } else {
            // do basic
            result = orderOfAttack[i].doBasic();
            if(numSims == 1) {oCombatLog.innerHTML += "<div>" + result["description"] + "</div>" + result["eventDescription"];}
            
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
      
      // trigger end of round stuff
      oCombatLog.innerHTML += "<p><div class='logSeg'>End of round " + formatNum(roundNum) + ".</div>";
      
      // handle monster stuff
      if (attMonster._monsterName != "None") {
        monsterResult = "<p><div>" + attMonster.monsterDesc() + " gained " + formatNum(20) + " energy. ";
        attMonster._energy += 20;
        monsterResult += "Energy at " + formatNum(attMonster._energy) + ".</div>"
      
        if (attMonster._energy >= 100) {
          monsterResult += attMonster.doActive();
        }
        
        if(numSims == 1) {oCombatLog.innerHTML += monsterResult + "</p>";}
      }
      
      if (defMonster._monsterName != "None") {
        monsterResult = "<p><div>" + defMonster.monsterDesc() + " gained " + formatNum(20) + " energy. ";
        defMonster._energy += 20;
        monsterResult += "Energy at " + formatNum(defMonster._energy) + ".</div>"
      
        if (defMonster._energy >= 100) {
          monsterResult += defMonster.doActive();
        }
        
        if(numSims == 1) {oCombatLog.innerHTML += monsterResult + "</p>";}
      }
      
      // handle buffs and debuffs
      for (var h in orderOfAttack) {
        if(numSims == 1) {oCombatLog.innerHTML += orderOfAttack[h].tickBuffs();}
      }
      
      for (var h in orderOfAttack) {
        if(numSims == 1) {oCombatLog.innerHTML += orderOfAttack[h].tickDebuffs();}
      }
      
      // get number of living heroes for shared fate enable
      numLiving = 0;
      for (var h in orderOfAttack) {
        if (orderOfAttack[h]._currentStats["totalHP"] > 0) { numLiving++; }
      }
      
      // trigger E3 enables
      for (var h in orderOfAttack) {
        if (orderOfAttack[h]._currentStats["totalHP"] > 0) { 
          if(numSims == 1) {oCombatLog.innerHTML += orderOfAttack[h].tickEnable3(numLiving);}
        }
      }
      
      if(numSims == 1) {oCombatLog.innerHTML += "</p>";}
      
      // @ end of round
    }
    
    if (someoneWon == "att") {
      winCount++;
      if(numSims == 1) {oCombatLog.innerHTML += "<p class='logSeg'>Attacker wins!</p>";}
    } else {
      if(numSims == 1) {oCombatLog.innerHTML += "<p class='logSeg'>Defender wins!</p>";}
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
    
    if(numSims == 1) {oCombatLog.innerHTML += "<p class='logSeg'>Simulation #" + formatNum(x) +" Ended.</p>"};
    
    // @ end of simulation
  }
  
  oCombatLog.innerHTML += "<p class='logSeg'>Attacker won " + winCount + " out of " + numSims + " (" + formatNum((winCount/numSims * 100).toFixed(2)) + "%).</p>";
  
  // damage summary
  oCombatLog.innerHTML += "<p><div class='logSeg'>Attacker average damage summary.</div>";
  for (var i = 0; i < attHeroes.length; i++) {
    if (attHeroes[i]._heroName != "None") {
      oCombatLog.innerHTML += "<div>" + attHeroes[i].heroDesc() + ": " + formatNum(Math.floor(attHeroes[i]._damageDealt / numSims)) + "</div>";
    }
  }
  if (attMonster._monsterName != "None") {
    oCombatLog.innerHTML += "<div>" + attMonster.monsterDesc() + ": " + formatNum(Math.floor(attMonster._currentStats["damageDealt"] / numSims)) + "</div>";
  }
  oCombatLog.innerHTML += "</p>";
  
  oCombatLog.innerHTML += "<p><div class='logSeg'>Defender average damage summary.</div>";
  for (var i = 0; i < defHeroes.length; i++) {
    if (defHeroes[i]._heroName != "None") {
      oCombatLog.innerHTML += "<div>" + defHeroes[i].heroDesc() + ": " + formatNum(Math.floor(defHeroes[i]._damageDealt / numSims)) + "</div>";
    }
  }
  if (defMonster._monsterName != "None") {
    oCombatLog.innerHTML += "<div>" + defMonster.monsterDesc() + ": " + formatNum(Math.floor(defMonster._currentStats["damageDealt"] / numSims)) + "</div>";
  }
  oCombatLog.innerHTML += "</p>";
  
  // healing and damage prevention summary
  oCombatLog.innerHTML += "<p><div class='logSeg'>Attacker average healing and damage prevention summary.</div>";
  for (var i = 0; i < attHeroes.length; i++) {
    if (attHeroes[i]._heroName != "None") {
      oCombatLog.innerHTML += "<div>" + attHeroes[i].heroDesc() + ": " + formatNum(Math.floor(attHeroes[i]._damageHealed / numSims)) + "</div>";
    }
  }
  if (attMonster._monsterName != "None") {
    oCombatLog.innerHTML += "<div>" + attMonster.monsterDesc() + ": " + formatNum(Math.floor(attMonster._currentStats["damageHealed"] / numSims)) + "</div>";
  }
  oCombatLog.innerHTML += "</p>";
  
  oCombatLog.innerHTML += "<p><div class='logSeg'>Defender average healing and damage prevention summary.</div>";
  for (var i = 0; i < defHeroes.length; i++) {
    if (defHeroes[i]._heroName != "None") {
      oCombatLog.innerHTML += "<div>" + defHeroes[i].heroDesc() + ": " + formatNum(Math.floor(defHeroes[i]._damageHealed / numSims)) + "</div>";
    }
  }
  if (defMonster._monsterName != "None") {
    oCombatLog.innerHTML += "<div>" + defMonster.monsterDesc() + ": " + formatNum(Math.floor(defMonster._currentStats["damageHealed"] / numSims)) + "</div>";
  }
  oCombatLog.innerHTML += "</p>";
  
  oCombatLog.scrollTop = 0;
}