'use strict';
var app = require('../../server/server');
var hotels;

module.exports = function(Customer) {
    Customer.validatesUniquenessOf('email',{message:"exist"})
    const ObjectId = require('mongodb').ObjectId;
  
    
    Customer.testRecommendation=async (cb)=>{

        var hotelPipeLine=[

            {
                $match: { custId: ObjectId("5e143810ad4cda1330e76b7d") } 
            },
            // {
            //     $group: {_id: null, uniqueValues: {$addToSet: "$hotelId"}}
            // },
            {
                '$project': {   'hotelId':"$hotelId",
                                '_id':false
                            }
            }
        ]


        var bookingCollection = app.models.Booking.getDataSource().connector.collection(app.models.Booking.modelName)

        var cursor = bookingCollection.aggregate(hotelPipeLine)
                        .map((arr)=>{
                            return arr.hotelId.toString()
                        })
        hotels=await cursor.get()    
        hotels=[...new Set(hotels)]

        hotels=hotels
                    .map((element)=>{
                        
                        return ObjectId(element)
                    })

        console.log(hotels)

        var featureExtractPipeline=[
                {   
                    "$match": { 
                        "_id": { 
                            "$in": hotels 
                        } 
                    }
                },
                {
                    "$project":{
                        "features":"$featureIds",
                        '_id':false
                    }
                }     
        ]
        
        var hotelCollection = app.models.Hotel.getDataSource().connector.collection(app.models.Hotel.modelName)
        var cursor = hotelCollection.aggregate(featureExtractPipeline)
                    .map((arr)=>{
                        arr=arr.features.map((feature)=>{
                            return feature
                        })
                        return arr
                    })
        var features=await cursor.get()   
        features=features.toString().split(',')

          

        features=Array.from(new Set(features))

        features=features
                    .map((element)=>{
                        return ObjectId(element)
                    })
        console.log(features)



        var hotelExtractPipeline=[
            {   
                "$match": { 
                    "featureIds": { 
                        "$in": features 
                    } 
                }
            }    
        ]
        var hotelCollection = app.models.Hotel.getDataSource().connector.collection(app.models.Hotel.modelName)
        var cursor = hotelCollection.aggregate(hotelExtractPipeline)
        var hotels=await cursor.get()   
        console.log(hotels)

    }

    Customer.remoteMethod('testRecommendation',{
    accepts: [
    ],
    returns: {arg:'data',type: 'object',root:true},
    http: {path: '/recommendation', verb: 'get'}
    })
    
      

    


};
