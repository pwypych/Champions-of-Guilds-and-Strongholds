// @format

'use strict';

// Listens to event when player build mound
// sends request to backend to build that fortification
g.autoload.buildMound = (inject) => {
  const walkie = inject.walkie;
  const auth = inject.auth;

  (function init() {
    onFortificationBuildButtonClick();
  })();

  function onFortificationBuildButtonClick() {
    walkie.onEvent(
      'fortificationBuildButtonClickEvent_',
      'buildMound.js',
      (data) => {
        const fortificationName = data.fortificationName;

        if (fortificationName === 'mound') {
          moundBuildPost(data);
        }
      },
      false
    );
  }

  function moundBuildPost(data) {
    $.post('/ajax/buildMound' + auth.uri, data, () => {
      console.log('sendFortificationBuildPost: POST -> /ajax/buildMound', data);
    }).done(() => {
      console.log('Build success');
    });
  }
};
