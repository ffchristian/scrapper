const Scrapper = require('./scrapper')
const mode = process.argv.slice(2)[0]
let handler = {
    get(target, propKey, receiver) {
        const origMethod = target[propKey]
        if(typeof origMethod === 'function'){
            return function (...args) {
                let result = origMethod.apply(this, args);
                return result;
            };
        }
        return origMethod
    },
    set (target, key, value) {
        return true
    }
};

const factoryProxy = {
     init(url, mongodbIntance, webSiteId){
        const instance = new Proxy(new Scrapper(url, mongodbIntance, webSiteId), handler)
        return instance
        
    }
}

module.exports = factoryProxy