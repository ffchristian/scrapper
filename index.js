const ProxyGobal = require('./proxy')
const Mongo = ProxyGobal(require('./mongodb').init())
const scrapperModule = require('./scrapper')
const siteTypes = {
    rankingpage: 'RANKING_PAGE',
    clasificationPages: 'CLASI_PAGE'
}
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
    // {
    //     url: 'https://www.pelispedia.tv/series/all/',
    //     siteType: siteTypes.rankingpage,
    //     selectorQuery: {
    //         // find: ' section > div > section > ul > li > a',
    //         'body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table > tbody > tr:nth-child(3) > td > table > tbody > tr > td > table > tbody > tr > td > table > tbody > tr > td:nth-child(2) > span:nth-child(9)',
    //         // follow: 'section > div > section > ul > li > a@href',
    //         follow: 'body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table > tbody > tr:nth-child(3) > td > table > tbody > tr > td > table > tbody > tr:nth-child(3) > td > table > tbody > tr > td > table > tbody > tr > td > table > tbody > tr > td > a:nth-child(1)@href',
    //         set: {
    //             pictures: ["div > div > article > div > figure > img@src"],
    //             titles: ["#headerHero > header > div.container > h1"],
    //             anno: ["#headerHero > header > div > div > span:nth-child(2)"],
    //             director: ["#headerHero > header > div > div> span:nth-child(6)"],
    //             genero: ["#headerHero > header > div > div > span:nth-child(10)"],
    //             pais: ["#headerHero > header > div > div > span:nth-child(14)"],
    //             sinopsis: ["#headerHero > header > div > div > span:nth-child(18)"],
    //             reparto: ["#headerHero > header > div > div > span:nth-child(22)"]
    //         },
    //         paginate: '#series > div > ul > li > a@href',
    //     },
    // },
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
    
    {
        url: 'http://www.repelis.net/',
        siteType: siteTypes.rankingpage,
        selectorQuery: [{
            set: {
                "titles":[" div > div.peli_txt.bgdeg8.brdr10px.bxshd2.ico_b.p_absolute.pd15px.white > div.plt_tit.bold.fs14px.mgbot10px > h2"]
            }
            // paginate: '#cn > div.bkcnpels.br1px.brdr10px.mgtop15px > ul.nav.bgdeg4.bold.brdr10px.bxshd2.clr.fs18px.lnht30px.liasbrdr10px.lstinl.pd10px.txt_cen.white > li > a@href',
            // paginate: "({ page: +1 }, 50)"
            
        }]
    }
]

sites.forEach( site =>{
    performScrappAction(site.url, site.siteType, site.selectorQuery, site.top)

})