const redis = require('ioredis')
const { REDIS_CONF } = require('../conf/db');

// create redis client

const redisClient = redis.createClient(REDIS_CONF);
redisClient.on('error', (err) => console.log('Redis Client Error', err));

async function set(key, val) {
    if (typeof val === 'object'){
        val = JSON.stringify(val);
    }
    await redisClient.set(key, val, 'ex', 60 * 60 * 24).then(
        (res) =>{
            // console.log(`result for setting ${key}: ${res}`);
        }
    );
}

async function del(key) {
    await redisClient.del(key);
}
async function get(key) {
    const value = await redisClient.get(key)
    if (value == null){
        return;
    }
    try{
        let objValue = JSON.parse(value);
        return objValue;
    } catch(err) {
        return value;
    }
}

module.exports = {
    set,
    get,
    del
}