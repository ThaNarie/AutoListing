///<reference path="../../lib/definitions/definitions.d.ts" />
define(["require", "exports", 'knockout'], function (require, exports, ko) {
    /**
     * @namespace app.control
     * @class StartUp
     */
    var StartUp = (function () {
        function StartUp() {
            // custom binding
            ko.bindingHandlers.allowBindings = {
                isBound: false,
                init: function (element, valueAccessor) {
                    // Let bindings proceed as normal *only if* my value is false
                    var shouldAllowBindings = ko.utils.unwrapObservable(valueAccessor());
                    this.isBound = shouldAllowBindings;
                    return { controlsDescendantBindings: !shouldAllowBindings };
                },
                update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                    var shouldAllowBindings = ko.utils.unwrapObservable(valueAccessor());
                    if (shouldAllowBindings && !this.isBound) {
                        this.isBound = true;
                        ko['applyBindingsToDescendants'](bindingContext, element);
                    }
                }
            };
            ko.virtualElements.allowedBindings['allowBindings'] = true;
        }
        StartUp.prototype.execute = function (callback) {
            if (callback === void 0) { callback = null; }
            if (callback) {
                callback();
            }
            //		this._callback = callback;
            //
            //		this._sequence = new Sequence();
            //
            //		if (DEBUG && ConfigManager.getInstance().getEnvironment() != 'live'
            //			&& ConfigManager.getInstance().getEnvironment() != 'prod'
            //			&& ConfigManager.getInstance().getEnvironment() != 'production')
            //		{
            //			this._sequence.add(new dbt.DevBarTask());
            //		}
            //
            //		// add your own tasks
            ////		this._sequence.add(new ilt.InitLocaleTask());
            //
            //		this._sequence.add( <ITask> new MethodTask( <any> this.onSequenceDone.bind(this)));
            //		this._sequence.execute();
        };
        return StartUp;
    })();
    return StartUp;
});
