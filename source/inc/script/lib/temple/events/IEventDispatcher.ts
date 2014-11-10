import IDestructible = require('lib/temple/core/IDestructible');
import BaseEvent = require('lib/temple/events/BaseEvent');

interface IEventDispatcher extends IDestructible
{
	addEventListener(type:string, listener:(event:BaseEvent) => any, priority?:number, once?:boolean):IDestructible

	dispatchEvent(event:BaseEvent):void;

	hasEventListener(type:string):boolean;

	removeEventListener(type:string, handler:(event:BaseEvent) => any):void;

	removeAllEventListeners(type?:string):void;
}

export = IEventDispatcher;