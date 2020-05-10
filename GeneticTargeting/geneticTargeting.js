var attHeroes = [];
var defHeroes = [];
var allTeams = {};
var heroNames = [];
var simRunning = false;
var stopLoop = false;
var attIndex = 0;
  
  
function initialize() {
  // layout stuff
  var acc = document.getElementsByClassName("colorA");
  for (var i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function() {
      /* Toggle between adding and removing the "active" class,
      to highlight the button that controls the panel */
      this.classList.toggle("activeA");

      /* Toggle between hiding and showing the active panel */
      var panel = this.nextElementSibling;
      if (panel.style.maxHeight) {
        panel.style.maxHeight = null;
      } else {
        panel.style.maxHeight = panel.scrollHeight + "px";
      }
    });
  }
  
  var acc = document.getElementsByClassName("colorB");
  for (var i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function() {
      this.classList.toggle("activeB");

      var panel = this.nextElementSibling;
      if (panel.style.maxHeight) {
        panel.style.maxHeight = null;
      } else {
        panel.style.maxHeight = panel.scrollHeight + "px";
      }
    });
  }
  
  var acc = document.getElementsByClassName("colorC");
  for (var i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function() {
      this.classList.toggle("activeC");

      var panel = this.nextElementSibling;
      if (panel.style.maxHeight) {
        panel.style.maxHeight = null;
      } else {
        panel.style.maxHeight = panel.scrollHeight + "px";
      }
    });
  }
}


function runMassLoop() {   
  var oLog = document.getElementById("summaryLog");
    
  if (simRunning == true) {
    oLog.innerHTML = "<p>Simulation already running.</p>" + oLog.innerHTML;
  } else {
    var oConfig = document.getElementById("configText");
    var jsonConfig = JSON.parse(oConfig.value);
    var jsonBenchmark = JSON.parse(document.getElementById("benchmark").value);
    var benchmarkDNA = jsonBenchmark["Benchmark"];
    var team;
    var tHero;
    var species;
    var teamIndex = 0;
    
    allTeams = {};
    defHeroes = [];
    attIndex = 0;
    
    // load benchmark team
    document.getElementById("defMonster").value = benchmarkDNA[60];
    
    for (var p = 0; p < 60; p += 10) {
      tHero = new baseHeroStats[benchmarkDNA[p]]["className"](benchmarkDNA[p], 1 + (p % 10), "def");
      
      tHero._heroLevel = 330;
      tHero._skin = benchmarkDNA[p+1];
      tHero._stone = benchmarkDNA[p+3];
      tHero._artifact = benchmarkDNA[p+4];
      tHero._enable1 = benchmarkDNA[p+5];
      tHero._enable2 = benchmarkDNA[p+6];
      tHero._enable3 = benchmarkDNA[p+7];
      tHero._enable4 = benchmarkDNA[p+8];
      tHero._enable5 = benchmarkDNA[p+9];
      
      if (benchmarkDNA[p+2] == "Class Gear") { 
        tHero._weapon = classGearMapping[tHero._heroClass]["weapon"];
        tHero._armor = classGearMapping[tHero._heroClass]["armor"];
        tHero._shoe = classGearMapping[tHero._heroClass]["shoe"];
        tHero._accessory = classGearMapping[tHero._heroClass]["accessory"];
        
      } else if (benchmarkDNA[p+2] == "Split HP") { 
        tHero._weapon = "6* Thorny Flame Whip";
        tHero._armor = classGearMapping[tHero._heroClass]["armor"];
        tHero._shoe = classGearMapping[tHero._heroClass]["shoe"];
        tHero._accessory = "6* Flame Necklace";
        
      } else if (benchmarkDNA[p+2] == "Split Attack") { 
        tHero._weapon = classGearMapping[tHero._heroClass]["weapon"];
        tHero._armor = "6* Flame Armor";
        tHero._shoe = "6* Flame Boots";
        tHero._accessory = "6* Flame Necklace";
      }
      
      defHeroes.push(tHero);
    }
    
    for (var p = 0; p < 6; p++) {
      defHeroes[p].updateCurrentStats();
    }
    
    
    // load trial teams
    for (var t in jsonConfig) {
      allTeams[teamIndex] = {};
      allTeams[teamIndex]["dna"] = jsonConfig[t];
      allTeams[teamIndex]["teamName"] = t;
      allTeams[teamIndex]["pet"] = jsonConfig[t][60];
      allTeams[teamIndex]["attWins"] = 0;
      
      team = [];
      species = "";
      
      for (var p = 0; p < 60; p += 10) {
        species += jsonConfig[t][p] + ", ";
        tHero = new baseHeroStats[jsonConfig[t][p]]["className"](jsonConfig[t][p], 1 + (p % 10), "");
        
        tHero._heroLevel = 330;
        tHero._skin = jsonConfig[t][p+1];
        tHero._stone = jsonConfig[t][p+3];
        tHero._artifact = jsonConfig[t][p+4];
        tHero._enable1 = jsonConfig[t][p+5];
        tHero._enable2 = jsonConfig[t][p+6];
        tHero._enable3 = jsonConfig[t][p+7];
        tHero._enable4 = jsonConfig[t][p+8];
        tHero._enable5 = jsonConfig[t][p+9];
        
        if (jsonConfig[t][p+2] == "Class Gear") { 
          tHero._weapon = classGearMapping[tHero._heroClass]["weapon"];
          tHero._armor = classGearMapping[tHero._heroClass]["armor"];
          tHero._shoe = classGearMapping[tHero._heroClass]["shoe"];
          tHero._accessory = classGearMapping[tHero._heroClass]["accessory"];
          
        } else if (jsonConfig[t][p+2] == "Split HP") { 
          tHero._weapon = "6* Thorny Flame Whip";
          tHero._armor = classGearMapping[tHero._heroClass]["armor"];
          tHero._shoe = classGearMapping[tHero._heroClass]["shoe"];
          tHero._accessory = "6* Flame Necklace";
          
        } else if (jsonConfig[t][p+2] == "Split Attack") { 
          tHero._weapon = classGearMapping[tHero._heroClass]["weapon"];
          tHero._armor = "6* Flame Armor";
          tHero._shoe = "6* Flame Boots";
          tHero._accessory = "6* Flame Necklace";
        }
        
        team.push(tHero);
      }
      
      species += jsonConfig[t][p];
      allTeams[teamIndex]["species"] = species;
      allTeams[teamIndex]["team"] = team;
      teamIndex++;
    }
    
    simRunning = true;
    stopLoop = false;
    oLog.innerHTML = "<p>Starting mass simulation.</p>";
    
    // start first matchup
    setTimeout(nextMatchup, 1);
  }
}


