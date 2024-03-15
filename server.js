import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";
import express from "express";
// import cors from "cors";
import { engine } from "express-handlebars";

const filename = fileURLToPath(import.meta.url);

const dirname = path.dirname(filename);

const app = express();
const port = process.env.port || 3000;

// app.use(cors({
// 	origin: '*'
// }))

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.resolve(dirname, "./views"));

app.use("/", express.static("public"));

app.get("/", (req, res) => {
	res.render("home", {
		layout: "main",
		title: "Crime Checker - Check the crime in your area",
	});
});

app.get("/api-key", (req, res) => {
	res.send({ api_key: process.env.API_KEY });
});

app.listen(port);
// eslint-disable-next-line no-console
console.log(`Server started at http://localhost:${port}`);
