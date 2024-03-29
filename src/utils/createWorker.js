import { Worker } from 'worker_threads'
import path from 'path'
export function createWorker(length, totalLength, stocksToSearch, workerNum) {
  return new Promise((resolve, reject) => {
    const worker = new Worker('./src/worker.js', {
      workerData: { lengthToGet: length, totalLength, stocksToSearch, workerNum },
    });
    worker.on("message", (data) => {
      resolve(data);
    });
    worker.on("error", (err) => {
      reject(err);
    });
  });
}

