// @format

'use strict';

g.battle.keyboardMelee = (walkie, auth, freshEntities) => {
  (function init() {
    addListener();
  })();

  function addListener() {
    $(document).keydown((event) => {
      const gameEntity = freshEntities()[freshEntities()._id];
      if (gameEntity.state !== 'battleState') {
        return;
      }

      const keyboardMap = { 37: 'left', 39: 'right', 38: 'up', 40: 'down' };
      const keyPressed = keyboardMap[event.which];

      if (!keyPressed) {
        return;
      }

      findPlayerId(keyPressed);
    });

    function findPlayerId(keyPressed) {
      const entities = freshEntities();

      let playerId;
      _.forEach(entities, (entity, id) => {
        if (entity.playerCurrent) {
          playerId = id;
        }
      });

      findUnitPosition(keyPressed, playerId);
    }

    function findUnitPosition(keyPressed, playerId) {
      const entities = freshEntities();

      let unit;
      let unitId;
      _.forEach(entities, (entity, id) => {
        if (
          entity.unitName &&
          entity.owner === playerId &&
          entity.position &&
          entity.active
        ) {
          unit = entity;
          unitId = id;
        }
      });

      if (!unit) {
        console.log('Error: Current player not controlling the active unit');
        return;
      }

      const unitPositon = {};
      unitPositon.x = parseInt(unit.position.x, 10);
      unitPositon.y = parseInt(unit.position.y, 10);

      scanKeys(keyPressed, unitPositon, unitId);
    }

    function scanKeys(keyPressed, unitPosition, unitId) {
      const meleeOnPosition = {};

      if (keyPressed === 'left') {
        meleeOnPosition.x = unitPosition.x - 1;
        meleeOnPosition.y = unitPosition.y;
      }

      if (keyPressed === 'right') {
        meleeOnPosition.x = unitPosition.x + 1;
        meleeOnPosition.y = unitPosition.y;
      }

      if (keyPressed === 'up') {
        meleeOnPosition.x = unitPosition.x;
        meleeOnPosition.y = unitPosition.y - 1;
      }

      if (keyPressed === 'down') {
        meleeOnPosition.x = unitPosition.x;
        meleeOnPosition.y = unitPosition.y + 1;
      }

      if (!_.isEmpty(meleeOnPosition)) {
        maneuverMeleePost(meleeOnPosition, unitId);
      }
    }

    function maneuverMeleePost(meleeOnPosition, unitId) {
      const data = { meleeOnPosition: meleeOnPosition, entityId: unitId };
      console.log('maneuverMeleePost: data:', data);
      $.post('/ajax/battle/melee/maneuverMeleePost' + auth.uri, data, () => {});
    }
  }
};
