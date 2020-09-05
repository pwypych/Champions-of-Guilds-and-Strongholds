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
