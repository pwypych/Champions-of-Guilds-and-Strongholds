// @format

'use strict';

// What does this module do
// Generate modal with race fortifications to build
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
      'viewportWorldReadyEvent_',
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

    fillFortificationDiv(playerId);
  }

  function fillFortificationDiv(playerId) {
    const playerEntity = freshEntities()[playerId];
    const playerRace = playerEntity.playerData.race;

    const $wrapper = $modal.find('[data-wrapper]');
    const $fortificationExample = $wrapper.find('[data-example-fortification]');
    const $resourceExample = $wrapper.find('[data-example-resource]');

    $wrapper.empty();

    _.forEach(blueprint.fortification, (fortification, name) => {
      if (fortification.race !== playerRace) {
        return;
      }

      const $fortification = $fortificationExample.clone();
      $($fortification).removeAttr('data-example-fortification');

      $fortification.find('[data-name]').text(fortification.namePretty);
      $($fortification).removeAttr('data-name');

      _.forEach(fortification.cost, (cost, resource) => {
        const $resource = $resourceExample.clone();
        $($resource).attr('data-resource', resource);
        const spriteSrc = '/sprite/' + resource + '.png';

        $resource.find('span').text(cost);
        $resource.find('img').attr('src', spriteSrc);

        $resource.insertBefore($fortification.find('button'));
        $($resource).removeAttr('data-example-resource');
      });

      const $button = $($fortification).find('[data-button]');
      $button.attr('data-fortification-name', name);
      $($button).removeAttr('data-button');

      $wrapper.append($fortification);
      onButtonClick($button, name);
    });

    $wrapper.find('[data-example-fortification]').hide();
    $wrapper.find('[data-example-resource]').hide();

    triggerFortificationModalDrawnEvent();
  }

  function onButtonClick($button, fortificationName) {
    $button.on('click', () => {
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
      $($button).hide();
      triggerFortificationBuildedEvent();
    });
  }

  function triggerFortificationBuildedEvent() {
    walkie.triggerEvent('fortificationBuildedEvent_', 'fortificationModal.js');
  }

  function triggerFortificationModalDrawnEvent() {
    walkie.triggerEvent(
      'fortificationModalDrawnEvent_',
      'fortificationModal.js'
    );
  }
};
