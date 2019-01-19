const siteTypes = {
    rankingPage: 'RANKING_PAGE',
    clasificationPages: 'CLASI_PAGE'
}

export default {

    globalTV: {
        url: 'https://www.globaltv.com/shows/',
        siteType: siteTypes.rankingPage,
        selectorQuery: {
            set: {
                "pictures":["section.allShows .row figure > a > img@src"],
                "titles": ["section.allShows .row article.allShows-show  > h3"]
            },
            // paginate: '#mediumPriorityZone > section > div > ul > li:nth-child(3) > a',

        },
    },

    rottenTomatoesTVList1: {
        url: 'https://www.rottentomatoes.com/browse/tv-list-1/',
        siteType: siteTypes.rankingPage,
        selectorQuery: {
            // find: '#tvSidebar > div > div > a',
            // follow: '#tvSidebar > div > div > a@href',
            set: {
                pictures: ["div .mb-movies .poster_container > a > img@src"],
                titles: ["body_main.container .main-row .mb-movie .movie_info a > .movieTitle"],
            }

        },
    },

    pelispediaTVSeriesAll: {
        url: 'https://www.pelispedia.tv/series/all/',
        siteType: siteTypes.rankingPage,
        selectorQuery: {
            // find: ' section > div > section > ul > li > a',
            follow: 'section > div > section > ul > li > a@href',
            set: {
                pictures: ["div > div > article > div > figure > img@src"],
                titles: ["#headerHero > header > div.container > h1"],
                anno: ["#headerHero > header > div > div > span:nth-child(2)"],
                director: ["#headerHero > header > div > div> span:nth-child(6)"],
                genero: ["#headerHero > header > div > div > span:nth-child(10)"],
                pais: ["#headerHero > header > div > div > span:nth-child(14)"],
                sinopsis: ["#headerHero > header > div > div > span:nth-child(18)"],
                reparto: ["#headerHero > header > div > div > span:nth-child(22)"]
            },
            paginate: '#series > div > ul > li > a@href',
        },
    },
}