// (c) Beheer H & V B.V. Alle intellectuele eigendomsrechten op het computerprogramma TeleToets en op deze broncode van dat computerprogramma, berusten uitsluitend bij Beheer H & V B.V.
g_AutoSaveDelay = -1; // No autosave after (x) ms. Negative value skips autosave.
g_RealSubmitOnly = true; // No autosave right before submit. Normal async saves keep working.

var stijlurl = StijlBaseUrl + "/ibg_minerva/examen/epe2013_lees/";

var mediaRecorderStyleDefaults = {
	serverUrl: "rtmp://content.minerva-examens.nl/ins_luisteren/",
	width: 352,
	height: 284,
	player: {
		controls: [],
		audio: {
			// Only Audio files are mp3 format, video uses the default
			mediaFileType: "mp3"
		}
	}
};

var afterMediaRecorders = function () {
	// Highlighting
	$(".mediaContainer").on("recorderStatusChanged", function(event, data) {
		if(data.statusNew === "ended" || data.statusNew === "stopped" || data.statusNew === "playing") {
			$(".antwoordmogelijkheid, #divVraagtekst, #divCasustekst").removeClass("tekstveld_actief");
		}

		if(data.statusNew === "playing") {
			$(this).closest(".antwoordmogelijkheid, #divVraagtekst, #divCasustekst").addClass("tekstveld_actief");
		}
	});

	// Mediacontrols in casushead
	$("#divCasushead").append($('<div class="controlContainer"></div>'));
	$("#divCasushead>.controlContainer").mediaControl({
		controls: [ControlType.PLAY],
		containerSelectors: ["#divCasustekst", "#divVraagtekst", "#divAntwoordtekst"],
		autoStart: true
	});

	// Mediacontrols in vraaghead
	$("#divVraaghead").append($('<div class="controlContainer"></div>'));
	$("#divVraaghead>.controlContainer").mediaControl({
		controls: [ControlType.PLAY],
		containerSelectors: ["#divVraagtekst"]
	});

	// Mediacontrols in antwoordhead
	$("#divAntwoordhead").append($('<div class="controlContainer"></div>'));
	$("#divAntwoordhead>.controlContainer").mediaControl({
		controls: [ControlType.PLAY],
		containerSelectors: ["#divAntwoordtekst"]
	});

	if($(".mediaContainer").length > 0) {
		// Volume control
		$("#divNavKnoppen").append($('<div id="volumeControl"></div>'));
		$("#volumeControl").mediaControl({
			controls: [ControlType.VOLUME],
			containerSelectors: ["#SubmitForm"]
		});
	}
};

BeforePageLoadDuoMods();

$(document).ready(function(){
    DuoModOpgaveToTekst();
    DuoModAddNumberOfAnswersClasses();
    DuoModMarkGivenAnswer();
    DuoModTimeNotification();
    ModOnlyCloseButtonWhenAtLastQuestion();
    $("#divHead").removeClass("kleinereknoppen");
    DuoModRemoveScoreFromVraagHeadReady();
});
