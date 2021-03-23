// @format

'use strict';

// Listens to event when player build Beast Barracks
// sends request to backend to build that fortification
g.autoload.buildBeastBarracks = (inject) => {
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

        if (fortificationName === 'beastBarracks') {
          console.log('fortification send to build:', fortificationName);
          buildBeastBarracksFortification(data);
        }
      },
      false
    );
  }

  function buildBeastBarracksFortification(data) {
    $.post('/ajax/beastBarracksBuild' + auth.uri, data, () => {
      console.log(
        'sendFortificationBuildPost: POST -> /ajax/beastBarracksBuild',
        data
      );
    });
  }
};
