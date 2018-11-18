const keys = require('../config')
const MongoClient = require('mongodb').MongoClient
const assert = require('assert')

class MongoDb{
    constructor(url, dbName, mode){
        this.url = url || keys.mongoUrl
        this.dbName = dbName || keys.databases.recommendme_b1
        this.mode = mode
    }
    static async init (url, dbName, mode) {
       const instance = new MongoDb(url, dbName, mode)
        await instance.connect()
        return instance
    }
    connect(){
        return new Promise((res, rej)=>{
            if(this.mode === 'dev'){
                console.log('connect: returning a Fake_Connection')
                return res(true)
            }
            MongoClient.connect(this.url, { useNewUrlParser: true }, (err, client) => {
                if(err) return rej(err)
                console.log("Connected successfully to server")
                console.log(keys.databases.recommendme_b1)
                const db = client.db(this.dbName)
                //res({collection: db.collection(model), client})
                this.connection = {connection: db, client}
                res(this.connection)
                //client.close()
            })
        })
    }
    close(){
        this.getConnection().client.close()
        return true
    }
    getConnection(){
        return this.connection
    }
    getData(model, query = {}, project = {}, db){
        return new Promise(async (res, rej)=>{
            try{
                //console.log(db)
                if(!db){
                   db = this.getConnection()
                }
                const collection = db.connection.collection(model)
                //const client = db.client
                //let stream = collection.find({},{ instagramId: 1, followedId: 1}).hint( { $natural : 1 } ).stream()
                let stream = collection.find(query).project(project).stream()
                //let cursor = collection.find(query, project).hint( { $natural : 1 } )
                stream.count((err, count) => {
                    //let data = new Array(count)
                    let data = []
                    console.time('getDataByCursor-'+model)
                    
                    stream.on('data', (item) => {
                        data.push(item)
                    })
                    console.log('begin', count, query)
                    stream.on('end', () => {
                        console.log('----ok----')
                        console.timeEnd('getDataByCursor-'+model)
                        res(data)
                        //client.close()
                    })
                })
            }catch(ex){
                console.log(ex)
            }
             
           
          })
    }
    store(model, data = {}, many, db){
        return new Promise(async (res, rej)=>{
            try{
                if(!db){
                   db = this.getConnection()
                }
                if(this.mode === 'dev'){
                    console.log('Store: returning a Fake_ID')
                    console.log(data)
                    return res({_id: 'Fake_ID'})
                }
                const collection = db.connection.collection(model)
                const client = db.client
                const typeInsert = many? 'insertMany': 'insertOne'
              
                collection[typeInsert](data, {
                    w: 'majority',
                    wtimeout: 10000,
                    serializeFunctions: true,
                    forceServerObjectId: true
                }, (err, r) => {
                    assert.equal(null, err)
                    // assert.equal(1, r.insertedCount)
                   if(r.message) return res({_id: r.message.hashedName})

                   return res(true)
                //    this.close()
                })
    
               
                
            }catch(ex){
                console.log(ex)
                res(false)
            }
             
           
        })
    }
    update(model, query = {}, toUpdate = {}, db){
        return new Promise(async (res, rej)=>{
            try{
                if(!db){
                   db = this.getConnection()
                }
                const collection = db.connection.collection(model)
                const client = db.client
                collection.update(query, {$set: toUpdate})
    
                res(true)
                
            }catch(ex){
                console.log(ex)
                res(false)
            }
             
           
        })
    }
}

module.exports = MongoDb