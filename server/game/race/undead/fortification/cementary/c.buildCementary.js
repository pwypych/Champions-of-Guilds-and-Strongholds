// @format

'use strict';

// Listens to event when player build cementary
// sends request to backend to build that fortification
g.autoload.buildCementary = (inject) => {
  const walkie = inject.walkie;
  const auth = inject.auth;

  (function init() {
    onFortificationBuildButtonClick();
  })();

  function onFortificationBuildButtonClick() {
    walkie.onEvent(
      'fortificationBuildButtonClickEvent_',
      'buildCementary.js',
      (data) => {
        const fortificationName = data.fortificationName;

        if (fortificationName === 'cementary') {
          cementaryBuildPost(data);
        }
      },
      false
    );
  }

  function cementaryBuildPost(data) {
    $.post('/ajax/buildCementary' + auth.uri, data, () => {
      console.log(
        'sendFortificationBuildPost: POST -> /ajax/buildCementary',
        data
      );
    }).done(() => {
      console.log('Build success');
    });
  }
};
