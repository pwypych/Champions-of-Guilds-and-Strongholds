// @format

'use strict';

// Listens to event when player build brotherhood
// sends request to backend to build that fortification
g.autoload.buildBrotherhood = (inject) => {
  const walkie = inject.walkie;
  const auth = inject.auth;

  (function init() {
    onFortificationBuildButtonClick();
  })();

  function onFortificationBuildButtonClick() {
    walkie.onEvent(
      'fortificationBuildButtonClickEvent_',
      'buildBrotherhood.js',
      (data) => {
        const fortificationName = data.fortificationName;

        if (fortificationName === 'brotherhood') {
          brotherhoodBuildPost(data);
        }
      },
      false
    );
  }

  function brotherhoodBuildPost(data) {
    $.post('/ajax/buildBrotherhood' + auth.uri, data, () => {
      console.log(
        'sendFortificationBuildPost: POST -> /ajax/buildBrotherhood',
        data
      );
    }).done(() => {
      console.log('Build success');
    });
  }
};
