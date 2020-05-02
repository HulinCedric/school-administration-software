<?php 
	include "LoaderAjax.php";
	include "DBConnection.php";

	echo DBRequest::getCountResultQuery($_POST["Request"]);
?>