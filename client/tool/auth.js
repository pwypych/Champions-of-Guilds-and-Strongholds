// @format

'use strict';

g.tool.auth = () => {
  const auth = {};
  auth.gameId = $.url('?gameId');
  auth.playerToken = $.url('?playerToken');
  auth.uri = '?gameId=' + auth.gameId + '&playerToken=' + auth.playerToken;

  return auth;
};
