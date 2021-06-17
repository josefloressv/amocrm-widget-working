<?php
$headers = getallheaders();

// obtener data
$data = file_get_contents('php://input');

if (!empty($_POST['data'])) {
    $data = urldecode($_POST['data']);
}

try {
    $log_file = fopen("/var/log/webhook.log", "a");
    fwrite($log_file, date('Y-m-d H:i:s'));
    fwrite($log_file, $data);
    fclose($log_file);
} catch (\Throwable $th) {
    echo "Error / " . $th->getMessage();
}
echo '{status:"success"}';