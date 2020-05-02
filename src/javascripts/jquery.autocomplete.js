function autoComplete(fieldId, value, table, constrain) {
	var arr = getValues("Distinct " + value, table, constrain);

	var array = new Array();

	for ( var i = 0; i < arr.length; i++)
		if (arr[i][value] != undefined)
			array.push(arr[i][value]);

	if (typeof fieldId == "string")
		$(fieldId).autocomplete({
			source : array
		});
	else
		for ( var i = 0; i < fieldId.length; i++)
			$(fieldId[i]).autocomplete({
				source : array
			});
}

function autoCompleteField(fieldId, value, table, constrain) {
	var arr = getValues("Distinct " + value, table, constrain);

	if (arr[0][value] != undefined)
		document.getElementById(fieldId).value = arr[0][value];
}

function autoCompleteSelectSimple(selectId, value, table, constrain) {
	var arr = getValues("DISTINCT " + value, table, constrain);

	var select = document.getElementById(selectId);

	for ( var i = 0; i < arr.length; i++)
		if (arr[i][value] != undefined)
			addOptionField(select, arr[i][value], arr[i][value]);
}

function autoCompleteSelect(selectId, label, value, table, constrain) {
	var arr = getValues("DISTINCT *", table, constrain);

	var select = document.getElementById(selectId);

	while (select.firstChild)
		select.removeChild(select.firstChild);

	for ( var i = 0; i < arr.length; i++)
		if (arr[i][label] != undefined)
			addOptionField(select, arr[i][label], arr[i][value]);
}

function autoCompleteSelectResponsable(selectId, constrain) {
	var Responsables = getValues("DISTINCT *", "ResponsableLegal", constrain
			+ " ORDER BY Nom");

	var select = document.getElementById(selectId);

	addOptionField(select, "", "");
	for ( var i = 0; i < Responsables.length; i++) {
		var libelle = Responsables[i]["Nom"];
		if (Responsables[i]["NomUsage"] != undefined)
			libelle = libelle + " (" + Responsables[i]["NomUsage"] + ")";
		libelle = libelle + " " + Responsables[i]["Prenom"];
		addOptionField(select, libelle, Responsables[i]["idResponsableLegal"]);
	}
}

function autoCompleteSelectEnseignant(selectId, constrain) {
	var Enseignants = getValues("DISTINCT *", "Personnel",
			"WHERE Fonction = 'Enseignant' " + constrain + " ORDER BY Nom");

	var select = document.getElementById(selectId);

	addOptionField(select, "", "");
	for ( var i = 0; i < Enseignants.length; i++) {
		var libelle = Enseignants[i]["Nom"];
		if (Enseignants[i]["NomUsage"] != undefined)
			libelle = libelle + " (" + Enseignants[i]["NomUsage"] + ")";
		libelle = libelle + " " + Enseignants[i]["Prenom"];
		addOptionField(select, libelle, Enseignants[i]["idPersonnel"]);
	}
}

function autoCompleteSelectEnseignantByPromotion(selectId, promotion, constrain) {
	var Enseignants = getValues(
			"DISTINCT P.*",
			"Personnel AS P, Classe AS C",
			"WHERE P.Fonction = 'Enseignant' AND C.Enseignant = P.idPersonnel AND C.Promotion = '"
					+ promotion + "' " + constrain + " ORDER BY P.Nom");

	var select = document.getElementById(selectId);

	addOptionField(select, "", "");
	for ( var i = 0; i < Enseignants.length; i++) {
		var libelle = Enseignants[i]["Nom"];
		if (Enseignants[i]["NomUsage"] != undefined)
			libelle = libelle + " (" + Enseignants[i]["NomUsage"] + ")";
		libelle = libelle + " " + Enseignants[i]["Prenom"];
		addOptionField(select, libelle, Enseignants[i]["idPersonnel"]);
	}
}

function autoCompleteSelectEnseignantByPromotionDemi(selectId, promotion,
		constrain) {
	var Enseignants = getValues(
			"DISTINCT P.*",
			"Personnel AS P, Classe AS C, Scolariteinterne AS SI",
			"WHERE P.Fonction = 'Enseignant' AND C.Enseignant = P.idPersonnel AND C.Promotion = '"
					+ promotion
					+ "' AND SI.Classe = C.Nom AND SI.DemiGroupe IS NOT NULL "
					+ constrain + "  ORDER BY P.Nom");

	var select = document.getElementById(selectId);

	addOptionField(select, "", "");
	for ( var i = 0; i < Enseignants.length; i++) {
		var libelle = Enseignants[i]["Nom"];
		if (Enseignants[i]["NomUsage"] != undefined)
			libelle = libelle + " (" + Enseignants[i]["NomUsage"] + ")";
		libelle = libelle + " " + Enseignants[i]["Prenom"];
		addOptionField(select, libelle, Enseignants[i]["idPersonnel"]);
	}
}

function autoCompleteSelectClasseVerte(selectId, promotion) {
	var arr = new Array();
	arr.push(" CV.DateDebut BETWEEN '" + promotion.substring(0, 4)
			+ "/09/01' AND '" + promotion.substring(5) + "/08/31' ");

	var data = getValues("DISTINCT CV.*", "ClasseVerte as CV",
			constrainGenerator(arr) + " ORDER BY CV.Lieu ");

	var select = document.getElementById(selectId);
	while (select.firstChild)
		select.removeChild(select.firstChild);

	for ( var i = 0; i < data.length; i++)
		addOptionField(select, data[i]["Lieu"] + " - "
				+ dateReverse(data[i]["DateDebut"]), data[i]["Lieu"]);
}

function autoCompleteSelectEnfantByClasse(selectId, promotion,
		nomClasseSelected) {
	var arr = new Array();
	arr.push(" SI.Classe = '" + nomClasseSelected + "' ");
	arr.push(" SI.Promotion =  '" + document.getElementById("Promotion").value
			+ "' ");
	arr.push(" SI.Enfant = E.idEnfant ");

	var data = getValues("*", " Enfant AS E, Scolariteinterne AS SI",
			constrainGenerator(arr) + " ORDER BY E.Nom");

	var select = document.getElementById(selectId);

	for ( var i = 0; i < data.length; i++) {
		var libelle = data[i]["Nom"];
		if (data[i]["NomUsage"] != undefined)
			libelle = libelle + " (" + data[i]["NomUsage"] + ")";
		libelle = libelle + " " + data[i]["Prenom"];
		addOptionField(select, libelle, data[i]["idEnfant"]);
	}
}

function autoCompleteScolaireSelect(selectId) {
	var annee = new Date().getFullYear();

	if (new Date().getMonth() >= 5) {
		addOptionField(document.getElementById(selectId), annee + "-"
				+ (annee + 1), annee + "-" + (annee + 1));
		addOptionField(document.getElementById(selectId), (annee - 1) + "-"
				+ annee, (annee - 1) + "-" + annee);
	} else {
		addOptionField(document.getElementById(selectId), (annee - 1) + "-"
				+ annee, (annee - 1) + "-" + annee);
		addOptionField(document.getElementById(selectId), (annee - 2) + "-"
				+ (annee - 1), (annee - 2) + "-" + (annee - 1));
	}
}