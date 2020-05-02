autoComplete("#Nom", "Nom", "Enfant, Scolariteinterne",
		"WHERE DateEntreeEcole IS NOT NULL AND idEnfant = Enfant");
autoCompleteSelectSimple("Promotion", "Promotion", "Scolariteinterne",
		"WHERE DateEntreeEcole IS NOT NULL ORDER BY Promotion DESC");

function enfantListerJQuery() {
	idSelectedChange(-1);

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

	// Traiter le niveau
	//
	if (document.getElementById("Niveau").value != "")
		arr.push(" S.Niveau =  '" + document.getElementById("Niveau").value
				+ "' ");

	arr.push(" DateEntreeEcole IS NOT NULL ");
	arr.push(" idEnfant = Enfant ");

	var constrain = constrainGenerator(arr);

	constrain = constrain + " ORDER BY Nom ";

	var data = getValues("DISTINCT *", "Enfant as E, Scolariteinterne as S",
			constrain);

	if (data.length > 0
			&& document.getElementById("submit").value != "Modifier")
		document.getElementById("all").style.visibility = "";
	else
		document.getElementById("all").style.visibility = "hidden";

	var select = document.getElementById("Enfant");
	while (select.firstChild)
		select.removeChild(select.firstChild);

	for ( var i = 0; i < data.length; i++) {

		// Enfant
		//
		var libelle = data[i]["Nom"];
		if (data[i]["NomUsage"] != undefined)
			libelle = libelle + " (" + data[i]["NomUsage"] + ")";
		libelle = libelle + " " + data[i]["Prenom"];
		addSection(
				select,
				libelle,
				data[i]["idEnfant"],
				"enfantAddInformationJQuery(),promotionSelectedChange(document.getElementById('Promotion').value)");

		// DIV parent
		//
		var div = document.createElement("div");
		div.setAttribute("id", "contain" + data[i]["idEnfant"]);
		select.appendChild(div);
	}
	$("#Enfant").accordion("destroy");
	$("#Enfant").accordion({
		active : false,
		collapsible : true,
		icons : icons,
		autoHeight : false,
		navigation : true
	});
}

