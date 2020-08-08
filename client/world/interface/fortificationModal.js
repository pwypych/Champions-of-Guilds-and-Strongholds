// @format

'use strict';

g.world.fortificationModal = (
  $body,
  walkie,
  freshEntities,
  blueprint,
  auth
) => {
  const $modal = $body.find('.js-world-interface-fortification-modal');
  const raceFortification = $modal.find('.js-race-building');

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
        drawRaceFortificationToBuy(playerRace);
      }
    });
  }

  function drawRaceFortificationToBuy(playerRace) {
    raceFortification.empty();
    const $seperator10 = $('<div class="seperator-10"></div>');

    _.forEach(blueprint.fortification, (fortification, name) => {
      // console.log('drawRaceFortificationToBuy: fortification:', fortification);
      if (fortification.race === playerRace) {
        const $fortificationName = $(
          '<div>' + fortification.namePretty + '</div>'
        );
        raceFortification.append($fortificationName);

        raceFortification.append($seperator10);

        const $fortificationSprite = $(
          '<img class="vertical-align" src="/sprite/castleRandom.png" width="36" height="36">'
        );
        raceFortification.append($fortificationSprite);

        _.forEach(fortification.buildingCost, (cost, resource) => {
          const $resource = $(
            '<img class="vertical-align" src="/sprite/' +
              resource +
              '.png" width="36" height="36"><span>' +
              cost +
              '</span>'
          );
          raceFortification.append($resource);
        });

        const $buyButton = $(
          '<button class="js-button-buy" data-fortification-name="' +
            name +
            '">Build</button>'
        );

        raceFortification.append($buyButton);
        onBuildFortificationButtonClick($buyButton);
      }
    });
  }

  function onBuildFortificationButtonClick($buyButton) {
    $buyButton.on('click', () => {
      const fortificationName = $buyButton.attr('data-fortification-name');
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
