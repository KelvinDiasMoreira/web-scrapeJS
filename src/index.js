import fs from "fs";
import axios from 'axios'
import { createWorker } from "./utils/createWorker.js";
import { getStocks } from "./api/apiCalls.js";

const THREADS = 4;
const workersPromises = [];
const arrayToJson = [];
let lenthError = false
// I GETT BANNED USING THIS :(

let stocks = await getStocks();
let stocksLength = stocks.length

if (!stocksLength) throw new Error("Not found stocks to search or");

if (stocksLength % THREADS !== 0){
  lenthError = true
  console.log("Can't set a number to search to each THREADS")
  console.log(`new value: ${Math.floor(stocks.length / THREADS)}`)
  stocksLength = Math.floor(stocks.length / THREADS)
}

const divisionCotacionsToSearch = Array.from(
  { length: THREADS },
  (_) => lenthError ? stocksLength : stocks.length / THREADS
);

for (let i = 0; i < THREADS; i++) {
  workersPromises.push(
    createWorker(
      divisionCotacionsToSearch[i],
      stocks.length,
      stocks.splice(0, divisionCotacionsToSearch[i]),
      i
    )
  );
}

const workPromisesResult = await Promise.all(workersPromises);

for (let i = 0; i < workPromisesResult.length; i++) {
  for (let j = 0; j < workPromisesResult[i].length; j++) {
    arrayToJson.push(workPromisesResult[i][j]);
  }
}

fs.writeFile(
  "./src/data.json",
  JSON.stringify(arrayToJson, null, 4),
  "utf8",
  (err) => {
    console.log(err);
  }
);

lenthError = false;
console.log("all good!");
