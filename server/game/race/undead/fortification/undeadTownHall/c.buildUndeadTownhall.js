// @format

'use strict';

// Listens to event when player build Undead Townhall
// sends request to backend to build that fortification
g.autoload.buildUndeadTownhall = (inject) => {
  const walkie = inject.walkie;
  const auth = inject.auth;

  (function init() {
    onFortificationBuildButtonClick();
  })();

  function onFortificationBuildButtonClick() {
    walkie.onEvent(
      'fortificationBuildButtonClickEvent_',
      'buildUndeadTownhall.js',
      (data) => {
        const fortificationName = data.fortificationName;

        if (fortificationName === 'undeadTownHall') {
          undeadTownhallBuildPost(data);
        }
      },
      false
    );
  }

  function undeadTownhallBuildPost(data) {
    $.post('/ajax/undeadTownhallBuild' + auth.uri, data, () => {
      console.log(
        'sendFortificationBuildPost: POST -> /ajax/undeadTownhallBuild',
        data
      );
    });
  }
};
