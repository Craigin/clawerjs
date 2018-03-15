/**
 * Created by paki on 2017/12/20.
 */
var Crawler = require("crawler");
var fs = require('fs');
var common = require('../libs/common')();
var path = require('path');
var http = require('../libs/http');
var asy = require('async');
var Once = function(target_url,callback){
    http.checkExist(target_url,function(ret){
        if(ret.success){
            var c = new Crawler({
                jQuery: true,
                maxConnections : 100,
                // forceUTF8:true,
                // incomingEncoding: 'gb2312',
                // This will be called for each crawled page
                callback : async  (error, res)=> {
                    if(error)return callback({success:true});
                    console.log(typeof res.$);
                    var imgs = res.$('img');
                    var videos = res.$('video');
                    var down_list = [];
                    imgs=Array.prototype.slice.call(imgs);
                    if(imgs.length){
                        imgs.forEach(function(e,i){
                            if(e.attribs['data-img'])down_list.push(e.attribs['data-img']);
                            if(e.attribs['src']&&e.attribs['src'].indexOf('http')>=0&&down_list.indexOf(e.attribs['src'])<0)down_list.push(e.attribs['src']);
                        })
                    }
                    videos = Array.prototype.slice.call(videos);
                    if(videos.length){
                        videos.forEach(function(e,i){
                            if(e.attribs['src']&&e.attribs['src'].indexOf('http')>=0&&down_list.indexOf(e.attribs['src'])<0)down_list.push(e.attribs['src']);
                        })
                    }
                    var target_dir = path.join(__dirname,'../data/'+target_url.replace('http://','').replace('/','-'));
                    common.makedir(target_dir);
                    await Promise.all(down_list.map(async function(source,i) {
                        var target_path = '';
                        if(path.extname(source).slice(1).toLowerCase()=='mp4'){
                            target_path = target_dir+'/'+i+'.mp4';
                        }else{
                            target_path = target_dir+'/'+i+'.jpg';
                        }
                        await http.downloadCo(source,target_path);
                    }));
                    callback({success:true})
                }
            });
            c.queue(target_url);
        }else{
            callback({success:true})
        }
    })

}
var handleList = function(list,callback){
    if(!list instanceof Array||!list.length)return callback({success:false,msg:"list not right"});
    var task_list = [];
    var task_len = list.length;
    list.forEach(function(e,i){
        task_list.push(function(cb){
            console.log('==========left task:',task_len-i);
            Once(e,function(ret){
                if(!ret.success)return cb({message:ret.msg});
                cb();
            })
        })
    })
    asy.series(task_list,function(err,ret){
        if(err)return callback({success:false,msg:err.message});
        console.log('==========handleList success');
        callback({success:true});
    })

}
module.exports={handleList:handleList};
