global.logit = console.log;

const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const browserify = require('browserify');

const router = require('./router.js');

const port = (process.env.PORT || 3000);
const app = express();

app.set('view engine', 'pug');

app.use(bodyParser.text({
    type: () => true
}));

app.use((req, res, next) => {
    if(req.body){
        try{
            req.body = JSON.parse(req.body);
        } catch (err){}
    }
    next();
});

app.use((req, res, next) => {
    logit(req.method, req.path);
    next();
});


app.get('/scripts/bundle.js', (req, res, next) => {
    browserify("./react-app/init.js")
      .transform("babelify", {presets: ["es2015", "react"]})
      .bundle()
      .pipe(res);
});


app.use('/api', router);

app.get('/', (req, res, next) => {
    res.status(200).render('index');
});


app.use(express.static('public'));

http.createServer(app).listen(port, () => logit('ready to go, yo, on ' + port));