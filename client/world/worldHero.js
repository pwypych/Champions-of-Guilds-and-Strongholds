// @format

'use strict';

g.world.worldHero = (walkie, auth, viewport) => {
  let stateData;
  let sprite;

  const lastPosition = [];

  const blockWidthPx = 32;
  const blockHeightPx = 32;

  (function init() {
    onStateChange();
    onHeroMoveTo();
  })();

  function onStateChange() {
    walkie.onEvent(
      'worldRenderDone_',
      'worldHero.js',
      (data) => {
        stateData = data;
        findHero();
      },
      false
    );
  }

  function findHero() {
    $('body').css('cursor', 'default');

    // const hero = stateData.playerArray[stateData.playerIndex].hero;
    stateData.playerArray.forEach((player, playerIndex) => {
      instantiateHeroSprite(player.hero.x, player.hero.y, playerIndex);
    });
  }

  function instantiateHeroSprite(x, y, playerIndex) {
    const figureName = 'heroHuman';
    const texture = PIXI.loader.resources[figureName].texture;
    sprite = new PIXI.Sprite(texture);

    sprite.anchor = { x: 0, y: 1 };

    sprite.x = x * blockWidthPx;
    sprite.y = y * blockHeightPx + blockHeightPx;

    const heroSpriteOffsetX = -9;
    sprite.x += heroSpriteOffsetX;

    viewport.addChild(sprite);

    checkPositionChange(x, y, playerIndex);
  }

  function checkPositionChange(x, y, playerIndex) {
    if (typeof lastPosition[playerIndex] === 'undefined') {
      lastPosition[playerIndex] = { x: x, y: y };
    }

    const lastKnownX = lastPosition[playerIndex].x;
    const lastKnownY = lastPosition[playerIndex].y;

    if (lastKnownX !== x || lastKnownY !== y) {
      tweenHeroToNewPosition(x, y, lastKnownX, lastKnownY, playerIndex);
    }
  }

  function tweenHeroToNewPosition(
    moveToX,
    moveToY,
    lastKnownX,
    lastKnownY,
    playerIndex
  ) {
    const heroSpriteOffsetX = -9;

    const tweenX = moveToX * blockWidthPx + heroSpriteOffsetX;
    const tweenY = moveToY * blockHeightPx + blockHeightPx;
    const heroX = lastKnownX * blockWidthPx + heroSpriteOffsetX;
    const heroY = lastKnownY * blockHeightPx + blockHeightPx;

    lastPosition[playerIndex].x = moveToX;
    lastPosition[playerIndex].y = moveToY;

    console.log(
      'end slide on:',
      tweenX,
      tweenY,
      'hero currently on:',
      heroX,
      heroY
    );

    const path = new PIXI.tween.TweenPath();
    path.moveTo(heroX, heroY).lineTo(tweenX, tweenY);

    const gPath = new PIXI.Graphics();
    gPath.lineStyle(1, 0xffffff, 1);
    gPath.drawPath(path);
    viewport.addChild(gPath);

    const tween = PIXI.tweenManager.createTween(sprite);
    tween.path = path;
    tween.time = 16000;
    tween.loop = false;
    tween.start();
  }

  function onHeroMoveTo() {
    walkie.onEvent('heroMoveTo_', 'worldHero.js', () => {
      $('body').css('cursor', 'wait');
    });
  }
};
