// @format

'use strict';

// What does this module do?
// Defines cheat menu test link, that can be used to test different POST requests to endpoints from here
g.autoload.testFeatureLink = (inject) => {
  const $body = inject.$body;
  const auth = inject.auth;

  const $cheat = $body.find('[data-cheat]');
  const $testLink = $cheat.find('[cheat-test]');

  (function init() {
    onClick();
  })();

  function onClick() {
    $testLink.on('click', (event) => {
      event.preventDefault();

      sendPost();
    });
  }

  function sendPost() {
    const data = {};
    console.log('testFeatureLink: sendPost: Trying to post!');
    $.post('/ajax/maneuverShoot' + auth.uri, data, () => {
      console.log('testFeatureLink: POST -> /ajax/maneuverShoot', data);
    });
  }
};
