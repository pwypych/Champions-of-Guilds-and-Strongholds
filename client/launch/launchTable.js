// @format

'use strict';

g.launch.launchTable = ($body, walkie) => {
  const $table = $body.find('#js-launch .js-table-name');

  (function init() {
    onStateDataGet();
  })();

  function onStateDataGet() {
    walkie.onEvent(
      'stateDataGet_',
      'launchTable.js',
      (stateData) => {
        if (stateData.state === 'launchState') {
          // console.log('launchTable.js: update $table');
          updateTable(stateData.playerArray);
        }
      },
      false
    );
  }

  function updateTable(playerArray) {
    $table.empty();
    const $title = $('<tr></tr>');
    $title.append('<td>Name</td>');
    $title.append('<td>Color</td>');
    $title.append('<td>Race</td>');
    $title.append('<td>Ready</td>');
    $table.append($title);

    playerArray.forEach((player) => {
      const $tr = $('<tr></tr>');
      $tr.append('<td>' + (player.name || 'Player') + '</td>');
      $tr.append('<td>' + (player.color || 'Default') + '</td>');
      $tr.append('<td>' + (player.race || 'Random') + '</td>');
      $tr.append('<td>' + (player.ready || 'No') + '</td>');
      $table.append($tr);
    });
  }
};
