// Promotion
//
autoCompleteSelectSimple("Promotion", "Promotion", "Classe", "ORDER BY Promotion DESC");

// Classe
//
autoCompleteSelectSimple("Classe", "Nom", "Classe", "WHERE Promotion = '" + document.getElementById("Promotion").value + "' ORDER BY Nom DESC");

classeChangeClasse();

function anneeScolaireChangeClasse() {
	emptySelect("Classe");
	autoCompleteSelectSimple("Classe", "Nom", "Classe", "WHERE Promotion = '" + document.getElementById("Promotion").value + "' ORDER BY Nom DESC");
	classeChangeClasse();
}

function classeChangeClasse() {
	var arr = new Array();
	arr.push(" Promotion =  '" + document.getElementById("Promotion").value + "' ");
	arr.push(" Nom =  '" + document.getElementById("Classe").value + "' ");

  	var data = getValues("*", "Classe", constrainGenerator(arr));
  	
  	var Niveau1 = "";
  	var Niveau2 = "";
  	var Enseignant = "";  	
   	if (data.length > 0) {
   		Niveau1 = data[0]["Niveau1"];
   		if (data[0]["Niveau2"] != undefined)
   			Niveau2 = data[0]["Niveau2"];
   		
   		arr = new Array();
		arr.push(" idPersonnel =  '" + data[0]["Enseignant"] + "' ");
   		var data = getValues("*", "Personnel", constrainGenerator(arr));
		var libelle = data[0]["Nom"];
		if (data[0]["NomUsage"] != undefined)
			libelle = libelle + " (" + data[0]["NomUsage"] + ")";
		libelle = libelle + " " + data[0]["Prenom"];
   		Enseignant = libelle;
   	}
   	
   	document.getElementById("Niveau1").value = Niveau1;
   	document.getElementById("Niveau2").value = Niveau2;
   	document.getElementById("Enseignant").value = Enseignant;   
 
 	demigroupeChange(Niveau1, Niveau2);
 
 	enfantListerJQuery();  		
}

function demigroupeChange(Niveau1, Niveau2) {
	document.getElementById("DemiGroupe").value = "";

	if (isCollege(Niveau1, Niveau2))
		document.getElementById("DemiGroupeBlock").style.display = "block";
	else
		document.getElementById("DemiGroupeBlock").style.display = "none";	
}

autoComplete("#Nom", "Nom", "Enfant AS E, Scolariteinterne AS S", "WHERE DateEntreeEcole IS NOT NULL AND idEnfant = Enfant AND DateRadiation IS NULL AND Promotion = '"+ document.getElementById("Promotion").value +"' AND S.Classe IS NULL ");

function enfantListerJQuery() {
	var arr = new Array();
	
	// Traiter la Sexe
	//
	var Sexe = "";
	for(i = 0; i < document.getElementsByName("Sexe").length; i++)
		if(document.getElementsByName("Sexe")[i].checked)
			Sexe = document.getElementsByName("Sexe")[i].value;
	if(Sexe != "")
 		arr.push(" Sexe = '" + Sexe + "' ");
 		
 	// Traiter le nom
 	//
 	if(document.getElementById("Nom").value != "" )
 		arr.push(" (Nom LIKE '" + document.getElementById("Nom").value + "%' OR NomUsage LIKE '" + document.getElementById("Nom").value + "%') ");

	// Traiter la promotion
 	//
	arr.push(" Promotion =  '" + document.getElementById("Promotion").value + "' ");

	// Caracteristique d'un eleve non radier
	//
	arr.push(" DateEntreeEcole IS NOT NULL ");
	arr.push(" E.idEnfant = S.Enfant ");
	arr.push(" DateRadiation IS NULL ");
	
	// Caracterisitique d'un eleve sans classe
	//
	arr.push(" Classe IS NULL ");
	
	// Correspondance au niveau de la classe
	//
	arr.push(" (E.Niveau = '" + document.getElementById("Niveau1").value + "' OR E.Niveau = '" + document.getElementById("Niveau2").value + "')");
	
	// Prendre en compte que la derniere année de l'enfant
	//
	arr.push(" Promotion = ( SELECT max( Promotion ) FROM Scolariteinterne AS S WHERE DateEntreeEcole IS NOT NULL AND idEnfant = Enfant ) ");

  	var data = getValues("DISTINCT *", "Enfant as E, Scolariteinterne as S", constrainGenerator(arr) + " ORDER BY Nom "); 	
  	  	
  	var select = document.getElementById("Enfant");
  	while (select.firstChild)
  		select.removeChild(select.firstChild);

  	if (data.length <= 0)
  		document.getElementById("submit").style.visibility = "hidden";
  	else
  		document.getElementById("submit").style.visibility = "";
 	
 	for (var i = 0 ; i < data.length ; i++) {
		// Enfant
		//
		var libelle = data[i]["Nom"];
		if (data[i]["NomUsage"] != undefined)
			libelle = libelle + " (" + data[i]["NomUsage"] + ")";
		libelle = libelle + " " + data[i]["Prenom"];
		addCheckField(select, "Enfants", libelle, data[i]["idEnfant"], "checked");
	}
}

enfantListerJQuery();

function classeAffecter() {
	var ok = true;
	var information = "";
	var erreur = "";
	var parent = document.getElementsByName('Enfants');
	
	document.getElementById("Promotion").className = "valid";
	document.getElementById("Classe").className = "valid";

	
	if (document.getElementById("DemiGroupeBlock").style.display == "block" && document.getElementById("DemiGroupe").value == "") {
		document.getElementById("DemiGroupe").className = "invalid";
		ok = false;
		erreur = erreur + "<p>Le demi-groupe n'est pas sélectionné</p>";
	}
	else document.getElementById("DemiGroupe").className = "valid";
	
	if (ok) {
		for (var i = 0 ; i < parent.length ; i++) {
			if (parent[i].checked) {
				// Elaboration du message de confirmation
				//		
				information = information + 
							"<p>" + parent[i].parentNode.firstChild.data +
							" est affecter a la classe " + 
							document.getElementById("Classe").value + "</p>";
			
				// Mise a jour de la scolarité de l'enfant
				//
				file(	"phpscripts/DBExecuteQuery.php",
					"Request=UPDATE "+
						"Scolariteinterne "+
					"SET "+
						nullableValueUpdate("Classe", document.getElementById("Classe").value)+", "+
						nullableValueUpdate("DemiGroupe", document.getElementById("DemiGroupe").value)+
					" WHERE "+
						nullableValueUpdate("Enfant", parent[i].value) +
					" AND " +
						nullableValueUpdate("Promotion", document.getElementById("Promotion").value) + ";"
				);
			}
		}
	}

	if (ok) {
		document.getElementById("finish").style.display = "block";
		document.getElementById("finish").className = "finishValid";
		if (information == "")
			document.getElementById("finish").innerHTML = "<p>Aucun élève n'a été sélectionné</p>";
		else 
			document.getElementById("finish").innerHTML = information;
	}
	else {
		document.getElementById("finish").style.display = "block";
		document.getElementById("finish").className = "finishInvalid";
		document.getElementById("finish").innerHTML = erreur;
    }
}