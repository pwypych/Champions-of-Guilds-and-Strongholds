// @format

'use strict';

// What does this module do?
// Uses cheated entities endpoint to get player tokens and adds change player links to cheat menu
g.autoload.playerChangeButtons = (inject) => {
  const $body = inject.$body;
  const auth = inject.auth;

  const $cheat = $body.find('[data-cheat]');

  (function init() {
    console.log('init');
    getCheatEntities();
  })();

  function getCheatEntities() {
    $.post('/ajax/cheatEntitiesGet' + auth.uri, (entities) => {
      generateLinks(entities);
    });
  }

  function generateLinks(entities) {
    const links = [];
    _.forEach(entities, (entity) => {
      if (entity.playerToken && entity.playerData) {
        const link = {};
        link.url =
          '/game?gameId=' + entities._id + '&playerToken=' + entity.playerToken;

        if (entity.playerCurrent) {
          link.playerCurrent = true;
        }

        links.push(link);
      }
    });

    renderLinks(links);
  }

  function renderLinks(links) {
    // $cheat.html('');

    let i = 0;
    _.forEach(links, (link) => {
      i += 1;
      const $a = $('<a href="' + link.url + '">Player ' + i + '</a>');
      $a.css('margin-right', '10px');
      if (link.playerCurrent) {
        $a.addClass('text-blue-dark');
      }

      $cheat.append($a);
    });
  }
};
