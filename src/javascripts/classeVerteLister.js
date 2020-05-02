// Promotion
//
autoCompleteSelectSimple("Promotion", "Promotion", "Classe",
		"ORDER BY Promotion DESC");
classeVerteListerJQuery();

function classeVerteListerJQuery() {
	idSelectedChange(-1);
	lieuClasseVerteSelectedChange("");
	dateDebutClasseVerteSelectedChange("");

	var arr = new Array();

	// Caracteristique d'un eleve non radier
	//
	arr.push(" CV.DateDebut BETWEEN '"
			+ document.getElementById("Promotion").value.substring(0, 4)
			+ "/09/01' AND '"
			+ document.getElementById("Promotion").value.substring(5)
			+ "/08/31' ");

	var data = getValues("DISTINCT CV.*", "ClasseVerte as CV",
			constrainGenerator(arr) + " ORDER BY CV.Lieu ");

	if (data.length > 0
			&& document.getElementById("submit").value != "Modifier")
		document.getElementById("all").style.visibility = "";
	else
		document.getElementById("all").style.visibility = "hidden";

	var select = document.getElementById("ClasseVerte");
	while (select.firstChild)
		select.removeChild(select.firstChild);

	for ( var i = 0; i < data.length; i++) {

		// Enfant
		//
		addSection(select, data[i]["Lieu"] + " - "
				+ dateReverse(data[i]["DateDebut"]), data[i]["Lieu"] + " - "
				+ dateReverse(data[i]["DateDebut"]),
				"lieuClasseVerteSelectedChange('" + data[i]['Lieu']
						+ "');dateDebutClasseVerteSelectedChange('"
						+ data[i]['DateDebut']
						+ "');classeVerteAddInformationJQuery();");

		// DIV parent
		//
		var div = document.createElement("div");
		div.setAttribute("id", "contain" + data[i]["Lieu"] + " - "
				+ dateReverse(data[i]["DateDebut"]));
		select.appendChild(div);
	}
	$("#ClasseVerte").accordion("destroy");
	$("#ClasseVerte").accordion({
		active : false,
		collapsible : true,
		icons : icons,
		autoHeight : false,
		navigation : true
	});
}

function classeVerteAddInformationJQuery() {
	var arr = new Array();
	arr.push(" Lieu = '" + lieuClasseVerteSelected + "' ");
	arr.push(" DateDebut = '" + dateDebutClasseVerteSelected + "' ");
	var data = getValues("DISTINCT *", "ClasseVerte", constrainGenerator(arr));
	var AccompagnateursAutres = data[0]["AccompagnateursAutres"];

	var div = document.getElementById("contain" + lieuClasseVerteSelected
			+ " - " + dateReverse(dateDebutClasseVerteSelected));
	div.innerHTML = "";

	// Période
	//
	var subSection = addSubSection(div, "Période");
	addInformation(subSection, "Du", dateReverse(data[0]["DateDebut"]));
	addInformation(subSection, "Au", dateReverse(data[0]["DateFin"]));

	// Prix
	//
	subSection = addSubSection(div, "Prix");
	addInformation(subSection, "Prix agent comptable", data[0]["PrixComptable"]
			+ " €");
	addInformation(subSection, "Prix association", data[0]["PrixAssociation"]
			+ " €");
	addInformation(subSection, "Aide association", data[0]["AideAssociation"]
			+ " €");
	addInformation(subSection, "Total", eval(data[0]["PrixComptable"] + "+"
			+ data[0]["PrixAssociation"] + "-" + data[0]["AideAssociation"])
			+ " €");

	// Enfant participant
	//
	arr = new Array();
	arr.push(" P.Lieu = '" + lieuClasseVerteSelected + "' ");
	arr.push(" P.DateDebut = '" + dateDebutClasseVerteSelected + "' ");
	arr.push(" P.Enfant = SI.Enfant ");
	arr.push(" SI.Promotion = '" + document.getElementById("Promotion").value
			+ "' ");

	data = getValues("DISTINCT SI.Classe",
			"Participant AS P, Scolariteinterne AS SI", constrainGenerator(arr));

	var Total = 0;
	for ( var i = 0; i < data.length; i++) {

		arr = new Array();
		arr.push(" P.Lieu = '" + lieuClasseVerteSelected + "' ");
		arr.push(" P.DateDebut = '" + dateDebutClasseVerteSelected + "' ");
		arr.push(" P.Enfant = E.idEnfant ");
		arr.push(" P.Enfant = SI.Enfant ");
		arr.push(" SI.Promotion = '"
				+ document.getElementById("Promotion").value + "' ");
		arr.push(" SI.Classe = '" + data[i]["Classe"] + "' ");

		var Enfants = getValues("DISTINCT *",
				"Participant AS P, Enfant AS E, Scolariteinterne AS SI",
				constrainGenerator(arr) + " Order By E.Nom");

		if (data.length > 0)
			subSection = addSubSection(div, data[i]["Classe"]);

		for ( var j = 0; j < Enfants.length; j++) {
			var libelle = Enfants[j]["Nom"];
			if (Enfants[j]["NomUsage"] != undefined)
				libelle = libelle + " (" + Enfants[j]["NomUsage"] + ")";
			libelle = libelle + " " + Enfants[j]["Prenom"];
			addInformation(subSection, libelle + " a versé",
					Enfants[j]["PrixVerse"] + " €");
			Total = Total + eval(Enfants[j]["PrixVerse"]);
		}
	}

	if (data.length > 0)
		subSection = addSubSection(div, "Total versé : " + Total + " €");

	// Personnel accompagnateur
	//
	arr = new Array();
	arr.push(" A.Lieu = '" + lieuClasseVerteSelected + "' ");
	arr.push(" A.DateDebut = '" + dateDebutClasseVerteSelected + "' ");
	arr.push(" A.Personnel = P.idPersonnel ");

	data = getValues("DISTINCT P.*", "Accompagnateur AS A, Personnel AS P",
			constrainGenerator(arr) + " Order By P.Nom");

	if (data.length > 0)
		subSection = addSubSection(div, "Personnel accompagnateur");

	for ( var i = 0; i < data.length; i++) {
		var libelle = data[i]["Civilite"] + " " + data[i]["Nom"];
		if (data[i]["NomUsage"] != undefined)
			libelle = libelle + " (" + data[i]["NomUsage"] + ")";
		libelle = libelle + " " + data[i]["Prenom"];
		addInformation(subSection, "", libelle);
	}

	// Accompagnateur divers
	//
	if (AccompagnateursAutres != undefined) {
		subSection = addSubSection(div, "Accompagnateur divers");
		addInformation(subSection, "", AccompagnateursAutres);
	}
}

