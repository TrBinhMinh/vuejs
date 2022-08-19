const getRandomValue = function (min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
};

const app = Vue.createApp({
  data() {
    return {
      playerHealth: 100,
      monsterHealth: 100,
      currentRound: 0,
      winner: null,
      battleLogMessages: [],
    };
  },
  watch: {
    playerHealth(vl) {
      if (vl <= 0 && this.monsterHealth <= 0) {
        this.winner = "draw";
      } else if (vl <= 0) {
        this.winner = "monster";
      }
    },
    monsterHealth(vl) {
      if (vl <= 0 && this.playerHealth <= 0) {
        this.winner = "draw";
      } else if (vl <= 0) {
        this.winner = "player";
      }
    },
  },
  methods: {
    attackMonster() {
      this.currentRound++;
      const attackValue = getRandomValue(5, 12);
      this.monsterHealth -= attackValue;
      this.addLogMessage("player", "attack", attackValue);
      this.attackPlayer();
    },
    attackPlayer() {
      const attackValue = getRandomValue(8, 15);
      this.playerHealth -= attackValue;
      this.addLogMessage("monster", "attack", attackValue);
    },
    specialAttackMonster() {
      this.currentRound++;
      const attackValue = getRandomValue(10, 25);
      this.monsterHealth -= attackValue;
      this.addLogMessage("player", "attack", attackValue);
      this.attackPlayer();
    },
    healPlayer() {
      if (this.currentRound === 0) return;
      this.currentRound++;
      const healValue = getRandomValue(8, 20);
      if (this.playerHealth + healValue > 100) this.playerHealth = 100;
      else this.playerHealth += healValue;
      this.addLogMessage("player", "heal", healValue);
      this.attackPlayer();
    },
    reset() {
      this.playerHealth = 100;
      this.monsterHealth = 100;
      this.currentRound = 0;
      this.winner = null;
      this.battleLogMessages = [];
    },
    surrender() {
      this.winner = "monster";
    },
    addLogMessage(who, what, value) {
      this.battleLogMessages.unshift({
        actionBy: who,
        actionType: what,
        value,
      });
    },
  },
  computed: {
    monsterBarStyles() {
      if (this.monsterHealth < 0) return { width: "0%" };
      else return { width: this.monsterHealth + "%" };
    },
    playerBarStyles() {
      if (this.playerHealth < 0) return { width: "0%" };
      else return { width: this.playerHealth + "%" };
    },
    specialAttackAvailable() {
      return this.currentRound % 3 !== 0;
    },
    healPlayerUnavailable() {
      return this.currentRound === 0;
    },
  },
});
console.log(this.winner);

app.mount("#game");
