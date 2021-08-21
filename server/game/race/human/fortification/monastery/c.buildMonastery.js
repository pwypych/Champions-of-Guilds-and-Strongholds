// @format

'use strict';

// Listens to event when player build monastery
// sends request to backend to build that fortification
g.autoload.buildMonastery = (inject) => {
  const walkie = inject.walkie;
  const auth = inject.auth;

  (function init() {
    onFortificationBuildButtonClick();
  })();

  function onFortificationBuildButtonClick() {
    walkie.onEvent(
      'fortificationBuildButtonClickEvent_',
      'buildMonastery.js',
      (data) => {
        const fortificationName = data.fortificationName;

        if (fortificationName === 'monastery') {
          monasteryBuildPost(data);
        }
      },
      false
    );
  }

  function monasteryBuildPost(data) {
    $.post('/ajax/buildMonastery' + auth.uri, data, () => {
      console.log(
        'sendFortificationBuildPost: POST -> /ajax/buildMonastery',
        data
      );
    }).done(() => {
      console.log('Build success');
    });
  }
};