function printClasseVerte() {
	var arr = new Array();
	arr.push(" Lieu = '" + lieuClasseVerteSelected + "' ");
	arr.push(" DateDebut = '" + dateDebutClasseVerteSelected + "' ");

	window.open("phpscripts/DBRequestValuesExcel.php?Filename="
			+ lieuClasseVerteSelected + " - "
			+ dateReverse(dateDebutClasseVerteSelected)
			+ "&Request=Select * From ClasseVerte " + constrainGenerator(arr));

	arr = new Array();
	arr.push(" P.Lieu = '" + lieuClasseVerteSelected + "' ");
	arr.push(" P.DateDebut = '" + dateDebutClasseVerteSelected + "' ");
	arr.push(" P.Enfant = E.idEnfant ");
	arr.push(" P.Enfant = SI.Enfant ");
	arr.push(" SI.Promotion = '" + document.getElementById("Promotion").value
			+ "' ");

	window
			.open("phpscripts/DBRequestValuesExcel.php?Filename="
					+ lieuClasseVerteSelected
					+ " - "
					+ dateReverse(dateDebutClasseVerteSelected)
					+ " - Enfants&Request=Select SI.Classe, P.PrixVerse, E.Nom, E.NomUsage, E.Prenom, E.DateNaissance, E.Niveau, E.INE, E.RegistreMatricule, E.Boursier, E.PAI, E.MDPH From Participant AS P, Enfant AS E, Scolariteinterne AS SI "
					+ constrainGenerator(arr) + " Order By E.Nom");

	arr = new Array();
	arr.push(" A.Lieu = '" + lieuClasseVerteSelected + "' ");
	arr.push(" A.DateDebut = '" + dateDebutClasseVerteSelected + "' ");
	arr.push(" A.Personnel = P.idPersonnel ");

	window
			.open("phpscripts/DBRequestValuesExcel.php?Filename="
					+ lieuClasseVerteSelected
					+ " - "
					+ dateReverse(dateDebutClasseVerteSelected)
					+ " - Accompagnateurs&Request=Select P.Civilite, P.Nom, P.NomUsage, P.Prenom, P.Fonction, P.TelephonePortable, P.Mail From Accompagnateur AS A, Personnel AS P "
					+ constrainGenerator(arr) + " Order By P.Nom");
}

function printAllClasseVerte() {
	var arr = new Array();
	arr.push(" DateDebut BETWEEN '"
			+ document.getElementById("Promotion").value.substring(0, 4)
			+ "/09/01' AND '"
			+ document.getElementById("Promotion").value.substring(5)
			+ "/08/31' ");

	window
			.open("phpscripts/DBRequestValuesExcel.php?Filename=Classes Vertes - "
					+ document.getElementById("Promotion").value
					+ "&Request=Select CV.* From ClasseVerte as CV "
					+ constrainGenerator(arr) + " ORDER BY CV.Lieu ");

	arr = new Array();
	arr.push(" P.DateDebut BETWEEN '"
			+ document.getElementById("Promotion").value.substring(0, 4)
			+ "/09/01' AND '"
			+ document.getElementById("Promotion").value.substring(5)
			+ "/08/31' ");
	arr.push(" P.Enfant = E.idEnfant ");
	arr.push(" P.Enfant = SI.Enfant ");
	arr.push(" SI.Promotion = '" + document.getElementById("Promotion").value
			+ "' ");

	window
			.open("phpscripts/DBRequestValuesExcel.php?Filename=Classes Vertes - "
					+ document.getElementById("Promotion").value
					+ " - Enfants&Request=Select P.Lieu, P.DateDebut, SI.Classe, P.PrixVerse, E.Nom, E.NomUsage, E.Prenom, E.DateNaissance, E.Niveau, E.INE, E.RegistreMatricule, E.Boursier, E.PAI, E.MDPH From Participant AS P, Enfant AS E, Scolariteinterne AS SI "
					+ constrainGenerator(arr) + " Order By E.Nom");

	arr = new Array();
	arr.push(" A.DateDebut BETWEEN '"
			+ document.getElementById("Promotion").value.substring(0, 4)
			+ "/09/01' AND '"
			+ document.getElementById("Promotion").value.substring(5)
			+ "/08/31' ");
	arr.push(" A.Personnel = P.idPersonnel ");

	window
			.open("phpscripts/DBRequestValuesExcel.php?Filename=Classes Vertes - "
					+ document.getElementById("Promotion").value
					+ " - Accompagnateurs&Request=Select A.Lieu, A.DateDebut, P.Civilite, P.Nom, P.NomUsage, P.Prenom, P.Fonction, P.TelephonePortable, P.Mail From Accompagnateur AS A, Personnel AS P "
					+ constrainGenerator(arr) + " Order By P.Nom");
}