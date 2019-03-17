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
    
    // {
    //     url: 'http://www.repelis.net/',
    //     siteType: siteTypes.rankingpage,
    //     selectorQuery: [{
    //         set: {
    //             "titles":[" div > div.peli_txt.bgdeg8.brdr10px.bxshd2.ico_b.p_absolute.pd15px.white > div.plt_tit.bold.fs14px.mgbot10px > h2"]
    //         }
    //         // paginate: '#cn > div.bkcnpels.br1px.brdr10px.mgtop15px > ul.nav.bgdeg4.bold.brdr10px.bxshd2.clr.fs18px.lnht30px.liasbrdr10px.lstinl.pd10px.txt_cen.white > li > a@href',
    //         // paginate: "({ page: +1 }, 50)"
            
    //     }]
    // },
    // {
    //     url: 'https://www.imdb.com/search/keyword',
    //     siteType: siteTypes.rankingpage,
    //     selectorQuery: [{
    //         set: {
    //             "titles":[".lister.list.detail.sub-list > div.lister-list > div > div.lister-item-content > h3 > a"],
    //             "titless":["div.aux-content-widget-2.splash > span > div > div > div > div > div > div > div > div > a"]
    //         }
    //         // paginate: '#cn > div.bkcnpels.br1px.brdr10px.mgtop15px > ul.nav.bgdeg4.bold.brdr10px.bxshd2.clr.fs18px.lnht30px.liasbrdr10px.lstinl.pd10px.txt_cen.white > li > a@href',
    //         // paginate: "({ page: +1 }, 50)"
            
    //     }]
    // }
    // {
    //     url: 'http://pelisplus.co/series/',
    //     siteType: siteTypes.series,
    //     selectorQuery: {
    //         find: 'div.items-peliculas > a',
    //         follow: 'div.items-peliculas > a@href',
    //         set: {
    //             pictures: ["#cover"],
    //             titles: ["body > div.container > div.main > div > div.pelicula-info > div.pi-right > div > h1"],
    //             genre: ["body > div.container > div.main > div > div.pelicula-info > div.pi-right > div > p:nth-child(5) > span:nth-child(2)"],
    //             sinopsis: ["body > div.container > div.main > div > div.pelicula-info > div.pi-right > div > p:nth-child(6) > span.sinopsis"],
    //             year: ["body > div.container > div.main > div > div.pelicula-info > div.pi-right > div > p.info-half > span:nth-child(2)"]
    //         }
    
    //     },
    // }
    {
        url: 'https://www.repelis.net/?&page=',
        siteType: siteTypes.rankingpage,
        selectorQuery: [{
            paginate: "x% page: +1 %x, 321",
            follow: "#cn > div.bkcnpels.br1px.brdr10px.mgtop15px > ul.peliculas.clf.cntclsx4.f_left_li > li > div > div.peli_img_img > a@href",
            set: {
                'pictures': ['tr > td > div > div > img@src'],
                'titles': ['div.content.f_right > div.details.mgbot20px.p_relative > ul > li:nth-child(1)'],
                // 'anno': 'tr > td > div > div > ul > li:nth-child(3)',
                // 'gender': 'tr > td > div > div > ul > li:nth-child(2)',
                // 'synopsis': 'tr > td > div > div > p',
                // 'language': 'tr > td > div > div > ul > li:nth-child(4)',
                // 'quality': 'tr > td > div > div > ul > li:nth-child(5)',
            }
        }]
    }

]

sites.forEach( site =>{
    performScrappAction(site.url, site.siteType, site.selectorQuery, site.top)

})

// var osmosis = require('osmosis');

// osmosis
// .get('https://www.repelis.net/?&page=', { page: 1 })
// .paginate({ page: +1 }, 321)
// .follow('#cn > div.bkcnpels.br1px.brdr10px.mgtop15px > ul.peliculas.clf.cntclsx4.f_left_li > li > div > div.peli_img_img > a@href')
// .set({
// 'pictures': 'tr > td > div > div > img@src',
// 'titles': 'tr > td > div > div > ul > li',
// 'anno': 'tr > td > div > div > ul > li:nth-child(3)',
// 'gender': 'tr > td > div > div > ul > li:nth-child(2)',
// 'synopsis': 'tr > td > div > div > p',
// 'language': 'tr > td > div > div > ul > li:nth-child(4)',
// 'quality': 'tr > td > div > div > ul > li:nth-child(5)',
// })
// .data(function(listing) {
// // do something with listing data
// console.log()
// console.log("============================ RESULT ============================")
// console.log(listing)
// console.log("============================ RESULT ============================")
// console.log()
// })
// .log(console.log)
// .error(console.log)
// .debug(console.log)