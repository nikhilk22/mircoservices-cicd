import express from 'express';
const app = express();
const PORT = process.env.PORT || 4000;


app.get('/hello', (req, res) => {
res.json({ service: 'api-node', message: 'Hello from Node API!' });
});


app.listen(PORT, () => console.log(`api-node listening on ${PORT}`));