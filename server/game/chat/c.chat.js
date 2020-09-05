// @format

'use strict';

g.autoload.chat = (inject) => {
  const $body = inject.$body;
  const walkie = inject.walkie;

  const $chat = $body.find('.js-chat');

  (function init() {
    onChatMessage();
  })();

  function onChatMessage() {
    walkie.onEvent(
      'chatMessage_',
      'chat.js',
      (data) => {
        if (!data.message) {
          return;
        }

        displayMessage(data.message);
      },
      false
    );
  }

  function displayMessage(message) {
    const $p = $('<p>' + message + '</p>');
    $chat.append($p);

    fadeAfterTimeout($p);
  }

  function fadeAfterTimeout($p) {
    setTimeout(() => {
      $p.fadeOut(2000, () => {
        $p.remove();
      });
    }, 3000);
  }
};
