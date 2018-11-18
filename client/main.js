// @format

'use strict';

g.main = function main() {
  // authentication
  const auth = {};
  auth.gameId = $.url('?gameId');
  auth.playerToken = $.url('?playerToken');
  auth.uri = '?gameId=' + auth.gameId + '&playerToken=' + auth.playerToken;

  // html elements
  const html = {};
  html.pixi = $('#pixi');

  // libraries
  const walkie = g.tool.walkie();

  g.engine.stateChange(walkie, auth);

  g.engine.stateInterval(walkie, auth);

  // g.launch.launch(auth, walkie);

  // g.game.pixiTest();
};
