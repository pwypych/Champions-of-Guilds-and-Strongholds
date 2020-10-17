// @format

'use strict';

// What does this module do?
// Sets up auth.uri that will be used for identifiation with server for player
g.setup.setupAuth = () => {
  const auth = {};
  auth.gameId = $.url('?gameId');
  auth.playerToken = $.url('?playerToken');
  auth.uri = '?gameId=' + auth.gameId + '&playerToken=' + auth.playerToken;

  return auth;
};
