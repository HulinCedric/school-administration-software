<?php 
	include "LoaderAjax.php";
	include "DBConnection.php";

	echo DBRequest::executeQuery($_POST["Request"]);
?>