function matchAdresseFields(voieField, codePostalField, communeField,
		paysField, telephoneField) {
	var arr = new Array();

	if (voieField.value != "")
		arr.push(" Voie = '" + addslashes(voieField.value) + "' ");

	if (codePostalField.value != "")
		arr.push(" CodePostal = '" + codePostalField.value + "' ");

	if (communeField.value != "")
		arr.push(" Commune = '" + communeField.value + "' ");

	if (paysField.value != "")
		arr.push(" Pays = '" + paysField.value + "' ");

	if (telephoneField.value != "")
		arr.push(" Telephone = '" + telephoneField.value + "' ");

	var constrain = constrainGenerator(arr);

	if (constrain == "")
		return;

	var Adresses = getValues("*", "Adresse", constrain);

	if (Adresses.length > 0) {
		if (Adresses[0]["Voie"] != undefined)
			voieField.value = Adresses[0]["Voie"];
		if (Adresses[0]["CodePostal"] != undefined)
			codePostalField.value = Adresses[0]["CodePostal"];
		if (Adresses[0]["Commune"] != undefined)
			communeField.value = Adresses[0]["Commune"];
		if (Adresses[0]["Pays"] != undefined)
			paysField.value = Adresses[0]["Pays"];
		if (Adresses[0]["Telephone"] != undefined)
			telephoneField.value = Adresses[0]["Telephone"];
	}
}

function matchCommuneByCodePostalField(codePostalField, communeField, paysField) {
	var arr = new Array();

	if (codePostalField.value != "")
		arr.push(" CodePostal = '" + codePostalField.value + "' ");

	var constrain = constrainGenerator(arr);

	if (constrain == "")
		return;

	var Adresses = getValues("DISTINCT Commune, Pays", "Adresse", constrain);

	if (Adresses.length > 0) {
		if (Adresses[0]["Commune"] != undefined)
			communeField.value = Adresses[0]["Commune"];
		if (Adresses[0]["Pays"] != undefined)
			paysField.value = Adresses[0]["Pays"];
	}
}

function matchDepartementByCommuneField(communeField, departementField,
		paysField) {
	var arr = new Array();

	if (communeField.value != "")
		arr.push(" CommuneNaissance = '" + communeField.value + "' ");

	var constrain = constrainGenerator(arr);

	if (constrain == "")
		return;

	var Adresses = getValues("DISTINCT DepartementNaissance, PaysNaissance",
			"Enfant", constrain);

	if (Adresses.length > 0) {
		if (Adresses[0]["DepartementNaissance"] != undefined)
			departementField.value = Adresses[0]["DepartementNaissance"];
		if (Adresses[0]["PaysNaissance"] != undefined)
			paysField.value = Adresses[0]["PaysNaissance"];
	}
}

function matchDataField(fieldId, value) {
	if (value != undefined)
		document.getElementById(fieldId).value = value;
}

function matchCheckField(fieldId, value) {
	for ( var i = 0; i < document.getElementsByName(fieldId).length; i++)
		if (document.getElementsByName(fieldId)[i].value == value)
			document.getElementsByName(fieldId)[i].checked = "checked";
}

function matchSelectField(fieldId, value) {
	for ( var i = 0; i < document.getElementById(fieldId).length; i++)
		if (document.getElementById(fieldId)[i].value == value)
			document.getElementById(fieldId).selectedIndex = i;

	if (document.getElementById(fieldId).onchange != undefined)
		document.getElementById(fieldId).onchange();
}