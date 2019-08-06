const articlesRouter = require('express').Router();
const {getArticleById, patchArticle, postComment, getCommentsByArticleId, getAllArticles} = require('../controllers/article-controller')

articlesRouter.route('/:article_id')
.get(getArticleById)
.patch(patchArticle)

articlesRouter.route('/:article_id/comments')
.post(postComment)
.get(getCommentsByArticleId)

articlesRouter.route('/').get(getAllArticles)



module.exports = articlesRouter;