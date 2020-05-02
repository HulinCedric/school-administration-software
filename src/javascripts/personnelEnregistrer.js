autoComplete("#PersonnelNom", "Nom", "Personnel", "");
autoComplete("#PersonnelPrenom", "Prenom", "Personnel", "");
autoComplete("#PersonnelNomUsage", "NomUsage", "Personnel", "");
autoComplete("#PersonnelVoie", "Voie", "Adresse", "");
autoComplete("#PersonnelCodePostal", "CodePostal", "Adresse", "");
autoComplete("#PersonnelCommune", "Commune", "Adresse", "");
autoComplete("#PersonnelPays", "Pays", "Adresse", "");
autoComplete("#PersonnelTelephone", "Telephone", "Adresse", "");

matchPersonnelField();

function matchPersonnelField() {
	if (document.getElementById("idPersonnel").value == "") return;
	var arr = new Array();
		
 	arr.push(" idPersonnel = '" + document.getElementById("idPersonnel").value + "' ");
 	arr.push(" Adresse = idAdresse ");
 		
  	var constrain = constrainGenerator(arr);
 	 		
	var Personnels = getValues("*", "Personnel, Adresse", constrain);

  	document.getElementById("PersonnelVoie").value = Personnels[0]["Voie"]; 
	document.getElementById("PersonnelCodePostal").value = Personnels[0]["CodePostal"];
	document.getElementById("PersonnelCommune").value = Personnels[0]["Commune"];
	document.getElementById("PersonnelPays").value = Personnels[0]["Pays"];
	document.getElementById("DateEntreeEcole").value = dateReverse(Personnels[0]["DateEntreeEcole"]);
	document.getElementById("PersonnelNom").value = Personnels[0]["Nom"];
	document.getElementById("PersonnelPrenom").value = Personnels[0]["Prenom"];
	document.getElementById("Fonction").value = Personnels[0]["Fonction"];
 	for(i = 0; i < document.getElementsByName("PersonnelCivilite").length; i++)
		if(document.getElementsByName("PersonnelCivilite")[i].value == Personnels[0]["Civilite"])
			document.getElementsByName("PersonnelCivilite")[i].checked="checked";
    if (Personnels[0]["Telephone"] != undefined)
    	document.getElementById("PersonnelTelephone").value = Personnels[0]["Telephone"];
	if (Personnels[0]["NomUsage"] != undefined)
		document.getElementById("PersonnelNomUsage").value = Personnels[0]["NomUsage"];
	if (Personnels[0]["Mail"] != undefined)
		document.getElementById("PersonnelMail").value = Personnels[0]["Mail"];
	if (Personnels[0]["TelephonePortable"] != undefined)
		document.getElementById("PersonnelTelephonePortable").value = Personnels[0]["TelephonePortable"];
}

