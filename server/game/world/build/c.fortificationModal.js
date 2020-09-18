// @format

'use strict';

g.autoload.fortificationModal = (inject) => {
  const $body = inject.$body;
  const walkie = inject.walkie;
  const freshEntities = inject.freshEntities;
  const blueprint = inject.blueprint;
  const auth = inject.auth;

  const $fortificationWrapper = $body.find('.js-fortification-build-wrapper');
  const $fortificationExample = $body.find(
    '.js-fortification-build-wrapper [data-example]'
  );
  const $resourceExample = $body.find(
    '.js-fortification-build-wrapper [data-example-resource]'
  );

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
        const $fortification = $fortificationExample.clone();

        $fortification
          .find('div')
          .first()
          .text(fortification.namePretty);

        _.forEach(fortification.cost, (cost, resource) => {
          const $resource = $resourceExample.clone();
          const spriteSrc = '/sprite/' + resource + '.png';

          $resource
            .find('span')
            .first()
            .text(cost);

          $resource
            .find('img')
            .first()
            .attr('src', spriteSrc);

          $($resource).removeAttr('data-example-resource');

          $fortification
            .find('button')
            .first()
            .before($resource.first());
        });

        $fortification
          .find('button')
          .first()
          .attr('data-fortification-name', name);

        $($fortification).removeAttr('data-example');

        const $buildButton = $($fortification)
          .find('button')
          .first();

        const isFortificationBuilded = _.includes(
          fortificationBuildedArray,
          name
        );

        if (isFortificationBuilded) {
          $buildButton.attr('disabled', 'disabled');
        }

        $fortificationWrapper.append($fortification);
        onFortificationBuildButtonClick($buildButton, name);
      }
    });

    $body.find('.js-fortification-build-wrapper [data-example]').hide();
    $body
      .find('.js-fortification-build-wrapper [data-example-resource]')
      .hide();
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
