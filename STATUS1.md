# Status Report 1: Friday, November 18

## Tasks Accomplished
* Server Side:
  * Created skeleton server.js file. Decided on two completely necessary routes,
    with comments outlining plans for some more / changes to be made if we
    decide on a more server-oriented model.
  * Identified early version data model to be used: Constructed early version
    of the MongoDB document we probably want to store.
  * Initial setup for CORS, MongoDB connections, parameter parsing, etc.
  * package.json contains all currently known dependencies, though stuff that
    Heroku wants is currently missing (e.g. name, repository, etc.).
  * Procfile ready for Heroku deployment.
* Client Side:
  * Seperations of concerned was created, seperating the map creation data from 
    the index html page and the css page was made to fit the creation of the google 
    map.
  * Creation of a google marker in which it would force the google map to the location
    of the the client, and provide a waypoint pointing to the client on creation.

## Hurdles Overcome
* No significant hurdles encountered yet. The next steps will likely be more problematic.

## Next Steps
* Begin to integrate Google's Directions API (client side)
  * Generate two random points a reasonable distance apart in a city
  * Allow the user to drag or draw a path between them
* Add validation to server
  * Make sure the user didn't cheat!
  * Make sure the user isn't trying to hack MongoDB!
* Data visualization (client side)
  * Make a simple leaderboard that shows the top scores (either on a separate page or in a "pop-up")
* Start creating manners of which to represent data to client such as scoreboards etc.

#Comments by Ming
* Focus on the client side stuff first.  Security of server side is a never-ending battle.  Remember, you are not aiming for perfection in the semester group project.
