
    function checkEveryPlayerReady() {
      everyPlayerReadyChecker(game._id, (error, isEveryPlayerReady) => {
        if (error) {
          debug('checkEveryPlayerReady: error:', error);
          res.status(503);
          res.send(
            '503 Service Unavailable - Cannot check if every player ready:' +
              JSON.stringify(error)
          );
          return;
        }

        if (isEveryPlayerReady) {
          prepareGame();
          return;
        }

        sendResponce();
      });
    }

    function prepareGame() {
      prepareGameAfterLaunch(game, (error) => {
        if (error) {
          debug('prepareGame: error:', error);
          res.status(503);
          res.send(
            '503 Service Unavailable - Cannot prepare game before start:' +
              JSON.stringify(error)
          );
          return;
        }

        debug('prepareGame');
        setTimeout(() => {
          updateGameState();
        }, 5000);
      });
    }

    function updateGameState() {
      const query = { _id: game._id };
      const update = { $set: { state: 'worldState' } };
      const options = {};

      db.collection('gameCollection').updateOne(
        query,
        update,
        options,
        (error) => {
          if (error) {
            debug('updateGameState: error:', error);
            res.status(503);
            res.send('503 Service Unavailable - Cannot update game state');
            return;
          }

          sendResponce();
        }
      );
    }
