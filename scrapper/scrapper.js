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
          
            let test = `new osmosis(this.url)`;
           if( typeof this.url === 'object') {
            osmosis.get( this.url.url, this.url.page )
           } else {
            osmosis.get( this.url )
           }
           if(query.length > 0 ) {
            query.forEach( query => {
                Object.entries(query).forEach(([key, value]) =>{
                    try {
                        if(value.indexOf('x%') > -1) {
                            value = value.replace(new RegExp('x%', 'g'), '{').replace(new RegExp('%x', 'g'), '}')
                            console.log('--here--')
                            console.log(value)
                            console.log(JSON.stringify(value))
                        } else {
                            value = JSON.stringify(value)
                        }
                       
                    }catch (e) {
                        value = JSON.stringify(value)
                    }                    
                    test += `.${key}(${value})`
                })
            })
           } else {
            Object.entries(query).forEach(([key, value]) =>{
                try {
                    if(value.indexOf('x%') > -1) {
                        value = value.replace(new RegExp('x%', 'g'), '{').replace(new RegExp('%x', 'g'), '}')
                        console.log('--here--')
                        console.log(value)
                        console.log(JSON.stringify(value))
                    } else {
                        value = JSON.stringify(value)
                    }
                   
                }catch (e) {
                    value = JSON.stringify(value)
                }           
                test += `.${key}(${value})`
            })
           }
            // return console.log('h--455', test);
            const instance = eval(test)
            instance.data(async (listing) => {
                try{
                const data =  this.entityBuilder(listing, webSiteId)
                console.log(data, '1?????')
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
        console.log(obj,'!!!11')
        if(!(obj.titles && obj.pictures && obj.titles.length === obj.pictures.length)) {
            throw new Error(`inconsistent response  titles ${obj.titles.length}, imgs ${obj.pictures.length}`)
        }
        let result = []
       
        for(let i = 0, len = obj.titles.length; i < obj.titles.length; i++){

            result.push(
                { title: obj.titles[i], picture: obj.pictures[i], webSiteId, pos: obj.pos? obj.pos[i]:null}
            )
        }
        return result
       } catch(e){
        console.log (e)
       }
    }
}

module.exports = Scrapper