// Promotion
//
autoCompleteSelectSimple("Promotion", "Promotion", "Scolariteinterne",
		"WHERE DateEntreeEcole IS NOT NULL ORDER BY Promotion DESC");

function moduleListerJQuery() {
	idSelectedChange(-1);
	promotionSelectedChange("");
	var arr = new Array();

	// Traiter la promotion
	//
	arr.push(" Promotion =  '" + document.getElementById("Promotion").value
			+ "' ");
	arr.push(" DateEntreeEcole IS NOT NULL ");
	arr.push(" Module IS NOT NULL ");

	var data = getValues("DISTINCT Module", "Scolariteinterne",
			constrainGenerator(arr) + "  ");

	if (data.length > 0)
		document.getElementById("all").style.visibility = "";
	else
		document.getElementById("all").style.visibility = "hidden";

	var select = document.getElementById("Module");
	while (select.firstChild)
		select.removeChild(select.firstChild);

	for ( var i = 0; i < data.length; i++) {

		// Module
		//
		var Module = getValues("*", "Module", "WHERE idModule = '"
				+ data[i]["Module"] + "' ORDER BY Niveau");
		addSection(select, "Module " + Module[0]["Niveau"] + "/"
				+ getNiveauSup(Module[0]["Niveau"]) + " - Groupe "
				+ Module[0]["Groupe"], data[i]["Module"],
				"moduleSelectedChange(this.id);moduleAddInformationJQuery(this.id)");

		// DIV parent
		//
		var div = document.createElement("div");
		div.setAttribute("id", "contain" + data[i]["Module"]);
		select.appendChild(div);
	}
	$("#Module").accordion("destroy");
	$("#Module").accordion({
		active : false,
		collapsible : true,
		icons : icons,
		autoHeight : false,
		navigation : true
	});
}

function moduleAddInformationJQuery(Module) {
	var arr = new Array();
	arr.push(" SI.Module = '" + Module + "' ");
	arr.push(" SI.Promotion = '" + document.getElementById("Promotion").value
			+ "' ");
	arr.push(" E.idEnfant = SI.Enfant ");

	var data = getValues("DISTINCT *", "Enfant AS E, Scolariteinterne AS SI",
			constrainGenerator(arr));

	var div = document.getElementById("contain" + Module);
	div.innerHTML = "";

	var subSection = addSubSection(div, "Enfants affectés");
	for ( var j = 0; j < data.length; j++) {
		libelle = data[j]["Nom"];
		if (data[j]["NomUsage"] != undefined)
			libelle = libelle + " (" + data[j]["NomUsage"] + ")";
		libelle = libelle + " " + data[j]["Prenom"];
		addInformation(subSection, "", libelle);
	}
}

function printModule() {
	var arr = new Array();
	arr.push(" idModule = '" + moduleSelected + "' ");
	var data = getValues("DISTINCT *", "Module", constrainGenerator(arr));

	var libelle = "Module " + data[0]["Niveau"] + "_"
			+ getNiveauSup(data[0]["Niveau"]) + " - Groupe "
			+ data[0]["Groupe"] + " - "
			+ document.getElementById("Promotion").value;

	arr = new Array();
	arr.push(" SI.Module = '" + moduleSelected + "' ");
	arr.push(" SI.Promotion = '" + document.getElementById("Promotion").value
			+ "' ");
	arr.push(" E.idEnfant = SI.Enfant ");

	window
			.open("phpscripts/DBRequestValuesExcel.php?Filename="
					+ libelle
					+ "&Request=Select E.Nom, E.NomUsage, E.Prenom, E.DateNaissance, E.Niveau, E.INE, E.RegistreMatricule, E.Boursier, E.PAI, E.MDPH From Enfant AS E, Scolariteinterne AS SI"
					+ constrainGenerator(arr) + " Order by E.Nom");
}

function printAllModule() {
	var arr = new Array();

	// Traiter la promotion
	//
	arr.push(" SI.DateEntreeEcole IS NOT NULL ");
	arr.push(" SI.Module IS NOT NULL ");
	arr.push(" SI.Promotion = '" + document.getElementById("Promotion").value
			+ "' ");
	arr.push(" E.idEnfant = SI.Enfant ");
	arr.push(" M.idModule = SI.Module ");

	window
			.open("phpscripts/DBRequestValuesExcel.php?Filename=Modules - "
					+ document.getElementById("Promotion").value
					+ "&Request=Select M.Niveau as niveauModule, M.Groupe, E.Nom, E.NomUsage, E.Prenom, E.DateNaissance, E.Niveau, E.INE, E.RegistreMatricule, E.Boursier, E.PAI, E.MDPH From Enfant AS E, Scolariteinterne AS SI, Module AS M "
					+ constrainGenerator(arr) + " Order by E.Nom");
}

moduleListerJQuery();