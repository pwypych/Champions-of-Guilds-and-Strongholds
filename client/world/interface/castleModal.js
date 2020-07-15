// @format

'use strict';

g.world.castleModal = ($body, walkie, freshEntities, blueprints, auth) => {
  const $modal = $body.find('.js-world-interface-castle-modal');
  const raceBuilding = $modal.find('.js-race-building');
  const buildingBlueprint = blueprints.buildingBlueprint;

  (function init() {
    onEntitiesGetFirst();
  })();

  function onEntitiesGetFirst() {
    walkie.onEvent(
      'entitiesGetFirst_',
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
        drawRaceBuildingToBuy(playerRace);
      }
    });
  }

  function drawRaceBuildingToBuy(playerRace) {
    raceBuilding.empty();
    const $seperator10 = $('<div class="seperator-10"></div>');

    _.forEach(buildingBlueprint, (building, name) => {
      if (building.race === playerRace) {
        const $fortificationName = $('<div>' + building.namePretty + '</div>');
        raceBuilding.append($fortificationName);

        raceBuilding.append($seperator10);

        const $buildingSprite = $(
          '<img class="vertical-align" src="/sprite/castleRandom.png" width="36" height="36">'
        );
        raceBuilding.append($buildingSprite);

        _.forEach(building.buildingCost, (cost, resource) => {
          const $resource = $(
            '<img class="vertical-align" src="/sprite/' +
              resource +
              '.png" width="36" height="36"><span>' +
              cost +
              '</span>'
          );
          raceBuilding.append($resource);
        });

        const $buyButton = $(
          '<button class="js-button-buy" data-building-name="' +
            name +
            '">Build</button>'
        );

        raceBuilding.append($buyButton);
        onBuildFortificationButtonClick($buyButton);
      }
    });
  }

  function onBuildFortificationButtonClick($buyButton) {
    $buyButton.on('click', () => {
      const fortificationName = $buyButton.attr('data-building-name');
      console.log(
        'onBuildFortificationButtonClick:fortificationName:',
        fortificationName
      );
      sendBuildFortificationPost(fortificationName);
    });
  }

  function sendBuildFortificationPost(fortificationName) {
    const data = { fortificationName: fortificationName };
    $.post('/ajax/world/build/buildFortificationPost' + auth.uri, data, () => {
      console.log(
        'sendBuildFortificationPost: POST -> /ajax/world/build/buildFortificationPost',
        data
      );
    });
  }
};
