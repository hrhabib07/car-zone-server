const express = require("express");
const cors = require("cors");
const app = express();
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lqoy5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("carZone");
    const carsCollection = database.collection("cars");
    const ordersCollection = database.collection("orders");
    const usersCollection = database.collection("users");

    // post api
    app.post("/cars", async (req, res) => {
      const car = req.body;
      console.log(car);
      const result = await carsCollection.insertOne(car);
      res.json(result);
    });
    // post api
    app.post("/orders", async (req, res) => {
      const order = req.body;
      const result = await ordersCollection.insertOne(order);
      res.json(result);
    });

    // GET API collection
    app.get("/cars", async (req, res) => {
      const cursor = carsCollection.find({});
      const cars = await cursor.toArray();
      res.json(cars);
    });
    // GET API new car collection
    app.get("/newCars", async (req, res) => {
      const car = "new";

      const query = { condition: car };

      const cursor = carsCollection.find(query);
      const newCars = await cursor.toArray();
      res.json(newCars);
    });
    // GET API new car collection
    app.get("/oldCars", async (req, res) => {
      const car = "old";

      const query = { condition: car };

      const cursor = carsCollection.find(query);
      const newCars = await cursor.toArray();
      res.json(newCars);
    });
    // GET API single item
    app.get("/car/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await carsCollection.findOne(query);
      res.json(result);
    });
    // get orders
    app.get("/myOrders", async (req, res) => {
      const email = req.query.email;

      const query = { email: email };

      const cursor = ordersCollection.find(query);
      const orders = await cursor.toArray();
      res.json(orders);
    });

    // delete order
    app.delete("/orders/:id", async (req, res) => {
      const orderID = req.params.id;
      const query = { _id: ObjectId(orderID) };
      const result = await ordersCollection.deleteOne(query);
      res.json(result);
    });
    // delete product
    app.delete("/cars/:id", async (req, res) => {
      const orderID = req.params.id;
      const query = { _id: ObjectId(orderID) };
      const result = await carsCollection.deleteOne(query);
      res.json(result);
    });
    // post users data on the database
    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      console.log(result);
      res.json(result);
    });
    // put user on the database
    app.put("/users", async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const options = { upsert: true };
      const updateDoc = { $set: user };
      const result = await usersCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.json(result);
    });

    // check if the user is admin or not
    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await usersCollection.findOne(query);
      let isAdmin = false;
      if (user?.role === "admin") {
        isAdmin = true;
      }
      res.json({ admin: isAdmin });
      // console.log(isAdmin);
    });
    // make admin
    app.put("/users/admin", async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const updateDoc = { $set: { role: "admin" } };
      const result = await usersCollection.updateOne(filter, updateDoc);
      res.json(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

/* 

app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            let isAdmin = false;
            if (user?.role === 'admin') {
                isAdmin = true;
            }
            res.json({ admin: isAdmin });
        })

        
        app.put('/users/admin', verifyToken, async (req, res) => {
            const user = req.body;
            const requester = req.decodedEmail;
            if (requester) {
                const requesterAccount = await usersCollection.findOne({ email: requester });
                if (requesterAccount.role === 'admin') {
                    const filter = { email: user.email };
                    const updateDoc = { $set: { role: 'admin' } };
                    const result = await usersCollection.updateOne(filter, updateDoc);
                    res.json(result);
                }
            }
            else {
                res.status(403).json({ message: 'you do not have access to make admin' })
            }

        })

*/

/* 
    
    app.delete("/products/:id", async (req, res) => {
      const orderID = req.params.id;
      const query = { _id: ObjectId(orderID) };
      const result = await productsCollection.deleteOne(query);
      res.json(result);
    });
   



*/
