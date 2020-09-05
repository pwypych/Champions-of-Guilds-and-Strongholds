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

    g.setup.setupImages(g.spriteFilenameArray, () => {
      setupLibraries($body, viewport);
    });
  }

  function setupLibraries($body, viewport) {
    const auth = g.setup.setupAuth();
    const walkie = g.setup.setupWalkie();
    const blueprint = g.blueprint;
    const freshEntities = g.common.freshEntities(walkie);

    const inject = {
      $body: $body,
      viewport: viewport,
      auth: auth,
      walkie: walkie,
      blueprint: blueprint,
      freshEntities: freshEntities
    };

    g.autoload.stateChange(inject);
    g.autoload.entitiesInterval(inject);

    g.autoload.launchToggle(inject);
    g.autoload.launchInputName(inject);
    g.autoload.launchSelectRace(inject);
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
    g.world.fortificationModal($body, walkie, freshEntities, blueprint, auth);
    g.world.chat($body, walkie);
    g.world.endTurnButton($body, auth, walkie, freshEntities);
    g.world.endTurnCountdown(walkie, freshEntities);
    g.world.heroNearBattleAnimation(walkie, viewport, freshEntities);
    g.world.heroDeadToggle($body, walkie, freshEntities);
    g.world.heroVisit(walkie, freshEntities);
    g.world.mineVisit(walkie, freshEntities, auth);
    g.world.colorFlagDraw(walkie, viewport, freshEntities);

    g.battle.battleInterfaceToggle($body, walkie);
    g.battle.waitMock($body, auth, freshEntities);
    g.battle.battleToggle(walkie, viewport, freshEntities);
    g.battle.battleCleanup(walkie, viewport, freshEntities);
    g.battle.backgroundDraw(walkie, viewport, freshEntities);
    g.battle.unitsDraw(walkie, viewport, freshEntities);
    g.autoload.amountDraw(inject);
    g.autoload.battleClick(inject);

    g.autoload.iconMovementDraw(inject);
    g.autoload.walkIconShow(inject);
    g.autoload.walkEmptyBlockClick(inject);
    g.autoload.iconFlyDraw(inject);
    g.autoload.flyIconShow(inject);
    g.autoload.flyEmptyBlockClick(inject);
    g.autoload.unitInactiveClick(inject);

    g.autoload.iconMelee(inject);
    g.autoload.meleeClick(inject);
    g.autoload.unitJustDiedHide(inject);
    g.autoload.unitJustDiedAnimation(inject);
    g.autoload.unitGotHitAnimation(inject);
    g.autoload.unitGotHitObsticleBonus(inject);
    g.autoload.unitGotShotAnimation(inject);
    g.autoload.unitGotShotObsticleBonus(inject);
    g.autoload.unitDamageGradeBonus(inject);
    g.autoload.markerActiveDraw(inject);
    g.autoload.markerActiveEnemyDraw(inject);
    g.autoload.unitFocusActive(inject);
    g.autoload.unitFocusTween(inject);
    g.autoload.iconShoot(inject);
    g.autoload.shootClick(inject);
    g.autoload.unitRetreatIndicator(inject);

    g.autoload.summaryToggle(inject);
    g.autoload.summaryConfirm(inject);

    g.autoload.playerChangeButtons(inject);
    g.autoload.testFeatureLink(inject);
  }
};
