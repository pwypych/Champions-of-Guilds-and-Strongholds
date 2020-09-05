// @format

'use strict';

g.autoload.launchDisableUi = (inject) => {
  const $body = inject.$body;
  const walkie = inject.walkie;

  const $button = $body.find('.js-launch .js-button-ready');
  const $inputName = $body.find('.js-launch .js-input-name');
  const $selectRace = $body.find('.js-launch .js-select-race');

  (function init() {
    onEntitiesGet();
  })();

  function onEntitiesGet() {
    walkie.onEvent(
      'entitiesGet_',
      'launchTable.js',
      (entities) => {
        if (entities[entities._id].state === 'launchState') {
          disableUi(entities);
        }
      },
      false
    );
  }

  function disableUi(entities) {
    const player = _.find(entities, 'playerCurrent');

    if (player.readyForLaunch) {
      $button.attr('disabled', 'disabled');
      $inputName.attr('disabled', 'disabled');
      $selectRace.attr('disabled', 'disabled');
    }
  }
};
