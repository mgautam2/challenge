"use strict";

const FastPriorityQueue = require('fastpriorityqueue');

function comp(v1, v2) {
  return v1.date <  v2.date; 

}
// Print all entries, across all of the sources, in chronological order.

module.exports = (logSources, printer) => {
  const pq = new FastPriorityQueue(comp);
  
  for (let i = 0; i < logSources.length; i++) {
    let log = logSources[i].pop();
    
    if(log)
      pq.add({...log, sourceIdx: i});
  }

  while (!pq.isEmpty()) {
    let topLog = pq.poll();
    
    printer.print(topLog)

    let sourceIdx = topLog.sourceIdx;
    let nextLog = logSources[sourceIdx].pop();

    if(!nextLog)   // Source is drained
      continue;
    
    pq.add({...nextLog, sourceIdx: sourceIdx}); 
  } 

  printer.done()

  return console.log("Sync sort complete.");
};
