// @format

'use strict';

// Listens to event when player build garden
// sends request to backend to build that fortification
g.autoload.buildGarden = (inject) => {
  const walkie = inject.walkie;
  const auth = inject.auth;

  (function init() {
    onFortificationBuildButtonClick();
  })();

  function onFortificationBuildButtonClick() {
    walkie.onEvent(
      'fortificationBuildButtonClickEvent_',
      'buildGarden.js',
      (data) => {
        const fortificationName = data.fortificationName;

        if (fortificationName === 'garden') {
          gardenBuildPost(data);
        }
      },
      false
    );
  }

  function gardenBuildPost(data) {
    $.post('/ajax/buildGarden' + auth.uri, data, () => {
      console.log(
        'sendFortificationBuildPost: POST -> /ajax/buildGarden',
        data
      );
    }).done(() => {
      console.log('Build success');
    });
  }
};
