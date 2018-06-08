$(document).keypress(function(event){
	if(String.fromCharCode(event.which)== "i") {

		$("#infoBox").toggle();
		//alert(String.fromCharCode(event.which));
	}
	document.onkeydown = function(evt) {
    evt = evt || window.event;
    if (evt.keyCode == 27) {
        $("#infoBox").css("display","none");
    }
};
});