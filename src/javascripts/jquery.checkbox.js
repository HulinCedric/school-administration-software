// Coche/décoche une case lorsqu’on clique sur un paragraphe
//
$(".toggle_container_check p").live("click", function(event) {
	var target = $(event.target);
	if (target.is('input:checkbox'))
		return;

	var checkbox = $(this).find("input[type='checkbox']");

	if (checkbox.attr("checked") != "checked") {
		$(this).css({
			background : "gray",
			color : "white"
		});
		checkbox.attr("checked", "checked");
	} else {
		$(this).css({
			background : "rgba(255,255,255,0)",
			color : "black"
		});
		checkbox.attr("checked", false);
	}
});

$(".toggle_container_notcheck p").live("click", function(event) {
	var target = $(event.target);
	if (target.is('input:checkbox'))
		return;

	var checkbox = $(this).find("input[type='checkbox']");

	if (checkbox.attr("checked") != "checked") {
		$(this).css({
			background : "gray",
			color : "white"
		});
		checkbox.attr("checked", "checked");
	} else {
		$(this).css({
			background : "rgba(255,255,255,0)",
			color : "black"
		});
		checkbox.attr("checked", false);
	}
});