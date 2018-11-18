const Mongo = require('./mongodb')
const Scrapper = require('./scrapper')
const siteTypes = {
    rankingpage: 'RANKING_PAGE'
}
var Argvs = process.argv.slice(2);
if( Argvs[0] === 'dev') console.log('Dev mode, in this mode no data will be stored to the BD')

async function performScrappAction(url, siteType, selectorQuery, top) {
    try{
        const mongoInstance =  await Mongo.init(null, null, Argvs[0])
        const site = await mongoInstance.store('WebSite', {url, siteType, selectorQuery, top})
        const scrapper = new Scrapper(url, mongoInstance, site._id, Argvs[0])
        await scrapper.start(selectorQuery, site._id)
    }catch(e){
        console.error(`error performScrappAction ${e}`)
    }
  
    
}


const sites = [
    // {
    //     url: 'https://www.globaltv.com/shows/',
    //     siteType: siteTypes.rankingpage,
    //     selectorQuery: {
    //         set: {
    //             "pictures":["section.allShows .row figure > a > img@src"],
    //             "titles": ["section.allShows .row article.allShows-show  > h3"] 
    //         },
    //         // paginate: '#mediumPriorityZone > section > div > ul > li:nth-child(3) > a',
            
    //     },
    // },
    // {
    //     url: 'https://www.rottentomatoes.com/browse/tv-list-1/',
    //     siteType: siteTypes.rankingpage,
    //     selectorQuery: {
    //         // find: '#tvSidebar > div > div > a',
    //         // follow: '#tvSidebar > div > div > a@href',
    //         set: {
    //             pictures: ["div .mb-movies .poster_container > a > img@src"],
    //             titles: ["body_main.container .main-row .mb-movie .movie_info a > .movieTitle"],
    //         }
            
    //     },
    // },
    {
        url: 'https://www.ign.com/lists/top-100-tv-shows/91',
        siteType: siteTypes.rankingpage,
        selectorQuery: {
            set: {
                pictures: ["body div.item-image-container > img@data-original"],
                titles: ["#list-nav-panel  a > span.list-item-heading"],
                pos: ["#list-nav-panel  a > span.list-item-rank"]
            }
            
        },
    }
]
sites.forEach( site =>{
    performScrappAction(site.url, site.siteType, site.selectorQuery, site.top)

})