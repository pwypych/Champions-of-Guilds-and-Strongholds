// @format

'use strict';

g.main = function main() {
  // authentication
  const auth = {};
  auth.gameInstanceId = $.url('?gameInstanceId');
  auth.playerToken = $.url('?playerToken');

  // html elements
  const html = {};
  html.pixi = $('#pixi');

  g.launch.launch();

  // g.module.pixiTest();
};
