// @format

'use strict';

g.common.pixiFactory = () => {
  let pixiObjectsArray = [];

  function destroyAll() {
    pixiObjectsArray.forEach((pixiObject, index) => {
      pixiObject.destroy();
      delete pixiObjectsArray[index];
    });

    pixiObjectsArray = [];
  }

  function newGraphics() {
    const graphics = new PIXI.Graphics();
    pixiObjectsArray.push(graphics);
    return graphics;
  }

  function newSprite(texture) {
    const sprite = new PIXI.Sprite(texture);
    pixiObjectsArray.push(sprite);
    return sprite;
  }

  function newText(string, textStyle) {
    const text = new PIXI.Text(string, textStyle);
    pixiObjectsArray.push(text);
    return text;
  }

  return {
    destroyAll: destroyAll,
    newGraphics: newGraphics,
    newSprite: newSprite,
    newText: newText
  };
};
