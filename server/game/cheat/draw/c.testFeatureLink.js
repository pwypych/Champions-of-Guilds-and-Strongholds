// @format

'use strict';

g.autoload.testFeatureLink = (inject) => {
  const $body = inject.$body;
  const auth = inject.auth;

  const $cheat = $body.find('.js-cheat');
  const $testLink = $cheat.find('.js-cheat-test');

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
      console.log('waitMock: POST -> /ajax/maneuverShoot', data);
    });
  }
};
