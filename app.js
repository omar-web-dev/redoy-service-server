const express = require("express");
const app = express();
const cors = require("cors");
const port = 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

app.use(express.json());
app.use(cors());

const DB_USER = "ridoy";
const DB_PASSWORD = "iJIbZ834fptQy1Ms";

const uri = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0.uadalh8.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const run = async () => {
  try {
    const userCollection = client.db("ridoy").collection("users");
    const reviewsCollection = client.db("ridoy").collection("reviews");
    const portfolioCollection = client.db("ridoy").collection("portfolio");
    await client.connect();

    app.get("/users", async (req, res) => {
      const query = {};
      const users = await userCollection.find(query).toArray();
      res.send(users);
    });

    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await userCollection.insertOne(user);
      res.send(result);
    });

    app.post("/reviews", async (req, res) => {
      const review = req.body;
      const result = await reviewsCollection.insertOne(review);
      res.send(result);
    });

    app.delete("/reviews-delete/:id", async (req, res) => {
      const id = req.params.id;
      const result = await reviewsCollection.deleteOne({ _id: new ObjectId(id) });
      if (result.deletedCount > 0) {
        res.json({ deletedCount: result.deletedCount });
      } else {
        res.status(404).json({ message: 'Document not found' });
      }
    });
    

    app.get("/portfolio", async (req, res) => {
      const query = {};
      const users = await portfolioCollection.find(query).toArray();
      res.send(users);
    });

    
    app.post("/portfolio", async (req, res) => {
      const portfolio = req.body;
      const result = await portfolioCollection.insertOne(portfolio);
      res.send(result);
    });

    app.get("/reviews", async (req, res) => {
      const query = {};
      const users = await reviewsCollection.find(query).toArray();
      res.send(users);
    });

    //find user email

    app.get("/users/:email", async (req, res) => {
      const userEmail = req.params.email;
      const user = await userCollection.findOne({ email: userEmail });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    });

    // find user by id
    app.get("/user/:id", async (req, res) => {
      const userId = req.params.id;
      const user = await userCollection.findOne({ _id: new ObjectId(userId) });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    });

    console.log("Connected to Database");
  } finally {
  }
};

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Ridoy Server running");
});
app.listen(port, () =>
  console.log(`Listening on port http://localhost:${port}`)
);
