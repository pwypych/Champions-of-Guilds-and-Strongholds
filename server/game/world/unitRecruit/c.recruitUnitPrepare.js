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

  const $wrapper = $body.find(
    '[data-world-interface-units-modal] [data-recruit-unit]'
  );

  (function init() {
    console.log('recruitUnitPrepare');
    onViewportWorldReady();
  })();

  function onViewportWorldReady() {
    walkie.onEvent(
      'viewportWorldReadyEvent_',
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
        fillUnitsModal(hero);
      }
    });
  }

  function fillUnitsModal(hero) {
    const unitAmounts = hero.unitAmounts;
    const unitBlueprint = blueprint.unit;

    const $unitExample = $wrapper.find('[data-example-unit]');
    const $resourceExample = $wrapper.find('[data-example-resource]');

    $wrapper.empty();

    _.forEach(unitAmounts, (amount, unitName) => {
      const unitCost = unitBlueprint[unitName].cost;
      const $unit = $unitExample.clone();
      $($unit).removeAttr('data-example-unit');

      $unit.find('[data-name]').text(unitName);
      $($unit).removeAttr('data-name');

      $unit.find('[data-unit-amount]').text(amount);
      $unit.find('span').attr('data-unit-name', unitName);

      const unitSpriteSrc = '/sprite/' + unitName + '.png';
      $unit.find('[data-unit-sprite]').attr('src', unitSpriteSrc);

      _.forEach(unitCost, (cost, resource) => {
        const $resource = $resourceExample.clone();
        $($resource).attr('data-resource', resource);
        const resourceSpriteSrc = '/sprite/' + resource + '.png';

        $resource.find('span').text(cost);
        $resource.find('img').attr('src', resourceSpriteSrc);

        $resource.insertBefore($unit.find('button'));
        $($resource).removeAttr('data-example-resource');
      });

      const $button = $($unit).find('[data-button]');
      $button.attr('data-unit-name', unitName);
      $($button).removeAttr('data-button');

      $wrapper.append($unit);
      onRecruitUnitButtonClick($button, unitName);
    });

    $wrapper.find('[data-example-fortification]').hide();
    $wrapper.find('[data-example-resource]').hide();
  }

  function onRecruitUnitButtonClick($button, unitName) {
    $button.on('click', () => {
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
