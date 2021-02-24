// @format

'use strict';

// What does this module do?
// After state is changed to launchState it fills select input with options of different races to choose from
g.autoload.launchSelectRaceOptions = (inject) => {
  const $body = inject.$body;
  const walkie = inject.walkie;
  const freshEntities = inject.freshEntities;
  const blueprint = inject.blueprint;

  const $select = $body.find('[data-launch] [data-select-race]');

  (function init() {
    onViewportLaunchReady();
  })();

  function onViewportLaunchReady() {
    walkie.onEvent(
      'viewportLaunchReadyEvent_',
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
    $select.empty();

    _.forEach(blueprint.race, (race, id) => {
      const $option = $('<option value="' + id + '">' + id + '</option>');
      $select.append($option);
    });
  }
};
