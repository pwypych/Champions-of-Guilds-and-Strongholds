// @format

'use strict';

g.battle.markerActiveAnimate = (walkie, viewport, freshEntities) => {
  const battleContainer = viewport.getChildByName('battleContainer');

  (function init() {
    onEntitiesGet();
  })();

  function onEntitiesGet() {
    walkie.onEvent(
      'entitiesGet_',
      'markerDraw.js',
      () => {
        const gameEntity = freshEntities()[freshEntities()._id];

        if (gameEntity.state !== 'battleState') {
          return;
        }

        findActiveUnit();
      },
      false
    );
  }

  function findActiveUnit() {
    _.forEach(freshEntities(), (entity, id) => {
      if (entity.unitStats && entity.active) {
        const unit = entity;
        const unitId = id;
        turnBlinkOn(unit, unitId);
      }
    });
  }

  function turnBlinkOn(unit, unitId) {
    const unitContainer = battleContainer.getChildByName(unitId);
    const marker = unitContainer.getChildByName('marker');

    if (marker.timeline) {
      return;
    }

    const timeline = new TimelineMax();
    timeline.to(marker, 0.2, {
      alpha: 0
    });
    timeline.to(marker, 0.2, {
      alpha: 1
    });

    timeline.addCallback(() => {
      timeline.kill();
      delete marker.timeline;
    });

    marker.timeline = timeline;
  }
};
