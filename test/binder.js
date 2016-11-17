'use strict';

const mocha = require('co-mocha');
const expect = require('chai').expect;

const ContextBinder = require('../lib/binder');
const SWAGGER = require('./swagger.json');

let validateCtx = (ctx) => {
  expect(ctx).to.be.an('object');
  expect(ctx.fleek).to.be.an('object');
  expect(ctx.fleek.context).to.be.an('object');
  expect(ctx.fleek.swagger).to.be.an('object');
}

describe('Context Builder', () =>  {
  describe('Constructor', () => {
    it('should initialize with a swagger object', () => {
      let binder = new ContextBinder(SWAGGER);
      expect(binder).instanceof(ContextBinder);
    });
    it('should compile a route/method mapping to endpoint configuration', () => {
      let binder = new ContextBinder(SWAGGER);
      expect(binder).instanceof(ContextBinder);
      expect(binder.routeMap).to.be.an('object');
      let routeKeys = Object.keys(binder.routeMap);
      for (let key of routeKeys) expect(binder.routeMap[key]).to.be.an('object');
    });

    it('should error if swagger is not provided, or malphormed', () => {
      expect(() => new ContextBinder()).to.throw(Error);
      expect(() => new ContextBinder({})).to.throw(Error);
    });
  });

  describe('bind', () => {
    it('should return the updated context', function () {
      let binder = new ContextBinder(SWAGGER);
      let ctx = binder.bindCtx({ method: 'get', path: '/foo/{id}' });
      validateCtx(ctx);
    });
    it('should bind updates to the context', function () {
      let binder = new ContextBinder(SWAGGER);
      let ctx = { method: 'get', path: '/foo/{id}' };
      binder.bindCtx(ctx);
      validateCtx(ctx);
    });
    it('should get the request swagger context by method and path', () => {
      let binder = new ContextBinder(SWAGGER);
      let paths = Object.keys(SWAGGER.paths);
      for (let path of paths) {
        let methods = Object.keys(SWAGGER.paths[path]);
        for (let method of methods) {
          let key = `${method.toUpperCase()}-${path}`;
          let ctx = binder.bindCtx({ method, path });
          expect(ctx.fleek.context).to.deep.equal(SWAGGER.paths[path][method]);
        }
      }
    });
    it('should return no request swagger context if the path is not registered', () => {
      let binder = new ContextBinder(SWAGGER);
      expect(binder.bindCtx({ method: 'get', path: '/nonsense' }).fleek.context).to.be.false;
    });
  });
});
