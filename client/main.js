// @format

'use strict';

/* start.js */
g.main = function main() {
  // authentication
  const auth = {};
  auth.gameInstanceId = $.url('?gameInstanceId');
  auth.playerToken = $.url('?playerToken');

  // html elements
  const html = {};
  html.pixi = $('#pixi');

  g.launch.launch();

  // copy walkie module from old phaser project
  // add pixi module that initializes pixi canvas so it is ready when state changes to display world map etc.
  // add UI modules that display and work on various html input elements without pixi

  // add library that checks data from /ajax/readGameStateData every 0,5s
  // that library annonces the state through walkie
  // a module that should handle setup state displays relevant html and fills it with data from walkie

  // g.module.pixiTest();
};
/* /start.js */