function nextMatchup() {
  var oLog = document.getElementById("summaryLog");
  var numSims = document.getElementById("numSims").value;
  var teamKeys = Object.keys(allTeams);
  
  if (attIndex >= teamKeys.length || stopLoop) {
    var summary = "";
    var totalFights = numSims;
    
    
    teamKeys.sort(function(a,b) {
      if (allTeams[a]["attWins"] > allTeams[b]["attWins"]) {
        return -1;
      } else if (allTeams[a]["attWins"] < allTeams[b]["attWins"]) {
        return 1;
      } else {
        return 0;
      }
    });
    
    for (var p in teamKeys) {
      summary += "Team " + allTeams[teamKeys[p]]["teamName"] + " (" + allTeams[teamKeys[p]]["species"] + ") attack win rate: " + Math.round(allTeams[teamKeys[p]]["attWins"] / totalFights * 100, 2) + "%\n"
    }
    
    simRunning = false;
    document.getElementById("generationLog").value = "Generation " + document.getElementById("genCount").value + " summary.\n" + summary + "\n";
    
    if (stopLoop) { 
      oLog.innerHTML = "<p>Loop stopped by user.</p>" + oLog.innerHTML; 
    } else {
      evolve(teamKeys);
    }
    
  } else {
    var numWins = 0;

    attHeroes = allTeams[attIndex]["team"];
    document.getElementById("attMonster").value = allTeams[attIndex]["pet"];

    for (var p = 0; p < 6; p++) {
      attHeroes[p]._attOrDef = "att";
      attHeroes[p]._allies = attHeroes;
      attHeroes[p]._enemies = defHeroes;
    }

    for (var p = 0; p < 6; p++) {
      defHeroes[p]._enemies = attHeroes;
    }
    
    for (var p = 0; p < 6; p++) {
      attHeroes[p].updateCurrentStats();
    }
    
    numAttWins = runSim();
    allTeams[attIndex]["attWins"] += numAttWins;
    oLog.innerHTML = "<div><span class='att'>" + allTeams[attIndex]["teamName"] + " (" + allTeams[attIndex]["species"] + ")</span> versus benchmark team. Won " + formatNum(numAttWins) + " out of " + formatNum(numSims) + ".</div>" + oLog.innerHTML;
    
    // start next matchup
    attIndex++;
    setTimeout(nextMatchup, 1);
  }
}


