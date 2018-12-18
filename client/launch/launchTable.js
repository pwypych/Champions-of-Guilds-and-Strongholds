// @format

'use strict';

g.launch.launchTable = ($body, walkie) => {
  const $table = $body.find('#js-launch .js-table-name');

  (function init() {
    onStateDataGet();
  })();

  function onStateDataGet() {
    walkie.onEvent(
      'entitiesGet_',
      'launchTable.js',
      (entities) => {
        if (entities[entities._id].state === 'launchState') {
          // console.log('launchTable.js: update $table');
          updateTable(entities);
        }
      },
      false
    );
  }

  function updateTable(entities) {
    $table.empty();
    const $title = $('<tr></tr>');
    $title.append('<td>Name</td>');
    $title.append('<td>Color</td>');
    $title.append('<td>Race</td>');
    $title.append('<td>Ready</td>');
    $table.append($title);

    _.forEach(entities, (entity) => {
      if (!entity.playerData) {
        return;
      }

      const $tr = $('<tr></tr>');
      $tr.append('<td>' + (entity.playerData.name || 'Player') + '</td>');
      $tr.append('<td>' + (entity.playerData.color || 'Default') + '</td>');
      $tr.append('<td>' + (entity.playerData.race || 'Random') + '</td>');
      $tr.append('<td>' + (entity.playerData.readyForLaunch || 'No') + '</td>');
      $table.append($tr);
    });
  }
};
