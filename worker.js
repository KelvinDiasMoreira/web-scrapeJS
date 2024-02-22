import * as cheerio from "cheerio";
import axios from "axios";
import { parentPort, workerData } from "node:worker_threads";

import {newNames, searchInArray} from './helpers.js'

const setItensArray = searchInArray.map((_, i) => ({
  [i === 0 ? i : i % 2 === 0 && i]: { name: `${newNames[i]}` },
}));

const dataToJson = [];

const getData = async (stockToSearch) => {
  try {
    console.log(`Catching data of ${stockToSearch} ....`);
    const { data } = await axios.get(
      `https://investidor10.com.br/acoes/${stockToSearch}/`
    );
    const $ = cheerio.load(data);
    const sectionCards = $("#cards-ticker span");
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
    dataToJson.push({ [stockToSearch]: dataFormatted });
  } catch (err) {
    if (err) {
      console.log(`not found stock ${stockToSearch}`);
    }
  }
};

for (let i = 0; i < workerData.stocksToSearch.length; i++) {
  await getData(workerData.stocksToSearch[i]);
}

parentPort.postMessage(dataToJson);
