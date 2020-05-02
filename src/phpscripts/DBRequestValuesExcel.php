<?php 
	header("Content-type: application/vnd.ms-excel"); 
	header("Content-Type: text/csv; charset=utf-8"); 
	header("Content-disposition: attachment; filename=\"".$_GET["Filename"].".csv\"");

	include "LoaderAjax.php";
	include "DBConnection.php";
	
	echo utf8_decode(DBRequest::getValuesExcel($_GET["Request"]));
?>