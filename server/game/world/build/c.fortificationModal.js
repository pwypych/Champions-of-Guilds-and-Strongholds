// @format

'use strict';

g.autoload.fortificationModal = (inject) => {
  const $body = inject.$body;
  const walkie = inject.walkie;
  const freshEntities = inject.freshEntities;
  const blueprint = inject.blueprint;
  const auth = inject.auth;

  const $modal = $body.find('[data-world-interface-fortification-modal]');

  (function init() {
    onViewportWorldReady();
  })();

  function onViewportWorldReady() {
    walkie.onEvent(
      'viewportWorldReady_',
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

    fillFortificationDiv(playerId, fortificationBuildedArray);
  }

  function fillFortificationDiv(playerId, fortificationBuildedArray) {
    const playerEntity = freshEntities()[playerId];
    const playerRace = playerEntity.playerData.race;

    const $wrapper = $modal.find('[data-wrapper]');
    const $fortificationExample = $wrapper.find('[data-example-fortification]');
    const $resourceExample = $wrapper.find('[data-example-resource]');

    $wrapper.empty();

    _.forEach(blueprint.fortification, (fortification, name) => {
      if (fortification.race === playerRace) {
        const $fortification = $fortificationExample.clone();

        $fortification.find('div').text(fortification.namePretty);

        _.forEach(fortification.cost, (cost, resource) => {
          const $resource = $resourceExample.clone();
          const spriteSrc = '/sprite/' + resource + '.png';

          $resource.find('span').text(cost);
          $resource.find('img').attr('src', spriteSrc);
          $($resource).removeAttr('data-example-resource');

          $resource.insertBefore($fortification.find('button'));
        });

        $fortification.find('button').attr('data-fortification-name', name);

        $($fortification).removeAttr('data-example-fortification');

        const $buildButton = $($fortification).find('button');
        const isFortificationBuilded = _.includes(
          fortificationBuildedArray,
          name
        );

        if (isFortificationBuilded) {
          $buildButton.attr('disabled', 'disabled');
        }

        $wrapper.append($fortification);
        onButtonClick($buildButton, name);
      }
    });

    $wrapper.find('[data-example-fortification]').hide();
    $wrapper.find('[data-example-resource]').hide();
  }

  function onButtonClick($buildButton, fortificationName) {
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
      const $button = $modal.find(
        '[data-fortification-name=' + fortificationName + ']'
      );
      $button.attr('disabled', 'disabled');
    });
  }
};
