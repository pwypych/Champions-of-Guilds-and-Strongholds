// @format

'use strict';

g.launch.launchDisableUi = ($body, walkie) => {
  const $button = $body.find('#js-launch .js-button-ready');
  const $inputName = $body.find('#js-launch .js-input-name');

  (function init() {
    onStateDataGet();
  })();

  function onStateDataGet() {
    walkie.onEvent(
      'entitiesGet_',
      'launchTable.js',
      (entities) => {
        if (entities[entities._id].state === 'launchState') {
          console.log('launchTable.js: update $table');
          disableUi(entities);
        }
      },
      false
    );
  }

  function disableUi(entities) {
    const player = _.find(entities, 'playerCurrent');

    if (player.playerData.readyForLaunch === 'yes') {
      $button.attr('disabled', 'disabled');
      $inputName.attr('disabled', 'disabled');
    }
  }
};
