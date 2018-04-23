var parseCSSprops = function(cssObj){
    var cssString = '';

    for (var key in cssObj) {
        if (cssObj.hasOwnProperty(key)) {

            var value = cssObj[key],
            def;

            if(typeof value === 'object'){
                def = value.def;
                if(typeof def !== 'string') throw new TypeError('default value should be string');
                value = value.real
            }

            if(typeof value === 'function'){
                value = value();
            }

            if(typeof value === 'number'){
                if(/zIndex|lineHeight/.test(key)) value = value.toString(10);
                else value = value.toString(10)+'px';
            } else if(typeof value !== 'string') throw new TypeError('CSS properties must be strings or numbers');

            var propname = key.replace(/[A-Z]/g, function(match){
                return '-'+match.toLowerCase();
            });

            if(def) cssString += propname+':'+def+';';
            cssString += propname+':'+value+';';
        }
    }

    return cssString;
}
var parseCSSsheet = function(sheetObj){
    var sheetString = '';

    for (var selector in sheetObj) {
        if (sheetObj.hasOwnProperty(selector)) {
            var cssObj = sheetObj[selector];
            
            sheetString += selector+'{'+parseCSSprops(cssObj)+'}';
        }
    }

    return sheetString;
}
var dynamicCSSapply = function(sheetObj){
    if(!document.getElementById('dynamicCSS')){
        var style = document.createElement('style');
        style.setAttribute('id', 'dynamicCSS');
        document.getElementsByTagName('head')[0].appendChild(style);
    }

    document.getElementById('dynamicCSS').innerText = parseCSSsheet(sheetObj);
}

window.CS$ = {
    headerH: 50,
    accent: '#0A9191',
    userPic: 55
}

