$(document).ready(function() {

    $('#essay').on('click','.highlight',function(){
        var text = $(this).text()
        $(this).removeClass('highlight');
    })

});
