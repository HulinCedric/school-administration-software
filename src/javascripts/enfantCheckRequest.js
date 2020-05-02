function enfantCheckUpdate(parent, label, value) { 	
 	for (var i = 0 ; i < parent.length ; i++) {
		if (parent[i].checked)
			file(	"phpscripts/DBExecuteQuery.php",
				"Request=UPDATE "+
					"Scolariteinterne "+
				"SET "+
					nullableValueUpdate(label, value)+
				" WHERE "+
					nullableValueUpdate("Enfant", parent[i].value) +" AND "+
					nullableValueUpdate("Promotion", document.getElementById("Promotion").value) +";"
			);
	}
}

function enfantRentrer() {
	var ok = true;
	var erreur = "";
	
	// DateEntreeEcole
	//
  	if(document.getElementById("DateEntreeEcole").value == "") {
 		document.getElementById("DateEntreeEcole").className = "invalid";
 		ok = false;
		erreur = erreur + "<p>La date d'entrée dans l'école est vide</p>";
  	}
  	else document.getElementById("DateEntreeEcole").className = "valid";
  	
	if (ok) {
		enfantCheckUpdate(document.getElementsByName('Enfants'), 'DateEntreeEcole', dateReverse(document.getElementById('DateEntreeEcole').value));
		document.getElementById("finish").style.display = "block";
		document.getElementById("finish").className = "finishValid";
		document.getElementById("finish").innerHTML = "<p>Les enfants sont maintenant scolarisés</p>";
	}
    else {
		document.getElementById("finish").style.display = "block";
		document.getElementById("finish").className = "finishInvalid";
		document.getElementById("finish").innerHTML = erreur;
    }
}

function enfantCommission() {
	var ok = true;
	var erreur = "";
	
	// DecisionCommission
	//
  	var DecisionCommission = "";
  	for(var i = 0; i < document.getElementsByName("DecisionCommission").length; i++)
  		if(document.getElementsByName("DecisionCommission")[i].checked)
			DecisionCommission = document.getElementsByName("DecisionCommission")[i].value;
	if (DecisionCommission == "") {
 		ok = false;
		erreur = erreur + "<p>Veuillez renseigner la décision de la commission</p>";
	}		
  	
	if (ok) {
		enfantCheckUpdate(document.getElementsByName('Enfants'), 'DecisionCommission', DecisionCommission);
		document.getElementById("finish").style.display = "block";
		document.getElementById("finish").className = "finishValid";
		document.getElementById("finish").innerHTML = "<p>La décision de la commission a bien été enregistré</p>";
	}
    else {
		document.getElementById("finish").style.display = "block";
		document.getElementById("finish").className = "finishInvalid";
		document.getElementById("finish").innerHTML = erreur;
    }
}

function enfantConfirmation() {
	var ok = true;
	var erreur = "";
	
	// ConfirmationParents
	//
  	var ConfirmationParents = "";
  	for(var i = 0; i < document.getElementsByName("ConfirmationParents").length; i++)
  		if(document.getElementsByName("ConfirmationParents")[i].checked)
			ConfirmationParents = document.getElementsByName("ConfirmationParents")[i].value;
	if (ConfirmationParents == "") {
 		ok = false;
		erreur = erreur + "<p>Veuillez renseigner la confirmation des parents</p>";
	}		
  	
	if (ok) {
		enfantCheckUpdate(document.getElementsByName('Enfants'), 'ConfirmationParents', ConfirmationParents);
		document.getElementById("finish").style.display = "block";
		document.getElementById("finish").className = "finishValid";
		document.getElementById("finish").innerHTML = "<p>La confirmation des parents a bien été enregistré</p>";
	}
    else {
		document.getElementById("finish").style.display = "block";
		document.getElementById("finish").className = "finishInvalid";
		document.getElementById("finish").innerHTML = erreur;
    }
}

