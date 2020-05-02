// Promotion
//
autoCompleteSelectSimple("Promotion", "Promotion", "Scolariteinterne",
		"WHERE DateEntreeEcole IS NOT NULL ORDER BY Promotion DESC");

// Nom
//
autoComplete(
		"#Nom",
		"Nom",
		"Enfant AS E, Scolariteinterne AS S",
		"WHERE DateEntreeEcole IS NOT NULL AND idEnfant = Enfant AND DateRadiation IS NULL AND Promotion = '"
				+ document.getElementById("Promotion").value
				+ "' AND S.Module IS NULL ");

niveauChanged(document.getElementById("Niveau1").value);

function niveauChanged(niveau) {

	// Gerer le cas d'un champ vide
	//
	if (niveau == "") {
		document.getElementById("Niveau2Block").style.display = "none";
		return;
	}

	// Gerer le cas normal
	//
	document.getElementById("Niveau2").value = getNiveauSup(niveau);
	document.getElementById("Niveau2Block").style.display = "block";

	enfantListerJQuery();
}

function enfantListerJQuery() {
	var arr = new Array();

	// Traiter la Sexe
	//
	var Sexe = "";
	for ( var i = 0; i < document.getElementsByName("Sexe").length; i++)
		if (document.getElementsByName("Sexe")[i].checked)
			Sexe = document.getElementsByName("Sexe")[i].value;
	if (Sexe != "")
		arr.push(" Sexe = '" + Sexe + "' ");

	// Traiter le nom
	//
	if (document.getElementById("Nom").value != "")
		arr.push(" (Nom LIKE '" + document.getElementById("Nom").value
				+ "%' OR NomUsage LIKE '"
				+ document.getElementById("Nom").value + "%') ");

	// Traiter la promotion
	//
	arr.push(" Promotion =  '" + document.getElementById("Promotion").value
			+ "' ");

	// Caracteristique d'un eleve non radier
	//
	arr.push(" DateEntreeEcole IS NOT NULL ");
	arr.push(" E.idEnfant = S.Enfant ");
	arr.push(" DateRadiation IS NULL ");

	// Caracterisitique d'un eleve sans classe
	//
	arr.push(" Module IS NULL ");

	// Correspondance au niveau de la classe
	//
	arr.push(" (E.Niveau = '" + document.getElementById("Niveau1").value
			+ "' OR E.Niveau = '" + document.getElementById("Niveau2").value
			+ "')");

	// Prendre en compte que la derniere année de l'enfant
	//
	arr
			.push(" Promotion = ( SELECT max( Promotion ) FROM Scolariteinterne AS S WHERE DateEntreeEcole IS NOT NULL AND idEnfant = Enfant ) ");

	var data = getValues("DISTINCT *", "Enfant as E, Scolariteinterne as S",
			constrainGenerator(arr) + " ORDER BY Nom ");

	var select = document.getElementById("Enfant");
	while (select.firstChild)
		select.removeChild(select.firstChild);

	if (data.length <= 0)
		document.getElementById("submit").style.visibility = "hidden";
	else
		document.getElementById("submit").style.visibility = "";

	for ( var i = 0; i < data.length; i++) {
		// Enfant
		//
		var libelle = data[i]["Nom"];
		if (data[i]["NomUsage"] != undefined)
			libelle = libelle + " (" + data[i]["NomUsage"] + ")";
		libelle = libelle + " " + data[i]["Prenom"];
		addCheckField(select, "Enfants", libelle, data[i]["idEnfant"],
				"checked");
	}
}

enfantListerJQuery();

function moduleAffecter() {
	var information = "";
	var parent = document.getElementsByName('Enfants');

	document.getElementById("Promotion").className = "valid";
	document.getElementById("Niveau1").className = "valid";
	document.getElementById("Groupe").className = "valid";
	document.getElementById("Niveau2").className = "valid";

	for ( var i = 0; i < parent.length; i++) {
		if (parent[i].checked) {
			// Elaboration du message de confirmation
			//		
			information = information + "<p>"
					+ parent[i].parentNode.firstChild.data
					+ " est affecter au groupe de module "
					+ document.getElementById("Groupe").value + " "
					+ document.getElementById("Niveau1").value + "/"
					+ document.getElementById("Niveau2").value + "</p>";

			var Module = getValues("idModule", "Module", "WHERE Niveau = '"
					+ document.getElementById("Niveau1").value
					+ "' AND Groupe = '"
					+ document.getElementById("Groupe").value + "'");

			// Mise a jour de la scolarité de l'enfant
			//
			file("phpscripts/DBExecuteQuery.php", "Request=UPDATE "
					+ "Scolariteinterne "
					+ "SET "
					+ nullableValueUpdate("Module", Module[0]["idModule"])
					+ " WHERE "
					+ nullableValueUpdate("Enfant", parent[i].value)
					+ " AND "
					+ nullableValueUpdate("Promotion", document
							.getElementById("Promotion").value) + ";");
		}
	}

	document.getElementById("finish").style.display = "block";
	document.getElementById("finish").className = "finishValid";
	if (information == "")
		document.getElementById("finish").innerHTML = "<p>Aucun élève n'a été sélectionné</p>";
	else
		document.getElementById("finish").innerHTML = information;
}