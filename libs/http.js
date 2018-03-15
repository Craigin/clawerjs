/**
 * Created by paki on 2017/12/20.
 */
var request=require('request');
var fs = require('fs');
var checkExist=function(url,callback){
    request(
        { method: 'HEAD',
            uri:url
        }
        , function (error, response, body) {
            if(!error&&(response.statusCode == 206||response.statusCode ==200)){
                callback({success:true});
            } else {
                callback({success:false});
            }
        }
    )
};
var downloadCo = function(source,target){
    return new Promise((resolve,reject)=>{
        checkExist(source,function(ret){
          if(ret.success){
              var writeStream = fs.createWriteStream(target);
              var statuscode;
              request
                  .get(source)
                  .on('response', function(response) {
                      statuscode=response.statusCode; // 200
                  })
                  .pipe(writeStream);
              writeStream.on("finish", function () {
                  if(statuscode!='200'){
                      return resolve({success:true,message:'download  from '+source+' failed'})
                  }
                  resolve({success:true})
              });
          }else{
              resolve({success:true})
          }
        })
    })

}
module.exports={downloadCo:downloadCo,checkExist:checkExist};

