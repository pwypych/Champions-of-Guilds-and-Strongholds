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
        const $buildingName = $('<div>' + building.namePretty + '</div>');
        raceBuilding.append($buildingName);

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
        onBuildCastleBuildingButtonClick($buyButton);
      }
    });
  }

  function onBuildCastleBuildingButtonClick($buyButton) {
    $buyButton.on('click', () => {
      const buildingName = $buyButton.attr('data-building-name');
      console.log(
        'onBuildCastleBuildingButtonClick:buildingName:',
        buildingName
      );
      sendBuildCastleBuildingPost(buildingName);
    });
  }

  function sendBuildCastleBuildingPost(buildingName) {
    const data = { buildingName: buildingName };
    $.post('/ajax/world/build/buildCastleBuildingPost' + auth.uri, data, () => {
      console.log(
        'sendBuildCastleBuildingPost: POST -> /ajax/world/build/buildCastleBuildingPost',
        data
      );
    });
  }
};
