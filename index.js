const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();

// rokibulhasanph
// uZpHqXrq9dz9XIbm

// middleware
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5001;

const uri =
  "mongodb+srv://rokibulhasanph:uZpHqXrq9dz9XIbm@cluster0.y5dgvgh.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    const userCollection = client.db("userDB").collection("users");

    // post single data endpoint
    app.post("/users", async (req, res) => {
      const user = req.body;
      console.log("user", user);
      const result = await userCollection.insertOne(user);
      console.log(result);
      res.send(result);
    });

    // delete single user
    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;
      console.log("id", id);
      const query = {
        _id: new ObjectId(id),
      };
      const result = await userCollection.deleteOne(query);
      console.log(result);
      res.send(result);
    });

    // get single data using id

    app.get("/users/:id", async (req, res) => {
      const id = req.params.id;
      console.log("id", id);
      const query = {
        _id: new ObjectId(id),
      };
      const result = await userCollection.findOne(query);
      console.log(result);
      res.send(result);
    });

    // update single user

    app.put("/users/:id", async (req, res) => {
      const id = req.params.id;
      const data = req.body;

      const filter = {
        _id: new ObjectId(id),
      };
      const options = { upsert: true };
      const updatedData = {
        $set: {
          name: data.name,
          email: data.email,
          password: data.password,
        },
      };
      const result = await userCollection.updateOne(
        filter,
        updatedData,
        options
      );
      res.send(result);
    });

    app.get("/users", async (req, res) => {
      const result = await userCollection.find().toArray();
      console.log(result);
      res.send(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Crud is running .....");
});

app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
