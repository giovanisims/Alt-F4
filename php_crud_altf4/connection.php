
<?php
$server = "localhost";  // Database server address
$user = "root";         // Database user
$password = "*******"; // fake Database password
$database = "altf4";    // Database name
$port = 3305;           // Database port

// Create the connection
$connection = new mysqli($server, $user, $password, $database, $port);

// Check if there was a connection error
if ($connection->connect_error) {
    die("Connection failed: " . $connection->connect_error);
}
?>
