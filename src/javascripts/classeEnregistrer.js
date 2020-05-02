// Promotion
//
autoCompleteSelectSimple("Promotion", "Promotion", "Scolariteinterne", "WHERE DateEntreeEcole IS NOT NULL ORDER BY Promotion DESC");

// Personnel
//
autoCompleteSelectEnseignant("Enseignant", "AND DateRadiation IS NULL");

// Service de cantine
//
autoCompleteSelectSimple("NomService", "NomService", "ServiceCantine", "ORDER BY HeureRepas ASC");

function niveauChanged(niveau) {
	// Vider l'espace de travail
	//
	emptySelect("Niveau2");
	addOptionField(document.getElementById("Niveau2"), "", "");
	
	// Gerer le cas d'un champ vide
	//
	if (niveau == "") {
		document.getElementById("Niveau2Block").style.display = "none";
		return;
	}
	
	// Gerer le cas normal
	//
	var niveauSup = getNiveauSup(niveau);
	if (niveauSup != "") {
		niveauSup = niveau;
		while ((niveauSup = getNiveauSup(niveauSup)) != "") 
			addOptionField(document.getElementById("Niveau2"), niveauSup, niveauSup);
		document.getElementById("Niveau2Block").style.display = "block";
	}
	else document.getElementById("Niveau2Block").style.display = "none";
}

function nomServiceChanged(nomService) {		
	// Gerer le cas d'un champ vide
	//
	if (nomService == "") {
		document.getElementById("HeureRepasBlock").style.display = "none";
		return;
	}

	// Gerer le cas normal
	//
	document.getElementById("HeureRepasBlock").style.display = "block";
	autoCompleteField("HeureRepas", "HeureRepas", "ServiceCantine", "WHERE NomService = '"+nomService+"'");
}


matchClasseField();

function matchClasseField() {
	if (document.getElementById("NomClasseModifier").value == "") return;
	if (document.getElementById("PromoModifier").value == "") return;
	
	var arr = new Array();
	
 	arr.push(" Nom = '" + document.getElementById("NomClasseModifier").value + "' ");
 	arr.push(" Promotion = '" + document.getElementById("PromoModifier").value + "' ");
 	 		 	 		
	var Classe = getValues("*", "Classe", constrainGenerator(arr));

	document.getElementById("Promotion").disabled="disabled";
	matchDataField("Promotion", Classe[0]["Promotion"]);
	
	document.getElementById("Niveau1").disabled="disabled";
	matchDataField("Niveau1", Classe[0]["Niveau1"]);
	niveauChanged(Classe[0]["Niveau1"]);
	document.getElementById("Niveau2").disabled="disabled";
	matchDataField("Niveau2", Classe[0]["Niveau2"]);
	
	matchDataField("Enseignant", Classe[0]["Enseignant"]);

	matchDataField("NomService", Classe[0]["ServiceCantine"]);
	nomServiceChanged(Classe[0]["ServiceCantine"]);
}

function classeEnregistrer() {
	var ok = true;
	var erreur = "";

	// Promotion
	//
  	if(document.getElementById("Promotion").value == "") {
 		document.getElementById("Promotion").className = "invalid";
 		ok = false;
		erreur = erreur + "<p>La promotion est vide</p>";
  	}
  	else document.getElementById("Promotion").className = "valid";
  	
  	// Niveau1
	//
  	if(document.getElementById("Niveau1").value == "") {
 		document.getElementById("Niveau1").className = "invalid";
 		ok = false;
		erreur = erreur + "<p>Le niveau de classe est vide</p>";
  	}
  	else document.getElementById("Niveau1").className = "valid";
  	
  	// Niveau2
	//
  	document.getElementById("Niveau2").className = "valid";

  	// Enseignant
	//
	document.getElementById("Enseignant").className = "valid";
  	
  	// NomService
	//
  	if(document.getElementById("NomService").value == "") {
 		document.getElementById("NomService").className = "invalid";
 		ok = false;
		erreur = erreur + "<p>Le service de cantine n'est pas renseigner</p>";
  	}
  	else document.getElementById("NomService").className = "valid";
  	
  	// HeureRepas
	//
  	document.getElementById("HeureRepas").className = "valid";
  	
  	// Verification existance
  	//
  	if (document.getElementById("NomClasseModifier").value == "")
  		if (ok)
   			if(file("phpscripts/DBCountResultQuery.php",
  					"Request=SELECT * FROM Classe WHERE Promotion='" + document.getElementById("Promotion").value +
  					"' AND Niveau1 ='" + document.getElementById("Niveau1").value + "' AND Niveau2 =" + nullableValueInsert(document.getElementById("Niveau2").value) + " AND Enseignant = '" + document.getElementById("Enseignant").value + "'")!=0) {
				document.getElementById("Promotion").className = "invalid";
				document.getElementById("Niveau1").className = "invalid";
				document.getElementById("Niveau2").className = "invalid";
				document.getElementById("Enseignant").className = "invalid";
				ok = false;
				erreur = erreur + "<p>Cette classe existe déjà</p>";
			}
	
	// Traiter la reponse
    //
    if (ok) {
    	var NomClasseModifier = document.getElementById("NomClasseModifier").value;
    	var PromoModifier = document.getElementById("PromoModifier").value;
    	var NomClasseNew = getNomClasse(document.getElementById("Niveau1").value, document.getElementById("Niveau2").value, document.getElementById("Enseignant").value);
    	
		if (NomClasseModifier == "")
			file("phpscripts/DBExecuteQuery.php", 
				"Request=INSERT INTO "+
					"Classe (Nom, Promotion, Enseignant, Niveau1, Niveau2, ServiceCantine) "+ 			
				"VALUES ("+
					nullableValueInsert(NomClasseNew)+","+
					nullableValueInsert(document.getElementById("Promotion").value)+","+
					nullableValueInsert(document.getElementById("Enseignant").value)+","+
					nullableValueInsert(document.getElementById("Niveau1").value)+","+
					nullableValueInsert(document.getElementById("Niveau2").value)+","+
					nullableValueInsert(document.getElementById("NomService").value)+
				")"
			);
		else {
			file("phpscripts/DBExecuteQuery.php",
				"Request=UPDATE "+
					"Classe "+
				"SET "+
					nullableValueUpdate("Nom", NomClasseNew)+","+
					nullableValueUpdate("Promotion", document.getElementById("Promotion").value)+","+
					nullableValueUpdate("Enseignant", document.getElementById("Enseignant").value)+","+
					nullableValueUpdate("Niveau1", document.getElementById("Niveau1").value)+","+
					nullableValueUpdate("Niveau2", document.getElementById("Niveau2").value)+","+
					nullableValueUpdate("ServiceCantine", document.getElementById("NomService").value)+
				" WHERE "+
					nullableValueUpdate("Nom", NomClasseModifier) + " AND " +
					nullableValueUpdate("Promotion", PromoModifier) + ";"
			);
			
			file("phpscripts/DBExecuteQuery.php",
				"Request=UPDATE "+
					"Scolariteinterne "+
				"SET "+
					nullableValueUpdate("Classe", NomClasseNew)+
				" WHERE "+
					nullableValueUpdate("Classe", NomClasseModifier) + " AND " +
					nullableValueUpdate("Promotion", PromoModifier) + ";"
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