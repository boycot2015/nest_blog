const http = require('http'),
    https = require('https'),
    Q = require('q');

export const httpUtil = {
    /**
     * HOW TO Make an HTTP Call - GET
     *
     *  options for GET
     *  const optionsget = {
     *      hostname : 'api.t.sina.com.cn',
     *      path : '//provinces.json' // the rest of the url with parameters if needed
     *  };
     */
    get: function (optionsget) {
        return this.request(optionsget, 'GET', null, false);
    },
    post: function (optionspost, jsonObject) {
        return this.request(optionspost, 'POST', jsonObject, false);
    },
    /**
     * HOW TO Make an HTTPs Call - GET
     *
     *  options for GET
     *  var optionsget = {
     *      hostname : 'graph.facebook.com',
     *      path : '/youscada' // the rest of the url with parameters if needed
     *  };
     */
    secureGet: function (optionsget) {
        return this.request(optionsget, 'GET', null, true);
    },
    /**
     * HOW TO Make an HTTPs Call - POST
     *
     *  options for POST
     *  var optionspost = {
     *      hostname : 'graph.facebook.com',
     *      path : '/youscada/feed?access_token=your_api_key'
     *  };
     */
    securePost: function (optionspost, jsonObject) {
        return this.request(optionspost, 'POST', jsonObject, true);
    },
    /**
     *  var options = {
     *      hostname : 'graph.facebook.com',
     *      path : '/youscada/feed?access_token=your_api_key'
     *  }
     */
    request: function (options, method, jsonObject, isSecure) {
        if (!(options && options.hostname && options.path)) {
            throw new Error('Omit property : "hostname" or "path".');
        }

        options.method = method || 'GET';
        options.port = options.port || 80;

        if (Object.prototype.toString.call(jsonObject) === '[object Object]') {
            jsonObject = JSON.stringify(jsonObject);
            var postheaders = {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(jsonObject, 'utf8')
            };
            options.headers = postheaders;
        }

        var protocal = http;

        if (isSecure) {
            options.port = 443;
            protocal = https;
        }

        var deferred = Q.defer();
        var body = "";
        // do the POST call
        var request = protocal.request(options, function (res) {

            res.on('data', function (trunk) {
                body += trunk;
            }).on('end', function () {
                deferred.resolve(JSON.parse(body));
            }).on('errer', function (err) {
                deferred.reject(err);
            });
        });

        // write the json data
        if (options.method === 'POST') {
            request.write(jsonObject);
        }

        request.end();
        request.on('error', function (e) {
            deferred.reject(e);
        });

        return deferred.promise;
    }

};
// module.exports = restUtil;