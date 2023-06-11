const express = require('express');
// Load the express library //
const app = express();
const { MongoClient } = require('mongodb');
const PORT = process.env.PORT || 8000;
const articleInfo = {
    "learn-react": {
        comments: [],
    },
    "learn-node": {
        comments: [],
    },

    "my-thoughts-on-learning-react": {
        comments: [],
    },

}
// fetch(){

// }

// Initializing middlewares
// Parses the incoming json payload 

// Comments endpoint - 

app.use(express.json({ extended: false }));

const withDB = async (operations, res) => {
    try {
        const client = await MongoClient.connect('mongodb://localhost:27017')
        const db = client.db("arts")
        await operations(db);
        client.close();
    } catch (error) {
        res.status(500).json({ message: "Error connecting ot the database", error });
    }
}
// just a test route //
app.post('/', (req, res) => res.send(`Hello ${req.body.name}🥇`));

app.get('/', (req, res) => res.send("Hello World"));

app.get('/users/:name', (req, res) => res.send(`Hello ${req.params.name}`));

app.get('/users/:id', (req, res) => res.send(`${req.params.id}`));

app.post('/api/articles/:name/add-comments', (req, res) => {
    const { userName, text } = req.body;
    const articleName = req.params.name;
    withDB(async (db) => {
        const articleInfo = await db.collection('articles').findOne({ name: articleName });
        await db.collection("articles").updateOne({ name: articleName },
            {
                $set: {
                    comments: articleInfo.comments.concat({
                        userName, text
                    }),
                },
            }
        );
        const updateArticleInfo = await db.collection("articles").findOne({name : articleName});
        res.status(200).json(updateArticleInfo);
    } , res);
});

app.get("/api/articles/:name", async (req, res) => {
    withDB(async (db) => {

        const articleName = req.params.name;
        const articleInfo = await db.collection('articles').findOne({ name: articleName });
        res.status(200).json(articleInfo);
    }, res)
});

app.listen(8000, () => console.log(`Server started at port ${PORT}`));
