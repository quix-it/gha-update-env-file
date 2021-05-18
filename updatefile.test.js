const { test, expect } = require('@jest/globals');
const { updatefile, readvars } = require('./updatefile');
// const updatefile = require('./updatefile');
// const readvars = require('./readvars');
const fs = require('fs');

const filename = "./test/.env";
const encoding = "utf8";

const init_env = { MYTESTVARIABLE: "init_value" };

test('update existing value', async () => {
  const newvalue = Math.random().toString(36).replace(/[^a-zA-Z0-9]+/g, '');
  process.env["MYTESTVARIABLE"] = newvalue;
  await updatefile(filename, encoding, ["MYTESTVARIABLE"]);
  fs.readFile(filename, encoding, function (err, data) {
    const envs = readvars(data);
    expect(envs.MYTESTVARIABLE).toBe(newvalue)
  });
});

test('add new item', async () => {
  const newkey = Math.random().toString(36).replace(/[^a-z]+/g, '').toUpperCase();
  const newvalue = Math.random().toString(36).replace(/[^a-z0-9]+/g, '');
  process.env[newkey] = newvalue;
  await updatefile(filename, encoding, [newkey]);
  fs.readFile(filename, encoding, function (err, data) {
    const envs = readvars(data);
    expect(envs[newkey]).toBe(newvalue)
  });
});

test('restore initial data', async () => {
  const init_vars = [];
  Object.keys(init_env).forEach(k => {
    init_vars.push(k);
    process.env[k] = init_env[k];
  });
  await updatefile(filename, encoding, init_vars, true);
  fs.readFile(filename, encoding, function (err, data) {
    const envs = readvars(data);
    expect(envs).toEqual(init_env)
  });
});

