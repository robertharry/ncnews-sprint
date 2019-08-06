const articlesRouter = require('express').Router();
const {getArticleById, patchArticle} = require('../controllers/article-controller')

articlesRouter.route('/:article_id')
.get(getArticleById)
.patch(patchArticle)



module.exports = articlesRouter;