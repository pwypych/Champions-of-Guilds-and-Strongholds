// @format

'use strict';

// Listens to event when player build black tower
// sends request to backend to build that fortification
g.autoload.buildBlackTower = (inject) => {
  const walkie = inject.walkie;
  const auth = inject.auth;

  (function init() {
    onFortificationBuildButtonClick();
  })();

  function onFortificationBuildButtonClick() {
    walkie.onEvent(
      'fortificationBuildButtonClickEvent_',
      'buildBlackTower.js',
      (data) => {
        const fortificationName = data.fortificationName;

        if (fortificationName === 'blackTower') {
          blackTowerBuildPost(data);
        }
      },
      false
    );
  }

  function blackTowerBuildPost(data) {
    $.post('/ajax/buildBlackTower' + auth.uri, data, () => {
      console.log(
        'sendFortificationBuildPost: POST -> /ajax/buildBlackTower',
        data
      );
    }).done(() => {
      console.log('Build success');
    });
  }
};
