var dateFormat = require("dateformat");
var conf = require("./config/config.js");
var collections = [conf.destinationCollection];
var db = require("mongojs").connect(conf.mongodb, collections);
var request = require('request');

url = 'http://search.twitter.com/search.json?q='+conf.searchPhrase+'&geocode='+conf.boundingBox+','+conf.radius+'km&rpp='+conf.pagesToReturn;
request(url, function (error, response, body) {
  if (!error && response.statusCode == 200) {
        var tweetResponse = JSON.parse(body);
        tweetResponse.results.forEach(function(tweet) {
            db.fp_tweets_chi_05.findOne({id_str:tweet.id_str},function(err,atweet){
                if (err) {

                }
                if (atweet) {
                        console.log(dateFormat(new Date(),"yyyymmdd h:MM:ss")+" Existing Tweet: "+tweet.id_str) // Print the tweet.
                }
                else {
                        console.log(dateFormat(new Date(),"yyyymmdd h:MM:ss")+" Adding Tweet: "+tweet.id_str) // Print the tweet.
                        tweet.jDate = new Date(tweet.created_at);
                        var encodedText =
                        db.fp_tweets_chi_05.insert(tweet,function(err) {
                                if (err) {
                                        console.log(dateformat(new Date(),"yyyymmdd h:MM:ss")+" Error: "+err);
                                }
                        });

                }


                });
        });
  }
});

setTimeout(function(){
  process.exit(0);
}, 5000);

