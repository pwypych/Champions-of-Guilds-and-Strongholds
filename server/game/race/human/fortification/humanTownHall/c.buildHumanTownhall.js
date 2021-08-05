// @format

'use strict';

// Listens to event when player build Human Townhall
// sends request to backend to build that fortification
g.autoload.buildHumanTownhall = (inject) => {
  const walkie = inject.walkie;
  const auth = inject.auth;

  (function init() {
    onFortificationBuildButtonClick();
  })();

  function onFortificationBuildButtonClick() {
    walkie.onEvent(
      'fortificationBuildButtonClickEvent_',
      'buildHumanTownhall.js',
      (data) => {
        const fortificationName = data.fortificationName;

        if (fortificationName === 'humanTownHall') {
          humanTownhallBuildPost(data);
        }
      },
      false
    );
  }

  function humanTownhallBuildPost(data) {
    $.post('/ajax/humanTownhallBuild' + auth.uri, data, () => {
      console.log(
        'sendFortificationBuildPost: POST -> /ajax/humanTownhallBuild',
        data
      );
    });
  }
};
