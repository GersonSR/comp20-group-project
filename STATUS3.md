# Status Report 3: Friday, December 9th

## Tasks Accomplished

* Server Side:
  * Created function to recieve scores throught the server
  * Determined method of storing json objects in mongoDB

* Client Side:
  * Added drag-to-draw lines functionality
  * Added Google Directions API best route calculation, and ability to compare that to the user made path
  * Added score guideline
  * Added user simple user interface

## Hurdles Overcome
* There was no way to make user-drawn paths cleanly snap to roads without mangling them or giving away the optimal route.
  * Solution: We changed our scoring system. Now, the user's path and Google's Directions API path are connected to form a polygon. The area of this polygon determines the user's score, with minimal area scores being best.

## Next Steps
* A leaderboard web-page for displaying top scores
* More game like interface and smoother graphics
* Connecting all of the modules we have built

##Comments by Ming
* Visualizations from status report 2 --done?
* "There was no way to make user-drawn paths cleanly snap to roads without mangling them or giving away the optimal route." => Correct.  And you know the problem is the Traveling Salesman Problem (TSP), right? #goodluckwiththat
