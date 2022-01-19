const { getList, 
        getDetail,
        newBlog,
        updateBlog,
        deleteBlog
} = require('../controller/blog');
const { SuccessModel, ErrorModel } = require('../model/resModel');

const handleBlogRouter = (req, res) => {
    const method = req.method; // GET POST
    const url = req.url;
    const path = url.split('?')[0];

    // get blog list
    if (method === 'GET' && path === '/api/blog/list') {
        const author = req.query.author || '';
        const keyword = req.query.keyword || '';

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
        
        req.body.author = 'zhangsan'; // fake data, turn into reals ones after redis
        const result = newBlog(req.body);
        return result.then(newBlogData => {
            return new SuccessModel(newBlogData)
        })
    }

    // update blog
    if (method === 'POST' && path === '/api/blog/update') {
        const id = req.query.id || '';
        const result = updateBlog(id, req.body);
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
        const id = req.query.id || '';
        const author = 'zhangsan' // fake data, will change when change to redis
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