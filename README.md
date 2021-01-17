<img align="left" width="100px" height="100px" src="https://seso-static-assets-localhost.s3.amazonaws.com/seso-logo-green-100x100.png" alt="seso-logo">

# Seso Code Coding Challenge A21


**Log Sorting**

You have been a set of **log sources**.  Each loh source is contains N log entries.  Each entry is a javascript object with a timestamp and message.  You don't know how many log entries each source has - however - you do know that the entries within each source are sorted chronologically (that last bit is important).

Your mission is to print out all of the entries, across all of the sources, in chronological order.  You don't need to store the final collection of all the entries, simply print them to console.

### Things to keep in mind:

* You don't know how long each log source is.  Each source could have millions of entries and be terabytes in size. In other words, reading the entirety of a log source into memory probably won’t work well.
* Some log sources could contain logs from last year, some from yesterday, some from the future. You won't know the timeframe of a log source until you start looking.
* Consider what would happen when you're asked to merge 1K log sources, or even 1M log sources.  Where might your bottlenecks arise?

There are two parts of the challenge which you'll see when you dive into things.  You can get started with things by running `npm start`.

We expect candidates to spend 1-3 hours on this exercise.

## Submission

Create a GitHub repo and email your point-of-contact the link.
