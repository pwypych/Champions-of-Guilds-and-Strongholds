// @format

'use strict';

g.world.worldCleanup = (walkie, viewport, freshEntities) => {
  const worldContainer = viewport.getChildByName('worldContainer');

  (function init() {
    onEntitiesGet();
  })();

  function onEntitiesGet() {
    walkie.onEvent(
      'entitiesGet_',
      'worldCleanup.js',
      () => {
        const gameEntity = freshEntities()[freshEntities()._id];

        if (gameEntity.state !== 'worldState') {
          destroySpritesInWorldContainer();
        }
      },
      false
    );
  }

  function destroySpritesInWorldContainer() {
    // @bug, cannot use forEach, looks like children are destroyed on next processor tick
    while (worldContainer.children[0]) {
      const child = worldContainer.children[0];
      child.destroy({ children: true });
      worldContainer.removeChild(child);
    }
  }
};
