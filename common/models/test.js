'use strict';

module.exports = function(Test) {


    
    // 201841183432-3330vm9j5oolbpi1agd3l572fafpnfu4.apps.googleusercontent.com
    // hw52nl5Bx4r6Xny38CCuTUXJ



    Test.sendEmail=async (options)=>{
        var mail=Test.app.models.Email
        
        var test={ to: 'jagzmz@gmail.com',
        from: 'jaganiya.mahesh@gmail.com',
        subject: 'Hii',
        text: 'hello' }
      
        // console.log(options)
        // console.log(test)
        // console.log(JSON.stringify(options)===JSON.stringify(test))

        mail.send(options,(err,res)=>{
            // console.log(err)
            console.log(res)
        }
      )

        return 
    }

    Test.remoteMethod('sendEmail',{
        accepts: [
            {
                arg: 'options',
                type: 'object',
                // default: {"id": "file","userId": "string","user": {},"totalScore": 0,"tags": []},
                http: {
                    source: 'body'
                },
                required:true
            }
            
        ],
        returns: {arg:'data',type: 'object',root:true},
        // http: {path: '/sendEmail', verb: 'post',source:'body'}
    })

};
