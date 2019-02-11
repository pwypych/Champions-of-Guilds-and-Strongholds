// @format

'use strict';

g.cheat.playerChangeButtons = ($body, auth) => {
  const $cheat = $body.find('.js-cheat');

  (function init() {
    console.log('init');
    getCheatEntities();
  })();

  function getCheatEntities() {
    $.get('/ajax/cheat/entities/cheatEntitiesGet' + auth.uri, (entities) => {
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

    console.log('generateLinks', links);
    renderLinks(links);
  }

  function renderLinks(links) {
    $cheat.html('');

    let i = 0;
    _.forEach(links, (link) => {
      i += 1;
      const $a = $('<a href="' + link.url + '">Player ' + i + '</a>');
      $a.css('margin-right', '10px');
      if (link.playerCurrent) {
        $a.css('color', '#ffd700');
      }

      $cheat.append($a);
    });
  }
};
