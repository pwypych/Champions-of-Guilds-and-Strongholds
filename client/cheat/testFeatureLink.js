// @format

'use strict';

g.cheat.testFeatureLink = ($body, auth) => {
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
