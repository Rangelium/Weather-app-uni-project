<?php
// * This script projected to be executed every 4 hours
// * To achive this Scheduled processes must be used

// Set headers
header("Content-Type: application/json");

// Establish connection
include_once '../config/database.php';
$database = new Database();
$conn = $database->getConnection();

// Include Tokens
include_once './Tokens.php';

// Get OpenWeather's today's Hourly date info
$d1 = new Datetime("now");
$currTimestamp = $d1->getTimestamp() - 200;
$url = "https://api.openweathermap.org/data/2.5/onecall/timemachine?lat=40.38&lon=49.89&dt=$currTimestamp&appid=$OpenWeatherToken&units=metric";
$result = file_get_contents($url);
$APIdata = json_decode($result, true);

// Get OpenWeather's prev day's Hourly date info
// To add 00:00:00 time info to table
$currTimestamp = $d1->getTimestamp() - 200 - 86400;
$url = "https://api.openweathermap.org/data/2.5/onecall/timemachine?lat=40.38&lon=49.89&dt=$currTimestamp&appid=$OpenWeatherToken&units=metric";
$result = file_get_contents($url);
$APIdataPrev = json_decode($result, true);


// Delete all previous data about specified date
$APIcurrDate = date("yy-m-d", $APIdata["current"]["dt"]);
if (!mysqli_query($conn, "DELETE FROM `weather` WHERE `dateMeasurement` = '$APIcurrDate'")) {
  http_response_code(500);
  die(json_encode(array("error" => mysqli_error($conn))));
}

// Init global variables
$i = 0;
$addedData = 0;

// Adding 00:00:00 time info
$conn = $database->getConnection();

// * Below line calculates time with timezone offset(4 hours in Asia/Baku)
// * also due to unknown bug date() function converts unix timestamp 1 hour later
// * than it should be
$hourTime = $APIdataPrev["hourly"][20]["dt"] + $APIdataPrev["timezone_offset"] - 3600;

// Prepare params for query
$req_date = date("yy-m-d", $APIdataPrev["hourly"][20]["dt"] + 86400);
$req_time = date("H:i:s", $hourTime);
$req_temp = $APIdataPrev["hourly"][20]["temp"];
$req_tempFeelsLike = $APIdataPrev["hourly"][20]["feels_like"];
$req_pressure = $APIdataPrev["hourly"][20]["pressure"];
$req_cloudiness = $APIdataPrev["hourly"][20]["clouds"];
$req_visibility = $APIdataPrev["hourly"][20]["visibility"];
$req_windSpeed = $APIdataPrev["hourly"][20]["wind_speed"];
$req_humidity = $APIdataPrev["hourly"][20]["humidity"];
$req_weatherMain = $APIdataPrev["hourly"][20]["weather"][0]["main"];
$req_weatherDescription = $APIdataPrev["hourly"][20]["weather"][0]["description"];

$query = "INSERT INTO `weather`(`weatherDataID`, `dateMeasurement`, `timeMeasurement`, `temperature`, `tempFeelsLike`, `airPressure`, `cloudiness`, `visibility`, `windSpeed`, `humidity`, `weatherMain`, `weatherDescription`) VALUES 
(NULL , '$req_date', '$req_time', '$req_temp', '$req_tempFeelsLike', '$req_pressure', '$req_cloudiness', '$req_visibility', '$req_windSpeed', '$req_humidity', '$req_weatherMain', '$req_weatherDescription')";

// Execute query and check for errors
if (!mysqli_query($conn, $query)) {
  http_response_code(500);
  echo (json_encode(array("error" => mysqli_error($conn))));
}else{
  $addedData++;
}

// Adding all realted to current date hourly info
foreach ($APIdata["hourly"] as &$hourData) {
  // Add every 4 dates from openweaterApi;
  if (!($i % 4) || !$i) {
    $conn = $database->getConnection();
    
    // * Below line calculates time with timezone offset(4 hours in Asia/Baku)
    // * also due to unknown bug date() function converts unix timestamp 1 hour later
    // * than it should be
    $hourTime = $hourData["dt"] + $APIdata["timezone_offset"] - 3600;

    // Prepare params for query
    $req_date = date("yy-m-d", $hourData["dt"]);
    $req_time = date("H:i:s", $hourTime);
    $req_temp = $hourData["temp"];
    $req_tempFeelsLike = $hourData["feels_like"];
    $req_pressure = $hourData["pressure"];
    $req_cloudiness = $hourData["clouds"];
    $req_visibility = $hourData["visibility"];
    $req_windSpeed = $hourData["wind_speed"];
    $req_humidity = $hourData["humidity"];
    $req_weatherMain = $hourData["weather"][0]["main"];
    $req_weatherDescription = $hourData["weather"][0]["description"];

    $query = "INSERT INTO `weather`(`weatherDataID`, `dateMeasurement`, `timeMeasurement`, `temperature`, `tempFeelsLike`, `airPressure`, `cloudiness`, `visibility`, `windSpeed`, `humidity`, `weatherMain`, `weatherDescription`) VALUES 
    (NULL , '$req_date', '$req_time', '$req_temp', '$req_tempFeelsLike', '$req_pressure', '$req_cloudiness', '$req_visibility', '$req_windSpeed', '$req_humidity', '$req_weatherMain', '$req_weatherDescription')";

    // Execute query and check for errors
    if (!mysqli_query($conn, $query)) {
      http_response_code(500);
      echo (json_encode(array("error" => mysqli_error($conn))));
    }else{
      $addedData++;
    }
  }
  $i++;
}

http_response_code(200);
if ($addedData != 0) {
  die(json_encode(array("success" => "Added $addedData rows")));
} else {
  die(json_encode(array("success" => "Nothing added")));
}
