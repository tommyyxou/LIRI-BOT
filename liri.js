require('dotenv').config();
let Spotify = require('node-spotify-api');
let keys = require("./keys.js");
let spotify = new Spotify(keys.spotify);
let axios = require("axios");
let moment = require('moment');
let fs = require("fs");
// Extra Styling
const chalk = require('chalk');

let verb = process.argv[2];
let noun = process.argv[3];
liri ();

function liri () {
  if (verb === "concert-this") {
    let artist = noun;
    let commandString = "\n\n" + verb + " " + noun
    log (commandString);

    axios.get("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp").then(
    function(response) {
      for (i=0; i < response.data.length; i++ ) {
        
        let date = moment(response.data[i].datetime).format("dddd, MMMM Do YYYY, h:mm:ss a");

        console.log (chalk.blue("--------------------   Result: #" + (i+1) + "   ---------------------"));
        console.log (chalk.green("Name of the venue: ") + response.data[i].venue.name);
        console.log (chalk.green("Venue location: ") + response.data[i].venue.city + ", " + response.data[i].venue.region)
        console.log (chalk.green("Date of the Event: ") + date);
        console.log (chalk.blue("-----------------   End of Result: #" + (i+1) + "   -----------------"));
        console.log (" ")

        let string = "\n\n--------------------   Result: #" + (i+1) + "   --------------------- " +
        "\nName of the venue: " + response.data[i].venue.name + 
        "\nVenue location: " + response.data[i].venue.city + ", " + response.data[i].venue.region + 
        "\nDate of the Event: " + date + 
        "\n-----------------   End of Result: #" + (i+1) + "   -----------------";

        log (string)
        
      }
    });
  };

  if (verb === "spotify-this-song") {
      if (noun === undefined) {
        song = "The Sign"
      } else {song = noun};

      let commandString = "\n\n" + verb + " " + noun
      log (commandString)

      spotify.search({ type: 'track', query: song }, function(err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }
        for (x=0; x < data.tracks.items.length; x++) {
          let name = "";
          for (let i = 0; i < data.tracks.items[x].album.artists.length; i++ ) {
            name = name + data.tracks.items[x].album.artists[i].name + ",";
          }
          console.log (chalk.red("--------------------   Result: #" + (x+1) + "   ---------------------"));
          // ARTISTS
          console.log (chalk.green("Artist(s): ") + name);
          // NAME OFSONG
          console.log (chalk.green("Track Name: ") + song);
          //PREVIEW LINK
          console.log(chalk.green("Preview: ") + data.tracks.items[x].album.external_urls.spotify);
          // ALBUM NAME
          console.log(chalk.green("Album Name: ") + data.tracks.items[x].album.name);
          console.log (chalk.red("-----------------   End of Result: #" + (x+1) + "   -----------------"));
          console.log (" ");

          let string = "\n\n--------------------   Result: #" + (x+1) + "   ---------------------" +
          "\nArtist(s): " + name + 
          "\nTrack Name: " + song + 
          "\nPreview: " + data.tracks.items[x].album.external_urls.spotify + 
          "\nAlbum Name: " + data.tracks.items[x].album.name +
          "\n-----------------   End of Result: #" + (x+1) + "   -----------------";

          log (string);
        }
      });
  };

  if (verb === "movie-this") {
    if (noun === undefined) {
      movie = "Mr. Nobody"
    } else { movie = noun; };

    let commandString = "\n\n" + verb + " " + noun;
    log (commandString);
    
    axios.get("http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy").then(
    function(response) {
      console.log(chalk.yellow("--------------------   Result   ---------------------"));
      console.log(chalk.green("Title of the movie: ") + response.data.Title);
      console.log(chalk.green("Year the movie came out: ") + response.data.Year);
      console.log(chalk.green("IMDB Rating of the movie: ") + response.data.Ratings[0].Value);
      console.log(chalk.green("Rotten Tomatoes Rating of the moive: ") + response.data.Ratings[1].Value);
      console.log(chalk.green("Country where the moive was produced: ") + response.data.Country);
      console.log(chalk.green("Language of the movie: ") + response.data.Language);
      console.log(chalk.green("Plot of the movie: ") + response.data.Plot);
      console.log(chalk.green("Actors in the movie: ") + response.data.Actors);
      console.log(chalk.yellow("-----------------   End of Result   -----------------"));

      let string = "\n\n--------------------   Result   ---------------------" +
      "\nTitle of the movie: " + response.data.Title +
      "\nYear the movie came out: " + response.data.Year + 
      "\nIMDB Rating of the movie: " + response.data.Ratings[0].Value + 
      "\nRotten Tomatoes Rating of the moive: " + response.data.Ratings[1].Value +
      "\nCountry where the moive was produced: " + response.data.Country + 
      "\nLanguage of the movie: " + response.data.Language+ 
      "\nPlot of the movie: " + response.data.Plot + 
      "\nActors in the movie: " + response.data.Actors +
      "\n-----------------   End of Result   -----------------";

      log (string);
    });
  };
}

if (verb === "do-what-it-says") {

  fs.readFile("random.txt", "utf8", function(error, data) {
    if (error) {
      return console.log('Error occurred: ' + error);
    }
    let dataArr = data.split(",")
  
    verb = dataArr[0];
    noun = dataArr[1];
      
    liri ();
  });
};

function log (string) {
  fs.appendFile("log.txt", string, function(err) {
    //console.log ("Error:", err)
  });
}