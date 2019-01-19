const ProxyGobal = require('./proxy')
const Mongo = ProxyGobal(require('./mongodb').init())
const scrapperModule = require('./scrapper')
const scrapperSites = require('./sites')
var Argvs = process.argv.slice(2);
if( Argvs[0] === 'dev') console.log('Dev mode, in this mode no data will be stored to the BD')

async function performScrappAction(url, siteType, selectorQuery, top) {
    try{
        await Mongo.connect()
        const site = await Mongo.store('WebSite', {url, siteType, selectorQuery, top})
        const scrapper = ProxyGobal(scrapperModule.init(url, Mongo, site._id))
        await scrapper.start(selectorQuery, site._id)
    }catch(e){
        console.log(e)
        console.error(`error performScrappAction ${e}`)
    }
  
    
}

const sites = [
    scrapperSites.globalTV,
]

sites.forEach( site =>{
    performScrappAction(site.url, site.siteType, site.selectorQuery, site.top)
})