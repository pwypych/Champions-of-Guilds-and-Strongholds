// @format

'use strict';

g.main = function main() {
  // authentication
  const auth = {};
  auth.gameId = $.url('?gameId');
  auth.playerToken = $.url('?playerToken');
  auth.uri = '?gameId=' + auth.gameId + '&playerToken=' + auth.playerToken;

  // html elements
  const $body = $('body');

  // libraries
  const walkie = g.tool.walkie();

  g.engine.stateChange(walkie, auth);
  g.engine.stateInterval(walkie, auth);

  g.launch.launchToggle(walkie);
  g.launch.launchInputName(auth);
  g.launch.launchTable($body, walkie);

  // g.game.pixiTest();
};
