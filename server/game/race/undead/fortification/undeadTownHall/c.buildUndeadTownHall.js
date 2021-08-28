// @format

'use strict';

// Listens to event when player build Undead Town Hall
// sends request to backend to build that fortification
g.autoload.buildUndeadTownHall = (inject) => {
  const walkie = inject.walkie;
  const auth = inject.auth;

  (function init() {
    onFortificationBuildButtonClick();
  })();

  function onFortificationBuildButtonClick() {
    walkie.onEvent(
      'fortificationBuildButtonClickEvent_',
      'buildUndeadTownHall.js',
      (data) => {
        const fortificationName = data.fortificationName;

        if (fortificationName === 'undeadTownHall') {
          undeadTownHallBuildPost(data);
        }
      },
      false
    );
  }

  function undeadTownHallBuildPost(data) {
    $.post('/ajax/undeadTownHallBuild' + auth.uri, data, () => {
      console.log(
        'sendFortificationBuildPost: POST -> /ajax/undeadTownHallBuild',
        data
      );
    });
  }
};
