const { exec, escape } = require('../db/mysql');
const xss = require('xss');

const getList = (author, keyword) => {
    author = escape(author);
    keyword = escape(`%${keyword}%`);
    let sql = `select * from blogs where 1=1 `;

    if (author!=="''") {
        sql += `and author=${author} `;
    }
    if (keyword!=="'%%'") {
        sql += `and title like ${keyword} `;
    }

    return exec(sql);
}

const getDetail = (id, author="", isAdmin=false) => {
    author = escape(author);
    id = escape(id);
    let sql = `select * from blogs where id=${id}`
    if (isAdmin){
        sql += `and author=${author}`;
    }
    return exec(sql).then(rows => {
        return rows[0]
    })
}

const newBlog = (blogData = {}) => {
    const createtime = escape(Date.now());
    const title = escape(xss(blogData.title));
    const content = escape(xss(blogData.content));
    const author = escape(blogData.author);

    const sql = `
    insert into blogs (title, content, createtime, author)
    values (${title}, ${content}, ${createtime}, ${author});
    `

    return exec(sql).then(insertData => {
        return {
            id : insertData.insertId
        }
    })
}

const updateBlog = (id, author, blogData = {}) => {
    const title = escape(xss(blogData.title));
    const content = escape(xss(blogData.content));
    id = escape(id);
    author = escape(author);

    const sql = `
    update blogs set content = ${content}, title = ${title} where id = ${id} and author=${author}
    `
    return exec(sql).then(updateData => {
        return updateData.affectedRows > 0;
    });
}

const deleteBlog = (id, author) => {
    id = escape(id);
    author = escape(author);

    const sql = `delete from blogs where id=${id} and author=${author}`
    return exec(sql).then(deleteData => {
        return deleteData.affectedRows > 0;
    });
}

module.exports = {
    getList,
    getDetail,
    newBlog,
    updateBlog,
    deleteBlog
}