// Identité
//
autoComplete("#Nom", "Nom", "Enfant", "");
autoComplete("#Prenom", "Prenom", "Enfant", "");
autoComplete("#NomUsage", "NomUsage", "Enfant", "");
autoComplete("#Nationalite", "Nationalite", "Enfant", "");

// Lieu de naissance
//
autoComplete("#CommuneNaissance", "CommuneNaissance", "Enfant", "");
autoComplete("#DepartementNaissance", "DepartementNaissance", "Enfant", "");
autoComplete("#PaysNaissance", "PaysNaissance", "Enfant", "");

// Responsable Legal identité
//
autoCompleteSelectResponsable("Mère", "WHERE Civilite IN ('Mlle', 'Mme')");
autoCompleteSelectResponsable("Père", "WHERE Civilite = 'M.'");
autoCompleteSelectResponsable("Autre", "");

matchEleveField();

function matchEleveField() {
	if (document.getElementById("idEnfant").value == "") return;
	
	var arr = new Array();
	
 	arr.push(" idEnfant = '" + document.getElementById("idEnfant").value + "' ");
 	arr.push(" Promotion = '" + document.getElementById("PromoModifier").value + "' ");
	arr.push(" idEnfant = Enfant ");
 	 		 	 		
	var Enfant = getValues("*", "Enfant, Scolariteinterne", constrainGenerator(arr));

	matchDataField("INE", Enfant[0]["INE"]);
	matchDataField("RegistreMatricule", Enfant[0]["RegistreMatricule"]);
		
	matchCheckField("Sexe", Enfant[0]["Sexe"]);
	matchDataField("Nom", Enfant[0]["Nom"]);
	matchDataField("NomUsage", Enfant[0]["NomUsage"]);
	matchDataField("Prenom", Enfant[0]["Prenom"]);
	matchDataField("DateNaissance", dateReverse(Enfant[0]["DateNaissance"]));
	matchDataField("Nationalite", Enfant[0]["Nationalite"]);

	matchDataField("CommuneNaissance", Enfant[0]["CommuneNaissance"]);
	matchDataField("DepartementNaissance", Enfant[0]["DepartementNaissance"]);
	matchDataField("PaysNaissance", Enfant[0]["PaysNaissance"]);
	
	arr = new Array();
 	arr.push(" Enfant = '" + document.getElementById("idEnfant").value +"' ");
  	var Responsables = getValues("*", "AssociationResponsableLegal", constrainGenerator(arr));
	for (var i=0 ; i < Responsables.length ; i++) {
		matchSelectField(Responsables[i]["Statut"], Responsables[i]["Responsable"]);
		matchCheckField(Responsables[i]["Statut"]+"AutoriteParentale", Responsables[i]["AutoriteParentale"]);
		if (Responsables[i]["AdressePrincipale"] == "Oui")
			matchCheckField("AdressePrincipale", Responsables[i]["Statut"]);
	}
	
	matchDataField("NiveauModifier", Enfant[0]["Niveau"]);
	matchSelectField("Niveau", Enfant[0]["Niveau"]);
	niveauChanged(Enfant[0]["Niveau"]);
	matchCheckField("Sieste", Enfant[0]["Sieste"]);
	matchDataField("LangueVivante1", Enfant[0]["LangueVivante1"]);
	matchDataField("LangueVivante2", Enfant[0]["LangueVivante2"]);
	matchCheckField("AutorisationSortie", Enfant[0]["AutorisationSortie"]);

	matchCheckField("Boursier", Enfant[0]["Boursier"]);
	matchCheckField("Regime", Enfant[0]["Regime"]);
	matchCheckField("ResponsabiliteCivile", Enfant[0]["ResponsabiliteCivile"]);
	matchCheckField("IndividuelleAccident", Enfant[0]["IndividuelleAccident"]);
	matchDataField("CompagnieAssurance", Enfant[0]["CompagnieAssurance"]);
	matchDataField("NumeroPoliceAssurance", Enfant[0]["NumeroPoliceAssurance"]);
	matchCheckField("AttestationFournie", Enfant[0]["AttestationFournie"]);

	matchCheckField("PAI", Enfant[0]["PAI"]);
	matchCheckField("MDPH", Enfant[0]["MDPH"]);

	matchCheckField("GarderieMatin", Enfant[0]["GarderieMatin"]);
	matchCheckField("GarderieSoir", Enfant[0]["GarderieSoir"]);
	matchCheckField("DiffusionAdresseAssociation", Enfant[0]["DiffusionAdresseAssociation"]);
}

