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

    g.autoload.launchButtonReady(inject);
    g.autoload.launchTable(inject);
    g.autoload.launchSelectRaceOptions(inject);
    g.autoload.launchCountdown(inject);
    g.autoload.launchDisableUi(inject);

    g.autoload.canvasWrapperToggle(inject);
    g.autoload.keyboardLoadSavedGame(inject);

    g.autoload.recentActivityDifferance(inject);
    g.autoload.tweenMovementPath(inject);
    g.autoload.viewportClamp(inject);

    g.autoload.worldInterfaceToggle(inject);
    g.autoload.worldToggle(inject);
    g.autoload.worldCleanup(inject);
    g.autoload.recruitUnitPrepare(inject);
    g.autoload.heroFocusWorldReady(inject);
    g.autoload.heroFocusTween(inject);
    g.autoload.worldBackgroundDraw(inject);
    g.autoload.figuresDraw(inject);
    g.autoload.figuresReplaceDead(inject);
    g.autoload.worldClick(inject);
    g.autoload.heroPath(inject);
    g.autoload.heroPathAcceptedPost(inject);
    g.autoload.hasBeenCollectedIndicate(inject);
    g.autoload.informationButton(inject);
    g.autoload.informationModal(inject);
    g.autoload.castleButton(inject);
    g.autoload.fortificationModal(inject);
    g.autoload.chat(inject);
    g.autoload.endTurnButton(inject);
    g.autoload.endTurnCountdown(inject);
    g.autoload.heroNearBattleAnimation(inject);
    g.autoload.heroDeadToggle(inject);
    g.autoload.heroVisit(inject);
    g.autoload.mineVisit(inject);
    g.autoload.colorFlagDraw(inject);

    g.autoload.battleInterfaceToggle(inject);
    g.autoload.waitMock(inject);
    g.autoload.battleToggle(inject);
    g.autoload.battleCleanup(inject);
    g.autoload.battleBackgroundDraw(inject);
    g.autoload.unitsDraw(inject);
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
