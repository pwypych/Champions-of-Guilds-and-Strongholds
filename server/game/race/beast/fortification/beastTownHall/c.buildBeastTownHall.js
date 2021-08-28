// @format

'use strict';

// Listens to event when player build Beast Town Hall
// sends request to backend to build that fortification
g.autoload.buildBeastTownHall = (inject) => {
  const walkie = inject.walkie;
  const auth = inject.auth;

  (function init() {
    onFortificationBuildButtonClick();
  })();

  function onFortificationBuildButtonClick() {
    walkie.onEvent(
      'fortificationBuildButtonClickEvent_',
      'buildBeastTownHall.js',
      (data) => {
        const fortificationName = data.fortificationName;

        if (fortificationName === 'beastTownHall') {
          beastTownHallBuildPost(data);
        }
      },
      false
    );
  }

  function beastTownHallBuildPost(data) {
    $.post('/ajax/beastTownHallBuild' + auth.uri, data, () => {
      console.log(
        'sendFortificationBuildPost: POST -> /ajax/beastTownHallBuild',
        data
      );
    });
  }
};
