// @format

'use strict';

// What does this module do?
// When not in worldState it cleans every world PIXI container
g.autoload.worldCleanup = (inject) => {
  const viewport = inject.viewport;
  const walkie = inject.walkie;
  const freshEntities = inject.freshEntities;

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
