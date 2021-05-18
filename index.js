const core = require('@actions/core');
const github = require('@actions/github');
const { updatefile, readvars } = require('./updatefile');

// const fs = require('fs');

async function run() {
  try {
    const filename = core.getInput('filename');
    const variables = core.getInput('variables');
    const reset = (core.getInput('reset') == 'true');
    const blanks = core.getInput('blanks');
    const encoding = "utf8";

    await updatefile(filename, encoding, variables.split("\n"), reset, blanks).then({}, (reason) => new Error(reason));

  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
