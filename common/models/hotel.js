'use strict';

module.exports = function(Hotel) {

    Hotel.validatesUniquenessOf('name',{message:"exist"})
    

    Hotel.findHotelById =(id)=>{
        
        return Hotel.findOne({where:{id}})
        .then(e=>{
            if(e==null) {throw new Error("Hotel not found")}
            else return e

        })
    }

    Hotel.findIfFeatureExist= (id)=>{

        return app.models.Feature.findOne({where:{id}})
        .then(e=>{
            if(e==null) {throw new Error("Feature not found")}
            else return e

        })

        
    }


    
    

    Hotel.findFeatureById=async (hid,fid,cb)=>{
        try {
            var hotelNode=await Hotel.findHotelById(hid)  //Hotel should exist
            var featureNode=await Hotel.findIfFeatureExist(fid)  //Feature should exist
            hotelNode.features.push(fid)
            hotelNode.features= [...new Set(hotelNode.features)]
            hotelNode.save()
            
            return hotelNode

        } catch (error) {
            return error
        }

    }
    // Hotel.remoteMethod('findFeatureById',{
    //     accepts: [
    //         {arg: 'id', type: 'string',required:true},
    //         {arg: 'fid', type: 'string',required:true}
    //     ],
    //     returns: {arg:'data',type: 'object',root:true},
    //     http: {path: '/:id/addFeature/:fid', verb: 'put'}
    // })


};
