// Responsable
//
autoComplete("#ResponsableNom", "Nom", "ResponsableLegal", "");

// Promotion
//
addOptionField(document.getElementById("Promotion"), "", "");
autoCompleteSelectSimple("Promotion", "Promotion", "Scolariteinterne",
		"ORDER BY Promotion DESC");
promotionChanged("");

function promotionChanged(promotion) {
	// Vider l'espace de travail
	//
	emptySelect("Classe");
	addOptionField(document.getElementById("Classe"), "", "");

	// Gerer le cas d'un champ vide
	//
	classeChanged("");
	if (promotion == "") {
		document.getElementById("ClasseBlock").style.display = "none";
		return;
	}

	// Gerer le cas normal
	//	
	autoCompleteSelectSimple("Classe", "Nom", "Classe", " WHERE Promotion =  '"
			+ document.getElementById("Promotion").value + "' ORDER BY Nom");
	document.getElementById("ClasseBlock").style.display = "block";
}

function classeChanged(nom) {
	// Vider l'espace de travail
	//
	emptySelect("Enfant");
	addOptionField(document.getElementById("Enfant"), "", "");

	// Gerer le cas d'un champ vide
	//
	if (nom == "") {
		document.getElementById("EnfantBlock").style.display = "none";
		responsableListerJQuery();
		return;
	}

	// Gerer le cas normal
	//	
	autoCompleteSelectEnfantByClasse("Enfant", document
			.getElementById("Promotion").value, nom);
	document.getElementById("EnfantBlock").style.display = "block";
	responsableListerJQuery();
}

function responsableListerJQuery() {
	idSelectedChange(-1);

	var arr = new Array();
	var tableAdditionnal = "";

	// Traiter la civilité
	//
	var Civilite = "";
	for ( var i = 0; i < document.getElementsByName("ResponsableCivilite").length; i++)
		if (document.getElementsByName("ResponsableCivilite")[i].checked)
			Civilite = document.getElementsByName("ResponsableCivilite")[i].value;
	if (Civilite != "")
		arr.push(" RL.Civilite = '" + Civilite + "' ");

	if (document.getElementById("ResponsableNom").value != "")
		arr.push(" (RL.Nom LIKE '"
				+ document.getElementById("ResponsableNom").value
				+ "%' OR RL.NomUsage LIKE '"
				+ document.getElementById("ResponsableNom").value + "%') ");

	if (document.getElementById("Promotion").value != "") {
		tableAdditionnal = ", Scolariteinterne AS SI";
		arr.push(" ARL.Enfant = SI.Enfant ");
		arr.push(" SI.Promotion = '"
				+ document.getElementById("Promotion").value + "' ");
	}

	if (document.getElementById("Classe").value != "")
		arr.push(" SI.Classe = '" + document.getElementById("Classe").value
				+ "' ");

	if (document.getElementById("Enfant").value != "")
		arr.push(" SI.Enfant = '" + document.getElementById("Enfant").value
				+ "' ");

	arr.push(" ARL.Responsable = RL.idResponsableLegal ");

	var Responsables = getValues(" DISTINCT RL.* ",
			" ResponsableLegal AS RL, AssociationResponsableLegal AS ARL "
					+ tableAdditionnal, constrainGenerator(arr)
					+ " ORDER BY RL.Nom ");

	if (Responsables.length > 0
			&& document.getElementById("submit").value != "Modifier")
		document.getElementById("all").style.visibility = "";
	else
		document.getElementById("all").style.visibility = "hidden";

	var select = document.getElementById("Responsable");
	while (select.firstChild)
		select.removeChild(select.firstChild);
	for ( var i = 0; i < Responsables.length; i++) {
		// Responsable
		//
		var libelle = Responsables[i]["Civilite"] + " "
				+ Responsables[i]["Nom"];
		if (Responsables[i]["NomUsage"] != undefined)
			libelle = libelle + " (" + Responsables[i]["NomUsage"] + ")";
		libelle = libelle + " " + Responsables[i]["Prenom"];
		addSection(select, libelle, Responsables[i]["idResponsableLegal"],
				"responsableAddInformationJQuery()");

		// DIV parent
		//
		var div = document.createElement("div");
		div.setAttribute("id", "contain"
				+ Responsables[i]["idResponsableLegal"]);
		select.appendChild(div);
	}

	$("#Responsable").accordion("destroy");
	$("#Responsable").accordion({
		active : false,
		collapsible : true,
		icons : icons,
		autoHeight : false,
		navigation : true
	});
}

