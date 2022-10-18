const express = require("express");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require('uuid'); // For Generating Unique IDs

const PORT = process.env.PORT || 3001;

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

// Helper function that stringifies content and writes it to a given file following the provided destination filepath
// Note: This function was copied from the course's lesson 11 mini-project
const writeToFile = (destination, content) =>
  fs.writeFile(destination, JSON.stringify(content, null, 4), (err) =>
    err ? console.error(err) : console.info(`\nData written to ${destination}`)
);

app.post("/api/notes", (req,res) => {
    const newNote = {
        "title": req.body.title,
        "text": req.body.text,
        "id": uuidv4()
    }
    
    const filePath = "./db/db.json";
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
        } else {
            const parsedData = JSON.parse(data);
            parsedData.push(newNote);
            writeToFile(filePath, parsedData);
        }
    });

    res.sendStatus(200);
});

app.delete("/api/notes/:id", (req, res) => {
    // console.log(`received a delete request`);
    // console.log(req.params);

    const idNum = req.params.id;
    // console.log(`id is ${id}`);

    const filePath = "./db/db.json";
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
        } else {
            const parsedData = JSON.parse(data);
            const indexOfDeletion = parsedData.findIndex(elem => elem.id == idNum);
            console.log(`indexOfDeletion is ${indexOfDeletion}`);
            parsedData.splice(indexOfDeletion, 1);
            writeToFile(filePath, parsedData);
        }
    });

// Issue: Deletions aren't appearing on the page w/o a refresh, but only sometimes. 
// I found a workaround below but it seems kind of jury-rigged and produces error messages.
// Is there an issue with how I'm doing my deletions further up the chain that's causing this?
    // res.sendStatus(200);
    // return res.send();
    // res.send();
    res.redirect("/notes");
});

app.listen(PORT, () => {
    console.log(`Listening at http://localhost:${PORT}`);
});