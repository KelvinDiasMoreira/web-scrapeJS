import axios from "axios";
import fs from "fs";
import { createWorker } from "./utils/createWorker.js";

const stockSearch = [40, 40, 40, 40];
const workPromises = [];
const THREADS = 4;

const getStocks = async () => {
  try {
    const { data } = await axios.get(
      "https://brapi.dev/api/available?search=&token=eJGEyu8vVHctULdVdHYzQd"
    );
    const { stocks } = data;
    return stocks;
  } catch (err) {
    console.log(err);
  }
};

// I GETT BANNED USING THIS :(

const stocks = await getStocks();
if (!stocks.length) {
  throw new Error("Not found stocks to search");
}

for (let i = 0; i < THREADS; i++) {
  workPromises.push(
    createWorker(
      stockSearch[i],
      stocks.length,
      stocks.splice(0, stockSearch[i])
    )
  );
}

const workPromisesResult = await Promise.all(workPromises);

const arrayToJson = []
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