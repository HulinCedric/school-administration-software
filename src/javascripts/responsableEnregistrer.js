autoComplete("#ResponsableNom", "Nom", "ResponsableLegal", "");
autoComplete("#ResponsablePrenom", "Prenom", "ResponsableLegal", "");
autoComplete("#ResponsableNomUsage", "NomUsage", "ResponsableLegal", "");
autoComplete("#ResponsableProfession", "Profession", "ResponsableLegal", "");
autoComplete("#ResponsableVoie", "Voie", "Adresse", "");
autoComplete("#ResponsableCodePostal", "CodePostal", "Adresse", "");
autoComplete("#ResponsableCommune", "Commune", "Adresse", "");
autoComplete("#ResponsablePays", "Pays", "Adresse", "");
autoComplete("#ResponsableTelephone", "Telephone", "Adresse", "");

matchResponsableField();

function matchResponsableField() {
	if (document.getElementById("idResponsableLegal").value == "") return;
	var arr = new Array();
	
 	arr.push(" idResponsableLegal = '" + document.getElementById("idResponsableLegal").value + "' ");
 	arr.push(" Adresse = idAdresse ");

  	var constrain = constrainGenerator(arr);
 	 		
	var Responsables = getValues("*", "ResponsableLegal, Adresse", constrain);

  	document.getElementById("ResponsableVoie").value = Responsables[0]["Voie"]; 
	document.getElementById("ResponsableCodePostal").value = Responsables[0]["CodePostal"];
	document.getElementById("ResponsableCommune").value = Responsables[0]["Commune"];
	document.getElementById("ResponsablePays").value = Responsables[0]["Pays"];
	document.getElementById("ResponsableNom").value = Responsables[0]["Nom"];
	document.getElementById("ResponsablePrenom").value = Responsables[0]["Prenom"];
    if (Responsables[0]["Telephone"] != undefined)
    	document.getElementById("ResponsableTelephone").value = Responsables[0]["Telephone"];
	for(i = 0; i < document.getElementsByName("ResponsableCivilite").length; i++)
		if(document.getElementsByName("ResponsableCivilite")[i].value == Responsables[0]["Civilite"])
			document.getElementsByName("ResponsableCivilite")[i].checked="checked";
	if (Responsables[0]["NomUsage"] != undefined)
		document.getElementById("ResponsableNomUsage").value = Responsables[0]["NomUsage"];
	if (Responsables[0]["Profession"] != undefined)
		document.getElementById("ResponsableProfession").value = Responsables[0]["Profession"];
	if (Responsables[0]["Mail"] != undefined)
		document.getElementById("ResponsableMail").value = Responsables[0]["Mail"];
	if (Responsables[0]["TelephonePortable"] != undefined)
		document.getElementById("ResponsableTelephonePortable").value = Responsables[0]["TelephonePortable"];
	if (Responsables[0]["TelephoneProfessionnel"] != undefined)
		document.getElementById("ResponsableTelephoneProfessionnel").value = Responsables[0]["TelephoneProfessionnel"];
}

