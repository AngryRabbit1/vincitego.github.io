// 1* Foolish
class Foolish extends hero {
  constructor(sHeroName, iHeroPos, attOrDef) {
    super(sHeroName, iHeroPos, attOrDef);
  }
}


// 5* Baade
class Baade extends hero {
  constructor(sHeroName, iHeroPos, attOrDef) {
    super(sHeroName, iHeroPos, attOrDef);
  }
  
  passiveStats() {
    // apply Will of Undead passive
    this.applyStatChange({attackPercent: 0.1, hpPercent: 0.2, armorBreak: 0.2}, "Passive1");
  }
}


// E5 Tara
class Tara extends hero {
  constructor(sHeroName, iHeroPos, attOrDef) {
    super(sHeroName, iHeroPos, attOrDef);
  }
  
  passiveStats() {
    // apply Immense Power passive
    this.applyStatChange({hpPercent: 0.4, holyDamage: 0.7, controlImmune: 0.3, damageReduce: 0.3}, "Passive1");
  }
}