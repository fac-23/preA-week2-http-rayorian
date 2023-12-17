import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import 'dotenv/config';
// import cors from "cors";
import { engine } from 'express-handlebars';
const filename = fileURLToPath(import.meta.url);

const dirname = path.dirname(filename);

const app = express();
const port = process.env.port || 3000;

// app.use(cors());

app.engine("handlebars", engine());
app.set("view engine", "handlebars")
app.set('views',  path.resolve(dirname, "./views"));

app.use("/", express.static("public"));

// sendFile will go here
// app.get("/", (req, res) => {
// 	res.sendFile(path.join(dirname, "/index.html"));
// });

app.get("/", (req, res) => {
	res.render('home', {title: "Crime Checker - Check the crime in your area"});
});

app.listen(port);
// eslint-disable-next-line no-console
console.log(`Server started at http://localhost:${port}`);
