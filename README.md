# Find the Way! 
### By: Caleb Lucas-Foley, Chris Phifer, Gerson Salmeron Rubio, Ashton Stephens
### Date: October 28, 2016

## Features to Add
* Client Side
  * A visually pleasing layout and graphics
  * Map features:
    * Pick two random points, a reasonable distance apart, within a city
    * Find the best walking path between them (using Google's Directions API)
    * Let the user draw a path on the map between the two points
    * Evaluate the distance difference between the routes; assign a fair score
  * Leaderboard features:
    * Submit a username
    * Submit a username, score, and game mode data
    * Display the high scores
    * Display a graphical visualization of the scores
* Server Side
  * Accept score records
    * Store scores, by location, time, and username, in a database (NodeJS)
  * Validate a submitted score to make sure it wasn't a cheat
    * Maybe this uses encryption on the client side
    * Maybe the random points are sent from the server instead of generated locally on the client
  * Send scores to the front-end
  * Publish to Heroku (final step)

## Problem Statement
It's a difficult problem to find the most efficient route between two points.
Do you think you have what it takes to do as well as Google at guessing the
best route between two real locations? Try our game and find out if you
have a knack for solving the travelling salesman problem by inspection!

## Use Scenario
When a user visits the site, they'll be asked to use their location, and once
they give permission for us to use it, they'll be presented with options:
* Play Easy Game
* Play Hard Game
* Play Around You
* View Scores / Statistics
     
Choosing to play an easy game puts two points on a small section of the map of
either Chicago or New York (grids are easiest!). Choosing a hard game puts the
two points down in Boston and the surrounding area, where there are hardly any
straight roads. Playing around you entails using geolocation data to pick two
points close to the user. Viewing scores and statistics will allow the user to
view global high scores (and their relative position among those scores), look
at statistics about their gameplay and the gameplay of players around the
world, and send these statistics to various social media platforms.

Game play is easily described as follows: Two points are put on the map within
a certain radius of the randomly chosen center (or geolocation of the user).
A random path between these points is displayed that the user can then edit by
dragging it. The user confirms their path, and then calculations are run to
determine the relative error with respect to the Google route. This score is
stored locally and globally as appropriate based on whether the user has chosen
to provide an identifier  or not, and relevant statstical data is updated
based on the new information. 

## Our Solution
To implement this game, we will make use of the Google maps API, the Google
directions API, a backend technology (Node.js), geolocation, and various other
APIs and libraries.

The solution will focus on creating an easy-to-use, intuitive interface that
runs well on both mobile and desktop devices. The interface will depend on
Google APIs extensively to allow the user to create a path, adjust it, and
ultimately compare it to Google's solution (for scoring). The scores will
persist on the server side, thus allowing competition between anyone who
visits. 

Overall, it shouldn't be too difficult to implement, and we'll be able to
spend time on making the game more fun, accessible, and interesting. 

## Features to be Implemented
   1. Geolocation: Play the game somewhere familiar! A fun challenge when you
      actually want to think about how to get places quickly.
   2. Server-side persistence: Compete with friends and other players around
      the world! See how good you are compared to others at guess what routes
      are fastest.
   3. Client-side persistence: Keep track of your most recent high scores so
      you can work towards beating them!
   4. Charts and graphs: See the performance of people around the world
      relative to you! See how your performance changes over time, and how it
      compares to the performance of others. 

## Data
The only data important to this application is geolocation information (to play
close to one's actual location), and information about scores. We'll need some
way of identifying users (for global score information), and localStorage or
cookies for storing the user's current high score list on their own machine.
To prevent cheating, we'll encrypt or encode the score data in some way that
is difficult for the user to predict. 

## Algorithms / Special Techniques
To find the shortest path between the two points, we make use of the Google
Directions API, which has built-in support for finding the optimal path between
two points given some number of factors (e.g. mode of transportation,
construction, and various other factors affecting travel times). For our
purposes, we assume that the mode of transportation is walking.

To score a user's chosen path, we take it's relative error when compared to the
path chosen by Google. This is a simple system that is sensible given that we
always assume that the paths are chosen with walking as the mode of
transportation in mind. 

## Mockups

![The main page](ftw.png)
![An example leaderboard page](leaderboard.png)

## Comments by Ming
* A fun idea.
* Be careful on what the scope of location means. I am thinking this idea will not work well inside of a building or in a small park like the Boston Commons (e.g., Frog Pond to the Swan Boats)?
