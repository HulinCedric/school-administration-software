autoComplete("#Nom", "Nom", "Enfant, Scolariteinterne", "WHERE DateEntreeEcole IS NULL AND ConfirmationParents = 'Oui' AND idEnfant = Enfant");
autoCompleteSelectSimple("Promotion", "Promotion", "Scolariteinterne", "WHERE DateEntreeEcole IS NULL AND ConfirmationParents = 'Oui' ORDER BY Promotion DESC");

function enfantListerJQuery() {		
	var arr = new Array();
	
	// Traiter la Sexe
	//
	var Sexe = "";
	for(i = 0; i < document.getElementsByName("Sexe").length; i++)
		if(document.getElementsByName("Sexe")[i].checked)
			Sexe = document.getElementsByName("Sexe")[i].value;
	if(Sexe != "")
 		arr.push(" Sexe = '" + Sexe + "' ");
 		
 	// Traiter le nom
 	//
 	if(document.getElementById("Nom").value != "" )
 		arr.push(" (Nom LIKE '" + document.getElementById("Nom").value + "%' OR NomUsage LIKE '" + document.getElementById("Nom").value + "%') ");

	// Traiter la promotion
 	//
	arr.push(" Promotion =  '" + document.getElementById("Promotion").value + "' ");

	// Traiter la promotion
 	//
 	if(document.getElementById("Niveau").value != "" )
		arr.push(" S.Niveau =  '" + document.getElementById("Niveau").value + "' ");

	arr.push(" DateEntreeEcole IS NULL ");
	arr.push(" ConfirmationParents = 'Oui' ");
	arr.push(" idEnfant = Enfant ");

  	var constrain = constrainGenerator(arr);

	constrain = constrain + " ORDER BY Nom ";

  	var data = getValues("DISTINCT *", "Enfant as E, Scolariteinterne as S", constrain);
  	  	
  	var select = document.getElementById("Enfant");
  	while (select.firstChild)
  		select.removeChild(select.firstChild);

  	if (data.length <= 0)
  		document.getElementById("submit").style.visibility = "hidden";
 	
 	for (var i = 0 ; i < data.length ; i++) {
		
		// Enfant
		//
		var libelle = data[i]["Nom"];
		if (data[i]["NomUsage"] != undefined)
			libelle = libelle + " (" + data[i]["NomUsage"] + ")";
		libelle = libelle + " " + data[i]["Prenom"];
		addCheckField(select, "Enfants", libelle, data[i]["idEnfant"], "checked");
	}

}

enfantListerJQuery();