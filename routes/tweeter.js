import express from "express"
import pool from "../db.js"

const router = express.Router()

router.get("/", async (req, res) => {
  res.render("tweeter.njk", {
    title: "Tweeter",
    message: "Welcome To Tweeter",
  })
})

router.get("/tweets", async (req, res) => {
  const [tweets] = await pool.promise().query(`SELECT tweet.*, users.name FROM tweet JOIN users ON tweet.author_id = users.id;`)
  res.render("tweets.njk", { 
    title: "Welcome To Tweeter!", 
    message: "Alla Existerande Tweets:",
    tweets: tweets,
    })
})

export default router