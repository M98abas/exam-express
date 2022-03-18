const express = require("express");
const QRoute = require("./routes/exams.route");
const SRoute = require("./routes/studet.route");
const LRoute = require("./routes/lecture.route");
const CRoute = require("./routes/course.route");
const ARoute = require("./routes/admin.route");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 4000;
app.use(express.json());
app.use(cors());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use("/admin", ARoute);
app.use("/question", QRoute);
app.use("/student", SRoute);
app.use("/lecture", LRoute);
app.use("/course", CRoute);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