var stylesheet = {
    '#header': {
        width: '100%',
        height: ()=>CS$.headerH,
        position: 'fixed',
        top: 0,
        background: ()=>CS$.accent,
        zIndex: 100,
        overflow: 'hidden',
        boxShadow: '0 0 7px 0px rgba(0,0,0,0.8)',
        transition: '0.3s'
    },
    '#backBtn, #groupName': {
        display: 'block', float:'left'
    },
    '#backBtn':{
        height: 36, margin: 7
    },
    '#groupName': {
        fontSize: 20,
        marginTop: 13
    },
    '#header input': {
        display: 'block',
        fontSize: 20,
        clear: 'both',
        lineHeight: 1.3,
        background: 'transparent',
        borderBottom: '1px solid rgba(255,255,255,0)',
        transition: '0.3s',
        width: ()=>innerWidth-132,
        maxWidth: 300,
        margin: 11
    },
    '#header input:focus': {
        borderBottom: '1px solid white'
    },
    '#header button': {
        fontSize: 16,
        lineHeight: 1.2,
        background: 'transparent',
        padding: '5px 6px 7px 6px',
        border: '1px solid white',
        fontSize: 15,
        borderRadius: 6,
        position: 'absolute',
        right: 7,
        top: 9
    },
    '.mainList': {
        paddingTop: CS$.headerH,
        position: 'absolute',
        width: '100%',
        height: '100%',
        overflow: 'auto',
        transition: '0.5s'
    },
    '#groups': {
        background: '#222',
        left: () => (store.activeGroup ? 0-innerWidth : 0)
    },
    '.groupCont': {
        overflow: 'hidden',
        width: '100%',
        marginTop: 15
    },
    '.groupImage': {
        height: 80,
        width: 80,
        float: 'left',
        backgroundSize: 'cover',
        backgroundRepeat: 'none',
        backgroundPosition: 'center'
    },
    '.groupName':{
        margin: 9,
        marginTop: 4,
        float: 'left',
        fontSize: 22,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        lineHeight: 1.3,
        width: ()=> innerWidth-98
    },
    '.lastMsg': {
        margin: '0 9px',
        width:()=>innerWidth-98,
        height: 35,
        float: 'left',
        overflow: 'hidden',
        fontSize: 15,
        lineHeight: 1.1
    },
    '.lastMsg span': {
        fontWeight: 'bold'
    },
    '#groupFormBtn': {
        position: 'fixed',
        right: '10%',
        bottom: '8%',
        width: 90,
        height: 90,
        background: ()=>CS$.accent,
        borderRadius: '100%',
        boxShadow: '0 0 5px 0 black',
        cursor: 'pointer'
    },
    '#groupFormBtn img': {
        height: 42,
        margin: '24px 22px',
        display: 'block'
    },
    '#addGroupOverlay':{
        position: 'fixed',
        top: 0,
        left: 0,
        display: 'none',
        width: '100%',
        height: '100%',
        zIndex: 200,
        background: 'rgba(0,0,0,0.7)',
        boxShadow: '0 0 330px 0px black inset',
        textAlign: 'center'
    },
    '#addGroupBox': {
        display: 'inline-block',
        margin: 'auto',
        marginTop: '40%',
    },
    '#addGroupBox .close': {
        fontSize: 26,
        float: 'right',
        clear: 'both',
        margin: 5,
        marginBottom: 10,
        cursor: 'pointer'
    },
    '#addGroupBox input': {
        display: 'block',
        padding: '4px 10px',
        fontSize: 20,
        clear: 'both',
        margin: 20,
        lineHeight: 1.3,
        background: 'transparent',
        borderBottom: '1px solid #c7c7c7',
        transition: '0.2s'
    },
    '#addGroupBox input:focus': {
        borderBottom: '1px solid white'
    },
    '#addGroupBox button': {
        background: 'transparent',
        padding: 11,
        color: 'white',
        border: '1px solid white',
        fontSize: 15,
        borderRadius: 6,
        paddingTop: 9
    },
    '#messages': {
        background: '#222',
        overflow: 'hidden',
        right: () => (!store.activeGroup ? 0-innerWidth : 0)
    },
    '#messCont': {
        width: '100%',
        overflow: 'auto',
        fontSize: '20px',
        height: () => ( innerHeight-(CS$.headerH+CS$.inputH) )
    },
    '.message': {
        overflow: 'hidden',
        paddingRight: 20,
        paddingLeft: CS$.userPic,
        marginTop: 5
    },
    '.message .name': {
        fontSize: 12,
        color: '#ddd',
        margin: 9
    },
    '.message .text': {
        fontSize: 14,
        margin: '10px 9px 8px 9px',
        lineHeight: 1.1
    },
    '.message .userpic': {
        height: CS$.userPic,
        width: CS$.userPic,
        position: 'absolute',
        top: 0, left: 0,
        backgroundSize: 'cover',
        backgroundRepeat: 'none',
        backgroundPosition: 'center'
    },
    '.message .color': {
        width: 20,
        height: '100%',
        position: 'absolute',
        top: 0, right: 0
    },
    '.message.sameUser': {
        minHeight: 'auto',
        marginTop: 0
    },
    '.message.sameUser .text': {
        marginTop: 3
    },
    '.message.sameUser .name, .message.sameUser .userpic': {
        display: 'none'
    },
    '#msgInput': {
        resize: 'none',
        height: CS$.inputH = 70,
        width: ()=>innerWidth-CS$.inputH,
        fontSize: 18,
        padding: '10px 15px',
        lineHeight: 1.2,
        background: '#272727',
        borderTop: '1px solid #333',
        display: 'inline-block',
        verticalAlign: 'top'
    },
    '#msgBtnBox': {
        width: CS$.inputH,
        height: CS$.inputH,
        overflow: 'scroll',
        display: 'inline-block',
        background: '#272727',
        borderTop: '1px solid #333'
    },
    '#msgBtnBox img': {
        height: CS$.inputH-30,
        margin: '15px auto',
        display: 'block'
    }
};

window.doCSS = dynamicCSSapply.bind(null, stylesheet);
doCSS();
window.addEventListener('resize', doCSS);