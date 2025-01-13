import express from "express";
import config from "config";
import cors from "cors";
import routes from "./routes/main"
import cookieParser from "cookie-parser"

const app: express.Application = express();
const port: number = config.get("port") || 8000;

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use("/api/v1", routes)


app.listen(port, () => {
    console.log(`Port is running on http://localhost:${port}`)
});