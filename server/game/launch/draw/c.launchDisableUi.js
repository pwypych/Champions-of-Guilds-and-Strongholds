// @format

'use strict';

// What does this module do?
// Checks if player is readyForLaunch and disables UI and buttons
g.autoload.launchDisableUi = (inject) => {
  const $body = inject.$body;
  const walkie = inject.walkie;
  const freshEntities = inject.freshEntities;

  const $button = $body.find('[data-launch] [data-button-ready]');
  const $inputName = $body.find('[data-launch] [data-input-name]');
  const $selectRace = $body.find('[data-launch] [data-select-race]');

  (function init() {
    onEntitiesGet();
  })();

  function onEntitiesGet() {
    walkie.onEvent(
      'entitiesGetEvent_',
      'launchTable.js',
      () => {
        const gameEntity = freshEntities()[freshEntities()._id];
        if (gameEntity.state !== 'launchState') {
          return;
        }

        disableUi();
      },
      false
    );
  }

  function disableUi() {
    const player = _.find(freshEntities(), 'playerCurrent');

    if (player.readyForLaunch) {
      $button.attr('disabled', 'disabled');
      $inputName.attr('disabled', 'disabled');
      $selectRace.attr('disabled', 'disabled');
    }
  }
};
