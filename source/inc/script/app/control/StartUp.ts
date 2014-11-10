///<reference path="../../lib/definitions/definitions.d.ts" />

import ko = require('knockout');

/**
 * @namespace app.control
 * @class StartUp
 */
class StartUp
{
	private _callback:() => any;

	constructor()
	{
		// custom binding
		ko.bindingHandlers.allowBindings = {
			isBound: false,
			init: function(element, valueAccessor) {
				// Let bindings proceed as normal *only if* my value is false
				var shouldAllowBindings = ko.utils.unwrapObservable(valueAccessor());

				this.isBound = shouldAllowBindings;

				return { controlsDescendantBindings: !shouldAllowBindings };
			},
			update: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
				var shouldAllowBindings = ko.utils.unwrapObservable(valueAccessor());

				if (shouldAllowBindings && !this.isBound)
				{
					this.isBound = true;
					ko['applyBindingsToDescendants'](bindingContext, element);
				}
			}
		};
		ko.virtualElements.allowedBindings['allowBindings'] = true;
	}

	execute(callback: () => any = null)
	{
		if (callback)
		{
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
	}
	//
	//private onSequenceDone()
	//{
	//	if (this._callback)
	//	{
	//		this._callback();
	//	}
	//}
	//
	//afterGaia()
	//{
	//}
}

export = StartUp;