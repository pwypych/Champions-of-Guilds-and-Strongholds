// @format

'use strict';

g.main = function main() {
  (function init() {
    setupBody();
  })();

  function setupBody() {
    const $body = $('body');

    setupPixi($body);
  }

  function setupPixi($body) {
    const app = g.world.initPixi($body);
    const viewport = g.world.initViewport(app);
    g.world.initTween(app);

    const auth = g.tool.auth();

    g.world.initImages(auth, () => {
      setupLibraries($body, app, viewport, auth);
    });
  }

  function setupLibraries($body, app, viewport, auth) {
    const walkie = g.tool.walkie();

    g.engine.stateChange(walkie, auth);
    g.engine.entitiesInterval(walkie, auth);

    const freshEntities = g.engine.freshEntities(walkie);
    const spriteBucket = g.engine.spriteBucket();

    g.launch.launchToggle($body, walkie);
    g.launch.launchInputName($body, auth);
    g.launch.launchButtonReady($body, auth);
    g.launch.launchTable($body, walkie);
    g.launch.launchCountdown($body, walkie);
    g.launch.launchDisableUi($body, walkie);

    g.world.worldToggle($body, walkie);
    g.world.worldRender(walkie, auth, viewport, freshEntities, spriteBucket);
    g.world.entityChanges(walkie, freshEntities);
    // g.world.worldHero(walkie, auth, viewport, freshEntities);
    g.world.worldKeyboard(walkie, auth, freshEntities);
    g.world.worldSingleClick(walkie, auth, viewport, freshEntities);
    // g.world.worldPath(walkie, auth, viewport);
    // g.world.worldJourney(walkie, auth);
  }
};
