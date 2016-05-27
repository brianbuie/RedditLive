<?php

$service_url = $url . $data;
$curl = curl_init($_POST['url']);
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
$curl_response = curl_exec($curl);
header('Content-Type: application/json');
echo json_encode($curl_response);


?>