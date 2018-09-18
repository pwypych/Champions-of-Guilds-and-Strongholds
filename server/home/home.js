// @format

'use strict';

module.exports = () => {
  return (request, responce) => {
    (function init() {
      sendResponce();
    })();

    function sendResponce() {
      responce.send('Pierwszy hello');
    }
  };
};
