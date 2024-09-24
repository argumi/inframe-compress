<?php
$upload = 'err';
if (!empty($_FILES['file'])) {

    // File upload configuration 
    $targetDir = "public/assets/asli/";

    $allowTypes = array('sql', 'jpg', 'jpeg', 'JPG', "JPEG", "SQL");

    $fileName = basename($_FILES['file']['name']);
    $targetFilePath = $targetDir . $fileName;

    $url = "http://localhost:8100/public/assets/asli/";
    $url_file = $url . $fileName;

    // Check whether file type is valid 
    $fileType = pathinfo($targetFilePath, PATHINFO_EXTENSION);
    if (in_array($fileType, $allowTypes)) {
        // Upload file to the server 
        if (move_uploaded_file($_FILES['file']['tmp_name'], $targetFilePath)) {

            $curl = curl_init();

            curl_setopt_array($curl, array(
                CURLOPT_URL => $url_file . "?url=https%253A%252F%252Fplacekeanu.com%252F700%252F350&jpeg=0&bw=0&l=40",
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

            $img = imagecreatefromstring($response);
            if ($img !== false) {
                // header('Content-Type: image/jpg');
                // header('Content-Disposition: attachment; filename="haha.jpg"');
                $imagejpeg = imagejpeg($img, "../assets/compress/$fileName");
                imagedestroy($img);
                $upload = $fileName;
            } else {
                $upload = 'err';
            }

        }
    }
}
echo $upload;
?>