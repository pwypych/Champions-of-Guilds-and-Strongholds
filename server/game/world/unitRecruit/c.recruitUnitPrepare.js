// @format

'use strict';

// What does this module do?
// It prepares unit recruit table on info modal and fills it with player units possible to buy and buy buttons
g.autoload.recruitUnitPrepare = (inject) => {
  const $body = inject.$body;
  const walkie = inject.walkie;
  const freshEntities = inject.freshEntities;
  const auth = inject.auth;
  const blueprint = inject.blueprint;

  const $recruitUnit = $body.find(
    '[data-world-interface-information-modal] [data-recruit-unit]'
  );

  (function init() {
    onViewportWorldReady();
  })();

  function onViewportWorldReady() {
    walkie.onEvent(
      'viewportWorldReady_',
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
        '<span class="margin-right" data-unit-name="' +
          unitName +
          '" data-unit-amount class="big">0</span>'
      );
      const $buyButton = $(
        '<button data-unit-name="' +
          unitName +
          '">' +
          blueprint.unit[unitName].cost.gold +
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
      console.log('sendRecruitUnitPost: POST -> /ajax/worldRecruitUnit', data);
    });
  }
};
