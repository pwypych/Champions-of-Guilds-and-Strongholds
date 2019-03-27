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
      recruitCost: 50,
      maneuvers: {
        melee: {
          damage: 2
        }
      }
    },

    skeleton: {
      tier: 1,
      life: 7,
      initiative: 25,
      movement: 4,
      maneuverPoints: 2,
      recruitCost: 70,
      maneuvers: {
        melee: {
          damage: 2
        }
      }
    },

    ranger: {
      tier: 1,
      life: 5,
      initiative: 50,
      movement: 4,
      maneuverPoints: 2,
      recruitCost: 80,
      maneuvers: {
        melee: {
          damage: 1
        },
        shoot: {
          damage: 1
        }
      }
    },

    // Tier 2
    plant: {
      tier: 2,
      life: 14,
      initiative: 45,
      movement: 3,
      maneuverPoints: 2,
      recruitCost: 130,
      maneuvers: {
        melee: {
          damage: 1
        },
        shoot: {
          damage: 3
        }
      }
    },

    undeadRogue: {
      tier: 2,
      life: 16,
      initiative: 35,
      movement: 4,
      maneuverPoints: 2,
      recruitCost: 110,
      maneuvers: {
        melee: {
          damage: 5
        }
      }
    },

    rogue: {
      tier: 2,
      life: 20,
      initiative: 40,
      movement: 6,
      maneuverPoints: 2,
      recruitCost: 100,
      maneuvers: {
        melee: {
          damage: 3
        }
      }
    },

    // Tier 3
    eyeball: {
      tier: 3,
      life: 31,
      initiative: 40,
      movement: 4,
      maneuverPoints: 2,
      recruitCost: 200,
      maneuvers: {
        melee: {
          damage: 5
        }
      }
    },

    crazyWizard: {
      tier: 3,
      life: 24,
      initiative: 45,
      movement: 3,
      maneuverPoints: 2,
      recruitCost: 240,
      maneuvers: {
        melee: {
          damage: 1
        },
        shoot: {
          damage: 5
        }
      }
    },

    warrior: {
      tier: 3,
      life: 35,
      initiative: 55,
      movement: 5,
      maneuverPoints: 2,
      recruitCost: 200,
      maneuvers: {
        melee: {
          damage: 4
        }
      }
    },

    // Tier 4
    worm: {
      tier: 4,
      life: 42,
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
      life: 28,
      initiative: 30,
      movement: 6,
      maneuverPoints: 2,
      recruitCost: 300,
      maneuvers: {
        melee: {
          damage: 8
        },
        shoot: {
          damage: 2
        }
      }
    },

    orc: {
      tier: 4,
      life: 49,
      initiative: 41,
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
      life: 91,
      initiative: 65,
      movement: 3,
      maneuverPoints: 2,
      recruitCost: 600,
      maneuvers: {
        melee: {
          damage: 15
        }
      }
    },

    blackKnight: {
      tier: 5,
      life: 77,
      initiative: 75,
      movement: 4,
      maneuverPoints: 2,
      recruitCost: 550,
      maneuvers: {
        melee: {
          damage: 13
        }
      }
    },

    cleric: {
      tier: 5,
      life: 63,
      initiative: 30,
      movement: 6,
      maneuverPoints: 2,
      recruitCost: 500,
      maneuvers: {
        melee: {
          damage: 10
        }
      }
    }
  };
};
