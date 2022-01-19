const { rejects } = require('assert');
const querystring = require('querystring');
const handleBlogRouter = require('./src/router/blog');
const { handleUserRouter, getCookieExpires } = require('./src/router/user');

// session Data
const SESSION_DATA = {};


const getPostData = (req) => {
    const promise = new Promise((resolve, reject) => {
        if (req.method !== 'POST'){
            resolve({});
            return;
        }
        if (req.headers['content-type'] !== 'application/json') {
            resolve({});
            return;
        }

        let postData = '';
        req.on('data', chunk => {
            postData += chunk.toString();
        })
        req.on('end', () => {
            if (!postData){
                resolve({})
            }
            resolve(
                JSON.parse(postData)
            )
        })
    })
    return promise
} 
const serverHandle = async (req, res) => {
    res.setHeader('Content-type', 'application/json');

    // get path
    const url = req.url;
    req.path = url.split('?')[0];

    // get query
    req.query = querystring.parse(url.split('?')[1]);

    // get cookie
    req.cookie = {};
    const cookieStr = req.headers.cookie || '';
    cookieStr.split(';').forEach(item => {
        if (!item) {
            return;
        }
        const arr = item.split('=')
        const key = arr[0].trim();
        const value = arr.slice(1).join('=').trim();
        req.cookie[key] = value;
    });

    // get session
    let needSetCookie = false;
    let userId = req.cookie.userid;
    if (userId){
        if (!SESSION_DATA[userId]){
            SESSION_DATA[userId] = {};
        }
    } else {
        needSetCookie = true;
        userId = `${Date.now()}_${Math.random()}`;
        SESSION_DATA[userId] = {};
    }
    req.session = SESSION_DATA[userId]

    // handle postdata
    await getPostData(req).then(postData => {
        req.body = postData
    });

    // handle blog router
    const blogResult = handleBlogRouter(req, res);
    if (blogResult){
        blogResult.then(blogData => {
            if (needSetCookie){
                // change cookie
                res.setHeader('Set-Cookie', `userid=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`)
            }

            res.end(
                JSON.stringify(blogData)
            );
        })
        return;
    }

    // handle user api
    const userResult = handleUserRouter(req, res);
    if (userResult){
        userResult.then(userData => {
            if (needSetCookie){
                // change cookie
                res.setHeader('Set-Cookie', `userid=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`)
            }
            res.end(
                JSON.stringify(userData)
            );
        })
        return;
    }

    // nothing is being found
    res.writeHead(404, {"Content-type": "text/plain"});
    res.write("404 Not Found\n");
    res.end()
}

module.exports = serverHandle;