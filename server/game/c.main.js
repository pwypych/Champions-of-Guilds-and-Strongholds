// @format

'use strict';

// What does this module do?
//
g.main = function main() {
  (function init() {
    setupBody();
  })();

  function setupBody() {
    const $body = $('body');

    setupPixi($body);
  }

  function setupPixi($body) {
    const app = g.setup.setupPixi($body);
    const viewport = g.setup.setupViewport(app);

    g.setup.setupImages(g.setup.spriteFilenameArray, () => {
      setupLibraries($body, viewport);
    });
  }

  function setupLibraries($body, viewport) {
    const auth = g.setup.setupAuth();
    const walkie = g.setup.setupWalkie();
    const blueprint = g.setup.blueprint;
    const freshEntities = g.setup.freshEntities(walkie);

    const inject = {
      $body: $body,
      viewport: viewport,
      auth: auth,
      walkie: walkie,
      blueprint: blueprint,
      freshEntities: freshEntities
    };

    _.forEach(g.autoload, (module) => {
      module(inject);
    });
  }
};
