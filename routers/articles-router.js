const articlesRouter = require('express').Router();
const {getArticleById, patchArticle, postComment, getCommentsByArticleId, getAllArticles, deleteArticle, postArticle} = require('../controllers/article-controller')
const {send405Error} = require('../errors/index')

articlesRouter.route('/:article_id')
.get(getArticleById)
.patch(patchArticle)
.delete(deleteArticle)
.all(send405Error)

articlesRouter.route('/:article_id/comments')
.get(getCommentsByArticleId)
.post(postComment)
.all(send405Error)

articlesRouter.route('/')
.get(getAllArticles)
.post(postArticle)
.all(send405Error)



module.exports = articlesRouter;