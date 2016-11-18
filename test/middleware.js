'use strict';

const mocha = require('co-mocha');
const expect = require('chai').expect;

const fleekContext = require('../lib/middleware');
const SWAGGER = require('./swagger.json');

describe('Middleware', () => {
  it('should accept options and return a function', () => {
    let middleware = fleekContext(SWAGGER);
    expect(middleware).to.be.a('function');
  });
  it('should return a promise when the middleware function is called', () => {
    let middleware = fleekContext(SWAGGER);
    expect(middleware({}, () => Promise.resolve())).to.be.instanceof(Promise);
  });
  it('should bind middleware to fleek property of context', (done) => {
    let called = false;
    let ctx =  { method: 'post', path: '/foo/create' };
    let middleware = fleekContext(SWAGGER);
    middleware(ctx, () => {
      expect(ctx).to.be.an('object');
      expect(ctx.fleek).to.be.an('object');
      expect(ctx.fleek.method).to.be.a('string');
      expect(ctx.fleek.path).to.be.a('string');
      expect(ctx.fleek.params).to.be.an('object');
      expect(ctx.fleek.context).to.be.an('object');
      expect(ctx.fleek.swagger).to.be.an('object');
      done();
      return Promise.resolve();
    })
  });
});
