// Promotion
//
autoCompleteSelectSimple("Promotion", "Promotion", "Classe", "ORDER BY Promotion DESC");
anneeScolaireChangeClasse();

function anneeScolaireChangeClasse() {
	autoCompleteSelectClasseVerte("ClasseVerte", document.getElementById("Promotion").value);
 	personnelListerJQuery();  		
}

function personnelListerJQuery() {
	var arr = new Array();
		
	// Fonction
	//
	if (document.getElementById("Fonction").value != "")
		arr.push(" P1.Fonction = '"+ document.getElementById("Fonction").value +"' ");

	// Caracteristique d'un eleve non radier
	//
	arr.push(" P1.DateRadiation IS NULL ");
	arr.push(" P1.idPersonnel NOT IN ( Select P.idPersonnel From Personnel as P, Accompagnateur AS A Where P.DateRadiation IS NULL And P.idPersonnel = A.Personnel And A.DateDebut = '"+dateReverse(document.getElementById("ClasseVerte")[document.getElementById("ClasseVerte").selectedIndex].text.substr(-10))+"' And A.Lieu = '"+document.getElementById("ClasseVerte").value+"' )");
  	
  	var data = getValues("DISTINCT P1.*", "Personnel as P1", constrainGenerator(arr) + " ORDER BY P1.Nom "); 	
  	  	
  	var select = document.getElementById("Personnel");
  	while (select.firstChild)
  		select.removeChild(select.firstChild);

  	if (data.length <= 0)
  		document.getElementById("submit").style.visibility = "hidden";
  	else
  		document.getElementById("submit").style.visibility = "";
 	
 	for (var i = 0 ; i < data.length ; i++) {
		// Personnel
		//
		var libelle = data[i]["Civilite"] + " " + data[i]["Nom"];
		if (data[i]["NomUsage"] != undefined)
			libelle = libelle + " (" + data[i]["NomUsage"] + ")";
		libelle = libelle + " " + data[i]["Prenom"];
		addCheckField(select, "Personnels", libelle, data[i]["idPersonnel"], "");
	}
}

function personnelAffecter() {
	var information = "";
	var parent = document.getElementsByName('Personnels');
	
	document.getElementById("Promotion").className = "valid";
	document.getElementById("ClasseVerte").className = "valid";

	for (var i = 0 ; i < parent.length ; i++) {
		if (parent[i].checked) {
			// Elaboration du message de confirmation
			//		
			information = information + 
						"<p>" + parent[i].parentNode.firstChild.data +
						" accompagne la classe verte " + 
						document.getElementById("ClasseVerte").value + "</p>";
		
			// Mise a jour de la scolarité de l'enfant
			//
			file(	"phpscripts/DBExecuteQuery.php",
				"Request=Insert Into "+
					"Accompagnateur (Personnel, Lieu, DateDebut)"+
				"Values ("+
					nullableValueInsert(parent[i].value)+","+
					nullableValueInsert(document.getElementById("ClasseVerte").value)+","+
					nullableValueInsert(dateReverse(document.getElementById("ClasseVerte")[document.getElementById("ClasseVerte").selectedIndex].text.substr(-10)))+")");
		}
	}
	
	document.getElementById("finish").style.display = "block";
	document.getElementById("finish").className = "finishValid";
	if (information == "")
		document.getElementById("finish").innerHTML = "<p>Aucun personnel n'a été sélectionné</p>";
	else 
		document.getElementById("finish").innerHTML = information;
}