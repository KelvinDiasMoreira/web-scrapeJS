import fs from "fs";
import { createWorker } from "./utils/createWorker.js";
import { getStocks } from './api/apiCalls.js'

const THREADS = 4;
const stockSearch = [300, 300, 300, 300];
const workersPromises = [];
const arrayToJson = []

// I GETT BANNED USING THIS :(

const stocks = await getStocks();
if (!stocks.length) {
  throw new Error("Not found stocks to search");
}

for (let i = 0; i < THREADS; i++) {
  workersPromises.push(
    createWorker(
      stockSearch[i],
      stocks.length,
      stocks.splice(0, stockSearch[i])
    )
  );
}

const workPromisesResult = await Promise.all(workersPromises);

for (let i = 0; i < workPromisesResult.length; i++) {
  for (let j = 0; j < workPromisesResult[i].length; j++) {
    arrayToJson.push(workPromisesResult[i][j])
  }
}

fs.writeFile(
  "./data.json",
  JSON.stringify(arrayToJson, null, 4),
  "utf8",
  (err) => {
    console.log(err);
  }
);

console.log("all good!");