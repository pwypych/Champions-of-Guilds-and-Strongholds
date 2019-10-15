// @format

'use strict';

const debug = require('debug')('cogs:blueprintGet');

module.exports = (
  unitBlueprint,
  figureBlueprint,
  raceBlueprint,
  buildingBlueprint
) => {
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
      blueprint.buildingBlueprint = buildingBlueprint();

      sendBlueprintObject(blueprint);
    }

    function sendBlueprintObject(blueprint) {
      debug('sendBlueprintObject');
      res.send(blueprint);
      debug('******************** ajax ********************');
    }
  };
};
