// @format

'use strict';

module.exports = (environment, templateToHtml) => {
  return (request, responce) => {
    const viewModel = {};

    (function init() {
      sendResponce();
    })();

    function sendResponce() {
      templateToHtml('server/home/home.ejs', viewModel, (error, html) => {
        console.log('sendResponce()', html);
        responce.send(html);
      });
    }
  };
};
