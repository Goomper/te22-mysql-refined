import express, { application } from "express"
import pool from "../db.js"
import { body, matchedData, validationResult } from "express-validator"

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

router.get("/tweets/create", async (req, res) => {
  const [users] = await pool.promise().query(`SELECT * FROM users;`)
  res.render("tweetcreator.njk", {
    title: "Here You Create Your Own Tweets.",
    users: users,
  })
})

router.get("/tweets/:id/edit", async (req, res) => {
  const id = req.params.id
  if (!Number.isInteger(Number(id))) { return res.status(400).send("Invalid ID") }
  const [rows] = await pool.promise().query("SELECT * FROM tweet WHERE id = ?", [id])
  if (rows.length === 0) {
    return res.status(404).send("Tweet not found")
  }
  res.render("tweeteditor.njk", { tweet: rows[0] })
})

router.post("/tweets/edit", body("id").isInt(), body("message").isLength({ min: 1, max: 130 }), body("message").escape(), async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) { return res.status(400).send("Invalid input") }

  const { id, message } = matchedData(req)
  const timestamp = new Date().toISOString().slice(0, 19).replace("T", " ")
  await pool.promise().query("UPDATE tweet SET message = ?, updated_at = ? WHERE id = ?", [message, timestamp, id])
  res.redirect("/tweeter/tweets")
})

router.get("/tweets/:id/reply", async (req, res) => {
  const id = req.params.id
  const [tweets] = await pool.promise().query("SELECT * FROM tweet WHERE id = ?", [id])
  //const [users] = await pool.promise().query('SELECT name FROM users')
  res.render("reply.njk", {
    tweet: tweets[0],
    //users: users,
    id,
  })
})

router.get("/tweets/:id/delete", async (req, res) => {
  const id = req.params.id

  if (!Number.isInteger(Number(id))) {
    return res.status(404).send("Invalid ID")
  }

  await pool.promise().query("DELETE FROM tweet WHERE id = ?", [id])
  res.redirect("/tweeter/tweets")
})

router.post("/tweets", async (req, res) => {
  const message = req.body.message
  const author_id = req.body.author_id
  await pool.promise().query(`INSERT INTO tweet (message, author_id) VALUES (?, ?)`, [message, author_id])
  res.redirect("/tweeter/tweets")
})

export default router