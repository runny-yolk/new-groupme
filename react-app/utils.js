// Global state store
window.store = {};

window.storeSend = function(value, pos){

    if(value === undefined && typeof pos === 'string' && pos){
        delete window.store[pos];
        if(window.updatePage) window.updatePage();
        return;
    }

    if(typeof value === 'object' && !pos){
        for (var key in value) {
            if (value.hasOwnProperty(key)) {
                if (value[key] === undefined) delete window.store[key];
                else window.store[key] = value[key];
            }
        }
        if(window.updatePage) window.updatePage();
        return;
    }
    
    if(typeof pos === 'string' && pos){
        window.store[pos] = value;
        if(window.updatePage) window.updatePage();
        return;
    }

    console.error(new TypeError('storeSend: You can supply an object value with no pos, or a non-empty pos string with any value.'));
}


// Easy request API, no promises
window.ereq = function(url, opts){
    if(!opts.method) opts.method = 'GET';
    if(!opts.body) opts.body = null;
    if(!opts.user) opts.user = '';
    if(!opts.pass) opts.pass = '';
    
    var req = new XMLHttpRequest();
    
    req.timeout = (opts.timeout || 0);

    if(opts.onabort) req.addEventListener("abort", function(){
        opts.onabort(this);
    });
    if(opts.ontimeout) req.addEventListener("timeout", function(){
        opts.ontimeout(this);
    });
    
    req.addEventListener("load", function(){
        var data = this.responseText;

        try {var json = JSON.parse(data); data = json;}
        catch(err){console.log(data); console.error(err);}

        if(opts.onload) opts.onload(data, this);
    });

    req.addEventListener("error", function(err){
        console.error(err);
        if(opts.onerror) opts.onerror(err, this);
    });

    req.open(opts.method, url, true, opts.user, opts.pass);

    if(opts.headers && typeof opts.headers === 'object'){
        for (var key in opts.headers) {
            if (opts.headers.hasOwnProperty(key)) {
                var item = opts.headers[key];
                if(typeof item !== 'string') console.error(new TypeError('Header values must be strings, '+key+' is not'));
                req.setRequestHeader(key, item);
            }
        }
    } else if(opts.headers && typeof opts.headers !== 'object') console.error(new TypeError('opts.headers must be an object'));

    if(opts.body && typeof opts.body === 'object'){
        try{
            var body = JSON.stringify(opts.body);
            opts.body = body;
        } catch(err){
            console.error(err);
        }
    }

    req.send(opts.body);

    console.log('ereq', opts.method, url);

    return req;
}


// Easy request API, with a promise
window.preq = function(url, opts){
    return new Promise(function(resolve, reject){
        opts.onload = function(){ resolve(this) };

        opts.onabort = function(){ reject(this) };
        opts.onerror = function(){ reject(this) };
        opts.ontimeout = function(){ reject(this) };
    })
}


// For long polling, with easy request API
window.longPoll = function(url, callback){
    ereq(url, {
        timeout: 30000,
        ontimeout: xhr => {
            logit('longpoll timeout');
            longPoll(url, callback);
        },
        onload: (data, xhr) => {
            logit('longpoll load');
            if(xhr.status === 460) {xhr.dispatchEvent(new Event('timeout')); return;}

            callback(data, xhr);
        }
    })
}


// Object iterator that's nicer than a forin
window.forObj = function(obj, callback){
    var returnArr = [];

    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            var element = obj[key];
            returnArr.push( callback(element, key, obj) );
        }
    }

    return returnArr;
}