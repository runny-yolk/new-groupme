const express = require('express');

const ready = require('./raf.js');

var router = express.Router();


var groups = {};
var messages = {};


router.use((req, res, next) => {
    logit('API CALL: ', req.method, req.path);
    next('route');
});

router.get('/poll', (req, res, next) => {
    var groupids = [];

    for(var id in groups){
        groupids.push(id);
    }

    groupids.push('newgroup');


    var handlerids = ready.aim(groupids, (eName) => {
        if(eName === 'newgroup'){
            res.status(200).json([eName, groups]);
        } else {
            res.status(200).json([eName, messages[eName]]);
        }

        ready.clear(handlerids);
    });

    setTimeout(() => {
        res.status(460).send();
        ready.clear(handlerids);
    }, 32000);
});


router.get('/groups', (req, res, next) => {
    res.json(groups)
});
router.post('/groups', (req, res, next) => {

    if(!req.body.name){
        res.status(400).json({error:'Group name not present'});
        return;
    }
    
    var newGroup = {
        name: req.body.name,
        img: (req.body.img || '/img/placeholder.bmp'),
        created: Date.now(),
        lastUpdate: Date.now(),
        id: Math.random().toString(36).slice(2)+Math.random().toString(36).slice(2)
    };

    groups[newGroup.id] = newGroup;
    messages[newGroup.id] = [];

    res.status(200).json([newGroup, groups]);
    ready.fire('newgroup');
});


router.get('/mess/:groupid', (req, res, next) => {
    if(req.params.groupid === 'all'){
        res.status(200).json(messages);
        return;
    }
    if(messages[req.params.groupid]) res.status(200).json(messages[req.params.groupid].slice(0, 100));
    else res.status(400).json({error: 'No messages in this group, or group non-existent'})
});
router.post('/mess/:groupid', (req, res, next) => {
    var id = req.params.groupid;

    var newMsg = {
        name: req.body.name,
        text: req.body.text,
        color: req.body.color,
        img: (req.body.img || '/img/placeholder.bmp'),
        uid: req.body.uid,
        created: Date.now(),
        id: Math.random().toString(36).slice(2)+Math.random().toString(36).slice(2),
    };

    if(groups[id]) {
        if(!messages[id]) messages[id] = [];
        messages[id].unshift(newMsg);
    }
    else {
        res.status(400).json({error: 'Group ID is incorrect or non-existent'});
        return;
    }

    groups[id].lastUpdate = Date.now();
    groups[id].lastmsg = newMsg;

    res.status(200).json([newMsg, messages[id].slice(0, 100)]);
    ready.fire(id);
});


module.exports = router;