function personnelEnregistrer() {
	var ok = true;
	var erreur = "";
	
	// Traiter la date d'entrée dans l'école
	//
	if(document.getElementById("DateEntreeEcole").value == "") {
 		document.getElementById("DateEntreeEcole").className = "invalid";
 		ok = false;
		erreur = erreur + "<p>La date d'entrée dans l'école est vide</p>";
  	}
  	else document.getElementById("DateEntreeEcole").className = "valid";
	
	// Traiter la civilité
	//
	var Civilite = "";
	for(i = 0; i < document.getElementsByName("PersonnelCivilite").length; i++)
		if(document.getElementsByName("PersonnelCivilite")[i].checked) Civilite = document.getElementsByName("PersonnelCivilite")[i].value;
	if(Civilite == "") {
 		ok = false;
		erreur = erreur + "<p>Veuillez sélectionner une civilité</p>";
  	}
		
	// Traiter le nom
	//
  	if(document.getElementById("PersonnelNom").value == "") {
 		document.getElementById("PersonnelNom").className = "invalid";
 		ok = false;
		erreur = erreur + "<p>Le nom est vide</p>";
  	}
  	else
  	if(!verifcationAlphabeticSpace(document.getElementById("PersonnelNom").value)) {
 		document.getElementById("PersonnelNom").className = "invalid";
 		ok = false;
		erreur = erreur + "<p>Le nom n'est pas alphabétique</p>";
  	}
  	else document.getElementById("PersonnelNom").className = "valid";
  	
  	// Traiter le prenom
	//
  	if(document.getElementById("PersonnelPrenom").value == "") {
 		document.getElementById("PersonnelPrenom").className = "invalid";
 		ok = false;
		erreur = erreur + "<p>Le prénom est vide</p>";
  	}
  	else
  	if(!verifcationAlphabeticSpace(document.getElementById("PersonnelPrenom").value)) {
 		document.getElementById("PersonnelPrenom").className = "invalid";
 		ok = false;
		erreur = erreur + "<p>Le prénom n'est pas alphabétique</p>";
  	}
  	else document.getElementById("PersonnelPrenom").className = "valid";
  	
  	// Verification identité
  	//
  	if (document.getElementById("idPersonnel").value == "")
  		if (ok)
   			if(file("phpscripts/DBCountResultQuery.php",
   					"Request=SELECT idPersonnel FROM Personnel WHERE Nom='" + document.getElementById("PersonnelNom").value +
  					"' AND Prenom='" + document.getElementById("PersonnelPrenom").value + "'")!=0) {
				document.getElementById("PersonnelNom").className = "invalid";
				document.getElementById("PersonnelPrenom").className = "invalid";
				ok = false;
				erreur = erreur + "<p>Cette personne est déjà connu</p>";
			}

	// Traiter le nom d'usage
	//
  	if(document.getElementById("PersonnelNomUsage").value == "") {
 		document.getElementById("PersonnelNomUsage").className = "valid";
  	}
  	else
  	if(!verifcationAlphabeticSpace(document.getElementById("PersonnelNomUsage").value)) {
 		document.getElementById("PersonnelNomUsage").className = "invalid";
 		ok = false;
		erreur = erreur + "<p>Le nom d'usage n'est pas alphabétique</p>";
  	}
  	else document.getElementById("PersonnelNomUsage").className = "valid";

	// Traiter la fonction
	//
  	if(document.getElementById("Fonction").value == "") {
 		document.getElementById("Fonction").className = "invalid";
 		ok = false;
		erreur = erreur + "<p>La fonction est vide</p>";
  	}
  	else document.getElementById("Fonction").className = "valid";
  	
  	// Traiter la voie
	//
  	if(document.getElementById("PersonnelVoie").value == "") {
 		document.getElementById("PersonnelVoie").className = "invalid";
 		ok = false;
		erreur = erreur + "<p>La voie de l'adresse est vide</p>";
  	}
  	else document.getElementById("PersonnelVoie").className = "valid";
 	
 	// Traiter le code postal
	//
 	if(document.getElementById("PersonnelCodePostal").value == "") {
 		document.getElementById("PersonnelCodePostal").className = "invalid";
 		ok = false;
		erreur = erreur + "<p>Le code postal de l'adresse est vide</p>";
  	}
  	else
  	if(!verifcationNumeric(document.getElementById("PersonnelCodePostal").value)) {
 		document.getElementById("PersonnelCodePostal").className = "invalid";
 		ok = false;
		erreur = erreur + "<p>Le code postal de l'adresse n'est pas correct</p>";
  	}
  	else document.getElementById("PersonnelCodePostal").className = "valid";
 	
  	// Traiter le commune
	//
 	if(document.getElementById("PersonnelCommune").value == "") {
 		document.getElementById("PersonnelCommune").className = "invalid";
 		ok = false;
		erreur = erreur + "<p>La commune de l'adresse est vide</p>";
  	}
  	else
  	if(!verifcationAlphabeticSpace(document.getElementById("PersonnelCommune").value)) {
 		document.getElementById("PersonnelCommune").className = "invalid";
 		ok = false;
		erreur = erreur + "<p>La commune de l'adresse n'est pas correct</p>";
  	}
  	else document.getElementById("PersonnelCommune").className = "valid";
 	
 	// Traiter le pays
	//
 	if(document.getElementById("PersonnelPays").value == "") {
 		document.getElementById("PersonnelPays").className = "invalid";
 		ok = false;
		erreur = erreur + "<p>Le pays de l'adresse est vide</p>";
  	}
  	else
  	if(!verifcationAlphabeticSpace(document.getElementById("PersonnelPays").value)) {
 		document.getElementById("PersonnelPays").className = "invalid";
 		ok = false;
		erreur = erreur + "<p>Le pays de l'adresse n'est pas correct</p>";
  	}
  	else document.getElementById("PersonnelPays").className = "valid";
 	
 	// Traiter le numero de telephone fixe
	//
  	if(document.getElementById("PersonnelTelephone").value == "")
 		document.getElementById("PersonnelTelephone").className = "valid";
  	else
  	if(!verifcationNumeric(document.getElementById("PersonnelTelephone").value)) {
 		document.getElementById("PersonnelTelephone").className = "invalid";
 		ok = false;
		erreur = erreur + "<p>Le numéro de téléphone portable n'est pas correct</p>";
  	}
  	else document.getElementById("PersonnelTelephone").className = "valid";
 	
 	// Traiter le mail
	//
  	if(document.getElementById("PersonnelMail").value == "")
 		document.getElementById("PersonnelMail").className = "valid";
  	else
  	if(!verifcationMail(document.getElementById("PersonnelMail").value)) {
 		document.getElementById("PersonnelMail").className = "invalid";
 		ok = false;
		erreur = erreur + "<p>Le mail n'est pas correct</p>";
  	}
  	else document.getElementById("PersonnelMail").className = "valid";
  	
  	// Traiter le numero de telephone portable
	//
  	if(document.getElementById("PersonnelTelephonePortable").value == "")
 		document.getElementById("PersonnelTelephonePortable").className = "valid";
  	else
  	if(!verifcationNumeric(document.getElementById("PersonnelTelephonePortable").value)) {
 		document.getElementById("PersonnelTelephonePortable").className = "invalid";
 		ok = false;
		erreur = erreur + "<p>Le numéro de téléphone portable n'est pas correct</p>";
  	}
  	else document.getElementById("PersonnelTelephonePortable").className = "valid";
  	
	// Traiter la reponse
    //
    if (ok) {
    
    	// Verification de la correspondance de l'adresse
  		//
  		var Adresse = file("phpscripts/adresseEnregistrer.php",
  				"Voie=" + document.getElementById("PersonnelVoie").value + 
				"&CodePostal=" + document.getElementById("PersonnelCodePostal").value + 
				"&Commune=" + document.getElementById("PersonnelCommune").value + 
				"&Pays=" + document.getElementById("PersonnelPays").value + 
    			"&Telephone=" + document.getElementById("PersonnelTelephone").value);
	
		if (document.getElementById("idPersonnel").value == "") 
		file(	"phpscripts/DBExecuteQuery.php", 
				"Request=INSERT INTO "+
					"Personnel (DateRadiation, DateEntreeEcole, Civilite, Nom, NomUsage, Prenom, Adresse, Fonction, TelephonePortable, Mail) "+ 
				"VALUES ("+
					"NULL,"+
					nullableValueInsert(dateReverse(document.getElementById("DateEntreeEcole").value))+","+
					nullableValueInsert(Civilite)+","+
					nullableValueInsert(document.getElementById("PersonnelNom").value.capitalize())+","+
					nullableValueInsert(document.getElementById("PersonnelNomUsage").value.capitalize())+","+
					nullableValueInsert(document.getElementById("PersonnelPrenom").value.capitalize())+","+
					nullableValueInsert(Adresse)+","+
					nullableValueInsert(document.getElementById("Fonction").value)+","+
					nullableValueInsert(document.getElementById("PersonnelTelephonePortable").value)+","+
					nullableValueInsert(document.getElementById("PersonnelMail").value)+");"
			);
		else
		file(	"phpscripts/DBExecuteQuery.php",
				"Request=UPDATE "+
					"Personnel "+
				"SET "+
					nullableValueUpdate("DateEntreeEcole", dateReverse(document.getElementById("DateEntreeEcole").value)) + ", "+
					nullableValueUpdate("Civilite", Civilite) + ", "+
					nullableValueUpdate("Nom", document.getElementById("PersonnelNom").value.capitalize()) + ", "+
					nullableValueUpdate("NomUsage", document.getElementById("PersonnelNomUsage").value.capitalize())+", "+
					nullableValueUpdate("Prenom", document.getElementById("PersonnelPrenom").value.capitalize())+", "+
					nullableValueUpdate("Adresse", Adresse)+", "+
					nullableValueUpdate("Fonction", document.getElementById("Fonction").value)+", "+
					nullableValueUpdate("TelephonePortable", document.getElementById("PersonnelTelephonePortable").value)+", "+
					nullableValueUpdate("Mail", document.getElementById("PersonnelMail").value)+
				"WHERE "+
					nullableValueUpdate("idPersonnel", document.getElementById("idPersonnel").value)+";"
			);
			
		document.getElementById("finish").style.display = "block";
		document.getElementById("finish").className = "finishValid";
		document.getElementById("finish").innerHTML = "<p>Enregistrement effectué</p>";
	}
    else {
		document.getElementById("finish").style.display = "block";
		document.getElementById("finish").className = "finishInvalid";
		document.getElementById("finish").innerHTML = erreur;
    }
}