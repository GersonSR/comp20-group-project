# Status Report 1: Friday, November 18

## Tasks Accomplished
* Server Side:
  * Created skeleton server.js file. Decided on two completely necessary routes,
    with comments outlining plans for some more / changes to be made if we
    decide on a more server-oriented model.
  * Initial setup for CORS, MongoDB connections, parameter parsing, etc.
  * package.json contains all currently known dependencies, though stuff that
    Heroku wants is currently missing (e.g. name, repository, etc.)
  * Procfile ready for Heroku deployment
* Client Side:
  

## Hurdles Overcome
* Preserved extensibility
* Avoided dissociation

## Next Steps
* Begin to integrate Google's Directions API (client side)
  * Generate two random points a reasonable distance apart in a city
  * Allow the user to drag or draw a path between them
* Add validation to server
  * Make sure the user didn't cheat!
  * Make sure the user isn't trying to hack MongoDB!
* Data visualization (client side)
  * Make a simple leaderboard that shows the top scores (either on a separate page or in a "pop-up")
