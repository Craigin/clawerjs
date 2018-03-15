/**
 * Created by paki on 2017/12/20.
 */
module.exports=function() {
    var add0 = function (m) {
        return m < 10 ? '0' + m : m
    };
    var fs = require('fs');
    var path = require('path');
    return {
        makedir: function (dirpath, callback) {
            if (fs.existsSync(dirpath)) {
            } else {
                fs.mkdirSync(dirpath);
            }
            if (typeof callback == 'function') {
                callback();
            }
        },
    }
}
