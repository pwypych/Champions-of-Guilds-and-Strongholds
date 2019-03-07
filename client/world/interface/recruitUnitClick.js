// @format

'use strict';

g.world.recruitUnitClick = ($body, auth) => {
  const $recruitUnit = $body.find('.js-recruit-unit');

  (function init() {
    onRecruitUnitButtonClick();
  })();

  function onRecruitUnitButtonClick() {
    const $buttons = $recruitUnit.find('.js-button-buy');

    $buttons.on('click', (event) => {
      const unitName = $(event.target).attr('data-unit-name');
      console.log('recruitUnitClick:unitName:', unitName);
      sendRecruitUnitPost(unitName);
    });
  }

  function sendRecruitUnitPost(unitName) {
    const data = { unitName: unitName };

    $.post('/ajax/world/recruit/recruitUnitPost' + auth.uri, data, () => {
      console.log(
        'sendRecruitUnitPost: POST -> /ajax/world/recruit/recruitUnitPost',
        data
      );
    });
  }
};
