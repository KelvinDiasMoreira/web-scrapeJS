import axios from "axios";

export const getStocks = async () => {
  try {
    const { data } = await axios.get(MISTERY);
    const { stocks } = data;
    return stocks.filter((stock) => stock.length === 5);
  } catch (err) {
    console.log(err);
  }
};

