// @format

'use strict';

// Listens to event when player build arena
// sends request to backend to build that fortification
g.autoload.buildArena = (inject) => {
  const walkie = inject.walkie;
  const auth = inject.auth;

  (function init() {
    onFortificationBuildButtonClick();
  })();

  function onFortificationBuildButtonClick() {
    walkie.onEvent(
      'fortificationBuildButtonClickEvent_',
      'buildArena.js',
      (data) => {
        const fortificationName = data.fortificationName;

        if (fortificationName === 'arena') {
          arenaBuildPost(data);
        }
      },
      false
    );
  }

  function arenaBuildPost(data) {
    $.post('/ajax/buildArena' + auth.uri, data, () => {
      console.log('sendFortificationBuildPost: POST -> /ajax/buildArena', data);
    }).done(() => {
      console.log('Build success');
    });
  }
};
