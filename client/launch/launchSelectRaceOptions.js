// @format

'use strict';

g.launch.launchSelectRaceOptions = (
  $body,
  walkie,
  freshEntities,
  blueprints
) => {
  const $select = $body.find('.js-launch .js-select-race');

  (function init() {
    onEntitiesGet();
  })();

  function onEntitiesGet() {
    walkie.onEvent(
      'entitiesGetFirst_',
      'launchSelectRaceOptions.js',
      () => {
        const gameEntity = freshEntities()[freshEntities()._id];

        if (gameEntity.state !== 'launchState') {
          return;
        }

        updateSelect();
      },
      false
    );
  }

  function updateSelect() {
    const raceBlueprint = blueprints.raceBlueprint;
    $select.empty();

    _.forEach(raceBlueprint, (race, id) => {
      const $option = $('<option value="' + id + '">' + id + '</option>');
      $select.append($option);
    });
  }
};