function createRandomTeams() {
  var heroName = "";
  var skinNames;
  var legendarySkins;
  var stoneNames = Object.keys(stones);
  var monsterNames = Object.keys(baseMonsterStats);
  var oConfig = document.getElementById("configText");
  var jsonBenchmark = JSON.parse(document.getElementById("benchmark").value);
  var numCreate = parseInt(document.getElementById("numCreate").value);
  
  heroNames = jsonBenchmark["Usable Heroes"];
  var artifactNames = ["Antlers Cane", "Demon Bell", "Staff Punisher of Immortal", "Magic Stone Sword", "Augustus Magic Ball",
    "The Kiss of Ghost", "Lucky Candy Bar", "Wildfire Torch", "Golden Crown", "Ruyi Scepter"];
  var equipments = ["Class Gear", "Split HP", "Split Attack"];
  var enables1 = ["Vitality", "Mightiness", "Growth"];
  var enables2 = ["Shelter", "LethalFightback", "Vitality2"];
  var enables3 = ["Resilience", "SharedFate", "Purify"];
  var enables4 = ["Vitality", "Mightiness", "Growth"];
  var enables5 = ["BalancedStrike", "UnbendingWill"];
  
  oConfig.value = "{\n";
  
  for(i=0; i<numCreate; i++) {
    oConfig.value += "\"" + i + "\": [\n";
    
    for (h=1; h<=6; h++) {
      heroName = heroNames[Math.floor(Math.random() * (heroNames.length - 1)) + 1];
      oConfig.value += "  \"" + heroName + "\", ";
      
      skinNames = Object.keys(skins[heroName]);
      legendarySkins = [];
      for (var s in skinNames) {
        if (skinNames[s].substring(0, 9) == "Legendary") {
          legendarySkins.push(skinNames[s]);
        }
      }
      oConfig.value += "\"" + legendarySkins[Math.floor(Math.random() * legendarySkins.length)] + "\", ";
      
      oConfig.value += "\"" + equipments[Math.floor(Math.random() * equipments.length)] + "\", ";
      oConfig.value += "\"" + stoneNames[Math.floor(Math.random() * (stoneNames.length - 1)) + 1] + "\", ";
      oConfig.value += "\"" + artifactNames[Math.floor(Math.random() * (artifactNames.length - 1)) + 1] + "\", ";
      oConfig.value += "\"" + enables1[Math.floor(Math.random() * enables1.length)] + "\", ";
      oConfig.value += "\"" + enables2[Math.floor(Math.random() * enables2.length)] + "\", ";
      oConfig.value += "\"" + enables3[Math.floor(Math.random() * enables3.length)] + "\", ";
      oConfig.value += "\"" + enables4[Math.floor(Math.random() * enables4.length)] + "\", ";
      oConfig.value += "\"" + enables5[Math.floor(Math.random() * enables5.length)] + "\",\n";
    }
    
    oConfig.value += "  \"" + monsterNames[Math.floor(Math.random() * (monsterNames.length - 1)) + 1] + "\"\n";
    
    if (i<(numCreate-1)) {
      oConfig.value += "],\n";
    } else {
      oConfig.value += "]\n";
    }
  }
  
  oConfig.value += "}";
  oConfig.select();
  oConfig.setSelectionRange(0, oConfig.value.length);
  document.execCommand("copy");
}


function evolve(teamKeys) {
  var t=0;
  var oConfig = document.getElementById("configText");
  var dna1;
  var dnaString1;
  var children = [];
  
  var numCreate = parseInt(document.getElementById("numCreate").value);
  var i10p = Math.floor(numCreate * 0.1);
  
  oConfig.value = "{\n";
  
  // clone top 20%
  for (t=0; t < i10p*2; t++) {
    dna1 = allTeams[teamKeys[t]]["dna"];
    dnaString1 = "\"" + t + "\": [\n";
    
    for (var h=0; h<6; h++) {
      dnaString1 += " ";
      
      for (var g=0; g<10; g++) {
        dnaString1 += " \"" + dna1[h*10 + g] + "\",";
      }
      
      dnaString1 += "\n";
    }
    
    dnaString1 += "  \"" + dna1[60] + "\"\n],\n"
    oConfig.value += dnaString1;
  }
  
  
  // breed next 30% from top 30
  for (t=i10p*2; t < i10p*5; t++) {
    children = breed(teamKeys, 0, i10p*3, 0.01, 0.20);
    oConfig.value += "\"" + t + "\": [" + children[0] + "\n],\n";
    t++;
    oConfig.value += "\"" + t + "\": [" + children[1] + "\n],\n";
  }
  
  // breed next 30% from 21-50
  for (t=i10p*5; t < i10p*8; t++) {
    children = breed(teamKeys, i10p*2, i10p*5, 0.05, 0.20);
    oConfig.value += "\"" + t + "\": [" + children[0] + "\n],\n";
    t++;
    oConfig.value += "\"" + t + "\": [" + children[1] + "\n],\n";
  }
  
  // breed last 20% from 51-90
  for (t=i10p*8; t<numCreate; t++) {
    children = breed(teamKeys, i10p*5, i10p*9, 0.25, 0.20);
    oConfig.value += "\"" + t + "\": [" + children[0] + "\n],\n";
    
    t++;
    if (t == numCreate-1) {
      oConfig.value += "\"" + t + "\": [" + children[1] + "\n]\n";
    } else {
      oConfig.value += "\"" + t + "\": [" + children[1] + "\n],\n";
    }
  }
  

  oConfig.value += "}";
  document.getElementById("genCount").value = parseInt(document.getElementById("genCount").value) + 1;
  runMassLoop();
}


