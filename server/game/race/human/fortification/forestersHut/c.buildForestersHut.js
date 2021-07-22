// @format

'use strict';

// Listens to event when player build foresters hut
// sends request to backend to build that fortification
g.autoload.buildForestersHut = (inject) => {
  const walkie = inject.walkie;
  const auth = inject.auth;

  (function init() {
    onFortificationBuildButtonClick();
  })();

  function onFortificationBuildButtonClick() {
    walkie.onEvent(
      'fortificationBuildButtonClickEvent_',
      'buildForestersHut.js',
      (data) => {
        const fortificationName = data.fortificationName;

        if (fortificationName === 'forestersHut') {
          forestersHutBuildPost(data);
        }
      },
      false
    );
  }

  function forestersHutBuildPost(data) {
    $.post('/ajax/buildForestersHut' + auth.uri, data, () => {
      console.log(
        'sendFortificationBuildPost: POST -> /ajax/buildForestersHut',
        data
      );
    }).done(() => {
      console.log('Build success');
    });
  }
};
