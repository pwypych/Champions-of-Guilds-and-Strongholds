// @format

'use strict';

g.world.castleModal = ($body, walkie, freshEntities, blueprints) => {
  const $modal = $body.find('.js-world-interface-castle-modal');
  const raceBuildings = $modal.find('.js-race-building');
  const buildingBlueprint = blueprints.buildingBlueprint;

  (function init() {
    onEntitiesGet();
  })();

  function onEntitiesGet() {
    walkie.onEvent(
      'entitiesGet_',
      'informationModal.js',
      () => {
        const gameEntity = freshEntities()[freshEntities()._id];

        if (gameEntity.state !== 'worldState') {
          return;
        }

        findPlayerRace();
      },
      false
    );
  }

  function findPlayerRace() {
    _.forEach(freshEntities(), (entity) => {
      if (entity.playerCurrent) {
        const playerRace = entity.playerData.race;
        drawRaceBuildings(playerRace);
      }
    });
  }

  function drawRaceBuildings(playerRace) {
    raceBuildings.empty();
    const $seperator10 = $('<div class="seperator-10"></div>');

    _.forEach(buildingBlueprint, (building, name) => {
      if (building.race === playerRace) {
        const $buildingName = $('<div>' + name + '</div>');
        raceBuildings.append($buildingName);

        raceBuildings.append($seperator10);

        const $buildingSprite = $(
          '<img class="vertical-align" src="/sprite/castleRandom.png" width="36" height="36">'
        );
        raceBuildings.append($buildingSprite);

        if (building.buildingCost.gold) {
          const $gold = $(
            '<img class="vertical-align" src="/sprite/gold.png" width="36" height="36"><span>' +
              building.buildingCost.gold +
              '</span>'
          );
          raceBuildings.append($gold);
        }

        if (building.buildingCost.wood) {
          const $wood = $(
            '<img class="vertical-align" src="/sprite/wood.png" width="36" height="36"><span>' +
              building.buildingCost.wood +
              '</span>'
          );
          raceBuildings.append($wood);
        }

        if (building.buildingCost.ore) {
          const $ore = $(
            '<img class="vertical-align" src="/sprite/stone.png" width="36" height="36"><span>' +
              building.buildingCost.ore +
              '</span>'
          );
          raceBuildings.append($ore);
        }

        if (building.buildingCost.crystal) {
          const $crystal = $(
            '<img class="vertical-align" src="/sprite/crystal.png" width="36" height="36"><span>' +
              building.buildingCost.crystal +
              '</span>'
          );
          raceBuildings.append($crystal);
        }

        const $buyButton = $(
          '<button class="js-button-buy" data-building-name="' +
            name +
            '">Build</button>'
        );

        raceBuildings.append($buyButton);
        // console.log('name:', name);
        // console.log('building:', building);
      }
    });
  }
};