function breed(teamKeys, start, end, mutationRate, posSwapRate) {
  var parentA;
  var parentB;
  var dna1;
  var dna2;
  var child1;
  var child2;
  var dnaString1;
  var dnaString2;
  var pos1 = 0;
  var pos2 = 0;
  
  var temp = "";
  var crossOver;
  
  var heroName = "";
  var skinNames;
  var legendarySkins;
  var stoneNames = Object.keys(stones);
  var monsterNames = Object.keys(baseMonsterStats);
  
  var artifactNames = ["Antlers Cane", "Demon Bell", "Staff Punisher of Immortal", "Magic Stone Sword", "Augustus Magic Ball",
    "The Kiss of Ghost", "Lucky Candy Bar", "Wildfire Torch", "Golden Crown", "Ruyi Scepter"];
  var equipments = ["Class Gear", "Split HP", "Split Attack"];
  var enables1 = ["Vitality", "Mightiness", "Growth"];
  var enables2 = ["Shelter", "LethalFightback", "Vitality2"];
  var enables3 = ["Resilience", "SharedFate", "Purify"];
  var enables4 = ["Vitality", "Mightiness", "Growth"];
  var enables5 = ["BalancedStrike", "UnbendingWill"];
  
  
  parentA = Math.floor(Math.random() * (end - start)) + start;
  dna1 = allTeams[teamKeys[parentA]]["dna"];
  
  parentB = Math.floor(Math.random() * (end - start)) + start;
  while (parentA == parentB) {
    parentB = Math.floor(Math.random() * (end - start)) + start;
  }
  dna2 = allTeams[teamKeys[parentB]]["dna"];
  
  
  // breed
  crossOver = Math.floor(Math.random() * 60) + 1;
  if (crossOver % 10 == 1) { crossOver++; }
  child1 = [];
  child2 = [];
  
  for (var g = 0; g < crossOver; g++) {
    child1.push(dna1[g]);
    child2.push(dna2[g]);
  }
  
  for (var g = crossOver; g < 60; g++) {
    child1.push(dna2[g]);
    child2.push(dna1[g]);
  }
  
  if (crossOver == 60) {
    child1.push(dna2[60]);
    child2.push(dna1[60]);
  } else {
    child1.push(dna1[60]);
    child2.push(dna2[60]);
  }
  
  
  // mutate child 1 genes
  for (var g = 0; g < 60; g++) {
    if (Math.random() < mutationRate) {
      switch(g % 10) {
        case 0:
          child1[g] = heroNames[Math.floor(Math.random() * (heroNames.length - 1)) + 1];
          
          skinNames = Object.keys(skins[child1[g]]);
          legendarySkins = [];
          for (var s in skinNames) {
            if (skinNames[s].substring(0, 9) == "Legendary") {
              legendarySkins.push(skinNames[s]);
            }
          }
          skinName = legendarySkins[Math.floor(Math.random() * legendarySkins.length)];
          child1[g+1] = skinName;
          break;
          
        case 1:
          skinNames = Object.keys(skins[child1[g-1]]);
          legendarySkins = [];
          for (var s in skinNames) {
            if (skinNames[s].substring(0, 9) == "Legendary") {
              legendarySkins.push(skinNames[s]);
            }
          }
          skinName = legendarySkins[Math.floor(Math.random() * legendarySkins.length)];
          child1[g] = skinName;
          break;
          
        case 2:
          child1[g] = equipments[Math.floor(Math.random() * equipments.length)];
          break;
          
        case 3:
          child1[g] = stoneNames[Math.floor(Math.random() * (stoneNames.length - 1)) + 1];
          break;
          
        case 4:
          child1[g] = artifactNames[Math.floor(Math.random() * (artifactNames.length - 1)) + 1];
          break;
          
        case 5:
          child1[g] = enables1[Math.floor(Math.random() * enables1.length)];
          break;
          
        case 6:
          child1[g] = enables2[Math.floor(Math.random() * enables2.length)];
          break;
          
        case 7:
          child1[g] = enables3[Math.floor(Math.random() * enables3.length)];
          break;
          
        case 8:
          child1[g] = enables4[Math.floor(Math.random() * enables4.length)];
          break;
          
        case 9:
          child1[g] = enables5[Math.floor(Math.random() * enables5.length)];
          break;
      }
    }
  }
  
  // mutate child 1 pet
  if (Math.random() < mutationRate) {
    child1[60] = monsterNames[Math.floor(Math.random() * (monsterNames.length - 1)) + 1];
  }
  
  
  // mutate child 2 genes
  for (var g = 0; g < 60; g++) {
    if (Math.random() < mutationRate) {
      switch(g % 10) {
        case 0:
          child2[g] = heroNames[Math.floor(Math.random() * (heroNames.length - 1)) + 1];
          
          skinNames = Object.keys(child2[g]);
          legendarySkins = [];
          for (var s in skinNames) {
            if (skinNames[s].substring(0, 9) == "Legendary") {
              legendarySkins.push(skinNames[s]);
            }
          }
          skinName = legendarySkins[Math.floor(Math.random() * legendarySkins.length)];
          child2[g+1] = skinName;
          break;
          
        case 1:
          skinNames = Object.keys(child2[g-1]);
          legendarySkins = [];
          for (var s in skinNames) {
            if (skinNames[s].substring(0, 9) == "Legendary") {
              legendarySkins.push(skinNames[s]);
            }
          }
          skinName = legendarySkins[Math.floor(Math.random() * legendarySkins.length)];
          child2[g] = skinName;
          break;
          
        case 2:
          child2[g] = equipments[Math.floor(Math.random() * equipments.length)];
          break;
          
        case 3:
          child2[g] = stoneNames[Math.floor(Math.random() * (stoneNames.length - 1)) + 1];
          break;
          
        case 4:
          child2[g] = artifactNames[Math.floor(Math.random() * (artifactNames.length - 1)) + 1];
          break;
          
        case 5:
          child2[g] = enables1[Math.floor(Math.random() * enables1.length)];
          break;
          
        case 6:
          child2[g] = enables2[Math.floor(Math.random() * enables2.length)];
          break;
          
        case 7:
          child2[g] = enables3[Math.floor(Math.random() * enables3.length)];
          break;
          
        case 8:
          child2[g] = enables4[Math.floor(Math.random() * enables4.length)];
          break;
          
        case 9:
          child2[g] = enables5[Math.floor(Math.random() * enables5.length)];
          break;
      }
    }
  }
  
  // mutate child 2 pet
  if (Math.random() < mutationRate) {
    child2[60] = monsterNames[Math.floor(Math.random() * (monsterNames.length - 1)) + 1];
  }
  
  
  // position swap for child 1
  if (Math.random() < posSwapRate) {
    pos1 = Math.floor(Math.random() * 6);
    pos2 = Math.floor(Math.random() * 6);
    while (pos1 == pos2) {
      pos2 = Math.floor(Math.random() * 6);
    }
    
    for (var g=0; g<10; g++) {
      temp = child1[pos1*10 + g];
      child1[pos1*10 + g] = child1[pos2*10 + g];
      child1[pos2*10 + g] = temp;
    }
  }
  
  
  // position swap for child 2
  if (Math.random() < posSwapRate) {
    pos1 = Math.floor(Math.random() * 6);
    pos2 = Math.floor(Math.random() * 6);
    while (pos1 == pos2) {
      pos2 = Math.floor(Math.random() * 6);
    }
    
    for (var g=0; g<10; g++) {
      temp = child2[pos1*10 + g];
      child2[pos1*10 + g] = child2[pos2*10 + g];
      child2[pos2*10 + g] = temp;
    }
  }
  
  
  // output child genes
  dnaString1 = "";
  for (var h=0; h<6; h++) {
    dnaString1 += "\n ";
    
    for (var g=0; g<10; g++) {
      dnaString1 += " \"" + child1[h*10 + g] + "\",";
    }
  }
  dnaString1 += "\n  \"" + child1[60] + "\"";
  
  
  dnaString2 = "";
  for (var h=0; h<6; h++) {
    dnaString2 += "\n ";
    
    for (var g=0; g<10; g++) {
      dnaString2 += " \"" + child2[h*10 + g] + "\",";
    }
  }
  dnaString2 += "\n  \"" + child2[60] + "\"";
  
  return [dnaString1, dnaString2];
}