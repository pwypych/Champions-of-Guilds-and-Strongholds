// @format

'use strict';

// Listens to when hero visits this type of visitable
// and sends request to backend for owner and enchantment registration
g.world.mineStoneVisit = (walkie, freshEntities, auth) => {
  (function init() {
    onHeroCurrentVisited();
  })();

  function onHeroCurrentVisited() {
    walkie.onEvent(
      'heroCurrentVisited_',
      'mineStoneVisit.js',
      (data) => {
        const entityId = data.entityId;
        const visitableName = data.visitableName;

        if (visitableName === 'mineStone') {
          mineStoneVisitPost(entityId);
        }
      },
      false
    );
  }

  // Optional: Show modal

  function mineStoneVisitPost(entityId) {
    const data = { entityId: entityId };
    $.post('/ajax/mineStoneVisit' + auth.uri, data, () => {
      console.log(
        'mineStoneVisit: POST -> /ajax/mineStoneVisit',
        data
      );
    });
  }
};
