// @format

'use strict';

// Listens to event when player build lair
// sends request to backend to build that fortification
g.autoload.buildLair = (inject) => {
  const walkie = inject.walkie;
  const auth = inject.auth;

  (function init() {
    onFortificationBuildButtonClick();
  })();

  function onFortificationBuildButtonClick() {
    walkie.onEvent(
      'fortificationBuildButtonClickEvent_',
      'buildLair.js',
      (data) => {
        const fortificationName = data.fortificationName;

        if (fortificationName === 'lair') {
          lairBuildPost(data);
        }
      },
      false
    );
  }

  function lairBuildPost(data) {
    $.post('/ajax/buildLair' + auth.uri, data, () => {
      console.log('sendFortificationBuildPost: POST -> /ajax/buildLair', data);
    }).done(() => {
      console.log('Build success');
    });
  }
};
