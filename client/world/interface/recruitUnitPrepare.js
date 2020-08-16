// @format

'use strict';

g.world.recruitUnitPrepare = (
  $body,
  walkie,
  freshEntities,
  auth,
  blueprint
) => {
  const $recruitUnit = $body.find(
    '.js-world-interface-information-modal .js-recruit-unit'
  );

  (function init() {
    onEntitiesGetFirst();
  })();

  function onEntitiesGetFirst() {
    walkie.onEvent(
      'entitiesGetFirst_',
      'recruitUnitPrepare.js',
      () => {
        const gameEntity = freshEntities()[freshEntities()._id];

        if (gameEntity.state !== 'worldState') {
          return;
        }
        findPlayerId();
      },
      false
    );
  }

  function findPlayerId() {
    _.forEach(freshEntities(), (entity, id) => {
      if (entity.playerCurrent) {
        const playerId = id;
        findHero(playerId);
      }
    });
  }

  function findHero(playerId) {
    _.forEach(freshEntities(), (entity) => {
      if (entity.owner === playerId && entity.heroStats) {
        const hero = entity;
        updateTable(hero);
      }
    });
  }

  function updateTable(hero) {
    const unitAmounts = hero.unitAmounts;
    $recruitUnit.empty();

    _.forEach(unitAmounts, (amount, unitName) => {
      const $unit = $(
        '<img class="vertical-align" src="/sprite/' +
          unitName +
          '.png" width="36" height="36">'
      );
      const $amountSpan = $(
        '<span class="js-unit-amount margin-right" data-unit-name="' +
          unitName +
          '" class="big">0</span>'
      );
      const $buyButton = $(
        '<button class="js-button-buy" data-unit-name="' +
          unitName +
          '">' +
          blueprint.unit[unitName].recruitCost +
          '<img class="vertical-align" src="/sprite/gold.png" width="24" height="24"></button>'
      );
      const $seperator10 = $('<div class="seperator-10"></div>');

      $recruitUnit.append($unit);
      $recruitUnit.append($amountSpan);
      $recruitUnit.append($buyButton);
      $recruitUnit.append($seperator10);

      onRecruitUnitButtonClick($buyButton);
    });
  }

  function onRecruitUnitButtonClick($buyButton) {
    $buyButton.on('click', () => {
      const unitName = $buyButton.attr('data-unit-name');
      console.log('recruitUnitClick:unitName:', unitName);
      sendRecruitUnitPost(unitName);
    });
  }

  function sendRecruitUnitPost(unitName) {
    const data = { unitName: unitName };
    $.post('/ajax/worldRecruitUnit' + auth.uri, data, () => {
      console.log(
        'sendRecruitUnitPost: POST -> /ajax/worldRecruitUnit',
        data
      );
    });
  }
};
