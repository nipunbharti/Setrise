var request = require("request");
var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine","ejs");
var cityName, parsedData, sunrise, sunset;

app.get("/",function(req,res){
	res.render("home", {sunriseTime: sunrise, sunsetTime: sunset});
})

app.post("/cityname",function(req,res){
	console.log(req.body);
	cityName = req.body.city.toLowerCase();
	request("https://query.yahooapis.com/v1/public/yql?q=select%20astronomy.sunrise%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22" + cityName + "%2C%20hi%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys",function(error, response, body){
		if(!error && response.statusCode == 200){
			parsedData = JSON.parse(body);
			console.log(parsedData.query.results.channel.astronomy.sunrise)
			sunrise = parsedData.query.results.channel.astronomy.sunrise;
		}
	})
	request("https://query.yahooapis.com/v1/public/yql?q=select%20astronomy.sunset%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22" + cityName + "%2C%20hi%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys",function(error, response, body){
		if(!error && response.statusCode == 200){
			parsedData = JSON.parse(body);
			console.log(parsedData.query.results.channel.astronomy.sunset)
			sunset = parsedData.query.results.channel.astronomy.sunset;
		}
	})
	console.log(cityName);
	res.redirect("/");
})

app.listen(3000, function(){
	console.log("Server at 3000");
})