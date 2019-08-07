const articlesRouter = require('express').Router();
const {getArticleById, patchArticle, postComment, getCommentsByArticleId, getAllArticles} = require('../controllers/article-controller')
const {send405Error} = require('../errors/index')

articlesRouter.route('/:article_id')
.get(getArticleById)
.patch(patchArticle)
.all(send405Error)

articlesRouter.route('/:article_id/comments')
.get(getCommentsByArticleId)
.post(postComment)
.all(send405Error)

articlesRouter.route('/')
.get(getAllArticles)
.all(send405Error)



module.exports = articlesRouter;