function eleveEnregistrer() {
	var ok = true;
	var erreur = "";

	// INE
	//
	document.getElementById("INE").className = "valid";
  	
  	// RegistreMatricule
  	//
  	document.getElementById("RegistreMatricule").className = "valid";
  		
	// Nom
	//
	document.getElementById("Nom").value = document.getElementById("Nom").value.capitalize();
  	if(document.getElementById("Nom").value == "") {
 		document.getElementById("Nom").className = "invalid";
 		ok = false;
		erreur = erreur + "<p>Le nom est vide</p>";
  	}
  	else
  	if(!verifcationAlphabeticSpace(document.getElementById("Nom").value)) {
 		document.getElementById("Nom").className = "invalid";
 		ok = false;
		erreur = erreur + "<p>Le nom n'est pas alphabétique</p>";
  	}
  	else document.getElementById("Nom").className = "valid";
  	
  	// Prenom
	//
	document.getElementById("Prenom").value = document.getElementById("Prenom").value.capitalize();
  	if(document.getElementById("Prenom").value == "") {
 		document.getElementById("Prenom").className = "invalid";
 		ok = false;
		erreur = erreur + "<p>Le prénom est vide</p>";
  	}
  	else
  	if(!verifcationAlphabeticSpace(document.getElementById("Prenom").value)) {
 		document.getElementById("Prenom").className = "invalid";
 		ok = false;
		erreur = erreur + "<p>Le prénom n'est pas alphabétique</p>";
  	}
  	else document.getElementById("Prenom").className = "valid";
  		
	// Sexe
  	//
	var Sexe = "";
	for(var i = 0; i < document.getElementsByName("Sexe").length; i++)
		if(document.getElementsByName("Sexe")[i].checked) Sexe = document.getElementsByName("Sexe")[i].value;
	if(Sexe == "") {
 		ok = false;
		erreur = erreur + "<p>Veuillez renseigner le sexe de l'enfant</p>";
  	}
	
	// NomUsage
	//
	document.getElementById("NomUsage").value = document.getElementById("NomUsage").value.capitalize();
  	if(document.getElementById("NomUsage").value == "")
 		document.getElementById("NomUsage").className = "valid";
  	else
  	if(!verifcationAlphabeticSpace(document.getElementById("NomUsage").value)) {
 		document.getElementById("NomUsage").className = "invalid";
 		ok = false;
		erreur = erreur + "<p>Le nom d'usage n'est pas alphabétique</p>";
  	}
  	else document.getElementById("NomUsage").className = "valid";

	// DateNaissance
	//
	if(document.getElementById("DateNaissance").value == "") {
 		document.getElementById("DateNaissance").className = "invalid";
 		ok = false;
		erreur = erreur + "<p>La date de naissance est vide</p>";
  	}
  	else document.getElementById("DateNaissance").className = "valid";
  	
  	// Nationalite
	//
	document.getElementById("Nationalite").value = document.getElementById("Nationalite").value.capitalize();
  	if(document.getElementById("Nationalite").value == "") {
 		document.getElementById("Nationalite").className = "invalid";
 		ok = false;
		erreur = erreur + "<p>La nationalité est vide</p>";
  	}
  	else
  	if(!verifcationAlphabeticSpace(document.getElementById("Nationalite").value)) {
 		document.getElementById("Nationalite").className = "invalid";
 		ok = false;
		erreur = erreur + "<p>La nationalité n'est pas alphabétique</p>";
  	}
  	else document.getElementById("Nationalite").className = "valid";
 	
 	// CommuneNaissance
	//
	document.getElementById("CommuneNaissance").value = document.getElementById("CommuneNaissance").value.capitalize();
 	if(document.getElementById("CommuneNaissance").value == "") {
 		document.getElementById("CommuneNaissance").className = "invalid";
 		ok = false;
		erreur = erreur + "<p>La commune est vide</p>";
  	}
  	else
  	if(!verifcationAlphabeticSpace(document.getElementById("CommuneNaissance").value)) {
 		document.getElementById("CommuneNaissance").className = "invalid";
 		ok = false;
		erreur = erreur + "<p>La commune n'est pas correct</p>";
  	}
  	else document.getElementById("CommuneNaissance").className = "valid";
 	
 	// DepartementNaissance
	//
	document.getElementById("DepartementNaissance").value = document.getElementById("DepartementNaissance").value.capitalize();
 	if(document.getElementById("DepartementNaissance").value == "") {
 		document.getElementById("DepartementNaissance").className = "invalid";
 		ok = false;
		erreur = erreur + "<p>La departement est vide</p>";
  	}
  	else
  	if(!verifcationAlphabeticSpace(document.getElementById("CommuneNaissance").value)) {
 		document.getElementById("DepartementNaissance").className = "invalid";
 		ok = false;
		erreur = erreur + "<p>La departement n'est pas correct</p>";
  	}
  	else document.getElementById("DepartementNaissance").className = "valid";
 	
 	// PaysNaissance
	//
	document.getElementById("PaysNaissance").value = document.getElementById("PaysNaissance").value.capitalize();
 	if(document.getElementById("PaysNaissance").value == "") {
 		document.getElementById("PaysNaissance").className = "invalid";
 		ok = false;
		erreur = erreur + "<p>Le pays de l'adresse est vide</p>";
  	}
  	else
  	if(!verifcationAlphabeticSpace(document.getElementById("PaysNaissance").value)) {
 		document.getElementById("PaysNaissance").className = "invalid";
 		ok = false;
		erreur = erreur + "<p>Le pays de l'adresse n'est pas correct</p>";
  	}
  	else document.getElementById("PaysNaissance").className = "valid";
 	
 	// Mère
	//
	if (document.getElementById("Mère").value != "") {
		// MèreAutoriteParentale
  		//
		var MèreAutoriteParentale = "";
		for(var i = 0; i < document.getElementsByName("MèreAutoriteParentale").length; i++)
			if(document.getElementsByName("MèreAutoriteParentale")[i].checked)
				MèreAutoriteParentale = document.getElementsByName("MèreAutoriteParentale")[i].value;
		if(MèreAutoriteParentale == "") {
		 	document.getElementById("Mère").className = "invalid";
 			ok = false;
			erreur = erreur + "<p>Veuillez renseigner l'autorité parentale de la mère</p>";
  		}
  		else document.getElementById("Mère").className = "valid";
  	}
  	else document.getElementById("Mère").className = "valid";
  	
  	// Père
	//
	if (document.getElementById("Père").value != "") {
		// PèreAutoriteParentale
  		//
		var PèreAutoriteParentale = "";
		for(var i = 0; i < document.getElementsByName("PèreAutoriteParentale").length; i++)
			if(document.getElementsByName("PèreAutoriteParentale")[i].checked)
				PèreAutoriteParentale = document.getElementsByName("PèreAutoriteParentale")[i].value;
		if(PèreAutoriteParentale == "") {
		 	document.getElementById("Père").className = "invalid";
 			ok = false;
			erreur = erreur + "<p>Veuillez renseigner l'autorité parentale du père</p>";
  		}
  		else document.getElementById("Père").className = "valid";
  	}
  	else document.getElementById("Père").className = "valid";
  	
  	// Autre responsable légal
	//
	if (document.getElementById("Autre").value != "") {
		// AutreAutoriteParentale
  		//
		var AutreAutoriteParentale = "";
		for(var i = 0; i < document.getElementsByName("AutreAutoriteParentale").length; i++)
			if(document.getElementsByName("AutreAutoriteParentale")[i].checked)
				AutreAutoriteParentale = document.getElementsByName("AutreAutoriteParentale")[i].value;
		if(AutreAutoriteParentale == "") {
		 	document.getElementById("Autre").className = "invalid";
 			ok = false;
			erreur = erreur + "<p>Veuillez renseigner l'autorité parentale du responsable légal</p>";
  		}
  		else document.getElementById("Autre").className = "valid";
  	}
  	else document.getElementById("Autre").className = "valid";
  	  	 
  	// Niveau
  	//
	if(document.getElementById("Niveau").value == "") {
 		document.getElementById("Niveau").className = "invalid";
 		ok = false;
		erreur = erreur + "<p>Veuillez renseigner le niveau scolaire de l'élève</p>";
  	}
  	else document.getElementById("Niveau").className = "valid";  	 
  	  	 	
  	// Sieste
  	//
  	var Sieste = "";
  	for(var i = 0; i < document.getElementsByName("Sieste").length; i++)
  		if(document.getElementsByName("Sieste")[i].checked)
			Sieste = document.getElementsByName("Sieste")[i].value;
	if (Sieste == "" && document.getElementById("SiesteBlock").style.display == "block") {
 		ok = false;
		erreur = erreur + "<p>Veuillez renseigner la sieste</p>";
  	}
  	
  	// LangueVivante1
  	//
	if(document.getElementById("LangueVivante1").value == "" && document.getElementById("LV1Block").style.display == "block") {
 		document.getElementById("LangueVivante1").className = "invalid";
 		ok = false;
		erreur = erreur + "<p>Veuillez renseigner la langue vivante 1</p>";
  	}
  	else document.getElementById("LangueVivante1").className = "valid";
  	
  	// LangueVivante2
  	//
	if(document.getElementById("LangueVivante2").value == "" && document.getElementById("LV2Block").style.display == "block") {
 		document.getElementById("LangueVivante2").className = "invalid";
 		ok = false;
		erreur = erreur + "<p>Veuillez renseigner la langue vivante 2</p>";
  	}
  	else document.getElementById("LangueVivante2").className = "valid";
  	
  	// AutorisationSortie
  	//
  	var AutorisationSortie = "";
  	for(var i = 0; i < document.getElementsByName("AutorisationSortie").length; i++)
  		if(document.getElementsByName("AutorisationSortie")[i].checked)
			AutorisationSortie = document.getElementsByName("AutorisationSortie")[i].value;
	if (AutorisationSortie == "" && document.getElementById("AutorisationSortieBlock").style.display == "block") {
 		ok = false;
		erreur = erreur + "<p>Veuillez renseigner l'autorisation de sortie</p>";
  	}
  	
  	// Boursier
  	//
  	var Boursier = "";
  	for(var i = 0; i < document.getElementsByName("Boursier").length; i++)
  		if(document.getElementsByName("Boursier")[i].checked)
			Boursier = document.getElementsByName("Boursier")[i].value;
	if (Boursier == "") {
 		ok = false;
		erreur = erreur + "<p>Veuillez renseigner la situation boursière de l'enfant</p>";
  	}
  	
  	// Regime
  	//
  	var Regime = "";
  	for(var i = 0; i < document.getElementsByName("Regime").length; i++)
  		if(document.getElementsByName("Regime")[i].checked)
			Regime = document.getElementsByName("Regime")[i].value;
	if (Regime == "") {
 		ok = false;
		erreur = erreur + "<p>Veuillez renseigner le régime de l'enfant</p>";
  	}
  	
  	// CompagnieAssurance
  	//
  	document.getElementById("CompagnieAssurance").value = document.getElementById("CompagnieAssurance").value.capitalize();
  	document.getElementById("CompagnieAssurance").className = "valid";
  	
  	// NumeroPoliceAssurance
  	//
  	document.getElementById("NumeroPoliceAssurance").value = document.getElementById("NumeroPoliceAssurance").value.capitalize();
  	document.getElementById("NumeroPoliceAssurance").className = "valid";
  	
  	// ResponsabiliteCivile
  	//
  	var ResponsabiliteCivile = "";
  	for(var i = 0; i < document.getElementsByName("ResponsabiliteCivile").length; i++)
  		if(document.getElementsByName("ResponsabiliteCivile")[i].checked)
			ResponsabiliteCivile = document.getElementsByName("ResponsabiliteCivile")[i].value;

	// IndividuelleAccident
  	//
  	var IndividuelleAccident = "";
  	for(var i = 0; i < document.getElementsByName("IndividuelleAccident").length; i++)
  		if(document.getElementsByName("IndividuelleAccident")[i].checked)
			IndividuelleAccident = document.getElementsByName("IndividuelleAccident")[i].value;
			
	// AttestationFournie
  	//
  	var AttestationFournie = "";
  	for(var i = 0; i < document.getElementsByName("AttestationFournie").length; i++)
  		if(document.getElementsByName("AttestationFournie")[i].checked)
			AttestationFournie = document.getElementsByName("AttestationFournie")[i].value;

	// PAI
  	//
  	var PAI = "";
  	for(var i = 0; i < document.getElementsByName("PAI").length; i++)
  		if(document.getElementsByName("PAI")[i].checked)
			PAI = document.getElementsByName("PAI")[i].value;

	// MDPH
  	//
  	var MDPH = "";
  	for(var i = 0; i < document.getElementsByName("MDPH").length; i++)
  		if(document.getElementsByName("MDPH")[i].checked)
			MDPH = document.getElementsByName("MDPH")[i].value;

	// GarderieMatin
  	//
  	var GarderieMatin = "";
  	for(var i = 0; i < document.getElementsByName("GarderieMatin").length; i++)
  		if(document.getElementsByName("GarderieMatin")[i].checked)
			GarderieMatin = document.getElementsByName("GarderieMatin")[i].value;

	// GarderieSoir
  	//
  	var GarderieSoir = "";
  	for(var i = 0; i < document.getElementsByName("GarderieSoir").length; i++)
  		if(document.getElementsByName("GarderieSoir")[i].checked)
			GarderieSoir = document.getElementsByName("GarderieSoir")[i].value;

	// DiffusionAdresseAssociation
  	//
  	var DiffusionAdresseAssociation = "";
  	for(var i = 0; i < document.getElementsByName("DiffusionAdresseAssociation").length; i++)
  		if(document.getElementsByName("DiffusionAdresseAssociation")[i].checked)
			DiffusionAdresseAssociation = document.getElementsByName("DiffusionAdresseAssociation")[i].value;

	// Traiter la reponse
    //
    if (ok) {
    	var idEnfant = document.getElementById("idEnfant").value;
						
		file(	"phpscripts/DBExecuteQuery.php",
				"Request=UPDATE "+
					"Enfant "+
				"SET "+
					nullableValueUpdate("INE", document.getElementById("INE").value)+","+
					nullableValueUpdate("RegistreMatricule", document.getElementById("RegistreMatricule").value)+","+

					nullableValueUpdate("Sexe", Sexe)+","+
					nullableValueUpdate("Nom", document.getElementById("Nom").value)+","+
					nullableValueUpdate("NomUsage", document.getElementById("NomUsage").value)+","+
					nullableValueUpdate("Prenom", document.getElementById("Prenom").value)+","+
					nullableValueUpdate("DateNaissance", dateReverse(document.getElementById("DateNaissance").value))+","+
					nullableValueUpdate("Nationalite", document.getElementById("Nationalite").value)+","+
					
					nullableValueUpdate("CommuneNaissance", document.getElementById("CommuneNaissance").value)+","+
					nullableValueUpdate("DepartementNaissance", document.getElementById("DepartementNaissance").value)+","+
					nullableValueUpdate("PaysNaissance", document.getElementById("PaysNaissance").value)+","+

					nullableValueUpdate("Niveau", document.getElementById("Niveau").value)+","+
					nullableValueUpdate("Sieste", Sieste)+","+
					nullableValueUpdate("LangueVivante1", document.getElementById("LangueVivante1").value)+","+
					nullableValueUpdate("LangueVivante2", document.getElementById("LangueVivante2").value)+","+
					
					nullableValueUpdate("Boursier", Boursier)+","+
					nullableValueUpdate("Regime", Regime)+","+
					
					nullableValueUpdate("ResponsabiliteCivile", ResponsabiliteCivile)+","+
					nullableValueUpdate("IndividuelleAccident", IndividuelleAccident)+","+
					nullableValueUpdate("CompagnieAssurance", document.getElementById("CompagnieAssurance").value)+","+
					nullableValueUpdate("NumeroPoliceAssurance", document.getElementById("NumeroPoliceAssurance").value)+","+
					nullableValueUpdate("AttestationFournie", AttestationFournie)+","+

					nullableValueUpdate("PAI", PAI)+","+
					nullableValueUpdate("MDPH", MDPH)+","+
					
					nullableValueUpdate("GarderieMatin", GarderieMatin)+","+
					nullableValueUpdate("GarderieSoir", GarderieSoir)+","+
					nullableValueUpdate("DiffusionAdresseAssociation", DiffusionAdresseAssociation)+
				" WHERE "+
					nullableValueUpdate("idEnfant", idEnfant) +";"
			);
			
			file(	"phpscripts/DBExecuteQuery.php",
				"Request=UPDATE "+
					"Scolariteinterne "+
				"SET "+
					nullableValueUpdate("AutorisationSortie", AutorisationSortie)+
				" WHERE "+
					nullableValueUpdate("Promotion", document.getElementById("PromoModifier").value)+" AND "+
					nullableValueUpdate("Enfant", idEnfant) +";"
			);
				
		file(	"phpscripts/DBExecuteQuery.php",
				"Request=DELETE FROM "+
					"AssociationResponsableLegal "+
				"WHERE "+
					nullableValueUpdate("idEnfant", idEnfant) +";"
			);

		// Affectation Responsable
		//
		if (document.getElementById("Mère").value != "") associationResponsable(idEnfant, "Mère");
		if (document.getElementById("Père").value != "") associationResponsable(idEnfant, "Père");
		if (document.getElementById("Autre").value != "") associationResponsable(idEnfant, "Autre");
		
		// Modifier Niveau d'inscription
		//
		if (document.getElementById("Niveau").value != document.getElementById("NiveauModifier").value) {
			// Remise a zéro des affectations
			//
			file(	"phpscripts/DBExecuteQuery.php",
				"Request=UPDATE "+
					"Scolariteinterne "+
				"SET "+
					nullableValueUpdate("Niveau", document.getElementById("Niveau").value)+","+
					nullableValueUpdate("Classe", "")+","+
					nullableValueUpdate("Module", "")+","+
					nullableValueUpdate("DemiGroupe", "")+","+
					nullableValueUpdate("AutorisationSortie", AutorisationSortie)+
				" WHERE "+
					nullableValueUpdate("Promotion", document.getElementById("PromoModifier").value)+" AND "+
					nullableValueUpdate("Enfant", idEnfant) +";"
			);
			
			// Suppression de la participation des classes vertes
			//
			file(	"phpscripts/DBExecuteQuery.php",
				"Request=DELETE FROM "+
					"Participant "+
				"WHERE "+
				 	"DateDebut BETWEEN '" + document.getElementById("PromoModifier").value.substring(0,4) + "/09/01' AND '" + document.getElementById("PromoModifier").value.substring(5) + "/08/31' AND "+
					nullableValueUpdate("Enfant", idEnfant) +";"
			);
		}
		
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

function niveauChanged(Niveau) {
	switch(Niveau) {
  		case "PS" :
  		case "MS":
		case "GS" :
		case "CP" :
		case "CE1" :
		case "CE2" :
		case "CM1" :
		case "CM2" :
			document.getElementById("LV1Block").style.display = "none";
			document.getElementById("LV2Block").style.display = "none";
			document.getElementById("AutorisationSortieBlock").style.display = "none";
			document.getElementById("SiesteBlock").style.display = "block";
			break;
		case "6e" :
		case "5e" :
		case "4e" :
		case "3e" :
			document.getElementById("LV1Block").style.display = "block";
			document.getElementById("LV2Block").style.display = "block";
			document.getElementById("AutorisationSortieBlock").style.display = "block";
			document.getElementById("SiesteBlock").style.display = "none";
			break;
		case "" :
			document.getElementById("LV1Block").style.display = "none";
			document.getElementById("LV2Block").style.display = "none";
			document.getElementById("SiesteBlock").style.display = "none";
			document.getElementById("AutorisationSortieBlock").style.display = "none";
			break;
  	}
  	
  	for(var i = 0; i < document.getElementsByName("Sieste").length; i++)
		document.getElementsByName("Sieste")[i].checked = "";
	for(var i = 0; i < document.getElementsByName("AutorisationSortie").length; i++)
		document.getElementsByName("AutorisationSortie")[i].checked = "";
  	document.getElementById("LangueVivante1").value = "";
	document.getElementById("LangueVivante2").value = "";
 	document.getElementById("LangueVivante1").className = "";
	document.getElementById("LangueVivante2").className = "";
}

function responsableChanged(id) {	
	if (document.getElementById(id).value == "")
		document.getElementById(id+"AutoriteParentaleBlock").style.display = "none";
	else
		document.getElementById(id+"AutoriteParentaleBlock").style.display = "block";
  	
  	document.getElementById("MèreAdressePrincipaleBlock").style.display = "none";
  	document.getElementById("PèreAdressePrincipaleBlock").style.display = "none";
  	document.getElementById("AutreAdressePrincipaleBlock").style.display = "none";

  	for(var i = 0; i < document.getElementsByName(id+"AutoriteParentale").length; i++)
		document.getElementsByName(id+"AutoriteParentale")[i].checked = "";
	
	var Responsables = new Array();
	if (document.getElementById("Mère").value != "") Responsables.push("Mère");
	if (document.getElementById("Père").value != "") Responsables.push("Père");
	if (document.getElementById("Autre").value != "") Responsables.push("Autre");	
	
	if (Responsables.length >= 2) {
		var adresse = "";
		var adresseDifferent = false;
		for (var i = 0 ; i < Responsables.length ; i++) {
			var arr = new Array();
		 	arr.push(" idResponsableLegal = '" + document.getElementById(Responsables[i]).value + "' ");
 		
 		  	var data = getValues("DISTINCT Adresse", "ResponsableLegal", constrainGenerator(arr));
			if (adresse == "") adresse = data[0]["Adresse"];
 			if (adresse != data[0]["Adresse"]) adresseDifferent = true;
 		}
	  	
	  	if (adresseDifferent) {
	  		for (var i = 0 ; i < Responsables.length ; i++)
				document.getElementById(Responsables[i]+"AdressePrincipaleBlock").style.display = "block";
	  	}
  	}
}

function associationResponsable(idEnfant, Statut) {
	var AdressePrincipale = "";
		for(var i = 0; i < document.getElementsByName("AdressePrincipale").length; i++)
			if(document.getElementsByName("AdressePrincipale")[i].checked)
				AdressePrincipale = document.getElementsByName("AdressePrincipale")[i].value;
	var AdressePValue;

	// Association responsable
	//
	if (document.getElementById(Statut).value != "") {
		var AutoriteParentale = "";
	  	for(var i = 0; i < document.getElementsByName(Statut+"AutoriteParentale").length; i++)
	  		if(document.getElementsByName(Statut+"AutoriteParentale")[i].checked)
				AutoriteParentale = document.getElementsByName(Statut+"AutoriteParentale")[i].value;
			
		if (AdressePrincipale == Statut) AdressePValue = "Oui";
		else AdressePValue = "Non";

		file("phpscripts/DBIdResultExecuteQuery.php", 
				"Request=INSERT INTO "+
					"AssociationResponsableLegal (Responsable, Enfant, Statut, AutoriteParentale, AdressePrincipale)"+
				"VALUES ("+
					nullableValueInsert(document.getElementById(Statut).value)+","+
					nullableValueInsert(idEnfant)+","+
					nullableValueInsert(Statut)+","+
					nullableValueInsert(AutoriteParentale)+","+
					nullableValueInsert(AdressePValue)+")"
			);			
	}
}