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
    const blueprint = g.blueprint;

    g.common.stateChange(walkie, auth);
    g.common.entitiesInterval(walkie, auth);

    const freshEntities = g.common.freshEntities(walkie);

    g.launch.launchToggle($body, walkie);
    g.launch.launchInputName($body, auth);
    g.launch.launchSelectRace($body, auth);
    g.launch.launchButtonReady($body, auth);
    g.launch.launchTable($body, walkie, freshEntities);
    g.launch.launchSelectRaceOptions($body, walkie, freshEntities, blueprint);
    g.launch.launchCountdown($body, walkie);
    g.launch.launchDisableUi($body, walkie);

    g.common.canvasWrapperToggle($body, walkie);
    g.common.keyboardLoadSavedGame(walkie, auth);

    g.common.recentActivityDifferance(walkie, freshEntities);
    g.common.tweenMovementPath(walkie, viewport);
    g.common.viewportClamp(walkie, viewport);

    g.world.worldInterfaceToggle($body, walkie);
    g.world.worldToggle(walkie, viewport, freshEntities);
    g.world.worldCleanup(walkie, viewport, freshEntities);
    g.world.recruitUnitPrepare($body, walkie, freshEntities, auth, blueprint);
    g.world.heroFocusWorldReady(walkie, viewport, freshEntities);
    g.world.heroFocusTween(walkie, viewport, freshEntities);
    g.world.backgroundDraw(walkie, viewport, auth);
    g.world.figuresDraw(walkie, auth, viewport, freshEntities);
    g.world.figuresReplaceDead(walkie, viewport, freshEntities);
    g.world.worldClick(walkie, auth, viewport, freshEntities);
    g.world.heroPath(walkie, auth, viewport, freshEntities);
    g.world.heroPathAcceptedPost(walkie, auth);
    g.world.hasBeenCollectedIndicate(walkie, viewport);
    g.world.informationButton($body);
    g.world.informationModal($body, walkie, freshEntities);
    g.world.castleButton($body);
    g.world.castleModal($body, walkie, freshEntities, blueprint, auth);
    g.world.chat($body, walkie);
    g.world.endTurnButton($body, auth, walkie, freshEntities);
    g.world.endTurnCountdown(walkie, freshEntities);
    g.world.heroNearBattleAnimation(walkie, viewport, freshEntities);
    g.world.heroDeadToggle($body, walkie, freshEntities);

    g.battle.battleInterfaceToggle($body, walkie);
    g.battle.waitMock($body, auth, freshEntities);
    g.battle.battleToggle(walkie, viewport, freshEntities);
    g.battle.battleCleanup(walkie, viewport, freshEntities);
    g.battle.backgroundDraw(walkie, viewport, freshEntities);
    g.battle.unitsDraw(walkie, viewport, freshEntities);
    g.battle.amountDraw(walkie, viewport, freshEntities);
    g.battle.battleClick(walkie, viewport, freshEntities);

    g.battle.iconMovementDraw(walkie, viewport, freshEntities);
    g.battle.walkIconShow(walkie, viewport, freshEntities);
    g.battle.walkEmptyBlockClick(walkie, auth, viewport, freshEntities);
    g.battle.iconFlyDraw(walkie, viewport, freshEntities);
    g.battle.flyIconShow(walkie, viewport, freshEntities);
    g.battle.flyEmptyBlockClick(walkie, auth, viewport, freshEntities);
    g.battle.unitInactiveClick(walkie, auth, freshEntities);

    g.battle.iconMelee(walkie, viewport, freshEntities);
    g.battle.meleeClick(walkie, auth, viewport, freshEntities);
    g.battle.unitJustDiedHide(walkie, viewport);
    g.battle.unitJustDiedAnimation(walkie, viewport);
    g.battle.unitGotHitAnimation(walkie, viewport);
    g.battle.unitGotHitObsticleBonus(walkie, viewport);
    g.battle.unitGotShotAnimation(walkie, viewport);
    g.battle.unitGotShotObsticleBonus(walkie, viewport);
    g.battle.unitDamageGradeBonus(walkie, viewport);
    g.battle.markerActiveDraw(walkie, viewport, freshEntities);
    g.battle.markerActiveEnemyDraw(walkie, viewport, freshEntities);
    g.battle.unitFocusActive(walkie, viewport, freshEntities);
    g.battle.unitFocusTween(walkie, viewport, freshEntities);
    g.battle.iconShoot(walkie, viewport, freshEntities);
    g.battle.shootClick(walkie, auth, viewport, freshEntities);
    g.battle.unitRetreatIndicator(walkie, viewport, freshEntities);

    g.summary.summaryToggle($body, walkie, freshEntities);
    g.summary.summaryConfirm($body, auth);

    g.cheat.playerChangeButtons($body, auth);
    g.cheat.testFeatureLink($body, auth);
  }
};
