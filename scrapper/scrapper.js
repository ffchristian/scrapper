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
    start(query = {}, webSiteId = 1) {
        return new Promise ((res, rej) => {
           try {
            let test = `new osmosis(this.url)`
            osmosis.get( this.url )
            Object.entries(query).forEach(([key, value]) =>{
                test += `.${key}(${JSON.stringify(value)})`
            })
            const instance = eval(test)
            instance.data(async (listing) => {
                try{
                const data =  this.entityBuilder(listing, webSiteId)
                
                this.mongodbIntance.store('content', data, true)
                return res({success: true, data: data })
                }catch(e) {
                    console.log(`error scrapper.start ${e}`)
                    // throw e
                    console.log(e)
                    rej(e)
                }
            })
            .log(console.log)
            .error((e => {
                console.log(`error scrapper.start ${e}`)
                // throw new Error(e)
            }))
            .debug(console.log)

            instance.run(query);
           } catch (e) {
               console.log(e)
           }
        })
    }
    entityBuilder(obj, webSiteId){
       try {
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
       } catch(e){

       }
    }
}

module.exports = Scrapper