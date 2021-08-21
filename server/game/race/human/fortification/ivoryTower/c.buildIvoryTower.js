// @format

'use strict';

// Listens to event when player build ivory tower
// sends request to backend to build that fortification
g.autoload.buildIvoryTower = (inject) => {
  const walkie = inject.walkie;
  const auth = inject.auth;

  (function init() {
    onFortificationBuildButtonClick();
  })();

  function onFortificationBuildButtonClick() {
    walkie.onEvent(
      'fortificationBuildButtonClickEvent_',
      'buildIvoryTower.js',
      (data) => {
        const fortificationName = data.fortificationName;

        if (fortificationName === 'ivoryTower') {
          ivoryTowerBuildPost(data);
        }
      },
      false
    );
  }

  function ivoryTowerBuildPost(data) {
    $.post('/ajax/buildIvoryTower' + auth.uri, data, () => {
      console.log(
        'sendFortificationBuildPost: POST -> /ajax/buildIvoryTower',
        data
      );
    }).done(() => {
      console.log('Build success');
    });
  }
};
