<?php
$host = 'localhost';
$db = 'leaderboard_db';
$user = 'PokeNamer';
$pass = 'root';

$conn = new mysqli($host,$user,$pass,$db);

if ($conn->connect_error){
    die("Connection failed: ".$conn->connect_error);
}
?>