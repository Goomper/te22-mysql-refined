import express from "express"
import pool from "../db.js"

const router = express.Router()

router.get("/", async (req, res) => {
  const [birds] = await pool.promise().query(`SELECT birds.*, species.name AS species FROM birds JOIN species ON birds.species_id = species.id;`)
  res.render("birds.njk", { 
    title: "Alla fågglar", 
    message: "Alla Existerande Fåglar:", 
    birds
    })
})

router.post("/", async (req, res) => {
    console.log(req.body)
    const { species_id, name, wingspan } = req.body

    const [result] = await pool.promise().query('INSERT INTO birds (species_id, name, wingspan) VALUES (?,?,?)', [species_id, name, wingspan])

    res.json(result)
})

router.get("/new", async (req, res) => {
    const [species] = await pool.promise().query('SELECT * FROM species')
    res.render("newbird_form.njk", {
        title: "Ny Fågel",
        message: "Skapa En Ny Fågel:",
        species
    })
})

router.get("/:id", async (req, res) => {
  const [bird] = await pool.promise().query(`SELECT birds.*, species.name AS species FROM birds JOIN species ON birds.species_id = species.id WHERE birds.id = ?;`,
    [req.params.id],)
  res.render("bird.njk", { 
    title: "En fåggel", 
    message: "En Specifik Fågel:", 
    bird: bird[0]
    })
})

export default router