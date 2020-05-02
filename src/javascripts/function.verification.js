function verifcationSpace(valeur) {
	if (valeur.indexOf(' ', 0) != -1)
		return false;
	return true;
}

function verifcationAlphabetic(valeur) {
	if (valeur.match(/^[a-zA-Z-'ÉéÈèÀàÙùÎîÔôÛûÂâÊêÇçÏïËëÜüÄäöÖÆæŒœ]+$/))
		return true;
	return false;
}

function verifcationAlphabeticSpace(valeur) {
	if (valeur.match(/^[a-zA-Z- 'ÉéÈèÀàÙùÎîÔôÛûÂâÊêÇçÏïËëÜüÄäöÖÆæŒœ]+$/))
		return true;
	return false;
}

function verifcationNumeric(valeur) {
	for ( var i = 0; i < valeur.length; i++)
		if (isNaN(valeur))
			return false;
	return true;
}

function verifcationMail(valeur) {
	var reg = new RegExp(
			'^[a-z0-9]+([_|\.|-]{1}[a-z0-9]+)*@[a-z0-9]+([_|\.|-]{1}[a-z0-9]+)*[\.]{1}[a-z]{2,6}$',
			'i');

	if (reg.test(valeur))
		return true;
	return false;
}

String.prototype.capitalize = function() {
	return this.replace(/\S+/g, function(a) {
		return a.charAt(0).toUpperCase() + a.slice(1).toLowerCase();
	});
};

// Recuperation du prochain niveau
//
function getNiveauSup(Niveau) {
	switch (Niveau) {
	case "PS":
		Niveau = "MS";
		break;
	case "MS":
		Niveau = "GS";
		break;
	case "GS":
		Niveau = "CP";
		break;
	case "CP":
		Niveau = "CE1";
		break;
	case "CE1":
		Niveau = "CE2";
		break;
	case "CE2":
		Niveau = "CM1";
		break;
	case "CM1":
		Niveau = "CM2";
		break;
	case "CM2":
		Niveau = "6e";
		break;
	case "6e":
		Niveau = "5e";
		break;
	case "5e":
		Niveau = "4e";
		break;
	case "4e":
		Niveau = "3e";
		break;
	default:
		Niveau = "";
		break;
	}
	return Niveau;
}

// Recuperation du nombre d'année par niveau
//
function getAnneNiveau(Niveau) {
	var annee = 0;
	switch (Niveau) {
	case "PS":
		annee = 3;
		break;
	case "MS":
		annee = 4;
		break;
	case "GS":
		annee = 5;
		break;
	case "CP":
		annee = 6;
		break;
	case "CE1":
		annee = 7;
		break;
	case "CE2":
		annee = 8;
		break;
	case "CM1":
		annee = 9;
		break;
	case "CM2":
		annee = 10;
		break;
	case "6e":
		annee = 11;
		break;
	case "5e":
		annee = 12;
		break;
	case "4e":
		annee = 13;
		break;
	case "3e":
		annee = 14;
		break;
	default:
		break;
	}
	return annee;
}

// Generation du nom d'une classe
//
function getNomClasse(Niveau1, Niveau2, idPersonnel) {
	switch (Niveau1) {
	case "PS":
		Niveau1 = "PJE";
		break;
	case "MS":
		Niveau1 = "MJE";
		break;
	case "GS":
		Niveau1 = "GJE";
		break;
	case "CP":
	case "CE1":
	case "CE2":
	case "CM1":
	case "CM2":
		break;
	case "6e":
	case "5e":
	case "4e":
	case "3e":
		var Enseignant = getValues("DISTINCT Nom, Prenom", "Personnel",
				"WHERE idPersonnel = '" + idPersonnel + "'");
		Niveau1 = Niveau1.substring(0, 1)
				+ Enseignant[0]["Prenom"].substring(0, 1)
				+ Enseignant[0]["Nom"].substring(0, 1);
		break;
	default:
		Niveau = "";
		break;
	}

	if (Niveau2 != "")
		Niveau1 = Niveau1 + "/" + Niveau2;

	return Niveau1;
}

// Verification du niveau collège
//
function isCollege(Niveau1, Niveau2) {
	var ok = false;
	switch (Niveau1) {
	case "6e":
	case "5e":
	case "4e":
	case "3e":
		ok = true;
		break;
	default:
		break;
	}

	if (ok)
		return ok;

	switch (Niveau2) {
	case "6e":
	case "5e":
	case "4e":
	case "3e":
		ok = true;
		break;
	default:
		break;
	}

	return ok;
}