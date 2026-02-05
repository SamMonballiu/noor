import * as dotenv from "dotenv";
dotenv.config();
import express, { Response, Request } from "express";
import cors from "cors";

const port = 54321;

const app = express();
app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: function (origin, callback) {
      return callback(null, true);
    },
    optionsSuccessStatus: 200,
    credentials: true,
  }),
);

app.listen(port, () => {
  console.log(`Server started on port ${port}.`);
});
