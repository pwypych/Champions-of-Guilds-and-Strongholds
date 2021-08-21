// @format

'use strict';

// Listens to event when player build black castle
// sends request to backend to build that fortification
g.autoload.buildBlackCastle = (inject) => {
  const walkie = inject.walkie;
  const auth = inject.auth;

  (function init() {
    onFortificationBuildButtonClick();
  })();

  function onFortificationBuildButtonClick() {
    walkie.onEvent(
      'fortificationBuildButtonClickEvent_',
      'buildBlackCastle.js',
      (data) => {
        const fortificationName = data.fortificationName;

        if (fortificationName === 'blackCastle') {
          blackCastleBuildPost(data);
        }
      },
      false
    );
  }

  function blackCastleBuildPost(data) {
    $.post('/ajax/buildBlackCastle' + auth.uri, data, () => {
      console.log(
        'sendFortificationBuildPost: POST -> /ajax/buildBlackCastle',
        data
      );
    }).done(() => {
      console.log('Build success');
    });
  }
};
