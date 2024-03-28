var FormSubmitter = /** @class */ (function () {
    /**
     * The FormSubmitModule constructor.
     */
    function FormSubmitter(inputField, form, datasetPropertyName) {
        this.inputField = inputField;
        this.form = form;
        this.datasetPropertyName = datasetPropertyName;
    }
    /**
     * Sets value extracted from the event target.
     * @param target
     */
    FormSubmitter.prototype.setValueByTarget = function (target) {
        if (!target || !target.dataset || !target.dataset[this.datasetPropertyName]) {
            return;
        }
        var inputValue = target.dataset[this.datasetPropertyName];
        this.setInputValueAndSubmit(inputValue);
    };
    /**
     * Sets the input value and submits.
     * @param inputValue
     */
    FormSubmitter.prototype.setInputValueAndSubmit = function (inputValue) {
        if (!inputValue) {
            return;
        }
        this.inputField.value = inputValue;
        this.form.submit();
    };
    return FormSubmitter;
}());
//# sourceMappingURL=formSubmitter.js.map