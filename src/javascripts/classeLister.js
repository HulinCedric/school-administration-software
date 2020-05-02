// Promotion
//
autoCompleteSelectSimple("Promotion", "Promotion", "Classe", "ORDER BY Promotion DESC");

// Personnel
//
autoCompleteSelectEnseignantByPromotion("Enseignant", document.getElementById("Promotion").value, "");

function anneeScolaireChangeClasse() {
	emptySelect("Enseignant");
	autoCompleteSelectEnseignantByPromotion("Enseignant", document.getElementById("Promotion").value, "");
	classeListerJQuery();
}

function classeListerJQuery() {
	idSelectedChange(-1);
	promotionSelectedChange("");
	var arr = new Array();

	// Traiter la promotion
 	//
	arr.push(" Promotion =  '" + document.getElementById("Promotion").value + "' ");

	// Traiter le niveau
 	//
 	if(document.getElementById("Niveau").value != "" )
 	 	arr.push(" (Niveau1 = '" + document.getElementById("Niveau").value + "' OR Niveau2 = '" + document.getElementById("Niveau").value + "') ");

	// Traiter l'enseignant
	//
	if(document.getElementById("Enseignant").value != "" )
		arr.push(" Enseignant =  '" + document.getElementById("Enseignant").value + "' ");

  	var data = getValues("DISTINCT *", "Classe",  constrainGenerator(arr) + " ORDER BY Nom ");

  	if (data.length > 0 && document.getElementById("submit").value != "Modifier")
  		document.getElementById("all").style.visibility = "";
  	else
  		document.getElementById("all").style.visibility = "hidden";  	  	
  	  	
  	var select = document.getElementById("Classe");
  	while (select.firstChild)
  		select.removeChild(select.firstChild);
  		
 	for (var i = 0 ; i < data.length ; i++) {
		
		// Classe
		//
		addSection(select, data[i]["Nom"], data[i]["Nom"], "nomClasseSelectedChange(this.id),promotionSelectedChange(document.getElementById('Promotion').value),classeAddInformationJQuery()");
		
		// DIV parent
		//
		var div = document.createElement("div");
		div.setAttribute("id", "contain"+data[i]["Nom"]);
		select.appendChild(div);
	}	
	$("#Classe").accordion("destroy");
	$("#Classe").accordion({active: false, collapsible: true, icons: icons, autoHeight: false, navigation: true});
}

function classeAddInformationJQuery() {
	var arr = new Array();
	arr.push(" C.Nom = '" + nomClasseSelected + "' ");
	arr.push(" C.Promotion =  '" + document.getElementById("Promotion").value + "' ");

	var data = getValues("DISTINCT *", "Classe AS C, Personnel AS P", constrainGenerator(arr));
	
	var div = document.getElementById("contain"+nomClasseSelected);
	div.innerHTML="";
	
	// Enseignant
	//
	var subSection;
	if (data[0]["Enseignant"] != undefined) {
	
		var arr = new Array();
		arr.push(" P.idPersonnel = "+data[0]["Enseignant"]+" ");

		var Enseignant = getValues("DISTINCT *", "Personnel AS P", constrainGenerator(arr));

		subSection = addSubSection(div, "Enseignant");
		var libelle = Enseignant[0]["Civilite"] + " " + Enseignant[0]["Nom"];
		if (Enseignant[0]["NomUsage"] != undefined)
			libelle = libelle + " (" + Enseignant[0]["NomUsage"] + ")";
		libelle = libelle + " " + Enseignant[0]["Prenom"];
		addInformation(subSection, "", libelle);
	}
	
	// Niveaux concernés
	//
	if (data[0]["Niveau2"] != undefined) {
		subSection = addSubSection(div, "Niveaux");
		addInformation(subSection, "Niveau 1", data[0]["Niveau1"]);
		addInformation(subSection, "Niveau 2", data[0]["Niveau2"]);
	}
	else {
		subSection = addSubSection(div, "Niveau");
		addInformation(subSection, "", data[0]["Niveau1"]);
	}
	
	// Service de cantine
	//
	subSection = addSubSection(div, "Service de cantine");
	addInformation(subSection, "", data[0]["ServiceCantine"]);
	
	// Enfants affectés
	//
	arr = new Array();
	arr.push(" SI.Classe = '" + nomClasseSelected + "' ");
	arr.push(" SI.Promotion =  '" + document.getElementById("Promotion").value + "' ");
 	arr.push(" SI.Enfant = E.idEnfant ");
 				
  	var Enfants = getValues("*", " Enfant AS E, Scolariteinterne AS SI", constrainGenerator(arr));
  	
  	if (Enfants.length > 0)
  		subSection = addSubSection(div, "Enfants affectés");
  	
  	for (var j = 0 ; j < Enfants.length ; j++) {
  		libelle = Enfants[j]["Nom"];
		if (Enfants[j]["NomUsage"] != undefined)
			libelle = libelle + " (" + Enfants[j]["NomUsage"] + ")";
		libelle = libelle + " " + Enfants[j]["Prenom"];
		addInformation(subSection, "", libelle);
	}
}


