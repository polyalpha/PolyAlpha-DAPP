const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());

app.get('/', function (req, res) {
	res.send('Hello World!');
});

///users/register

app.all('/users/register', function (req, res) {
	console.log(res.body);
	res.json(Object.assign({id: 1, username: res.body.username, avatar: "/i/avatars/sandy.png"}, res.body || {}));
});

app.listen(3001, function () {
	console.log('Example app listening on port 3001!');
});
