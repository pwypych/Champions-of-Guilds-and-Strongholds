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
      setupBlueprints($body, app, viewport, auth);
    });
  }

  function setupBlueprints($body, app, viewport, auth) {
    $.get('/ajax/blueprint/blueprintGet' + auth.uri, (blueprints) => {
      console.log('setupBlueprints: Got blueprints!');
      setupLibraries($body, app, viewport, auth, blueprints);
    });
  }

  function setupLibraries($body, app, viewport, auth, blueprints) {
    const walkie = g.setup.setupWalkie();

    g.common.stateChange(walkie, auth);
    g.common.entitiesInterval(walkie, auth);

    const freshEntities = g.common.freshEntities(walkie);

    g.launch.launchToggle($body, walkie);
    g.launch.launchInputName($body, auth);
    g.launch.launchSelectRace($body, auth);
    g.launch.launchButtonReady($body, auth);
    g.launch.launchTable($body, walkie, freshEntities);
    g.launch.launchSelectRaceOptions($body, walkie, freshEntities, blueprints);
    g.launch.launchCountdown($body, walkie);
    g.launch.launchDisableUi($body, walkie);

    g.common.canvasWrapperToggle($body, walkie);
    g.common.keyboardLoadSavedGame(walkie, auth);

    g.common.recentActivityDifferance(walkie, freshEntities);
    g.common.tweenMovementPath(walkie, viewport);
    g.common.viewportClamp(walkie, viewport);

    g.world.worldInterfaceToggle($body, walkie);
    g.world.worldToggle(walkie, viewport, freshEntities);
    g.world.recruitUnitPrepare($body, walkie, freshEntities, auth, blueprints);
    g.world.heroFocusWorldReady(walkie, viewport, freshEntities);
    g.world.heroFocusTween(walkie, viewport, freshEntities);
    g.world.backgroundDraw(walkie, viewport, auth);
    g.world.figuresDraw(walkie, auth, viewport, freshEntities);
    g.world.worldClick(walkie, auth, viewport, freshEntities);
    g.world.heroPath(walkie, auth, viewport, freshEntities);
    g.world.heroPathAcceptedPost(walkie, auth);
    g.world.hasBeenCollectedHide(walkie, viewport);
    g.world.hasBeenCollectedIndicate(walkie, viewport);
    g.world.informationButton($body);
    g.world.informationModal($body, walkie, freshEntities);
    g.world.chat($body, walkie);
    g.world.endTurnButton($body, auth, walkie, freshEntities);
    g.world.endTurnCountdown(walkie, freshEntities);

    g.battle.battleInterfaceToggle($body, walkie);
    g.battle.waitMock($body, auth, freshEntities);
    g.battle.battleToggle(walkie, viewport, freshEntities);
    g.battle.backgroundDraw(walkie, viewport, freshEntities);
    g.battle.unitsDraw(walkie, auth, viewport, freshEntities);
    g.battle.battleClick(walkie, viewport, freshEntities);

    g.battle.iconMovement(walkie, viewport, freshEntities);
    g.battle.emptyBlockClick(walkie, auth, viewport, freshEntities);

    g.battle.iconMelee(walkie, viewport, freshEntities);
    g.battle.meleeClick(walkie, auth, viewport, freshEntities);
    g.battle.unitJustDiedHide(walkie, viewport);
    g.battle.unitJustDiedAnimation(walkie, viewport);
    g.battle.unitDecrementAmount(walkie, viewport);
    g.battle.unitGotHitAnimation(walkie, viewport);
    g.battle.unitGotHitObsticleBonus(walkie, viewport);
    g.battle.unitGotShotAnimation(walkie, viewport);
    g.battle.unitGotShotObsticleBonus(walkie, viewport);
    g.battle.markerDraw(walkie, viewport, freshEntities);
    g.battle.markerActiveAnimate(walkie, viewport, freshEntities);
    g.battle.unitFocusActive(walkie, viewport, freshEntities);
    g.battle.unitFocusTween(walkie, viewport, freshEntities);
    g.battle.iconShoot(walkie, viewport, freshEntities);
    g.battle.shootClick(walkie, auth, viewport, freshEntities);

    g.summary.summaryToggle($body, walkie, viewport, auth, freshEntities);
    g.summary.summaryConfirm($body, auth);

    g.cheat.playerChangeButtons($body, auth);
    g.cheat.testFeatureLink($body, auth);
  }
};
