'use strict';

const Path = require('path');
const routington = require('routington');


module.exports.methodPathToKey = (method='', path='') => `${method.toUpperCase()}-${path}`;

module.exports.compile = (paths={}, opts={}) => {
  let basePath = opts.basePath || '';
  let router = routington();
  let pathList = Object.keys(paths);
  for (let path of pathList) {
    let normPath = basePath + (path.replace(/\/{/g, '\/:')
      .replace(/}\//g, '\/')
      .replace(/}$/g, ''));

    let node = router.define(normPath)[0];
    let methods = Object.keys(paths[path]);
    for (let method of methods) {
      let _method = method;
      method = method.toUpperCase();
      node[method] = {
        path: path,
        _path: normPath,
        method: method,
        definition: paths[path][_method]
      };
    }
  }
  return router;
}
