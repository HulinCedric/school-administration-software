// On cache les champs
//
$(".toggle_container").hide();

// Permet de ne pas remonter en haut de la page
//
$("h2.trigger").toggle(function() {
	$(this).addClass("active");
}, function() {
	$(this).removeClass("active");
});

// Au click, on deploie le conteneur des champs
//
$("h2.trigger").click(function() {
	$(this).next(".toggle_container").slideToggle("normal");
	$(this).next(".toggle_container_open").slideToggle("normal");
});

// Panoplie de datepicker prédéfinie
//
$(".datepicker").datepicker({
	dateFormat : "dd/mm/yy",
	showAnim : "fadeIn",
	changeMonth : true,
	changeYear : true
});
$(".datepicker-naissance").datepicker({
	dateFormat : "dd/mm/yy",
	showAnim : "fadeIn",
	changeMonth : true,
	changeYear : true,
	maxDate : '+0y +0m +0w'
});
$(".datepicker-default").datepicker({
	dateFormat : "dd/mm/yy",
	showAnim : "fadeIn",
	changeMonth : true,
	changeYear : true,
	minDate : '+0y +0m +0w'
});
$(".datepicker-default").datepicker('setDate', new Date());
$.datepicker.setDefaults($.datepicker.regional["fr"]);

// Timepicker prédéfinie
//
$('.timepicker').timepicker({
	hourText : 'Heures',
	minuteText : 'Minutes',
	amPmText : [ '', '' ],
	timeSeparator : 'h'
});