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

    generateFortificationBuildedArray(playerId);
  }

  function generateFortificationBuildedArray(playerId) {
    const fortificationBuildedArray = [];
    _.forEach(freshEntities(), (entity) => {
      if (entity.fortificationName && entity.owner === playerId) {
        fortificationBuildedArray.push(entity.fortificationName);
      }
    });

    fabricateFortificationDiv(playerId, fortificationBuildedArray);
  }

  function fabricateFortificationDiv(playerId, fortificationBuildedArray) {
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

        const $buildButton = $(
          '<button class="js-button-build" data-fortification-name="' +
            name +
            '">Build</button>'
        );

        const isFortificationBuilded = _.includes(
          fortificationBuildedArray,
          name
        );
        if (isFortificationBuilded) {
          $buildButton.attr('disabled', 'disabled');
        }

        $fortificationWrapper.append($buildButton);
        onFortificationBuildButtonClick($buildButton, name);
      }
    });
  }

  function onFortificationBuildButtonClick($buildButton, fortificationName) {
    $buildButton.on('click', () => {
      sendFortificationBuildPost(fortificationName);
    });
  }

  function sendFortificationBuildPost(fortificationName) {
    const data = { fortificationName: fortificationName };
    $.post('/ajax/worldFortificationBuild' + auth.uri, data, () => {
      console.log(
        'sendFortificationBuildPost: POST -> /ajax/worldFortificationBuild',
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
