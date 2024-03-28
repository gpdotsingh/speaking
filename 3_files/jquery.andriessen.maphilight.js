// (c) Beheer H & V B.V. Alle intellectuele eigendomsrechten op het computerprogramma TeleToets en op deze broncode van dat computerprogramma, berusten uitsluitend bij Beheer H & V B.V.
(function ($) {
    var has_VML, create_canvas_for, add_shape_to, shape_from_area,
		canvas_style, fader, hex_to_decimal, css3color, is_image_loaded, options_from_area;

    has_VML = document.namespaces;
    has_canvas = true; // !!document.createElement('canvas').getContext;

    if (!(has_canvas || has_VML)) {
        $.fn.maphilight = function () { return this; };
        return;
    }

    fader = function (element, opacity, interval) {
        if (opacity <= 1) {
            element.style.opacity = opacity;
            window.setTimeout(fader, 10, element, opacity + 0.1, 10);
        }
    };

    hex_to_decimal = function (hex) {
        return Math.max(0, Math.min(parseInt(hex, 16), 255));
    };
    css3color = function (color, opacity) {
        return 'rgba(' + hex_to_decimal(color.substr(0, 2)) + ',' + hex_to_decimal(color.substr(2, 2)) + ',' + hex_to_decimal(color.substr(4, 2)) + ',' + opacity + ')';
    };
    add_canvas_to = function (img) {
        var c = document.createElement('canvas');

        $(img).before(c);

        c.setAttribute("width", img.width);
        c.setAttribute("height", img.height);
        c.setAttribute("class", "canvasmap");

        c.getContext("2d").clearRect(0, 0, c.width, c.height);
        return c;
    };
    add_shape_to = function (canvas, shape, coords, options, name) {
        var i, context = canvas.getContext('2d');

        context.beginPath();
        if (shape == 'rect') {
            context.rect(coords[0], coords[1], coords[2] - coords[0], coords[3] - coords[1]);
        } else if (shape == 'poly') {
            context.moveTo(coords[0], coords[1]);
            for (i = 2; i < coords.length; i += 2) {
                context.lineTo(coords[i], coords[i + 1]);
            }
        } else if (shape == 'circ') {
            context.arc(coords[0], coords[1], coords[2], 0, Math.PI * 2, false);
        }

        context.closePath();

        if (options.fill) {
            context.fillStyle = css3color(options.fillColor, options.fillOpacity);
            context.fill();
        }
        if (options.stroke) {
            context.strokeStyle = css3color(options.strokeColor, options.strokeOpacity);
            context.lineWidth = options.strokeWidth;
            context.stroke();
        }
        if (options.fade) {
            fader(canvas, 0);
        }

    };

    shape_from_area = function (area) {
        var i, coords = area.getAttribute('coords').split(',');
        for (i = 0; i < coords.length; i++) { coords[i] = parseFloat(coords[i]); }
        return [area.getAttribute('shape').toLowerCase().substr(0, 4), coords];
    };

    options_from_area = function (area, options) {
        var $area = $(area);
        return $.extend({}, options, $.metadata ? $area.metadata() : false, $area.data('maphilight'));
    };

    is_image_loaded = function (img) {
        if (!img.complete) { return false; } // IE
        if (typeof img.naturalWidth != "undefined" && img.naturalWidth == 0) { return false; } // Others
        return true;
    };

    canvas_style = {
        position: 'absolute',
        left: 0,
        top: 0,
        padding: 0,
        border: 0
    };

    $.fn.maphilight = function (opts) {
        opts = $.extend({}, $.fn.maphilight.defaults, opts);

        return this.each(function () {
            var img, wrap, options, map, canvas, usemap;
            img = $(this);

            if (!is_image_loaded(this)) {
                // If the image isn't fully loaded, this won't work right.  Try again later.
                return window.setTimeout(function () {
                    img.maphilight(opts);
                }, 200);
            }

            options = $.extend({}, opts, $.metadata ? img.metadata() : false, img.data('maphilight'));

            // jQuery bug with Opera, results in full-url#usemap being returned from jQuery's attr, so use raw getAttribute instead.
            usemap = img.get(0).getAttribute('usemap');

            map = $('map[name="' + usemap.substr(1) + '"]');

            if (!(img.is('img') && usemap && map.size() > 0)) { return; }

            if (img.hasClass('maphilighted')) {
                // We're redrawing an old map, probably to pick up changes to the options, just clear out all the old stuff.
                var wrapper = img.parent();
                img.insertBefore(wrapper);
                wrapper.remove();
            }

            wrap = $('<div></div>').css({
                display: 'block',
                background: 'url(' + this.src + ')',
                position: 'relative',
                padding: 0,
                width: this.width,
                height: this.height
            });

            if (options.wrapClass) {
                if (options.wrapClass === true) {
                    wrap.addClass($(this).attr('class'));
                } else {
                    wrap.addClass(options.wrapClass);
                }
            }

            img.before(wrap).css('opacity', 0).css(canvas_style).remove();
            var isIE = /*@cc_on!@*/false || !!document.documentMode;
            if (isIE) { img.css('filter', 'Alpha(opacity=0)'); }
            wrap.append(img);

            canvas = add_canvas_to(this);

            $(canvas).css(canvas_style);

            var hilighter = function (e) {
                var shape, area_options;
                area_options = options_from_area(this, options);

                shape = shape_from_area(this);
                add_shape_to(canvas, shape[0], shape[1], area_options, "highlighted");
            }

            $(map).find('area[coords]').each(hilighter);

            img.addClass('maphilighted');
        });
    };
    $.fn.maphilight.defaults = {
        fill: true,
        fillColor: '000000',
        fillOpacity: 0.2,
        stroke: true,
        strokeColor: 'ff0000',
        strokeOpacity: 1,
        strokeWidth: 1,
        fade: true,
        alwaysOn: false,
        neverOn: false,
        groupBy: false,
        wrapClass: true
    };
})(jQuery);
