import axios from "axios";

export const getStocks = async () => {
  try {
    const { data } = await axios.get(MISTERY);
    const { stocks } = data;
    return stocks;
  } catch (err) {
    console.log(err);
  }
};

