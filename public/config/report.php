<?php

$curl = curl_init();

curl_setopt_array($curl, array(
	CURLOPT_URL => "https://backdoor.haboplatform.id/report",
	CURLOPT_RETURNTRANSFER => true,
	CURLOPT_ENCODING => "",
	CURLOPT_MAXREDIRS => 10,
	CURLOPT_TIMEOUT => 0,
	CURLOPT_FOLLOWLOCATION => true,
	CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
	CURLOPT_CUSTOMREQUEST => "GET",
));

$response = curl_exec($curl);

curl_close($curl);
$data = json_decode($response,true)['data'];


// echo "<pre>";
// print_r($data);
// echo "</pre>";
if($_POST['type']=="prosess"){
	echo round((($data[1]['number']+$data[4]['number'])/1073741824),2)." GB";
}else if($_POST['type']=="save"){
	echo round((($data[0]['number']+$data[3]['number'])/1073741824),2)." GB";
}