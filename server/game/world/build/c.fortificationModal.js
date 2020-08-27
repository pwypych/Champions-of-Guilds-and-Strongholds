// @format

'use strict';

g.world.fortificationModal = (
  $body,
  walkie,
  freshEntities,
  blueprint,
  auth
) => {
  const $fortificationWrapper = $body.find('.js-fortification-build-wrapper');

  (function init() {
    onEntitiesGetFirst();
  })();

  function onEntitiesGetFirst() {
    walkie.onEvent(
      'entitiesGetFirst_',
      'fortificationModal.js',
      () => {
        const gameEntity = freshEntities()[freshEntities()._id];

        if (gameEntity.state !== 'worldState') {
          return;
        }

        findPlayerId();
      },
      false
    );
  }

  function findPlayerId() {
    let playerId;
    _.forEach(freshEntities(), (entity, id) => {
      if (entity.playerCurrent) {
        playerId = id;
      }
    });

    generateBuildedFortificationArray(playerId);
  }

  function generateBuildedFortificationArray(playerId) {
    const buildedFortificationArray = [];
    _.forEach(freshEntities(), (entity) => {
      if (entity.fortificationName && entity.owner === playerId) {
        buildedFortificationArray.push(entity.fortificationName);
      }
    });

    drawFortificationToBuild(playerId, buildedFortificationArray);
  }

  function drawFortificationToBuild(playerId, buildedFortificationArray) {
    const playerEntity = freshEntities()[playerId];
    const playerRace = playerEntity.playerData.race;
    $fortificationWrapper.empty();

    _.forEach(blueprint.fortification, (fortification, name) => {
      if (fortification.race === playerRace) {
        const $fortificationName = $(
          '<div>' + fortification.namePretty + '</div>'
        );
        $fortificationWrapper.append($fortificationName);

        const $fortificationSprite = $(
          '<img class="vertical-align" src="/sprite/castleRandom.png" width="36" height="36">'
        );
        $fortificationWrapper.append($fortificationSprite);

        _.forEach(fortification.buildingCost, (cost, resource) => {
          const $resource = $(
            '<img class="vertical-align" src="/sprite/' +
              resource +
              '.png" width="36" height="36"><span>' +
              cost +
              '</span>'
          );
          $fortificationWrapper.append($resource);
        });

        const $buyButton = $(
          '<button class="js-button-buy" data-fortification-name="' +
            name +
            '">Build</button>'
        );

        const isFortificationBuild = _.includes(
          buildedFortificationArray,
          name
        );
        if (isFortificationBuild) {
          $buyButton.attr('disabled', 'disabled');
        }

        $fortificationWrapper.append($buyButton);
        onBuildFortificationButtonClick($buyButton);
      }
    });
  }

  function onBuildFortificationButtonClick($buyButton) {
    // Pass fortificationName as function parameter, rename to on buyButtonClick
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
    $.post('/ajax/worldBuildFortification' + auth.uri, data, () => {
      console.log(
        'sendBuildFortificationPost: POST -> /ajax/worldBuildFortification',
        data
      );
    }).done(() => {
      const $button = $body.find(
        '.js-world-interface-fortification-modal [data-fortification-name=' +
          fortificationName +
          ']'
      );
      $button.attr('disabled', 'disabled');
    });
  }
};
