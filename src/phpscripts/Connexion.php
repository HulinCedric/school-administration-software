<?php
	include "LoaderAjax.php";
	include "DBConnection.php";
	
	if(isset($_POST) && !empty($_POST['login'])) {
		extract($_POST);
		
		$_SESSION['user'] = UserDB::getUser($_POST['login']);
	}
?>