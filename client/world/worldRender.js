// @format

'use strict';

g.world.worldRender = (walkie, auth, viewport) => {
  let stateData;

  const blockWidthPx = 32;
  const blockHeightPx = 32;

  (function init() {
    onStateChange();
  })();

  function onStateChange() {
    walkie.onEvent('stateChange_', 'worldToggle.js', (state) => {
      if (state === 'worldState') {
        ajaxReadMapLayer();
      }
    });
  }

  function ajaxReadMapLayer() {
    $.get('/ajax/stateDataGet' + auth.uri, (data) => {
      console.log('GET api/stateDataGet', data);
      stateData = data;
      setViewportDimentions();
    });
  }

  function setViewportDimentions() {
    viewport.worldWidth = stateData.mapLayer[0].length * blockWidthPx;
    viewport.worldHeight = stateData.mapLayer.length * blockHeightPx;
    loadImages();
  }

  function loadImages() {
    // find all figure names
    const figureNameArray = [];
    stateData.mapLayer.forEach((row) => {
      row.forEach((figure) => {
        figureNameArray.push(figure.name);
      });
    });

    // only unique names
    const figureNameUniqueArray = _.uniq(figureNameArray);

    console.log('figureNameUniqueArray', figureNameUniqueArray);

    figureNameUniqueArray.forEach((figureName) => {
      PIXI.loader.add(figureName, `/image/figure/${figureName}.png`);
    });

    // @todo, use special module to load all images
    PIXI.loader.add('human', '/sprite/hero/human.png');

    // start loading images
    PIXI.loader.load(() => {
      drawBackground();
    });
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
    stateData.mapLayer.forEach((row, y) => {
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
    walkie.triggerEvent('worldRenderDone_', 'worldRender.js', stateData);
  }
};
