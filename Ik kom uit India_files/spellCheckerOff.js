$(document).ready(function () {
    $('textarea').each(function () {
        $(this).attr('spellcheck','false');
    });
    $(':text').each(function () {
        $(this).attr('spellcheck','false');
    });
});