var forObj = function(obj, callback){
    var returnArr = [];

    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            var element = obj[key];
            returnArr.push( callback(element, key) );
        }
    }

    return returnArr;
}

module.exports = {
    handlers: {},
    aim: function(eventNames, handlers, once){
        if(typeof eventNames === 'string') eventNames = [eventNames];

        if( !Array.isArray(eventNames) ) throw new typeError('aim: eventNames must be an array or string');
        if( Array.isArray(handlers) && handlers.length !== eventNames.length) throw new Error('aim: handlers and eventnames must have equal length if handlers is an array');

        var handlerids = [];

        eventNames.forEach((eName, i) => {            
            if(!this.handlers[eName]) this.handlers[eName] = {};

            var handlerid = Math.random().toString(36).slice(2)+Math.random().toString(36).slice(2);

            if( Array.isArray(handlers) ) this.handlers[eName][handlerid] = handlers[i];
            else this.handlers[eName][handlerid] = handlers;

            if(once) this.handlers[eName][handlerid].once = true;

            handlerids.push( {eName, handlerid} );
        });

        return handlerids;
    },
    fire: function(eventNames){
        if(typeof eventNames === 'string') eventNames = [eventNames];

        if( !Array.isArray(eventNames) ) throw new typeError('fire: eventNames must be an array or string');

        var cbargs = Array.prototype.slice.call(arguments, 1);

        eventNames.forEach((eName, i) => {
            forObj(this.handlers[eName], (handler, handlerid) => {
                cbargs.unshift(eName);

                handler.apply(handler, cbargs);
                if(handler.once) delete this.handlers[eName][handlerid];
            });
        });
    },
    clear: function(handlerids){
        if( !Array.isArray(handlerids) ) throw new typeError('clear: handlerids must be an array');

        handlerids.forEach(x => {
            delete this.handlers[x.eName][x.handlerid];
        });
    }
};