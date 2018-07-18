
// Reading Colors from CSV

$(document).ready(function() {
    $.ajax({
        type: "GET",
        url: "wheel/colors.txt",
        dataType: "text",
        success: function(data) {initGame(data);}
    });
});



