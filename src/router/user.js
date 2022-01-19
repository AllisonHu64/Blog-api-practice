const { login } = require('../controller/user');
const { SuccessModel, ErrorModel } = require('../model/resModel');

// get cookie expiration time
const getCookieExpires = () => {
    const d = new Date();
    d.setTime(d.getTime() + (24 * 60 * 60 * 1000));
    return d.toGMTString();
}

const handleUserRouter = (req, res) => {
    const method = req.method // GET POST
    const url = req.url
    const path = url.split('?')[0]

    // log in 
    if (method === 'GET' && path === '/api/user/login') {
        // const { username, password } = req.body;
        const { username, password } = req.query;
        const result = login(username, password);

        return result.then(loginData => {
            if (JSON.stringify(loginData) !== '{}'){
                
                req.session.username = loginData.username;
                req.session.realname = loginData.realname;
                console.log(req.session);
                return new SuccessModel();
            } else {
                return new ErrorModel('failed to login');
            }
        })
    }

    // authenticate login test

    if (method === 'GET' && req.path === '/api/user/login-test'){
        if (req.session.username){
            return Promise.resolve(
                new SuccessModel({
                    session: req.session
                })
            );
        }
        return Promise.resolve(new ErrorModel('sorry. Not logged in.'));
    }

}

module.exports = {
    handleUserRouter,
    getCookieExpires
};