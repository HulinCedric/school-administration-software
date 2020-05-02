// Promotion
//
autoCompleteSelectSimple("Promotion", "Annee", "AffectationCharge",
		"ORDER BY Annee DESC");

function personnelListerJQuery() {
	idSelectedChange(-1);
	promotionSelectedChange("");
	chargePersonnelSelectedChange("");

	var arr = new Array();
	arr.push(" Annee = '" + document.getElementById("Promotion").value + "' ");

	var constrain = constrainGenerator(arr);

	constrain = constrain + " ORDER BY Nom ";

	var data = getValues("DISTINCT Charge", "AffectationCharge",
			constrainGenerator(arr) + " ORDER BY Charge");

	var select = document.getElementById("Charge");
	while (select.firstChild)
		select.removeChild(select.firstChild);

	if (data.length <= 0)
		document.getElementById("all").style.visibility = "hidden";
	else
		document.getElementById("all").style.visibility = "";

	for ( var i = 0; i < data.length; i++) {
		addSection(select, data[i]["Charge"], data[i]["Charge"],
				"chargePersonnelSelectedChange('" + data[i]['Charge']
						+ "');chargeAddInformationJQuery()");

		// DIV parent
		//
		var div = document.createElement("div");
		div.setAttribute("id", "contain" + data[i]["Charge"]);
		select.appendChild(div);
	}
	$("#Charge").accordion("destroy");
	$("#Charge").accordion({
		active : false,
		collapsible : true,
		icons : icons,
		autoHeight : false,
		navigation : true
	});
}

function chargeAddInformationJQuery() {
	var arr = new Array();
	arr.push(" Enseignant = idPersonnel ");
	arr.push(" Charge = '" + chargePersonnelSelected + "' ");
	arr.push(" Annee =  '" + document.getElementById("Promotion").value + "' ");

	var data = getValues("DISTINCT *", "Personnel, AffectationCharge",
			constrainGenerator(arr) + " Order By Nom");

	var div = document.getElementById("contain" + chargePersonnelSelected);
	div.innerHTML = "";

	// Situation Administratives
	//
	var subSection = addSubSection(div, "Enseignant concerné");
	for ( var i = 0; i < data.length; i++) {
		// Personnel
		//
		var libelle = data[i]["Civilite"] + " " + data[i]["Nom"];
		if (data[i]["NomUsage"] != undefined)
			libelle = libelle + " (" + data[i]["NomUsage"] + ")";
		libelle = libelle + " " + data[i]["Prenom"];
		addInformation(subSection, data[i]["Statut"], libelle);
	}
}

function printCharge() {
	var arr = new Array();
	arr.push(" Enseignant = idPersonnel ");
	arr.push(" Charge = '" + chargePersonnelSelected + "' ");
	arr.push(" Annee =  '" + document.getElementById("Promotion").value + "' ");
	window
			.open("phpscripts/DBRequestValuesExcel.php?Filename="
					+ chargePersonnelSelected
					+ " - "
					+ document.getElementById("Promotion").value
					+ "&Request=Select Statut, Civilite, Nom, NomUsage, Prenom, TelephonePortable, Mail From Personnel, AffectationCharge "
					+ constrainGenerator(arr) + " Order By Nom");
}

function printAllCharge() {
	var arr = new Array();
	arr.push(" Enseignant = idPersonnel ");
	arr.push(" Annee =  '" + document.getElementById("Promotion").value + "' ");

	window
			.open("phpscripts/DBRequestValuesExcel.php?Filename=Charges - "
					+ document.getElementById("Promotion").value
					+ "&Request=Select Charge, Statut, Civilite, Nom, NomUsage, Prenom, TelephonePortable, Mail From Personnel, AffectationCharge "
					+ constrainGenerator(arr) + " Order By Nom");
}

personnelListerJQuery();