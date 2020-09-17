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
    '.js-fortification-build-wrapper [data-resource-example]'
  );

  // console.log('$fortificationExample:', $fortificationExample);
  // console.log('$resourceExample:', $resourceExample);

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
    // $fortificationWrapper.empty();

    _.forEach(blueprint.fortification, (fortification, name) => {
      if (fortification.race === playerRace) {
        const $newFortification = $fortificationExample.clone();

        // Fortification name
        const fortificationName = $newFortification.find('div')[0];
        $(fortificationName).text(fortification.namePretty);

        // Fortification cost
        _.forEach(fortification.cost, (cost, resource) => {
          const $newResource = $resourceExample.clone();
          const resourceSprite = $newResource.find('img')[0];
          const resourceAmount = $newResource.find('span')[0];
          $(resourceAmount).text(cost);
          const spriteSrc = '/sprite/' + resource + '.png';
          $(resourceSprite).attr('src', spriteSrc);

          const $fortificationSprite = $newFortification.find('button')[0];
          $($newResource).removeAttr('data-resource-example');
          $fortificationSprite.before($newResource[0]);
        });

        // Fortification button
        const $fortificationButton = $newFortification.find('button')[0];
        $($fortificationButton).attr('data-fortification-name', name);

        const $fortificationName = $(
          '<div>' + fortification.namePretty + '</div>'
        );

        // Remove data-example
        $($newFortification).removeAttr('data-example');
        console.log('$newFortification:', $newFortification);

        // $fortificationWrapper.append($fortificationName);

        const $fortificationSprite = $(
          '<img class="vertical-align" src="/sprite/castleRandom.png" width="36" height="36">'
        );
        // $fortificationWrapper.append($fortificationSprite);

        _.forEach(fortification.cost, (cost, resource) => {
          const $resource = $(
            '<img class="vertical-align" src="/sprite/' +
              resource +
              '.png" width="36" height="36"><span>' +
              cost +
              '</span>'
          );
          // $fortificationWrapper.append($resource);
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

        // $fortificationWrapper.append($buildButton);
        $fortificationWrapper.append($newFortification);
        onFortificationBuildButtonClick($buildButton, name);
      }
    });

    $body.find('.js-fortification-build-wrapper [data-example]').hide();
    $body
      .find('.js-fortification-build-wrapper [data-resource-example]')
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
