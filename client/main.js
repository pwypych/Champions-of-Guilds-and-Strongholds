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

    g.world.initImages(() => {
      setupLibraries($body, app, viewport);
    });
  }

  function setupLibraries($body, app, viewport) {
    const walkie = g.tool.walkie();
    const auth = g.tool.auth();

    g.engine.stateChange(walkie, auth);
    g.engine.stateInterval(walkie, auth);

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
  }
};
