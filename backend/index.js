const express = require("express");
const cors = require("cors");
const { router } = require("./routes/index.js");

const PORT = process.env.PORT || 3000;

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/v1", router);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});