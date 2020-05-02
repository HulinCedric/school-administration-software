// Promotion
//
autoCompleteSelectSimple("Promotion", "Promotion", "Classe", "ORDER BY Promotion DESC");

function promotionChangeScolaire() {
	emptySelect("Classe");
	addOptionField(document.getElementById("Classe"), "", "");
	autoCompleteSelectSimple("Classe", "Nom", "Classe", "WHERE Promotion = '" + document.getElementById("Promotion").value + "' ORDER BY Nom DESC");
	enfantListerJQuery();
}

function enfantListerJQuery() {
	idSelectedChange(-1);
	var arr = new Array();
	
	// Traiter la Sexe
	//
	var Sexe = "";
	for(i = 0; i < document.getElementsByName("Sexe").length; i++)
		if(document.getElementsByName("Sexe")[i].checked)
			Sexe = document.getElementsByName("Sexe")[i].value;
	if(Sexe != "")
 		arr.push(" E.Sexe = '" + Sexe + "' ");
 		
 	// Traiter le nom
 	//
 	if(document.getElementById("Nom").value != "" )
 	arr.push(" (E.Nom LIKE '" + document.getElementById("Nom").value + "%' OR E.NomUsage LIKE '" + document.getElementById("Nom").value + "%') ");

	// Traiter la classe
 	//
	arr.push(" SI.Promotion =  '" + document.getElementById("Promotion").value + "' ");
	
	if (document.getElementById("Classe").value != "")
		arr.push(" SI.Classe =  '" + document.getElementById("Classe").value + "' ");

	// Caracteristique d'un eleve non radier
	//
	arr.push(" E.idEnfant = SI.Enfant ");
	arr.push(" AC.Enfant = SI.Enfant ");
	arr.push(" AC.Date IS NOT NULL ");

	var data = getValues("DISTINCT E.*", "Enfant as E, Scolariteinterne as SI, AbscenceScolaire as AC", constrainGenerator(arr) + " ORDER BY E.Nom "); 	
	if (data.length <= 0)
  		document.getElementById("all").style.visibility = "hidden";
  	else
  		document.getElementById("all").style.visibility = "";  	
  	  	
  	var select = document.getElementById("Enfant");
  	while (select.firstChild)
  		select.removeChild(select.firstChild);
  		
 	for (var i = 0 ; i < data.length ; i++) {
		
		// Enfant
		//
		var libelle = data[i]["Nom"];
		if (data[i]["NomUsage"] != undefined)
			libelle = libelle + " (" + data[i]["NomUsage"] + ")";
		libelle = libelle + " " + data[i]["Prenom"];
		addSection(select, libelle, data[i]["idEnfant"], "enfantAddInformationJQuery()");
		
		// DIV parent
		//
		var div = document.createElement("div");
		div.setAttribute("id", "contain"+data[i]["idEnfant"]);
		select.appendChild(div);
	}	
	$("#Enfant").accordion("destroy");
	$("#Enfant").accordion({active: false, collapsible: true, icons: icons, autoHeight: false, navigation: true});
}

function enfantAddInformationJQuery() {
	var arr = new Array();
	arr.push(" Enfant = '" + idSelected + "' ");
	arr.push(" Date BETWEEN '" + document.getElementById("Promotion").value.substring(0,4) + "/09/01' AND '" + document.getElementById("Promotion").value.substring(5) + "/06/30' ");

	var data = getValues("DISTINCT *", "AbscenceScolaire", constrainGenerator(arr));
	
	var div = document.getElementById("contain"+idSelected);
	div.innerHTML="";
	
	// Situation Administratives
	//
	var subSection = addSubSection(div, "Absence ("+data.length+")");
	for (var j = 0 ; j < data.length ; j++)
		addInformation(subSection, "", dateReverse(data[j]["Date"]));
}

function printAbsenceCantine() {
	var arr = new Array();
	arr.push(" idEnfant = '" + idSelected + "' ");
	var data = getValues("DISTINCT *", "Enfant", constrainGenerator(arr));

	var libelle = data[0]["Nom"];
	if (data[0]["NomUsage"] != undefined)
		libelle = libelle + " (" + data[0]["NomUsage"] + ")";
	libelle = libelle + " " + data[0]["Prenom"];

	arr.push(" idEnfant = Enfant ");
	arr.push(" Date BETWEEN '" + document.getElementById("Promotion").value.substring(0,4) + "/09/01' AND '" + document.getElementById("Promotion").value.substring(5) + "/06/30' ");

	window.open("phpscripts/DBRequestValuesExcel.php?Filename=Absence scolaire - "+libelle+" - "+document.getElementById("Promotion").value+"&Request=Select AC.Date, E.Nom, E.NomUsage, E.Prenom, E.DateNaissance, E.Niveau, E.INE, E.RegistreMatricule, E.Boursier, E.PAI, E.MDPH From AbscenceScolaire AS AC, Enfant AS E" + constrainGenerator(arr) + " Order by Nom");
}

function printAllAbsenceCantine() {
	var arr = new Array();
	arr.push(" idEnfant = Enfant ");
	arr.push(" Date BETWEEN '" + document.getElementById("Promotion").value.substring(0,4) + "/09/01' AND '" + document.getElementById("Promotion").value.substring(5) + "/06/30' ");

	window.open("phpscripts/DBRequestValuesExcel.php?Filename=Absence scolaire - "+document.getElementById("Promotion").value+"&Request=Select AC.Date, E.Nom, E.NomUsage, E.Prenom, E.DateNaissance, E.Niveau, E.INE, E.RegistreMatricule, E.Boursier, E.PAI, E.MDPH From AbscenceScolaire AS AC, Enfant AS E" + constrainGenerator(arr) + " Order by Nom");
}

promotionChangeScolaire();