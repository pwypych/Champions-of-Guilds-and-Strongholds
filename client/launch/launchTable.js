// @format

'use strict';

g.launch.launchTable = ($body, walkie, freshEntities) => {
  const $table = $body.find('.js-launch .js-table-name');

  (function init() {
    onEntitiesGet();
  })();

  function onEntitiesGet() {
    walkie.onEvent(
      'entitiesGet_',
      'launchTable.js',
      () => {
        const gameEntity = freshEntities()[freshEntities()._id];

        if (gameEntity.state !== 'launchState') {
          return;
        }

        updateTable();
      },
      false
    );
  }

  function updateTable() {
    $table.empty();
    const $title = $('<tr></tr>');
    $title.append('<td>Name</td>');
    $title.append('<td>Color</td>');
    $title.append('<td>Race</td>');
    $title.append('<td>Ready</td>');
    $table.append($title);

    _.forEach(freshEntities(), (entity) => {
      if (!entity.playerData) {
        return;
      }

      const $tr = $('<tr></tr>');
      $tr.append('<td>' + (entity.playerData.name || 'Player') + '</td>');
      $tr.append('<td>' + (entity.playerData.color || 'Default') + '</td>');
      $tr.append('<td>' + (entity.playerData.race || 'Random') + '</td>');

      if (entity.readyForLaunch) {
        $tr.append('<td>Yes</td>');
      } else {
        $tr.append('<td>No</td>');
      }

      $table.append($tr);
    });
  }
};
