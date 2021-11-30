<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token');
//require "conn.php";
$data = json_decode(file_get_contents("php://input"));
if (isset($_POST['image']) ){
$image = $_POST['image'];
$target_dir = "uploads/";
 $target_file = $target_dir .time(). basename($_FILES["file"]["name"]);
 echo json_encode($target_file);
move_uploaded_file($_FILES["file"]["tmp_name"], $target_file);
}

?>

