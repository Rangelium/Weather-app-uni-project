<?php
// * This script projected to be executed dayly hours
// * To achive this Scheduled processes must be used

// Set headers
header("Content-Type: application/json");

// Establish connection
include_once './config/database.php';
$database = new Database();
$conn = $database->getConnection();

// Include Tokens
include_once './Tokens.php';

// Get AccuWeather's 5 dat weather forecast
$curl = curl_init();
$url = "http://dataservice.accuweather.com/forecasts/v1/daily/5day/27103?apikey=$AccuWeatherToken&metric=true";
$result = file_get_contents($url);
$APIdata = json_decode($result, true);

// Delete current date data from prediction table
$currentDate = date("yy-m-d");
$query = "DELETE FROM `weatherPrediction`";
if (!mysqli_query($conn, $query)) {
  http_response_code(500);
  die(json_encode(array("error" => mysqli_error($conn))));
}

$i = 0;
$addedData = 0;
foreach ($APIdata["DailyForecasts"] as &$dayData) {
  // Skip today's prediction
  if($i++ == 0) continue;

  $conn = $database->getConnection();

  $req_date = date("yy-m-d", $dayData["EpochDate"]);
  $tempMax = $dayData["Temperature"]["Maximum"]["Value"];
  $tempMin = $dayData["Temperature"]["Minimum"]["Value"];
  $HasPrecipitation = $dayData["Day"]["HasPrecipitation"];
  $PrecipitationType = NULL;
  $weatherDescription;
  
  // Set precipitation type if exist
  if($HasPrecipitation){
    $PrecipitationType = $dayData["Day"]["PrecipitationType"];    
  }

  // Set weatherDescription according to available variants
  $iconPhrase = strtolower($dayData["Day"]["IconPhrase"]);
  if($iconPhrase == "sunny" || $iconPhrase == "mostly sunny" || $iconPhrase == "partly sunny" || $iconPhrase == "intermittent clouds"){
    $weatherDescription = "Clear";
  }else if($iconPhrase == "hazy sunshine"){
    $weatherDescription = "Haze";
  }else if($iconPhrase == "cloudy" || $iconPhrase == "mostly cloudy" || $iconPhrase == "dreary (overcast)"){
    $weatherDescription = "Clouds";
  }else if($iconPhrase == "fog"){
    $weatherDescription = "Fog";
  }else if($iconPhrase == "showers" || $iconPhrase == "mostly cloudy w/ showers" || $iconPhrase == "partly sunny w/ showers"){
    $weatherDescription = "Drizzle";
  }else if($iconPhrase == "rain"){
    $weatherDescription = "Rain";
  }else if($iconPhrase == "t-storms" || $iconPhrase == "mostly cloudy w/ t-storms" || $iconPhrase == "partly sunny w/ t-storms"){
    $weatherDescription = "Thunderstorm";
  }else if($iconPhrase == "flurries" || $iconPhrase == "mostly cloudy w/ flurries" || $iconPhrase == "partly sunny w/ flurries"){
    $weatherDescription = "Squall";
  }else if($iconPhrase == "snow" || $iconPhrase == "mostly cloudy w/ snow" || $iconPhrase == "ice" || $iconPhrase == "sleet" || $iconPhrase == "rain and snow" || $iconPhrase == "freezing rain"){
    $weatherDescription = "Snow";
  }else{
    $weatherDescription = $iconPhrase;
  }
  
  $query = "INSERT INTO `weatherPrediction`(`id`, `dateMeasurement`, `tempMax`, `tempMin`, `HasPrecipitation`, `PrecipitationType`, `weatherDescription`) VALUES 
  (NULL, '$req_date', '$tempMax', '$tempMin', '$HasPrecipitation', '$PrecipitationType', '$weatherDescription')";

  // Execute query and check for errors
  if (!mysqli_query($conn, $query)) {
    http_response_code(500);
    die(json_encode(array("error" => mysqli_error($conn))));
  } else {
    $addedData++;
  }
}

http_response_code(200);
if ($addedData != 0) {
  die(json_encode(array("success" => "Added $addedData rows")));
} else {
  die(json_encode(array("success" => "Nothing added")));
}
