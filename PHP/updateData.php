<?php

include "lib.php";

$no =$_POST['updateId'];
$content =$_POST['updateValue'];
$no = mysqli_real_escape_string($connect, $no);
$content = mysqli_real_escape_string($connect, $content);

$query = "UPDATE react_board set content= '$content' where no='$no'";
mysqli_query($connect, $query);

$query = "SELECT * from react_board";
$result = mysqli_query($connect, $query);

$arr = array();

if(mysqli_num_rows($result)>0){
  while( $row = mysqli_fetch_array($result) ){
    array_push($arr, array(
      "번호" => $row['no'],
      "내용" => $row['content'],
      "날짜" => $row['regdate']
    ));
  }
}


$json = json_encode($arr, JSON_UNESCAPED_UNICODE);

echo $json;


?>