// Promotion
//
autoCompleteSelectSimple("Promotion", "Promotion", "Scolariteinterne", "ORDER BY Promotion DESC");

// Charge
//
autoComplete("#Charge", "Charge", "AffectationCharge", "");

personnelListerJQuery();

function personnelListerJQuery() {
	var arr = new Array();
		
	// Fonction
	//
	arr.push(" P1.Fonction = 'Enseignant' ");

	// Caracteristique d'un eleve non radier
	//
	arr.push(" P1.DateRadiation IS NULL ");
	arr.push(" P1.idPersonnel NOT IN ( Select P.idPersonnel From Personnel as P, AffectationCharge AS AC Where P.DateRadiation IS NULL And P.idPersonnel = AC.Enseignant And AC.Annee = '"+document.getElementById("Promotion").value+"' )");
  	
  	var data = getValues("DISTINCT P1.*", "Personnel as P1", constrainGenerator(arr) + " ORDER BY P1.Nom "); 	
  	  	
  	var select = document.getElementById("Personnel");
  	while (select.firstChild)
  		select.removeChild(select.firstChild);

  	if (data.length <= 0)
  		document.getElementById("submit").style.visibility = "hidden";
  	else
  		document.getElementById("submit").style.visibility = "";
 	
 	for (var i = 0 ; i < data.length ; i++) {
		// Personnel
		//
		var libelle = data[i]["Civilite"] + " " + data[i]["Nom"];
		if (data[i]["NomUsage"] != undefined)
			libelle = libelle + " (" + data[i]["NomUsage"] + ")";
		libelle = libelle + " " + data[i]["Prenom"];
		addCheckField(select, "Personnels", libelle, data[i]["idPersonnel"], "");
	}
}

function personnelAffecter() {
	var information = "";
	var parent = document.getElementsByName('Personnels');
	var erreur = "";
	
	document.getElementById("Promotion").className = "valid";
	document.getElementById("Statut").className = "valid";
	
	// Charge
	//
	document.getElementById("Charge").value = document.getElementById("Charge").value.capitalize();
 	if(document.getElementById("Charge").value == "") {
 		document.getElementById("Charge").className = "invalid";
		erreur = erreur + "<p>La charge est vide</p>";
  	}
  	else document.getElementById("Charge").className = "valid";

	if (erreur == "")
	for (var i = 0 ; i < parent.length ; i++) {
		if (parent[i].checked) {
			// Elaboration du message de confirmation
			//		
			information = information + 
						"<p>" + parent[i].parentNode.firstChild.data +
						" est affecter à la charge " + 
						document.getElementById("Charge").value + "</p>";
		
			// Ajout de la charge
			//
			file(	"phpscripts/DBExecuteQuery.php",
				"Request=Insert Into "+
					"AffectationCharge (Charge, Enseignant, Annee, Statut)"+
				"Values ("+
					nullableValueInsert(document.getElementById("Charge").value)+","+
					nullableValueInsert(parent[i].value)+","+
					nullableValueInsert(document.getElementById("Promotion").value)+","+
					nullableValueInsert(document.getElementById("Statut").value)+")");
		}
	}
	
	if (erreur == "") {
		document.getElementById("finish").style.display = "block";
		document.getElementById("finish").className = "finishValid";
		if (information == "")
			document.getElementById("finish").innerHTML = "<p>Aucun enseignant n'a été sélectionné</p>";
		else 
			document.getElementById("finish").innerHTML = information;
	}
	else {
		document.getElementById("finish").style.display = "block";
		document.getElementById("finish").className = "finishInvalid";
		document.getElementById("finish").innerHTML = erreur;
	}
}