function responsableAddInformationJQuery() {
	var arr = new Array();

	arr.push(" idResponsableLegal = '" + idSelected + "' ");

	arr.push(" Adresse = idAdresse ");

	var Responsables = getValues("DISTINCT *", "ResponsableLegal, Adresse",
			constrainGenerator(arr));

	var div = document.getElementById("contain" + idSelected);
	div.innerHTML = "";

	// Profession
	//
	var subSection;
	if (Responsables[0]["Profession"] != undefined) {
		subSection = addSubSection(div, "Profession");
		addInformation(subSection, "", Responsables[0]["Profession"]);
	}

	// Adresse
	//
	subSection = addSubSection(div, "Adresse");
	addInformation(subSection, "", Responsables[0]["Voie"]);
	addInformation(subSection, "", Responsables[0]["CodePostal"] + " "
			+ Responsables[0]["Commune"]);
	addInformation(subSection, "", Responsables[0]["Pays"]);

	// Coordonnée
	//
	if (Responsables[0]["Telephone"] != undefined
			|| Responsables[0]["TelephoneProfessionnel"] != undefined
			|| Responsables[0]["TelephonePortable"] != undefined
			|| Responsables[0]["Mail"] != undefined)
		subSection = addSubSection(div, "Coordonnée");
	addInformation(subSection, "Téléphone Domicile",
			Responsables[0]["Telephone"]);
	addInformation(subSection, "Téléphone Professionnel",
			Responsables[0]["TelephoneProfessionnel"]);
	addInformation(subSection, "Téléphone Portable",
			Responsables[0]["TelephonePortable"]);
	addLinkInformation(subSection, "Mail : ", Responsables[0]["Mail"],
			"mailto:" + Responsables[0]["Mail"]);

	// Enfant à charges
	//
	arr = new Array();
	arr.push(" Responsable = '" + idSelected + "' ");
	arr.push(" Enfant = idEnfant ");

	var Enfants = getValues("*", "Enfant, AssociationResponsableLegal",
			constrainGenerator(arr));

	if (Enfants.length > 0)
		subSection = addSubSection(div, "Enfant à charge");

	for ( var j = 0; j < Enfants.length; j++)
		addInformation(subSection, "", Enfants[j]["Nom"] + " "
				+ Enfants[j]["Prenom"]);
}

function printResponsable() {
	var arr = new Array();
	arr.push(" idResponsableLegal = '" + idSelected + "' ");

	var data = getValues("DISTINCT *", "ResponsableLegal",
			constrainGenerator(arr));
	var libelle = data[0]["Civilite"] + " " + data[0]["Nom"];
	if (data[0]["NomUsage"] != undefined)
		libelle = libelle + " (" + data[0]["NomUsage"] + ")";
	libelle = libelle + " " + data[0]["Prenom"];

	arr.push(" Adresse = idAdresse ");
	window
			.open("phpscripts/DBRequestValuesExcel.php?Filename="
					+ libelle
					+ "&Request=Select Civilite, Nom, NomUsage, Prenom, Profession, TelephoneProfessionnel, TelephonePortable, Mail, Voie, CodePostal, Commune, Pays, Telephone From ResponsableLegal, Adresse"
					+ constrainGenerator(arr));
}

function printAllResponsable() {
	var arr = new Array();
	var tableAdditionnal = "";

	// Traiter la civilité
	//
	var Civilite = "";
	for ( var i = 0; i < document.getElementsByName("ResponsableCivilite").length; i++)
		if (document.getElementsByName("ResponsableCivilite")[i].checked)
			Civilite = document.getElementsByName("ResponsableCivilite")[i].value;
	if (Civilite != "")
		arr.push(" RL.Civilite = '" + Civilite + "' ");

	if (document.getElementById("ResponsableNom").value != "")
		arr.push(" (RL.Nom LIKE '"
				+ document.getElementById("ResponsableNom").value
				+ "%' OR RL.NomUsage LIKE '"
				+ document.getElementById("ResponsableNom").value + "%') ");

	if (document.getElementById("Promotion").value != "") {
		tableAdditionnal = tableAdditionnal + ", Scolariteinterne AS SI";
		arr.push(" ARL.Enfant = SI.Enfant ");
		arr.push(" Promotion = '" + document.getElementById("Promotion").value
				+ "' ");
	}

	if (document.getElementById("Classe").value != "")
		arr.push(" SI.Classe = '" + document.getElementById("Classe").value
				+ "' ");

	if (document.getElementById("Enfant").value != "")
		arr.push(" SI.Enfant = '" + document.getElementById("Enfant").value
				+ "' ");

	arr.push(" ARL.Responsable = RL.idResponsableLegal ");

	arr.push(" Adresse = idAdresse ");

	window
			.open("phpscripts/DBRequestValuesExcel.php?Filename=ResponsablesLegaux&Request=Select Distinct Civilite, Nom, NomUsage, Prenom, Profession, TelephoneProfessionnel, TelephonePortable, Mail, Voie, CodePostal, Commune, Pays, Telephone From ResponsableLegal AS RL, AssociationResponsableLegal AS ARL, Adresse"
					+ constrainGenerator(arr) + " ORDER BY RL.Nom ");
}

responsableListerJQuery();