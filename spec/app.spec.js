process.env.NODE_ENV = 'test';
const chai = require('chai');
const chaiSorted = require('chai-sorted');
const { expect } = chai;
const request = require('supertest');
const app = require('../app');
const connection = require('../db/connection');

describe('APP', () => {
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
                        .then(({ body: { msg } }) => {
                            expect(msg).to.equal('Method not allowed!')
                        });
                });
                return Promise.all(methodPromises)
            });
        });
        describe('/USERS', () => {
            describe('/:username', () => {
                it('GET returns 200 and object with username, avatar_url and name', () => {
                    return request(app)
                        .get('/api/users/butter_bridge')
                        .expect(200)
                        .then(({ body }) => {
                            expect(body.user).to.be.an('object')
                            expect(body.user).to.have.keys('username', 'avatar_url', 'name')
                        });
                });
                it('GET ERROR, return 404 not found when username not found', () => {
                    return request(app)
                        .get('/api/users/invaliduser')
                        .expect(404)
                        .then(({ body }) => {
                            expect(body.msg).to.equal('Not found')
                        })
                });
                it('INVALID METHODS returns 405 and method not allowed', () => {
                    const invalidMethods = ['patch', 'post', 'delete'];
                    const methodPromises = invalidMethods.map((method) => {
                        return request(app)[method]('/api/users/:username')
                            .expect(405)
                            .then(({ body: { msg } }) => {
                                expect(msg).to.equal('Method not allowed!')
                            });
                    });
                    return Promise.all(methodPromises)
                });
            });
        });
        describe('/ARTICLES', () => {
            describe('/:article_id', () => {
                it('GET returns 200 and an article object by ID', () => {
                    return request(app)
                        .get('/api/articles/1')
                        .expect(200)
                        .then(({ body }) => {
                            expect(body).to.be.an('object')
                        })
                });
                it('GET returns 200 and an article object by ID, with additional key of comment_count', () => {
                    return request(app)
                        .get('/api/articles/1')
                        .expect(200)
                        .then(({ body }) => {
                            expect(body.article).to.contain.keys('comment_count')
                        });
                });
                it('GET ERROR, returns 404 article not found when no article found', () => {
                    return request(app)
                        .get('/api/articles/456')
                        .expect(404)
                        .then(({ body }) => {
                            expect(body.msg).to.equal('Article not found')
                        });
                });
                it('GET ERROR, returns 400 bad request when given invalid article ID', () => {
                    return request(app)
                        .get('/api/articles/badinput')
                        .expect(400)
                        .then(({ body }) => {
                            expect(body.msg).to.equal('Bad request')
                        })
                });
                it('PATCH returns 201 and the artile with updated number of votes', () => {
                    return request(app)
                        .patch('/api/articles/1')
                        .send({ inc_votes: 45 }) /* article 1 has 100 */
                        .expect(201)
                        .then(({ body }) => {
                            expect(body).to.be.an('object')
                            expect(body.article.votes).to.equal(145)
                        })
                });
                it('PATCH ERROR, returns 404 article not found when no article found', () => {
                    return request(app)
                        .patch('/api/articles/456')
                        .send({ inc_votes: 45 })
                        .expect(404)
                        .then(({ body }) => {
                            expect(body.msg).to.equal('Article not found')
                        });
                });
                it('GET ERROR, returns 400 bad request when given invalid article ID', () => {
                    return request(app)
                        .get('/api/articles/badinput')
                        .send({ inc_votes: 45 })
                        .expect(400)
                        .then(({ body }) => {
                            expect(body.msg).to.equal('Bad request')
                        })
                });
            });
            describe('/:article_id/comments', () => {
                it('POST inserts a new comment and returns the posted comment', () => {
                    return request(app)
                    .post('/api/articles/1/comments')
                    .send({username: 'butter_bridge', body: 'Here is my comment for this article'})
                    .expect(201)
                    .then(({body}) => {
                        //console.log(body)
                    })
                });
            });
        });
    });
});