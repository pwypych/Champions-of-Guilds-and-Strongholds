// @format

'use strict';

// Listens to event when player build lake
// sends request to backend to build that fortification
g.autoload.buildLake = (inject) => {
  const walkie = inject.walkie;
  const auth = inject.auth;

  (function init() {
    onFortificationBuildButtonClick();
  })();

  function onFortificationBuildButtonClick() {
    walkie.onEvent(
      'fortificationBuildButtonClickEvent_',
      'buildLake.js',
      (data) => {
        const fortificationName = data.fortificationName;

        if (fortificationName === 'lake') {
          lakeBuildPost(data);
        }
      },
      false
    );
  }

  function lakeBuildPost(data) {
    $.post('/ajax/buildLake' + auth.uri, data, () => {
      console.log('sendFortificationBuildPost: POST -> /ajax/buildLake', data);
    }).done(() => {
      console.log('Build success');
    });
  }
};
