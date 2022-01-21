const { exec } = require('../db/mysql');

const getList = (author, keyword) => {
    let sql = `select * from blogs where 1=1 `;

    if (author) {
        sql += `and author='${author}' `;
    }
    if (keyword) {
        sql += `and title like '%${keyword}%' `;
    }

    sql += `order by createtime desc;`

    return exec(sql);
}

const getDetail = (id) => {
    const sql = `select * from blogs where id='${id}';`
    return exec(sql).then(rows => {
        return rows[0]
    })
}

const newBlog = (blogData = {}) => {
    const createtime = Date.now();

    const sql = `
    insert into blogs (title, content, createtime, author)
    values ('${blogData.title}', '${blogData.content}', '${createtime}', '${blogData.author}');
    `
    
    return exec(sql).then(insertData => {
        return {
            id : insertData.insertId
        }
    })
}

const updateBlog = (id, author, blogData = {}) => {
    const title = blogData.title;
    const content = blogData.content;

    const sql = `
    update blogs set content = '${content}', title = '${title}' where id = '${id} and author='${author}'
    `
    return exec(sql).then(updateData => {
        return updateData.affectedRows > 0;
    });
}

const deleteBlog = (id, author) => {
    const sql = `delete from blogs where id='${id}' and author='${author}'`
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