function enfantAddInformationJQuery() {
	var arr = new Array();

	arr.push(" idEnfant = '" + idSelected + "' ");
	arr.push(" idEnfant = Enfant ");
	arr.push(" Promotion =  '" + document.getElementById("Promotion").value
			+ "' ");

	var data = getValues("DISTINCT *", "Enfant, Scolariteinterne",
			constrainGenerator(arr));

	var div = document.getElementById("contain" + idSelected);
	div.innerHTML = "";

	// Situation Administratives
	//
	var subSection;
	if (data[0]["INE"] != undefined
			|| data[0]["RegistreMatricule"] != undefined
			|| data[0]["DatePremiereDemande"] != undefined
			|| data[0]["DateDemandeInscription"]
			|| data[0]["DecisionCommission"] || data[0]["ConfirmationParents"]) {
		subSection = addSubSection(div, "Situation Administratives");
		addInformation(subSection, "INE", data[0]["INE"]);
		addInformation(subSection, "Registre matricule",
				data[0]["RegistreMatricule"]);
		addInformation(subSection, "Date de 1re demande d'inscription",
				dateReverse(data[0]["DatePremiereDemande"]));
		addInformation(subSection, "Date de demande d'inscription",
				dateReverse(data[0]["DateDemandeInscription"]));
		addInformation(subSection, "Decision de la commission",
				data[0]["DecisionCommission"]);
		addInformation(subSection, "ConfirmationParents",
				data[0]["ConfirmationParents"]);
		addInformation(subSection, "Date de radiation",
				dateReverse(data[0]["DateRadiation"]));
	}

	// Identité
	//
	subSection = addSubSection(div, "Identité");
	addInformation(subSection, "Sexe", data[0]["Sexe"]);
	addInformation(subSection, "Nationalité", data[0]["Nationalite"]);
	addInformation(subSection, "Date de naissance",
			dateReverse(data[0]["DateNaissance"]));
	addInformation(subSection, "Lieu de naissance", data[0]["CommuneNaissance"]
			+ " (" + data[0]["DepartementNaissance"] + ") en "
			+ data[0]["PaysNaissance"]);

	// Niveau
	//
	subSection = addSubSection(div, "Scolarité");
	addInformation(subSection, "Classe", data[0]["Classe"]);
	addInformation(subSection, "Demi groupe", data[0]["DemiGroupe"]);
	if (data[0]["Module"] != undefined) {
		var Module = getValues("*", "Module", "WHERE idModule = '"
				+ data[0]["Module"] + "'");
		if (Module[0]["Niveau"] != data[0]["Niveau"])
			addInformation(subSection, "Groupe de module", Module[0]["Groupe"]
					+ " - " + data[0]["Niveau"] + "/" + Module[0]["Niveau"]);
		else
			addInformation(subSection, "Groupe de module", Module[0]["Groupe"]
					+ " - " + Module[0]["Niveau"] + "/"
					+ getNiveauSup(Module[0]["Niveau"]));
	}
	addInformation(subSection, "Niveau", data[0]["Niveau"]);
	addInformation(subSection, "Langue vivante 1", data[0]["LangueVivante1"]);
	addInformation(subSection, "Langue vivante 2", data[0]["LangueVivante2"]);
	addInformation(subSection, "Sieste", data[0]["Sieste"]);

	// Parent
	//
	arr = new Array();
	arr.push(" Enfant = '" + idSelected + "' ");
	arr.push(" Responsable = idResponsableLegal ");
	arr.push(" Adresse = idAdresse ");

	var Responsables = getValues("*",
			"ResponsableLegal, AssociationResponsableLegal, Adresse",
			constrainGenerator(arr));

	var adresse = "";
	var afficheAdresse = false;
	for ( var j = 0; j < Responsables.length; j++) {
		if (adresse == "")
			adresse = Responsables[j]["Voie"];
		if (Responsables[j]["Voie"] != adresse)
			afficheAdresse = true;
	}

	if (!afficheAdresse && Responsables.length > 0) {
		subSection = addSubSection(div, "Adresse");
		addInformation(subSection, "", Responsables[0]["Voie"]);
		addInformation(subSection, "", Responsables[0]["CodePostal"] + " "
				+ Responsables[0]["Commune"]);
	}

	for ( var j = 0; j < Responsables.length; j++) {
		subSection = addSubSection(div, Responsables[j]["Statut"]);
		var libelle = Responsables[j]["Civilite"] + " "
				+ Responsables[j]["Nom"];
		if (Responsables[j]["NomUsage"] != undefined)
			libelle = libelle + " (" + Responsables[j]["NomUsage"] + ")";
		libelle = libelle + " " + Responsables[j]["Prenom"];
		addInformation(subSection, "", libelle);
		if (Responsables[j]["AdressePrincipale"] == "Oui")
			addInformation(subSection, "Adresse principale",
					Responsables[j]["AdressePrincipale"]);
		addInformation(subSection, "Autorite parentale",
				Responsables[j]["AutoriteParentale"]);
		if (afficheAdresse)
			addInformation(subSection, "", Responsables[j]["Voie"] + ", "
					+ Responsables[j]["CodePostal"] + " "
					+ Responsables[j]["Commune"]);
	}

	// Situation interne
	//
	subSection = addSubSection(div, "Situation interne");
	addInformation(subSection, "Regime", data[0]["Regime"]);
	addInformation(subSection, "Boursier", data[0]["Boursier"]);
	addInformation(subSection, "Autorisation de sortie",
			data[0]["AutorisationSortie"]);

	// Assurance individuelle
	//
	subSection = addSubSection(div, "Assurance individuelle");
	addInformation(subSection, "Responsabilité civile",
			data[0]["ResponsabiliteCivile"]);
	addInformation(subSection, "Individuelle accident",
			data[0]["IndividuelleAccident"]);
	addInformation(subSection, "Compagnie d'assurance",
			data[0]["CompagnieAssurance"]);
	addInformation(subSection, "Numero de police d'assurance",
			data[0]["NumeroPoliceAssurance"]);
	addInformation(subSection, "Attestation fournie",
			data[0]["AttestationFournie"]);

	// Santé
	//
	subSection = addSubSection(div, "Santé");
	addInformation(subSection, "Projet d'Accueil Individualisé", data[0]["PAI"]);
	addInformation(subSection,
			"Maison Départementale des Personnes Handicapées", data[0]["MDPH"]);

	// Information périscolaire
	//
	subSection = addSubSection(div, "Information périscolaire");
	addInformation(subSection, "Garderie du matin", data[0]["GarderieMatin"]);
	addInformation(subSection, "Garderie du soir", data[0]["GarderieSoir"]);
	addInformation(subSection, "Diffusion de l'adresse aux associations",
			data[0]["DiffusionAdresseAssociation"]);
}

