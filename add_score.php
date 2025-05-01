<?php
include 'db.php';

$data = json_decode(file_get_contents("php://input"));

$username = $conn->real_escape_string($data->username);
$score = (int)$data->score;

$sql = "INSERT INTO leaderboard (username, score) VALUES ('$username', $score)";
if ($conn->query($sql) === TRUE) {
    echo json_encode(["status" => "success"]);
} else {
    echo json_encode(["status" => "error", "message" => $conn->error]);
    echo ("It failed");
}

$conn->close();
?>
