// @format

'use strict';

g.battle.battleRender = (walkie, auth, viewport, freshEntities) => {
  const blockWidthPx = 32;
  const blockHeightPx = 32;

  const textStyle = new PIXI.TextStyle({
    fontFamily: 'Courier New',
    fontSize: 12,
    fontWeight: 'bolder',
    fill: 'white',
    strokeThickness: 2
  });

  const battleContainer = viewport.getChildByName('battleContainer');
  const worldContainer = viewport.getChildByName('worldContainer');

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

        showBattleContainer();
      },
      false
    );
  }

  function showBattleContainer() {
    battleContainer.visible = true;
    worldContainer.visible = false;

    findBattleEntity();
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

    preventMemoryLeak();
  }

  function preventMemoryLeak() {
    // viewport.removeChildren();
    // graphicsManager.destroyAll();

    drawBackground();
  }

  function drawBackground() {
    const name = 'battle_background';
    let background;

    if (battleContainer.getChildByName(name)) {
      background = battleContainer.getChildByName(name);
    }

    if (!battleContainer.getChildByName(name)) {
      // console.log('drawBackground', name);
      background = new PIXI.Graphics();
      background.name = name;
      const color = 0xc7c7c7;
      background.beginFill(color);
      const x = 0;
      const y = 0;
      const width = viewport.worldWidth;
      const height = viewport.worldHeight;
      background.drawRect(x, y, width, height);
      battleContainer.addChildZ(background, 1);
    }

    drawGrid();
  }

  function drawGrid() {
    const width = viewport.worldWidth / blockWidthPx;
    const height = viewport.worldHeight / blockHeightPx;

    _.times(width, (index) => {
      if (index === 0) {
        return;
      }

      const name = 'battle_grid_line_horizontal_' + index;
      let line;

      if (battleContainer.getChildByName(name)) {
        line = battleContainer.getChildByName(name);
      }

      if (!battleContainer.getChildByName(name)) {
        // console.log('drawGrid:horizontal_line', name);
        line = new PIXI.Graphics();
        line.name = name;
        line.lineStyle(1, 0x777777, 0.5);
        const fromX = index * blockWidthPx;
        const fromY = 0;
        const toX = index * blockWidthPx;
        const toY = viewport.worldHeight;
        line.moveTo(fromX, fromY).lineTo(toX, toY);
        battleContainer.addChildZ(line, 2);
      }
    });

    _.times(height, (index) => {
      if (index === 0) {
        return;
      }

      const name = 'battle_grid_line_vertical_' + index;
      let line;

      if (battleContainer.getChildByName(name)) {
        line = battleContainer.getChildByName(name);
      }

      if (!battleContainer.getChildByName(name)) {
        // console.log('drawGrid:vertical_line', name);
        line = new PIXI.Graphics();
        line.name = name;
        line.lineStyle(1, 0x777777, 0.5);
        const fromX = 0;
        const fromY = index * blockHeightPx;
        const toX = viewport.worldWidth;
        const toY = index * blockHeightPx;
        line.moveTo(fromX, fromY).lineTo(toX, toY);
        battleContainer.addChildZ(line, 2);
      }
    });

    forEachFigure();
  }

  function forEachFigure() {
    _.forEach(freshEntities(), (entity, id) => {
      if (entity.unitName && entity.position) {
        drawUnits(entity, id);
      }
    });

    triggerRenderDone();
  }

  function drawUnits(entity, id) {
    // const name = id;
    // let unitSprite;

    // if (battleContainer.getChildByName(name)) {
    //   unitSprite = battleContainer.getChildByName(name);
    // }

    // if (!battleContainer.getChildByName(name)) {
    //   console.log('drawUnit', name);
    //   const texture = PIXI.loader.resources[entity.unitName].texture;
    //   unitSprite = new PIXI.Sprite(texture);
    //   unitSprite.name = name;
    //   battleContainer.addChild(unitSprite);
    // }

    // unitSprite.anchor = { x: 0, y: 1 };
    // unitSprite.x = entity.position.x * blockWidthPx;
    // unitSprite.y = entity.position.y * blockHeightPx + blockHeightPx;

    // if (entity.spriteOffset) {
    //   unitSprite.x += entity.spriteOffset.x;
    //   unitSprite.y += entity.spriteOffset.y;
    // }

    // if (entity.active) {
    // toolActiveUnitMarker(id, unitSprite.x, unitSprite.y);
    // }

    drawAmount(entity, id);
  }

  function drawAmount(entity, unitId) {
    const name = 'amount_' + unitId;
    let textAmount;

    if (battleContainer.getChildByName(name)) {
      textAmount = battleContainer.getChildByName(name);
    }

    if (!battleContainer.getChildByName(name)) {
      // console.log('drawAmount', name);
      textAmount = new PIXI.Text(entity.amount, textStyle);
      textAmount.name = name;
      battleContainer.addChildZ(textAmount, 1000);
    }

    const paddingRight = 2;
    const paddingTop = 3;
    textAmount.x =
      entity.position.x * blockWidthPx +
      blockWidthPx -
      textAmount.width +
      paddingRight;
    textAmount.y =
      entity.position.y * blockHeightPx +
      blockHeightPx -
      textAmount.height +
      paddingTop;
  }

  function toolActiveUnitMarker(unitId, x, y) {
    const name = 'active_unit_marker_' + unitId;
    let marker;

    if (battleContainer.getChildByName(name)) {
      marker = battleContainer.getChildByName(name);
    }

    if (!battleContainer.getChildByName(name)) {
      console.log('drawActiveUnitMarker', name);
      const textureName = 'activeUnitMarker';
      const texture = PIXI.loader.resources[textureName].texture;
      marker = new PIXI.Sprite(texture);
      marker.name = name;
      battleContainer.addChild(marker);
    }

    const offsetY = 2;
    marker.x = x;
    marker.y = y - blockHeightPx + offsetY;
  }

  function triggerRenderDone() {
    walkie.triggerEvent('renderDone_', 'render.js', {}, false);
  }
};
