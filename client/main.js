// @format

'use strict';

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
    // g.setup.setupTween(app);

    const auth = g.setup.setupAuth();

    g.setup.setupImages(auth, () => {
      setupLibraries($body, app, viewport, auth);
    });
  }

  function setupLibraries($body, app, viewport, auth) {
    const walkie = g.setup.setupWalkie();

    g.common.stateChange(walkie, auth);
    g.common.entitiesInterval(walkie, auth);

    const freshEntities = g.common.freshEntities(walkie);

    g.launch.launchToggle($body, walkie);
    g.launch.launchInputName($body, auth);
    g.launch.launchButtonReady($body, auth);
    g.launch.launchTable($body, walkie);
    g.launch.launchCountdown($body, walkie);
    g.launch.launchDisableUi($body, walkie);

    g.common.canvasWrapperToggle($body, walkie);
    g.common.keyboardLoadSavedGame(walkie, auth);

    g.common.recentActivityDifferance(walkie, freshEntities);
    g.common.tweenMovementPath(walkie, viewport);

    g.world.worldInterfaceToggle($body, walkie);
    g.world.worldToggle(walkie, viewport, freshEntities);
    g.world.drawBackground(walkie, viewport, freshEntities);
    g.world.drawFigures(walkie, auth, viewport, freshEntities);
    g.world.worldClick(walkie, auth, viewport, freshEntities);
    g.world.heroPath(walkie, auth, viewport, freshEntities);
    g.world.heroPathAcceptedPost(walkie, auth);
    g.world.hasBeenCollectedHide(walkie, viewport);
    g.world.hasBeenCollectedIndicate(walkie, viewport);
    g.world.informationButton($body);
    g.world.informationModal($body, walkie, freshEntities);
    g.world.recruitUnit($body, auth);
    g.world.chat($body, walkie);
    g.world.endTurnButton($body, auth, walkie, freshEntities);
    g.world.endTurnCountdown(walkie, freshEntities);

    g.battle.battleInterfaceToggle($body, walkie);
    g.battle.waitMock($body, auth, freshEntities);
    g.battle.battleToggle(walkie, viewport, freshEntities);
    g.battle.drawBackground(walkie, viewport, freshEntities);
    g.battle.drawUnits(walkie, auth, viewport, freshEntities);
    g.battle.emptyBlockClick(walkie, auth, viewport, freshEntities);
    g.battle.battleClick(walkie, viewport, freshEntities);
    g.battle.unitPath(walkie, auth, viewport, freshEntities);
    g.battle.unitPathAcceptedPost(walkie, auth);
    g.battle.iconMelee(walkie, viewport, freshEntities);
    g.battle.keyboardMelee(walkie, auth, freshEntities);
    g.battle.unitJustDiedHide(walkie, viewport);

    g.summary.summaryToggle($body, walkie, auth, freshEntities);
    g.summary.summaryConfirm($body, auth);

    g.cheat.playerChangeButtons($body, auth);
    g.cheat.testFeatureLink($body, auth);
  }
};
