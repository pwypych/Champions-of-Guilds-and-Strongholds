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
    g.engine.stateInterval(walkie, auth);

    const stateData = g.engine.freshStateData(walkie);

    g.launch.launchToggle($body, walkie);
    g.launch.launchInputName($body, auth);
    g.launch.launchButtonReady($body, auth);
    g.launch.launchTable($body, walkie);
    g.launch.launchCountdown($body, walkie);
    g.launch.launchDisableUi($body, walkie);

    g.world.worldToggle($body, walkie);
    g.world.worldRender(walkie, auth, viewport);
    g.world.worldHero(walkie, auth, viewport);
    g.world.worldKeyboard(walkie, auth);
    g.world.worldSingleClick(walkie, auth, viewport, stateData);
    g.world.worldPath(walkie, auth, viewport);
    g.world.worldJourney(walkie, auth);
  }
};
