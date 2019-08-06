process.env.NODE_ENV = 'test';
const chai = require('chai');
const chaiSorted = require('chai-sorted');
const { expect } = chai;
const request = require('supertest');
const app = require('../app');
const connection = require('../db/connection');

describe('/API', () => {
    beforeEach(() => connection.seed.run());
    after(() => connection.destroy());
    describe('/TOPICS', () => {
        it('GET return status 200 and array of topic objects', () => {
            return request(app)
                .get('/api/topics')
                .expect(200)
                .then(({ body }) => {
                    expect(body.topics).to.be.an('array')
                    expect(body.topics[0]).to.have.keys('slug', 'description')

                });
        });
        it('INVALID METHODS returns 405 and method not allowed', () => {
            const invalidMethods = ['patch', 'post', 'delete'];
            const methodPromises = invalidMethods.map((method) => {
                return request(app)[method]('/api/topics')
                .expect(405)
                    .then(({body: {msg}}) => {
                        expect(msg).to.equal('method not allowed')
                    });
            });
            return Promise.all(methodPromises)
        });
    });
    describe('/USERS/:username', () => {
        it('returns 200 and object with username, avatar_url and name', () => {
            return request(app)
                .get('/api/users/butter_bridge')
                .expect(200)
                .then(({ body }) => {
                    expect(body.user).to.be.an('object')
                    expect(body.user).to.have.keys('username', 'avatar_url', 'name')
                });
        });
        it('ERROR, return 404 not found when username not found', () => {
            return request(app)
                .get('/api/users/usernotfound')
                .expect(404)
                .then(({body}) => {
                    expect(body.msg).to.equal('Not found')
                })

        });
    });
});