function printClasse() {
	var arr = new Array();
	arr.push(" C.Nom = '" + nomClasseSelected + "' ");
	arr.push(" C.Promotion =  '" + document.getElementById("Promotion").value + "' ");
	arr.push(" C.Enseignant = P.idPersonnel ");

	window.open("phpscripts/DBRequestValuesExcel.php?Filename="+nomClasseSelected+" - "+document.getElementById("Promotion").value+"&Request=Select C.Niveau1 , C.Niveau2, C.ServiceCantine, P.Civilite, P.Nom, P.NomUsage, P.Prenom From Classe AS C, Personnel AS P " + constrainGenerator(arr));

	arr = new Array();
	arr.push(" SI.Classe = '" + nomClasseSelected + "' ");
	arr.push(" SI.Promotion =  '" + document.getElementById("Promotion").value + "' ");
 	arr.push(" SI.Enfant = E.idEnfant ");
 	
	window.open("phpscripts/DBRequestValuesExcel.php?Filename="+nomClasseSelected+" - "+document.getElementById("Promotion").value+" - Enfants&Request=Select E.Nom, E.NomUsage, E.Prenom, E.DateNaissance, E.Niveau, E.INE, E.RegistreMatricule, E.Boursier, E.PAI, E.MDPH From Enfant AS E, Scolariteinterne AS SI " + constrainGenerator(arr) + " ORDER BY E.Nom ");
}

function printAllClasse() {
	var arr = new Array();

	// Traiter la promotion
 	//
	arr.push(" C.Promotion =  '" + document.getElementById("Promotion").value + "' ");

	// Traiter le niveau
 	//
 	if(document.getElementById("Niveau").value != "" )
 	 	arr.push(" (C.Niveau1 = '" + document.getElementById("Niveau").value + "' OR C.Niveau2 = '" + document.getElementById("Niveau").value + "') ");

	// Traiter l'enseignant
	//
	if(document.getElementById("Enseignant").value != "" )
		arr.push(" C.Enseignant =  '" + document.getElementById("Enseignant").value + "' ");
		
	arr.push(" C.Enseignant = P.idPersonnel ");
	arr.push(" SI.Promotion = C.Promotion ");
	arr.push(" SI.Classe = C.Nom ");

	window.open("phpscripts/DBRequestValuesExcel.php?Filename=Classes - "+document.getElementById("Promotion").value+"&Request=Select Distinct SI.Classe, C.Niveau1 , C.Niveau2, C.ServiceCantine, P.Civilite, P.Nom, P.NomUsage, P.Prenom From Classe AS C, Personnel AS P, Scolariteinterne AS SI " + constrainGenerator(arr));

	arr = new Array();
	// Traiter la promotion
 	//
	arr.push(" C.Promotion =  '" + document.getElementById("Promotion").value + "' ");

	// Traiter le niveau
 	//
 	if(document.getElementById("Niveau").value != "" )
 	 	arr.push(" (C.Niveau1 = '" + document.getElementById("Niveau").value + "' OR C.Niveau2 = '" + document.getElementById("Niveau").value + "') ");

	// Traiter l'enseignant
	//
	if(document.getElementById("Enseignant").value != "" )
		arr.push(" C.Enseignant =  '" + document.getElementById("Enseignant").value + "' ");
		
	arr.push(" SI.Classe = C.Nom ");
	arr.push(" SI.Promotion =  C.Promotion ");
 	arr.push(" SI.Enfant = E.idEnfant ");
 	
	window.open("phpscripts/DBRequestValuesExcel.php?Filename=Classes - "+document.getElementById("Promotion").value+" - Enfants&Request=Select Distinct SI.Classe, E.Nom, E.NomUsage, E.Prenom, E.DateNaissance, E.Niveau, E.INE, E.RegistreMatricule, E.Boursier, E.PAI, E.MDPH From Classe AS C, Enfant AS E, Scolariteinterne AS SI " + constrainGenerator(arr) + " ORDER BY E.Nom ");
}

classeListerJQuery();