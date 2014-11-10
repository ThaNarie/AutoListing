// todo: add automatich destruction of intervals, gateway PendingCalls, knockout subscriptions and components
define(["require", "exports"], function (require, exports) {
    /**
     * @module Temple
     * @namespace temple.core
     * @class Destructible
     */
    var Destructible = (function () {
        function Destructible() {
            /**
             * @property isDestructed
             * @type boolean
             * @default false
             */
            this.isDestructed = false;
            /**
             * @property eventNamespace
             * @type string
             * @default
             */
            this.eventNamespace = '';
            this.eventNamespace = '.' + (++Destructible.eventNamespaceCount);
        }
        Destructible.prototype.destruct = function () {
            this.isDestructed = true;
        };
        Destructible.eventNamespaceCount = 10000000;
        return Destructible;
    })();
    return Destructible;
});
