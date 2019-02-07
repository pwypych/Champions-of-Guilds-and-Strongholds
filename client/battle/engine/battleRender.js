// @format

'use strict';

g.battle.battleRender = (
  walkie,
  auth,
  viewport,
  freshEntities,
  spriteBucket
) => {
  const blockWidthPx = 32;
  const blockHeightPx = 32;

  (function init() {
    onEntitiesGet();
  })();

  function onEntitiesGet() {
    walkie.onEvent(
      'entitiesGet_',
      'battleRender.js',
      () => {
        const gameEntity = freshEntities()[freshEntities()._id];

        if (gameEntity.state !== 'battleState') {
          return;
        }

        findBattleEntity();
      },
      false
    );
  }

  function findBattleEntity() {
    let battleEntity;
    _.forEach(freshEntities(), (entity) => {
      if (entity.battleStatus === 'active') {
        battleEntity = entity;
      }
    });

    if (!battleEntity) {
      return;
    }

    setViewportDimentions(battleEntity);
  }
  function setViewportDimentions(battleEntity) {
    viewport.worldWidth = battleEntity.battleWidth * blockWidthPx;
    viewport.worldHeight = battleEntity.battleHeight * blockHeightPx;

    removeViewportChildren();
  }

  function removeViewportChildren() {
    // to prevent memory leak
    viewport.removeChildren();

    cleanSpriteBucket();
  }

  function cleanSpriteBucket() {
    // to prevent memory leak
    Object.keys(spriteBucket).forEach((key) => {
      delete spriteBucket[key];
    });

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

    drawGrid();
  }

  function drawGrid() {
    const width = viewport.worldWidth / blockWidthPx;
    const height = viewport.worldHeight / blockHeightPx;

    _.times(width, (index) => {
      if (index === 0) {
        return;
      }

      const fromX = index * blockWidthPx;
      const fromY = 0;
      const toX = index * blockWidthPx;
      const toY = viewport.worldHeight;

      const line = new PIXI.Graphics();
      line.lineStyle(1, 0x777777, 0.5);
      line.moveTo(fromX, fromY).lineTo(toX, toY);
      viewport.addChild(line);
    });

    _.times(height, (index) => {
      if (index === 0) {
        return;
      }

      const fromX = 0;
      const fromY = index * blockHeightPx;
      const toX = viewport.worldWidth;
      const toY = index * blockHeightPx;

      const line = new PIXI.Graphics();
      line.lineStyle(1, 0x777777, 0.5);
      line.moveTo(fromX, fromY).lineTo(toX, toY);
      viewport.addChild(line);
    });

    forEachFigure();
  }

  function forEachFigure() {
    _.forEach(freshEntities(), (entity, id) => {
      if (entity.unitName && entity.position) {
        instantiateSprites(entity, id);
      }
    });

    triggerRenderDone();
  }

  function instantiateSprites(entity, id) {
    const texture = PIXI.loader.resources[entity.unitName].texture;
    const sprite = new PIXI.Sprite(texture);
    // const container = new PIXI.Container();

    sprite.anchor = { x: 0, y: 1 };

    sprite.x = entity.position.x * blockWidthPx;
    sprite.y = entity.position.y * blockHeightPx + blockHeightPx;

    if (entity.spriteOffset) {
      sprite.x += entity.spriteOffset.x;
      sprite.y += entity.spriteOffset.y;
    }

    if (entity.active) {
      const activeUnitMarker = toolActiveUnitMarker(sprite.x, sprite.y);
      viewport.addChild(activeUnitMarker);
      spriteBucket[id + '_activeUnitMarker'] = activeUnitMarker;
    }

    viewport.addChild(sprite);
    spriteBucket[id] = sprite;

    renderAmount(entity, id);
  }

  function renderAmount(entity, id) {
    const style = new PIXI.TextStyle({
      fontFamily: 'Courier New',
      fontSize: 12,
      fontWeight: 'bolder',
      fill: 'white',
      strokeThickness: 2
    });

    const text = new PIXI.Text(entity.amount, style);
    const paddingRight = 2;
    const paddingTop = 3;
    text.x =
      entity.position.x * blockWidthPx +
      blockWidthPx -
      text.width +
      paddingRight;
    text.y =
      entity.position.y * blockHeightPx +
      blockHeightPx -
      text.height +
      paddingTop;

    viewport.addChild(text);
    spriteBucket[id + '_amountText'] = text;
  }

  function toolActiveUnitMarker(x, y) {
    const activeUnitMarker = new PIXI.Graphics();
    const color = 0x60b450;
    const alpha = 0.5;
    activeUnitMarker.beginFill(color, alpha);
    const width = 32;
    const height = 32;
    activeUnitMarker.drawRect(x, y - 32, width, height); // - 32 because of sprite anchor
    return activeUnitMarker;
  }

  function triggerRenderDone() {
    walkie.triggerEvent('renderDone_', 'render.js', {}, false);
  }
};
