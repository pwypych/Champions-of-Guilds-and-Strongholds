// @format

'use strict';

// Listens to event when player build Beast Townhall
// sends request to backend to build that fortification
g.autoload.buildBeastTownhall = (inject) => {
  const walkie = inject.walkie;
  const auth = inject.auth;

  (function init() {
    onFortificationBuildButtonClick();
  })();

  function onFortificationBuildButtonClick() {
    walkie.onEvent(
      'fortificationBuildButtonClickEvent_',
      'buildBeastTownhall.js',
      (data) => {
        const fortificationName = data.fortificationName;

        if (fortificationName === 'beastTownhall') {
          console.log('fortification send to build:', fortificationName);
          buildBeastTownhallFortification(data);
        }
      },
      false
    );
  }

  function buildBeastTownhallFortification(data) {
    $.post('/ajax/beastTownhallBuild' + auth.uri, data, () => {
      console.log(
        'sendFortificationBuildPost: POST -> /ajax/beastTownhallBuild',
        data
      );
    });
  }
};
