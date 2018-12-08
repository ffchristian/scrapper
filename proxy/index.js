const mode = process.argv.slice(2)[0]
function invariant (target, key, action) {
    if (key[0] === '_') {
    //   throw new Error(`Invalid attempt to ${action} private "${key}" property`)
        console.log((`Invalid attempt to ${action} private "${key}" property`));
        delete target[key]
    }
  }
let logger = (key, args, target, result) => {
    console.log(`\n-------DATA TO DEBUG (${key}) BELOW---------`)
    console.log(`Indentifier: Call \n<<--Method \n${key}\nMethod-->>\n<<--Args \n${JSON.stringify(args)}\nArgs-->>\n<<--Object \n${JSON.stringify(target)}\nObject-->>`)
    console.log(`>>resul:\n ${JSON.stringify(result)}`)
    console.log(`-------DATA TO DEBUG (${key}) ABOVE--------- \n`)
}
let handler = {
    get(target, key, receiver) {
        invariant(target,key, 'get')
        const origMethod = target[key]
        if(typeof origMethod === 'function'){
            return function (...args) {
                let result = origMethod.apply(this, args);
                if( mode === 'dev' && result instanceof Promise){
                    result.then((result) => {
                        logger(key, args, target, result)
                    });
                } else if( mode === 'dev') {
                    logger(key, args, target, result)
                }
                return result;
            };
        }
        if( mode === 'dev'){
            console.log('\n-------DATA TO DEBUG BELOW---------')
            console.log(`Indentifier: Call \n<<--Attr \n${key}\nAttr-->>\n<<--Object \n${JSON.stringify(target)}\nObject-->>`)
            console.log('-------DATA TO DEBUG ABOVE--------- \n')
            // return  true
        }
        return origMethod
    },
    set (target, key, value) {
        invariant(target, key, 'set')
        if(target[key] === undefined) {
            throw new Error(`Invalid attempt to set not initialized "${key}" property`)
            return true
        }
        target[key] = value
        return true
    }
};

const factoryProxy = function init(target){
    return new Proxy(target, handler)
 
}

module.exports = factoryProxy