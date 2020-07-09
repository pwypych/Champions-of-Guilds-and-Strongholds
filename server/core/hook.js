// @format

'use strict';

const debug = require('debug')('cogs:hook');
const async = require('async');

const hooks = {};

// It allows other modules to register hook-functions that can be runned in other middleware modules as part of waterfall with ctx
// Important! A hook mutates passed ctx!
module.exports = () => {

  // functionToAttach should have two arguments, ctx and callback
  // libraries can be passed in ctx, code that runs hook chooses what libraries to pass on ctx
  const attach = (hookName, functionToAttach) => {
    if (!hooks[hookName]) {
      hooks[hookName] = [];
    }
    hooks[hookName].push(functionToAttach);
    debug('attach: Attached hooks for:', hookName);
  };

  // ctx is passed by reference and can be modified in functionToRun
  const run = (hookName, ctx, callback) => {
    async.eachSeries(
      hooks[hookName],
      (functionToRun, done) => {
        functionToRun(ctx, (error) => {
          done(error);
        });
      },
      (error) => {
        debug('run: Runned hooks for:', hookName);
        callback(error);
      }
    );
  };

  return { attach: attach, run: run };
};