function printEleve() {
	var arr = new Array();

	arr.push(" E.idEnfant = '" + idSelected + "' ");
	arr.push(" E.idEnfant = SI.Enfant ");
	arr.push(" ARL.Enfant = E.idEnfant ");

	arr.push(" SI.Promotion =  '" + document.getElementById("Promotion").value
			+ "' ");

	arr.push(" ARL.Responsable = RL.idResponsableLegal ");
	arr.push(" RL.Adresse = A.idAdresse ");

	var data = getValues(
			"DISTINCT E.*",
			"Enfant AS E, Scolariteinterne AS SI, ResponsableLegal AS RL, AssociationResponsableLegal AS ARL, Adresse AS A",
			constrainGenerator(arr));

	var libelle = data[0]["Nom"];
	if (data[0]["NomUsage"] != undefined)
		libelle = libelle + " (" + data[0]["NomUsage"] + ")";
	libelle = libelle + " " + data[0]["Prenom"];

	window
			.open("phpscripts/DBRequestValuesExcel.php?Filename="
					+ libelle
					+ "&Request=Select E.INE, E.RegistreMatricule, E.DatePremiereDemande, E.DateRadiation, E.Sexe, E.DateNaissance, E.Nationalite, E.CommuneNaissance, E.DepartementNaissance, E.PaysNaissance, E.Niveau, E.LangueVivante1, E.LangueVivante2, E.Sieste, E.Regime, E.Boursier, E.ResponsabiliteCivile, E.IndividuelleAccident, E.CompagnieAssurance, E.NumeroPoliceAssurance, E.AttestationFournie, E.GarderieMatin, E.GarderieSoir, E.DiffusionAdresseAssociation, E.PAI, E.MDPH, SI.Promotion, SI.Classe, SI.DemiGroupe, SI.AutorisationSortie, SI.DateDemandeInscription, SI.DecisionCommission, SI.ConfirmationParents, SI.DateEntreeEcole, SI.AutorisationSortie, ARL.Statut, ARL.AutoriteParentale, ARL.AdressePrincipale, RL.Civilite, RL.Nom as NomRL, RL.NomUsage as NomUsageRL, RL.Prenom as PrenomRL, RL.Profession, RL.TelephoneProfessionnel, RL.TelephonePortable, RL.Mail, A.Voie, A.CodePostal, A.Commune, A.Pays, A.Telephone From Enfant AS E, Scolariteinterne AS SI, ResponsableLegal AS RL, AssociationResponsableLegal AS ARL, Adresse AS A "
					+ constrainGenerator(arr));
}

function printAllEleve() {
	var arr = new Array();

	// Traiter la Sexe
	//
	var Sexe = "";
	for ( var i = 0; i < document.getElementsByName("Sexe").length; i++)
		if (document.getElementsByName("Sexe")[i].checked)
			Sexe = document.getElementsByName("Sexe")[i].value;
	if (Sexe != "")
		arr.push(" E.Sexe = '" + Sexe + "' ");

	// Traiter le nom
	//
	if (document.getElementById("Nom").value != "")
		arr.push(" (E.Nom LIKE '" + document.getElementById("Nom").value
				+ "%' OR E.NomUsage LIKE '"
				+ document.getElementById("Nom").value + "%') ");

	// Traiter la promotion
	//
	if (document.getElementById("Niveau").value != "")
		arr.push(" E.Niveau =  '" + document.getElementById("Niveau").value
				+ "' ");

	arr.push(" SI.DateEntreeEcole IS NOT NULL ");
	arr.push(" E.idEnfant = SI.Enfant ");
	arr.push(" ARL.Enfant = E.idEnfant ");
	arr.push(" SI.Promotion =  '" + document.getElementById("Promotion").value
			+ "' ");
	arr.push(" ARL.Responsable = RL.idResponsableLegal ");
	arr.push(" RL.Adresse = A.idAdresse ");

	window
			.open("phpscripts/DBRequestValuesExcel.php?Filename=Eleves - "
					+ document.getElementById("Promotion").value
					+ "&Request=Select E.Nom, E.NomUsage, E.Prenom, E.INE, E.RegistreMatricule, E.DatePremiereDemande, E.DateRadiation, E.Sexe, E.DateNaissance, E.Nationalite, E.CommuneNaissance, E.DepartementNaissance, E.PaysNaissance, E.Niveau, E.LangueVivante1, E.LangueVivante2, E.Sieste, E.Regime, E.Boursier, E.ResponsabiliteCivile, E.IndividuelleAccident, E.CompagnieAssurance, E.NumeroPoliceAssurance, E.AttestationFournie, E.GarderieMatin, E.GarderieSoir, E.DiffusionAdresseAssociation, E.PAI, E.MDPH, SI.Promotion, SI.Classe, SI.DemiGroupe, SI.AutorisationSortie, SI.DateDemandeInscription, SI.DecisionCommission, SI.ConfirmationParents, SI.DateEntreeEcole, SI.AutorisationSortie, ARL.Statut, ARL.AutoriteParentale, ARL.AdressePrincipale, RL.Civilite, RL.Nom as NomRL, RL.NomUsage as NomUsageRL, RL.Prenom as PrenomRL, RL.Profession, RL.TelephoneProfessionnel, RL.TelephonePortable, RL.Mail, A.Voie, A.CodePostal, A.Commune, A.Pays, A.Telephone From Enfant AS E, Scolariteinterne AS SI, ResponsableLegal AS RL, AssociationResponsableLegal AS ARL, Adresse AS A "
					+ constrainGenerator(arr) + "Order by E.Nom");
}

enfantListerJQuery();