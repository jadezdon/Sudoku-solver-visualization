const express = require("express");
const app = express();
const path = require("path");
const port = process.env.PORT || 3000;

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname + "/templates/index.html"));
});

app.listen(port, () => console.log(`Server running at http://localhost:${port}`));

app.use(express.static(__dirname + "/public/"));
