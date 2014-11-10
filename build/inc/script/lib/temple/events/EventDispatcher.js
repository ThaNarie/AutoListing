var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", "lib/temple/core/Destructible"], function (require, exports, Destructible) {
    /**
    
     */
    /**
     * The EventDispatcher class is the base class for all classes that dispatch events. The EventDispatcher class implements the
     * IEventDispatcher interface and is the base class for the DisplayObject class. The EventDispatcher class allows any object
     * on the display list to be an event target and as such, to use the methods of the IEventDispatcher interface.
     *
     * @module Temple
     * @namespace temple.events
     * @class EventDispatcher
     * @extends temple.core.Destructible
     */
    var EventDispatcher = (function (_super) {
        __extends(EventDispatcher, _super);
        /**
         * @class EventDispatcher
         * @constructor
         * @param {IEventDispatcher} target
         */
        function EventDispatcher(target) {
            if (target === void 0) { target = null; }
            _super.call(this);
            this._target = target || this;
            this._events = {};
        }
        /**
         * Registers an event listener object with an EventDispatcher object so that the listener receives notification of an event.
         *
         * @method addEventListener
         * @param {string} type The type of event.
         * @param {?} listener  The listener function that processes the event.
         * @param {number} priority  The priority level of the event listener. The higher the number, the higher the priority. All listeners
         * with priority n are processed before listeners of priority n-1. If two or more listeners share the same priority, they
         * are processed in the order in which they were added. The default priority is 0.
         * @param {boolean} once Indicates that the listener is automatically removed after the event is dispatched.
         * @returns {IDestructible} an IDestructible object. Calling 'destruct' on this object will remove this listener.
         */
        EventDispatcher.prototype.addEventListener = function (type, listener, priority, once) {
            if (priority === void 0) { priority = 0; }
            if (once === void 0) { once = false; }
            if (!(type in this._events) || typeof (this._events[type]) === 'undefined') {
                this._events[type] = [];
            }
            for (var i = 0, l = this._events[type].length; i < l; ++i) {
                if (this._events[type][i].listener === listener) {
                    // double
                    if (DEBUG) {
                        console.warn("Trying to add double listener");
                    }
                    return this._events[type][i];
                }
            }
            var data = new EventListenerData(this, type, listener, priority, once);
            this._events[type].push(data);
            this._events[type].sort(this.sort);
            return data;
        };
        /**
         * Dispatches an event into the event flow.
         * @method dispatchEvent
         * @param {BaseEvent} event
         */
        EventDispatcher.prototype.dispatchEvent = function (event) {
            if (this._events) {
                event.target = this._target;
                if (typeof this._events[event.type] != 'undefined') {
                    // create a clone of the list, so we know that it can't be manipulated during the loop
                    var events = this._events[event.type].slice(0);
                    loop: for (var i = 0, l = events.length; i < l; ++i) {
                        if (events[i] && events[i].listener) {
                            if (events[i].once) {
                                var handler = events[i].listener;
                                events[i].destruct();
                                handler.call(this._target, event);
                            }
                            else {
                                events[i].listener.call(this._target, event);
                            }
                            if (event._stopImmediatePropagation) {
                                break loop;
                            }
                        }
                    }
                }
                else if (DEBUG) {
                    console.warn('trying to dispatch event that has no listeners "' + event.type + '"');
                }
            }
        };
        /**
         * Checks whether the EventDispatcher object has any listeners registered for a specific type of event.
         * @param type
         * @returns {boolean}
         */
        EventDispatcher.prototype.hasEventListener = function (type) {
            return this._events && this._events[type] && this._events[type].length > 0;
        };
        /**
         * Removes a listener from the EventDispatcher object. If there is no matching listener registered with the EventDispatcher object, a call to this method has no effect.
         * @param type
         * @param listener
         */
        EventDispatcher.prototype.removeEventListener = function (type, listener) {
            if (this._events) {
                if ((type in this._events) && (this._events[type] instanceof Array)) {
                    for (var i = 0, l = this._events[type].length; i < l; ++i) {
                        if (this._events[type][i].listener === listener) {
                            this._events[type][i].dispatcher = null;
                            this._events[type][i].destruct();
                            this._events[type].splice(i, 1);
                            return;
                        }
                    }
                }
                else if (DEBUG) {
                    console.warn('trying to remove event that has no listeners "' + type + '"');
                }
            }
        };
        /**
         * Removes all event listeners in this EventDispatcher. If a type is provided, only listeners for this type will be removed.
         * @param type
         */
        EventDispatcher.prototype.removeAllEventListeners = function (type) {
            if (this._events) {
                if (typeof type == 'undefined') {
                    for (type in this._events) {
                        if (this._events[type] instanceof Array) {
                            while (this._events[type].length) {
                                var data = this._events[type].shift();
                                data.dispatcher = null;
                                data.destruct();
                            }
                        }
                    }
                }
                else if ((type in this._events) && (this._events[type] instanceof Array)) {
                    while (this._events[type].length) {
                        var data = this._events[type].shift();
                        data.dispatcher = null;
                        data.destruct();
                    }
                }
                else if (DEBUG) {
                    console.warn('trying to remove all events that does not exist "' + type + '"');
                }
            }
        };
        EventDispatcher.prototype.sort = function (e1, e2) {
            return e2.priority - e1.priority;
        };
        /**
         * Removes all event listeners en destructs the object
         */
        EventDispatcher.prototype.destruct = function () {
            this.removeAllEventListeners();
            this._target = null;
            this._events = null;
            _super.prototype.destruct.call(this);
        };
        return EventDispatcher;
    })(Destructible);
    var EventListenerData = (function () {
        function EventListenerData(dispatcher, type, listener, priority, once) {
            this.dispatcher = dispatcher;
            this.type = type;
            this.listener = listener;
            this.priority = priority;
            this.once = once;
        }
        EventListenerData.prototype.destruct = function () {
            if (this.dispatcher) {
                this.dispatcher.removeEventListener(this.type, this.listener);
            }
            this.dispatcher = null;
            this.type = null;
            this.listener = null;
            this.isDestructed = true;
        };
        return EventListenerData;
    })();
    return EventDispatcher;
});
