const express = require ("express");
const cors = require ('cors')
const Routes = require("./routes/index.routes")
const mongoose = require('mongoose')
require("dotenv").config()

const app = express();
const PORT = 3333;


const dbUser = process.env.DB_USER
const dbPass = process.env.DB_PASS

mongoose.connect(`mongodb+srv://${dbUser}:${dbPass}@cluster0.mnxjhme.mongodb.net/?retryWrites=true&w=majority`)
.then(() => {
    app.listen(PORT, () => console.log("Funcionando..."));
})
.catch((error) => console.log(error))

app.use(express.json())
app.use(cors())
app.use('/api', Routes)
