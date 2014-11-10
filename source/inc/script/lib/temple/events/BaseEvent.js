define(["require", "exports"], function (require, exports) {
    var BaseEvent = (function () {
        /**
         * Creates an Event object to pass as a parameter to event listeners.
         * @param type The type of event.
         */
        function BaseEvent(type) {
            this.type = type;
        }
        /**
         * Prevents processing of any event listeners in the current node and any subsequent nodes in the event flow.
         */
        BaseEvent.prototype.stopImmediatePropagation = function () {
            this._stopImmediatePropagation = true;
        };
        return BaseEvent;
    })();
    return BaseEvent;
});
