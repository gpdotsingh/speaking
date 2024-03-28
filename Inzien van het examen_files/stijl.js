// (c) Beheer H & V B.V. Alle intellectuele eigendomsrechten op het computerprogramma TeleToets en op deze broncode van dat computerprogramma, berusten uitsluitend bij Beheer H & V B.V.

var mediaRecorderStyleDefaults = {
    width: 352,
    height: 284
};

function tryAddCloseButton() {
    if (location.search.indexOf('showclose=true') !== -1) {
        sessionStorage.setItem('showclose', true);
    } else {
        if (!sessionStorage.getItem('showclose')) {
            return;
        }
    }
    $('<div>✖</div>')
        .css({
            cursor: 'pointer',
            fontSize: 16,
            position: 'fixed',
            right: 8,
            top: 4,
            color: '#aaa',
        })
        .click(function () {
            window.close();
        })
        .appendTo('body');
}

$(document).ready(function () {
    tryAddCloseButton();

    if ($("#btnStart").is(":visible")) {
        eraseCookie("showRemainingTime");
    }

    if ($("#divHead").outerHeight() < $("#olNavVragen").outerHeight()) {
        $("#divHead").addClass("kleinereknoppen");
        if ($(".vBtn.actief").length > 0) {
            $("#divHead").scrollTop($(".vBtn.actief").first().offset().top - $("#olNavVragen").offset().top);
        }
    }

    if ($(".markeertoolbar").length === 0) {
        $("#spMarkerenUitleg").hide();
    }

    if ($(".corrector").length !== 0) {
        if (window.screen) {
            var noError = true;
            try {
                window.moveTo(0, 0);// this line causes an occasional "Access is denied" error
            }
            catch (e) { noError = false; }
            if (noError) window.resizeTo(screen.availWidth, screen.availHeight);
        }
    }

    if (typeof remainingTimeVisibility !== "undefined") {
        var remainingTimeContainer = $('#divNavKnoppen .resterendeTijd');
        if (remainingTimeVisibility === "hide") {
            remainingTimeContainer.hide();
        } else if (remainingTimeVisibility === "toggle") {
            remainingTimeContainer.css("cursor", "pointer").wrapInner("<div id='remainingTime'></div>");
            var hideText = remainingTimeContainer.data("label-hide");
            var showText = remainingTimeContainer.data("label-show");
            remainingTimeContainer.append($('<div/>').text(hideText).attr('id', 'hideRemainingTime').hide());
            $('<div/>').text(showText)
                .attr('id', 'showRemainingTime')
                .addClass('examentools')
                .hide()
                .on('click', toggleRemainingTime)
                .css("cursor", "pointer")
                .insertAfter(remainingTimeContainer);

            remainingTimeContainer.on('click', toggleRemainingTime);
            remainingTimeContainer.on('mouseover', mouseoverRemainingTime);
            remainingTimeContainer.on('mouseout', mouseoutRemainingTime);
            if (readCookie('showRemainingTime') === "false") {
                toggleRemainingTime();
            }
        }
    } else {
        $("#spTimeToggleExplanation").hide();
    }

    // Remove black bars above and below videos when videos are smaller then their viewports
    setTimeout(function () {
        var videos = $("#divVraagtekst").find("video");
        for (var i = 0; i < videos.length; i++) {
            var elem = $(videos[i]);

            var width = elem.width();
            var height = elem.height();

            elem.removeAttr("width");
            elem.removeAttr("height");

            var max = width > height ? width : height;

            var style = elem.attr("style");
            if (style) {
                style = style + "; max-width:" + max + "px; max-height:" + max + "px;";
            } else {
                style = "max-width:" + max + "px; max-height:" + max + "px;";
            }
            elem.attr("style", style);
        }
    }, 1);
});

function toggleRemainingTime() {
    $("#divNavKnoppen .resterendeTijd").toggle();
    $("#showRemainingTime").toggle();
    createCookie("showRemainingTime", $("#remainingTime").is(":visible"), 0);
}
function mouseoverRemainingTime() {
    $("#remainingTime").hide();
    $("#hideRemainingTime").show();
}
function mouseoutRemainingTime() {
    $("#remainingTime").show();
    $("#hideRemainingTime").hide();
}

