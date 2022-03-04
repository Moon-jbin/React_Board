<?php
 include "lib.php";

$no = $_POST['no'];
$content = $_POST['content'];
$regdate = date("Y-m-d");

$no = mysqli_real_escape_string($connect, $no);
$content = mysqli_real_escape_string($connect, $content);
$regdate = mysqli_real_escape_string($connect, $regdate);

$sql = "INSERT INTO react_board (no, content, regdate) values('$no', '$content', '$regdate')";

mysqli_multi_query($connect, $sql);


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


// DB 데이터 가져오기










?>