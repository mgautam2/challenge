"use strict";

const FastPriorityQueue = require('fastpriorityqueue');

function comp(v1, v2) {
  return v1.date <  v2.date; 
}



const BUFFER_SIZE = 5;

// Print all entries, across all of the *async* sources, in chronological order.

module.exports = (logSources, printer) => {
  return new Promise(async (resolve, reject) => {

    const pq = new FastPriorityQueue(comp)
    let promiseList = [];
      
    for (let i = 0; i < logSources.length; i++) {
       promiseList.push(logSources[i].popAsync());
    }
    
    let list = await Promise.all(promiseList)
    
    for (let i = 0; i < list.length; i++) {
      delete list[i].num;
      if(list[i])
        pq.add({...list[i], idx: i});
    }

    while (!pq.isEmpty()) {
      const buffer_pq = new FastPriorityQueue(comp);
      promiseList = [];
      let indexList = []
      
      console.log("pq size -> " + pq.size)
      if(pq.size < 2) {
        
        let topLog = pq.poll();
    
        printer.print(topLog)

        let idx = topLog.idx;
        let nextLog = await logSources[idx].popAsync();

        if(nextLog)   // Source is drained
          pq.add({...nextLog, idx: idx});
        continue;
      }

      while(!pq.isEmpty() && buffer_pq.size <= BUFFER_SIZE) {
        let topLog = pq.poll();
        // console.log(topLog);
        let idx = topLog.idx;

        buffer_pq.add(topLog);
        indexList.push(idx);
        promiseList.push(logSources[idx].popAsync());
      } 

      // console.log("-----------")

      let resolvedList = await Promise.all(promiseList);
    
      // console.log("Max TS-->")
      // console.log(maxTS)
      // console.log("_")
      
      for (let i = 0; i < resolvedList.length; i++) {
        delete resolvedList[i].num;
        if(resolvedList[i]) {
          buffer_pq.add({...resolvedList[i], idx: indexList[i]});
        }
      }

      // console.log("---")
      const idxSet = new Set();

      while(!buffer_pq.isEmpty() && !pq.isEmpty() && (buffer_pq.peek().date <= pq.peek().date) ) {
        let topLog = buffer_pq.poll();
        if(idxSet.has(topLog.idx)) {
         let nextElem = await logSources[topLog.idx].popAsync();
          if(nextElem) {
            buffer_pq.add({nextElem, idx: topLog.idx});
          }
        }
        else {
          idxSet.add(topLog.idx);
          printer.print(topLog)
        }
      }
      
      // console.log(pq.size)
      // console.log(buffer_pq.size)

      while(!buffer_pq.isEmpty()) {
        let topLog = buffer_pq.poll();
        pq.add(topLog)
        // console.log(topLog)
      }
      
    }

    printer.done()

    

    resolve(console.log("Async sort complete."));
  });
};






    // while (!pq.isEmpty()) {
    //   promiseList = [];
    //   let indexList = [];

    //   while (!pq.isEmpty()) {
    //     let topLog = pq.poll();
    //     asyncLog.push(topLog)
    //     let idx = topLog.idx;

    //     promiseList.push(logSources[idx].popAsync())
    //     indexList.push(idx)
    //   }

    //   let resolveList = await Promise.all(promiseList)
    //   // console.log(resolveList.length)

    //   for (let i = 0; i < resolveList.length; i++) {
    //     if(resolveList[i])
    //       pq.add({...resolveList[i], idx: indexList[i]});
    //   }
    // }


    // console.log("\n***********************************");
    // var timeTaken = (new Date() - startTime) / 1000;
    // console.log("Time taken (s): ", timeTaken);
    
    // for(let log of asyncLog) {
    //   printer.print(log)
    // }


    // Approach 1::


    // const pq = new FastPriorityQueue(comp)
    // let promiseList = [];
      
    // for (let i = 0; i < logSources.length; i++) {
    //    promiseList.push(logSources[i].popAsync());
    // }
    
    // let list = await Promise.all(promiseList)
    
    // for (let i = 0; i < list.length; i++) {
    //   delete list[i].num;
    //   if(list[i])
    //     pq.add({...list[i], idx: i});
    // }

   
    // while (!pq.isEmpty()) {
    //   let topLog = pq.poll();
      
    //   printer.print(topLog)
  
    //   let idx = topLog.idx;
    //   let nextLog = await logSources[idx].popAsync();
  
    //   if(!nextLog)   // Source is drained
    //     continue;
      
    //   pq.add({...nextLog, idx: idx}); 
    // } 

    // printer.done()