function responsableEnregistrer() {
	var ok = true;
	var erreur = "";
	
	// Traiter la civilité
	//
	var Civilite = "";
	for(i = 0; i < document.getElementsByName("ResponsableCivilite").length; i++)
		if(document.getElementsByName("ResponsableCivilite")[i].checked) Civilite = document.getElementsByName("ResponsableCivilite")[i].value;
	if(Civilite == "") {
 		ok = false;
		erreur = erreur + "<p>Veuillez sélectionner une civilité</p>";
  	}
		
	// Traiter le nom
	//
  	if(document.getElementById("ResponsableNom").value == "") {
 		document.getElementById("ResponsableNom").className = "invalid";
 		ok = false;
		erreur = erreur + "<p>Le nom est vide</p>";
  	}
  	else
  	if(!verifcationAlphabeticSpace(document.getElementById("ResponsableNom").value)) {
 		document.getElementById("ResponsableNom").className = "invalid";
 		ok = false;
		erreur = erreur + "<p>Le nom n'est pas alphabétique</p>";
  	}
  	else document.getElementById("ResponsableNom").className = "valid";
  	
  	// Traiter le prenom
	//
  	if(document.getElementById("ResponsablePrenom").value == "") {
 		document.getElementById("ResponsablePrenom").className = "invalid";
 		ok = false;
		erreur = erreur + "<p>Le prénom est vide</p>";
  	}
  	else
  	if(!verifcationAlphabeticSpace(document.getElementById("ResponsablePrenom").value)) {
 		document.getElementById("ResponsablePrenom").className = "invalid";
 		ok = false;
		erreur = erreur + "<p>Le prénom n'est pas alphabétique</p>";
  	}
  	else document.getElementById("ResponsablePrenom").className = "valid";
  	
  	// Verification identité
  	//
  	if (document.getElementById("idResponsableLegal").value == "")
  		if (ok)
   			if(file("phpscripts/DBCountResultQuery.php",
  					"Request=SELECT idResponsableLegal FROM ResponsableLegal WHERE Nom='" + document.getElementById("ResponsableNom").value +
  					"' AND Prenom='" + document.getElementById("ResponsablePrenom").value + "'")!=0) {
				document.getElementById("ResponsableNom").className = "invalid";
				document.getElementById("ResponsablePrenom").className = "invalid";
				ok = false;
				erreur = erreur + "<p>Cette personne est déjà connu</p>";
			}
	
	// Traiter le nom d'usage
	//
  	if(document.getElementById("ResponsableNomUsage").value == "") {
 		document.getElementById("ResponsableNomUsage").className = "valid";
  	}
  	else
  	if(!verifcationAlphabeticSpace(document.getElementById("ResponsableNomUsage").value)) {
 		document.getElementById("ResponsableNomUsage").className = "invalid";
 		ok = false;
		erreur = erreur + "<p>Le nom d'usage n'est pas alphabétique</p>";
  	}
  	else document.getElementById("ResponsableNomUsage").className = "valid";

	// Traiter la profession
	//
	document.getElementById("ResponsableProfession").className = "valid";
  	
  	// Traiter la voie
	//
  	if(document.getElementById("ResponsableVoie").value == "") {
 		document.getElementById("ResponsableVoie").className = "invalid";
 		ok = false;
		erreur = erreur + "<p>La voie de l'adresse est vide</p>";
  	}
  	else document.getElementById("ResponsableVoie").className = "valid";
 	
 	// Traiter le code postal
	//
 	if(document.getElementById("ResponsableCodePostal").value == "") {
 		document.getElementById("ResponsableCodePostal").className = "invalid";
 		ok = false;
		erreur = erreur + "<p>Le code postal de l'adresse est vide</p>";
  	}
  	else
  	if(!verifcationNumeric(document.getElementById("ResponsableCodePostal").value)) {
 		document.getElementById("ResponsableCodePostal").className = "invalid";
 		ok = false;
		erreur = erreur + "<p>Le code postal de l'adresse n'est pas correct</p>";
  	}
  	else document.getElementById("ResponsableCodePostal").className = "valid";
 	
  	// Traiter le commune
	//
 	if(document.getElementById("ResponsableCommune").value == "") {
 		document.getElementById("ResponsableCommune").className = "invalid";
 		ok = false;
		erreur = erreur + "<p>La commune de l'adresse est vide</p>";
  	}
  	else
  	if(!verifcationAlphabeticSpace(document.getElementById("ResponsableCommune").value)) {
 		document.getElementById("ResponsableCommune").className = "invalid";
 		ok = false;
		erreur = erreur + "<p>La commune de l'adresse n'est pas correct</p>";
  	}
  	else document.getElementById("ResponsableCommune").className = "valid";
 	
 	// Traiter le pays
	//
 	if(document.getElementById("ResponsablePays").value == "") {
 		document.getElementById("ResponsablePays").className = "invalid";
 		ok = false;
		erreur = erreur + "<p>Le pays de l'adresse est vide</p>";
  	}
  	else
  	if(!verifcationAlphabeticSpace(document.getElementById("ResponsablePays").value)) {
 		document.getElementById("ResponsablePays").className = "invalid";
 		ok = false;
		erreur = erreur + "<p>Le pays de l'adresse n'est pas correct</p>";
  	}
  	else document.getElementById("ResponsablePays").className = "valid";
 	
 	// Traiter le numero de telephone fixe
	//
  	if(document.getElementById("ResponsableTelephone").value == "")
 		document.getElementById("ResponsableTelephone").className = "valid";
  	else
  	if(!verifcationNumeric(document.getElementById("ResponsableTelephone").value)) {
 		document.getElementById("ResponsableTelephone").className = "invalid";
 		ok = false;
		erreur = erreur + "<p>Le numéro de téléphone portable n'est pas correct</p>";
  	}
  	else document.getElementById("ResponsableTelephone").className = "valid";
 	
 	// Traiter le mail
	//
  	if(document.getElementById("ResponsableMail").value == "")
 		document.getElementById("ResponsableMail").className = "valid";
  	else
  	if(!verifcationMail(document.getElementById("ResponsableMail").value)) {
 		document.getElementById("ResponsableMail").className = "invalid";
 		ok = false;
		erreur = erreur + "<p>Le mail n'est pas correct</p>";
  	}
  	else document.getElementById("ResponsableMail").className = "valid";
  	
  	// Traiter le numero de telephone portable
	//
  	if(document.getElementById("ResponsableTelephoneProfessionnel").value == "")
 		document.getElementById("ResponsableTelephoneProfessionnel").className = "valid";
  	else
  	if(!verifcationNumeric(document.getElementById("ResponsableTelephoneProfessionnel").value)) {
 		document.getElementById("ResponsableTelephoneProfessionnel").className = "invalid";
 		ok = false;
		erreur = erreur + "<p>Le numéro de téléphone professionnel n'est pas correct</p>";
  	}
  	else document.getElementById("ResponsableTelephoneProfessionnel").className = "valid";
  	
  	// Traiter le numero de telephone portable
	//
  	if(document.getElementById("ResponsableTelephonePortable").value == "")
 		document.getElementById("ResponsableTelephonePortable").className = "valid";
  	else
  	if(!verifcationNumeric(document.getElementById("ResponsableTelephonePortable").value)) {
 		document.getElementById("ResponsableTelephonePortable").className = "invalid";
 		ok = false;
		erreur = erreur + "<p>Le numéro de téléphone portable n'est pas correct</p>";
  	}
  	else document.getElementById("ResponsableTelephonePortable").className = "valid";
  	
	// Traiter la reponse
    //
    if (ok) {
    
    	// Verification de la correspondance de l'adresse
  		//
  		var Adresse = file("phpscripts/adresseEnregistrer.php",
  				"Voie=" + document.getElementById("ResponsableVoie").value + 
				"&CodePostal=" + document.getElementById("ResponsableCodePostal").value + 
				"&Commune=" + document.getElementById("ResponsableCommune").value + 
				"&Pays=" + document.getElementById("ResponsablePays").value + 
    			"&Telephone=" + document.getElementById("ResponsableTelephone").value);	

		if (document.getElementById("idResponsableLegal").value == "") 
		file(	"phpscripts/DBExecuteQuery.php", 
				"Request=INSERT INTO "+
					"ResponsableLegal (Civilite, Nom, NomUsage, Prenom, Adresse, Profession, TelephoneProfessionnel, TelephonePortable, Mail) "+ 				"VALUES ("+
					nullableValueInsert(Civilite)+","+
					nullableValueInsert(document.getElementById("ResponsableNom").value.capitalize())+","+
					nullableValueInsert(document.getElementById("ResponsableNomUsage").value.capitalize())+","+
					nullableValueInsert(document.getElementById("ResponsablePrenom").value.capitalize())+","+
					nullableValueInsert(Adresse)+","+
					nullableValueInsert(document.getElementById("ResponsableProfession").value)+","+
					nullableValueInsert(document.getElementById("ResponsableTelephoneProfessionnel").value)+","+
					nullableValueInsert(document.getElementById("ResponsableTelephonePortable").value)+","+
					nullableValueInsert(document.getElementById("ResponsableMail").value)+");"
			);
		else
		file(	"phpscripts/DBExecuteQuery.php",
				"Request=UPDATE "+
					"ResponsableLegal "+
				"SET "+
					nullableValueUpdate("Civilite", Civilite) + ", "+
					nullableValueUpdate("Nom",document.getElementById("ResponsableNom").value.capitalize()) + ", "+
					nullableValueUpdate("NomUsage", document.getElementById("ResponsableNomUsage").value.capitalize())+", "+
					nullableValueUpdate("Prenom", document.getElementById("ResponsablePrenom").value.capitalize()) + ", "+
					nullableValueUpdate("Adresse", Adresse) + ", "+
					nullableValueUpdate("Profession", document.getElementById("ResponsableProfession").value)+", "+
					nullableValueUpdate("TelephoneProfessionnel", document.getElementById("ResponsableTelephoneProfessionnel").value)+", "+
					nullableValueUpdate("TelephonePortable", document.getElementById("ResponsableTelephonePortable").value)+", "+
					nullableValueUpdate("Mail", document.getElementById("ResponsableMail").value)+
				"WHERE "+
					nullableValueUpdate("idResponsableLegal", document.getElementById("idResponsableLegal").value) +";"
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