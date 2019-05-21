/* eslint-env mocha */
/* eslint no-debugger: off */

const { expect } = require('chai')
const corsHeaders = require('../index')

describe('hapi-cors-headers tests', () => {
  it('request.headers.origin is undefined', (done) => {
    const request = { headers: {} }
    const h = { continue: true }
    corsHeaders(request, h)
    expect(Object.keys(request.headers).length).to.be.equal(0)
    done()
  })

  it('request is boom error', (done) => {
    const request = {
      headers: {
        origin: 'example.com'
      },
      response: {
        isBoom: true,
        output: {
          headers: {},
          statusCode: 500
        }
      }
    }
    const h = { continue: true }
    corsHeaders(request, h)
    expect(request.response.output.headers['access-control-allow-origin']).to.be.equal('example.com')
    expect(request.response.output.headers['access-control-allow-credentials']).to.be.equal('true')
    expect(request.response.output.statusCode).to.be.equal(500)
    done()
  })

  it('options request without acces-control-request headers', (done) => {
    const request = {
      method: 'options',
      headers: {
        origin: 'example.com'
      },
      response: {
        headers: {},
        statusCode: 500
      }
    }
    const h = { continue: true }
    corsHeaders(request, h)
    expect(request.response.headers['access-control-allow-origin']).to.be.equal('example.com')
    expect(request.response.headers['access-control-allow-credentials']).to.be.equal('true')
    expect('access-control-allow-headers' in request.response.headers).to.be.equal(false)
    expect('access-control-allow-methods' in request.response.headers).to.be.equal(false)
    expect(request.response.statusCode).to.be.equal(200)
    done()
  })

  it('options request', (done) => {
    const request = {
      method: 'options',
      headers: {
        origin: 'example.com',
        'access-control-request-headers': 'x-header',
        'access-control-request-method': 'GET'
      },
      response: {
        headers: {},
        statusCode: 500
      }
    }
    const h = { continue: true }
    corsHeaders(request, h)
    expect(request.response.headers['access-control-allow-origin']).to.be.equal('example.com')
    expect(request.response.headers['access-control-allow-credentials']).to.be.equal('true')
    expect(request.response.headers['access-control-allow-headers']).to.be.equal('x-header')
    expect(request.response.headers['access-control-allow-methods']).to.be.equal('GET')
    expect(request.response.statusCode).to.be.equal(200)
    done()
  })
})
