<?php

header("Content-Type: application/json");
// ! For developing ony
header("Access-Control-Allow-Origin: http://localhost:9000");

// ! For all origins
// if(isset($_SERVER['HTTP_ORIGIN']))
// {
//   header("Access-Control-Allow-Origin: " . $_SERVER['HTTP_ORIGIN']);
//   header("Access-Control-Allow-Credentials: true");
//   header("Access-Control-Max-Age: 86400"); // Chache for 1 day
// }

// Check for date parameter
if (!isset($_GET['date'])) {
  http_response_code(400);
  die(json_encode(array("error" => "Invalid usage. No 'date' provided!")));
}

// Chech if date is valid
function validateDate($date, $format = 'Y-m-d')
{
  $d = DateTime::createFromFormat($format, $date);
  return $d && $d->format($format) === $date;
}
if (!validateDate($_GET["date"])) {
  http_response_code(400);
  die(json_encode(array("error" => "Invalid date.Date format YYYY-MM-DD")));
}

// Get info of given date
include_once './config/database.php';

$database = new Database();
$conn = $database->getConnection();

if ($_SERVER['REQUEST_METHOD'] == "GET") {
  // $d = new DateTime();
  // $result = mysqli_query($conn, "CALL giveDayInfo(\"" . $d->format("Y-m-d") . "\")");
  $result = mysqli_query($conn, "CALL giveDayInfo(\"" . $_GET["date"] . "\")");
  $data = array();
  while ($row = mysqli_fetch_assoc($result)) {
    array_push($data, $row);
  }

  http_response_code(200);
  echo json_encode($data);
}
