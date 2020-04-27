// 1* Foolish
class Foolish extends hero {
  constructor(sHeroName, iHeroPos, attOrDef) {
    super(sHeroName, iHeroPos, attOrDef);
  }
  
  doActive() {
    var result = "";
    var damageResult = {};
    var target = getFirstTarget(this._enemies);
    
    damageResult = this.calcDamage(target, this._currentStats["totalAttack"], "active", "normal", 1.8);
    result = this.formatDamageResult(target, damageResult, "Thump");
    this._currentStats["energy"] = 0;
    
    activeQueue.push([this, target]);
    
    return result;
  }
}


// 5* Baade
class Baade extends hero {
  constructor(sHeroName, iHeroPos, attOrDef) {
    super(sHeroName, iHeroPos, attOrDef);
  }
  
  passiveStats() {
    // apply Will of Undead passive
    this.applyStatChange({attackPercent: 0.1, hpPercent: 0.2, armorBreak: 0.2}, "PassiveStats");
  }
  
  doBasic() {
    var result = "";
    var damageResult = {};
    var additionalDamageResult = {};
    var target = getLowestHPTarget(this._enemies);
    var additionalDamage = 0;
    
    damageResult = this.calcDamage(target, this._currentStats["totalAttack"] * 1.1, "basic", "normal", 1, 0);
    additionalDamage = damageResult["damageAmount"];
    result = this.formatDamageResult(target, damageResult, "Basic Attack");
    
    if (target._currentStats["totalHP"] > 0) {
      var outcomeRoll = Math.random();
      
      if (outcomeRoll < 0.75) {
        if (outcomeRoll < 0.5) {
          additionalDamage = additionalDamage * 0.5;
        } else if (outcomeRoll < 0.75) {
          additionalDamage = additionalDamage * 1.25;
        }
        
        additionalDamage = Math.round(additionalDamage);
        damageResult["damageAmount"] += additionalDamage;
        additionalDamageResult = {
          damageAmount: additionalDamage, 
          critted: 0, 
          blocked: 0, 
          damageSource: "basic2", 
          damageType: "normal", 
          e5Desc: ""
        };
        
        result += "Passive <span class='skill'>Death Threat</span> did additional damage: " + formatNum(additionalDamage) + ". ";
        result += target.takeDamage(this, additionalDamageResult);
      }
    }
    
    result += this.getEnergy(this, 50);
    basicQueue.push([this, target]);
    
    return result;
  }
  
  doActive() {
    var result = "";
    var damageResult = {};
    var additionalDamageResult = {};
    var target = getLowestHPTarget(this._enemies);
    var healAmount = 0;
    var additionalDamage = 0;
    
    damageResult = this.calcDamage(target, this._currentStats["totalAttack"], "active", "normal", 1.5, 0);
    additionalDamage = damageResult["damageAmount"];
    
    result = this.formatDamageResult(target, damageResult, "Nether Strike");
    
    if (target._currentStats["totalHP"] > 0) {
      var outcomeRoll = Math.random();
      
      if (outcomeRoll < 0.84) {
        if (outcomeRoll < 0.48) {
          additionalDamage = additionalDamage;
        } else if (outcomeRoll < 0.84) {
          additionalDamage = additionalDamage * 3;
        }
        
        additionalDamage = Math.round(additionalDamage);
        damageResult["damageAmount"] += additionalDamage;
        additionalDamageResult = {
          damageAmount: additionalDamage, 
          critted: 0, 
          blocked: 0, 
          damageSource: "active2", 
          damageType: "normal", 
          e5Desc: ""
        };
        
        result += "<span class='skill'>Nether Strike</span> did additional damage: " + formatNum(additionalDamage) + ". ";
        result += target.takeDamage(this, additionalDamageResult);
      }
    }
    
    this._currentStats["energy"] = 0;
    
    healAmount = Math.round((damageResult["damageAmount"] + additionalDamage) * 0.2);
    result += this.getHeal(this, healAmount);
    result += this.getBuff(this, "Nether Strike", 6, {attackPercent: 0.4});
    
    activeQueue.push([this, target]);
    
    return result;
  }
  
  eventEnemyDied(source, target) { 
    var result = ""
    
    if (this._currentStats["totalHP"] > 0) {
      result = "<div>" + this.heroDesc() + " <span class='skill'>Blood Armor</span> passive triggered.</div>";
      result += this.getBuff(this, "Blood Armor", 1, {damageReduce: 0.1});
    }
    
    return result;
  }
}


// E5 Aida
class Aida extends hero {
  constructor(sHeroName, iHeroPos, attOrDef) {
    super(sHeroName, iHeroPos, attOrDef);
  }
  
  passiveStats() {
    // apply Blessing of Light passive
    this.applyStatChange({hpPercent: 0.4, holyDamage: 1.0, damageReduce: 0.3, speed: 80}, "PassiveStats");
  }
}


// E5 AmenRa
class AmenRa extends hero {
  constructor(sHeroName, iHeroPos, attOrDef) {
    super(sHeroName, iHeroPos, attOrDef);
  }
  
  passiveStats() {
    // apply Aura of Despair passive
    this.applyStatChange({hpPercent: 0.2, attackPercent: 0.25, damageReduce: 0.25}, "PassiveStats");
  }
}


