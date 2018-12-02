const Mongo = require('./mongo')
const mode = process.argv.slice(2)[0]
let handler = {
    get(target, propKey, receiver) {
        const origMethod = target[propKey]
        if(typeof origMethod === 'function'){
                return function (...args) {
                    if( mode === 'dev'){ 
                        return true
                    }
                    let result = origMethod.apply(this, args);
                    return result;
                };
        }
        return origMethod
    },
    set (target, key, value) {
        target[key] = value
        return true
    }
};

const factoryProxy = {
     init(){
        const instance = new Proxy(new Mongo(), handler)
        return instance 
    }
}

module.exports = factoryProxy