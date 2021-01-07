// @format

'use strict';

// What does this module do?
// Generates link for inspector button
g.autoload.inspectorButton = (inject) => {
  const $body = inject.$body;
  const auth = inject.auth;

  const $link = $body.find('[data-inspector]');

  (function init() {
    $link.attr('href', '/inspector' + auth.uri);
  })();
};
