const express = require("express");
const path = require("path");

const app = express();

app.use("/static", express.static(path.resolve(__dirname, "build", "static")));

app.get("/", (req, res) => {
    res.sendFile(path.resolve("build", "index.html"));
});
app.get('/test', (req, res)=>{
  res.end(path.resolve(__dirname, "build", "static"))
})
app.listen(process.env.PORT || 3000, () => console.log("Server running..."));