// @format

'use strict';

// Listens to event when player build maze
// sends request to backend to build that fortification
g.autoload.buildMaze = (inject) => {
  const walkie = inject.walkie;
  const auth = inject.auth;

  (function init() {
    onFortificationBuildButtonClick();
  })();

  function onFortificationBuildButtonClick() {
    walkie.onEvent(
      'fortificationBuildButtonClickEvent_',
      'buildMaze.js',
      (data) => {
        const fortificationName = data.fortificationName;

        if (fortificationName === 'maze') {
          mazeBuildPost(data);
        }
      },
      false
    );
  }

  function mazeBuildPost(data) {
    $.post('/ajax/buildMaze' + auth.uri, data, () => {
      console.log('sendFortificationBuildPost: POST -> /ajax/buildMaze', data);
    }).done(() => {
      console.log('Build success');
    });
  }
};
