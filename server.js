const express = require("express");
const path = require("path");
const fs = require("fs");
import { v4 as uuidv4 } from 'uuid'; // For Generating Unique IDs

const PORT = 3001;

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('public'));

app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "public/notes.html"))
});

app.get("/api/notes", (req, res) => {
    const filePath = "./db/db.json";
    const file = fs.readFileSync(filePath);
    const contents = file.toString();
    const json = JSON.parse(contents);

    res.json(json);
});

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname,"public/index.html"))
});

app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`);
});