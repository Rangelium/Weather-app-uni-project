<?php

// Set headers
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

// Establish connection
include_once './config/database.php';

$database = new Database();
$conn = $database->getConnection();

if ($_SERVER['REQUEST_METHOD'] == "GET") {
  if (!($result = mysqli_query($conn, "CALL giveAllNextDatesInfo()"))) {
    http_response_code(500);
    die(json_encode(array("error" => mysqli_error($conn))));
  }

  $resData = array();
  while ($row = mysqli_fetch_assoc($result)) {
    array_push($resData, $row);
  }

  http_response_code(200);
  echo json_encode($resData);
}else{
  http_response_code(400);
  echo json_encode(json_encode(array("error" => "ONLY 'GET' request allowed")));
}
