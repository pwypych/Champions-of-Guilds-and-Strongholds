// @format

'use strict';

// Listens to event when player build meadow
// sends request to backend to build that fortification
g.autoload.buildMeadow = (inject) => {
  const walkie = inject.walkie;
  const auth = inject.auth;

  (function init() {
    onFortificationBuildButtonClick();
  })();

  function onFortificationBuildButtonClick() {
    walkie.onEvent(
      'fortificationBuildButtonClickEvent_',
      'buildMeadow.js',
      (data) => {
        const fortificationName = data.fortificationName;

        if (fortificationName === 'meadow') {
          meadowBuildPost(data);
        }
      },
      false
    );
  }

  function meadowBuildPost(data) {
    $.post('/ajax/buildMeadow' + auth.uri, data, () => {
      console.log(
        'sendFortificationBuildPost: POST -> /ajax/buildMeadow',
        data
      );
    }).done(() => {
      console.log('Build success');
    });
  }
};
