<?php
 
$data = array();
 $error = false;
if( isset( $_GET['uploadfiles'] ) ){
    $dir=$_GET['path']; 
    $files = array();
 
    $uploaddir = $_SERVER['DOCUMENT_ROOT'].$dir;
    if( ! is_dir( $uploaddir ) ) mkdir( $uploaddir, 0777 );
 
    // переместим файлы из временной директории в указанную
    foreach( $_FILES as $file ){
        $file_path=$uploaddir . basename($file['name']);
        if( move_uploaded_file( $file['tmp_name'],$file_path)){
            $files[] = basename($file['name']);
        }
        else{
            $error = true;
        }
    }
 
    $data = $error ? array('error' => 'Error of uploading file') : array('files' => $files );
    echo json_encode( $data );
} 
if(isset($_POST['delete_file'])){
    $file=$_SERVER['DOCUMENT_ROOT'].$_POST['path'];
   if(!unlink($file)){
       echo '0';
   }
}
?>