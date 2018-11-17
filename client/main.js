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

  g.launch.launch(auth);

  // g.module.pixiTest();
};