function enfantRadier() {
	var ok = true;
	var erreur = "";
	
	// DateRadiation
	//
  	if(document.getElementById("DateRadiation").value == "") {
 		document.getElementById("DateRadiation").className = "invalid";
 		ok = false;
		erreur = erreur + "<p>La date de radiation est vide</p>";
  	}
  	else document.getElementById("DateRadiation").className = "valid";
  	
	if (ok) {
		var parent = document.getElementsByName('Enfants');
		for (var i = 0 ; i < parent.length ; i++)
			if (parent[i].checked)
				file(	"phpscripts/DBExecuteQuery.php",
					"Request=UPDATE "+
						"Enfant "+
					"SET "+
						nullableValueUpdate('DateRadiation', dateReverse(document.getElementById('DateRadiation').value))+
					" WHERE "+
						nullableValueUpdate("idEnfant", parent[i].value) +";"
				);
		
		document.getElementById("finish").style.display = "block";
		document.getElementById("finish").className = "finishValid";
		document.getElementById("finish").innerHTML = "<p>Radiation effectué</p>";
	}
    else {
		document.getElementById("finish").style.display = "block";
		document.getElementById("finish").className = "finishInvalid";
		document.getElementById("finish").innerHTML = erreur;
    }
}

function enfantMonter() {
	var okEnfant = true;
	var ok = true;
	var erreur = "";
	var information = "";
	
	// DateDemandeInscription
  	//
 	document.getElementById("PromotionInscription").className = "valid";
 	
 	// DateDemandeInscription
  	//
 	document.getElementById("NiveauInscription").className = "valid";
	
	// DateDemandeInscription
  	//
 	document.getElementById("DateDemandeInscription").className = "valid";
	
	// DecisionCommission
  	//
  	var DecisionCommission = "";
  	for(var i = 0; i < document.getElementsByName("DecisionCommission").length; i++)
  		if(document.getElementsByName("DecisionCommission")[i].checked)
			DecisionCommission = document.getElementsByName("DecisionCommission")[i].value;
	if (document.getElementById("DateDemandeInscription").value == "" && DecisionCommission != "") {
	 	document.getElementById("DateDemandeInscription").className = "invalid";
 		ok = false;
 		for(var i = 0; i < document.getElementsByName("DecisionCommission").length; i++)
  			document.getElementsByName("DecisionCommission")[i].checked = "";
		erreur = erreur + "<p>Veuillez renseigner la date de demande d'inscription</p>";
		DecisionCommission = "";
	}
	else document.getElementById("DateDemandeInscription").className = "valid";
		
	// ConfirmationParents
  	//
  	var ConfirmationParents = "";
  	for(var i = 0; i < document.getElementsByName("ConfirmationParents").length; i++)
  		if(document.getElementsByName("ConfirmationParents")[i].checked)
			ConfirmationParents = document.getElementsByName("ConfirmationParents")[i].value;
	if (DecisionCommission == "" && ConfirmationParents != "") {
 		ok = false;
 		for(var i = 0; i < document.getElementsByName("ConfirmationParents").length; i++)
  			document.getElementsByName("ConfirmationParents")[i].checked = "";
		erreur = erreur + "<p>Veuillez renseigner la decision de la commission</p>";
		ConfirmationParents = "";
	}
	
	// DateDemandeInscription
  	//
	if (ConfirmationParents == "" && document.getElementById("DateEntreeEcole").value != "") {
 		ok = false;
 		erreur = erreur + "<p>Veuillez renseigner la confirmation des parents</p>";
	}
	document.getElementById("DateEntreeEcole").className = "valid";
	
	// AutorisationSortie
  	//
	var AutorisationSortie = "";
	for(var i = 0; i < document.getElementsByName("AutorisationSortie").length; i++)
		if(document.getElementsByName("AutorisationSortie")[i].checked) Sexe = document.getElementsByName("AutorisationSortie")[i].value;
	if(AutorisationSortie == "") {
 		ok = false;
		erreur = erreur + "<p>Veuillez renseigner l'autorisation de sortie</p>";
  	}
	
	
	if (ok) {
	var parent = document.getElementsByName('Enfants');
	for (var i = 0 ; i < parent.length ; i++) {
		if (parent[i].checked) {
			var okEnfant = true;
		
			// Recuperation des données de l'enfant
			//
			var arr = new Array();	
 			arr.push(" idEnfant = '" + parent[i].value + "' ");		 	 		
			var data = getValues("*", "Enfant", constrainGenerator(arr));
			
			// Recuperation du prochain niveau
			//
			var Niveau = getNiveauSup(data[0]["Niveau"]);
						
			// Determination de l'identité de l'enfant
			//
			var libelle = data[0]["Nom"];
			if (data[0]["NomUsage"] != undefined)
				libelle = libelle + " (" + data[0]["NomUsage"] + ")";
			libelle = libelle + " " + data[0]["Prenom"];
			
			// Verification du prochain niveau de l'enfant
			//
			
			if (document.getElementById("NiveauInscription").value == "" ) {
				if (Niveau == "") {
					okEnfant=false;
					ok = false;
					erreur = erreur + "<p>Une erreur s'est produite avec l'enfant "+libelle+", niveau : " + data[0]["Niveau"] +"</p>";;
				}
			}
			else 
			if (getAnneNiveau(document.getElementById("NiveauInscription").value) < getAnneNiveau(data[0]["Niveau"])) {
					okEnfant=false;
					ok = false;
					erreur = erreur + "<p>Le niveau d'inscription ne peut être inférieur à celui actuel de "+libelle+" qui est " + data[0]["Niveau"] + "</p>";
			}
			else Niveau = document.getElementById("NiveauInscription").value;
	
			document.getElementById("PromotionInscription").value;
						
			// Verification de la bonne année scolaire
  			//
			if(file("phpscripts/DBCountResultQuery.php",
					"Request=SELECT Enfant FROM Scolariteinterne WHERE Enfant='" + parent[i].value +
					"' AND Promotion='" + document.getElementById("PromotionInscription").value + "'")!=0) {
					okEnfant=false;
					ok = false;
					erreur = erreur + "<p>L'élève "+ libelle +" est déjà inscrit pour l'année scolaire "+document.getElementById("PromotionInscription").value+"</p>";
			}
	
		
			// Elaboration d'une nouvelle entrée scolaire
			//
			if (okEnfant){
			file("phpscripts/DBExecuteQuery.php", 
				"Request=INSERT INTO "+
					"Scolariteinterne (Enfant, Promotion, "+
							"Classe, GroupeDeModule, Niveau, DemiGroupe, AutorisationSortie, " +
							"DateDemandeInscription, DecisionCommission, ConfirmationParents, DateEntreeEcole) " +
				"VALUES ("+
					nullableValueInsert(parent[i].value)+","+
					nullableValueInsert(document.getElementById("PromotionInscription").value)+","+
					
					"NULL,"+
					"NULL,"+
					nullableValueInsert(Niveau)+","+
					"NULL,"+
					nullableValueInsert(AutorisationSortie)+","+
					
					nullableValueInsert(dateReverse(document.getElementById("DateDemandeInscription").value))+","+
					nullableValueInsert(DecisionCommission)+","+
					nullableValueInsert(ConfirmationParents)+","+
					nullableValueInsert(dateReverse(document.getElementById("DateEntreeEcole").value))+")"
			);
			file(	"phpscripts/DBExecuteQuery.php",
				"Request=UPDATE "+
					"Enfant "+
				"SET "+
					nullableValueUpdate("Niveau", Niveau)+
				" WHERE "+
					nullableValueUpdate("idEnfant", parent[i].value) + ";"
			);
			
			information = information + "<p>"+libelle+" monte au niveau " + Niveau+"</p>";

			}
		}
	}
	}
	
	if (ok) {
			document.getElementById("finish").style.display = "block";
			document.getElementById("finish").className = "finishValid";
		if (information != "") 
			document.getElementById("finish").innerHTML = information + erreur;
		else 
			document.getElementById("finish").innerHTML = "<p>Aucun élève n'a été sélectionné</p>";
	}
    else {
		document.getElementById("finish").style.display = "block";
		document.getElementById("finish").className = "finishInvalid";
		document.getElementById("finish").innerHTML = information + erreur;
    }
}