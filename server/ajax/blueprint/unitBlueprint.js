// @format

'use strict';

// What does this module do?
// Returns object with all unit stats

module.exports = () => {
  return {
    // Tier 1
    butterfly: {
      tier: 1,
      life: 4,
      initiative: 75,
      movement: 8,
      maneuverPoints: 2,
      recruitCost: 40,
      maneuvers: {
        melee: {
          damage: 1
        }
      }
    },

    skeleton: {
      tier: 1,
      life: 6,
      initiative: 25,
      movement: 4,
      maneuverPoints: 2,
      recruitCost: 60,
      maneuvers: {
        melee: {
          damage: 2
        }
      }
    },

    rogue: {
      tier: 1,
      life: 5,
      initiative: 50,
      movement: 4,
      maneuverPoints: 2,
      recruitCost: 80,
      maneuvers: {
        melee: {
          damage: 3
        }
      }
    },

    // Tier 2
    eyeball: {
      tier: 2,
      life: 10,
      initiative: 35,
      movement: 6,
      maneuverPoints: 2,
      recruitCost: 120,
      maneuvers: {
        melee: {
          damage: 5
        }
      }
    },

    undeadRogue: {
      tier: 2,
      life: 13,
      initiative: 35,
      movement: 4,
      maneuverPoints: 2,
      recruitCost: 110,
      maneuvers: {
        melee: {
          damage: 4
        }
      }
    },

    warrior: {
      tier: 2,
      life: 17,
      initiative: 40,
      movement: 4,
      maneuverPoints: 2,
      recruitCost: 130,
      maneuvers: {
        melee: {
          damage: 2
        }
      }
    },

    // Tier 3
    plant: {
      tier: 3,
      life: 22,
      initiative: 40,
      movement: 4,
      maneuverPoints: 2,
      recruitCost: 200,
      maneuvers: {
        melee: {
          damage: 2
        },
        shoot: {
          damage: 5
        }
      }
    },

    crazyWizard: {
      tier: 3,
      life: 17,
      initiative: 45,
      movement: 5,
      maneuverPoints: 2,
      recruitCost: 240,
      maneuvers: {
        melee: {
          damage: 1
        },
        shoot: {
          damage: 6
        }
      }
    },

    ranger: {
      tier: 3,
      life: 20,
      initiative: 55,
      movement: 5,
      maneuverPoints: 2,
      recruitCost: 200,
      maneuvers: {
        melee: {
          damage: 1
        },
        shoot: {
          damage: 4
        }
      }
    },

    // Tier 4
    worm: {
      tier: 4,
      life: 30,
      initiative: 60,
      movement: 6,
      maneuverPoints: 2,
      recruitCost: 320,
      maneuvers: {
        melee: {
          damage: 7
        }
      }
    },

    wizard: {
      tier: 4,
      life: 20,
      initiative: 30,
      movement: 6,
      maneuverPoints: 2,
      recruitCost: 300,
      maneuvers: {
        melee: {
          damage: 8
        }
      }
    },

    orc: {
      tier: 4,
      life: 35,
      initiative: 45,
      movement: 6,
      maneuverPoints: 2,
      recruitCost: 350,
      maneuvers: {
        melee: {
          damage: 6
        }
      }
    },

    // Tier 5
    minotaur: {
      tier: 5,
      life: 60,
      initiative: 50,
      movement: 5,
      maneuverPoints: 2,
      recruitCost: 600,
      maneuvers: {
        melee: {
          damage: 10
        }
      }
    },

    blackKnight: {
      tier: 5,
      life: 45,
      initiative: 55,
      movement: 5,
      maneuverPoints: 2,
      recruitCost: 550,
      maneuvers: {
        melee: {
          damage: 15
        }
      }
    },

    cleric: {
      tier: 5,
      life: 55,
      initiative: 70,
      movement: 6,
      maneuverPoints: 2,
      recruitCost: 500,
      maneuvers: {
        melee: {
          damage: 13
        }
      }
    }
  };
};
