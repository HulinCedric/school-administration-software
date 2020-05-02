<?php 
	header("Content-Type: text/xml; charset=utf-8"); 

	include "LoaderAjax.php";
	include "DBConnection.php";
	
	$request = "Select " . $_POST["value_name"] . " From ". $_POST["table"];
	
	if (isset($_POST["constrain"]) && $_POST["constrain"] != null)
		$request .= " " . $_POST["constrain"];
	
	echo DBRequest::getValuesXML($request);	
?>