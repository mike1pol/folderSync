const fs = require('fs');

/** Config file */
const config = require('./config');
/** Sync files function */
const syncFiles = require('./syncFiles');
/** Send commands over ssh */
const sendCommands = require('./sendCommands');

/** Interval timer */
let timer = null;
/** Sync in progress */
let syncInWork = false;
/** Update after sync */
let updateAfterSync = false;

function watchFiles() {
  function syncEnd() {
    clearInterval(timer);
    timer = null;
    syncInWork = false;
    if (updateAfterSync) {
      updateAfterSync = false;
      watchFiles();
    }
    console.log('--- watch file start end ---');
  }
  console.log('--- watch file start ---');
  if (syncInWork) {
    updateAfterSync = true;
    console.log('--- sync in work');
    return;
  }
  if (timer) {
    console.log('--- clear timer');
    clearInterval(timer);
    timer = null;
  }
  console.log('--- set timer');
  timer = setInterval(() => {
    console.log('--- sync start');
    if (syncInWork) {
      return;
    }
    syncInWork = true;
    syncFiles(config)
      .then(() => {
        if (config.commands && config.commands.length > 0) {
          return sendCommands(config);
        }
        return Promise.resolve();
      })
      .then((commandResult) => {
        commandResult.forEach(c => console.log(c));
        syncEnd();
      })
      .catch((err) => {
        console.error(err);
        syncEnd();
      });
  }, 2000);
}

fs.watch(config.srcPath, watchFiles);
