"use strict";

const FastPriorityQueue = require('fastpriorityqueue');

function comp(v1, v2) {
  return v1.date <  v2.date; 
}


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
      let topLog = pq.poll();
      
      printer.print(topLog)
  
      let idx = topLog.idx;
      let nextLog = await logSources[idx].popAsync();
  
      if(!nextLog)   // Source is drained
        continue;
      
      pq.add({...nextLog, idx: idx}); 
    } 
    printer.done()

    resolve(console.log("Async sort complete."));
  });
};




    

// ## Failed approach 

// const BUFFER_SIZE  = 25

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
//   const buffer_pq = new FastPriorityQueue(comp);
//   promiseList = [];
//   let indexList = []
  
//   if(pq.size < (BUFFER_SIZE * .2)) {
    
//     let topLog = pq.poll();

//     printer.print(topLog)

//     let idx = topLog.idx;
//     let nextLog = await logSources[idx].popAsync();

//     if(nextLog)   // Source is drained
//       pq.add({...nextLog, idx: idx});
//     continue;
//   }

//   while(!pq.isEmpty() && buffer_pq.size <= BUFFER_SIZE) {
//     let topLog = pq.poll();
//     let idx = topLog.idx;

//     buffer_pq.add(topLog);
//     indexList.push(idx);
//     promiseList.push(logSources[idx].popAsync());
//   } 

//   let resolvedList = await Promise.all(promiseList);
  
//   for (let i = 0; i < resolvedList.length; i++) {
//     if(resolvedList[i]) {
//       buffer_pq.add({...resolvedList[i], idx: indexList[i]});
//     }
//   }

//   const idxSet = new Set();

//   while(!buffer_pq.isEmpty() && !pq.isEmpty() && (buffer_pq.peek().date <= pq.peek().date) ) {
//     let topLog = buffer_pq.poll();
//     if(idxSet.has(topLog.idx)) {
//      let nextElem = await logSources[topLog.idx].popAsync();
//       if(nextElem) {
//         buffer_pq.add({nextElem, idx: topLog.idx});
//       }
//     }
//     else {
//       idxSet.add(topLog.idx);
//       printer.print(topLog)
//     }
//   }


//   while(!buffer_pq.isEmpty()) {
//     let topLog = buffer_pq.poll();
//     pq.add(topLog)
//   }
  
// }