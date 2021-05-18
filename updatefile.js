const fs = require('fs');

const RE_INI_KEY_VAL = /^\s*([\w.-]+)\s*=\s*(.*)?\s*$/ // from dotenv project

let readvars = function(data) {
  var retval = {}
  data
    .replace(/[\r\n]/g,"\n")
    .split("\n")
    .forEach(line => {
      let m = line.match(RE_INI_KEY_VAL);
      if(m) {
        retval[m[1]] = m[2];
      }
    });
  return retval;
};

let filtervars = function(variables, blanks) {
  const subenv = {};
  variables.filter(x => Object.keys(process.env).includes(x)).forEach(k => {
    subenv[k] = process.env[k];
  });
  
  const remove = [];
  switch (blanks) {
    case "allow":
      // do nothing
      break;
    case "remove":
      Object.keys(subenv).forEach(k => {
        if (subenv[k] == '') remove.push(k);
      });
      break;
    case "ignore":
    default:
      Object.keys(subenv).forEach(k => {
        if (subenv[k].length == '') delete subenv[k];
      });
  }

  return {
    updatevars: subenv,   // variables to update: key-value pairs
    removevars: remove    // variables to remove: list of keys
  };
};

let updatefile = function(filename, encoding, variables, reset=false, blanks="ignore") {
  return new Promise((resolve) => {

    fs.readFile(filename, encoding, function (err, data) {
      if (err) {
        switch (err.code) {
          case "ENOENT":
            data = "";
            break;
          default:
            throw new Error(err);
        }
      }
      
      var envs;
      if (reset)  envs = {};
      else        envs = readvars(data);

      const filtered = filtervars(variables, blanks);
      const updatevars = filtered.updatevars;
      const removevars = filtered.removevars;

      Object.keys(updatevars).forEach(k => envs[k] = updatevars[k]);
      removevars.forEach(k => delete envs[k]);
  
      const contents = Object.keys(envs)
        .map(k => `${k}=${envs[k]}`)
        .sort()
        .join("\n");
  
      fs.writeFile(filename, contents, encoding, function (err) {
        if (err) {
          throw new Error(err);
        }
        resolve("done");
      });
  
    });
  
  });
};

module.exports = {
  updatefile,
  readvars
}
