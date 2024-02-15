import * as cheerio from "cheerio";
import axios from "axios";

const URL = "https://investidor10.com.br/acoes/bbse3/";

const searchInArray = [
  "Cotação",
  "",
  "VARIAÇÃO (12M)",
  "",
  "P/L",
  "",
  "P/VP",
  "",
  "DY",
  "",
];
const newNames = [
  "cotacion",
  "",
  "variation",
  "",
  "pricePerL",
  "",
  "pricePerVp",
  "",
  "yield",
  "",
];
const setItensArray = searchInArray.map((_, i) => ({
  [i === 0 ? i : i % 2 === 0 && i]: { name: `${newNames[i]}` },
}));

const getData = async () => {
  try {
    const { data } = await axios.get(URL);
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
  } catch (er) {
    console.log(err);
  }
};

getData();
