import "dotenv/config"
import express from "express"
import nunjucks from "nunjucks"
import morgan from "morgan"
import bodyParser from "body-parser"

import birdsRouter from "./routes/birds.js"
import tweeterRouter from "./routes/tweeter.js"

const app = express()
const port = 3000

nunjucks.configure("views", {
  autoescape: true,
  express: app,
})

app.use(morgan("dev"))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static("public"))

app.get("/", async (req, res) => {  
  res.render("index.njk", {
    title: "Hello World",
    message: "Hello World",
  })
})

app.use("/birds", birdsRouter)
app.use("/tweeter", tweeterRouter)

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})