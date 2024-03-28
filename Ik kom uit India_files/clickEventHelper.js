var ClickEventHelper = /** @class */ (function () {
    function ClickEventHelper() {
    }
    /**
     * Adds click events to elements selected by attribute name.
     */
    ClickEventHelper.addClickEventsByAttributeName = function (attributeName, clickEvent) {
        var htmlDataElements = this.getElementsByAttribute(attributeName);
        if (!htmlDataElements || htmlDataElements.length < 1) {
            return;
        }
        var _loop_1 = function (element) {
            element.onclick = function (mouseEvent) { return clickEvent(element, mouseEvent); };
        };
        for (var _i = 0, htmlDataElements_1 = htmlDataElements; _i < htmlDataElements_1.length; _i++) {
            var element = htmlDataElements_1[_i];
            _loop_1(element);
        }
    };
    /**
    * Adds click events to elements selected by attribute name.
    */
    ClickEventHelper.addClickEventsByAttributeValue = function (attributeName, attributeValue, clickEvent) {
        var htmlDataElements = this.getElementsByAttribute(attributeName, attributeValue);
        if (!htmlDataElements || htmlDataElements.length < 1) {
            return;
        }
        var _loop_2 = function (element) {
            element.onclick = function (mouseEvent) { return clickEvent(element, mouseEvent); };
        };
        for (var _i = 0, htmlDataElements_2 = htmlDataElements; _i < htmlDataElements_2.length; _i++) {
            var element = htmlDataElements_2[_i];
            _loop_2(element);
        }
    };
    /**
    * Gets HTML elements by attribute name, optionally filtered by value.
    */
    ClickEventHelper.getElementsByAttribute = function (attributeName, attributeValue) {
        var dataElements = $("[" + attributeName + "]");
        var htmlDataElements = new Array();
        dataElements.each(function (number, element) {
            var attribute = element.attributes.getNamedItem(attributeName);
            if (!attribute) {
                return true;
            }
            if (attributeValue && attribute.value !== attributeValue) {
                return true;
            }
            htmlDataElements.push(element);
        });
        return htmlDataElements;
    };
    return ClickEventHelper;
}());
//# sourceMappingURL=clickEventHelper.js.map