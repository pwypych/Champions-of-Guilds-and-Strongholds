// @format

'use strict';

// What does this module do?
// Returns object with all unit stats

module.exports = () => {
  return {
    // Tier 1
    butterfly: {
      tier: 1,
      life: 5,
      initiative: 75,
      movement: 8,
      maneuverPoints: 2,
      recruitCost: 40,
      maneuvers: {
        melee: {
          damage: 2
        }
      }
    },

    skeleton: {
      tier: 1,
      life: 8,
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
      initiative: 35,
      movement: 6,
      maneuverPoints: 2,
      recruitCost: 120,
      maneuvers: {
        melee: {
          damage: 2
        },
        shoot: {
          damage: 2
        }
      }
    },

    undeadRogue: {
      tier: 2,
      life: 18,
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

    rogue: {
      tier: 2,
      life: 21,
      initiative: 40,
      movement: 4,
      maneuverPoints: 2,
      recruitCost: 130,
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
      life: 91,
      initiative: 50,
      movement: 4,
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
      life: 77,
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
      life: 63,
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
