<?php 
	include "LoaderAjax.php";
	include "DBConnection.php";

	DBRequest::executeQuery($_POST["Request"]);
	echo mysql_insert_id();
?>