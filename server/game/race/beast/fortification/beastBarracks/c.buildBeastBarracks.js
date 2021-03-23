// @format

'use strict';

// Listens to event when player build Beast Townhall
// sends request to backend for creating a new enchantment and entity for it
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
          console.log('fortification beeing build:', fortificationName);
          buildBeastTownhallFortification(data);
        }
      },
      false
    );
  }

  function buildBeastTownhallFortification(data) {
    $.post('/ajax/beastBarracksBuild' + auth.uri, data, () => {
      console.log(
        'sendFortificationBuildPost: POST -> /ajax/beastBarracksBuild',
        data
      );
    });
  }
};
