<?php

include "lib.php";

$no =$_POST['deleteData'];
$no = mysqli_real_escape_string($connect, $no);

$query = "DELETE from react_board where no='$no'";
mysqli_query($connect, $query);

$query = "UPDATE react_board set no= no-1 where no > $no";
mysqli_query($connect, $query);


$sql = "select * from react_board";

$result = mysqli_query($connect, $sql);

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