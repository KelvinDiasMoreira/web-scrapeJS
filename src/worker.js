import * as cheerio from "cheerio";
import axios from "axios";
import { parentPort, workerData } from "node:worker_threads";
import {
  newNames,
  searchInArray,
  indicatorsName,
} from "./helpers/helpersObjects.js";

const setItensArray = searchInArray.map((_, i) => ({
  [i === 0 ? i : i % 2 === 0 && i]: { name: `${newNames[i]}` },
}));

const dataToJson = [];

const URL = MISTERY;

const extractData = async (stockToSearch) => {
  try {
    const { data } = await axios.get(`${URL}${stockToSearch}/`);
    const $ = cheerio.load(data);
    const sectionCards = $("#cards-ticker span");
    const indicatorsCards = $(".justify-content-between > span");
    const dataSectionCards = [];
    for (let i = 0; i < sectionCards.length; i++) {
      if (sectionCards[i].children) {
        dataSectionCards.push(sectionCards[i].children[0].data);
      }
    }
    const dataFormatted = {};
    for (let i = 0; i < dataSectionCards.length; i++) {
      if (i % 2 === 0) {
        dataFormatted[setItensArray[i][i].name] = dataSectionCards[i + 1];
      }
    }
    for (let i = 0; i < indicatorsCards.length; i++) {
      if (indicatorsCards[i].children) {
        dataFormatted["indicators"] = {
          ...dataFormatted["indicators"],
          [indicatorsName[i]]: indicatorsCards[i].children[0].data.replace(
            /\n/g,
            ""
          ),
        };
      }
    }
    dataToJson.push({ [stockToSearch]: dataFormatted });
    console.log(`Success on getting data of stock: ${stockToSearch}`);
  } catch (err) {
    if (err) {
      console.log(`not found stock ${stockToSearch}`);
    }
  }
};

for (let i = 0; i < workerData.stocksToSearch.length; i++) {
  await extractData(workerData.stocksToSearch[i]);
}

parentPort.postMessage(dataToJson);
