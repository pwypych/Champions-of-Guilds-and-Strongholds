// @format

'use strict';

g.main = function main() {
  // html body
  const $body = $('body');

  // libraries
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

  const app = g.world.initPixi($body);
  const viewport = g.world.initViewport(app);

  g.world.worldToggle($body, walkie);
  g.world.worldRender(walkie, auth, viewport);
  g.world.worldKeyboard(walkie, auth);
};
