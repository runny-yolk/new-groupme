module.exports = function(){

    if(arguments[2]){
        var types = arguments[0],
            schema = arguments[1],
            data = arguments[2]
    } else {
        var schema = arguments[0],
            data = arguments[1],
            types = []
    }

    return data.map(function(dataItem, d){
        var newobj = {};

        for (var i = 0; i < schema.length; i++) {

            if(types[i] && typeof dataItem[i] !== types[i]) throw new TypeError('Data type must be '+types[i]+' for key '+schema[i]+' at position '+d+' in data array');

            newobj[schema[i]] = dataItem[i];
        }

        return newobj;
    });

}