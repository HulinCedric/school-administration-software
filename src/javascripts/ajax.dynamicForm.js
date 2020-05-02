var idSelected = -1;
var promotionSelected = "";
var nomServiceSelected = "";
var nomClasseSelected = "";
var lieuClasseVerteSelected = "";
var dateDebutClasseVerteSelected = "";
var chargePersonnelSelected = "";
var demiGroupeSelected = "";
var moduleSelected = "";

var icons = {
	header : "ui-icon-circle-plus",
	headerSelected : "ui-icon-circle-minus"
};

function addTitle(parent, name, id, clickFunction) {
	var h2 = document.createElement("h2");
	var a = document.createElement("a");

	a.appendChild(document.createTextNode(name));
	h2.setAttribute("onclick", clickFunction);
	h2.setAttribute("id", id);
	h2.setAttribute("class", "trigger");
	h2.appendChild(a);

	parent.appendChild(h2);
}

function addContainerOpen(parent, id) {
	var div = document.createElement("div");
	div.setAttribute("class", "toggle_container_open");
	div.setAttribute("id", id);

	parent.appendChild(div);

	return div;
}

function addLabel(parent, name, id) {
	var label = document.createElement("label");
	label.setAttribute("for", id);
	label.appendChild(document.createTextNode(name));

	parent.appendChild(label);
}

function addInputFieldSimple(parent, label, id, maxLength, defaultValue) {
	var input = document.createElement("input");
	input.setAttribute("id", id);
	input.setAttribute("maxlength", maxLength);
	input.setAttribute("type", "text");
	input.setAttribute("value", defaultValue);
	parent.appendChild(input);
}

function addSection(parent, name, id, clickFunction) {
	var h3 = document.createElement("h3");
	var a = document.createElement("a");
	var text = document.createTextNode(name);

	a.appendChild(text);
	h3.setAttribute("onclick", "idSelectedChange(this.id);" + clickFunction);
	h3.setAttribute("id", id);
	h3.appendChild(a);
	parent.appendChild(h3);
}

function addSubSection(parent, name) {
	var h4 = document.createElement("h4");
	var text = document.createTextNode(name);
	h4.appendChild(text);
	parent.appendChild(h4);

	var div = document.createElement("div");
	div.setAttribute("class", "toggle_container");
	parent.appendChild(div);

	return div;
}

function addInformation(parent, label, information) {
	if (information == undefined)
		return;
	if (label != "")
		label = label + " : ";
	var p = document.createElement("p");
	var text = document.createTextNode(label + information);
	p.appendChild(text);
	parent.appendChild(p);
}

function addLinkInformation(parent, information, nameLink, link) {
	if (nameLink == undefined)
		return;
	var p = document.createElement("p");
	var a = document.createElement("a");
	a.setAttribute("href", link);
	a.appendChild(document.createTextNode(nameLink));
	p.appendChild(document.createTextNode(information));
	p.appendChild(a);
	parent.appendChild(p);
}

function addInputField(parent, label, id, maxLength, defaultValue) {
	var p = document.createElement("p");
	var input = document.createElement("input");
	input.setAttribute("id", id);
	input.setAttribute("maxlength", maxLength);
	input.setAttribute("type", "text");
	input.setAttribute("value", defaultValue);
	p.appendChild(document.createTextNode(label));
	p.appendChild(input);
	parent.appendChild(p);
}

function addOptionField(parent, label, value) {
	var option = document.createElement("option");
	option.setAttribute("value", value);
	option.appendChild(document.createTextNode(label));
	parent.appendChild(option);
}

function emptySelect(selectId) {
	var select = document.getElementById(selectId);
	while (select.firstChild)
		select.removeChild(select.firstChild);
}

function addCheckField(parent, name, label, value, checked) {
	var checkbox = document.createElement("input");
	checkbox.setAttribute("type", "checkbox");
	checkbox.setAttribute("value", value);
	if (checked != "")
		checkbox.setAttribute("checked", checked);
	checkbox.setAttribute("name", name);
	var p = document.createElement("p");
	p.appendChild(document.createTextNode(label));
	p.appendChild(checkbox);
	parent.appendChild(p);
}

function idSelectedChange(id) {
	idSelected = id;

	if (idSelected != -1)
		document.getElementById("submit").style.visibility = "visible";
	else
		document.getElementById("submit").style.visibility = "hidden";
}

function promotionSelectedChange(promotion) {
	promotionSelected = promotion;
}

function nomClasseSelectedChange(nomClasse) {
	nomClasseSelected = nomClasse;
}

function nomServiceSelectedChange(nomService) {
	nomServiceSelected = nomService;
}

function lieuClasseVerteSelectedChange(lieuClasseVerte) {
	lieuClasseVerteSelected = lieuClasseVerte;
}

function dateDebutClasseVerteSelectedChange(dateDebutClasseVerte) {
	dateDebutClasseVerteSelected = dateDebutClasseVerte;
}

function chargePersonnelSelectedChange(charge) {
	chargePersonnelSelected = charge;
}

function demiGroupeSelectedChange(demiGroupe) {
	demiGroupeSelected = demiGroupe;
}

function moduleSelectedChange(module) {
	moduleSelected = module;
}