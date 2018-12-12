// @format

'use strict';

g.world.worldRender = (walkie, auth, viewport, freshStateData) => {
  const blockWidthPx = 32;
  const blockHeightPx = 32;

  (function init() {
    onStateDataGet();
  })();

  function onStateDataGet() {
    walkie.onEvent(
      'stateDataGet_',
      'worldToggle.js',
      () => {
        if (freshStateData().state !== 'worldState') {
          return;
        }

        setViewportDimentions();
      },
      false
    );
  }

  function setViewportDimentions() {
    viewport.worldWidth = freshStateData().mapLayer[0].length * blockWidthPx;
    viewport.worldHeight = freshStateData().mapLayer.length * blockHeightPx;
    removeViewportChildren();
  }

  function removeViewportChildren() {
    viewport.removeChildren(); // to prevent memory leak

    drawBackground();
  }

  function drawBackground() {
    const background = new PIXI.Graphics();
    const color = 0xc7c7c7;
    background.beginFill(color);
    const x = 0;
    const y = 0;
    const width = viewport.worldWidth;
    const height = viewport.worldHeight;
    background.drawRect(x, y, width, height);

    viewport.addChild(background);

    forEachFigure();
  }

  function forEachFigure() {
    freshStateData().mapLayer.forEach((row, y) => {
      row.forEach((figure, x) => {
        instantiateSprites(figure, x, y);
      });
    });

    triggerWorldRenderDone();
  }

  function instantiateSprites(figure, x, y) {
    if (figure.name === 'empty') {
      return;
    }

    const texture = PIXI.loader.resources[figure.name].texture;
    const sprite = new PIXI.Sprite(texture);

    sprite.anchor = { x: 0, y: 1 };

    // sprite.width = blockWidthPx;
    // sprite.height = blockHeightPx;

    sprite.x = x * blockWidthPx;
    sprite.y = y * blockHeightPx + blockHeightPx;

    if (figure.spriteOffsetX) {
      sprite.x += figure.spriteOffsetX;
    }

    viewport.addChild(sprite);
  }

  function triggerWorldRenderDone() {
    walkie.triggerEvent('worldRenderDone_', 'worldRender.js', {}, false);
  }
};
