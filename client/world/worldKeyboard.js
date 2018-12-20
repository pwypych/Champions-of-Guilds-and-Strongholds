// @format

'use strict';

g.world.worldKeyboard = (walkie, auth, freshEntities) => {
  (function init() {
    addListener();
  })();

  function addListener() {
    $(document).keydown((event) => {
      const gameEntity = freshEntities()[freshEntities()._id];
      if (gameEntity.state !== 'worldState') {
        return;
      }

      findPlayerId(event);
    });

    function findPlayerId(event) {
      const entities = freshEntities();

      let playerId;
      _.forEach(entities, (entity, id) => {
        if (entity.playerCurrent) {
          playerId = id;
        }
      });

      findHeroPosition(event, playerId);
    }

    function findHeroPosition(event, playerId) {
      const entities = freshEntities();

      let hero;
      let heroId;
      _.forEach(entities, (entity, id) => {
        if (entity.figure === 'heroHuman' && entity.owner === playerId) {
          hero = entity;
          heroId = id;
        }
      });

      scanKeys(event, hero, heroId);
    }

    function scanKeys(event, hero, heroId) {
      const journey = [];
      const keyboardMap = { LEFT: 37, RIGHT: 39, UP: 38, DOWN: 40, SPACE: 32 };

      const heroX = hero.position.x;
      const heroY = hero.position.y;

      if (event.which === keyboardMap.LEFT) {
        journey.push({
          fromX: heroX,
          fromY: heroY,
          toX: heroX - 1,
          toY: heroY
        });
      }

      if (event.which === keyboardMap.RIGHT) {
        journey.push({
          fromX: heroX,
          fromY: heroY,
          toX: heroX + 1,
          toY: heroY
        });
      }

      if (event.which === keyboardMap.UP) {
        journey.push({
          fromX: heroX,
          fromY: heroY,
          toX: heroX,
          toY: heroY - 1
        });
      }

      if (event.which === keyboardMap.DOWN) {
        journey.push({
          fromX: heroX,
          fromY: heroY,
          toX: heroX,
          toY: heroY + 1
        });
      }

      if (event.which === keyboardMap.SPACE) {
        postHeroJourneyCancel(journey);
        return;
      }

      if (!_.isEmpty(journey)) {
        postHeroJourney(journey, heroId);
      }
    }

    function postHeroJourney(journey, heroId) {
      const data = { heroJourney: journey, heroId: heroId };
      console.log('journey', journey);
      $.post(
        '/ajax/worldState/hero/heroJourneyPost' + auth.uri,
        data,
        () => {}
      );
    }

    function postHeroJourneyCancel() {
      const data = { heroJourneyCancel: 'true' };
      $.post(
        '/ajax/worldState/hero/heroJourneyCancelPost' + auth.uri,
        data,
        () => {}
      );
    }
  }
};
