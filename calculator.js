/* Main javascript file for the Claculator+ extension. */
console.log('Calculator+ successfully loaded!\n');

// some variables to help us
var sequence = 0;
var operators = ['/','*','.','-','+','='];

// check a cookie for answers to previous calculations
if (document.cookie) {
	$('#output').val(document.cookie.substr(9));
}

// run a function when user clicks a button or presses enter
$(document).on("keypress", function(key) {
	switch (key.which) {
		case 13:
			submit();
			break;
		case 99:
			$('#output').val('');
			break;
		case 67:
			$('#output').val('');
			break;
		case 61:
			submit();
			break;
	}
});
$('#equal').click(submit);

// receive calculated data or error message from sandboxed iframe
window.addEventListener("message", receiveMessage, false);
function receiveMessage(event) {
  	$('#output').val(event.data);
  	document.cookie="lastCalc=" + event.data;
  	console.log('Answer: ' + event.data + '\n');
}

// prevent user from typing an operator twice
$('#output').keydown(stringFix);
$('#output').keyup(stringFix2);

// adding some functionality to buttons
$('.knopke').click(function(){
	$('#output').focus();
	setTimeout(function(){
		if ($.inArray($('#output').val(), operators) >= 0) {
			$('#output').val('');
		}
		document.cookie="lastCalc=" + $('#output').val();
	}, 100);
});

$('#del').click(function() {
  $('#output').val('');
});

$('.value').click(function(){
	if ($.inArray($('#output').val().slice(-1), operators) >= 0 && $.inArray($(this).text(), operators) >= 0) {
		var edited = $('#output').val();
	} else {
		var edited = $('#output').val() + $(this).text();
	}
	$('#output').val(edited);
	$('#output').get(0).scrollLeft = $('#output').get(0).scrollWidth;
});

$('#back').click(function(){
	var str = $('#output').val();
	$('#output').val(str.slice(0, - 1));
});

// functions used by things above
function stringFix() {
	if ($.inArray($('#output').val().slice(-1) , operators) >= 0) {
		sequence = 1;
	} else {
		sequence = 0;
	}
}

function stringFix2(){

	if ($.inArray($('#output').val(), operators) >= 0) {
		$('#output').val('');
	}

	if ($.inArray($('#output').val().slice(-1) , operators) >= 0 && sequence == 1) {
		var textfield = $('#output').val();
		$('#output').val(textfield.slice(0, - 1));
		sequence = 0
	}
	$('#output').val($('#output').val().replace(/([^\d\+\-\.\*\/\=\(\)])/g, ''));
	document.cookie="lastCalc=" + $('#output').val();
}

// pass calculation to safe sandbox iframe, since eval() is disabled by default on chrome aplications in order to prevent XSS attacks
function submit() {
	// make sure that value does not begin or end with an operator
	if ($.inArray($('#output').val().slice(-1) , operators) >= 0) {
		var message = $('#output').val().slice(0, - 1);
	} else {
		var message = $('#output').val();
	}
	document.getElementById('mathFrame').contentWindow.postMessage(message , '*');
	console.log('Operation: ' + $('#output').val());
}
