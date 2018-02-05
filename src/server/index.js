// index.js
'use strict';
import Express from 'express';

const isProd = process.env.NODE_ENV === 'production';
const WEB_PORT = process.env.PORT || 3000;
const expressStaticRoutes = [
    {path: '/img/', serverPath: '/../client/img'},
    {path: '/css/', serverPath: '/../client/css'},
    {path: '/js/', serverPath: '/../client/js'},
];
const renderApp = `
    <!doctype html>
    <html>
        <head>
            <meta name="viewport" content="width=device-width">
            <meta name="viewport" content="initial-scale=1.0">
            <title>pb+會員-點數好運抽</title>

            ${isProd ? '<link rel="stylesheet" href="/css/main.css"/>' : ''}
            <!-- Global site tag (gtag.js) - Google Analytics -->
            <script async src="https://www.googletagmanager.com/gtag/js?id=UA-69658178-9"></script>
            <script>
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());

                gtag('config', 'UA-69658178-9');
            </script>
        </head>
        <body style="background-color: black;">
            <div id="app-root"></div>
            <script type='text/javascript' src="${isProd ? `/js/bundle.js` : `http://localhost:7000/js/bundle.js`}" ></script>
        </body>
    </html>
`;
const app = Express();

app.get('/', (req, res) => { res.send(renderApp); })
app.get('/:action', (req, res) => { res.send(renderApp); })
expressStaticRoutes.forEach(function(route) {
    app.use(route.path, Express.static(__dirname + route.serverPath));
});
app.listen(WEB_PORT);
