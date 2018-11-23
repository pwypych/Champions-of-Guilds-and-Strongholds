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
      'stateDataGet_',
      'launchTable.js',
      (stateData) => {
        if (stateData.state === 'launchState') {
          console.log('launchTable.js: update $table');
          disableUi(stateData.playerIndex, stateData.playerArray);
        }
      },
      false
    );
  }

  function disableUi(playerIndex, playerArray) {
    const player = playerArray[playerIndex];
    if (player.ready === 'yes') {
      $button.attr('disabled', 'disabled');
      $inputName.attr('disabled', 'disabled');
    }
  }
};
