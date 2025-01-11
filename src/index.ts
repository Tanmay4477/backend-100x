import express from "express";
import config from "config";


const app: express.Application = express();
const port: number = config.get("port") || 8000;

