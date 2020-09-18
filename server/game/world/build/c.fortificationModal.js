// @format

'use strict';

g.autoload.fortificationModal = (inject) => {
  const $body = inject.$body;
  const walkie = inject.walkie;
  const freshEntities = inject.freshEntities;
  const blueprint = inject.blueprint;
  const auth = inject.auth;

  // only main div should be found here js-world-interface-fortification-modal

  const $wrapper = $body.find('.js-fortification-build-wrapper');
  const $fortificationExample = $body.find(
    '.js-fortification-build-wrapper [data-example]'
  );
  const $resourceExample = $body.find(
    '.js-fortification-build-wrapper [data-example-resource]'
  );

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

  // why Builded array, not FortificationArray?
  function generateFortificationBuildedArray(playerId) {
    const buildedArray = [];
    _.forEach(freshEntities(), (entity) => {
      if (entity.fortificationName && entity.owner === playerId) {
        buildedArray.push(entity.fortificationName);
      }
    });

    fillFortificationDiv(playerId, buildedArray);
  }

  // div is not fabricated here now, must find new name for function
  function fillFortificationDiv(playerId, buildedArray) {
    const playerEntity = freshEntities()[playerId];
    const playerRace = playerEntity.playerData.race;

    // $wrapper should be defined here not on top
    // $fortificationExaple should be defined here not on top
    // $resourceExaple should be defined here top

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

        $($fortification).removeAttr('data-example');

        const $buildButton = $($fortification).find('button');
        const isFortificationBuilded = _.includes(buildedArray, name);

        if (isFortificationBuilded) {
          $buildButton.attr('disabled', 'disabled');
        }

        $wrapper.append($fortification);
        onButtonClick($buildButton, name);
      }
    });

    $body.find('.js-fortification-build-wrapper [data-example]').hide();
    $body
      .find('.js-fortification-build-wrapper [data-example-resource]')
      .hide();
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
      const $button = $body.find(
        '.js-world-interface-fortification-modal [data-fortification-name=' +
          fortificationName +
          ']'
      );
      $button.attr('disabled', 'disabled');
    });
  }
};
