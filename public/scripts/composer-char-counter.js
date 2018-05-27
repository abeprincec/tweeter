$(document).ready(function() {
	// --- our code goes here ---

	$('textarea').on('input', function(event) {
		const valuelen = $(this).val().length;
		const maxlength = 140;
		let length = maxlength - valuelen;
		$(this)
			.siblings('.counter')
			.text(length);

		length < 0
			? $(this)
					.siblings('.counter')
					.addClass('exceeded')
			: $(this)
					.siblings('.counter')
					.removeClass('exceeded');

					if (valuelen > 140) {
						$('#counter').append(' <span><b>Appended text</b></span>');
					}
	});
});
