// @format

'use strict';

g.autoload.battleCleanup = (inject) => {
  const viewport = inject.viewport;
  const walkie = inject.walkie;
  const freshEntities = inject.freshEntities;

  const battleContainer = viewport.getChildByName('battleContainer');

  (function init() {
    onEntitiesGet();
  })();

  function onEntitiesGet() {
    walkie.onEvent(
      'entitiesGet_',
      'battleCleanup.js',
      () => {
        const gameEntity = freshEntities()[freshEntities()._id];

        if (gameEntity.state !== 'battleState') {
          destroySpritesInBattleContainer();
        }
      },
      false
    );
  }

  function destroySpritesInBattleContainer() {
    // @bug, cannot use forEach, looks like children are destroyed on next processor tick
    while (battleContainer.children[0]) {
      const child = battleContainer.children[0];
      child.destroy({ children: true });
      battleContainer.removeChild(child);
    }
  }
};
