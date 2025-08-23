import express from 'express';
import fetch from 'node-fetch';


const app = express();
const PORT = process.env.PORT || 3000;
const API_NODE_URL = process.env.API_NODE_URL || 'http://api-node:4000';
const API_PY_URL = process.env.API_PY_URL || 'http://api-python:5000';


app.get('/', async (req, res) => {
const [nodeRes, pyRes] = await Promise.all([
fetch(`${API_NODE_URL}/hello`).then(r => r.json()).catch(() => ({ error: true })),
fetch(`${API_PY_URL}/hello`).then(r => r.json()).catch(() => ({ error: true }))
]);


res.send(`
<html>
<head><title>Microservices Demo</title></head>
<body style="font-family: system-ui; padding: 2rem;">
<h1>Microservices Demo</h1>
<p>Node API says: <pre>${JSON.stringify(nodeRes)}</pre></p>
<p>Python API says: <pre>${JSON.stringify(pyRes)}</pre></p>
</body>
</html>
`);
});


app.listen(PORT, () => console.log(`frontend listening on ${PORT}`));