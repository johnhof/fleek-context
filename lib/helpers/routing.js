'use strict';

const Path = require('path');

module.exports.methodPathToKey = (method='', path='') => `${method.toUpperCase()}-${path}`;

module.exports.compileMap = (swagger={}) => {
  let map = {};
  let pathKeys = Object.keys(swagger.paths);
  for (let path of pathKeys) {
    let key = null;
    let pathMethods = swagger.paths[path];
    let availableMethods = Object.keys(pathMethods);
    for (let methodName of availableMethods) {
      key = module.exports.methodPathToKey(methodName, path);
      map[key] = pathMethods[methodName];
    }
  }
  return map;
}
