import express  from 'express';
import dotenv from "dotenv";
import cors from "cors";
import {MongoClient} from "mongodb"
import {userRouter} from "./routes/user.js"


// Configuring server with express using cors, dotenv, express.json(), express routers created by you

dotenv.config();                                                // to maintain secrecy while deploying

const app = express();                            

app.use(cors());                                               // To allow traffic from anywhere to your server

app.use(express.json());                                       // Informs Node that we are getting JSON data

app.use("/user", userRouter)                                   // Express router created to divert the traffic

// Configuring server with express using cors, dotenv




// Creating connection with mongoDB

const mongo_url = "mongodb://127.0.0.1";

async function createConnection(){
  const client = new MongoClient(mongo_url);
  await client.connect();
  console.log("MongoBD is connected");
  return client;
};

export const client = await createConnection();

// Creating connection with mongoDB






// API for default path

app.get('/', function (req, res) {
  res.send('Hello World')
});





app.listen(process.env.port);