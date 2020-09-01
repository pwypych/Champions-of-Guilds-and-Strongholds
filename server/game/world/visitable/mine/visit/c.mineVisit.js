// @format

'use strict';

// Listens to when hero visits a visitable of type mine
// sends request to backend for owner and enchantment registration
g.world.mineVisit = (walkie, freshEntities, auth) => {
  (function init() {
    onHeroCurrentVisited();
  })();

  function onHeroCurrentVisited() {
    walkie.onEvent(
      'heroCurrentVisited_',
      'mineVisit.js',
      (data) => {
        const entityId = data.entityId;
        const visitableType = data.visitableType;

        if (visitableType === 'mine') {
          mineStoneVisitPost(entityId);
        }
      },
      false
    );
  }

  // Optional: Show modal with OK

  function mineStoneVisitPost(entityId) {
    const data = { entityId: entityId };
    $.post('/ajax/mineVisit' + auth.uri, data, () => {
      console.log('mineVisit: POST -> /ajax/mineVisit', data);
    });
  }
};
