// @format

'use strict';

// Listens to event when player build Human Town Hall
// sends request to backend to build that fortification
g.autoload.buildHumanTownHall = (inject) => {
  const walkie = inject.walkie;
  const auth = inject.auth;

  (function init() {
    onFortificationBuildButtonClick();
  })();

  function onFortificationBuildButtonClick() {
    walkie.onEvent(
      'fortificationBuildButtonClickEvent_',
      'buildHumanTownHall.js',
      (data) => {
        const fortificationName = data.fortificationName;

        if (fortificationName === 'humanTownHall') {
          humanTownHallBuildPost(data);
        }
      },
      false
    );
  }

  function humanTownHallBuildPost(data) {
    $.post('/ajax/humanTownHallBuild' + auth.uri, data, () => {
      console.log(
        'sendFortificationBuildPost: POST -> /ajax/humanTownHallBuild',
        data
      );
    });
  }
};
