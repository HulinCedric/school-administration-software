<?php 
	include "LoaderAjax.php";
	include "DBConnection.php";
	
	$Voie =  $_POST["Voie"];
	$CodePostal = $_POST["CodePostal"];
	$Commune = $_POST["Commune"];
	$Pays = $_POST["Pays"];
	$Telephone = $_POST["Telephone"];
	
	$result = mysql_query("SELECT idAdresse FROM Adresse WHERE Voie = '$Voie' AND CodePostal = '$CodePostal'");

	if (mysql_num_rows($result) != 0) {
		$data = mysql_fetch_array($result);
		$idAdresse = $data["idAdresse"];
		mysql_query("	UPDATE Adresse SET 
									Voie = '$Voie',
									CodePostal = '$CodePostal',
									Commune = '$Commune',
									Pays = '$Pays',
									Telephone = '$Telephone'
								WHERE idAdresse = '$idAdresse'");
		echo $idAdresse;
	}
	else {
		mysql_query("INSERT INTO Adresse (Voie, CodePostal, Commune, Pays, Telephone) VALUES ('$Voie', '$CodePostal', '$Commune', '$Pays', '$Telephone');");
		echo mysql_insert_id();
	}
?>