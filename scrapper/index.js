const osmosis = require('osmosis')


class Scrapper{
    constructor(url, mongodbIntance, webSiteId, mode) {
        this.url = url
        this.mongodbIntance = mongodbIntance
        this.webSiteId = webSiteId
        this.mode = mode
    }
    setUrl(url) {
        this.url = url
    }
    async start(query, webSiteId) {
        let test = `new osmosis(this.url)`
        osmosis.get( this.url )
        Object.entries(query).forEach(([key, value]) =>{
            if(this.mode === 'dev'){
                console.log(`Scrapper.start query: key ${key}, value ${JSON.stringify(value)}`)
            } 
            test += `.${key}(${JSON.stringify(value)})`
        })
        const instance = eval(test)
        instance.data(async (listing) => {
            try{
                if(this.mode === 'dev'){
                    Object.entries(listing).forEach(([key, value]) =>{
                        console.log(`Scrapper.start data: key ${key}, value ${JSON.stringify(value)}`)
                    })
                } 
                
            this.mongodbIntance.store('content', this.entityBuilder(listing, webSiteId), true)
          
            }catch(e) {
                console.log(`error scrapper.start ${e}`)
                // throw e
            }
        })
        .log(console.log)
        .error((e => {
            console.log(`error scrapper.start ${e}`)
            // throw new Error(e)
        }))
        .debug(console.log)

        instance.run(query);
    }
    entityBuilder(obj, webSiteId){
        if(!(obj.titles && obj.pictures && obj.titles.length === obj.pictures.length)) {
            throw new Error(`inconsistent response  titles ${obj.titles.length}, imgs ${obj.pictures.length}`)
        }
        let result = []
        for(let i = 0, len = obj.titles.length; i < obj.titles.length; i++){

            result.push(
                { title: obj.titles[i], picture: obj.pictures[i], webSiteId, pos: obj.pos[i]}
            )
        }
        return result
    }
}

module.exports = Scrapper