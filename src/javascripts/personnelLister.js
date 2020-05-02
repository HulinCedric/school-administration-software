function personnelListerJQuery() {
	idSelectedChange(-1);

	var arr = new Array();

	// Traiter le fonction
	//
	if (document.getElementById("Fonction").value != "")
		arr.push(" Fonction = '" + document.getElementById("Fonction").value
				+ "' ");

	// Traiter la radiation
	//
	if (document.getElementsByName("Radier")[0].type == "hidden")
		arr.push(" DateRadiation IS "
				+ document.getElementsByName("Radier")[0].value);
	else
		for ( var i = 0; i < document.getElementsByName("Radier").length; i++)
			if (document.getElementsByName("Radier")[i].checked)
				arr.push(" DateRadiation IS "
						+ document.getElementsByName("Radier")[i].value);

	arr.push(" Adresse = idAdresse ");

	var constrain = constrainGenerator(arr);

	constrain = constrain + " ORDER BY Nom ";

	var Personnels = getValues("DISTINCT *", "Personnel, Adresse", constrain);

	if (Personnels.length > 0
			&& document.getElementById("submit").value == "Imprimer")
		document.getElementById("all").style.visibility = "";

	var select = document.getElementById("Personnel");
	while (select.firstChild)
		select.removeChild(select.firstChild);

	for (i = 0; i < Personnels.length; i++) {

		// Personnel
		//
		var libelle = Personnels[i]["Civilite"] + " " + Personnels[i]["Nom"];
		if (Personnels[i]["NomUsage"] != undefined)
			libelle = libelle + " (" + Personnels[i]["NomUsage"] + ")";
		libelle = libelle + " " + Personnels[i]["Prenom"];
		addSection(select, libelle, Personnels[i]["idPersonnel"], "");

		// DIV parent
		//
		var div = document.createElement("div");
		div.setAttribute("id", "contain" + Personnels[i]["idPersonnel"]);
		select.appendChild(div);

		// Situation Administrative
		//
		var subSection = addSubSection(div, "Situation Administrative");
		addInformation(subSection, "Date d'entrée dans l'école",
				dateReverse(Personnels[i]["DateEntreeEcole"]));
		addInformation(subSection, "Date de radiation",
				dateReverse(Personnels[i]["DateRadiation"]));

		// Fonction
		//
		subSection = addSubSection(div, "Fonction");
		addInformation(subSection, "", Personnels[i]["Fonction"]);

		// Adresse
		//
		subSection = addSubSection(div, "Adresse");
		addInformation(subSection, "", Personnels[i]["Voie"]);
		addInformation(subSection, "", Personnels[i]["CodePostal"] + " "
				+ Personnels[i]["Commune"]);
		addInformation(subSection, "", Personnels[i]["Pays"]);

		// Coordonnées
		//
		subSection = addSubSection(div, "Coordonnée");
		addInformation(subSection, "Téléphone Domicile",
				Personnels[i]["Telephone"]);
		addInformation(subSection, "Téléphone Portable",
				Personnels[i]["TelephonePortable"]);
		addLinkInformation(subSection, "Mail : ", Personnels[i]["Mail"],
				"mailto:" + Personnels[i]["Mail"]);
	}
	$("#Personnel").accordion("destroy");
	$("#Personnel").accordion({
		active : false,
		collapsible : true,
		icons : icons,
		autoHeight : false,
		navigation : true
	});
}

function printPersonnel() {
	var arr = new Array();
	arr.push(" idPersonnel = '" + idSelected + "' ");

	var data = getValues("DISTINCT *", "Personnel", constrainGenerator(arr));
	var libelle = data[0]["Civilite"] + " " + data[0]["Nom"];
	if (data[0]["NomUsage"] != undefined)
		libelle = libelle + " (" + data[0]["NomUsage"] + ")";
	libelle = libelle + " " + data[0]["Prenom"];

	arr.push(" Adresse = idAdresse ");
	window
			.open("phpscripts/DBRequestValuesExcel.php?Filename="
					+ libelle
					+ "&Request=Select DateEntreeEcole, DateRadiation, Civilite, Nom, NomUsage, Prenom, Fonction, TelephonePortable, Mail, Voie, CodePostal, Commune, Pays, Telephone From Personnel, Adresse"
					+ constrainGenerator(arr));
}

function printAllPersonnel() {
	var arr = new Array();

	// Traiter le fonction
	//
	if (document.getElementById("Fonction").value != "")
		arr.push(" Fonction = '" + document.getElementById("Fonction").value
				+ "' ");

	// Traiter la radiation
	//
	if (document.getElementsByName("Radier")[0].type == "hidden")
		arr.push(" DateRadiation IS "
				+ document.getElementsByName("Radier")[0].value);
	else
		for ( var i = 0; i < document.getElementsByName("Radier").length; i++)
			if (document.getElementsByName("Radier")[i].checked)
				arr.push(" DateRadiation IS "
						+ document.getElementsByName("Radier")[i].value);

	arr.push(" Adresse = idAdresse ");

	window
			.open("phpscripts/DBRequestValuesExcel.php?Filename=Personnels&Request=Select Distinct DateEntreeEcole, DateRadiation, Civilite, Nom, NomUsage, Prenom, Fonction, TelephonePortable, Mail, Voie, CodePostal, Commune, Pays, Telephone From Personnel, Adresse "
					+ constrainGenerator(arr) + " ORDER BY Nom ");
}

personnelListerJQuery();