$(document).ready(function () {
    $('#shiftand').submit(function (e) {
        e.preventDefault();
        
        var pattern = $.trim($('#pattern').val());
        var text = $.trim($('#text').val());

        $('#vis_container').removeClass('hidden');
        $('#shiftand').find(':input:not(:disabled)').prop('disabled', true);
        vis_shift_and(pattern, text);
        
        return false;
    });
});