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
        it('GET returns JSON with all available endpoints on API', () => {
            return request(app)
                .get('/api')
                .expect(200)
                .then(({ body }) => {
                    expect(body).to.be.an('object')
                })
        });
        describe('API ROUTER ERRORS', () => {
            it('INVALID ROUTE returns 405 if given invalid path', () => {
                return request(app)
                    .get('/api/invalid_route')
                    .expect(405)
                    .then(({ body }) => {
                        expect(body.msg).to.equal('Method not allowed!')
                    })
            });
            it('INVALID METHODS returns 405 and method not allowed', () => {
                const invalidMethods = ['patch', 'post', 'delete'];
                const methodPromises = invalidMethods.map((method) => {
                    return request(app)[method]('/api')
                        .expect(405)
                        .then(({ body: { msg } }) => {
                            expect(msg).to.equal('Method not allowed!')
                        });
                });
                return Promise.all(methodPromises)
            });
        });
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
            it('POST returns status 201 and object of new topic', () => {
                return request(app)
                .post('/api/topics')
                .send({slug:"coding", description:"all about them 1's and 0's"})
                .expect(201)
                .then(({body}) => {
                    expect(body.topic).to.be.an('object')
                    expect(body.topic.slug).to.equal("coding")
                })
            });
            it('POST ERROR returns status 400 if request to post topic that already exists', () => {
                return request(app)
                .post('/api/topics')
                .send({slug:"cats", description:"dem cats"})
                .expect(400)
                .then(({body}) => {
                    expect(body.msg).to.equal('Already exists')
                })
            });
            it('POST ERROR returns 400 when no slug string provided', () => {
                return request(app)
                .post('/api/topics')
                .send({slug:"", description:"dem cats"})
                .expect(400)
                .then(({body}) => {
                    expect(body.msg).to.equal('No topic inserted')
                })
            });
            it('POST ERROR returns 400 when bad column name provided', () => {
                return request(app)
                .post('/api/topics')
                .send({snail:"cats", description:"dem cats"})
                .expect(400)
                .then(({body}) => {
                    expect(body.msg).to.equal('Cannot sort by column that does not exist')
                })
            });
            it('INVALID METHODS returns 405 and method not allowed', () => {
                const invalidMethods = ['patch', 'delete'];
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
            describe('/', () => {
                it('returns status 200 an array of user objects', () => {
                    return request(app)
                        .get('/api/users')
                        .expect(200)
                        .then(({ body }) => {
                            expect(body.users[0]).to.have.keys('username', 'avatar_url', 'name')
                        })
                });
                it('INVALID METHODS returns 405 and method not allowed', () => {
                    const invalidMethods = ['patch', 'post', 'delete'];
                    const methodPromises = invalidMethods.map((method) => {
                        return request(app)[method]('/api/users')
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
                        .expect(200)
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
                it('PATCH ERROR, ignores request when given bad data, and returns original article', () => {
                    return request(app)
                        .patch('/api/articles/1')
                        .send({})
                        .expect(200)
                        .then(({ body }) => {
                            expect(body.article.votes).to.equal(100) // which is the original amount
                        })
                });
                it('DELETE returns 204 and removes article by ID, and associated comments', () => {
                    return request(app)
                        .delete('/api/articles/1')
                        .expect(204)
                });
                it('DELETE ERROR returns 404 not found where article id does not exist', () => {
                    return request(app)
                        .delete('/api/articles/456')
                        .expect(404)
                        .then(({ body }) => {
                            expect(body.msg).to.equal('Article not found')
                        })
                });
                it('DELETE ERROR returns 400 when given bad article id', () => {
                    return request(app)
                        .delete('/api/articles/badid')
                        .expect(400)
                        .then(({ body }) => {
                            expect(body.msg).to.equal('Bad request')
                        })
                });
                it('INVALID METHODS returns 405 and method not allowed', () => {
                    return request(app)
                        .post('/api/articles/:article_id')
                        .expect(405)
                        .then(({ body }) => {
                            expect(body.msg).to.equal('Method not allowed!')
                        });
                });
            });
            describe('/:article_id/comments', () => {
                it('POST inserts a new comment and returns the posted comment', () => {
                    return request(app)
                        .post('/api/articles/1/comments')
                        .send({ username: 'butter_bridge', body: 'Here is my comment for this article' })
                        .expect(201)
                        .then(({ body }) => {
                            expect(body.comment).to.be.an('object')
                            expect(body.comment).to.have.keys('comment_id', 'author', 'article_id', 'votes', 'created_at', 'body')
                        })
                });
                it('POST ERROR returns 404 not found in table when given article ID that is not found', () => {
                    return request(app)
                        .post('/api/articles/345/comments')
                        .send({ username: 'butter_bridge', body: 'Here is my comment for this article' })
                        .expect(404)
                        .then(({ body }) => {
                            expect(body.msg).to.equal('Not found in table')
                        });
                });
                it('POST ERROR returns 400 Bad request when given invalid article id', () => {
                    return request(app)
                        .post('/api/articles/invalidID/comments')
                        .send({ username: 'butter_bridge', body: 'Here is my comment for this article' })
                        .expect(400)
                        .then(({ body }) => {
                            expect(body.msg).to.equal('Bad request')
                        });
                });
                it('POST ERROR returns 400 Bad request when given bad input info', () => {
                    return request(app)
                        .post('/api/articles/1/comments')
                        .send({ userInvalid: 'butter_bridge', bodyInv: 'Here is my comment for this article' })
                        .expect(400)
                        .then(({ body }) => {
                            expect(body.msg).to.equal('Invalid input')
                        });
                });
                it('POST ERROR returns 400 when given incomplete data to create new comment', () => {
                    return request(app)
                        .post('/api/articles/1/comments')
                        .send({ username: '', })
                        .expect(400)
                        .then(({ body }) => {
                            expect(body.msg).to.equal('Invalid input')
                        });
                });
                it('GET returns 200 and an array of comments for given article id', () => {
                    return request(app)
                        .get('/api/articles/1/comments')
                        .expect(200)
                        .then(({ body }) => {
                            expect(body.comments).to.be.an('array')
                            expect(body.comments[0]).to.have.keys('comment_id', 'author', 'created_at', 'votes', 'body')
                        })
                });
                it('GET returns 200 and empty array when article id has no comments', () => {
                    return request(app)
                        .get('/api/articles/2/comments')
                        .expect(200)
                        .then(({ body }) => {
                            expect(body.comments).to.be.an('array')
                            expect(body.comments.length).to.equal(0)
                        })
                });
                it('GET ERROR, returns 404 when given article ID that does not exist', () => {
                    return request(app)
                        .get('/api/articles/567/comments')
                        .expect(404)
                        .then(({ body }) => {
                            expect(body.msg).to.equal('Article not found')
                        })
                });
                it('GET ERROR, returns 400 bad request when given invalid article id', () => {
                    return request(app)
                        .get('/api/articles/badID/comments')
                        .expect(400)
                        .then(({ body }) => {
                            expect(body.msg).to.equal('Bad request')
                        })
                });
                it('GET returns 200 and sorts by DEFAULT to created_at', () => {
                    return request(app)
                        .get('/api/articles/1/comments')
                        .expect(200)
                        .then(({ body }) => {
                            expect(body.comments).to.be.sortedBy('created_at', { descending: true })
                        })
                });
                it('GET returns 200 and accepts sort_by query', () => {
                    return request(app)
                        .get('/api/articles/1/comments?sort_by=author')
                        .expect(200)
                        .then(({ body }) => {
                            expect(body.comments).to.be.sortedBy('author', { descending: true })
                        })
                });
                it('GET returns 200 and DEFAULT sorts to desc', () => {
                    return request(app)
                        .get('/api/articles/1/comments')
                        .expect(200)
                        .then(({ body }) => {
                            expect(body.comments).to.be.sortedBy('created_at', { descending: true })
                        })
                });
                it('GET returns 200 and accepts query of order to change sort to asc', () => {
                    return request(app)
                        .get('/api/articles/1/comments?order=asc')
                        .expect(200)
                        .then(({ body }) => {
                            expect(body.comments).to.be.sortedBy('created_at')
                        })
                });
                it('GET ERROR and 400 Bad request when bad sort_by query given', () => {
                    return request(app)
                        .get('/api/articles/1/comments?sort_by=badrequest')
                        .expect(400)
                        .then(({ body }) => {
                            expect(body.msg).to.equal('Cannot sort by column that does not exist')
                        })
                });
                it('GET accepts a limit query with a DEFAULT of 10', () => {
                    return request(app)
                        .get('/api/articles/1/comments')
                        .expect(200)
                        .then(({ body }) => {
                            expect(body.comments.length).to.equal(10)
                        })
                });
                it('GET accepts a limit query of 5 and returns 5 comments in an array', () => {
                    return request(app)
                        .get('/api/articles/1/comments?limit=5')
                        .expect(200)
                        .then(({ body }) => {
                            expect(body.comments.length).to.equal(5)
                        })
                }); //no errors as limit defaults to 10 if no value
                it('GET accepts a p query that specifies which page to start on', () => {
                    return request(app)
                        .get('/api/articles/1/comments?p=2')
                        .expect(200)
                        .then(({ body }) => {
                            expect(body.comments.length).to.equal(3)
                        })
                });
                it('GET accepts a p query and takes into account the page limit', () => {
                    return request(app)
                        .get('/api/articles/1/comments?limit=5&p=2')
                        .expect(200)
                        .then(({ body }) => {
                            expect(body.comments.length).to.equal(5)
                        })
                });
                it('INVALID METHODS returns 405 and method not allowed', () => {
                    const invalidMethods = ['patch', 'delete'];
                    const methodPromises = invalidMethods.map((method) => {
                        return request(app)[method]('/api/articles/:article_id/comments')
                            .expect(405)
                            .then(({ body: { msg } }) => {
                                expect(msg).to.equal('Method not allowed!')
                            });
                    });
                    return Promise.all(methodPromises)
                });
            });
            describe('/', () => {
                it('GET returns 200 and array of articles with specific keys', () => {
                    return request(app)
                        .get('/api/articles')
                        .expect(200)
                        .then(({ body }) => {
                            expect(body.articles).to.be.an('array')
                            expect(body.articles[0]).to.contain.keys('author', 'title', 'article_id', 'topic', 'created_at', 'votes')
                        })
                });
                it('GET returns 200 and has new key of comment_count added with total number of comments as a value', () => {
                    return request(app)
                        .get('/api/articles')
                        .expect(200)
                        .then(({ body }) => {
                            expect(body.articles[0]).to.contain.keys('comment_count')
                        })
                });
                it('GET returns 200 and accepts sort_by query DEFAULTING to date', () => {
                    return request(app)
                        .get('/api/articles')
                        .expect(200)
                        .then(({ body }) => {
                            expect(body.articles).to.be.sortedBy('created_at', { descending: true })
                        })
                });
                it('GET returns 200 and accepts sort_by query author', () => {
                    return request(app)
                        .get('/api/articles?sort_by=author')
                        .expect(200)
                        .then(({ body }) => {
                            expect(body.articles).to.be.sortedBy('author', { descending: true })
                        })
                });
                it('GET returns 200 and has DEFAULT sort order of desc', () => {
                    return request(app)
                        .get('/api/articles')
                        .expect(200)
                        .then(({ body }) => {
                            expect(body.articles).to.be.sortedBy('created_at', { descending: true })
                        })
                });
                it('GET returns 200 and accepts an order query that can change the sort order to asc', () => {
                    return request(app)
                        .get('/api/articles?order=asc')
                        .expect(200)
                        .then(({ body }) => {
                            expect(body.articles).to.be.sortedBy('created_at')
                        })
                });
                it('GET returns 200 and accepts author query that filters results by specified username', () => {
                    return request(app)
                        .get('/api/articles?author=butter_bridge')
                        .expect(200)
                        .then(({ body }) => {
                            expect(body.articles.every(article => {
                                return article.author === 'butter_bridge'
                            })).to.be.true
                        });
                });
                it('GET ERROR returns 404 and Author not found where invalid username given', () => {
                    return request(app)
                        .get('/api/articles?author=unknown_author')
                        .expect(404)
                        .then(({ body }) => {
                            expect(body.msg).to.equal('Author not found')
                        });
                });
                it('GET returns 200 and accepts topic filter query that filters results by topic', () => {
                    return request(app)
                        .get('/api/articles?topic=cats')
                        .expect(200)
                        .then(({ body }) => {
                            expect(body.articles.every(article => {
                                return article.topic === 'cats'
                            })).to.be.true
                        })
                });
                it('GET ERROR returns 404 and Topic not found where invalid topic given', () => {
                    return request(app)
                        .get('/api/articles?topic=unknown_topic')
                        .expect(404)
                        .then(({ body }) => {
                            expect(body.msg).to.equal('Topic not found')
                        });
                });
                it('GET DEFAULTS the number of responses to 10', () => {
                    return request(app)
                        .get('/api/articles')
                        .expect(200)
                        .then(({ body }) => {
                            expect(body.articles.length).to.equal(10)
                        })
                });
                it('GET accepts a limit query to vary the number of responses', () => {
                    return request(app)
                        .get('/api/articles?limit=5')
                        .expect(200)
                        .then(({ body }) => {
                            expect(body.articles.length).to.equal(5)
                        })
                });// no error tests as covered in default limit test
                it('GET takes a "p" page query that specifies start page', () => {
                    return request(app)
                        .get('/api/articles?p=2')
                        .expect(200)
                        .then(({ body }) => {
                            expect(body.articles.length).to.equal(2)
                        })
                });
                it('GET ensures the "p" argument takes the limit into account', () => {
                    return request(app)
                        .get('/api/articles?limit=5&p=2')
                        .expect(200)
                        .then(({ body }) => {
                            expect(body.articles.length).to.equal(5)
                        })
                }); //again no further tests as default status is set
                it('GET adds total count that provides total number of articles ignoring page limit', () => {
                    return request(app)
                        .get('/api/articles')
                        .expect(200)
                        .then(({ body }) => {
                            expect(body).to.have.keys('articles', 'total_count')
                            expect(body.total_count).to.equal(12)
                        })
                });
                it('POST expects 201 and an object of posted article', () => {
                    return request(app)
                        .post('/api/articles')
                        .send({
                            title: 'Sony Vaio; or, The Laptop',
                            topic: 'mitch',
                            author: 'icellusedkars',
                            body:
                                'Call me Mitchell.'
                        })
                        .expect(201)
                        .then(({ body }) => {
                            expect(body.article).to.have.keys('article_id', 'title', 'body', 'votes', 'topic', 'author', 'created_at')
                        })
                });
                it('POST expects 400 bad request when inaccurate column names given', () => {
                    return request(app)
                        .post('/api/articles')
                        .send({
                            titleInv: 'Sony Vaio; or, The Laptop',
                            topicInv: 'mitch',
                            author: 'icellusedkars',
                            body:
                                'Call me Mitchell.'
                        })
                        .expect(400)
                        .then(({ body }) => {
                            expect(body.msg).to.equal('Cannot sort by column that does not exist')
                        })
                });
                it('POST expects 404 bot found when incomplete article data provided', () => {
                    return request(app)
                        .post('/api/articles')
                        .send({
                            title: '',
                            topic: 'mitch',
                            author: '',
                            body:
                                'Call me Mitchell.'
                        })
                        .expect(404)
                        .then(({ body }) => {
                            expect(body.msg).to.equal('Not found in table')
                        })
                });
                it('INVALID METHODS returns 405 and method not allowed', () => {
                    const invalidMethods = ['patch', 'delete'];
                    const methodPromises = invalidMethods.map((method) => {
                        return request(app)[method]('/api/articles')
                            .expect(405)
                            .then(({ body: { msg } }) => {
                                expect(msg).to.equal('Method not allowed!')
                            });
                    });
                    return Promise.all(methodPromises)
                });
            });
        });
        describe('/COMMENTS', () => {
            describe('/:comment_id', () => {
                it('PATCH takes an object and updates vote property of given comment_id', () => {
                    return request(app)
                        .patch('/api/comments/1')
                        .send({ inc_votes: 10 }) //article 1 has 16 votes by default
                        .expect(200)
                        .then(({ body }) => {
                            expect(body.comment).to.be.an('object')
                            expect(body.comment.votes).to.equal(26)
                        })
                });
                it('PATCH returns 200 with no increment to votes when passed a patch with no "inc_votes" provided', () => {
                    return request(app)
                        .patch('/api/comments/1')
                        .send({}) //article 1 has 16 votes by default
                        .expect(200)
                        .then(({ body }) => {
                            expect(body.comment.votes).to.equal(16)
                        })
                });
                it('PATCH ERROR returns 404 not found when given non-existent comment_id', () => {
                    return request(app)
                        .patch('/api/comments/345')
                        .send({ inc_votes: 10 })
                        .expect(404)
                        .then(({ body }) => {
                            expect(body.msg).to.eql('Comment not found')
                        })
                });
                it('PATCH ERROR returns 400 Bad request when given bad format comment_id', () => {
                    return request(app)
                        .patch('/api/comments/bad_format')
                        .send({ inc_votes: 10 })
                        .expect(400)
                        .then(({ body }) => {
                            expect(body.msg).to.eql('Bad request')
                        })
                });
                it('DELETE returns status 204 and deletes comment by given ID', () => {
                    return request(app)
                        .delete('/api/comments/2')
                        .expect(204)
                });
                it('DELETE ERROR, returns 404 when given valid comment_id that does not exist', () => {
                    return request(app)
                        .delete('/api/comments/456')
                        .expect(404)
                });
                it('DELETE ERROR, returns 400 Bad request if given ID in bad format', () => {
                    return request(app)
                        .delete('/api/comments/bad_id')
                        .expect(400)
                        .then(({ body }) => {
                            expect(body.msg).to.equal('Bad request')
                        })
                });
                it('INVALID METHODS returns 405 and method not allowed', () => {
                    const invalidMethods = ['get', 'post'];
                    const methodPromises = invalidMethods.map((method) => {
                        return request(app)[method]('/api/comments/:comment_id')
                            .expect(405)
                            .then(({ body: { msg } }) => {
                                expect(msg).to.equal('Method not allowed!')
                            });
                    });
                    return Promise.all(methodPromises)
                });
            });
        });
    });
});