// E5 Aspen
class Aspen extends hero {
  constructor(sHeroName, iHeroPos, attOrDef) {
    super(sHeroName, iHeroPos, attOrDef);
  }
  
  passiveStats() {
    // apply Dark Storm passive
    this.applyStatChange({hpPercent: 0.4, attackPercent: 0.2, crit: 0.35, armorBreak: 0.5}, "PassiveStats");
  }
}


// E5 Belrain
class Belrain extends hero {
  constructor(sHeroName, iHeroPos, attOrDef) {
    super(sHeroName, iHeroPos, attOrDef);
  }
  
  passiveStats() {
    // apply Divine Awakening passive
    this.applyStatChange({hpPercent: 0.3, attackPercent: 0.45, controlImmune: 0.3, healEffect: 0.4}, "PassiveStats");
  }
}


// E5 Carrie
class Carrie extends hero {
  constructor(sHeroName, iHeroPos, attOrDef) {
    super(sHeroName, iHeroPos, attOrDef);
  }
  
  passiveStats() {
    // apply Darkness Befall passive
    this.applyStatChange({attackPercent: 0.25, controlImmune: 0.3, speed: 60}, "PassiveStats");
  }
}


// E5 Cthuga
class Cthuga extends hero {
  constructor(sHeroName, iHeroPos, attOrDef) {
    super(sHeroName, iHeroPos, attOrDef);
  }
  
  passiveStats() {
    // apply Demon Bloodline passive
    this.applyStatChange({attackPercent: 0.25, hpPercent: 0.2, damageReduce: 0.2}, "PassiveStats");
  }
}


// E5 Garuda
class Garuda extends hero {
  constructor(sHeroName, iHeroPos, attOrDef) {
    super(sHeroName, iHeroPos, attOrDef);
  }
  
  passiveStats() {
    // apply Eagle Power passive
    this.applyStatChange({attackPercent: 0.25, hpPercent: 0.3, critDamage: 0.4, controlImmune: 0.3}, "PassiveStats");
  }
}


// E5 Gustin
class Gustin extends hero {
  constructor(sHeroName, iHeroPos, attOrDef) {
    super(sHeroName, iHeroPos, attOrDef);
  }
  
  passiveStats() {
    // apply Shadow Imprint passive
    this.applyStatChange({hpPercent: 0.25, speed: 30, controlImmune: 0.3, effectBeingHealed: 0.3}, "PassiveStats");
  }
}


// E5 Horus
class Horus extends hero {
  constructor(sHeroName, iHeroPos, attOrDef) {
    super(sHeroName, iHeroPos, attOrDef);
  }
  
  passiveStats() {
    // apply Corrupted Rebirth passive
    this.applyStatChange({hpPercent: 0.4, attackPercent: 0.3, armorBreak: 0.4, block: 0.6}, "PassiveStats");
  }
}


// E5 Mihm
class Mihm extends hero {
  constructor(sHeroName, iHeroPos, attOrDef) {
    super(sHeroName, iHeroPos, attOrDef);
  }
  
  passiveStats() {
    // apply Unreal Instinct passive
    this.applyStatChange({hpPercent: 0.4, damageReduce: 0.3, speed: 60, controlImmune: 1.0}, "PassiveStats");
  }
}


// E5 Nakia
class Nakia extends hero {
  constructor(sHeroName, iHeroPos, attOrDef) {
    super(sHeroName, iHeroPos, attOrDef);
  }
  
  passiveStats() {
    // apply Arachnid Madness passive
    this.applyStatChange({attackPercent: 0.35, crit: 0.35, controlImmune: 0.3, speed: 30}, "PassiveStats");
  }
}


// E5 Oberon
class Oberon extends hero {
  constructor(sHeroName, iHeroPos, attOrDef) {
    super(sHeroName, iHeroPos, attOrDef);
  }
  
  passiveStats() {
    // apply Strength of Elf passive
    this.applyStatChange({attackPercent: 0.3, hpPercent: 0.35, speed: 40, effectBeingHealed: 0.3}, "PassiveStats");
  }
}


// E5 Penny
class Penny extends hero {
  constructor(sHeroName, iHeroPos, attOrDef) {
    super(sHeroName, iHeroPos, attOrDef);
  }
  
  passiveStats() {
    // apply Troublemaker Gene passive
    this.applyStatChange({attackPercent: 0.3, hpPercent: 0.25, crit: 0.3, precision: 1.0}, "PassiveStats");
  }
}


// E5 Tara
class Tara extends hero {
  constructor(sHeroName, iHeroPos, attOrDef) {
    super(sHeroName, iHeroPos, attOrDef);
  }
  
  passiveStats() {
    // apply Immense Power passive
    this.applyStatChange({hpPercent: 0.4, holyDamage: 0.7, controlImmune: 0.3, damageReduce: 0.3}, "PassiveStats");
  }
}


// E5 Unimax-3000
class UniMax3000 extends hero {
  constructor(sHeroName, iHeroPos, attOrDef) {
    super(sHeroName, iHeroPos, attOrDef);
  }
  
  passiveStats() {
    // apply Machine Forewarning passive
    this.applyStatChange({armorPercent: 0.3, hpPercent: 0.4, attackPercent: 0.25, controlImmune: 0.3, energy: 50}, "PassiveStats");
  }
}