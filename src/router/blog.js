const { getList, 
        getDetail,
        newBlog,
        updateBlog,
        deleteBlog
} = require('../controller/blog');
const { SuccessModel, ErrorModel } = require('../model/resModel');

// login authentication
const loginCheck = (req) => {
    if (!req.session.username){
        return Promise.resolve(new ErrorModel('sorry. Not logged in.'));
    }
}

const handleBlogRouter = (req, res) => {
    const method = req.method; // GET POST
    const url = req.url;
    const path = url.split('?')[0];

    // get blog list
    if (method === 'GET' && path === '/api/blog/list') {
        let author = req.query.author || '';
        const keyword = req.query.keyword || '';

        if (req.query.isadmin){
            const loginCheckResult = loginCheck(req);
            if (loginCheckResult) {
                return loginCheckResult;
            }
            author = req.session.username;
        }

        const result = getList(author, keyword);
        return result.then(listData => {
            return new SuccessModel(listData);
        })
    }


    // blog detail 
    if (method === 'GET' && path === '/api/blog/detail') {
        const id = req.query.id || '';
       
        const result = getDetail(id);
        return result.then(detailData => {
            return new SuccessModel(detailData)
        })
    }

    // create new blog
    if (method === 'POST' && path === '/api/blog/new') {
        
        const loginCheckResult = loginCheck(req);
        if (loginCheckResult) {
            return loginCheckResult;
        }

        req.body.author = req.session.username; // fake data, turn into reals ones after redis
        const result = newBlog(req.body);
        return result.then(newBlogData => {
            return new SuccessModel(newBlogData)
        })
    }

    // update blog
    if (method === 'POST' && path === '/api/blog/update') {

        const loginCheckResult = loginCheck(req);
        if (loginCheckResult) {
            return loginCheckResult;
        }

        const id = req.query.id || '';
        const author = req.session.username;
        const result = updateBlog(id, author, req.body);
        return result.then(isUpdated => {
            if (isUpdated){
                return new SuccessModel();
            } else {
                return new ErrorModel('failed to update blog');
            }
        })
    }

    // delete blog
    if (method === 'POST' && path === '/api/blog/delete') {

        const loginCheckResult = loginCheck(req);
        if (loginCheckResult) {
            return loginCheckResult;
        }

        const id = req.query.id || '';
        const author = req.session.username;
        const result = deleteBlog(id, author);

        return result.then(isDeleted => {
            if (isDeleted){
                return new SuccessModel();
            } else {
                return new ErrorModel('failed to delete blog');
            }
        })
    }
}

module.exports = handleBlogRouter;