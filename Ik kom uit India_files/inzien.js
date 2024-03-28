// (c) Beheer H & V B.V. Alle intellectuele eigendomsrechten op het computerprogramma TeleToets en op deze broncode van dat computerprogramma, berusten uitsluitend bij Beheer H & V B.V.

/* jQuery voor map highlighting */
$(document).ready(function () {
    $('.maphilighting').maphilight({ fade: false });

   $("div.SpreekVraag input").each(function () {

       targetNode = $(this).parent().find("div.SpreekVraagPlayer");

       if (!$(this).val() == "") {

           //Set recorder options
           var mediaPlayerOptions = {
               recorderType: RecorderType.SPREEKVRAAGINZIEN,
               swfUrl: "../../Flash/FlashComponent/player.swf",
               playerOptions: {
                   mediaType: $(this).attr("data-mediatype") == 'video' || $(this).attr("data-mediatype") == 'audioVideo' ? MediaType.AUDIOVIDEO : MediaType.AUDIO,
                   fileName: $(this).val(),
                   mode: MediaRecorderMode.PLAYER,
                   volume: 1.0
               },
               controls: [
                  ControlType.PLAY,
                  ControlType.PAUSE,
                  ControlType.STOP,
                  ControlType.TIMELINE,
                  ControlType.TIMEBOX
               ]
           };

           //Render Flash or Html5 Player
           if ($(this).attr("playertype") == 'flash') {
               $(targetNode).mediaPlayer(mediaPlayerOptions);
           } else if ($(this).attr("playertype") == 'html5') {
               $(targetNode).mediaPlayerHtml5(mediaPlayerOptions);
           }

       } else {
           //show "no answer"
       }
   });

   // Pijltjes zetten op hotspot vragen, dus antwoorden kandidaat zichtbaar maken.
   $(".divvraag").each(function () {
      var container = $(this);
      container.find("input.pijltjedata").each(function () {
         if ($(this).val()) {
            var pos = $(this).val().split(",");

            var pijl = $(this).parent(".pijltje");
            var x = pos[0];
            var y = pos[1];
            pijl.css("display", "block");
            pijl.css("top", y - 28 + "px");
            pijl.css("left", x - 15 + "px");
            pijl.appendTo(container.find(".hotspotitem"));
         }
      });
      container.find("input.koppelgegevendata").each(function () {
         if ($(this).val()) {
            var pos = $(this).val().split(",");

            var pijl = $(this).parent(".koppelgegeven");
            var x = pos[0];
            var y = pos[1];
            pijl.css("display", "block");
            pijl.css("top", y + "px");
            pijl.css("left", x + "px");
            pijl.appendTo(container.find("#startgegeven"));
         }
         else {
            //niet geplaatst
            var koppelgegeven = $(this).parent(".koppelgegeven");
            koppelgegeven.hide();
         }
      });

       /* titel op hotspots weergeven */
      container.find('.hotspotimg > map > area').each(function () {
          $('<div>')
              .css(computeHotspotTitleCss($(this)))
              .addClass('hotspottitle')
              .text($(this).attr('title'))
              .appendTo($(this).parent().parent().children().first('div'));
      });

   });
});

function computeHotspotTitleCss($imageMapArea) {
    var shape = $imageMapArea.prop("shape");
    var coords = $imageMapArea.prop("coords").split(",");
    var style =
    {
        position: "absolute",
        display: "block",
        backgroundColor: "#ffffff",
        opacity: 0.9,
        whiteSpace: "nowrap"
    }
    switch (shape.toLowerCase()) {
        case "circle":
            var radius = coords[2];
            style.left = (coords[0] - radius) + "px";
            style.top = (coords[1] - radius) + "px";
            break;
        case "rect":
            style.left = coords[0] + "px";
            style.top = coords[1] + "px";
            break;
        default:
            break;
    }
    return style;
}

/*
Try to reload the mediaitem.
*/
function ForceReloadMediaItem(mediaitem, manual)
{
   var ra = $(mediaitem).data('reloadattempts');
   var maxretries = 5;
   if (ra <= maxretries || manual) {
      console.log('media error, reloading attempt ' + ra);
      var clone = $(mediaitem).clone(true, true).data('reloadattempts', ra + 1).data('loaded', false);
      setTimeout(function () {
         $(mediaitem).replaceWith(clone);
         clone.load();
      }, 1000);
   }
}

/*
1) Pause media when not in view
2) Attempt reload on error
*/
$(document).ready(function () {
   // Get media - with autoplay disabled (audio or video)
   var media = $('video, audio').not("[autoplay='autoplay']");
   media.on('loadstart', function () { $(this).data('loading', true) });
   media.on('canplay', function () { $(this).data('loaded', true) });
   media.on('error', function () { ForceReloadMediaItem(this, false); });
   media.each(function (index, el) {
      //backup src
      $(this).data('src', $(this).prop('src'));
      $(this).children('source').each(function (i, e) {
         $(this).data('src', $(this).prop('src'));
      });
      $(this).data('reloadattempts', 0);
   });

   var tolerancePixel = 40;

   function checkMedia() {
      // Get current browser top and bottom
      var scrollTop = $(window).scrollTop() + tolerancePixel;
      var scrollBottom = $(window).scrollTop() + $(window).height() - tolerancePixel;

      //load media if in view and not already loaded
      media.each(function (index, el) {
         var yTopMedia = $(this).offset().top;
         var yBottomMedia = $(this).height() + yTopMedia;
         var mediaElement = this;

         if (scrollTop < yBottomMedia && scrollBottom > yTopMedia) {
            if (this.error) {
               ForceReloadMediaItem(mediaElement, true);
            }
         } else if ($(mediaElement).data('loaded') == true && !mediaElement.paused && !mediaElement.error) {
            //pause when scrolled out of view
            mediaElement.pause();
         }
      });
   }
   $('body').on('scroll', checkMedia);
   checkMedia();
});


$(window).on("unload", function () {
   //cleanup media resources for IE
   $('video, audio').each(function (index, el) {
      $(this).get(0).pause();
      $(this).get(0).src = '';
      $(this).children('source').prop('src', '');
      $(this).get(0).load();
      $(this).remove().length = 0;
   });

});