// @format

'use strict';

const debug = require('debug')('cogs:blueprintGet');

module.exports = (unitBlueprint, figureBlueprint, raceBlueprint) => {
  return (req, res) => {
    (function init() {
      debug('// Send blueprints');

      generateBlueprintObject();
    })();

    function generateBlueprintObject() {
      const blueprint = {};

      blueprint.unitBlueprint = unitBlueprint();
      blueprint.figureBlueprint = figureBlueprint();
      blueprint.raceBlueprint = raceBlueprint();

      sendBlueprintObject(blueprint);
    }

    function sendBlueprintObject(blueprint) {
      debug('sendBlueprintObject: blueprint:', blueprint);
      res.send(blueprint);
      debug('******************** ajax ********************');
    }
  };
};
