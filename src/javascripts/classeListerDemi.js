// Promotion
//
autoCompleteSelectSimple("Promotion", "Promotion", "Scolariteinterne", "WHERE DemiGroupe IS NOT NULL ORDER BY Promotion DESC");

// Personnel
//
autoCompleteSelectEnseignantByPromotionDemi("Enseignant", document.getElementById("Promotion").value, "");

function anneeScolaireChangeClasse() {
	emptySelect("Enseignant");
	autoCompleteSelectEnseignantByPromotionDemi("Enseignant", document.getElementById("Promotion").value, "");
	classeListerJQuery();
}

function classeListerJQuery() {
	idSelectedChange(-1);
	promotionSelectedChange("");
	demiGroupeSelectedChange("");
	nomClasseSelectedChange("");
	var arr = new Array();

	// Traiter la promotion
 	//
	arr.push(" C.Promotion =  '" + document.getElementById("Promotion").value + "' ");

	// Traiter le niveau
 	//
 	if(document.getElementById("Niveau").value != "" )
 	 	arr.push(" (Niveau1 = '" + document.getElementById("Niveau").value + "' OR Niveau2 = '" + document.getElementById("Niveau").value + "') ");

	// Traiter l'enseignant
	//
	if(document.getElementById("Enseignant").value != "" )
		arr.push(" Enseignant =  '" + document.getElementById("Enseignant").value + "' ");
	
	arr.push(" SI.Classe = C.Nom ");
	arr.push(" SI.DemiGroupe IS NOT NULL ");

  	var data = getValues("C.Nom, SI.DemiGroupe, C.*", "Classe AS C, Scolariteinterne AS SI",  constrainGenerator(arr) + " GROUP BY C.Nom, SI.DemiGroupe ORDER BY C.Nom");
  	
  	if (data.length <= 0)
  		document.getElementById("all").style.visibility = "hidden"; 
  		
  	var select = document.getElementById("Classe");
  	while (select.firstChild)
  		select.removeChild(select.firstChild);
  		
 	for (var i = 0 ; i < data.length ; i++) {
		
		// Classe
		//
		addSection(select, data[i]["Nom"] + " - Groupe " + data[i]["DemiGroupe"], data[i]["DemiGroupe"] + data[i]["Nom"], "demiGroupeSelectedChange('"+data[i]["DemiGroupe"]+"'),nomClasseSelectedChange('"+data[i]["Nom"]+"'),classeAddInformationJQuery(this.id.substring(0,1), this.id.substring(1))");
		
		// DIV parent
		//
		var div = document.createElement("div");
		div.setAttribute("id", "contain"+data[i]["DemiGroupe"]+data[i]["Nom"]);
		select.appendChild(div);
	}	
	$("#Classe").accordion("destroy");
	$("#Classe").accordion({active: false, collapsible: true, icons: icons, autoHeight: false, navigation: true});
}

function classeAddInformationJQuery(demiGroupe, nomClasse) {
	var arr = new Array();
	arr.push(" C.Nom = '" + nomClasse + "' ");
	arr.push(" C.Promotion =  '" + document.getElementById("Promotion").value + "' ");
	arr.push(" C.Enseignant = P.idPersonnel ");

	var data = getValues("DISTINCT *", "Classe AS C, Personnel AS P", constrainGenerator(arr));
	
	var div = document.getElementById("contain"+demiGroupe+nomClasse);
	div.innerHTML="";
	
	// Enseignant
	//
	var subSection = addSubSection(div, "Enseignant");
	var libelle = data[0]["Civilite"] + " " + data[0]["Nom"];
	if (data[0]["NomUsage"] != undefined)
		libelle = libelle + " (" + data[0]["NomUsage"] + ")";
	libelle = libelle + " " + data[0]["Prenom"];
	addInformation(subSection, "", libelle);
	
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
	
	// Enfants affectés
	//
	arr = new Array();
	if(document.getElementById("Niveau").value != "" )
 	 	arr.push(" E.Niveau = '" + document.getElementById("Niveau").value +"' ");
	arr.push(" SI.Classe = '" + nomClasse + "' ");
	arr.push(" SI.Promotion =  '" + document.getElementById("Promotion").value + "' ");
 	arr.push(" SI.Enfant = E.idEnfant ");
	arr.push(" SI.DemiGroupe = '" + demiGroupe + "' ");
 				
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

function printClasseDemi() {
  	var arr = new Array();
	arr.push(" C.Nom = '" + nomClasseSelected + "' ");
	arr.push(" C.Promotion =  '" + document.getElementById("Promotion").value + "' ");
	arr.push(" C.Enseignant = P.idPersonnel ");

	window.open("phpscripts/DBRequestValuesExcel.php?Filename="+nomClasseSelected+" - G"+demiGroupeSelected+" - "+document.getElementById("Promotion").value+"&Request=Select C.Niveau1 , C.Niveau2, C.ServiceCantine, P.Civilite, P.Nom, P.NomUsage, P.Prenom From Classe AS C, Personnel AS P " + constrainGenerator(arr));

	arr = new Array();
	if(document.getElementById("Niveau").value != "" )
 	 	arr.push(" E.Niveau = '" + document.getElementById("Niveau").value +"' ");
	arr.push(" SI.Classe = '" + nomClasseSelected + "' ");
	arr.push(" SI.Promotion =  '" + document.getElementById("Promotion").value + "' ");
 	arr.push(" SI.Enfant = E.idEnfant ");
	arr.push(" SI.DemiGroupe = '" + demiGroupeSelected + "' ");
 				 	
	window.open("phpscripts/DBRequestValuesExcel.php?Filename="+nomClasseSelected+" - G"+demiGroupeSelected+" - "+document.getElementById("Promotion").value+" - Enfants&Request=Select E.Nom, E.NomUsage, E.Prenom, E.DateNaissance, E.Niveau, E.INE, E.RegistreMatricule, E.Boursier, E.PAI, E.MDPH From Enfant AS E, Scolariteinterne AS SI " + constrainGenerator(arr) + " ORDER BY E.Nom ");
}

function printAllClasseDemi() {
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
	arr.push(" SI.DemiGroupe IS NOT NULL ");

	window.open("phpscripts/DBRequestValuesExcel.php?Filename=DemiClasses - "+document.getElementById("Promotion").value+"&Request=Select Distinct SI.Classe, SI.DemiGroupe, C.Niveau1 , C.Niveau2, C.ServiceCantine, P.Civilite, P.Nom, P.NomUsage, P.Prenom From Classe AS C, Personnel AS P, Scolariteinterne AS SI " + constrainGenerator(arr));

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
 	arr.push(" SI.DemiGroupe IS NOT NULL ");

	window.open("phpscripts/DBRequestValuesExcel.php?Filename=DemiClasses - "+document.getElementById("Promotion").value+" - Enfants&Request=Select Distinct SI.Classe, SI.DemiGroupe, E.Nom, E.NomUsage, E.Prenom, E.DateNaissance, E.Niveau, E.INE, E.RegistreMatricule, E.Boursier, E.PAI, E.MDPH From Classe AS C, Enfant AS E, Scolariteinterne AS SI " + constrainGenerator(arr) + " ORDER BY E.Nom ");
}

classeListerJQuery();