$(function () {
    var clickEvent = function (element, mouseEvent) {
        mouseEvent.preventDefault();
        var windowWidth = $(window).width();
        var windowHeight = $(window).height();
        var button = element;
        var page = button.href;
        var pagetitle = button.title;
        var $dialog = $('<div id="modalattachment"></div>')
            .html('<iframe src="' + page + '" width="100%" height="100%"></iframe>')
            .dialog({
            autoOpen: false,
            modal: true,
            height: windowHeight * 0.9,
            width: windowWidth * 0.9,
            title: pagetitle
        });
        $dialog.dialog('option', 'closeText', '');
        $dialog.dialog('open');
    };
    ClickEventHelper.addClickEventsByAttributeValue("data-attachment-allow-modal", "true", clickEvent);
});
//# sourceMappingURL=modalAttachments.js.map