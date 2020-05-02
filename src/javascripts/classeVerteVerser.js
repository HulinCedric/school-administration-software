function calculPriceClasseVerte() {
	var PrixComptable = "0";
	var PrixAssociation = "0";
	var AideAssociation = "0";
	if (document.getElementById("PrixComptable").value != "")
		PrixComptable = document.getElementById("PrixComptable").value;
	if (document.getElementById("PrixAssociation").value != "")
		PrixAssociation = document.getElementById("PrixAssociation").value;
	if (document.getElementById("AideAssociation").value != "")
		AideAssociation = document.getElementById("AideAssociation").value;
	document.getElementById("Total").value = eval(PrixComptable +"+"+ PrixAssociation+"-"+AideAssociation)+" €";
}

function matchClasseVerteField() {
	lieuClasseVerteSelectedChange("");
	dateDebutClasseVerteSelectedChange("");

	if (document.getElementById("LieuModifier").value == "") return;
	if (document.getElementById("DateDebutModifier").value == "") return;
	
	var arr = new Array();
 	arr.push(" Lieu = '" + document.getElementById("LieuModifier").value + "' ");
 	arr.push(" DateDebut = '" + document.getElementById("DateDebutModifier").value + "' ");
 	 		 	 		
	var data = getValues("*", "ClasseVerte", constrainGenerator(arr));

	matchDataField("PrixComptable", data[0]["PrixComptable"]);
	matchDataField("PrixAssociation", data[0]["PrixAssociation"]);
	matchDataField("AideAssociation", data[0]["AideAssociation"]);
	
	arr = new Array();
	arr.push(" P.Lieu = '" + document.getElementById("LieuModifier").value + "' ");
	arr.push(" P.DateDebut = '" + document.getElementById("DateDebutModifier").value + "' ");
	arr.push(" P.Enfant = E.idEnfant ");

	var data = getValues("DISTINCT *", "Participant AS P, Enfant AS E", constrainGenerator(arr) + " Order By E.Nom");
	
	for (var i = 0 ; i < data.length ; i++) {
		var libelle = data[i]["Nom"];
		if (data[i]["NomUsage"] != undefined)
			libelle = libelle + " (" + data[i]["NomUsage"] + ")";
		libelle = libelle + " " + data[i]["Prenom"];
		addTitle(document.getElementById("EnfantsAffectes"), libelle, data[i]["idEnfant"], "");
		var div = addContainerOpen(document.getElementById("EnfantsAffectes"), "contain"+data[i]["idEnfant"]);
		var p = document.createElement("p");
		div.appendChild(p);
		addLabel(p, "Verser", "Verser"+data[i]["idEnfant"])
		addInputFieldSimple(p, "Verser"+data[i]["idEnfant"], "Verser"+data[i]["idEnfant"], 10, data[i]["PrixVerse"]);
	}
}



function classeVerteVerser() {
	var ok = true;
	var okBoucle = true;
	var erreur = "";	
	var information = "";
  	var arr = new Array();
	arr.push(" P.Lieu = '" + document.getElementById("LieuModifier").value + "' ");
	arr.push(" P.DateDebut = '" + document.getElementById("DateDebutModifier").value + "' ");

	var data = getValues("DISTINCT *", "Participant AS P", constrainGenerator(arr));
  
  	var maxValue = 	document.getElementById("PrixComptable").value;
  	if (maxValue < document.getElementById("Total").value)
  		maxValue = document.getElementById("Total").value;
  		
  	for (var i = 0 ; i < data.length ; i++) {
  		okBoucle = true;

  		// Versement
		//
  		if(document.getElementById("Verser"+data[i]["Enfant"]).value == "") {
 			document.getElementById("Verser"+data[i]["Enfant"]).className = "invalid";
 			ok = false;
 			okBoucle = false;
			erreur = erreur + "<p>Le versement de "+document.getElementById(data[i]["Enfant"]).firstChild.firstChild.data +" est vide</p>";
	  	}
	  	else
	  	if(!verifcationNumeric(document.getElementById("Verser"+data[i]["Enfant"]).value)) {
	 		document.getElementById("Verser"+data[i]["Enfant"]).className = "invalid";
	 		ok = false;
	 		okBoucle = false;
	 		erreur = erreur + "<p>Le versement de "+document.getElementById(data[i]["Enfant"]).firstChild.firstChild.data +" n'est pas numérique</p>";
	  	}
	  	else
	  	if(document.getElementById("Verser"+data[i]["Enfant"]).value > maxValue) {
	 		document.getElementById("Verser"+data[i]["Enfant"]).className = "invalid";
	 		ok = false;
	 		okBoucle = false;
	 		erreur = erreur + "<p>Le versement de "+document.getElementById(data[i]["Enfant"]).firstChild.firstChild.data +" est trop important</p>";
	  	}
	  	else
	  	if(document.getElementById("Verser"+data[i]["Enfant"]).value < 0) {
	 		document.getElementById("Verser"+data[i]["Enfant"]).className = "invalid";
	 		ok = false;
	 		okBoucle = false;
	 		erreur = erreur + "<p>Le versement de "+document.getElementById(data[i]["Enfant"]).firstChild.firstChild.data +" est invalide</p>";
	  	}
	  	else {
	  		document.getElementById("Verser"+data[i]["Enfant"]).className = "valid";
	  		information = information + "<p>Versement de "+document.getElementById(data[i]["Enfant"]).firstChild.firstChild.data +" enregistré</p>";
	  	}
	  	
	  	if (okBoucle) {
	  		file("phpscripts/DBExecuteQuery.php",
				"Request=UPDATE "+
					"Participant "+
				"SET "+
					nullableValueUpdate("PrixVerse", document.getElementById("Verser"+data[i]["Enfant"]).value)+
				" WHERE "+
					nullableValueUpdate("Enfant", data[i]["Enfant"]) + " AND " +
					nullableValueUpdate("Lieu", document.getElementById("LieuModifier").value) + " AND " +
					nullableValueUpdate("DateDebut", document.getElementById("DateDebutModifier").value) + ";"
			);
	  	}
	}
		
	// Traiter la reponse
    //
    if (ok) {    
		document.getElementById("finish").style.display = "block";
		document.getElementById("finish").className = "finishValid";
		document.getElementById("finish").innerHTML = information;
	}
    else {
		document.getElementById("finish").style.display = "block";
		document.getElementById("finish").className = "finishInvalid";
		document.getElementById("finish").innerHTML = erreur;
    }
}

matchClasseVerteField();
calculPriceClasseVerte();