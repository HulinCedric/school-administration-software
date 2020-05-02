// Promotion
//
autoCompleteSelectSimple("Promotion", "Promotion", "Classe", "ORDER BY Promotion DESC");
anneeScolaireChangeClasse();

function anneeScolaireChangeClasse() {
	emptySelect("Classe");
	autoCompleteSelectSimple("Classe", "Nom", "Classe", "WHERE Promotion = '" + document.getElementById("Promotion").value + "' ORDER BY Nom DESC");
	autoCompleteSelectClasseVerte("ClasseVerte", document.getElementById("Promotion").value);
 	enfantListerJQuery();  		
}

function enfantListerJQuery() {
	var arr = new Array();
		
	// Traiter la promotion
 	//
	arr.push(" S.Promotion =  '" + document.getElementById("Promotion").value + "' ");
	arr.push(" S.Classe =  '" + document.getElementById("Classe").value + "' ");

	// Caracteristique d'un eleve non radier
	//
	arr.push(" E.idEnfant = S.Enfant ");
	arr.push(" E.idEnfant = P.Enfant ");
	arr.push(" P.DateDebut = '"+dateReverse(document.getElementById("ClasseVerte")[document.getElementById("ClasseVerte").selectedIndex].text.substr(-10))+"' ");
	arr.push(" P.Lieu = '"+document.getElementById("ClasseVerte").value+"' ");
  	
  	var data = getValues("DISTINCT E.*", "Enfant as E, Scolariteinterne as S, Participant AS P", constrainGenerator(arr) + " ORDER BY E.Nom "); 	
  	  	
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
		addCheckField(select, "Enfants", libelle, data[i]["idEnfant"], "");
	}
}

function printAttestation() {
	var parent = document.getElementsByName('Enfants');
	
	for (var i = 0 ; i < parent.length ; i++) {
		if (parent[i].checked) {
			var arr = new Array();
			arr.push(" E.idEnfant = '"+parent[i].value+"' ");
			arr.push(" E.idEnfant = P.Enfant ");
			arr.push(" P.DateDebut = '"+dateReverse(document.getElementById("ClasseVerte")[document.getElementById("ClasseVerte").selectedIndex].text.substr(-10))+"' ");
			arr.push(" P.Lieu = '"+document.getElementById("ClasseVerte").value+"' ");
			arr.push(" C.DateDebut = P.DateDebut ");
			arr.push(" C.Lieu = P.Lieu ");
			arr.push(" E.Niveau = N.Nom ");
	
			var data = getValues("DISTINCT *", "Enfant AS E, Participant AS P, ClasseVerte AS C, Niveau AS N", constrainGenerator(arr));

			// Elaboration du message de confirmation
			//		
			window.open("phpscripts/PDFAttestationClasse.php?Filename=Attestation de classe verte - "+parent[i].parentNode.firstChild.data+"&Nom="+parent[i].parentNode.firstChild.data+"&Classe="+data[0]["NomComplet"]+"&Lieu="+document.getElementById("ClasseVerte").value+"&DateDebut="+dateReverse(data[0]["DateDebut"])+"&DateFin="+dateReverse(data[0]["DateFin"])+"&Prix="+data[0]["PrixComptable"]);
		}
	}
}