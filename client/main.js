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

  g.world.worldToggle($body, walkie);
  g.world.pixiInit($body, auth);
};
