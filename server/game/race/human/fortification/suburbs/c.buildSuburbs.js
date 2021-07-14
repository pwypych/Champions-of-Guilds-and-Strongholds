// @format

'use strict';

// Listens to event when player build suburbs
// sends request to backend to build that fortification
g.autoload.buildSuburbs = (inject) => {
  const walkie = inject.walkie;
  const auth = inject.auth;

  (function init() {
    onFortificationBuildButtonClick();
  })();

  function onFortificationBuildButtonClick() {
    walkie.onEvent(
      'fortificationBuildButtonClickEvent_',
      'buildSuburbs.js',
      (data) => {
        const fortificationName = data.fortificationName;

        if (fortificationName === 'suburbs') {
          suburbsBuildPost(data);
        }
      },
      false
    );
  }

  function suburbsBuildPost(data) {
    $.post('/ajax/buildSuburbs' + auth.uri, data, () => {
      console.log(
        'sendFortificationBuildPost: POST -> /ajax/buildSuburbs',
        data
      );
    }).done(() => {
      console.log('Build success');
    });
  }
};
