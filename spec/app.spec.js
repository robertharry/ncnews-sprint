process.env.NODE_ENV = 'test';
const chai = require('chai');
const chaiSorted = require('chai-sorted');
const { expect } = chai;
chai.use(chaiSorted)
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
                        expect(body.comment).to.be.an('object')
                        expect(body.comment).to.have.keys('comment_id', 'author', 'article_id', 'votes', 'created_at', 'body')
                    })
                });
                it('POST ERROR returns 400 not found in table when given article ID that is not found', () => {
                    return request(app)
                    .post('/api/articles/345/comments')
                    .send({username: 'butter_bridge', body: 'Here is my comment for this article'})
                    .expect(400)
                    .then(({ body }) => {
                        expect(body.msg).to.equal('Not found in table')
                    });
                });
                it('POST ERROR returns 400 Bad request when given invalid article id', () => {
                    return request(app)
                    .post('/api/articles/invalidID/comments')
                    .send({username: 'butter_bridge', body: 'Here is my comment for this article'})
                    .expect(400)
                    .then(({ body }) => {
                        expect(body.msg).to.equal('Bad request')
                    });
                });
                it('POST ERROR returns 400 Bad request when given bad input info', () => {
                    return request(app)
                    .post('/api/articles/invalidID/comments')
                    .send({userInvalid: 'butter_bridge', bodyInv: 'Here is my comment for this article'})
                    .expect(400)
                    .then(({ body }) => {
                        expect(body.msg).to.equal('Bad request')
                    });
                });
                it('GET returns 200 and an array of comments for given article id', () => {
                   return request(app)
                   .get('/api/articles/1/comments') 
                   .expect(200)
                   .then(({body}) => {
                       expect(body.comments).to.be.an('array')
                       expect(body.comments[0]).to.have.keys('comment_id', 'author', 'created_at', 'votes', 'body')
                   })
                });
                it('GET returns 200 and sorts by DEFAULT to created_at', () => {
                    return request(app)
                    .get('/api/articles/1/comments') 
                    .expect(200)
                    .then(({body}) => {
                        expect(body.comments).to.be.sortedBy('created_at', {descending: true})
                    })
                });
                it('GET returns 200 and accepts sort_by query', () => {
                    return request(app)
                    .get('/api/articles/1/comments?sort_by=author') 
                    .expect(200)
                    .then(({body}) => {
                        expect(body.comments).to.be.sortedBy('author', {descending: true})
                    })
                });
                it('GET returns 200 and DEFAULT sorts to desc', () => {
                    return request(app)
                    .get('/api/articles/1/comments') 
                    .expect(200)
                    .then(({body}) => {
                        expect(body.comments).to.be.sortedBy('created_at', {descending: true})
                    })
                });
                it('GET returns 200 and accepts query of order to change sort to asc', () => {
                    return request(app)
                    .get('/api/articles/1/comments?order=asc') 
                    .expect(200)
                    .then(({body}) => {
                        expect(body.comments).to.be.sortedBy('created_at')
                    })
                });
                it('GET ERROR and 400 Bad request when bad sort_by query given', () => {
                    return request(app)
                    .get('/api/articles/1/comments?sort_by=badrequest') 
                    .expect(400)
                    .then(({body}) => {
                        expect(body.msg).to.equal('Cannot sort by column that does not exist')
                    })
                });
            });
            describe.only('/', () => {
                it('GET returns 200 and array of articles with specific keys', () => {
                    return request(app)
                    .get('/api/articles')
                    .expect(200)
                    .then(({body}) => {
                        expect(body.articles).to.be.an('array')
                        expect(body.articles[0]).to.contain.keys('author', 'title', 'article_id', 'topic', 'created_at', 'votes')
                    })
                });
                it('GET returns 200 and has new key of comment_count added with total number of comments as a value', () => {
                    return request(app)
                    .get('/api/articles')
                    .expect(200)
                    .then(({body}) => {
                        expect(body.articles[0]).to.contain.keys('comment_count')
                    })
                });
            });
        });
    });
});