// Offset for Site Navigation
$('#siteNav').affix({
	offset: {
		top: 100
	}
})

// Detect page change / auto refresh
$(document).ready(function() {
    var currenthtml;
    var latesthtml;

    $.get(window.location.href, function(data) {
        currenthtml = data;
        latesthtml = data;
    });

    setInterval(function() {

        $.get(window.location.href, function(data) {
            latesthtml = data;
        });

        if(currenthtml != latesthtml) {
            location.reload();
            console.log("reloaded");
        } 
    }, 1000);
})
