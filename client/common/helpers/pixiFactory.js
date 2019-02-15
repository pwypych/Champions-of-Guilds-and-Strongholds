// @format

'use strict';

g.common.pixiFactory = () => {
  let graphicsArray = [];
  let spriteList = {};

  function destroyAll() {
    graphicsArray.forEach((pixiObject, index) => {
      pixiObject.destroy();
      delete graphicsArray[index];
    });

    graphicsArray = [];

    _.forEach(spriteList, (sprite, name) => {
      sprite.destroy();
      delete spriteList[name];
    });

    spriteList = {};
  }

  function newGraphics() {
    const graphics = new PIXI.Graphics();
    graphicsArray.push(graphics);
    return graphics;
  }

  function newText(string, textStyle) {
    const text = new PIXI.Text(string, textStyle);
    graphicsArray.push(text);
    return text;
  }

  function newSprite(name, texture) {
    const sprite = new PIXI.Sprite(texture);
    spriteList[name] = sprite;
    return sprite;
  }

  function getSpriteList() {
    return spriteList;
  }

  return {
    destroyAll: destroyAll,
    newGraphics: newGraphics,
    newText: newText,
    newSprite: newSprite,
    getSpriteList: getSpriteList
  };
};
