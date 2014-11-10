import IEventDispatcher = require("lib/temple/events/IEventDispatcher");

class BaseEvent
{
	/**
	 * The event target.
	 */
	public target:IEventDispatcher;

	public _stopImmediatePropagation:boolean;

	/**
	 * Creates an Event object to pass as a parameter to event listeners.
	 * @param type The type of event.
	 */
	constructor(public type:string)
	{

	}

	/**
	 * Prevents processing of any event listeners in the current node and any subsequent nodes in the event flow.
	 */
	public stopImmediatePropagation()
	{
		this._stopImmediatePropagation = true;
	}
}

export = BaseEvent