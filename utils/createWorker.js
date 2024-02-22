import { Worker } from 'worker_threads'

export function createWorker(length, totalLength, stocksToSearch) {
  return new Promise((resolve, reject) => {
    const worker = new Worker("./worker.js", {
      workerData: { lengthToGet: length, totalLength, stocksToSearch },
    });
    worker.on("message", (data) => {
      resolve(data);
    });
    worker.on("error", (err) => {
      reject(err);
    });
  });
}