function scrollbarWidth() {
    var div = $('<div style="width:50px;height:50px;overflow:hidden;position:absolute;"><div style="height:100px;"></div>');
    // Append our div, do our calculation and then remove it
    $('body').append(div);
    var w1 = $('div', div).innerWidth();
    div.css('overflow-y', 'scroll');
    var w2 = $('div', div).innerWidth();
    $(div).remove();
    return (w1 - w2);
}

function AttachEvent(waar, wanneer, wat) {
    $(waar).bind(wanneer, wat);
}

jQuery.fn.outer = function () {
    return $($('<div></div>').html(this.clone())).html();
};


function createCookie(name, value, days) {
    var expires;

    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toGMTString();
    } else {
        expires = "";
    }
    document.cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value) + expires + "; path=/";
}

function readCookie(name) {
    var nameEQ = encodeURIComponent(name) + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
    return null;
}

function eraseCookie(name) {
    createCookie(name, "", -1);
}


/**
 * Specific mods for JUNODUO styles
 * Should be called before page load
 */
function BeforePageLoadDuoMods() {
    // removes the question number, max points and fixes text flickering display of 'divVraaghead'.
    setTimeout(function () {
        $("#divVraaghead").text("Vraag").css('color', 'white');
    }, 0);
}

/**
 *  Init all specific mods for JUNODUO styles: moved to a central location because they where used in several styles
 */
function InitDuoMods() {
    $("#divCasushead").html("&nbsp;");
    DuoModOpgaveToTekst();
    DuoModAddNumberOfAnswersClasses();
    DuoModMarkGivenAnswer();
    DuoModTimeNotification();

    $("#divHead").removeClass("kleinereknoppen");
    DuoModRemoveScoreFromVraagHeadReady();
}

/**
 * Add classes to current given anwer
 * */
function DuoModMarkGivenAnswer() {
    $("#divAntwoord").click(function (e) {
        if ($(this).find(".antwActief").length > 0) {
            $(this).addClass("antwoordgegeven");
        } else {
            $(this).removeClass("antwoordgegeven");
        }
    }).click();
}

/**
 * Change the title of a time warning from 'Waarschuwing' to 'Let op'
 */
function DuoModTimeNotification() {
    $(".EersteTijdMelding h1:first").text($(".EersteTijdMelding h1:first").text().replace('Waarschuwing', 'Let op'));
    $(".LaatsteTijdMelding h1:first").text($(".LaatsteTijdMelding h1:first").text().replace('Waarschuwing', 'Let op'));
}

/**
 * Change the the tekst 'Opg.' and 'Opgave' to 'Tekst'
 */
function DuoModOpgaveToTekst() {
    $(".opg > input").each(function () {
        $(this).prop('value', $(this).prop('value').replace('Opg.', 'Tekst ').replace('Opgave', 'Tekst'));
    });
    $(".opg").append('<span class="tl"></span>').append('<span class="tr"></span>');
}

/**
 * Add a class to divAntwoordtekst depeding on the number of anwers in it for special styling
 */
function DuoModAddNumberOfAnswersClasses() {
    $('#divAntwoordtekst').addClass("aantalantw" + $('#divAntwoordtekst .antwoordmogelijkheid').length);
}

/**
 * Call this on document ready to change the text of 'Vraaghead' without flickering
 * To make this work you also need to call BeforePageLoadDuoMods() outside document.ready
 * and add #divVraaghead { color: transparent; } to default.css
 */
function DuoModRemoveScoreFromVraagHeadReady() {
    // removes the question number, max points
    $("#divVraaghead").text("Vraag").css('color', 'white');
}

/**
 * Call this on document ready to only show the close button when you are at the last question
 */
function ModOnlyCloseButtonWhenAtLastQuestion() {
    $("#liBtnAfsluiten").hide();

    if ($("#liBtnVolgende").find("input[disabled]").length > 0) {
        $("#liBtnAfsluiten").show();
    }
}

/**
 * Initialize the volume on the startpage or a preview to a value between 0..1
 */
function InitializeVolume(volume) {
    if ($("#btnStart").is(":visible") || readCookie("mediaVolume") === null) {
		document.cookie = "mediaVolume=" + volume + ";";
    }
}
