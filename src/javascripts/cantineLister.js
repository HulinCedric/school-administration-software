autoCompleteSelectSimple("Promotion", "Promotion", "Scolariteinterne", "WHERE DateEntreeEcole IS NOT NULL ORDER BY Promotion DESC");

function cantineListerJQuery() {
	idSelectedChange(-1);
 	nomServiceSelectedChange("");

 	var arr = new Array(); 	
 	arr.push(" Promotion = '" + document.getElementById("Promotion").value + "' ");

  	var data = getValues("DISTINCT *", "Classe", constrainGenerator(arr) + " ORDER BY ServiceCantine");
  	  	  	
	var select = document.getElementById("Cantine");
  	while (select.firstChild)
  		select.removeChild(select.firstChild);
  	
  	if (data.length <= 0)
  		document.getElementById("all").style.visibility = "hidden";
  	else
  		document.getElementById("all").style.visibility = "";  	
  		  	
 	for (var i = 0 ; i < data.length ; i++) {
		
		// NomService
		//
		addSection(select, data[i]["ServiceCantine"], data[i]["ServiceCantine"], "nomServiceSelectedChange(this.id);cantineAddInformationJQuery()");
		
		// DIV parent
		//
		var div = document.createElement("div");
		div.setAttribute("id", "contain"+data[i]["ServiceCantine"]);
		select.appendChild(div);
	}	
	$("#Cantine").accordion("destroy");
	$("#Cantine").accordion({active: false, collapsible: true, icons: icons, autoHeight: false, navigation: true});
}

function cantineAddInformationJQuery() {	
	var div = document.getElementById("contain"+nomServiceSelected);
	div.innerHTML="";
	
	// Horaire
	//
	var arr = new Array(); 	
 	arr.push(" NomService = '" + nomServiceSelected + "' ");
  	var data = getValues("DISTINCT *", "ServiceCantine", constrainGenerator(arr));
  	var subSection = addSubSection(div, "Horaire");
	addInformation(subSection, "", data[0]["HeureRepas"]);
	
	// Élève
	//
	arr = new Array(); 	
 	arr.push(" C.ServiceCantine = '" + nomServiceSelected + "' ");
 	arr.push(" C.Promotion = '" + document.getElementById("Promotion").value + "' ");
 	arr.push(" C.Promotion = SI.Promotion ");
	arr.push(" C.Nom = SI.Classe ");
	arr.push(" SI.Enfant = E.idEnfant ");
	arr.push(" SI.DateEntreeEcole IS NOT NULL ");		
  	arr.push(" E.Regime = 'Demi Pensionnaire' ");

  	var data = getValues("E.*", "Enfant AS E, Scolariteinterne AS SI, Classe AS C", constrainGenerator(arr));
  	
  	if (data.length > 0)
  	  	subSection = addSubSection(div, "Élève concernés");
  	
  	for (var j = 0 ; j < data.length ; j++) {
  		var libelle = data[j]["Nom"];
		if (data[j]["NomUsage"] != undefined)
			libelle = libelle + " (" + data[j]["NomUsage"] + ")";
		libelle = libelle + " " + data[j]["Prenom"];
		addInformation(subSection, "", libelle);
	}
}

function printCantine() {
	// Horaire
	//
	var arr = new Array(); 	
 	arr.push(" NomService = '" + nomServiceSelected + "' ");
  	var data = getValues("DISTINCT *", "ServiceCantine", constrainGenerator(arr));
	
	// Élève
	//
	arr = new Array(); 	
 	arr.push(" C.ServiceCantine = '" + nomServiceSelected + "' ");
 	arr.push(" C.Promotion = '" + document.getElementById("Promotion").value + "' ");
 	arr.push(" C.Promotion = SI.Promotion ");
	arr.push(" C.Nom = SI.Classe ");
	arr.push(" SI.Enfant = E.idEnfant ");
	arr.push(" SI.DateEntreeEcole IS NOT NULL ");		
  	arr.push(" E.Regime = 'Demi Pensionnaire' ");

	window.open("phpscripts/DBRequestValuesExcel.php?Filename="+nomServiceSelected+" - "+data[0]["HeureRepas"]+" - "+document.getElementById("Promotion").value+"&Request=Select E.Nom, E.NomUsage, E.Prenom, E.DateNaissance, E.Niveau, E.INE, E.RegistreMatricule, E.Boursier, E.PAI, E.MDPH From Enfant AS E, Scolariteinterne AS SI, Classe AS C" + constrainGenerator(arr) + " Order by E.Nom");
}

function printAllCantine() {
	var arr = new Array();
	
	// Élève
	//
	arr = new Array(); 	
 	arr.push(" C.Promotion = '" + document.getElementById("Promotion").value + "' ");
 	arr.push(" C.Promotion = SI.Promotion ");
	arr.push(" C.Nom = SI.Classe ");
	arr.push(" SI.Enfant = E.idEnfant ");
	arr.push(" SI.DateEntreeEcole IS NOT NULL ");		
  	arr.push(" E.Regime = 'Demi Pensionnaire' ");
 	arr.push(" SC.NomService = C.ServiceCantine ");

	window.open("phpscripts/DBRequestValuesExcel.php?Filename=ServiceCantine - "+document.getElementById("Promotion").value+"&Request=Select SC.NomService, SC.HeureRepas, E.Nom, E.NomUsage, E.Prenom, E.DateNaissance, E.Niveau, E.INE, E.RegistreMatricule, E.Boursier, E.PAI, E.MDPH From Enfant AS E, Scolariteinterne AS SI, Classe AS C, ServiceCantine AS SC" + constrainGenerator(arr) + " Order by E.Nom");
}

cantineListerJQuery();