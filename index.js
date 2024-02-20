import * as cheerio from "cheerio";
import axios from "axios";
import fs from 'fs'
import { Worker } from 'worker_threads'

const getStocks = async() => {
  try{
    const { data } = await axios.get('https://brapi.dev/api/available?search=&token=eJGEyu8vVHctULdVdHYzQd')
    const { stocks } = data
    return stocks
  }catch(err){
    console.log(err)
  }
}

// const URL = "https://investidor10.com.br/acoes/bbse3/";

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

const dataToJson = []

const getData = async (stockToSearch, index) => {
  try {
    console.log(`Catching data of ${stockToSearch} ....`)
    const { data } = await axios.get(`https://investidor10.com.br/acoes/${stockToSearch}/`);
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
        dataFormatted[setItensArray[i][i].name] = dataSectionCards[i + 1]
        console.log("🚀 ~ getData ~ dataFormatted:", dataFormatted)
      }
    }
    dataToJson.push({[stockToSearch]: dataFormatted})
    console.log("🚀 ~ dataToJson:", dataToJson)
  } catch (err) {
    if(err){
      console.log(`not found stock ${stockToSearch}`)
      return
    }
    // console.log(err);
  }
};

//TODO, use multi-threaded to do this searchs

const stocks = await getStocks()
if(!stocks.length){
  throw new Error("Not found stocks to search")
}

for(let i = 0;i < stocks.length; i++){
  await getData(stocks[i], i);
}


