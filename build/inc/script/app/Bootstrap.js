
/*!
 * jQuery JavaScript Library v1.8.3
 * http://jquery.com/
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Copyright 2012 jQuery Foundation and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: Tue Nov 13 2012 08:20:33 GMT-0500 (Eastern Standard Time)
 */
(function( window, undefined ){
	var // A central reference to the root jQuery(document)
		rootjQuery,

	// The deferred used on DOM ready
		readyList,

	// Use the correct document accordingly with window argument (sandbox)
		document = window.document, location = window.location, navigator = window.navigator,

	// Map over jQuery in case of overwrite
		_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
		_$ = window.$,

	// Save a reference to some core methods
		core_push = Array.prototype.push, core_slice = Array.prototype.slice, core_indexOf = Array.prototype.indexOf, core_toString = Object.prototype.toString, core_hasOwn = Object.prototype.hasOwnProperty, core_trim = String.prototype.trim,

	// Define a local copy of jQuery
		jQuery = function( selector, context ){
			// The jQuery object is actually just the init constructor 'enhanced'
			return new jQuery.fn.init(selector, context, rootjQuery);
		},

	// Used for matching numbers
		core_pnum = /[\-+]?(?:\d*\.|)\d+(?:[eE][\-+]?\d+|)/.source,

	// Used for detecting and trimming whitespace
		core_rnotwhite = /\S/, core_rspace = /\s+/,

	// Make sure we trim BOM and NBSP (here's looking at you, Safari 5.0 and IE)
		rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
		rquickExpr = /^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/,

	// Match a standalone tag
		rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,

	// JSON RegExp
		rvalidchars = /^[\],:{}\s]*$/, rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g, rvalidescape = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g, rvalidtokens = /"[^"\\\r\n]*"|true|false|null|-?(?:\d\d*\.|)\d+(?:[eE][\-+]?\d+|)/g,

	// Matches dashed string for camelizing
		rmsPrefix = /^-ms-/, rdashAlpha = /-([\da-z])/gi,

	// Used by jQuery.camelCase as callback to replace()
		fcamelCase = function( all, letter ){
			return (letter + "").toUpperCase();
		},

	// The ready event handler and self cleanup method
		DOMContentLoaded = function(){
			if( document.addEventListener ){
				document.removeEventListener("DOMContentLoaded", DOMContentLoaded, false);
				jQuery.ready();
			} else if( document.readyState === "complete" ){
				// we're here because readyState === "complete" in oldIE
				// which is good enough for us to call the dom ready!
				document.detachEvent("onreadystatechange", DOMContentLoaded);
				jQuery.ready();
			}
		},

	// [[Class]] -> type pairs
		class2type = {};

	jQuery.fn = jQuery.prototype = {
		constructor: jQuery,
		init: function( selector, context, rootjQuery ){
			var match, elem, ret, doc;

			// Handle $(""), $(null), $(undefined), $(false)
			if( !selector ){
				return this;
			}

			// Handle $(DOMElement)
			if( selector.nodeType ){
				this.context = this[0] = selector;
				this.length = 1;
				return this;
			}

			// Handle HTML strings
			if( typeof selector === "string" ){
				if( selector.charAt(0) === "<" && selector.charAt(selector.length - 1) === ">" && selector.length >= 3 ){
					// Assume that strings that start and end with <> are HTML and skip the regex check
					match = [null, selector, null];

				} else{
					match = rquickExpr.exec(selector);
				}

				// Match html or make sure no context is specified for #id
				if( match && (match[1] || !context) ){

					// HANDLE: $(html) -> $(array)
					if( match[1] ){
						context = context instanceof jQuery ? context[0] : context;
						doc = (context && context.nodeType ? context.ownerDocument || context : document);

						// scripts is true for back-compat
						selector = jQuery.parseHTML(match[1], doc, true);
						if( rsingleTag.test(match[1]) && jQuery.isPlainObject(context) ){
							this.attr.call(selector, context, true);
						}

						return jQuery.merge(this, selector);

						// HANDLE: $(#id)
					} else{
						elem = document.getElementById(match[2]);

						// Check parentNode to catch when Blackberry 4.6 returns
						// nodes that are no longer in the document #6963
						if( elem && elem.parentNode ){
							// Handle the case where IE and Opera return items
							// by name instead of ID
							if( elem.id !== match[2] ){
								return rootjQuery.find(selector);
							}

							// Otherwise, we inject the element directly into the jQuery object
							this.length = 1;
							this[0] = elem;
						}

						this.context = document;
						this.selector = selector;
						return this;
					}

					// HANDLE: $(expr, $(...))
				} else if( !context || context.jquery ){
					return (context || rootjQuery).find(selector);

					// HANDLE: $(expr, context)
					// (which is just equivalent to: $(context).find(expr)
				} else{
					return this.constructor(context).find(selector);
				}

				// HANDLE: $(function)
				// Shortcut for document ready
			} else if( jQuery.isFunction(selector) ){
				return rootjQuery.ready(selector);
			}

			if( selector.selector !== undefined ){
				this.selector = selector.selector;
				this.context = selector.context;
			}

			return jQuery.makeArray(selector, this);
		},

		// Start with an empty selector
		selector: "",

		// The current version of jQuery being used
		jquery: "1.8.3",

		// The default length of a jQuery object is 0
		length: 0,

		// The number of elements contained in the matched element set
		size: function(){
			return this.length;
		},

		toArray: function(){
			return core_slice.call(this);
		},

		// Get the Nth element in the matched element set OR
		// Get the whole matched element set as a clean array
		get: function( num ){
			return num == null ?

				// Return a 'clean' array
				this.toArray() :

				// Return just the object
				(num < 0 ? this[this.length + num] : this[num]);
		},

		// Take an array of elements and push it onto the stack
		// (returning the new matched element set)
		pushStack: function( elems, name, selector ){

			// Build a new jQuery matched element set
			var ret = jQuery.merge(this.constructor(), elems);

			// Add the old object onto the stack (as a reference)
			ret.prevObject = this;

			ret.context = this.context;

			if( name === "find" ){
				ret.selector = this.selector + (this.selector ? " " : "") + selector;
			} else if( name ){
				ret.selector = this.selector + "." + name + "(" + selector + ")";
			}

			// Return the newly-formed element set
			return ret;
		},

		// Execute a callback for every element in the matched set.
		// (You can seed the arguments with an array of args, but this is
		// only used internally.)
		each: function( callback, args ){
			return jQuery.each(this, callback, args);
		},

		ready: function( fn ){
			// Add the callback
			jQuery.ready.promise().done(fn);

			return this;
		},

		eq: function( i ){
			i = +i;
			return i === -1 ? this.slice(i) : this.slice(i, i + 1);
		},

		first: function(){
			return this.eq(0);
		},

		last: function(){
			return this.eq(-1);
		},

		slice: function(){
			return this.pushStack(core_slice.apply(this, arguments), "slice", core_slice.call(arguments).join(","));
		},

		map: function( callback ){
			return this.pushStack(jQuery.map(this, function( elem, i ){
				return callback.call(elem, i, elem);
			}));
		},

		end: function(){
			return this.prevObject || this.constructor(null);
		},

		// For internal use only.
		// Behaves like an Array's method, not like a jQuery method.
		push: core_push,
		sort: [].sort,
		splice: [].splice
	};

	// Give the init function the jQuery prototype for later instantiation
	jQuery.fn.init.prototype = jQuery.fn;

	jQuery.extend = jQuery.fn.extend = function(){
		var options, name, src, copy, copyIsArray, clone, target = arguments[0] || {}, i = 1, length = arguments.length, deep = false;

		// Handle a deep copy situation
		if( typeof target === "boolean" ){
			deep = target;
			target = arguments[1] || {};
			// skip the boolean and the target
			i = 2;
		}

		// Handle case when target is a string or something (possible in deep copy)
		if( typeof target !== "object" && !jQuery.isFunction(target) ){
			target = {};
		}

		// extend jQuery itself if only one argument is passed
		if( length === i ){
			target = this;
			--i;
		}

		for( ; i < length; i++ ){
			// Only deal with non-null/undefined values
			if( (options = arguments[i]) != null ){
				// Extend the base object
				for( name in options ){
					src = target[name];
					copy = options[name];

					// Prevent never-ending loop
					if( target === copy ){
						continue;
					}

					// Recurse if we're merging plain objects or arrays
					if( deep && copy && (jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy))) ){
						if( copyIsArray ){
							copyIsArray = false;
							clone = src && jQuery.isArray(src) ? src : [];

						} else{
							clone = src && jQuery.isPlainObject(src) ? src : {};
						}

						// Never move original objects, clone them
						target[name] = jQuery.extend(deep, clone, copy);

						// Don't bring in undefined values
					} else if( copy !== undefined ){
						target[name] = copy;
					}
				}
			}
		}

		// Return the modified object
		return target;
	};

	jQuery.extend({
		noConflict: function( deep ){
			if( window.$ === jQuery ){
				window.$ = _$;
			}

			if( deep && window.jQuery === jQuery ){
				window.jQuery = _jQuery;
			}

			return jQuery;
		},

		// Is the DOM ready to be used? Set to true once it occurs.
		isReady: false,

		// A counter to track how many items to wait for before
		// the ready event fires. See #6781
		readyWait: 1,

		// Hold (or release) the ready event
		holdReady: function( hold ){
			if( hold ){
				jQuery.readyWait++;
			} else{
				jQuery.ready(true);
			}
		},

		// Handle when the DOM is ready
		ready: function( wait ){

			// Abort if there are pending holds or we're already ready
			if( wait === true ? --jQuery.readyWait : jQuery.isReady ){
				return;
			}

			// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
			if( !document.body ){
				return setTimeout(jQuery.ready, 1);
			}

			// Remember that the DOM is ready
			jQuery.isReady = true;

			// If a normal DOM Ready event fired, decrement, and wait if need be
			if( wait !== true && --jQuery.readyWait > 0 ){
				return;
			}

			// If there are functions bound, to execute
			readyList.resolveWith(document, [jQuery]);

			// Trigger any bound ready events
			if( jQuery.fn.trigger ){
				jQuery(document).trigger("ready").off("ready");
			}
		},

		// See test/unit/core.js for details concerning isFunction.
		// Since version 1.3, DOM methods and functions like alert
		// aren't supported. They return false on IE (#2968).
		isFunction: function( obj ){
			return jQuery.type(obj) === "function";
		},

		isArray: Array.isArray || function( obj ){
			return jQuery.type(obj) === "array";
		},

		isWindow: function( obj ){
			return obj != null && obj == obj.window;
		},

		isNumeric: function( obj ){
			return !isNaN(parseFloat(obj)) && isFinite(obj);
		},

		type: function( obj ){
			return obj == null ? String(obj) : class2type[core_toString.call(obj)] || "object";
		},

		isPlainObject: function( obj ){
			// Must be an Object.
			// Because of IE, we also have to check the presence of the constructor property.
			// Make sure that DOM nodes and window objects don't pass through, as well
			if( !obj || jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow(obj) ){
				return false;
			}

			try {
				// Not own constructor property must be Object
				if( obj.constructor && !core_hasOwn.call(obj, "constructor") && !core_hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ){
					return false;
				}
			} catch( e ) {
				// IE8,9 Will throw exceptions on certain host objects #9897
				return false;
			}

			// Own properties are enumerated firstly, so to speed up,
			// if last one is own, then all properties are own.

			var key;
			for( key in obj ){
			}

			return key === undefined || core_hasOwn.call(obj, key);
		},

		isEmptyObject: function( obj ){
			var name;
			for( name in obj ){
				return false;
			}
			return true;
		},

		error: function( msg ){
			throw new Error(msg);
		},

		// data: string of html
		// context (optional): If specified, the fragment will be created in this context, defaults to document
		// scripts (optional): If true, will include scripts passed in the html string
		parseHTML: function( data, context, scripts ){
			var parsed;
			if( !data || typeof data !== "string" ){
				return null;
			}
			if( typeof context === "boolean" ){
				scripts = context;
				context = 0;
			}
			context = context || document;

			// Single tag
			if( (parsed = rsingleTag.exec(data)) ){
				return [context.createElement(parsed[1])];
			}

			parsed = jQuery.buildFragment([data], context, scripts ? null : []);
			return jQuery.merge([], (parsed.cacheable ? jQuery.clone(parsed.fragment) : parsed.fragment).childNodes);
		},

		parseJSON: function( data ){
			if( !data || typeof data !== "string" ){
				return null;
			}

			// Make sure leading/trailing whitespace is removed (IE can't handle it)
			data = jQuery.trim(data);

			// Attempt to parse using the native JSON parser first
			if( window.JSON && window.JSON.parse ){
				return window.JSON.parse(data);
			}

			// Make sure the incoming data is actual JSON
			// Logic borrowed from http://json.org/json2.js
			if( rvalidchars.test(data.replace(rvalidescape, "@").replace(rvalidtokens, "]").replace(rvalidbraces, "")) ){

				return (new Function("return " + data))();

			}
			jQuery.error("Invalid JSON: " + data);
		},

		// Cross-browser xml parsing
		parseXML: function( data ){
			var xml, tmp;
			if( !data || typeof data !== "string" ){
				return null;
			}
			try {
				if( window.DOMParser ){ // Standard
					tmp = new DOMParser();
					xml = tmp.parseFromString(data, "text/xml");
				} else{ // IE
					xml = new ActiveXObject("Microsoft.XMLDOM");
					xml.async = "false";
					xml.loadXML(data);
				}
			} catch( e ) {
				xml = undefined;
			}
			if( !xml || !xml.documentElement || xml.getElementsByTagName("parsererror").length ){
				jQuery.error("Invalid XML: " + data);
			}
			return xml;
		},

		noop: function(){
		},

		// Evaluates a script in a global context
		// Workarounds based on findings by Jim Driscoll
		// http://weblogs.java.Net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
		globalEval: function( data ){
			if( data && core_rnotwhite.test(data) ){
				// We use execScript on Internet Explorer
				// We use an anonymous function so that context is window
				// rather than jQuery in Firefox
				(window.execScript || function( data ){
					window["eval"].call(window, data);
				})(data);
			}
		},

		// Convert dashed to camelCase; used by the css and data modules
		// Microsoft forgot to hump their vendor prefix (#9572)
		camelCase: function( string ){
			return string.replace(rmsPrefix, "ms-").replace(rdashAlpha, fcamelCase);
		},

		nodeName: function( elem, name ){
			return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
		},

		// args is for internal usage only
		each: function( obj, callback, args ){
			var name, i = 0, length = obj.length, isObj = length === undefined || jQuery.isFunction(obj);

			if( args ){
				if( isObj ){
					for( name in obj ){
						if( callback.apply(obj[name], args) === false ){
							break;
						}
					}
				} else{
					for( ; i < length; ){
						if( callback.apply(obj[i++], args) === false ){
							break;
						}
					}
				}

				// A special, fast, case for the most common use of each
			} else{
				if( isObj ){
					for( name in obj ){
						if( callback.call(obj[name], name, obj[name]) === false ){
							break;
						}
					}
				} else{
					for( ; i < length; ){
						if( callback.call(obj[i], i, obj[i++]) === false ){
							break;
						}
					}
				}
			}

			return obj;
		},

		// Use native String.trim function wherever possible
		trim: core_trim && !core_trim.call("\uFEFF\xA0") ? function( text ){
			return text == null ? "" : core_trim.call(text);
		} :

			// Otherwise use our own trimming functionality
			function( text ){
				return text == null ? "" : (text + "").replace(rtrim, "");
			},

		// results is for internal usage only
		makeArray: function( arr, results ){
			var type, ret = results || [];

			if( arr != null ){
				// The window, strings (and functions) also have 'length'
				// Tweaked logic slightly to handle Blackberry 4.7 RegExp issues #6930
				type = jQuery.type(arr);

				if( arr.length == null || type === "string" || type === "function" || type === "regexp" || jQuery.isWindow(arr) ){
					core_push.call(ret, arr);
				} else{
					jQuery.merge(ret, arr);
				}
			}

			return ret;
		},

		inArray: function( elem, arr, i ){
			var len;

			if( arr ){
				if( core_indexOf ){
					return core_indexOf.call(arr, elem, i);
				}

				len = arr.length;
				i = i ? i < 0 ? Math.max(0, len + i) : i : 0;

				for( ; i < len; i++ ){
					// Skip accessing in sparse arrays
					if( i in arr && arr[i] === elem ){
						return i;
					}
				}
			}

			return -1;
		},

		merge: function( first, second ){
			var l = second.length, i = first.length, j = 0;

			if( typeof l === "number" ){
				for( ; j < l; j++ ){
					first[i++] = second[j];
				}

			} else{
				while( second[j] !== undefined ){
					first[i++] = second[j++];
				}
			}

			first.length = i;

			return first;
		},

		grep: function( elems, callback, inv ){
			var retVal, ret = [], i = 0, length = elems.length;
			inv = !!inv;

			// Go through the array, only saving the items
			// that pass the validator function
			for( ; i < length; i++ ){
				retVal = !!callback(elems[i], i);
				if( inv !== retVal ){
					ret.push(elems[i]);
				}
			}

			return ret;
		},

		// arg is for internal usage only
		map: function( elems, callback, arg ){
			var value, key, ret = [], i = 0, length = elems.length, // jquery objects are treated as arrays
				isArray = elems instanceof jQuery || length !== undefined && typeof length === "number" && ((length > 0 && elems[0] && elems[length - 1]) || length === 0 || jQuery.isArray(elems));

			// Go through the array, translating each of the items to their
			if( isArray ){
				for( ; i < length; i++ ){
					value = callback(elems[i], i, arg);

					if( value != null ){
						ret[ret.length] = value;
					}
				}

				// Go through every key on the object,
			} else{
				for( key in elems ){
					value = callback(elems[key], key, arg);

					if( value != null ){
						ret[ret.length] = value;
					}
				}
			}

			// Flatten any nested arrays
			return ret.concat.apply([], ret);
		},

		// A global GUID counter for objects
		guid: 1,

		// Bind a function to a context, optionally partially applying any
		// arguments.
		proxy: function( fn, context ){
			var tmp, args, proxy;

			if( typeof context === "string" ){
				tmp = fn[context];
				context = fn;
				fn = tmp;
			}

			// Quick check to determine if target is callable, in the spec
			// this throws a TypeError, but we will just return undefined.
			if( !jQuery.isFunction(fn) ){
				return undefined;
			}

			// Simulated bind
			args = core_slice.call(arguments, 2);
			proxy = function(){
				return fn.apply(context, args.concat(core_slice.call(arguments)));
			};

			// Set the guid of unique handler to the same of original handler, so it can be removed
			proxy.guid = fn.guid = fn.guid || jQuery.guid++;

			return proxy;
		},

		// Multifunctional method to get and set values of a collection
		// The value/s can optionally be executed if it's a function
		access: function( elems, fn, key, value, chainable, emptyGet, pass ){
			var exec, bulk = key == null, i = 0, length = elems.length;

			// Sets many values
			if( key && typeof key === "object" ){
				for( i in key ){
					jQuery.access(elems, fn, i, key[i], 1, emptyGet, value);
				}
				chainable = 1;

				// Sets one value
			} else if( value !== undefined ){
				// Optionally, function values get executed if exec is true
				exec = pass === undefined && jQuery.isFunction(value);

				if( bulk ){
					// Bulk operations only iterate when executing function values
					if( exec ){
						exec = fn;
						fn = function( elem, key, value ){
							return exec.call(jQuery(elem), value);
						};

						// Otherwise they run against the entire set
					} else{
						fn.call(elems, value);
						fn = null;
					}
				}

				if( fn ){
					for( ; i < length; i++ ){
						fn(elems[i], key, exec ? value.call(elems[i], i, fn(elems[i], key)) : value, pass);
					}
				}

				chainable = 1;
			}

			return chainable ? elems :

				// Gets
				bulk ? fn.call(elems) : length ? fn(elems[0], key) : emptyGet;
		},

		now: function(){
			return (new Date()).getTime();
		}
	});

	jQuery.ready.promise = function( obj ){
		if( !readyList ){

			readyList = jQuery.Deferred();

			// Catch cases where $(document).ready() is called after the browser event has already occurred.
			// we once tried to use readyState "interactive" here, but it caused issues like the one
			// discovered by ChrisS here: http://bugs.jquery.com/ticket/12282#comment:15
			if( document.readyState === "complete" ){
				// Handle it asynchronously to allow scripts the opportunity to delay ready
				setTimeout(jQuery.ready, 1);

				// Standards-based browsers support DOMContentLoaded
			} else if( document.addEventListener ){
				// Use the handy event callback
				document.addEventListener("DOMContentLoaded", DOMContentLoaded, false);

				// A fallback to window.onload, that will always work
				window.addEventListener("load", jQuery.ready, false);

				// If IE event model is used
			} else{
				// Ensure firing before onload, maybe late but safe also for iframes
				document.attachEvent("onreadystatechange", DOMContentLoaded);

				// A fallback to window.onload, that will always work
				window.attachEvent("onload", jQuery.ready);

				// If IE and not a frame
				// continually check to see if the document is ready
				var top = false;

				try {
					top = window.frameElement == null && document.documentElement;
				} catch( e ) {
				}

				if( top && top.doScroll ){
					(function doScrollCheck(){
						if( !jQuery.isReady ){

							try {
								// Use the trick by Diego Perini
								// http://javascript.nwbox.com/IEContentLoaded/
								top.doScroll("left");
							} catch( e ) {
								return setTimeout(doScrollCheck, 50);
							}

							// and execute any waiting functions
							jQuery.ready();
						}
					})();
				}
			}
		}
		return readyList.promise(obj);
	};

	// Populate the class2type map
	jQuery.each("boolean Number String Function Array Date RegExp Object".split(" "), function( i, name ){
		class2type["[object " + name + "]"] = name.toLowerCase();
	});

	// All jQuery objects should point back to these
	rootjQuery = jQuery(document);
	// String to Object options format cache
	var optionsCache = {};

	// Convert String-formatted options into Object-formatted ones and store in cache
	function createOptions( options ){
		var object = optionsCache[options] = {};
		jQuery.each(options.split(core_rspace), function( _, flag ){
			object[flag] = true;
		});
		return object;
	}

	/*
	 * Create a callback list using the following parameters:
	 *
	 *	options: an optional list of space-separated options that will change how
	 *			the callback list behaves or a more traditional option object
	 *
	 * By default a callback list will act like an event callback list and can be
	 * "fired" multiple times.
	 *
	 * Possible options:
	 *
	 *	once:			will ensure the callback list can only be fired once (like a Deferred)
	 *
	 *	memory:			will keep track of previous values and will call any callback added
	 *					after the list has been fired right away with the latest "memorized"
	 *					values (like a Deferred)
	 *
	 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
	 *
	 *	stopOnFalse:	interrupt callings when a callback returns false
	 *
	 */
	jQuery.Callbacks = function( options ){

		// Convert options from String-formatted to Object-formatted if needed
		// (we check in cache first)
		options = typeof options === "string" ? (optionsCache[options] || createOptions(options)) : jQuery.extend({}, options);

		var // Last fire value (for non-forgettable lists)
			memory, // Flag to know if list was already fired
			fired, // Flag to know if list is currently firing
			firing, // First callback to fire (used internally by add and fireWith)
			firingStart, // End of the loop when firing
			firingLength, // Index of currently firing callback (modified by remove if needed)
			firingIndex, // Actual callback list
			list = [], // Stack of fire calls for repeatable lists
			stack = !options.once && [], // Fire callbacks
			fire = function( data ){
				memory = options.memory && data;
				fired = true;
				firingIndex = firingStart || 0;
				firingStart = 0;
				firingLength = list.length;
				firing = true;
				for( ; list && firingIndex < firingLength; firingIndex++ ){
					if( list[firingIndex].apply(data[0], data[1]) === false && options.stopOnFalse ){
						memory = false; // To prevent further calls using add
						break;
					}
				}
				firing = false;
				if( list ){
					if( stack ){
						if( stack.length ){
							fire(stack.shift());
						}
					} else if( memory ){
						list = [];
					} else{
						self.disable();
					}
				}
			}, // Actual Callbacks object
			self = {
				// Add a callback or a collection of callbacks to the list
				add: function(){
					if( list ){
						// First, we save the current length
						var start = list.length;
						(function add( args ){
							jQuery.each(args, function( _, arg ){
								var type = jQuery.type(arg);
								if( type === "function" ){
									if( !options.unique || !self.has(arg) ){
										list.push(arg);
									}
								} else if( arg && arg.length && type !== "string" ){
									// Inspect recursively
									add(arg);
								}
							});
						})(arguments);
						// Do we need to add the callbacks to the
						// current firing batch?
						if( firing ){
							firingLength = list.length;
							// With memory, if we're not firing then
							// we should call right away
						} else if( memory ){
							firingStart = start;
							fire(memory);
						}
					}
					return this;
				},
				// Remove a callback from the list
				remove: function(){
					if( list ){
						jQuery.each(arguments, function( _, arg ){
							var index;
							while( (index = jQuery.inArray(arg, list, index)) > -1 ){
								list.splice(index, 1);
								// Handle firing indexes
								if( firing ){
									if( index <= firingLength ){
										firingLength--;
									}
									if( index <= firingIndex ){
										firingIndex--;
									}
								}
							}
						});
					}
					return this;
				},
				// Control if a given callback is in the list
				has: function( fn ){
					return jQuery.inArray(fn, list) > -1;
				},
				// Remove all callbacks from the list
				empty: function(){
					list = [];
					return this;
				},
				// Have the list do nothing anymore
				disable: function(){
					list = stack = memory = undefined;
					return this;
				},
				// Is it disabled?
				disabled: function(){
					return !list;
				},
				// Lock the list in its current state
				lock: function(){
					stack = undefined;
					if( !memory ){
						self.disable();
					}
					return this;
				},
				// Is it locked?
				locked: function(){
					return !stack;
				},
				// Call all callbacks with the given context and arguments
				fireWith: function( context, args ){
					args = args || [];
					args = [context, args.slice ? args.slice() : args];
					if( list && (!fired || stack) ){
						if( firing ){
							stack.push(args);
						} else{
							fire(args);
						}
					}
					return this;
				},
				// Call all the callbacks with the given arguments
				fire: function(){
					self.fireWith(this, arguments);
					return this;
				},
				// To know if the callbacks have already been called at least once
				fired: function(){
					return !!fired;
				}
			};

		return self;
	};
	jQuery.extend({

		Deferred: function( func ){
			var tuples = [
					// action, add listener, listener list, final state
					["resolve", "done", jQuery.Callbacks("once memory"), "resolved"],
					["reject", "fail", jQuery.Callbacks("once memory"), "rejected"],
					["notify", "progress", jQuery.Callbacks("memory")]
				], state = "pending", promise = {
					state: function(){
						return state;
					},
					always: function(){
						deferred.done(arguments).fail(arguments);
						return this;
					},
					then: function( /* fnDone, fnFail, fnProgress */ ){
						var fns = arguments;
						return jQuery.Deferred(function( newDefer ){
							jQuery.each(tuples, function( i, tuple ){
								var action = tuple[0], fn = fns[i];
								// deferred[ done | fail | progress ] for forwarding actions to newDefer
								deferred[tuple[1]](jQuery.isFunction(fn) ? function(){
									var returned = fn.apply(this, arguments);
									if( returned && jQuery.isFunction(returned.promise) ){
										returned.promise().done(newDefer.resolve).fail(newDefer.reject).progress(newDefer.notify);
									} else{
										newDefer[action + "With"](this === deferred ? newDefer : this, [returned]);
									}
								} : newDefer[action]);
							});
							fns = null;
						}).promise();
					},
					// Get a promise for this deferred
					// If obj is provided, the promise aspect is added to the object
					promise: function( obj ){
						return obj != null ? jQuery.extend(obj, promise) : promise;
					}
				}, deferred = {};

			// Keep pipe for back-compat
			promise.pipe = promise.then;

			// Add list-specific methods
			jQuery.each(tuples, function( i, tuple ){
				var list = tuple[2], stateString = tuple[3];

				// promise[ done | fail | progress ] = list.add
				promise[tuple[1]] = list.add;

				// Handle state
				if( stateString ){
					list.add(function(){
						// state = [ resolved | rejected ]
						state = stateString;

						// [ reject_list | resolve_list ].disable; progress_list.lock
					}, tuples[i ^ 1][2].disable, tuples[2][2].lock);
				}

				// deferred[ resolve | reject | notify ] = list.fire
				deferred[tuple[0]] = list.fire;
				deferred[tuple[0] + "With"] = list.fireWith;
			});

			// Make the deferred a promise
			promise.promise(deferred);

			// Call given func if any
			if( func ){
				func.call(deferred, deferred);
			}

			// All done!
			return deferred;
		},

		// Deferred helper
		when: function( subordinate /* , ..., subordinateN */ ){
			var i = 0, resolveValues = core_slice.call(arguments), length = resolveValues.length,

			// the count of uncompleted subordinates
				remaining = length !== 1 || (subordinate && jQuery.isFunction(subordinate.promise)) ? length : 0,

			// the master Deferred. If resolveValues consist of only a single Deferred, just use that.
				deferred = remaining === 1 ? subordinate : jQuery.Deferred(),

			// Update function for both resolve and progress values
				updateFunc = function( i, contexts, values ){
					return function( value ){
						contexts[i] = this;
						values[i] = arguments.length > 1 ? core_slice.call(arguments) : value;
						if( values === progressValues ){
							deferred.notifyWith(contexts, values);
						} else if( !(--remaining) ){
							deferred.resolveWith(contexts, values);
						}
					};
				},

				progressValues, progressContexts, resolveContexts;

			// add listeners to Deferred subordinates; treat others as resolved
			if( length > 1 ){
				progressValues = new Array(length);
				progressContexts = new Array(length);
				resolveContexts = new Array(length);
				for( ; i < length; i++ ){
					if( resolveValues[i] && jQuery.isFunction(resolveValues[i].promise) ){
						resolveValues[i].promise().done(updateFunc(i, resolveContexts, resolveValues)).fail(deferred.reject).progress(updateFunc(i, progressContexts, progressValues));
					} else{
						--remaining;
					}
				}
			}

			// if we're not waiting on anything, resolve the master
			if( !remaining ){
				deferred.resolveWith(resolveContexts, resolveValues);
			}

			return deferred.promise();
		}
	});
	jQuery.support = (function(){

		var support, all, a, select, opt, input, fragment, eventName, i, isSupported, clickFn, div = document.createElement("div");

		// Setup
		div.setAttribute("className", "t");
		div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";

		// Support tests won't run in some limited or non-browser environments
		all = div.getElementsByTagName("*");
		a = div.getElementsByTagName("a")[0];
		if( !all || !a || !all.length ){
			return {};
		}

		// First batch of tests
		select = document.createElement("select");
		opt = select.appendChild(document.createElement("option"));
		input = div.getElementsByTagName("input")[0];

		a.style.cssText = "top:1px;float:left;opacity:.5";
		support = {
			// IE strips leading whitespace when .innerHTML is used
			leadingWhitespace: (div.firstChild.nodeType === 3),

			// Make sure that tbody elements aren't automatically inserted
			// IE will insert them into empty tables
			tbody: !div.getElementsByTagName("tbody").length,

			// Make sure that link elements get serialized correctly by innerHTML
			// This requires a wrapper element in IE
			htmlSerialize: !!div.getElementsByTagName("link").length,

			// Get the style information from getAttribute
			// (IE uses .cssText instead)
			style: /top/.test(a.getAttribute("style")),

			// Make sure that URLs aren't manipulated
			// (IE normalizes it by default)
			hrefNormalized: (a.getAttribute("href") === "/a"),

			// Make sure that element opacity exists
			// (IE uses filter instead)
			// Use a regex to work around a WebKit issue. See #5145
			opacity: /^0.5/.test(a.style.opacity),

			// Verify style float existence
			// (IE uses styleFloat instead of cssFloat)
			cssFloat: !!a.style.cssFloat,

			// Make sure that if no value is specified for a checkbox
			// that it defaults to "on".
			// (WebKit defaults to "" instead)
			checkOn: (input.value === "on"),

			// Make sure that a selected-by-default option has a working selected property.
			// (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
			optSelected: opt.selected,

			// Test setAttribute on camelCase class. If it works, we need attrFixes when doing get/setAttribute (ie6/7)
			getSetAttribute: div.className !== "t",

			// Tests for enctype support on a form (#6743)
			enctype: !!document.createElement("form").enctype,

			// Makes sure cloning an html5 element does not cause problems
			// Where outerHTML is undefined, this still works
			html5Clone: document.createElement("nav").cloneNode(true).outerHTML !== "<:nav></:nav>",

			// jQuery.support.boxModel DEPRECATED in 1.8 since we don't support Quirks Mode
			boxModel: (document.compatMode === "CSS1Compat"),

			// Will be defined later
			submitBubbles: true,
			changeBubbles: true,
			focusinBubbles: false,
			deleteExpando: true,
			noCloneEvent: true,
			inlineBlockNeedsLayout: false,
			shrinkWrapBlocks: false,
			reliableMarginRight: true,
			boxSizingReliable: true,
			pixelPosition: false
		};

		// Make sure checked status is properly cloned
		input.checked = true;
		support.noCloneChecked = input.cloneNode(true).checked;

		// Make sure that the options inside disabled selects aren't marked as disabled
		// (WebKit marks them as disabled)
		select.disabled = true;
		support.optDisabled = !opt.disabled;

		// Test to see if it's possible to delete an expando from an element
		// Fails in Internet Explorer
		try {
			delete div.test;
		} catch( e ) {
			support.deleteExpando = false;
		}

		if( !div.addEventListener && div.attachEvent && div.fireEvent ){
			div.attachEvent("onclick", clickFn = function(){
				// Cloning a node shouldn't copy over any
				// bound event handlers (IE does this)
				support.noCloneEvent = false;
			});
			div.cloneNode(true).fireEvent("onclick");
			div.detachEvent("onclick", clickFn);
		}

		// Check if a radio maintains its value
		// after being appended to the DOM
		input = document.createElement("input");
		input.value = "t";
		input.setAttribute("type", "radio");
		support.radioValue = input.value === "t";

		input.setAttribute("checked", "checked");

		// #11217 - WebKit loses check when the name is after the checked attribute
		input.setAttribute("name", "t");

		div.appendChild(input);
		fragment = document.createDocumentFragment();
		fragment.appendChild(div.lastChild);

		// WebKit doesn't clone checked state correctly in fragments
		support.checkClone = fragment.cloneNode(true).cloneNode(true).lastChild.checked;

		// Check if a disconnected checkbox will retain its checked
		// value of true after appended to the DOM (IE6/7)
		support.appendChecked = input.checked;

		fragment.removeChild(input);
		fragment.appendChild(div);

		// Technique from Juriy Zaytsev
		// http://perfectionkills.com/detecting-event-support-without-browser-sniffing/
		// We only care about the case where non-standard event systems
		// are used, namely in IE. Short-circuiting here helps us to
		// avoid an eval call (in setAttribute) which can cause CSP
		// to go haywire. See: https://developer.mozilla.org/en/Security/CSP
		if( div.attachEvent ){
			for( i in {
				submit: true,
				change: true,
				focusin: true
			} ){
				eventName = "on" + i;
				isSupported = (eventName in div);
				if( !isSupported ){
					div.setAttribute(eventName, "return;");
					isSupported = (typeof div[eventName] === "function");
				}
				support[i + "Bubbles"] = isSupported;
			}
		}

		// Run tests that need a body at doc ready
		jQuery(function(){
			var container, div, tds, marginDiv, divReset = "padding:0;margin:0;border:0;display:block;overflow:hidden;", body = document.getElementsByTagName("body")[0];

			if( !body ){
				// Return for frameset docs that don't have a body
				return;
			}

			container = document.createElement("div");
			container.style.cssText = "visibility:hidden;border:0;width:0;height:0;position:static;top:0;margin-top:1px";
			body.insertBefore(container, body.firstChild);

			// Construct the test element
			div = document.createElement("div");
			container.appendChild(div);

			// Check if table cells still have offsetWidth/Height when they are set
			// to display:none and there are still other visible table cells in a
			// table row; if so, offsetWidth/Height are not reliable for use when
			// determining if an element has been hidden directly using
			// display:none (it is still safe to use offsets if a parent element is
			// hidden; don safety goggles and see bug #4512 for more information).
			// (only IE 8 fails this test)
			div.innerHTML = "<table><tr><td></td><td>t</td></tr></table>";
			tds = div.getElementsByTagName("td");
			tds[0].style.cssText = "padding:0;margin:0;border:0;display:none";
			isSupported = (tds[0].offsetHeight === 0);

			tds[0].style.display = "";
			tds[1].style.display = "none";

			// Check if empty table cells still have offsetWidth/Height
			// (IE <= 8 fail this test)
			support.reliableHiddenOffsets = isSupported && (tds[0].offsetHeight === 0);

			// Check box-sizing and margin behavior
			div.innerHTML = "";
			div.style.cssText = "box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;";
			support.boxSizing = (div.offsetWidth === 4);
			support.doesNotIncludeMarginInBodyOffset = (body.offsetTop !== 1);

			// NOTE: To any future maintainer, we've window.getComputedStyle
			// because jsdom on node.js will break without it.
			if( window.getComputedStyle ){
				support.pixelPosition = (window.getComputedStyle(div, null) || {}).top !== "1%";
				support.boxSizingReliable = (window.getComputedStyle(div, null) || { width: "4px" }).width === "4px";

				// Check if div with explicit width and no margin-right incorrectly
				// gets computed margin-right based on width of container. For more
				// info see bug #3333
				// Fails in WebKit before Feb 2011 nightlies
				// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
				marginDiv = document.createElement("div");
				marginDiv.style.cssText = div.style.cssText = divReset;
				marginDiv.style.marginRight = marginDiv.style.width = "0";
				div.style.width = "1px";
				div.appendChild(marginDiv);
				support.reliableMarginRight = !parseFloat((window.getComputedStyle(marginDiv, null) || {}).marginRight);
			}

			if( typeof div.style.zoom !== "undefined" ){
				// Check if natively block-level elements act like inline-block
				// elements when setting their display to 'inline' and giving
				// them layout
				// (IE < 8 does this)
				div.innerHTML = "";
				div.style.cssText = divReset + "width:1px;padding:1px;display:inline;zoom:1";
				support.inlineBlockNeedsLayout = (div.offsetWidth === 3);

				// Check if elements with layout shrink-wrap their children
				// (IE 6 does this)
				div.style.display = "block";
				div.style.overflow = "visible";
				div.innerHTML = "<div></div>";
				div.firstChild.style.width = "5px";
				support.shrinkWrapBlocks = (div.offsetWidth !== 3);

				container.style.zoom = 1;
			}

			// Null elements to avoid leaks in IE
			body.removeChild(container);
			container = div = tds = marginDiv = null;
		});

		// Null elements to avoid leaks in IE
		fragment.removeChild(div);
		all = a = select = opt = input = fragment = div = null;

		return support;
	})();
	var rbrace = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/, rmultiDash = /([A-Z])/g;

	jQuery.extend({
		cache: {},

		deletedIds: [],

		// Remove at next major release (1.9/2.0)
		uuid: 0,

		// Unique for each copy of jQuery on the page
		// Non-digits removed to match rinlinejQuery
		expando: "jQuery" + (jQuery.fn.jquery + Math.random()).replace(/\D/g, ""),

		// The following elements throw uncatchable exceptions if you
		// attempt to add expando properties to them.
		noData: {
			"embed": true,
			// Ban all objects except for Flash (which handle expandos)
			"object": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",
			"applet": true
		},

		hasData: function( elem ){
			elem = elem.nodeType ? jQuery.cache[elem[jQuery.expando]] : elem[jQuery.expando];
			return !!elem && !isEmptyDataObject(elem);
		},

		data: function( elem, name, data, pvt /* Internal Use Only */ ){
			if( !jQuery.acceptData(elem) ){
				return;
			}

			var thisCache, ret, internalKey = jQuery.expando, getByName = typeof name === "string",

			// We have to handle DOM nodes and JS objects differently because IE6-7
			// can't GC object references properly across the DOM-JS boundary
				isNode = elem.nodeType,

			// Only DOM nodes need the global jQuery cache; JS object data is
			// attached directly to the object so GC can occur automatically
				cache = isNode ? jQuery.cache : elem,

			// Only defining an ID for JS objects if its cache already exists allows
			// the code to shortcut on the same path as a DOM node with no cache
				id = isNode ? elem[internalKey] : elem[internalKey] && internalKey;

			// Avoid doing any more work than we need to when trying to get data on an
			// object that has no data at all
			if( (!id || !cache[id] || (!pvt && !cache[id].data)) && getByName && data === undefined ){
				return;
			}

			if( !id ){
				// Only DOM nodes need a new unique ID for each element since their data
				// ends up in the global cache
				if( isNode ){
					elem[internalKey] = id = jQuery.deletedIds.pop() || jQuery.guid++;
				} else{
					id = internalKey;
				}
			}

			if( !cache[id] ){
				cache[id] = {};

				// Avoids exposing jQuery metadata on plain JS objects when the object
				// is serialized using JSON.stringify
				if( !isNode ){
					cache[id].toJSON = jQuery.noop;
				}
			}

			// An object can be passed to jQuery.data instead of a key/value pair; this gets
			// shallow copied over onto the existing cache
			if( typeof name === "object" || typeof name === "function" ){
				if( pvt ){
					cache[id] = jQuery.extend(cache[id], name);
				} else{
					cache[id].data = jQuery.extend(cache[id].data, name);
				}
			}

			thisCache = cache[id];

			// jQuery data() is stored in a separate object inside the object's internal data
			// cache in order to avoid key collisions between internal data and user-defined
			// data.
			if( !pvt ){
				if( !thisCache.data ){
					thisCache.data = {};
				}

				thisCache = thisCache.data;
			}

			if( data !== undefined ){
				thisCache[jQuery.camelCase(name)] = data;
			}

			// Check for both converted-to-camel and non-converted data property names
			// If a data property was specified
			if( getByName ){

				// First Try to find as-is property data
				ret = thisCache[name];

				// Test for null|undefined property data
				if( ret == null ){

					// Try to find the camelCased property
					ret = thisCache[jQuery.camelCase(name)];
				}
			} else{
				ret = thisCache;
			}

			return ret;
		},

		removeData: function( elem, name, pvt /* Internal Use Only */ ){
			if( !jQuery.acceptData(elem) ){
				return;
			}

			var thisCache, i, l,

				isNode = elem.nodeType,

			// See jQuery.data for more information
				cache = isNode ? jQuery.cache : elem, id = isNode ? elem[jQuery.expando] : jQuery.expando;

			// If there is already no cache entry for this object, there is no
			// purpose in continuing
			if( !cache[id] ){
				return;
			}

			if( name ){

				thisCache = pvt ? cache[id] : cache[id].data;

				if( thisCache ){

					// Support array or space separated string names for data keys
					if( !jQuery.isArray(name) ){

						// try the string as a key before any manipulation
						if( name in thisCache ){
							name = [name];
						} else{

							// split the camel cased version by spaces unless a key with the spaces exists
							name = jQuery.camelCase(name);
							if( name in thisCache ){
								name = [name];
							} else{
								name = name.split(" ");
							}
						}
					}

					for( i = 0, l = name.length; i < l; i++ ){
						delete thisCache[name[i]];
					}

					// If there is no data left in the cache, we want to continue
					// and let the cache object itself get destroyed
					if( !(pvt ? isEmptyDataObject : jQuery.isEmptyObject)(thisCache) ){
						return;
					}
				}
			}

			// See jQuery.data for more information
			if( !pvt ){
				delete cache[id].data;

				// Don't destroy the parent cache unless the internal data object
				// had been the only thing left in it
				if( !isEmptyDataObject(cache[id]) ){
					return;
				}
			}

			// Destroy the cache
			if( isNode ){
				jQuery.cleanData([elem], true);

				// Use delete when supported for expandos or `cache` is not a window per isWindow (#10080)
			} else if( jQuery.support.deleteExpando || cache != cache.window ){
				delete cache[id];

				// When all else fails, null
			} else{
				cache[id] = null;
			}
		},

		// For internal use only.
		_data: function( elem, name, data ){
			return jQuery.data(elem, name, data, true);
		},

		// A method for determining if a DOM node can handle the data expando
		acceptData: function( elem ){
			var noData = elem.nodeName && jQuery.noData[elem.nodeName.toLowerCase()];

			// nodes accept data unless otherwise specified; rejection can be conditional
			return !noData || noData !== true && elem.getAttribute("classid") === noData;
		}
	});

	jQuery.fn.extend({
		data: function( key, value ){
			var parts, part, attr, name, l, elem = this[0], i = 0, data = null;

			// Gets all values
			if( key === undefined ){
				if( this.length ){
					data = jQuery.data(elem);

					if( elem.nodeType === 1 && !jQuery._data(elem, "parsedAttrs") ){
						attr = elem.attributes;
						for( l = attr.length; i < l; i++ ){
							name = attr[i].name;

							if( !name.indexOf("data-") ){
								name = jQuery.camelCase(name.substring(5));

								dataAttr(elem, name, data[name]);
							}
						}
						jQuery._data(elem, "parsedAttrs", true);
					}
				}

				return data;
			}

			// Sets multiple values
			if( typeof key === "object" ){
				return this.each(function(){
					jQuery.data(this, key);
				});
			}

			parts = key.split(".", 2);
			parts[1] = parts[1] ? "." + parts[1] : "";
			part = parts[1] + "!";

			return jQuery.access(this, function( value ){

				if( value === undefined ){
					data = this.triggerHandler("getData" + part, [parts[0]]);

					// Try to fetch any internally stored data first
					if( data === undefined && elem ){
						data = jQuery.data(elem, key);
						data = dataAttr(elem, key, data);
					}

					return data === undefined && parts[1] ? this.data(parts[0]) : data;
				}

				parts[1] = value;
				this.each(function(){
					var self = jQuery(this);

					self.triggerHandler("setData" + part, parts);
					jQuery.data(this, key, value);
					self.triggerHandler("changeData" + part, parts);
				});
			}, null, value, arguments.length > 1, null, false);
		},

		removeData: function( key ){
			return this.each(function(){
				jQuery.removeData(this, key);
			});
		}
	});

	function dataAttr( elem, key, data ){
		// If nothing was found internally, try to fetch any
		// data from the HTML5 data-* attribute
		if( data === undefined && elem.nodeType === 1 ){

			var name = "data-" + key.replace(rmultiDash, "-$1").toLowerCase();

			data = elem.getAttribute(name);

			if( typeof data === "string" ){
				try {
					data = data === "true" ? true : data === "false" ? false : data === "null" ? null : // Only convert to a number if it doesn't change the string
						+data + "" === data ? +data : rbrace.test(data) ? jQuery.parseJSON(data) : data;
				} catch( e ) {
				}

				// Make sure we set the data so it isn't changed later
				jQuery.data(elem, key, data);

			} else{
				data = undefined;
			}
		}

		return data;
	}

	// checks a cache object for emptiness
	function isEmptyDataObject( obj ){
		var name;
		for( name in obj ){

			// if the public data object is empty, the private is still empty
			if( name === "data" && jQuery.isEmptyObject(obj[name]) ){
				continue;
			}
			if( name !== "toJSON" ){
				return false;
			}
		}

		return true;
	}

	jQuery.extend({
		queue: function( elem, type, data ){
			var queue;

			if( elem ){
				type = (type || "fx") + "queue";
				queue = jQuery._data(elem, type);

				// Speed up dequeue by getting out quickly if this is just a lookup
				if( data ){
					if( !queue || jQuery.isArray(data) ){
						queue = jQuery._data(elem, type, jQuery.makeArray(data));
					} else{
						queue.push(data);
					}
				}
				return queue || [];
			}
		},

		dequeue: function( elem, type ){
			type = type || "fx";

			var queue = jQuery.queue(elem, type), startLength = queue.length, fn = queue.shift(), hooks = jQuery._queueHooks(elem, type), next = function(){
					jQuery.dequeue(elem, type);
				};

			// If the fx queue is dequeued, always remove the progress sentinel
			if( fn === "inprogress" ){
				fn = queue.shift();
				startLength--;
			}

			if( fn ){

				// Add a progress sentinel to prevent the fx queue from being
				// automatically dequeued
				if( type === "fx" ){
					queue.unshift("inprogress");
				}

				// clear up the last queue stop function
				delete hooks.stop;
				fn.call(elem, next, hooks);
			}

			if( !startLength && hooks ){
				hooks.empty.fire();
			}
		},

		// not intended for public consumption - generates a queueHooks object, or returns the current one
		_queueHooks: function( elem, type ){
			var key = type + "queueHooks";
			return jQuery._data(elem, key) || jQuery._data(elem, key, {
				empty: jQuery.Callbacks("once memory").add(function(){
					jQuery.removeData(elem, type + "queue", true);
					jQuery.removeData(elem, key, true);
				})
			});
		}
	});

	jQuery.fn.extend({
		queue: function( type, data ){
			var setter = 2;

			if( typeof type !== "string" ){
				data = type;
				type = "fx";
				setter--;
			}

			if( arguments.length < setter ){
				return jQuery.queue(this[0], type);
			}

			return data === undefined ? this : this.each(function(){
				var queue = jQuery.queue(this, type, data);

				// ensure a hooks for this queue
				jQuery._queueHooks(this, type);

				if( type === "fx" && queue[0] !== "inprogress" ){
					jQuery.dequeue(this, type);
				}
			});
		},
		dequeue: function( type ){
			return this.each(function(){
				jQuery.dequeue(this, type);
			});
		},
		// Based off of the plugin by Clint Helfers, with permission.
		// http://blindsignals.com/index.php/2009/07/jquery-delay/
		delay: function( time, type ){
			time = jQuery.fx ? jQuery.fx.speeds[time] || time : time;
			type = type || "fx";

			return this.queue(type, function( next, hooks ){
				var timeout = setTimeout(next, time);
				hooks.stop = function(){
					clearTimeout(timeout);
				};
			});
		},
		clearQueue: function( type ){
			return this.queue(type || "fx", []);
		},
		// Get a promise resolved when queues of a certain type
		// are emptied (fx is the type by default)
		promise: function( type, obj ){
			var tmp, count = 1, defer = jQuery.Deferred(), elements = this, i = this.length, resolve = function(){
					if( !(--count) ){
						defer.resolveWith(elements, [elements]);
					}
				};

			if( typeof type !== "string" ){
				obj = type;
				type = undefined;
			}
			type = type || "fx";

			while( i-- ){
				tmp = jQuery._data(elements[i], type + "queueHooks");
				if( tmp && tmp.empty ){
					count++;
					tmp.empty.add(resolve);
				}
			}
			resolve();
			return defer.promise(obj);
		}
	});
	var nodeHook, booleanHook, fixSpecified, rclass = /[\t\r\n]/g, rreturn = /\r/g, rtype = /^(?:button|input)$/i, rfocusable = /^(?:button|input|object|select|textarea)$/i, rclickable = /^a(?:rea|)$/i, rboolean = /^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i, getSetAttribute = jQuery.support.getSetAttribute;

	jQuery.fn.extend({
		attr: function( name, value ){
			return jQuery.access(this, jQuery.attr, name, value, arguments.length > 1);
		},

		removeAttr: function( name ){
			return this.each(function(){
				jQuery.removeAttr(this, name);
			});
		},

		prop: function( name, value ){
			return jQuery.access(this, jQuery.prop, name, value, arguments.length > 1);
		},

		removeProp: function( name ){
			name = jQuery.propFix[name] || name;
			return this.each(function(){
				// try/catch handles cases where IE balks (such as removing a property on window)
				try {
					this[name] = undefined;
					delete this[name];
				} catch( e ) {
				}
			});
		},

		addClass: function( value ){
			var classNames, i, l, elem, setClass, c, cl;

			if( jQuery.isFunction(value) ){
				return this.each(function( j ){
					jQuery(this).addClass(value.call(this, j, this.className));
				});
			}

			if( value && typeof value === "string" ){
				classNames = value.split(core_rspace);

				for( i = 0, l = this.length; i < l; i++ ){
					elem = this[i];

					if( elem.nodeType === 1 ){
						if( !elem.className && classNames.length === 1 ){
							elem.className = value;

						} else{
							setClass = " " + elem.className + " ";

							for( c = 0, cl = classNames.length; c < cl; c++ ){
								if( setClass.indexOf(" " + classNames[c] + " ") < 0 ){
									setClass += classNames[c] + " ";
								}
							}
							elem.className = jQuery.trim(setClass);
						}
					}
				}
			}

			return this;
		},

		removeClass: function( value ){
			var removes, className, elem, c, cl, i, l;

			if( jQuery.isFunction(value) ){
				return this.each(function( j ){
					jQuery(this).removeClass(value.call(this, j, this.className));
				});
			}
			if( (value && typeof value === "string") || value === undefined ){
				removes = (value || "").split(core_rspace);

				for( i = 0, l = this.length; i < l; i++ ){
					elem = this[i];
					if( elem.nodeType === 1 && elem.className ){

						className = (" " + elem.className + " ").replace(rclass, " ");

						// loop over each item in the removal list
						for( c = 0, cl = removes.length; c < cl; c++ ){
							// Remove until there is nothing to remove,
							while( className.indexOf(" " + removes[c] + " ") >= 0 ){
								className = className.replace(" " + removes[c] + " ", " ");
							}
						}
						elem.className = value ? jQuery.trim(className) : "";
					}
				}
			}

			return this;
		},

		toggleClass: function( value, stateVal ){
			var type = typeof value, isboolean = typeof stateVal === "boolean";

			if( jQuery.isFunction(value) ){
				return this.each(function( i ){
					jQuery(this).toggleClass(value.call(this, i, this.className, stateVal), stateVal);
				});
			}

			return this.each(function(){
				if( type === "string" ){
					// toggle individual class names
					var className, i = 0, self = jQuery(this), state = stateVal, classNames = value.split(core_rspace);

					while( (className = classNames[i++]) ){
						// check each className given, space separated list
						state = isboolean ? state : !self.hasClass(className);
						self[state ? "addClass" : "removeClass"](className);
					}

				} else if( type === "undefined" || type === "boolean" ){
					if( this.className ){
						// store className if set
						jQuery._data(this, "__className__", this.className);
					}

					// toggle whole className
					this.className = this.className || value === false ? "" : jQuery._data(this, "__className__") || "";
				}
			});
		},

		hasClass: function( selector ){
			var className = " " + selector + " ", i = 0, l = this.length;
			for( ; i < l; i++ ){
				if( this[i].nodeType === 1 && (" " + this[i].className + " ").replace(rclass, " ").indexOf(className) >= 0 ){
					return true;
				}
			}

			return false;
		},

		val: function( value ){
			var hooks, ret, isFunction, elem = this[0];

			if( !arguments.length ){
				if( elem ){
					hooks = jQuery.valHooks[elem.type] || jQuery.valHooks[elem.nodeName.toLowerCase()];

					if( hooks && "get" in hooks && (ret = hooks.get(elem, "value")) !== undefined ){
						return ret;
					}

					ret = elem.value;

					return typeof ret === "string" ? // handle most common string cases
						ret.replace(rreturn, "") : // handle cases where value is null/undef or number
						ret == null ? "" : ret;
				}

				return;
			}

			isFunction = jQuery.isFunction(value);

			return this.each(function( i ){
				var val, self = jQuery(this);

				if( this.nodeType !== 1 ){
					return;
				}

				if( isFunction ){
					val = value.call(this, i, self.val());
				} else{
					val = value;
				}

				// Treat null/undefined as ""; convert numbers to string
				if( val == null ){
					val = "";
				} else if( typeof val === "number" ){
					val += "";
				} else if( jQuery.isArray(val) ){
					val = jQuery.map(val, function( value ){
						return value == null ? "" : value + "";
					});
				}

				hooks = jQuery.valHooks[this.type] || jQuery.valHooks[this.nodeName.toLowerCase()];

				// If set returns undefined, fall back to normal setting
				if( !hooks || !("set" in hooks) || hooks.set(this, val, "value") === undefined ){
					this.value = val;
				}
			});
		}
	});

	jQuery.extend({
		valHooks: {
			option: {
				get: function( elem ){
					// attributes.value is undefined in Blackberry 4.7 but
					// uses .value. See #6932
					var val = elem.attributes.value;
					return !val || val.specified ? elem.value : elem.text;
				}
			},
			select: {
				get: function( elem ){
					var value, option, options = elem.options, index = elem.selectedIndex, one = elem.type === "select-one" || index < 0, values = one ? null : [], max = one ? index + 1 : options.length, i = index < 0 ? max : one ? index : 0;

					// Loop through all the selected options
					for( ; i < max; i++ ){
						option = options[i];

						// oldIE doesn't update selected after form reset (#2551)
						if( (option.selected || i === index) && // Don't return options that are disabled or in a disabled optgroup
							(jQuery.support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null) && (!option.parentNode.disabled || !jQuery.nodeName(option.parentNode, "optgroup")) ){

							// Get the specific value for the option
							value = jQuery(option).val();

							// We don't need an array for one selects
							if( one ){
								return value;
							}

							// Multi-Selects return an array
							values.push(value);
						}
					}

					return values;
				},

				set: function( elem, value ){
					var values = jQuery.makeArray(value);

					jQuery(elem).find("option").each(function(){
						this.selected = jQuery.inArray(jQuery(this).val(), values) >= 0;
					});

					if( !values.length ){
						elem.selectedIndex = -1;
					}
					return values;
				}
			}
		},

		// Unused in 1.8, left in so attrFn-stabbers won't die; remove in 1.9
		attrFn: {},

		attr: function( elem, name, value, pass ){
			var ret, hooks, notxml, nType = elem.nodeType;

			// don't get/set attributes on text, comment and attribute nodes
			if( !elem || nType === 3 || nType === 8 || nType === 2 ){
				return;
			}

			if( pass && jQuery.isFunction(jQuery.fn[name]) ){
				return jQuery(elem)[name](value);
			}

			// Fallback to prop when attributes are not supported
			if( typeof elem.getAttribute === "undefined" ){
				return jQuery.prop(elem, name, value);
			}

			notxml = nType !== 1 || !jQuery.isXMLDoc(elem);

			// All attributes are lowercase
			// Grab necessary hook if one is defined
			if( notxml ){
				name = name.toLowerCase();
				hooks = jQuery.attrHooks[name] || (rboolean.test(name) ? booleanHook : nodeHook);
			}

			if( value !== undefined ){

				if( value === null ){
					jQuery.removeAttr(elem, name);
					return;

				} else if( hooks && "set" in hooks && notxml && (ret = hooks.set(elem, value, name)) !== undefined ){
					return ret;

				} else{
					elem.setAttribute(name, value + "");
					return value;
				}

			} else if( hooks && "get" in hooks && notxml && (ret = hooks.get(elem, name)) !== null ){
				return ret;

			} else{

				ret = elem.getAttribute(name);

				// Non-existent attributes return null, we normalize to undefined
				return ret === null ? undefined : ret;
			}
		},

		removeAttr: function( elem, value ){
			var propName, attrNames, name, isboolean, i = 0;

			if( value && elem.nodeType === 1 ){

				attrNames = value.split(core_rspace);

				for( ; i < attrNames.length; i++ ){
					name = attrNames[i];

					if( name ){
						propName = jQuery.propFix[name] || name;
						isboolean = rboolean.test(name);

						// See #9699 for explanation of this approach (setting first, then removal)
						// Do not do this for boolean attributes (see #10870)
						if( !isboolean ){
							jQuery.attr(elem, name, "");
						}
						elem.removeAttribute(getSetAttribute ? name : propName);

						// Set corresponding property to false for boolean attributes
						if( isboolean && propName in elem ){
							elem[propName] = false;
						}
					}
				}
			}
		},

		attrHooks: {
			type: {
				set: function( elem, value ){
					// We can't allow the type property to be changed (since it causes problems in IE)
					if( rtype.test(elem.nodeName) && elem.parentNode ){
						jQuery.error("type property can't be changed");
					} else if( !jQuery.support.radioValue && value === "radio" && jQuery.nodeName(elem, "input") ){
						// Setting the type on a radio button after the value resets the value in IE6-9
						// Reset value to it's default in case type is set after value
						// This is for element creation
						var val = elem.value;
						elem.setAttribute("type", value);
						if( val ){
							elem.value = val;
						}
						return value;
					}
				}
			},
			// Use the value property for back compat
			// Use the nodeHook for button elements in IE6/7 (#1954)
			value: {
				get: function( elem, name ){
					if( nodeHook && jQuery.nodeName(elem, "button") ){
						return nodeHook.get(elem, name);
					}
					return name in elem ? elem.value : null;
				},
				set: function( elem, value, name ){
					if( nodeHook && jQuery.nodeName(elem, "button") ){
						return nodeHook.set(elem, value, name);
					}
					// Does not return so that setAttribute is also used
					elem.value = value;
				}
			}
		},

		propFix: {
			tabindex: "tabIndex",
			readonly: "readOnly",
			"for": "htmlFor",
			"class": "className",
			maxlength: "maxLength",
			cellspacing: "cellSpacing",
			cellpadding: "cellPadding",
			rowspan: "rowSpan",
			colspan: "colSpan",
			usemap: "useMap",
			frameborder: "frameBorder",
			contenteditable: "contentEditable"
		},

		prop: function( elem, name, value ){
			var ret, hooks, notxml, nType = elem.nodeType;

			// don't get/set properties on text, comment and attribute nodes
			if( !elem || nType === 3 || nType === 8 || nType === 2 ){
				return;
			}

			notxml = nType !== 1 || !jQuery.isXMLDoc(elem);

			if( notxml ){
				// Fix name and attach hooks
				name = jQuery.propFix[name] || name;
				hooks = jQuery.propHooks[name];
			}

			if( value !== undefined ){
				if( hooks && "set" in hooks && (ret = hooks.set(elem, value, name)) !== undefined ){
					return ret;

				} else{
					return (elem[name] = value);
				}

			} else{
				if( hooks && "get" in hooks && (ret = hooks.get(elem, name)) !== null ){
					return ret;

				} else{
					return elem[name];
				}
			}
		},

		propHooks: {
			tabIndex: {
				get: function( elem ){
					// elem.tabIndex doesn't always return the correct value when it hasn't been explicitly set
					// http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
					var attributeNode = elem.getAttributeNode("tabindex");

					return attributeNode && attributeNode.specified ? parseInt(attributeNode.value, 10) : rfocusable.test(elem.nodeName) || rclickable.test(elem.nodeName) && elem.href ? 0 : undefined;
				}
			}
		}
	});

	// Hook for boolean attributes
	booleanHook = {
		get: function( elem, name ){
			// Align boolean attributes with corresponding properties
			// Fall back to attribute presence where some booleans are not supported
			var attrNode, property = jQuery.prop(elem, name);
			return property === true || typeof property !== "boolean" && (attrNode = elem.getAttributeNode(name)) && attrNode.nodeValue !== false ? name.toLowerCase() : undefined;
		},
		set: function( elem, value, name ){
			var propName;
			if( value === false ){
				// Remove boolean attributes when set to false
				jQuery.removeAttr(elem, name);
			} else{
				// value is true since we know at this point it's type boolean and not false
				// Set boolean attributes to the same name and set the DOM property
				propName = jQuery.propFix[name] || name;
				if( propName in elem ){
					// Only set the IDL specifically if it already exists on the element
					elem[propName] = true;
				}

				elem.setAttribute(name, name.toLowerCase());
			}
			return name;
		}
	};

	// IE6/7 do not support getting/setting some attributes with get/setAttribute
	if( !getSetAttribute ){

		fixSpecified = {
			name: true,
			id: true,
			coords: true
		};

		// Use this for any attribute in IE6/7
		// This fixes almost every IE6/7 issue
		nodeHook = jQuery.valHooks.button = {
			get: function( elem, name ){
				var ret;
				ret = elem.getAttributeNode(name);
				return ret && (fixSpecified[name] ? ret.value !== "" : ret.specified) ? ret.value : undefined;
			},
			set: function( elem, value, name ){
				// Set the existing or create a new attribute node
				var ret = elem.getAttributeNode(name);
				if( !ret ){
					ret = document.createAttribute(name);
					elem.setAttributeNode(ret);
				}
				return (ret.value = value + "");
			}
		};

		// Set width and height to auto instead of 0 on empty string( Bug #8150 )
		// This is for removals
		jQuery.each(["width", "height"], function( i, name ){
			jQuery.attrHooks[name] = jQuery.extend(jQuery.attrHooks[name], {
				set: function( elem, value ){
					if( value === "" ){
						elem.setAttribute(name, "auto");
						return value;
					}
				}
			});
		});

		// Set contenteditable to false on removals(#10429)
		// Setting to empty string throws an error as an invalid value
		jQuery.attrHooks.contenteditable = {
			get: nodeHook.get,
			set: function( elem, value, name ){
				if( value === "" ){
					value = "false";
				}
				nodeHook.set(elem, value, name);
			}
		};
	}


	// Some attributes require a special call on IE
	if( !jQuery.support.hrefNormalized ){
		jQuery.each(["href", "src", "width", "height"], function( i, name ){
			jQuery.attrHooks[name] = jQuery.extend(jQuery.attrHooks[name], {
				get: function( elem ){
					var ret = elem.getAttribute(name, 2);
					return ret === null ? undefined : ret;
				}
			});
		});
	}

	if( !jQuery.support.style ){
		jQuery.attrHooks.style = {
			get: function( elem ){
				// Return undefined in the case of empty string
				// Normalize to lowercase since IE uppercases css property names
				return elem.style.cssText.toLowerCase() || undefined;
			},
			set: function( elem, value ){
				return (elem.style.cssText = value + "");
			}
		};
	}

	// Safari mis-reports the default selected property of an option
	// Accessing the parent's selectedIndex property fixes it
	if( !jQuery.support.optSelected ){
		jQuery.propHooks.selected = jQuery.extend(jQuery.propHooks.selected, {
			get: function( elem ){
				var parent = elem.parentNode;

				if( parent ){
					parent.selectedIndex;

					// Make sure that it also works with optgroups, see #5701
					if( parent.parentNode ){
						parent.parentNode.selectedIndex;
					}
				}
				return null;
			}
		});
	}

	// IE6/7 call enctype encoding
	if( !jQuery.support.enctype ){
		jQuery.propFix.enctype = "encoding";
	}

	// Radios and checkboxes getter/setter
	if( !jQuery.support.checkOn ){
		jQuery.each(["radio", "checkbox"], function(){
			jQuery.valHooks[this] = {
				get: function( elem ){
					// Handle the case where in Webkit "" is returned instead of "on" if a value isn't specified
					return elem.getAttribute("value") === null ? "on" : elem.value;
				}
			};
		});
	}
	jQuery.each(["radio", "checkbox"], function(){
		jQuery.valHooks[this] = jQuery.extend(jQuery.valHooks[this], {
			set: function( elem, value ){
				if( jQuery.isArray(value) ){
					return (elem.checked = jQuery.inArray(jQuery(elem).val(), value) >= 0);
				}
			}
		});
	});
	var rformElems = /^(?:textarea|input|select)$/i, rtypenamespace = /^([^\.]*|)(?:\.(.+)|)$/, rhoverHack = /(?:^|\s)hover(\.\S+|)\b/, rkeyEvent = /^key/, rmouseEvent = /^(?:mouse|contextmenu)|click/, rfocusMorph = /^(?:focusinfocus|focusoutblur)$/, hoverHack = function( events ){
			return jQuery.event.special.hover ? events : events.replace(rhoverHack, "mouseenter$1 mouseleave$1");
		};

	/*
	 * Helper functions for managing events -- not part of the public interface.
	 * Props to Dean Edwards' addEvent library for many of the ideas.
	 */
	jQuery.event = {

		add: function( elem, types, handler, data, selector ){

			var elemData, eventHandle, events, t, tns, type, namespaces, handleObj, handleObjIn, handlers, special;

			// Don't attach events to noData or text/comment nodes (allow plain objects tho)
			if( elem.nodeType === 3 || elem.nodeType === 8 || !types || !handler || !(elemData = jQuery._data(elem)) ){
				return;
			}

			// Caller can pass in an object of custom data in lieu of the handler
			if( handler.handler ){
				handleObjIn = handler;
				handler = handleObjIn.handler;
				selector = handleObjIn.selector;
			}

			// Make sure that the handler has a unique ID, used to find/remove it later
			if( !handler.guid ){
				handler.guid = jQuery.guid++;
			}

			// Init the element's event structure and main handler, if this is the first
			events = elemData.events;
			if( !events ){
				elemData.events = events = {};
			}
			eventHandle = elemData.handle;
			if( !eventHandle ){
				elemData.handle = eventHandle = function( e ){
					// Discard the second event of a jQuery.event.trigger() and
					// when an event is called after a page has unloaded
					return typeof jQuery !== "undefined" && (!e || jQuery.event.triggered !== e.type) ? jQuery.event.dispatch.apply(eventHandle.elem, arguments) : undefined;
				};
				// Add elem as a property of the handle fn to prevent a memory leak with IE non-native events
				eventHandle.elem = elem;
			}

			// Handle multiple events separated by a space
			// jQuery(...).bind("mouseover mouseout", fn);
			types = jQuery.trim(hoverHack(types)).split(" ");
			for( t = 0; t < types.length; t++ ){

				tns = rtypenamespace.exec(types[t]) || [];
				type = tns[1];
				namespaces = (tns[2] || "").split(".").sort();

				// If event changes its type, use the special event handlers for the changed type
				special = jQuery.event.special[type] || {};

				// If selector defined, determine special event api type, otherwise given type
				type = (selector ? special.delegateType : special.bindType) || type;

				// Update special based on newly reset type
				special = jQuery.event.special[type] || {};

				// handleObj is passed to all event handlers
				handleObj = jQuery.extend({
					type: type,
					origType: tns[1],
					data: data,
					handler: handler,
					guid: handler.guid,
					selector: selector,
					needsContext: selector && jQuery.expr.match.needsContext.test(selector),
					namespace: namespaces.join(".")
				}, handleObjIn);

				// Init the event handler queue if we're the first
				handlers = events[type];
				if( !handlers ){
					handlers = events[type] = [];
					handlers.delegateCount = 0;

					// Only use addEventListener/attachEvent if the special events handler returns false
					if( !special.setup || special.setup.call(elem, data, namespaces, eventHandle) === false ){
						// Bind the global event handler to the element
						if( elem.addEventListener ){
							elem.addEventListener(type, eventHandle, false);

						} else if( elem.attachEvent ){
							elem.attachEvent("on" + type, eventHandle);
						}
					}
				}

				if( special.add ){
					special.add.call(elem, handleObj);

					if( !handleObj.handler.guid ){
						handleObj.handler.guid = handler.guid;
					}
				}

				// Add to the element's handler list, delegates in front
				if( selector ){
					handlers.splice(handlers.delegateCount++, 0, handleObj);
				} else{
					handlers.push(handleObj);
				}

				// Keep track of which events have ever been used, for event optimization
				jQuery.event.global[type] = true;
			}

			// Nullify elem to prevent memory leaks in IE
			elem = null;
		},

		global: {},

		// Detach an event or set of events from an element
		remove: function( elem, types, handler, selector, mappedTypes ){

			var t, tns, type, origType, namespaces, origCount, j, events, special, eventType, handleObj, elemData = jQuery.hasData(elem) && jQuery._data(elem);

			if( !elemData || !(events = elemData.events) ){
				return;
			}

			// Once for each type.namespace in types; type may be omitted
			types = jQuery.trim(hoverHack(types || "")).split(" ");
			for( t = 0; t < types.length; t++ ){
				tns = rtypenamespace.exec(types[t]) || [];
				type = origType = tns[1];
				namespaces = tns[2];

				// Unbind all events (on this namespace, if provided) for the element
				if( !type ){
					for( type in events ){
						jQuery.event.remove(elem, type + types[t], handler, selector, true);
					}
					continue;
				}

				special = jQuery.event.special[type] || {};
				type = (selector ? special.delegateType : special.bindType) || type;
				eventType = events[type] || [];
				origCount = eventType.length;
				namespaces = namespaces ? new RegExp("(^|\\.)" + namespaces.split(".").sort().join("\\.(?:.*\\.|)") + "(\\.|$)") : null;

				// Remove matching events
				for( j = 0; j < eventType.length; j++ ){
					handleObj = eventType[j];

					if( (mappedTypes || origType === handleObj.origType) && (!handler || handler.guid === handleObj.guid) && (!namespaces || namespaces.test(handleObj.namespace)) && (!selector || selector === handleObj.selector || selector === "**" && handleObj.selector) ){
						eventType.splice(j--, 1);

						if( handleObj.selector ){
							eventType.delegateCount--;
						}
						if( special.remove ){
							special.remove.call(elem, handleObj);
						}
					}
				}

				// Remove generic event handler if we removed something and no more handlers exist
				// (avoids potential for endless recursion during removal of special event handlers)
				if( eventType.length === 0 && origCount !== eventType.length ){
					if( !special.teardown || special.teardown.call(elem, namespaces, elemData.handle) === false ){
						jQuery.removeEvent(elem, type, elemData.handle);
					}

					delete events[type];
				}
			}

			// Remove the expando if it's no longer used
			if( jQuery.isEmptyObject(events) ){
				delete elemData.handle;

				// removeData also checks for emptiness and clears the expando if empty
				// so use it instead of delete
				jQuery.removeData(elem, "events", true);
			}
		},

		// Events that are safe to short-circuit if no handlers are attached.
		// Native DOM events should not be added, they may have inline handlers.
		customEvent: {
			"getData": true,
			"setData": true,
			"changeData": true
		},

		trigger: function( event, data, elem, onlyHandlers ){
			// Don't do events on text and comment nodes
			if( elem && (elem.nodeType === 3 || elem.nodeType === 8) ){
				return;
			}

			// Event object or event type
			var cache, exclusive, i, cur, old, ontype, special, handle, eventPath, bubbleType, type = event.type || event, namespaces = [];

			// focus/blur morphs to focusin/out; ensure we're not firing them right now
			if( rfocusMorph.test(type + jQuery.event.triggered) ){
				return;
			}

			if( type.indexOf("!") >= 0 ){
				// Exclusive events trigger only for the exact event (no namespaces)
				type = type.slice(0, -1);
				exclusive = true;
			}

			if( type.indexOf(".") >= 0 ){
				// Namespaced trigger; create a regexp to match event type in handle()
				namespaces = type.split(".");
				type = namespaces.shift();
				namespaces.sort();
			}

			if( (!elem || jQuery.event.customEvent[type]) && !jQuery.event.global[type] ){
				// No jQuery handlers for this event type, and it can't have inline handlers
				return;
			}

			// Caller can pass in an Event, Object, or just an event type string
			event = typeof event === "object" ? // jQuery.Event object
				event[jQuery.expando] ? event : // Object literal
					new jQuery.Event(type, event) : // Just the event type (string)
				new jQuery.Event(type);

			event.type = type;
			event.isTrigger = true;
			event.exclusive = exclusive;
			event.namespace = namespaces.join(".");
			event.namespace_re = event.namespace ? new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)") : null;
			ontype = type.indexOf(":") < 0 ? "on" + type : "";

			// Handle a global trigger
			if( !elem ){

				// TODO: Stop taunting the data cache; remove global events and always attach to document
				cache = jQuery.cache;
				for( i in cache ){
					if( cache[i].events && cache[i].events[type] ){
						jQuery.event.trigger(event, data, cache[i].handle.elem, true);
					}
				}
				return;
			}

			// Clean up the event in case it is being reused
			event.result = undefined;
			if( !event.target ){
				event.target = elem;
			}

			// Clone any incoming data and prepend the event, creating the handler arg list
			data = data != null ? jQuery.makeArray(data) : [];
			data.unshift(event);

			// Allow special events to draw outside the lines
			special = jQuery.event.special[type] || {};
			if( special.trigger && special.trigger.apply(elem, data) === false ){
				return;
			}

			// Determine event propagation path in advance, per W3C events spec (#9951)
			// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
			eventPath = [
				[elem, special.bindType || type]
			];
			if( !onlyHandlers && !special.noBubble && !jQuery.isWindow(elem) ){

				bubbleType = special.delegateType || type;
				cur = rfocusMorph.test(bubbleType + type) ? elem : elem.parentNode;
				for( old = elem; cur; cur = cur.parentNode ){
					eventPath.push([cur, bubbleType]);
					old = cur;
				}

				// Only add window if we got to document (e.g., not plain obj or detached DOM)
				if( old === (elem.ownerDocument || document) ){
					eventPath.push([old.defaultView || old.parentWindow || window, bubbleType]);
				}
			}

			// Fire handlers on the event path
			for( i = 0; i < eventPath.length && !event.isPropagationStopped(); i++ ){

				cur = eventPath[i][0];
				event.type = eventPath[i][1];

				handle = (jQuery._data(cur, "events") || {})[event.type] && jQuery._data(cur, "handle");
				if( handle ){
					handle.apply(cur, data);
				}
				// Note that this is a bare JS function and not a jQuery handler
				handle = ontype && cur[ontype];
				if( handle && jQuery.acceptData(cur) && handle.apply && handle.apply(cur, data) === false ){
					event.preventDefault();
				}
			}
			event.type = type;

			// If nobody prevented the default action, do it now
			if( !onlyHandlers && !event.isDefaultPrevented() ){

				if( (!special._default || special._default.apply(elem.ownerDocument, data) === false) && !(type === "click" && jQuery.nodeName(elem, "a")) && jQuery.acceptData(elem) ){

					// Call a native DOM method on the target with the same name name as the event.
					// Can't use an .isFunction() check here because IE6/7 fails that test.
					// Don't do default actions on window, that's where global variables be (#6170)
					// IE<9 dies on focus/blur to hidden element (#1486)
					if( ontype && elem[type] && ((type !== "focus" && type !== "blur") || event.target.offsetWidth !== 0) && !jQuery.isWindow(elem) ){

						// Don't re-trigger an onFOO event when we call its FOO() method
						old = elem[ontype];

						if( old ){
							elem[ontype] = null;
						}

						// Prevent re-triggering of the same event, since we already bubbled it above
						jQuery.event.triggered = type;
						elem[type]();
						jQuery.event.triggered = undefined;

						if( old ){
							elem[ontype] = old;
						}
					}
				}
			}

			return event.result;
		},

		dispatch: function( event ){

			// Make a writable jQuery.Event from the native event object
			event = jQuery.event.fix(event || window.event);

			var i, j, cur, ret, selMatch, matched, matches, handleObj, sel, related, handlers = ((jQuery._data(this, "events") || {})[event.type] || []), delegateCount = handlers.delegateCount, args = core_slice.call(arguments), run_all = !event.exclusive && !event.namespace, special = jQuery.event.special[event.type] || {}, handlerQueue = [];

			// Use the fix-ed jQuery.Event rather than the (read-only) native event
			args[0] = event;
			event.delegateTarget = this;

			// Call the preDispatch hook for the mapped type, and let it bail if desired
			if( special.preDispatch && special.preDispatch.call(this, event) === false ){
				return;
			}

			// Determine handlers that should run if there are delegated events
			// Avoid non-left-click bubbling in Firefox (#3861)
			if( delegateCount && !(event.button && event.type === "click") ){

				for( cur = event.target; cur != this; cur = cur.parentNode || this ){

					// Don't process clicks (ONLY) on disabled elements (#6911, #8165, #11382, #11764)
					if( cur.disabled !== true || event.type !== "click" ){
						selMatch = {};
						matches = [];
						for( i = 0; i < delegateCount; i++ ){
							handleObj = handlers[i];
							sel = handleObj.selector;

							if( selMatch[sel] === undefined ){
								selMatch[sel] = handleObj.needsContext ? jQuery(sel, this).index(cur) >= 0 : jQuery.find(sel, this, null, [cur]).length;
							}
							if( selMatch[sel] ){
								matches.push(handleObj);
							}
						}
						if( matches.length ){
							handlerQueue.push({ elem: cur, matches: matches });
						}
					}
				}
			}

			// Add the remaining (directly-bound) handlers
			if( handlers.length > delegateCount ){
				handlerQueue.push({ elem: this, matches: handlers.slice(delegateCount) });
			}

			// Run delegates first; they may want to stop propagation beneath us
			for( i = 0; i < handlerQueue.length && !event.isPropagationStopped(); i++ ){
				matched = handlerQueue[i];
				event.currentTarget = matched.elem;

				for( j = 0; j < matched.matches.length && !event.isImmediatePropagationStopped(); j++ ){
					handleObj = matched.matches[j];

					// Triggered event must either 1) be non-exclusive and have no namespace, or
					// 2) have namespace(s) a subset or equal to those in the bound event (both can have no namespace).
					if( run_all || (!event.namespace && !handleObj.namespace) || event.namespace_re && event.namespace_re.test(handleObj.namespace) ){

						event.data = handleObj.data;
						event.handleObj = handleObj;

						ret = ((jQuery.event.special[handleObj.origType] || {}).handle || handleObj.handler).apply(matched.elem, args);

						if( ret !== undefined ){
							event.result = ret;
							if( ret === false ){
								event.preventDefault();
								event.stopPropagation();
							}
						}
					}
				}
			}

			// Call the postDispatch hook for the mapped type
			if( special.postDispatch ){
				special.postDispatch.call(this, event);
			}

			return event.result;
		},

		// Includes some event props shared by KeyEvent and MouseEvent
		// *** attrChange attrName relatedNode srcElement  are not normalized, non-W3C, deprecated, will be removed in 1.8 ***
		props: "attrChange attrName relatedNode srcElement altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),

		fixHooks: {},

		keyHooks: {
			props: "char charCode key keyCode".split(" "),
			filter: function( event, original ){

				// Add which for key events
				if( event.which == null ){
					event.which = original.charCode != null ? original.charCode : original.keyCode;
				}

				return event;
			}
		},

		mouseHooks: {
			props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
			filter: function( event, original ){
				var eventDoc, doc, body, button = original.button, fromElement = original.fromElement;

				// Calculate pageX/Y if missing and clientX/Y available
				if( event.pageX == null && original.clientX != null ){
					eventDoc = event.target.ownerDocument || document;
					doc = eventDoc.documentElement;
					body = eventDoc.body;

					event.pageX = original.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0);
					event.pageY = original.clientY + (doc && doc.scrollTop || body && body.scrollTop || 0) - (doc && doc.clientTop || body && body.clientTop || 0);
				}

				// Add relatedTarget, if necessary
				if( !event.relatedTarget && fromElement ){
					event.relatedTarget = fromElement === event.target ? original.toElement : fromElement;
				}

				// Add which for click: 1 === left; 2 === middle; 3 === right
				// Note: button is not normalized, so don't use it
				if( !event.which && button !== undefined ){
					event.which = (button & 1 ? 1 : (button & 2 ? 3 : (button & 4 ? 2 : 0)));
				}

				return event;
			}
		},

		fix: function( event ){
			if( event[jQuery.expando] ){
				return event;
			}

			// Create a writable copy of the event object and normalize some properties
			var i, prop, originalEvent = event, fixHook = jQuery.event.fixHooks[event.type] || {}, copy = fixHook.props ? this.props.concat(fixHook.props) : this.props;

			event = jQuery.Event(originalEvent);

			for( i = copy.length; i; ){
				prop = copy[--i];
				event[prop] = originalEvent[prop];
			}

			// Fix target property, if necessary (#1925, IE 6/7/8 & Safari2)
			if( !event.target ){
				event.target = originalEvent.srcElement || document;
			}

			// Target should not be a text node (#504, Safari)
			if( event.target.nodeType === 3 ){
				event.target = event.target.parentNode;
			}

			// For mouse/key events, metaKey==false if it's undefined (#3368, #11328; IE6/7/8)
			event.metaKey = !!event.metaKey;

			return fixHook.filter ? fixHook.filter(event, originalEvent) : event;
		},

		special: {
			load: {
				// Prevent triggered image.load events from bubbling to window.load
				noBubble: true
			},

			focus: {
				delegateType: "focusin"
			},
			blur: {
				delegateType: "focusout"
			},

			beforeunload: {
				setup: function( data, namespaces, eventHandle ){
					// We only want to do this special case on windows
					if( jQuery.isWindow(this) ){
						this.onbeforeunload = eventHandle;
					}
				},

				teardown: function( namespaces, eventHandle ){
					if( this.onbeforeunload === eventHandle ){
						this.onbeforeunload = null;
					}
				}
			}
		},

		simulate: function( type, elem, event, bubble ){
			// Piggyback on a donor event to simulate a different one.
			// Fake originalEvent to avoid donor's stopPropagation, but if the
			// simulated event prevents default then we do the same on the donor.
			var e = jQuery.extend(new jQuery.Event(), event, {
					type: type,
					isSimulated: true,
					originalEvent: {}
				});
			if( bubble ){
				jQuery.event.trigger(e, null, elem);
			} else{
				jQuery.event.dispatch.call(elem, e);
			}
			if( e.isDefaultPrevented() ){
				event.preventDefault();
			}
		}
	};

	// Some plugins are using, but it's undocumented/deprecated and will be removed.
	// The 1.7 special event interface should provide all the hooks needed now.
	jQuery.event.handle = jQuery.event.dispatch;

	jQuery.removeEvent = document.removeEventListener ? function( elem, type, handle ){
		if( elem.removeEventListener ){
			elem.removeEventListener(type, handle, false);
		}
	} : function( elem, type, handle ){
		var name = "on" + type;

		if( elem.detachEvent ){

			// #8545, #7054, preventing memory leaks for custom events in IE6-8
			// detachEvent needed property on element, by name of that event, to properly expose it to GC
			if( typeof elem[name] === "undefined" ){
				elem[name] = null;
			}

			elem.detachEvent(name, handle);
		}
	};

	jQuery.Event = function( src, props ){
		// Allow instantiation without the 'new' keyword
		if( !(this instanceof jQuery.Event) ){
			return new jQuery.Event(src, props);
		}

		// Event object
		if( src && src.type ){
			this.originalEvent = src;
			this.type = src.type;

			// Events bubbling up the document may have been marked as prevented
			// by a handler lower down the tree; reflect the correct value.
			this.isDefaultPrevented = (src.defaultPrevented || src.returnValue === false || src.getPreventDefault && src.getPreventDefault()) ? returnTrue : returnFalse;

			// Event type
		} else{
			this.type = src;
		}

		// Put explicitly provided properties onto the event object
		if( props ){
			jQuery.extend(this, props);
		}

		// Create a timestamp if incoming event doesn't have one
		this.timeStamp = src && src.timeStamp || jQuery.now();

		// Mark it as fixed
		this[jQuery.expando] = true;
	};

	function returnFalse(){
		return false;
	}

	function returnTrue(){
		return true;
	}

	// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
	// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
	jQuery.Event.prototype = {
		preventDefault: function(){
			this.isDefaultPrevented = returnTrue;

			var e = this.originalEvent;
			if( !e ){
				return;
			}

			// if preventDefault exists run it on the original event
			if( e.preventDefault ){
				e.preventDefault();

				// otherwise set the returnValue property of the original event to false (IE)
			} else{
				e.returnValue = false;
			}
		},
		stopPropagation: function(){
			this.isPropagationStopped = returnTrue;

			var e = this.originalEvent;
			if( !e ){
				return;
			}
			// if stopPropagation exists run it on the original event
			if( e.stopPropagation ){
				e.stopPropagation();
			}
			// otherwise set the cancelBubble property of the original event to true (IE)
			e.cancelBubble = true;
		},
		stopImmediatePropagation: function(){
			this.isImmediatePropagationStopped = returnTrue;
			this.stopPropagation();
		},
		isDefaultPrevented: returnFalse,
		isPropagationStopped: returnFalse,
		isImmediatePropagationStopped: returnFalse
	};

	// Create mouseenter/leave events using mouseover/out and event-time checks
	jQuery.each({
		mouseenter: "mouseover",
		mouseleave: "mouseout"
	}, function( orig, fix ){
		jQuery.event.special[orig] = {
			delegateType: fix,
			bindType: fix,

			handle: function( event ){
				var ret, target = this, related = event.relatedTarget, handleObj = event.handleObj, selector = handleObj.selector;

				// For mousenter/leave call the handler if related is outside the target.
				// NB: No relatedTarget if the mouse left/entered the browser window
				if( !related || (related !== target && !jQuery.contains(target, related)) ){
					event.type = handleObj.origType;
					ret = handleObj.handler.apply(this, arguments);
					event.type = fix;
				}
				return ret;
			}
		};
	});

	// IE submit delegation
	if( !jQuery.support.submitBubbles ){

		jQuery.event.special.submit = {
			setup: function(){
				// Only need this for delegated form submit events
				if( jQuery.nodeName(this, "form") ){
					return false;
				}

				// Lazy-add a submit handler when a descendant form may potentially be submitted
				jQuery.event.add(this, "click._submit keypress._submit", function( e ){
					// Node name check avoids a VML-related crash in IE (#9807)
					var elem = e.target, form = jQuery.nodeName(elem, "input") || jQuery.nodeName(elem, "button") ? elem.form : undefined;
					if( form && !jQuery._data(form, "_submit_attached") ){
						jQuery.event.add(form, "submit._submit", function( event ){
							event._submit_bubble = true;
						});
						jQuery._data(form, "_submit_attached", true);
					}
				});
				// return undefined since we don't need an event listener
			},

			postDispatch: function( event ){
				// If form was submitted by the user, bubble the event up the tree
				if( event._submit_bubble ){
					delete event._submit_bubble;
					if( this.parentNode && !event.isTrigger ){
						jQuery.event.simulate("submit", this.parentNode, event, true);
					}
				}
			},

			teardown: function(){
				// Only need this for delegated form submit events
				if( jQuery.nodeName(this, "form") ){
					return false;
				}

				// Remove delegated handlers; cleanData eventually reaps submit handlers attached above
				jQuery.event.remove(this, "._submit");
			}
		};
	}

	// IE change delegation and checkbox/radio fix
	if( !jQuery.support.changeBubbles ){

		jQuery.event.special.change = {

			setup: function(){

				if( rformElems.test(this.nodeName) ){
					// IE doesn't fire change on a check/radio until blur; trigger it on click
					// after a propertychange. Eat the blur-change in special.change.handle.
					// This still fires onchange a second time for check/radio after blur.
					if( this.type === "checkbox" || this.type === "radio" ){
						jQuery.event.add(this, "propertychange._change", function( event ){
							if( event.originalEvent.propertyName === "checked" ){
								this._just_changed = true;
							}
						});
						jQuery.event.add(this, "click._change", function( event ){
							if( this._just_changed && !event.isTrigger ){
								this._just_changed = false;
							}
							// Allow triggered, simulated change events (#11500)
							jQuery.event.simulate("change", this, event, true);
						});
					}
					return false;
				}
				// Delegated event; lazy-add a change handler on descendant inputs
				jQuery.event.add(this, "beforeactivate._change", function( e ){
					var elem = e.target;

					if( rformElems.test(elem.nodeName) && !jQuery._data(elem, "_change_attached") ){
						jQuery.event.add(elem, "change._change", function( event ){
							if( this.parentNode && !event.isSimulated && !event.isTrigger ){
								jQuery.event.simulate("change", this.parentNode, event, true);
							}
						});
						jQuery._data(elem, "_change_attached", true);
					}
				});
			},

			handle: function( event ){
				var elem = event.target;

				// Swallow native change events from checkbox/radio, we already triggered them above
				if( this !== elem || event.isSimulated || event.isTrigger || (elem.type !== "radio" && elem.type !== "checkbox") ){
					return event.handleObj.handler.apply(this, arguments);
				}
			},

			teardown: function(){
				jQuery.event.remove(this, "._change");

				return !rformElems.test(this.nodeName);
			}
		};
	}

	// Create "bubbling" focus and blur events
	if( !jQuery.support.focusinBubbles ){
		jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ){

			// Attach a single capturing handler while someone wants focusin/focusout
			var attaches = 0, handler = function( event ){
					jQuery.event.simulate(fix, event.target, jQuery.event.fix(event), true);
				};

			jQuery.event.special[fix] = {
				setup: function(){
					if( attaches++ === 0 ){
						document.addEventListener(orig, handler, true);
					}
				},
				teardown: function(){
					if( --attaches === 0 ){
						document.removeEventListener(orig, handler, true);
					}
				}
			};
		});
	}

	jQuery.fn.extend({

		on: function( types, selector, data, fn, /*INTERNAL*/ one ){
			var origFn, type;

			// Types can be a map of types/handlers
			if( typeof types === "object" ){
				// ( types-Object, selector, data )
				if( typeof selector !== "string" ){ // && selector != null
					// ( types-Object, data )
					data = data || selector;
					selector = undefined;
				}
				for( type in types ){
					this.on(type, selector, data, types[type], one);
				}
				return this;
			}

			if( data == null && fn == null ){
				// ( types, fn )
				fn = selector;
				data = selector = undefined;
			} else if( fn == null ){
				if( typeof selector === "string" ){
					// ( types, selector, fn )
					fn = data;
					data = undefined;
				} else{
					// ( types, data, fn )
					fn = data;
					data = selector;
					selector = undefined;
				}
			}
			if( fn === false ){
				fn = returnFalse;
			} else if( !fn ){
				return this;
			}

			if( one === 1 ){
				origFn = fn;
				fn = function( event ){
					// Can use an empty set, since event contains the info
					jQuery().off(event);
					return origFn.apply(this, arguments);
				};
				// Use same guid so caller can remove using origFn
				fn.guid = origFn.guid || (origFn.guid = jQuery.guid++);
			}
			return this.each(function(){
				jQuery.event.add(this, types, fn, data, selector);
			});
		},
		one: function( types, selector, data, fn ){
			return this.on(types, selector, data, fn, 1);
		},
		off: function( types, selector, fn ){
			var handleObj, type;
			if( types && types.preventDefault && types.handleObj ){
				// ( event )  dispatched jQuery.Event
				handleObj = types.handleObj;
				jQuery(types.delegateTarget).off(handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType, handleObj.selector, handleObj.handler);
				return this;
			}
			if( typeof types === "object" ){
				// ( types-object [, selector] )
				for( type in types ){
					this.off(type, selector, types[type]);
				}
				return this;
			}
			if( selector === false || typeof selector === "function" ){
				// ( types [, fn] )
				fn = selector;
				selector = undefined;
			}
			if( fn === false ){
				fn = returnFalse;
			}
			return this.each(function(){
				jQuery.event.remove(this, types, fn, selector);
			});
		},

		bind: function( types, data, fn ){
			return this.on(types, null, data, fn);
		},
		unbind: function( types, fn ){
			return this.off(types, null, fn);
		},

		live: function( types, data, fn ){
			jQuery(this.context).on(types, this.selector, data, fn);
			return this;
		},
		die: function( types, fn ){
			jQuery(this.context).off(types, this.selector || "**", fn);
			return this;
		},

		delegate: function( selector, types, data, fn ){
			return this.on(types, selector, data, fn);
		},
		undelegate: function( selector, types, fn ){
			// ( namespace ) or ( selector, types [, fn] )
			return arguments.length === 1 ? this.off(selector, "**") : this.off(types, selector || "**", fn);
		},

		trigger: function( type, data ){
			return this.each(function(){
				jQuery.event.trigger(type, data, this);
			});
		},
		triggerHandler: function( type, data ){
			if( this[0] ){
				return jQuery.event.trigger(type, data, this[0], true);
			}
		},

		toggle: function( fn ){
			// Save reference to arguments for access in closure
			var args = arguments, guid = fn.guid || jQuery.guid++, i = 0, toggler = function( event ){
					// Figure out which function to execute
					var lastToggle = (jQuery._data(this, "lastToggle" + fn.guid) || 0) % i;
					jQuery._data(this, "lastToggle" + fn.guid, lastToggle + 1);

					// Make sure that clicks stop
					event.preventDefault();

					// and execute the function
					return args[lastToggle].apply(this, arguments) || false;
				};

			// link all the functions, so any of them can unbind this click handler
			toggler.guid = guid;
			while( i < args.length ){
				args[i++].guid = guid;
			}

			return this.click(toggler);
		},

		hover: function( fnOver, fnOut ){
			return this.mouseenter(fnOver).mouseleave(fnOut || fnOver);
		}
	});

	jQuery.each(("blur focus focusin focusout load resize scroll unload click dblclick " + "mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " + "change select submit keydown keypress keyup error contextmenu").split(" "), function( i, name ){

		// Handle event binding
		jQuery.fn[name] = function( data, fn ){
			if( fn == null ){
				fn = data;
				data = null;
			}

			return arguments.length > 0 ? this.on(name, null, data, fn) : this.trigger(name);
		};

		if( rkeyEvent.test(name) ){
			jQuery.event.fixHooks[name] = jQuery.event.keyHooks;
		}

		if( rmouseEvent.test(name) ){
			jQuery.event.fixHooks[name] = jQuery.event.mouseHooks;
		}
	});
	/*!
	 * Sizzle CSS Selector Engine
	 * Copyright 2012 jQuery Foundation and other contributors
	 * Released under the MIT license
	 * http://sizzlejs.com/
	 */
	(function( window, undefined ){

		var cachedruns, assertGetIdNotName, Expr, getText, isXML, contains, compile, sortOrder, hasDuplicate, outermostContext,

			baseHasDuplicate = true, strundefined = "undefined",

			expando = ("sizcache" + Math.random()).replace(".", ""),

			Token = String, document = window.document, docElem = document.documentElement, dirruns = 0, done = 0, pop = [].pop, push = [].push, slice = [].slice, // Use a stripped-down indexOf if a native one is unavailable
			indexOf = [].indexOf || function( elem ){
				var i = 0, len = this.length;
				for( ; i < len; i++ ){
					if( this[i] === elem ){
						return i;
					}
				}
				return -1;
			},

		// Augment a function for special use by Sizzle
			markFunction = function( fn, value ){
				fn[expando] = value == null || value;
				return fn;
			},

			createCache = function(){
				var cache = {}, keys = [];

				return markFunction(function( key, value ){
					// Only keep the most recent entries
					if( keys.push(key) > Expr.cacheLength ){
						delete cache[keys.shift()];
					}

					// Retrieve with (key + " ") to avoid collision with native Object.prototype properties (see Issue #157)
					return (cache[key + " "] = value);
				}, cache);
			},

			classCache = createCache(), tokenCache = createCache(), compilerCache = createCache(),

		// Regex

		// Whitespace characters http://www.w3.org/TR/css3-selectors/#whitespace
			whitespace = "[\\x20\\t\\r\\n\\f]", // http://www.w3.org/TR/css3-syntax/#characters
			characterEncoding = "(?:\\\\.|[-\\w]|[^\\x00-\\xa0])+",

		// Loosely modeled on CSS identifier characters
		// An unquoted value should be a CSS identifier (http://www.w3.org/TR/css3-selectors/#attribute-selectors)
		// Proper syntax: http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
			identifier = characterEncoding.replace("w", "w#"),

		// Acceptable operators http://www.w3.org/TR/selectors/#attribute-selectors
			operators = "([*^$|!~]?=)", attributes = "\\[" + whitespace + "*(" + characterEncoding + ")" + whitespace + "*(?:" + operators + whitespace + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + identifier + ")|)|)" + whitespace + "*\\]",

		// Prefer arguments not in parens/brackets,
		//   then attribute selectors and non-pseudos (denoted by :),
		//   then anything else
		// These preferences are here to reduce the number of selectors
		//   needing tokenize in the PSEUDO preFilter
			pseudos = ":(" + characterEncoding + ")(?:\\((?:(['\"])((?:\\\\.|[^\\\\])*?)\\2|([^()[\\]]*|(?:(?:" + attributes + ")|[^:]|\\\\.)*|.*))\\)|)",

		// For matchExpr.POS and matchExpr.needsContext
			pos = ":(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)",

		// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
			rtrim = new RegExp("^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g"),

			rcomma = new RegExp("^" + whitespace + "*," + whitespace + "*"), rcombinators = new RegExp("^" + whitespace + "*([\\x20\\t\\r\\n\\f>+~])" + whitespace + "*"), rpseudo = new RegExp(pseudos),

		// Easily-parseable/retrievable ID or TAG or CLASS selectors
			rquickExpr = /^(?:#([\w\-]+)|(\w+)|\.([\w\-]+))$/,

			rnot = /^:not/, rsibling = /[\x20\t\r\n\f]*[+~]/, rendsWithNot = /:not\($/,

			rheader = /h\d/i, rinputs = /input|select|textarea|button/i,

			rbackslash = /\\(?!\\)/g,

			matchExpr = {
				"ID": new RegExp("^#(" + characterEncoding + ")"),
				"CLASS": new RegExp("^\\.(" + characterEncoding + ")"),
				"NAME": new RegExp("^\\[name=['\"]?(" + characterEncoding + ")['\"]?\\]"),
				"TAG": new RegExp("^(" + characterEncoding.replace("w", "w*") + ")"),
				"ATTR": new RegExp("^" + attributes),
				"PSEUDO": new RegExp("^" + pseudos),
				"POS": new RegExp(pos, "i"),
				"CHILD": new RegExp("^:(only|nth|first|last)-child(?:\\(" + whitespace + "*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace + "*(\\d+)|))" + whitespace + "*\\)|)", "i"),
				// For use in libraries implementing .is()
				"needsContext": new RegExp("^" + whitespace + "*[>+~]|" + pos, "i")
			},

		// Support

		// Used for testing something on an element
			assert = function( fn ){
				var div = document.createElement("div");

				try {
					return fn(div);
				} catch( e ) {
					return false;
				} finally {
					// release memory in IE
					div = null;
				}
			},

		// Check if getElementsByTagName("*") returns only elements
			assertTagNameNoComments = assert(function( div ){
				div.appendChild(document.createComment(""));
				return !div.getElementsByTagName("*").length;
			}),

		// Check if getAttribute returns normalized href attributes
			assertHrefNotNormalized = assert(function( div ){
				div.innerHTML = "<a href='#'></a>";
				return div.firstChild && typeof div.firstChild.getAttribute !== strundefined && div.firstChild.getAttribute("href") === "#";
			}),

		// Check if attributes should be retrieved by attribute nodes
			assertAttributes = assert(function( div ){
				div.innerHTML = "<select></select>";
				var type = typeof div.lastChild.getAttribute("multiple");
				// IE8 returns a string for some attributes even when not present
				return type !== "boolean" && type !== "string";
			}),

		// Check if getElementsByClassName can be trusted
			assertUsableClassName = assert(function( div ){
				// Opera can't find a second classname (in 9.6)
				div.innerHTML = "<div class='hidden e'></div><div class='hidden'></div>";
				if( !div.getElementsByClassName || !div.getElementsByClassName("e").length ){
					return false;
				}

				// Safari 3.2 caches class attributes and doesn't catch changes
				div.lastChild.className = "e";
				return div.getElementsByClassName("e").length === 2;
			}),

		// Check if getElementById returns elements by name
		// Check if getElementsByName privileges form controls or returns elements by ID
			assertUsableName = assert(function( div ){
				// Inject content
				div.id = expando + 0;
				div.innerHTML = "<a name='" + expando + "'></a><div name='" + expando + "'></div>";
				docElem.insertBefore(div, docElem.firstChild);

				// Test
				var pass = document.getElementsByName && // buggy browsers will return fewer than the correct 2
					document.getElementsByName(expando).length === 2 + // buggy browsers will return more than the correct 0
						document.getElementsByName(expando + 0).length;
				assertGetIdNotName = !document.getElementById(expando);

				// Cleanup
				docElem.removeChild(div);

				return pass;
			});

		// If slice is not available, provide a backup
		try {
			slice.call(docElem.childNodes, 0)[0].nodeType;
		} catch( e ) {
			slice = function( i ){
				var elem, results = [];
				for( ; (elem = this[i]); i++ ){
					results.push(elem);
				}
				return results;
			};
		}

		function Sizzle( selector, context, results, seed ){
			results = results || [];
			context = context || document;
			var match, elem, xml, m, nodeType = context.nodeType;

			if( !selector || typeof selector !== "string" ){
				return results;
			}

			if( nodeType !== 1 && nodeType !== 9 ){
				return [];
			}

			xml = isXML(context);

			if( !xml && !seed ){
				if( (match = rquickExpr.exec(selector)) ){
					// Speed-up: Sizzle("#ID")
					if( (m = match[1]) ){
						if( nodeType === 9 ){
							elem = context.getElementById(m);
							// Check parentNode to catch when Blackberry 4.6 returns
							// nodes that are no longer in the document #6963
							if( elem && elem.parentNode ){
								// Handle the case where IE, Opera, and Webkit return items
								// by name instead of ID
								if( elem.id === m ){
									results.push(elem);
									return results;
								}
							} else{
								return results;
							}
						} else{
							// Context is not a document
							if( context.ownerDocument && (elem = context.ownerDocument.getElementById(m)) && contains(context, elem) && elem.id === m ){
								results.push(elem);
								return results;
							}
						}

						// Speed-up: Sizzle("TAG")
					} else if( match[2] ){
						push.apply(results, slice.call(context.getElementsByTagName(selector), 0));
						return results;

						// Speed-up: Sizzle(".CLASS")
					} else if( (m = match[3]) && assertUsableClassName && context.getElementsByClassName ){
						push.apply(results, slice.call(context.getElementsByClassName(m), 0));
						return results;
					}
				}
			}

			// All others
			return select(selector.replace(rtrim, "$1"), context, results, seed, xml);
		}

		Sizzle.matches = function( expr, elements ){
			return Sizzle(expr, null, null, elements);
		};

		Sizzle.matchesSelector = function( elem, expr ){
			return Sizzle(expr, null, null, [elem]).length > 0;
		};

		// Returns a function to use in pseudos for input types
		function createInputPseudo( type ){
			return function( elem ){
				var name = elem.nodeName.toLowerCase();
				return name === "input" && elem.type === type;
			};
		}

		// Returns a function to use in pseudos for buttons
		function createButtonPseudo( type ){
			return function( elem ){
				var name = elem.nodeName.toLowerCase();
				return (name === "input" || name === "button") && elem.type === type;
			};
		}

		// Returns a function to use in pseudos for positionals
		function createPositionalPseudo( fn ){
			return markFunction(function( argument ){
				argument = +argument;
				return markFunction(function( seed, matches ){
					var j, matchIndexes = fn([], seed.length, argument), i = matchIndexes.length;

					// Match elements found at the specified indexes
					while( i-- ){
						if( seed[(j = matchIndexes[i])] ){
							seed[j] = !(matches[j] = seed[j]);
						}
					}
				});
			});
		}

		/**
		 * Utility function for retrieving the text value of an array of DOM nodes
		 * @param {Array|Element} elem
		 */
		getText = Sizzle.getText = function( elem ){
			var node, ret = "", i = 0, nodeType = elem.nodeType;

			if( nodeType ){
				if( nodeType === 1 || nodeType === 9 || nodeType === 11 ){
					// Use textContent for elements
					// innerText usage removed for consistency of new lines (see #11153)
					if( typeof elem.textContent === "string" ){
						return elem.textContent;
					} else{
						// Traverse its children
						for( elem = elem.firstChild; elem; elem = elem.nextSibling ){
							ret += getText(elem);
						}
					}
				} else if( nodeType === 3 || nodeType === 4 ){
					return elem.nodeValue;
				}
				// Do not include comment or processing instruction nodes
			} else{

				// If no nodeType, this is expected to be an array
				for( ; (node = elem[i]); i++ ){
					// Do not traverse comment nodes
					ret += getText(node);
				}
			}
			return ret;
		};

		isXML = Sizzle.isXML = function( elem ){
			// documentElement is verified for cases where it doesn't yet exist
			// (such as loading iframes in IE - #4833)
			var documentElement = elem && (elem.ownerDocument || elem).documentElement;
			return documentElement ? documentElement.nodeName !== "HTML" : false;
		};

		// Element contains another
		contains = Sizzle.contains = docElem.contains ? function( a, b ){
			var adown = a.nodeType === 9 ? a.documentElement : a, bup = b && b.parentNode;
			return a === bup || !!(bup && bup.nodeType === 1 && adown.contains && adown.contains(bup));
		} : docElem.compareDocumentPosition ? function( a, b ){
			return b && !!(a.compareDocumentPosition(b) & 16);
		} : function( a, b ){
			while( (b = b.parentNode) ){
				if( b === a ){
					return true;
				}
			}
			return false;
		};

		Sizzle.attr = function( elem, name ){
			var val, xml = isXML(elem);

			if( !xml ){
				name = name.toLowerCase();
			}
			if( (val = Expr.attrHandle[name]) ){
				return val(elem);
			}
			if( xml || assertAttributes ){
				return elem.getAttribute(name);
			}
			val = elem.getAttributeNode(name);
			return val ? typeof elem[name] === "boolean" ? elem[name] ? name : null : val.specified ? val.value : null : null;
		};

		Expr = Sizzle.selectors = {

			// Can be adjusted by the user
			cacheLength: 50,

			createPseudo: markFunction,

			match: matchExpr,

			// IE6/7 return a modified href
			attrHandle: assertHrefNotNormalized ? {} : {
				"href": function( elem ){
					return elem.getAttribute("href", 2);
				},
				"type": function( elem ){
					return elem.getAttribute("type");
				}
			},

			find: {
				"ID": assertGetIdNotName ? function( id, context, xml ){
					if( typeof context.getElementById !== strundefined && !xml ){
						var m = context.getElementById(id);
						// Check parentNode to catch when Blackberry 4.6 returns
						// nodes that are no longer in the document #6963
						return m && m.parentNode ? [m] : [];
					}
				} : function( id, context, xml ){
					if( typeof context.getElementById !== strundefined && !xml ){
						var m = context.getElementById(id);

						return m ? m.id === id || typeof m.getAttributeNode !== strundefined && m.getAttributeNode("id").value === id ? [m] : undefined : [];
					}
				},

				"TAG": assertTagNameNoComments ? function( tag, context ){
					if( typeof context.getElementsByTagName !== strundefined ){
						return context.getElementsByTagName(tag);
					}
				} : function( tag, context ){
					var results = context.getElementsByTagName(tag);

					// Filter out possible comments
					if( tag === "*" ){
						var elem, tmp = [], i = 0;

						for( ; (elem = results[i]); i++ ){
							if( elem.nodeType === 1 ){
								tmp.push(elem);
							}
						}

						return tmp;
					}
					return results;
				},

				"NAME": assertUsableName && function( tag, context ){
					if( typeof context.getElementsByName !== strundefined ){
						return context.getElementsByName(name);
					}
				},

				"CLASS": assertUsableClassName && function( className, context, xml ){
					if( typeof context.getElementsByClassName !== strundefined && !xml ){
						return context.getElementsByClassName(className);
					}
				}
			},

			relative: {
				">": { dir: "parentNode", first: true },
				" ": { dir: "parentNode" },
				"+": { dir: "previousSibling", first: true },
				"~": { dir: "previousSibling" }
			},

			preFilter: {
				"ATTR": function( match ){
					match[1] = match[1].replace(rbackslash, "");

					// Move the given value to match[3] whether quoted or unquoted
					match[3] = (match[4] || match[5] || "").replace(rbackslash, "");

					if( match[2] === "~=" ){
						match[3] = " " + match[3] + " ";
					}

					return match.slice(0, 4);
				},

				"CHILD": function( match ){
					/* matches from matchExpr["CHILD"]
					 1 type (only|nth|...)
					 2 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
					 3 xn-component of xn+y argument ([+-]?\d*n|)
					 4 sign of xn-component
					 5 x of xn-component
					 6 sign of y-component
					 7 y of y-component
					 */
					match[1] = match[1].toLowerCase();

					if( match[1] === "nth" ){
						// nth-child requires argument
						if( !match[2] ){
							Sizzle.error(match[0]);
						}

						// numeric x and y parameters for Expr.filter.CHILD
						// remember that false/true cast respectively to 0/1
						match[3] = +(match[3] ? match[4] + (match[5] || 1) : 2 * (match[2] === "even" || match[2] === "odd"));
						match[4] = +((match[6] + match[7]) || match[2] === "odd");

						// other types prohibit arguments
					} else if( match[2] ){
						Sizzle.error(match[0]);
					}

					return match;
				},

				"PSEUDO": function( match ){
					var unquoted, excess;
					if( matchExpr["CHILD"].test(match[0]) ){
						return null;
					}

					if( match[3] ){
						match[2] = match[3];
					} else if( (unquoted = match[4]) ){
						// Only check arguments that contain a pseudo
						if( rpseudo.test(unquoted) && // Get excess from tokenize (recursively)
							(excess = tokenize(unquoted, true)) && // advance to the next closing parenthesis
							(excess = unquoted.indexOf(")", unquoted.length - excess) - unquoted.length) ){

							// excess is a negative index
							unquoted = unquoted.slice(0, excess);
							match[0] = match[0].slice(0, excess);
						}
						match[2] = unquoted;
					}

					// Return only captures needed by the pseudo filter method (type and argument)
					return match.slice(0, 3);
				}
			},

			filter: {
				"ID": assertGetIdNotName ? function( id ){
					id = id.replace(rbackslash, "");
					return function( elem ){
						return elem.getAttribute("id") === id;
					};
				} : function( id ){
					id = id.replace(rbackslash, "");
					return function( elem ){
						var node = typeof elem.getAttributeNode !== strundefined && elem.getAttributeNode("id");
						return node && node.value === id;
					};
				},

				"TAG": function( nodeName ){
					if( nodeName === "*" ){
						return function(){
							return true;
						};
					}
					nodeName = nodeName.replace(rbackslash, "").toLowerCase();

					return function( elem ){
						return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
					};
				},

				"CLASS": function( className ){
					var pattern = classCache[expando][className + " "];

					return pattern || (pattern = new RegExp("(^|" + whitespace + ")" + className + "(" + whitespace + "|$)")) && classCache(className, function( elem ){
						return pattern.test(elem.className || (typeof elem.getAttribute !== strundefined && elem.getAttribute("class")) || "");
					});
				},

				"ATTR": function( name, operator, check ){
					return function( elem, context ){
						var result = Sizzle.attr(elem, name);

						if( result == null ){
							return operator === "!=";
						}
						if( !operator ){
							return true;
						}

						result += "";

						return operator === "=" ? result === check : operator === "!=" ? result !== check : operator === "^=" ? check && result.indexOf(check) === 0 : operator === "*=" ? check && result.indexOf(check) > -1 : operator === "$=" ? check && result.substr(result.length - check.length) === check : operator === "~=" ? (" " + result + " ").indexOf(check) > -1 : operator === "|=" ? result === check || result.substr(0, check.length + 1) === check + "-" : false;
					};
				},

				"CHILD": function( type, argument, first, last ){

					if( type === "nth" ){
						return function( elem ){
							var node, diff, parent = elem.parentNode;

							if( first === 1 && last === 0 ){
								return true;
							}

							if( parent ){
								diff = 0;
								for( node = parent.firstChild; node; node = node.nextSibling ){
									if( node.nodeType === 1 ){
										diff++;
										if( elem === node ){
											break;
										}
									}
								}
							}

							// Incorporate the offset (or cast to NaN), then check against cycle size
							diff -= last;
							return diff === first || (diff % first === 0 && diff / first >= 0);
						};
					}

					return function( elem ){
						var node = elem;

						switch( type ){
							case "only":
							case "first":
								while( (node = node.previousSibling) ){
									if( node.nodeType === 1 ){
										return false;
									}
								}

								if( type === "first" ){
									return true;
								}

								node = elem;

							/* falls through */
							case "last":
								while( (node = node.nextSibling) ){
									if( node.nodeType === 1 ){
										return false;
									}
								}

								return true;
						}
					};
				},

				"PSEUDO": function( pseudo, argument ){
					// pseudo-class names are case-insensitive
					// http://www.w3.org/TR/selectors/#pseudo-classes
					// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
					// Remember that setFilters inherits from pseudos
					var args, fn = Expr.pseudos[pseudo] || Expr.setFilters[pseudo.toLowerCase()] || Sizzle.error("unsupported pseudo: " + pseudo);

					// The user may use createPseudo to indicate that
					// arguments are needed to create the filter function
					// just as Sizzle does
					if( fn[expando] ){
						return fn(argument);
					}

					// But maintain support for old signatures
					if( fn.length > 1 ){
						args = [pseudo, pseudo, "", argument];
						return Expr.setFilters.hasOwnProperty(pseudo.toLowerCase()) ? markFunction(function( seed, matches ){
							var idx, matched = fn(seed, argument), i = matched.length;
							while( i-- ){
								idx = indexOf.call(seed, matched[i]);
								seed[idx] = !(matches[idx] = matched[i]);
							}
						}) : function( elem ){
							return fn(elem, 0, args);
						};
					}

					return fn;
				}
			},

			pseudos: {
				"not": markFunction(function( selector ){
					// Trim the selector passed to compile
					// to avoid treating leading and trailing
					// spaces as combinators
					var input = [], results = [], matcher = compile(selector.replace(rtrim, "$1"));

					return matcher[expando] ? markFunction(function( seed, matches, context, xml ){
						var elem, unmatched = matcher(seed, null, xml, []), i = seed.length;

						// Match elements unmatched by `matcher`
						while( i-- ){
							if( (elem = unmatched[i]) ){
								seed[i] = !(matches[i] = elem);
							}
						}
					}) : function( elem, context, xml ){
						input[0] = elem;
						matcher(input, null, xml, results);
						return !results.pop();
					};
				}),

				"has": markFunction(function( selector ){
					return function( elem ){
						return Sizzle(selector, elem).length > 0;
					};
				}),

				"contains": markFunction(function( text ){
					return function( elem ){
						return (elem.textContent || elem.innerText || getText(elem)).indexOf(text) > -1;
					};
				}),

				"enabled": function( elem ){
					return elem.disabled === false;
				},

				"disabled": function( elem ){
					return elem.disabled === true;
				},

				"checked": function( elem ){
					// In CSS3, :checked should return both checked and selected elements
					// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
					var nodeName = elem.nodeName.toLowerCase();
					return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
				},

				"selected": function( elem ){
					// Accessing this property makes selected-by-default
					// options in Safari work properly
					if( elem.parentNode ){
						elem.parentNode.selectedIndex;
					}

					return elem.selected === true;
				},

				"parent": function( elem ){
					return !Expr.pseudos["empty"](elem);
				},

				"empty": function( elem ){
					// http://www.w3.org/TR/selectors/#empty-pseudo
					// :empty is only affected by element nodes and content nodes(including text(3), cdata(4)),
					//   not comment, processing instructions, or others
					// Thanks to Diego Perini for the nodeName shortcut
					//   Greater than "@" means alpha characters (specifically not starting with "#" or "?")
					var nodeType;
					elem = elem.firstChild;
					while( elem ){
						if( elem.nodeName > "@" || (nodeType = elem.nodeType) === 3 || nodeType === 4 ){
							return false;
						}
						elem = elem.nextSibling;
					}
					return true;
				},

				"header": function( elem ){
					return rheader.test(elem.nodeName);
				},

				"text": function( elem ){
					var type, attr;
					// IE6 and 7 will map elem.type to 'text' for new HTML5 types (search, etc)
					// use getAttribute instead to test this case
					return elem.nodeName.toLowerCase() === "input" && (type = elem.type) === "text" && ((attr = elem.getAttribute("type")) == null || attr.toLowerCase() === type);
				},

				// Input types
				"radio": createInputPseudo("radio"),
				"checkbox": createInputPseudo("checkbox"),
				"file": createInputPseudo("file"),
				"password": createInputPseudo("password"),
				"image": createInputPseudo("image"),

				"submit": createButtonPseudo("submit"),
				"reset": createButtonPseudo("reset"),

				"button": function( elem ){
					var name = elem.nodeName.toLowerCase();
					return name === "input" && elem.type === "button" || name === "button";
				},

				"input": function( elem ){
					return rinputs.test(elem.nodeName);
				},

				"focus": function( elem ){
					var doc = elem.ownerDocument;
					return elem === doc.activeElement && (!doc.hasFocus || doc.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
				},

				"active": function( elem ){
					return elem === elem.ownerDocument.activeElement;
				},

				// Positional types
				"first": createPositionalPseudo(function(){
					return [0];
				}),

				"last": createPositionalPseudo(function( matchIndexes, length ){
					return [length - 1];
				}),

				"eq": createPositionalPseudo(function( matchIndexes, length, argument ){
					return [argument < 0 ? argument + length : argument];
				}),

				"even": createPositionalPseudo(function( matchIndexes, length ){
					for( var i = 0; i < length; i += 2 ){
						matchIndexes.push(i);
					}
					return matchIndexes;
				}),

				"odd": createPositionalPseudo(function( matchIndexes, length ){
					for( var i = 1; i < length; i += 2 ){
						matchIndexes.push(i);
					}
					return matchIndexes;
				}),

				"lt": createPositionalPseudo(function( matchIndexes, length, argument ){
					for( var i = argument < 0 ? argument + length : argument; --i >= 0; ){
						matchIndexes.push(i);
					}
					return matchIndexes;
				}),

				"gt": createPositionalPseudo(function( matchIndexes, length, argument ){
					for( var i = argument < 0 ? argument + length : argument; ++i < length; ){
						matchIndexes.push(i);
					}
					return matchIndexes;
				})
			}
		};

		function siblingCheck( a, b, ret ){
			if( a === b ){
				return ret;
			}

			var cur = a.nextSibling;

			while( cur ){
				if( cur === b ){
					return -1;
				}

				cur = cur.nextSibling;
			}

			return 1;
		}

		sortOrder = docElem.compareDocumentPosition ? function( a, b ){
			if( a === b ){
				hasDuplicate = true;
				return 0;
			}

			return (!a.compareDocumentPosition || !b.compareDocumentPosition ? a.compareDocumentPosition : a.compareDocumentPosition(b) & 4
				) ? -1 : 1;
		} : function( a, b ){
			// The nodes are identical, we can exit early
			if( a === b ){
				hasDuplicate = true;
				return 0;

				// Fallback to using sourceIndex (in IE) if it's available on both nodes
			} else if( a.sourceIndex && b.sourceIndex ){
				return a.sourceIndex - b.sourceIndex;
			}

			var al, bl, ap = [], bp = [], aup = a.parentNode, bup = b.parentNode, cur = aup;

			// If the nodes are siblings (or identical) we can do a quick check
			if( aup === bup ){
				return siblingCheck(a, b);

				// If no parents were found then the nodes are disconnected
			} else if( !aup ){
				return -1;

			} else if( !bup ){
				return 1;
			}

			// Otherwise they're somewhere else in the tree so we need
			// to build up a full list of the parentNodes for comparison
			while( cur ){
				ap.unshift(cur);
				cur = cur.parentNode;
			}

			cur = bup;

			while( cur ){
				bp.unshift(cur);
				cur = cur.parentNode;
			}

			al = ap.length;
			bl = bp.length;

			// Start walking down the tree looking for a discrepancy
			for( var i = 0; i < al && i < bl; i++ ){
				if( ap[i] !== bp[i] ){
					return siblingCheck(ap[i], bp[i]);
				}
			}

			// We ended someplace up the tree so do a sibling check
			return i === al ? siblingCheck(a, bp[i], -1) : siblingCheck(ap[i], b, 1);
		};

		// Always assume the presence of duplicates if sort doesn't
		// pass them to our comparison function (as in Google Chrome).
		[0, 0].sort(sortOrder);
		baseHasDuplicate = !hasDuplicate;

		// Document sorting and removing duplicates
		Sizzle.uniqueSort = function( results ){
			var elem, duplicates = [], i = 1, j = 0;

			hasDuplicate = baseHasDuplicate;
			results.sort(sortOrder);

			if( hasDuplicate ){
				for( ; (elem = results[i]); i++ ){
					if( elem === results[i - 1] ){
						j = duplicates.push(i);
					}
				}
				while( j-- ){
					results.splice(duplicates[j], 1);
				}
			}

			return results;
		};

		Sizzle.error = function( msg ){
			throw new Error("Syntax error, unrecognized expression: " + msg);
		};

		function tokenize( selector, parseOnly ){
			var matched, match, tokens, type, soFar, groups, preFilters, cached = tokenCache[expando][selector + " "];

			if( cached ){
				return parseOnly ? 0 : cached.slice(0);
			}

			soFar = selector;
			groups = [];
			preFilters = Expr.preFilter;

			while( soFar ){

				// Comma and first run
				if( !matched || (match = rcomma.exec(soFar)) ){
					if( match ){
						// Don't consume trailing commas as valid
						soFar = soFar.slice(match[0].length) || soFar;
					}
					groups.push(tokens = []);
				}

				matched = false;

				// Combinators
				if( (match = rcombinators.exec(soFar)) ){
					tokens.push(matched = new Token(match.shift()));
					soFar = soFar.slice(matched.length);

					// Cast descendant combinators to space
					matched.type = match[0].replace(rtrim, " ");
				}

				// Filters
				for( type in Expr.filter ){
					if( (match = matchExpr[type].exec(soFar)) && (!preFilters[type] || (match = preFilters[type](match))) ){

						tokens.push(matched = new Token(match.shift()));
						soFar = soFar.slice(matched.length);
						matched.type = type;
						matched.matches = match;
					}
				}

				if( !matched ){
					break;
				}
			}

			// Return the length of the invalid excess
			// if we're just parsing
			// Otherwise, throw an error or return tokens
			return parseOnly ? soFar.length : soFar ? Sizzle.error(selector) : // Cache the tokens
				tokenCache(selector, groups).slice(0);
		}

		function addCombinator( matcher, combinator, base ){
			var dir = combinator.dir, checkNonElements = base && combinator.dir === "parentNode", doneName = done++;

			return combinator.first ? // Check against closest ancestor/preceding element
				function( elem, context, xml ){
					while( (elem = elem[dir]) ){
						if( checkNonElements || elem.nodeType === 1 ){
							return matcher(elem, context, xml);
						}
					}
				} :

				// Check against all ancestor/preceding elements
				function( elem, context, xml ){
					// We can't set arbitrary data on XML nodes, so they don't benefit from dir caching
					if( !xml ){
						var cache, dirkey = dirruns + " " + doneName + " ", cachedkey = dirkey + cachedruns;
						while( (elem = elem[dir]) ){
							if( checkNonElements || elem.nodeType === 1 ){
								if( (cache = elem[expando]) === cachedkey ){
									return elem.sizset;
								} else if( typeof cache === "string" && cache.indexOf(dirkey) === 0 ){
									if( elem.sizset ){
										return elem;
									}
								} else{
									elem[expando] = cachedkey;
									if( matcher(elem, context, xml) ){
										elem.sizset = true;
										return elem;
									}
									elem.sizset = false;
								}
							}
						}
					} else{
						while( (elem = elem[dir]) ){
							if( checkNonElements || elem.nodeType === 1 ){
								if( matcher(elem, context, xml) ){
									return elem;
								}
							}
						}
					}
				};
		}

		function elementMatcher( matchers ){
			return matchers.length > 1 ? function( elem, context, xml ){
				var i = matchers.length;
				while( i-- ){
					if( !matchers[i](elem, context, xml) ){
						return false;
					}
				}
				return true;
			} : matchers[0];
		}

		function condense( unmatched, map, filter, context, xml ){
			var elem, newUnmatched = [], i = 0, len = unmatched.length, mapped = map != null;

			for( ; i < len; i++ ){
				if( (elem = unmatched[i]) ){
					if( !filter || filter(elem, context, xml) ){
						newUnmatched.push(elem);
						if( mapped ){
							map.push(i);
						}
					}
				}
			}

			return newUnmatched;
		}

		function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ){
			if( postFilter && !postFilter[expando] ){
				postFilter = setMatcher(postFilter);
			}
			if( postFinder && !postFinder[expando] ){
				postFinder = setMatcher(postFinder, postSelector);
			}
			return markFunction(function( seed, results, context, xml ){
				var temp, i, elem, preMap = [], postMap = [], preexisting = results.length,

				// Get initial elements from seed or context
					elems = seed || multipleContexts(selector || "*", context.nodeType ? [context] : context, []),

				// Prefilter to get matcher input, preserving a map for seed-results synchronization
					matcherIn = preFilter && (seed || !selector) ? condense(elems, preMap, preFilter, context, xml) : elems,

					matcherOut = matcher ? // If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
						postFinder || (seed ? preFilter : preexisting || postFilter) ?

							// ...intermediate processing is necessary
							[] :

							// ...otherwise use results directly
							results : matcherIn;

				// Find primary matches
				if( matcher ){
					matcher(matcherIn, matcherOut, context, xml);
				}

				// Apply postFilter
				if( postFilter ){
					temp = condense(matcherOut, postMap);
					postFilter(temp, [], context, xml);

					// Un-match failing elements by moving them back to matcherIn
					i = temp.length;
					while( i-- ){
						if( (elem = temp[i]) ){
							matcherOut[postMap[i]] = !(matcherIn[postMap[i]] = elem);
						}
					}
				}

				if( seed ){
					if( postFinder || preFilter ){
						if( postFinder ){
							// Get the final matcherOut by condensing this intermediate into postFinder contexts
							temp = [];
							i = matcherOut.length;
							while( i-- ){
								if( (elem = matcherOut[i]) ){
									// Restore matcherIn since elem is not yet a final match
									temp.push((matcherIn[i] = elem));
								}
							}
							postFinder(null, (matcherOut = []), temp, xml);
						}

						// Move matched elements from seed to results to keep them synchronized
						i = matcherOut.length;
						while( i-- ){
							if( (elem = matcherOut[i]) && (temp = postFinder ? indexOf.call(seed, elem) : preMap[i]) > -1 ){

								seed[temp] = !(results[temp] = elem);
							}
						}
					}

					// Add elements to results, through postFinder if defined
				} else{
					matcherOut = condense(matcherOut === results ? matcherOut.splice(preexisting, matcherOut.length) : matcherOut);
					if( postFinder ){
						postFinder(null, results, matcherOut, xml);
					} else{
						push.apply(results, matcherOut);
					}
				}
			});
		}

		function matcherFromTokens( tokens ){
			var checkContext, matcher, j, len = tokens.length, leadingRelative = Expr.relative[tokens[0].type], implicitRelative = leadingRelative || Expr.relative[" "], i = leadingRelative ? 1 : 0,

			// The foundational matcher ensures that elements are reachable from top-level context(s)
				matchContext = addCombinator(function( elem ){
					return elem === checkContext;
				}, implicitRelative, true), matchAnyContext = addCombinator(function( elem ){
					return indexOf.call(checkContext, elem) > -1;
				}, implicitRelative, true), matchers = [function( elem, context, xml ){
					return (!leadingRelative && (xml || context !== outermostContext)) || (
						(checkContext = context).nodeType ? matchContext(elem, context, xml) : matchAnyContext(elem, context, xml));
				}];

			for( ; i < len; i++ ){
				if( (matcher = Expr.relative[tokens[i].type]) ){
					matchers = [addCombinator(elementMatcher(matchers), matcher)];
				} else{
					matcher = Expr.filter[tokens[i].type].apply(null, tokens[i].matches);

					// Return special upon seeing a positional matcher
					if( matcher[expando] ){
						// Find the next relative operator (if any) for proper handling
						j = ++i;
						for( ; j < len; j++ ){
							if( Expr.relative[tokens[j].type] ){
								break;
							}
						}
						return setMatcher(i > 1 && elementMatcher(matchers), i > 1 && tokens.slice(0, i - 1).join("").replace(rtrim, "$1"), matcher, i < j && matcherFromTokens(tokens.slice(i, j)), j < len && matcherFromTokens((tokens = tokens.slice(j))), j < len && tokens.join(""));
					}
					matchers.push(matcher);
				}
			}

			return elementMatcher(matchers);
		}

		function matcherFromGroupMatchers( elementMatchers, setMatchers ){
			var bySet = setMatchers.length > 0, byElement = elementMatchers.length > 0, superMatcher = function( seed, context, xml, results, expandContext ){
					var elem, j, matcher, setMatched = [], matchedCount = 0, i = "0", unmatched = seed && [], outermost = expandContext != null, contextBackup = outermostContext, // We must always have either seed elements or context
						elems = seed || byElement && Expr.find["TAG"]("*", expandContext && context.parentNode || context), // Nested matchers should use non-integer dirruns
						dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.E);

					if( outermost ){
						outermostContext = context !== document && context;
						cachedruns = superMatcher.el;
					}

					// Add elements passing elementMatchers directly to results
					for( ; (elem = elems[i]) != null; i++ ){
						if( byElement && elem ){
							for( j = 0; (matcher = elementMatchers[j]); j++ ){
								if( matcher(elem, context, xml) ){
									results.push(elem);
									break;
								}
							}
							if( outermost ){
								dirruns = dirrunsUnique;
								cachedruns = ++superMatcher.el;
							}
						}

						// Track unmatched elements for set filters
						if( bySet ){
							// They will have gone through all possible matchers
							if( (elem = !matcher && elem) ){
								matchedCount--;
							}

							// Lengthen the array for every element, matched or not
							if( seed ){
								unmatched.push(elem);
							}
						}
					}

					// Apply set filters to unmatched elements
					matchedCount += i;
					if( bySet && i !== matchedCount ){
						for( j = 0; (matcher = setMatchers[j]); j++ ){
							matcher(unmatched, setMatched, context, xml);
						}

						if( seed ){
							// Reintegrate element matches to eliminate the need for sorting
							if( matchedCount > 0 ){
								while( i-- ){
									if( !(unmatched[i] || setMatched[i]) ){
										setMatched[i] = pop.call(results);
									}
								}
							}

							// Discard index placeholder values to get only actual matches
							setMatched = condense(setMatched);
						}

						// Add matches to results
						push.apply(results, setMatched);

						// Seedless set matches succeeding multiple successful matchers stipulate sorting
						if( outermost && !seed && setMatched.length > 0 && (matchedCount + setMatchers.length) > 1 ){

							Sizzle.uniqueSort(results);
						}
					}

					// Override manipulation of globals by nested matchers
					if( outermost ){
						dirruns = dirrunsUnique;
						outermostContext = contextBackup;
					}

					return unmatched;
				};

			superMatcher.el = 0;
			return bySet ? markFunction(superMatcher) : superMatcher;
		}

		compile = Sizzle.compile = function( selector, group /* Internal Use Only */ ){
			var i, setMatchers = [], elementMatchers = [], cached = compilerCache[expando][selector + " "];

			if( !cached ){
				// Generate a function of recursive functions that can be used to check each element
				if( !group ){
					group = tokenize(selector);
				}
				i = group.length;
				while( i-- ){
					cached = matcherFromTokens(group[i]);
					if( cached[expando] ){
						setMatchers.push(cached);
					} else{
						elementMatchers.push(cached);
					}
				}

				// Cache the compiled function
				cached = compilerCache(selector, matcherFromGroupMatchers(elementMatchers, setMatchers));
			}
			return cached;
		};

		function multipleContexts( selector, contexts, results ){
			var i = 0, len = contexts.length;
			for( ; i < len; i++ ){
				Sizzle(selector, contexts[i], results);
			}
			return results;
		}

		function select( selector, context, results, seed, xml ){
			var i, tokens, token, type, find, match = tokenize(selector), j = match.length;

			if( !seed ){
				// Try to minimize operations if there is only one group
				if( match.length === 1 ){

					// Take a shortcut and set the context if the root selector is an ID
					tokens = match[0] = match[0].slice(0);
					if( tokens.length > 2 && (token = tokens[0]).type === "ID" && context.nodeType === 9 && !xml && Expr.relative[tokens[1].type] ){

						context = Expr.find["ID"](token.matches[0].replace(rbackslash, ""), context, xml)[0];
						if( !context ){
							return results;
						}

						selector = selector.slice(tokens.shift().length);
					}

					// Fetch a seed set for right-to-left matching
					for( i = matchExpr["POS"].test(selector) ? -1 : tokens.length - 1; i >= 0; i-- ){
						token = tokens[i];

						// Abort if we hit a combinator
						if( Expr.relative[(type = token.type)] ){
							break;
						}
						if( (find = Expr.find[type]) ){
							// Search, expanding context for leading sibling combinators
							if( (seed = find(token.matches[0].replace(rbackslash, ""), rsibling.test(tokens[0].type) && context.parentNode || context, xml)) ){

								// If seed is empty or no tokens remain, we can return early
								tokens.splice(i, 1);
								selector = seed.length && tokens.join("");
								if( !selector ){
									push.apply(results, slice.call(seed, 0));
									return results;
								}

								break;
							}
						}
					}
				}
			}

			// Compile and execute a filtering function
			// Provide `match` to avoid retokenization if we modified the selector above
			compile(selector, match)(seed, context, xml, results, rsibling.test(selector));
			return results;
		}

		if( document.querySelectorAll ){
			(function(){
				var disconnectedMatch, oldSelect = select, rescape = /'|\\/g, rattributeQuotes = /\=[\x20\t\r\n\f]*([^'"\]]*)[\x20\t\r\n\f]*\]/g,

				// qSa(:focus) reports false when true (Chrome 21), no need to also add to buggyMatches since matches checks buggyQSA
				// A support test would require too much code (would include document ready)
					rbuggyQSA = [":focus"],

				// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
				// A support test would require too much code (would include document ready)
				// just skip matchesSelector for :active
					rbuggyMatches = [":active"], matches = docElem.matchesSelector || docElem.mozMatchesSelector || docElem.webkitMatchesSelector || docElem.oMatchesSelector || docElem.msMatchesSelector;

				// Build QSA regex
				// Regex strategy adopted from Diego Perini
				assert(function( div ){
					// Select is set to empty string on purpose
					// This is to test IE's treatment of not explictly
					// setting a boolean content attribute,
					// since its presence should be enough
					// http://bugs.jquery.com/ticket/12359
					div.innerHTML = "<select><option selected=''></option></select>";

					// IE8 - Some boolean attributes are not treated correctly
					if( !div.querySelectorAll("[selected]").length ){
						rbuggyQSA.push("\\[" + whitespace + "*(?:checked|disabled|ismap|multiple|readonly|selected|value)");
					}

					// Webkit/Opera - :checked should return selected option elements
					// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
					// IE8 throws error here (do not put tests after this one)
					if( !div.querySelectorAll(":checked").length ){
						rbuggyQSA.push(":checked");
					}
				});

				assert(function( div ){

					// Opera 10-12/IE9 - ^= $= *= and empty values
					// Should not select anything
					div.innerHTML = "<p test=''></p>";
					if( div.querySelectorAll("[test^='']").length ){
						rbuggyQSA.push("[*^$]=" + whitespace + "*(?:\"\"|'')");
					}

					// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
					// IE8 throws error here (do not put tests after this one)
					div.innerHTML = "<input type='hidden'/>";
					if( !div.querySelectorAll(":enabled").length ){
						rbuggyQSA.push(":enabled", ":disabled");
					}
				});

				// rbuggyQSA always contains :focus, so no need for a length check
				rbuggyQSA = /* rbuggyQSA.length && */ new RegExp(rbuggyQSA.join("|"));

				select = function( selector, context, results, seed, xml ){
					// Only use querySelectorAll when not filtering,
					// when this is not xml,
					// and when no QSA bugs apply
					if( !seed && !xml && !rbuggyQSA.test(selector) ){
						var groups, i, old = true, nid = expando, newContext = context, newSelector = context.nodeType === 9 && selector;

						// qSA works strangely on Element-rooted queries
						// We can work around this by specifying an extra ID on the root
						// and working up from there (Thanks to Andrew Dupont for the technique)
						// IE 8 doesn't work on object elements
						if( context.nodeType === 1 && context.nodeName.toLowerCase() !== "object" ){
							groups = tokenize(selector);

							if( (old = context.getAttribute("id")) ){
								nid = old.replace(rescape, "\\$&");
							} else{
								context.setAttribute("id", nid);
							}
							nid = "[id='" + nid + "'] ";

							i = groups.length;
							while( i-- ){
								groups[i] = nid + groups[i].join("");
							}
							newContext = rsibling.test(selector) && context.parentNode || context;
							newSelector = groups.join(",");
						}

						if( newSelector ){
							try {
								push.apply(results, slice.call(newContext.querySelectorAll(newSelector), 0));
								return results;
							} catch( qsaError ) {
							} finally {
								if( !old ){
									context.removeAttribute("id");
								}
							}
						}
					}

					return oldSelect(selector, context, results, seed, xml);
				};

				if( matches ){
					assert(function( div ){
						// Check to see if it's possible to do matchesSelector
						// on a disconnected node (IE 9)
						disconnectedMatch = matches.call(div, "div");

						// This should fail with an exception
						// Gecko does not error, returns false instead
						try {
							matches.call(div, "[test!='']:sizzle");
							rbuggyMatches.push("!=", pseudos);
						} catch( e ) {
						}
					});

					// rbuggyMatches always contains :active and :focus, so no need for a length check
					rbuggyMatches = /* rbuggyMatches.length && */ new RegExp(rbuggyMatches.join("|"));

					Sizzle.matchesSelector = function( elem, expr ){
						// Make sure that attribute selectors are quoted
						expr = expr.replace(rattributeQuotes, "='$1']");

						// rbuggyMatches always contains :active, so no need for an existence check
						if( !isXML(elem) && !rbuggyMatches.test(expr) && !rbuggyQSA.test(expr) ){
							try {
								var ret = matches.call(elem, expr);

								// IE 9's matchesSelector returns false on disconnected nodes
								if( ret || disconnectedMatch || // As well, disconnected nodes are said to be in a document
									// fragment in IE 9
									elem.document && elem.document.nodeType !== 11 ){
									return ret;
								}
							} catch( e ) {
							}
						}

						return Sizzle(expr, null, null, [elem]).length > 0;
					};
				}
			})();
		}

		// Deprecated
		Expr.pseudos["nth"] = Expr.pseudos["eq"];

		// Back-compat
		function setFilters(){
		}

		Expr.filters = setFilters.prototype = Expr.pseudos;
		Expr.setFilters = new setFilters();

		// Override sizzle attribute retrieval
		Sizzle.attr = jQuery.attr;
		jQuery.find = Sizzle;
		jQuery.expr = Sizzle.selectors;
		jQuery.expr[":"] = jQuery.expr.pseudos;
		jQuery.unique = Sizzle.uniqueSort;
		jQuery.text = Sizzle.getText;
		jQuery.isXMLDoc = Sizzle.isXML;
		jQuery.contains = Sizzle.contains;


	})(window);
	var runtil = /Until$/, rparentsprev = /^(?:parents|prev(?:Until|All))/, isSimple = /^.[^:#\[\.,]*$/, rneedsContext = jQuery.expr.match.needsContext, // methods guaranteed to produce a unique set when starting from a unique set
		guaranteedUnique = {
			children: true,
			contents: true,
			next: true,
			prev: true
		};

	jQuery.fn.extend({
		find: function( selector ){
			var i, l, length, n, r, ret, self = this;

			if( typeof selector !== "string" ){
				return jQuery(selector).filter(function(){
					for( i = 0, l = self.length; i < l; i++ ){
						if( jQuery.contains(self[i], this) ){
							return true;
						}
					}
				});
			}

			ret = this.pushStack("", "find", selector);

			for( i = 0, l = this.length; i < l; i++ ){
				length = ret.length;
				jQuery.find(selector, this[i], ret);

				if( i > 0 ){
					// Make sure that the results are unique
					for( n = length; n < ret.length; n++ ){
						for( r = 0; r < length; r++ ){
							if( ret[r] === ret[n] ){
								ret.splice(n--, 1);
								break;
							}
						}
					}
				}
			}

			return ret;
		},

		has: function( target ){
			var i, targets = jQuery(target, this), len = targets.length;

			return this.filter(function(){
				for( i = 0; i < len; i++ ){
					if( jQuery.contains(this, targets[i]) ){
						return true;
					}
				}
			});
		},

		not: function( selector ){
			return this.pushStack(winnow(this, selector, false), "not", selector);
		},

		filter: function( selector ){
			return this.pushStack(winnow(this, selector, true), "filter", selector);
		},

		is: function( selector ){
			return !!selector && (
				typeof selector === "string" ? // If this is a positional/relative selector, check membership in the returned set
					// so $("p:first").is("p:last") won't return true for a doc with two "p".
					rneedsContext.test(selector) ? jQuery(selector, this.context).index(this[0]) >= 0 : jQuery.filter(selector, this).length > 0 : this.filter(selector).length > 0);
		},

		closest: function( selectors, context ){
			var cur, i = 0, l = this.length, ret = [], pos = rneedsContext.test(selectors) || typeof selectors !== "string" ? jQuery(selectors, context || this.context) : 0;

			for( ; i < l; i++ ){
				cur = this[i];

				while( cur && cur.ownerDocument && cur !== context && cur.nodeType !== 11 ){
					if( pos ? pos.index(cur) > -1 : jQuery.find.matchesSelector(cur, selectors) ){
						ret.push(cur);
						break;
					}
					cur = cur.parentNode;
				}
			}

			ret = ret.length > 1 ? jQuery.unique(ret) : ret;

			return this.pushStack(ret, "closest", selectors);
		},

		// Determine the position of an element within
		// the matched set of elements
		index: function( elem ){

			// No argument, return index in parent
			if( !elem ){
				return (this[0] && this[0].parentNode) ? this.prevAll().length : -1;
			}

			// index in selector
			if( typeof elem === "string" ){
				return jQuery.inArray(this[0], jQuery(elem));
			}

			// Locate the position of the desired element
			return jQuery.inArray(// If it receives a jQuery object, the first element is used
				elem.jquery ? elem[0] : elem, this);
		},

		add: function( selector, context ){
			var set = typeof selector === "string" ? jQuery(selector, context) : jQuery.makeArray(selector && selector.nodeType ? [selector] : selector), all = jQuery.merge(this.get(), set);

			return this.pushStack(isDisconnected(set[0]) || isDisconnected(all[0]) ? all : jQuery.unique(all));
		},

		addBack: function( selector ){
			return this.add(selector == null ? this.prevObject : this.prevObject.filter(selector));
		}
	});

	jQuery.fn.andSelf = jQuery.fn.addBack;

	// A painfully simple check to see if an element is disconnected
	// from a document (should be improved, where feasible).
	function isDisconnected( node ){
		return !node || !node.parentNode || node.parentNode.nodeType === 11;
	}

	function sibling( cur, dir ){
		do {
			cur = cur[dir];
		} while( cur && cur.nodeType !== 1 );

		return cur;
	}

	jQuery.each({
		parent: function( elem ){
			var parent = elem.parentNode;
			return parent && parent.nodeType !== 11 ? parent : null;
		},
		parents: function( elem ){
			return jQuery.dir(elem, "parentNode");
		},
		parentsUntil: function( elem, i, until ){
			return jQuery.dir(elem, "parentNode", until);
		},
		next: function( elem ){
			return sibling(elem, "nextSibling");
		},
		prev: function( elem ){
			return sibling(elem, "previousSibling");
		},
		nextAll: function( elem ){
			return jQuery.dir(elem, "nextSibling");
		},
		prevAll: function( elem ){
			return jQuery.dir(elem, "previousSibling");
		},
		nextUntil: function( elem, i, until ){
			return jQuery.dir(elem, "nextSibling", until);
		},
		prevUntil: function( elem, i, until ){
			return jQuery.dir(elem, "previousSibling", until);
		},
		siblings: function( elem ){
			return jQuery.sibling((elem.parentNode || {}).firstChild, elem);
		},
		children: function( elem ){
			return jQuery.sibling(elem.firstChild);
		},
		contents: function( elem ){
			return jQuery.nodeName(elem, "iframe") ? elem.contentDocument || elem.contentWindow.document : jQuery.merge([], elem.childNodes);
		}
	}, function( name, fn ){
		jQuery.fn[name] = function( until, selector ){
			var ret = jQuery.map(this, fn, until);

			if( !runtil.test(name) ){
				selector = until;
			}

			if( selector && typeof selector === "string" ){
				ret = jQuery.filter(selector, ret);
			}

			ret = this.length > 1 && !guaranteedUnique[name] ? jQuery.unique(ret) : ret;

			if( this.length > 1 && rparentsprev.test(name) ){
				ret = ret.reverse();
			}

			return this.pushStack(ret, name, core_slice.call(arguments).join(","));
		};
	});

	jQuery.extend({
		filter: function( expr, elems, not ){
			if( not ){
				expr = ":not(" + expr + ")";
			}

			return elems.length === 1 ? jQuery.find.matchesSelector(elems[0], expr) ? [elems[0]] : [] : jQuery.find.matches(expr, elems);
		},

		dir: function( elem, dir, until ){
			var matched = [], cur = elem[dir];

			while( cur && cur.nodeType !== 9 && (until === undefined || cur.nodeType !== 1 || !jQuery(cur).is(until)) ){
				if( cur.nodeType === 1 ){
					matched.push(cur);
				}
				cur = cur[dir];
			}
			return matched;
		},

		sibling: function( n, elem ){
			var r = [];

			for( ; n; n = n.nextSibling ){
				if( n.nodeType === 1 && n !== elem ){
					r.push(n);
				}
			}

			return r;
		}
	});

	// Implement the identical functionality for filter and not
	function winnow( elements, qualifier, keep ){

		// Can't pass null or undefined to indexOf in Firefox 4
		// Set to 0 to skip string check
		qualifier = qualifier || 0;

		if( jQuery.isFunction(qualifier) ){
			return jQuery.grep(elements, function( elem, i ){
				var retVal = !!qualifier.call(elem, i, elem);
				return retVal === keep;
			});

		} else if( qualifier.nodeType ){
			return jQuery.grep(elements, function( elem, i ){
				return (elem === qualifier) === keep;
			});

		} else if( typeof qualifier === "string" ){
			var filtered = jQuery.grep(elements, function( elem ){
				return elem.nodeType === 1;
			});

			if( isSimple.test(qualifier) ){
				return jQuery.filter(qualifier, filtered, !keep);
			} else{
				qualifier = jQuery.filter(qualifier, filtered);
			}
		}

		return jQuery.grep(elements, function( elem, i ){
			return (jQuery.inArray(elem, qualifier) >= 0) === keep;
		});
	}

	function createSafeFragment( document ){
		var list = nodeNames.split("|"), safeFrag = document.createDocumentFragment();

		if( safeFrag.createElement ){
			while( list.length ){
				safeFrag.createElement(list.pop());
			}
		}
		return safeFrag;
	}

	var nodeNames = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|" + "header|hgroup|mark|meter|nav|output|progress|section|summary|time|video", rinlinejQuery = / jQuery\d+="(?:null|\d+)"/g, rleadingWhitespace = /^\s+/, rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi, rtagName = /<([\w:]+)/, rtbody = /<tbody/i, rhtml = /<|&#?\w+;/, rnoInnerhtml = /<(?:script|style|link)/i, rnocache = /<(?:script|object|embed|option|style)/i, rnoshimcache = new RegExp("<(?:" + nodeNames + ")[\\s/>]", "i"), rcheckableType = /^(?:checkbox|radio)$/, // checked="checked" or checked
		rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i, rscriptType = /\/(java|ecma)script/i, rcleanScript = /^\s*<!(?:\[CDATA\[|\-\-)|[\]\-]{2}>\s*$/g, wrapMap = {
			option: [1, "<select multiple='multiple'>", "</select>"],
			legend: [1, "<fieldset>", "</fieldset>"],
			thead: [1, "<table>", "</table>"],
			tr: [2, "<table><tbody>", "</tbody></table>"],
			td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
			col: [2, "<table><tbody></tbody><colgroup>", "</colgroup></table>"],
			area: [1, "<map>", "</map>"],
			_default: [0, "", ""]
		}, safeFragment = createSafeFragment(document), fragmentDiv = safeFragment.appendChild(document.createElement("div"));

	wrapMap.optgroup = wrapMap.option;
	wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
	wrapMap.th = wrapMap.td;

	// IE6-8 can't serialize link, script, style, or any html5 (NoScope) tags,
	// unless wrapped in a div with non-breaking characters in front of it.
	if( !jQuery.support.htmlSerialize ){
		wrapMap._default = [1, "X<div>", "</div>"];
	}

	jQuery.fn.extend({
		text: function( value ){
			return jQuery.access(this, function( value ){
				return value === undefined ? jQuery.text(this) : this.empty().append((this[0] && this[0].ownerDocument || document).createTextNode(value));
			}, null, value, arguments.length);
		},

		wrapAll: function( html ){
			if( jQuery.isFunction(html) ){
				return this.each(function( i ){
					jQuery(this).wrapAll(html.call(this, i));
				});
			}

			if( this[0] ){
				// The elements to wrap the target around
				var wrap = jQuery(html, this[0].ownerDocument).eq(0).clone(true);

				if( this[0].parentNode ){
					wrap.insertBefore(this[0]);
				}

				wrap.map(function(){
					var elem = this;

					while( elem.firstChild && elem.firstChild.nodeType === 1 ){
						elem = elem.firstChild;
					}

					return elem;
				}).append(this);
			}

			return this;
		},

		wrapInner: function( html ){
			if( jQuery.isFunction(html) ){
				return this.each(function( i ){
					jQuery(this).wrapInner(html.call(this, i));
				});
			}

			return this.each(function(){
				var self = jQuery(this), contents = self.contents();

				if( contents.length ){
					contents.wrapAll(html);

				} else{
					self.append(html);
				}
			});
		},

		wrap: function( html ){
			var isFunction = jQuery.isFunction(html);

			return this.each(function( i ){
				jQuery(this).wrapAll(isFunction ? html.call(this, i) : html);
			});
		},

		unwrap: function(){
			return this.parent().each(function(){
				if( !jQuery.nodeName(this, "body") ){
					jQuery(this).replaceWith(this.childNodes);
				}
			}).end();
		},

		append: function(){
			return this.domManip(arguments, true, function( elem ){
				if( this.nodeType === 1 || this.nodeType === 11 ){
					this.appendChild(elem);
				}
			});
		},

		prepend: function(){
			return this.domManip(arguments, true, function( elem ){
				if( this.nodeType === 1 || this.nodeType === 11 ){
					this.insertBefore(elem, this.firstChild);
				}
			});
		},

		before: function(){
			if( !isDisconnected(this[0]) ){
				return this.domManip(arguments, false, function( elem ){
					this.parentNode.insertBefore(elem, this);
				});
			}

			if( arguments.length ){
				var set = jQuery.clean(arguments);
				return this.pushStack(jQuery.merge(set, this), "before", this.selector);
			}
		},

		after: function(){
			if( !isDisconnected(this[0]) ){
				return this.domManip(arguments, false, function( elem ){
					this.parentNode.insertBefore(elem, this.nextSibling);
				});
			}

			if( arguments.length ){
				var set = jQuery.clean(arguments);
				return this.pushStack(jQuery.merge(this, set), "after", this.selector);
			}
		},

		// keepData is for internal use only--do not document
		remove: function( selector, keepData ){
			var elem, i = 0;

			for( ; (elem = this[i]) != null; i++ ){
				if( !selector || jQuery.filter(selector, [elem]).length ){
					if( !keepData && elem.nodeType === 1 ){
						jQuery.cleanData(elem.getElementsByTagName("*"));
						jQuery.cleanData([elem]);
					}

					if( elem.parentNode ){
						elem.parentNode.removeChild(elem);
					}
				}
			}

			return this;
		},

		empty: function(){
			var elem, i = 0;

			for( ; (elem = this[i]) != null; i++ ){
				// Remove element nodes and prevent memory leaks
				if( elem.nodeType === 1 ){
					jQuery.cleanData(elem.getElementsByTagName("*"));
				}

				// Remove any remaining nodes
				while( elem.firstChild ){
					elem.removeChild(elem.firstChild);
				}
			}

			return this;
		},

		clone: function( dataAndEvents, deepDataAndEvents ){
			dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
			deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

			return this.map(function(){
				return jQuery.clone(this, dataAndEvents, deepDataAndEvents);
			});
		},

		html: function( value ){
			return jQuery.access(this, function( value ){
				var elem = this[0] || {}, i = 0, l = this.length;

				if( value === undefined ){
					return elem.nodeType === 1 ? elem.innerHTML.replace(rinlinejQuery, "") : undefined;
				}

				// See if we can take a shortcut and just use innerHTML
				if( typeof value === "string" && !rnoInnerhtml.test(value) && (jQuery.support.htmlSerialize || !rnoshimcache.test(value)) && (jQuery.support.leadingWhitespace || !rleadingWhitespace.test(value)) && !wrapMap[(rtagName.exec(value) || ["", ""])[1].toLowerCase()] ){

					value = value.replace(rxhtmlTag, "<$1></$2>");

					try {
						for( ; i < l; i++ ){
							// Remove element nodes and prevent memory leaks
							elem = this[i] || {};
							if( elem.nodeType === 1 ){
								jQuery.cleanData(elem.getElementsByTagName("*"));
								elem.innerHTML = value;
							}
						}

						elem = 0;

						// If using innerHTML throws an exception, use the fallback method
					} catch( e ) {
					}
				}

				if( elem ){
					this.empty().append(value);
				}
			}, null, value, arguments.length);
		},

		replaceWith: function( value ){
			if( !isDisconnected(this[0]) ){
				// Make sure that the elements are removed from the DOM before they are inserted
				// this can help fix replacing a parent with child elements
				if( jQuery.isFunction(value) ){
					return this.each(function( i ){
						var self = jQuery(this), old = self.html();
						self.replaceWith(value.call(this, i, old));
					});
				}

				if( typeof value !== "string" ){
					value = jQuery(value).detach();
				}

				return this.each(function(){
					var next = this.nextSibling, parent = this.parentNode;

					jQuery(this).remove();

					if( next ){
						jQuery(next).before(value);
					} else{
						jQuery(parent).append(value);
					}
				});
			}

			return this.length ? this.pushStack(jQuery(jQuery.isFunction(value) ? value() : value), "replaceWith", value) : this;
		},

		detach: function( selector ){
			return this.remove(selector, true);
		},

		domManip: function( args, table, callback ){

			// Flatten any nested arrays
			args = [].concat.apply([], args);

			var results, first, fragment, iNoClone, i = 0, value = args[0], scripts = [], l = this.length;

			// We can't cloneNode fragments that contain checked, in WebKit
			if( !jQuery.support.checkClone && l > 1 && typeof value === "string" && rchecked.test(value) ){
				return this.each(function(){
					jQuery(this).domManip(args, table, callback);
				});
			}

			if( jQuery.isFunction(value) ){
				return this.each(function( i ){
					var self = jQuery(this);
					args[0] = value.call(this, i, table ? self.html() : undefined);
					self.domManip(args, table, callback);
				});
			}

			if( this[0] ){
				results = jQuery.buildFragment(args, this, scripts);
				fragment = results.fragment;
				first = fragment.firstChild;

				if( fragment.childNodes.length === 1 ){
					fragment = first;
				}

				if( first ){
					table = table && jQuery.nodeName(first, "tr");

					// Use the original fragment for the last item instead of the first because it can end up
					// being emptied incorrectly in certain situations (#8070).
					// Fragments from the fragment cache must always be cloned and never used in place.
					for( iNoClone = results.cacheable || l - 1; i < l; i++ ){
						callback.call(table && jQuery.nodeName(this[i], "table") ? findOrAppend(this[i], "tbody") : this[i], i === iNoClone ? fragment : jQuery.clone(fragment, true, true));
					}
				}

				// Fix #11809: Avoid leaking memory
				fragment = first = null;

				if( scripts.length ){
					jQuery.each(scripts, function( i, elem ){
						if( elem.src ){
							if( jQuery.ajax ){
								jQuery.ajax({
									url: elem.src,
									type: "GET",
									dataType: "script",
									async: false,
									global: false,
									"throws": true
								});
							} else{
								jQuery.error("no ajax");
							}
						} else{
							jQuery.globalEval((elem.text || elem.textContent || elem.innerHTML || "").replace(rcleanScript, ""));
						}

						if( elem.parentNode ){
							elem.parentNode.removeChild(elem);
						}
					});
				}
			}

			return this;
		}
	});

	function findOrAppend( elem, tag ){
		return elem.getElementsByTagName(tag)[0] || elem.appendChild(elem.ownerDocument.createElement(tag));
	}

	function cloneCopyEvent( src, dest ){

		if( dest.nodeType !== 1 || !jQuery.hasData(src) ){
			return;
		}

		var type, i, l, oldData = jQuery._data(src), curData = jQuery._data(dest, oldData), events = oldData.events;

		if( events ){
			delete curData.handle;
			curData.events = {};

			for( type in events ){
				for( i = 0, l = events[type].length; i < l; i++ ){
					jQuery.event.add(dest, type, events[type][i]);
				}
			}
		}

		// make the cloned public data object a copy from the original
		if( curData.data ){
			curData.data = jQuery.extend({}, curData.data);
		}
	}

	function cloneFixAttributes( src, dest ){
		var nodeName;

		// We do not need to do anything for non-Elements
		if( dest.nodeType !== 1 ){
			return;
		}

		// clearAttributes removes the attributes, which we don't want,
		// but also removes the attachEvent events, which we *do* want
		if( dest.clearAttributes ){
			dest.clearAttributes();
		}

		// mergeAttributes, in contrast, only merges back on the
		// original attributes, not the events
		if( dest.mergeAttributes ){
			dest.mergeAttributes(src);
		}

		nodeName = dest.nodeName.toLowerCase();

		if( nodeName === "object" ){
			// IE6-10 improperly clones children of object elements using classid.
			// IE10 throws NoModificationAllowedError if parent is null, #12132.
			if( dest.parentNode ){
				dest.outerHTML = src.outerHTML;
			}

			// This path appears unavoidable for IE9. When cloning an object
			// element in IE9, the outerHTML strategy above is not sufficient.
			// If the src has innerHTML and the destination does not,
			// copy the src.innerHTML into the dest.innerHTML. #10324
			if( jQuery.support.html5Clone && (src.innerHTML && !jQuery.trim(dest.innerHTML)) ){
				dest.innerHTML = src.innerHTML;
			}

		} else if( nodeName === "input" && rcheckableType.test(src.type) ){
			// IE6-8 fails to persist the checked state of a cloned checkbox
			// or radio button. Worse, IE6-7 fail to give the cloned element
			// a checked appearance if the defaultChecked value isn't also set

			dest.defaultChecked = dest.checked = src.checked;

			// IE6-7 get confused and end up setting the value of a cloned
			// checkbox/radio button to an empty string instead of "on"
			if( dest.value !== src.value ){
				dest.value = src.value;
			}

			// IE6-8 fails to return the selected option to the default selected
			// state when cloning options
		} else if( nodeName === "option" ){
			dest.selected = src.defaultSelected;

			// IE6-8 fails to set the defaultValue to the correct value when
			// cloning other types of input fields
		} else if( nodeName === "input" || nodeName === "textarea" ){
			dest.defaultValue = src.defaultValue;

			// IE blanks contents when cloning scripts
		} else if( nodeName === "script" && dest.text !== src.text ){
			dest.text = src.text;
		}

		// Event data gets referenced instead of copied if the expando
		// gets copied too
		dest.removeAttribute(jQuery.expando);
	}

	jQuery.buildFragment = function( args, context, scripts ){
		var fragment, cacheable, cachehit, first = args[0];

		// Set context from what may come in as undefined or a jQuery collection or a node
		// Updated to fix #12266 where accessing context[0] could throw an exception in IE9/10 &
		// also doubles as fix for #8950 where plain objects caused createDocumentFragment exception
		context = context || document;
		context = !context.nodeType && context[0] || context;
		context = context.ownerDocument || context;

		// Only cache "small" (1/2 KB) HTML strings that are associated with the main document
		// Cloning options loses the selected state, so don't cache them
		// IE 6 doesn't like it when you put <object> or <embed> elements in a fragment
		// Also, WebKit does not clone 'checked' attributes on cloneNode, so don't cache
		// Lastly, IE6,7,8 will not correctly reuse cached fragments that were created from unknown elems #10501
		if( args.length === 1 && typeof first === "string" && first.length < 512 && context === document && first.charAt(0) === "<" && !rnocache.test(first) && (jQuery.support.checkClone || !rchecked.test(first)) && (jQuery.support.html5Clone || !rnoshimcache.test(first)) ){

			// Mark cacheable and look for a hit
			cacheable = true;
			fragment = jQuery.fragments[first];
			cachehit = fragment !== undefined;
		}

		if( !fragment ){
			fragment = context.createDocumentFragment();
			jQuery.clean(args, context, fragment, scripts);

			// Update the cache, but only store false
			// unless this is a second parsing of the same content
			if( cacheable ){
				jQuery.fragments[first] = cachehit && fragment;
			}
		}

		return { fragment: fragment, cacheable: cacheable };
	};

	jQuery.fragments = {};

	jQuery.each({
		appendTo: "append",
		prependTo: "prepend",
		insertBefore: "before",
		insertAfter: "after",
		replaceAll: "replaceWith"
	}, function( name, original ){
		jQuery.fn[name] = function( selector ){
			var elems, i = 0, ret = [], insert = jQuery(selector), l = insert.length, parent = this.length === 1 && this[0].parentNode;

			if( (parent == null || parent && parent.nodeType === 11 && parent.childNodes.length === 1) && l === 1 ){
				insert[original](this[0]);
				return this;
			} else{
				for( ; i < l; i++ ){
					elems = (i > 0 ? this.clone(true) : this).get();
					jQuery(insert[i])[original](elems);
					ret = ret.concat(elems);
				}

				return this.pushStack(ret, name, insert.selector);
			}
		};
	});

	function getAll( elem ){
		if( typeof elem.getElementsByTagName !== "undefined" ){
			return elem.getElementsByTagName("*");

		} else if( typeof elem.querySelectorAll !== "undefined" ){
			return elem.querySelectorAll("*");

		} else{
			return [];
		}
	}

	// Used in clean, fixes the defaultChecked property
	function fixDefaultChecked( elem ){
		if( rcheckableType.test(elem.type) ){
			elem.defaultChecked = elem.checked;
		}
	}

	jQuery.extend({
		clone: function( elem, dataAndEvents, deepDataAndEvents ){
			var srcElements, destElements, i, clone;

			if( jQuery.support.html5Clone || jQuery.isXMLDoc(elem) || !rnoshimcache.test("<" + elem.nodeName + ">") ){
				clone = elem.cloneNode(true);

				// IE<=8 does not properly clone detached, unknown element nodes
			} else{
				fragmentDiv.innerHTML = elem.outerHTML;
				fragmentDiv.removeChild(clone = fragmentDiv.firstChild);
			}

			if( (!jQuery.support.noCloneEvent || !jQuery.support.noCloneChecked) && (elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem) ){
				// IE copies events bound via attachEvent when using cloneNode.
				// Calling detachEvent on the clone will also remove the events
				// from the original. In order to get around this, we use some
				// proprietary methods to clear the events. Thanks to MooTools
				// guys for this hotness.

				cloneFixAttributes(elem, clone);

				// Using Sizzle here is crazy slow, so we use getElementsByTagName instead
				srcElements = getAll(elem);
				destElements = getAll(clone);

				// Weird iteration because IE will replace the length property
				// with an element if you are cloning the body and one of the
				// elements on the page has a name or id of "length"
				for( i = 0; srcElements[i]; ++i ){
					// Ensure that the destination node is not null; Fixes #9587
					if( destElements[i] ){
						cloneFixAttributes(srcElements[i], destElements[i]);
					}
				}
			}

			// Copy the events from the original to the clone
			if( dataAndEvents ){
				cloneCopyEvent(elem, clone);

				if( deepDataAndEvents ){
					srcElements = getAll(elem);
					destElements = getAll(clone);

					for( i = 0; srcElements[i]; ++i ){
						cloneCopyEvent(srcElements[i], destElements[i]);
					}
				}
			}

			srcElements = destElements = null;

			// Return the cloned set
			return clone;
		},

		clean: function( elems, context, fragment, scripts ){
			var i, j, elem, tag, wrap, depth, div, hasBody, tbody, len, handleScript, jsTags, safe = context === document && safeFragment, ret = [];

			// Ensure that context is a document
			if( !context || typeof context.createDocumentFragment === "undefined" ){
				context = document;
			}

			// Use the already-created safe fragment if context permits
			for( i = 0; (elem = elems[i]) != null; i++ ){
				if( typeof elem === "number" ){
					elem += "";
				}

				if( !elem ){
					continue;
				}

				// Convert html string into DOM nodes
				if( typeof elem === "string" ){
					if( !rhtml.test(elem) ){
						elem = context.createTextNode(elem);
					} else{
						// Ensure a safe container in which to render the html
						safe = safe || createSafeFragment(context);
						div = context.createElement("div");
						safe.appendChild(div);

						// Fix "XHTML"-style tags in all browsers
						elem = elem.replace(rxhtmlTag, "<$1></$2>");

						// Go to html and back, then peel off extra wrappers
						tag = (rtagName.exec(elem) || ["", ""])[1].toLowerCase();
						wrap = wrapMap[tag] || wrapMap._default;
						depth = wrap[0];
						div.innerHTML = wrap[1] + elem + wrap[2];

						// Move to the right depth
						while( depth-- ){
							div = div.lastChild;
						}

						// Remove IE's autoinserted <tbody> from table fragments
						if( !jQuery.support.tbody ){

							// String was a <table>, *may* have spurious <tbody>
							hasBody = rtbody.test(elem);
							tbody = tag === "table" && !hasBody ? div.firstChild && div.firstChild.childNodes :

								// String was a bare <thead> or <tfoot>
								wrap[1] === "<table>" && !hasBody ? div.childNodes : [];

							for( j = tbody.length - 1; j >= 0; --j ){
								if( jQuery.nodeName(tbody[j], "tbody") && !tbody[j].childNodes.length ){
									tbody[j].parentNode.removeChild(tbody[j]);
								}
							}
						}

						// IE completely kills leading whitespace when innerHTML is used
						if( !jQuery.support.leadingWhitespace && rleadingWhitespace.test(elem) ){
							div.insertBefore(context.createTextNode(rleadingWhitespace.exec(elem)[0]), div.firstChild);
						}

						elem = div.childNodes;

						// Take out of fragment container (we need a fresh div each time)
						div.parentNode.removeChild(div);
					}
				}

				if( elem.nodeType ){
					ret.push(elem);
				} else{
					jQuery.merge(ret, elem);
				}
			}

			// Fix #11356: Clear elements from safeFragment
			if( div ){
				elem = div = safe = null;
			}

			// Reset defaultChecked for any radios and checkboxes
			// about to be appended to the DOM in IE 6/7 (#8060)
			if( !jQuery.support.appendChecked ){
				for( i = 0; (elem = ret[i]) != null; i++ ){
					if( jQuery.nodeName(elem, "input") ){
						fixDefaultChecked(elem);
					} else if( typeof elem.getElementsByTagName !== "undefined" ){
						jQuery.grep(elem.getElementsByTagName("input"), fixDefaultChecked);
					}
				}
			}

			// Append elements to a provided document fragment
			if( fragment ){
				// Special handling of each script element
				handleScript = function( elem ){
					// Check if we consider it executable
					if( !elem.type || rscriptType.test(elem.type) ){
						// Detach the script and store it in the scripts array (if provided) or the fragment
						// Return truthy to indicate that it has been handled
						return scripts ? scripts.push(elem.parentNode ? elem.parentNode.removeChild(elem) : elem) : fragment.appendChild(elem);
					}
				};

				for( i = 0; (elem = ret[i]) != null; i++ ){
					// Check if we're done after handling an executable script
					if( !(jQuery.nodeName(elem, "script") && handleScript(elem)) ){
						// Append to fragment and handle embedded scripts
						fragment.appendChild(elem);
						if( typeof elem.getElementsByTagName !== "undefined" ){
							// handleScript alters the DOM, so use jQuery.merge to ensure snapshot iteration
							jsTags = jQuery.grep(jQuery.merge([], elem.getElementsByTagName("script")), handleScript);

							// Splice the scripts into ret after their former ancestor and advance our index beyond them
							ret.splice.apply(ret, [i + 1, 0].concat(jsTags));
							i += jsTags.length;
						}
					}
				}
			}

			return ret;
		},

		cleanData: function( elems, /* internal */ acceptData ){
			var data, id, elem, type, i = 0, internalKey = jQuery.expando, cache = jQuery.cache, deleteExpando = jQuery.support.deleteExpando, special = jQuery.event.special;

			for( ; (elem = elems[i]) != null; i++ ){

				if( acceptData || jQuery.acceptData(elem) ){

					id = elem[internalKey];
					data = id && cache[id];

					if( data ){
						if( data.events ){
							for( type in data.events ){
								if( special[type] ){
									jQuery.event.remove(elem, type);

									// This is a shortcut to avoid jQuery.event.remove's overhead
								} else{
									jQuery.removeEvent(elem, type, data.handle);
								}
							}
						}

						// Remove cache only if it was not already removed by jQuery.event.remove
						if( cache[id] ){

							delete cache[id];

							// IE does not allow us to delete expando properties from nodes,
							// nor does it have a removeAttribute function on Document nodes;
							// we must handle all of these cases
							if( deleteExpando ){
								delete elem[internalKey];

							} else if( elem.removeAttribute ){
								elem.removeAttribute(internalKey);

							} else{
								elem[internalKey] = null;
							}

							jQuery.deletedIds.push(id);
						}
					}
				}
			}
		}
	});
	// Limit scope pollution from any deprecated API
	(function(){

		var matched, browser;

		// Use of jQuery.browser is frowned upon.
		// More details: http://api.jquery.com/jQuery.browser
		// jQuery.uaMatch maintained for back-compat
		jQuery.uaMatch = function( ua ){
			ua = ua.toLowerCase();

			var match = /(chrome)[ \/]([\w.]+)/.exec(ua) || /(webkit)[ \/]([\w.]+)/.exec(ua) || /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua) || /(msie) ([\w.]+)/.exec(ua) || ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua) || [];

			return {
				browser: match[1] || "",
				version: match[2] || "0"
			};
		};

		matched = jQuery.uaMatch(navigator.userAgent);
		browser = {};

		if( matched.browser ){
			browser[matched.browser] = true;
			browser.version = matched.version;
		}

		// Chrome is Webkit, but Webkit is also Safari.
		if( browser.chrome ){
			browser.webkit = true;
		} else if( browser.webkit ){
			browser.safari = true;
		}

		jQuery.browser = browser;

		jQuery.sub = function(){
			function jQuerySub( selector, context ){
				return new jQuerySub.fn.init(selector, context);
			}

			jQuery.extend(true, jQuerySub, this);
			jQuerySub.superclass = this;
			jQuerySub.fn = jQuerySub.prototype = this();
			jQuerySub.fn.constructor = jQuerySub;
			jQuerySub.sub = this.sub;
			jQuerySub.fn.init = function init( selector, context ){
				if( context && context instanceof jQuery && !(context instanceof jQuerySub) ){
					context = jQuerySub(context);
				}

				return jQuery.fn.init.call(this, selector, context, rootjQuerySub);
			};
			jQuerySub.fn.init.prototype = jQuerySub.fn;
			var rootjQuerySub = jQuerySub(document);
			return jQuerySub;
		};

	})();
	var curCSS, iframe, iframeDoc, ralpha = /alpha\([^)]*\)/i, ropacity = /opacity=([^)]*)/, rposition = /^(top|right|bottom|left)$/, // swappable if display is none or starts with table except "table", "table-cell", or "table-caption"
	// see here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
		rdisplayswap = /^(none|table(?!-c[ea]).+)/, rmargin = /^margin/, rnumsplit = new RegExp("^(" + core_pnum + ")(.*)$", "i"), rnumnonpx = new RegExp("^(" + core_pnum + ")(?!px)[a-z%]+$", "i"), rrelNum = new RegExp("^([-+])=(" + core_pnum + ")", "i"), elemdisplay = { BODY: "block" },

		cssShow = { position: "absolute", visibility: "hidden", display: "block" }, cssNormalTransform = {
			letterSpacing: 0,
			fontWeight: 400
		},

		cssExpand = ["Top", "Right", "Bottom", "Left"], cssPrefixes = ["Webkit", "O", "Moz", "ms"],

		eventsToggle = jQuery.fn.toggle;

	// return a css property mapped to a potentially vendor prefixed property
	function vendorPropName( style, name ){

		// shortcut for names that are not vendor prefixed
		if( name in style ){
			return name;
		}

		// check for vendor prefixed names
		var capName = name.charAt(0).toUpperCase() + name.slice(1), origName = name, i = cssPrefixes.length;

		while( i-- ){
			name = cssPrefixes[i] + capName;
			if( name in style ){
				return name;
			}
		}

		return origName;
	}

	function isHidden( elem, el ){
		elem = el || elem;
		return jQuery.css(elem, "display") === "none" || !jQuery.contains(elem.ownerDocument, elem);
	}

	function showHide( elements, show ){
		var elem, display, values = [], index = 0, length = elements.length;

		for( ; index < length; index++ ){
			elem = elements[index];
			if( !elem.style ){
				continue;
			}
			values[index] = jQuery._data(elem, "olddisplay");
			if( show ){
				// Reset the inline display of this element to learn if it is
				// being hidden by cascaded rules or not
				if( !values[index] && elem.style.display === "none" ){
					elem.style.display = "";
				}

				// Set elements which have been overridden with display: none
				// in a stylesheet to whatever the default browser style is
				// for such an element
				if( elem.style.display === "" && isHidden(elem) ){
					values[index] = jQuery._data(elem, "olddisplay", css_defaultDisplay(elem.nodeName));
				}
			} else{
				display = curCSS(elem, "display");

				if( !values[index] && display !== "none" ){
					jQuery._data(elem, "olddisplay", display);
				}
			}
		}

		// Set the display of most of the elements in a second loop
		// to avoid the constant reflow
		for( index = 0; index < length; index++ ){
			elem = elements[index];
			if( !elem.style ){
				continue;
			}
			if( !show || elem.style.display === "none" || elem.style.display === "" ){
				elem.style.display = show ? values[index] || "" : "none";
			}
		}

		return elements;
	}

	jQuery.fn.extend({
		css: function( name, value ){
			return jQuery.access(this, function( elem, name, value ){
				return value !== undefined ? jQuery.style(elem, name, value) : jQuery.css(elem, name);
			}, name, value, arguments.length > 1);
		},
		show: function(){
			return showHide(this, true);
		},
		hide: function(){
			return showHide(this);
		},
		toggle: function( state, fn2 ){
			var boolean = typeof state === "boolean";

			if( jQuery.isFunction(state) && jQuery.isFunction(fn2) ){
				return eventsToggle.apply(this, arguments);
			}

			return this.each(function(){
				if( boolean ? state : isHidden(this) ){
					jQuery(this).show();
				} else{
					jQuery(this).hide();
				}
			});
		}
	});

	jQuery.extend({
		// Add in style property hooks for overriding the default
		// behavior of getting and setting a style property
		cssHooks: {
			opacity: {
				get: function( elem, computed ){
					if( computed ){
						// We should always get a number back from opacity
						var ret = curCSS(elem, "opacity");
						return ret === "" ? "1" : ret;

					}
				}
			}
		},

		// Exclude the following css properties to add px
		cssNumber: {
			"fillOpacity": true,
			"fontWeight": true,
			"lineHeight": true,
			"opacity": true,
			"orphans": true,
			"widows": true,
			"zIndex": true,
			"zoom": true
		},

		// Add in properties whose names you wish to fix before
		// setting or getting the value
		cssProps: {
			// normalize float css property
			"float": jQuery.support.cssFloat ? "cssFloat" : "styleFloat"
		},

		// Get and set the style property on a DOM Node
		style: function( elem, name, value, extra ){
			// Don't set styles on text and comment nodes
			if( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ){
				return;
			}

			// Make sure that we're working with the right name
			var ret, type, hooks, origName = jQuery.camelCase(name), style = elem.style;

			name = jQuery.cssProps[origName] || (jQuery.cssProps[origName] = vendorPropName(style, origName));

			// gets hook for the prefixed version
			// followed by the unprefixed version
			hooks = jQuery.cssHooks[name] || jQuery.cssHooks[origName];

			// Check if we're setting a value
			if( value !== undefined ){
				type = typeof value;

				// convert relative number strings (+= or -=) to relative numbers. #7345
				if( type === "string" && (ret = rrelNum.exec(value)) ){
					value = (ret[1] + 1) * ret[2] + parseFloat(jQuery.css(elem, name));
					// Fixes bug #9237
					type = "number";
				}

				// Make sure that NaN and null values aren't set. See: #7116
				if( value == null || type === "number" && isNaN(value) ){
					return;
				}

				// If a number was passed in, add 'px' to the (except for certain CSS properties)
				if( type === "number" && !jQuery.cssNumber[origName] ){
					value += "px";
				}

				// If a hook was provided, use that value, otherwise just set the specified value
				if( !hooks || !("set" in hooks) || (value = hooks.set(elem, value, extra)) !== undefined ){
					// Wrapped to prevent IE from throwing errors when 'invalid' values are provided
					// Fixes bug #5509
					try {
						style[name] = value;
					} catch( e ) {
					}
				}

			} else{
				// If a hook was provided get the non-computed value from there
				if( hooks && "get" in hooks && (ret = hooks.get(elem, false, extra)) !== undefined ){
					return ret;
				}

				// Otherwise just get the value from the style object
				return style[name];
			}
		},

		css: function( elem, name, numeric, extra ){
			var val, num, hooks, origName = jQuery.camelCase(name);

			// Make sure that we're working with the right name
			name = jQuery.cssProps[origName] || (jQuery.cssProps[origName] = vendorPropName(elem.style, origName));

			// gets hook for the prefixed version
			// followed by the unprefixed version
			hooks = jQuery.cssHooks[name] || jQuery.cssHooks[origName];

			// If a hook was provided get the computed value from there
			if( hooks && "get" in hooks ){
				val = hooks.get(elem, true, extra);
			}

			// Otherwise, if a way to get the computed value exists, use that
			if( val === undefined ){
				val = curCSS(elem, name);
			}

			//convert "normal" to computed value
			if( val === "normal" && name in cssNormalTransform ){
				val = cssNormalTransform[name];
			}

			// Return, converting to number if forced or a qualifier was provided and val looks numeric
			if( numeric || extra !== undefined ){
				num = parseFloat(val);
				return numeric || jQuery.isNumeric(num) ? num || 0 : val;
			}
			return val;
		},

		// A method for quickly swapping in/out CSS properties to get correct calculations
		swap: function( elem, options, callback ){
			var ret, name, old = {};

			// Remember the old values, and insert the new ones
			for( name in options ){
				old[name] = elem.style[name];
				elem.style[name] = options[name];
			}

			ret = callback.call(elem);

			// Revert the old values
			for( name in options ){
				elem.style[name] = old[name];
			}

			return ret;
		}
	});

	// NOTE: To any future maintainer, we've window.getComputedStyle
	// because jsdom on node.js will break without it.
	if( window.getComputedStyle ){
		curCSS = function( elem, name ){
			var ret, width, minWidth, maxWidth, computed = window.getComputedStyle(elem, null), style = elem.style;

			if( computed ){

				// getPropertyValue is only needed for .css('filter') in IE9, see #12537
				ret = computed.getPropertyValue(name) || computed[name];

				if( ret === "" && !jQuery.contains(elem.ownerDocument, elem) ){
					ret = jQuery.style(elem, name);
				}

				// A tribute to the "awesome hack by Dean Edwards"
				// Chrome < 17 and Safari 5.0 uses "computed value" instead of "used value" for margin-right
				// Safari 5.1.7 (at least) returns percentage for a larger set of values, but width seems to be reliably pixels
				// this is against the CSSOM draft spec: http://dev.w3.org/csswg/cssom/#resolved-values
				if( rnumnonpx.test(ret) && rmargin.test(name) ){
					width = style.width;
					minWidth = style.minWidth;
					maxWidth = style.maxWidth;

					style.minWidth = style.maxWidth = style.width = ret;
					ret = computed.width;

					style.width = width;
					style.minWidth = minWidth;
					style.maxWidth = maxWidth;
				}
			}

			return ret;
		};
	} else if( document.documentElement.currentStyle ){
		curCSS = function( elem, name ){
			var left, rsLeft, ret = elem.currentStyle && elem.currentStyle[name], style = elem.style;

			// Avoid setting ret to empty string here
			// so we don't default to auto
			if( ret == null && style && style[name] ){
				ret = style[name];
			}

			// From the awesome hack by Dean Edwards
			// http://erik.eae.Net/archives/2007/07/27/18.54.15/#comment-102291

			// If we're not dealing with a regular pixel number
			// but a number that has a weird ending, we need to convert it to pixels
			// but not position css attributes, as those are proportional to the parent element instead
			// and we can't measure the parent instead because it might trigger a "stacking dolls" problem
			if( rnumnonpx.test(ret) && !rposition.test(name) ){

				// Remember the original values
				left = style.left;
				rsLeft = elem.runtimeStyle && elem.runtimeStyle.left;

				// Put in the new values to get a computed value out
				if( rsLeft ){
					elem.runtimeStyle.left = elem.currentStyle.left;
				}
				style.left = name === "fontSize" ? "1em" : ret;
				ret = style.pixelLeft + "px";

				// Revert the changed values
				style.left = left;
				if( rsLeft ){
					elem.runtimeStyle.left = rsLeft;
				}
			}

			return ret === "" ? "auto" : ret;
		};
	}

	function setPositiveNumber( elem, value, subtract ){
		var matches = rnumsplit.exec(value);
		return matches ? Math.max(0, matches[1] - (subtract || 0)) + (matches[2] || "px") : value;
	}

	function augmentWidthOrHeight( elem, name, extra, isBorderBox ){
		var i = extra === (isBorderBox ? "border" : "content") ? // If we already have the right measurement, avoid augmentation
				4 : // Otherwise initialize for horizontal or vertical properties
				name === "width" ? 1 : 0,

			val = 0;

		for( ; i < 4; i += 2 ){
			// both box models exclude margin, so add it if we want it
			if( extra === "margin" ){
				// we use jQuery.css instead of curCSS here
				// because of the reliableMarginRight CSS hook!
				val += jQuery.css(elem, extra + cssExpand[i], true);
			}

			// From this point on we use curCSS for maximum performance (relevant in animations)
			if( isBorderBox ){
				// border-box includes padding, so remove it if we want content
				if( extra === "content" ){
					val -= parseFloat(curCSS(elem, "padding" + cssExpand[i])) || 0;
				}

				// at this point, extra isn't border nor margin, so remove border
				if( extra !== "margin" ){
					val -= parseFloat(curCSS(elem, "border" + cssExpand[i] + "Width")) || 0;
				}
			} else{
				// at this point, extra isn't content, so add padding
				val += parseFloat(curCSS(elem, "padding" + cssExpand[i])) || 0;

				// at this point, extra isn't content nor padding, so add border
				if( extra !== "padding" ){
					val += parseFloat(curCSS(elem, "border" + cssExpand[i] + "Width")) || 0;
				}
			}
		}

		return val;
	}

	function getWidthOrHeight( elem, name, extra ){

		// Start with offset property, which is equivalent to the border-box value
		var val = name === "width" ? elem.offsetWidth : elem.offsetHeight, valueIsBorderBox = true, isBorderBox = jQuery.support.boxSizing && jQuery.css(elem, "boxSizing") === "border-box";

		// some non-html elements return undefined for offsetWidth, so check for null/undefined
		// svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
		// MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
		if( val <= 0 || val == null ){
			// Fall back to computed then uncomputed css if necessary
			val = curCSS(elem, name);
			if( val < 0 || val == null ){
				val = elem.style[name];
			}

			// Computed unit is not pixels. Stop here and return.
			if( rnumnonpx.test(val) ){
				return val;
			}

			// we need the check for style in case a browser which returns unreliable values
			// for getComputedStyle silently falls back to the reliable elem.style
			valueIsBorderBox = isBorderBox && (jQuery.support.boxSizingReliable || val === elem.style[name]);

			// Normalize "", auto, and prepare for extra
			val = parseFloat(val) || 0;
		}

		// use the active box-sizing model to add/subtract irrelevant styles
		return (val + augmentWidthOrHeight(elem, name, extra || (isBorderBox ? "border" : "content"), valueIsBorderBox)
			) + "px";
	}


	// Try to determine the default display value of an element
	function css_defaultDisplay( nodeName ){
		if( elemdisplay[nodeName] ){
			return elemdisplay[nodeName];
		}

		var elem = jQuery("<" + nodeName + ">").appendTo(document.body), display = elem.css("display");
		elem.remove();

		// If the simple way fails,
		// get element's real default display by attaching it to a temp iframe
		if( display === "none" || display === "" ){
			// Use the already-created iframe if possible
			iframe = document.body.appendChild(iframe || jQuery.extend(document.createElement("iframe"), {
				frameBorder: 0,
				width: 0,
				height: 0
			}));

			// Create a cacheable copy of the iframe document on first call.
			// IE and Opera will allow us to reuse the iframeDoc without re-writing the fake HTML
			// document to it; WebKit & Firefox won't allow reusing the iframe document.
			if( !iframeDoc || !iframe.createElement ){
				iframeDoc = (iframe.contentWindow || iframe.contentDocument).document;
				iframeDoc.write("<!doctype html><html><body>");
				iframeDoc.close();
			}

			elem = iframeDoc.body.appendChild(iframeDoc.createElement(nodeName));

			display = curCSS(elem, "display");
			document.body.removeChild(iframe);
		}

		// Store the correct default display
		elemdisplay[nodeName] = display;

		return display;
	}

	jQuery.each(["height", "width"], function( i, name ){
		jQuery.cssHooks[name] = {
			get: function( elem, computed, extra ){
				if( computed ){
					// certain elements can have dimension info if we invisibly show them
					// however, it must have a current display style that would benefit from this
					if( elem.offsetWidth === 0 && rdisplayswap.test(curCSS(elem, "display")) ){
						return jQuery.swap(elem, cssShow, function(){
							return getWidthOrHeight(elem, name, extra);
						});
					} else{
						return getWidthOrHeight(elem, name, extra);
					}
				}
			},

			set: function( elem, value, extra ){
				return setPositiveNumber(elem, value, extra ? augmentWidthOrHeight(elem, name, extra, jQuery.support.boxSizing && jQuery.css(elem, "boxSizing") === "border-box") : 0);
			}
		};
	});

	if( !jQuery.support.opacity ){
		jQuery.cssHooks.opacity = {
			get: function( elem, computed ){
				// IE uses filters for opacity
				return ropacity.test((computed && elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || "") ? (0.01 * parseFloat(RegExp.$1)) + "" : computed ? "1" : "";
			},

			set: function( elem, value ){
				var style = elem.style, currentStyle = elem.currentStyle, opacity = jQuery.isNumeric(value) ? "alpha(opacity=" + value * 100 + ")" : "", filter = currentStyle && currentStyle.filter || style.filter || "";

				// IE has trouble with opacity if it does not have layout
				// Force it by setting the zoom level
				style.zoom = 1;

				// if setting opacity to 1, and no other filters exist - attempt to remove filter attribute #6652
				if( value >= 1 && jQuery.trim(filter.replace(ralpha, "")) === "" && style.removeAttribute ){

					// Setting style.filter to null, "" & " " still leave "filter:" in the cssText
					// if "filter:" is present at all, clearType is disabled, we want to avoid this
					// style.removeAttribute is IE Only, but so apparently is this code path...
					style.removeAttribute("filter");

					// if there there is no filter style applied in a css rule, we are done
					if( currentStyle && !currentStyle.filter ){
						return;
					}
				}

				// otherwise, set new filter values
				style.filter = ralpha.test(filter) ? filter.replace(ralpha, opacity) : filter + " " + opacity;
			}
		};
	}

	// These hooks cannot be added until DOM ready because the support test
	// for it is not run until after DOM ready
	jQuery(function(){
		if( !jQuery.support.reliableMarginRight ){
			jQuery.cssHooks.marginRight = {
				get: function( elem, computed ){
					// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
					// Work around by temporarily setting element display to inline-block
					return jQuery.swap(elem, { "display": "inline-block" }, function(){
						if( computed ){
							return curCSS(elem, "marginRight");
						}
					});
				}
			};
		}

		// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
		// getComputedStyle returns percent when specified for top/left/bottom/right
		// rather than make the css module depend on the offset module, we just check for it here
		if( !jQuery.support.pixelPosition && jQuery.fn.position ){
			jQuery.each(["top", "left"], function( i, prop ){
				jQuery.cssHooks[prop] = {
					get: function( elem, computed ){
						if( computed ){
							var ret = curCSS(elem, prop);
							// if curCSS returns percentage, fallback to offset
							return rnumnonpx.test(ret) ? jQuery(elem).position()[prop] + "px" : ret;
						}
					}
				};
			});
		}

	});

	if( jQuery.expr && jQuery.expr.filters ){
		jQuery.expr.filters.hidden = function( elem ){
			return (elem.offsetWidth === 0 && elem.offsetHeight === 0) || (!jQuery.support.reliableHiddenOffsets && ((elem.style && elem.style.display) || curCSS(elem, "display")) === "none");
		};

		jQuery.expr.filters.visible = function( elem ){
			return !jQuery.expr.filters.hidden(elem);
		};
	}

	// These hooks are used by animate to expand properties
	jQuery.each({
		margin: "",
		padding: "",
		border: "Width"
	}, function( prefix, suffix ){
		jQuery.cssHooks[prefix + suffix] = {
			expand: function( value ){
				var i,

				// assumes a single number if not a string
					parts = typeof value === "string" ? value.split(" ") : [value], expanded = {};

				for( i = 0; i < 4; i++ ){
					expanded[prefix + cssExpand[i] + suffix] = parts[i] || parts[i - 2] || parts[0];
				}

				return expanded;
			}
		};

		if( !rmargin.test(prefix) ){
			jQuery.cssHooks[prefix + suffix].set = setPositiveNumber;
		}
	});
	var r20 = /%20/g, rbracket = /\[\]$/, rCRLF = /\r?\n/g, rinput = /^(?:color|date|datetime|datetime-local|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i, rselectTextarea = /^(?:select|textarea)/i;

	jQuery.fn.extend({
		serialize: function(){
			return jQuery.param(this.serializeArray());
		},
		serializeArray: function(){
			return this.map(function(){
				return this.elements ? jQuery.makeArray(this.elements) : this;
			}).filter(function(){
					return this.name && !this.disabled && (this.checked || rselectTextarea.test(this.nodeName) || rinput.test(this.type));
				}).map(function( i, elem ){
					var val = jQuery(this).val();

					return val == null ? null : jQuery.isArray(val) ? jQuery.map(val, function( val, i ){
						return { name: elem.name, value: val.replace(rCRLF, "\r\n") };
					}) : { name: elem.name, value: val.replace(rCRLF, "\r\n") };
				}).get();
		}
	});

	//Serialize an array of form elements or a set of
	//key/values into a query string
	jQuery.param = function( a, traditional ){
		var prefix, s = [], add = function( key, value ){
				// If value is a function, invoke it and return its value
				value = jQuery.isFunction(value) ? value() : (value == null ? "" : value);
				s[s.length] = encodeURIComponent(key) + "=" + encodeURIComponent(value);
			};

		// Set traditional to true for jQuery <= 1.3.2 behavior.
		if( traditional === undefined ){
			traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;
		}

		// If an array was passed in, assume that it is an array of form elements.
		if( jQuery.isArray(a) || (a.jquery && !jQuery.isPlainObject(a)) ){
			// Serialize the form elements
			jQuery.each(a, function(){
				add(this.name, this.value);
			});

		} else{
			// If traditional, encode the "old" way (the way 1.3.2 or older
			// did it), otherwise encode params recursively.
			for( prefix in a ){
				buildParams(prefix, a[prefix], traditional, add);
			}
		}

		// Return the resulting serialization
		return s.join("&").replace(r20, "+");
	};

	function buildParams( prefix, obj, traditional, add ){
		var name;

		if( jQuery.isArray(obj) ){
			// Serialize array item.
			jQuery.each(obj, function( i, v ){
				if( traditional || rbracket.test(prefix) ){
					// Treat each array item as a scalar.
					add(prefix, v);

				} else{
					// If array item is non-scalar (array or object), encode its
					// numeric index to resolve deserialization ambiguity issues.
					// Note that rack (as of 1.0.0) can't currently deserialize
					// nested arrays properly, and attempting to do so may cause
					// a server error. Possible fixes are to modify rack's
					// deserialization algorithm or to provide an option or flag
					// to force array serialization to be shallow.
					buildParams(prefix + "[" + (typeof v === "object" ? i : "") + "]", v, traditional, add);
				}
			});

		} else if( !traditional && jQuery.type(obj) === "object" ){
			// Serialize object item.
			for( name in obj ){
				buildParams(prefix + "[" + name + "]", obj[name], traditional, add);
			}

		} else{
			// Serialize scalar item.
			add(prefix, obj);
		}
	}

	var // Document location
		ajaxLocParts, ajaxLocation,

		rhash = /#.*$/, rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg, // IE leaves an \r character at EOL
	// #7653, #8125, #8152: local protocol detection
		rlocalProtocol = /^(?:about|app|app\-storage|.+\-extension|file|res|widget):$/, rnoContent = /^(?:GET|HEAD)$/, rprotocol = /^\/\//, rquery = /\?/, rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, rts = /([?&])_=[^&]*/, rurl = /^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,

	// Keep a copy of the old load method
		_load = jQuery.fn.load,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
		prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
		transports = {},

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
		allTypes = ["*/"] + ["*"];

	// #8138, IE may throw an exception when accessing
	// a field from window.location if document.domain has been set
	try {
		ajaxLocation = location.href;
	} catch( e ) {
		// Use the href attribute of an A element
		// since IE will modify it given document.location
		ajaxLocation = document.createElement("a");
		ajaxLocation.href = "";
		ajaxLocation = ajaxLocation.href;
	}

	// Segment location into parts
	ajaxLocParts = rurl.exec(ajaxLocation.toLowerCase()) || [];

	// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
	function addToPrefiltersOrTransports( structure ){

		// dataTypeExpression is optional and defaults to "*"
		return function( dataTypeExpression, func ){

			if( typeof dataTypeExpression !== "string" ){
				func = dataTypeExpression;
				dataTypeExpression = "*";
			}

			var dataType, list, placeBefore, dataTypes = dataTypeExpression.toLowerCase().split(core_rspace), i = 0, length = dataTypes.length;

			if( jQuery.isFunction(func) ){
				// For each dataType in the dataTypeExpression
				for( ; i < length; i++ ){
					dataType = dataTypes[i];
					// We control if we're asked to add before
					// any existing element
					placeBefore = /^\+/.test(dataType);
					if( placeBefore ){
						dataType = dataType.substr(1) || "*";
					}
					list = structure[dataType] = structure[dataType] || [];
					// then we add to the structure accordingly
					list[placeBefore ? "unshift" : "push"](func);
				}
			}
		};
	}

	// Base inspection function for prefilters and transports
	function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR, dataType /* internal */, inspected /* internal */ ){

		dataType = dataType || options.dataTypes[0];
		inspected = inspected || {};

		inspected[dataType] = true;

		var selection, list = structure[dataType], i = 0, length = list ? list.length : 0, executeOnly = (structure === prefilters);

		for( ; i < length && (executeOnly || !selection); i++ ){
			selection = list[i](options, originalOptions, jqXHR);
			// If we got redirected to another dataType
			// we try there if executing only and not done already
			if( typeof selection === "string" ){
				if( !executeOnly || inspected[selection] ){
					selection = undefined;
				} else{
					options.dataTypes.unshift(selection);
					selection = inspectPrefiltersOrTransports(structure, options, originalOptions, jqXHR, selection, inspected);
				}
			}
		}
		// If we're only executing or nothing was selected
		// we try the catchall dataType if not done already
		if( (executeOnly || !selection) && !inspected["*"] ){
			selection = inspectPrefiltersOrTransports(structure, options, originalOptions, jqXHR, "*", inspected);
		}
		// unnecessary when only executing (prefilters)
		// but it'll be ignored by the caller in that case
		return selection;
	}

	// A special extend for ajax options
	// that takes "flat" options (not to be deep extended)
	// Fixes #9887
	function ajaxExtend( target, src ){
		var key, deep, flatOptions = jQuery.ajaxSettings.flatOptions || {};
		for( key in src ){
			if( src[key] !== undefined ){
				(flatOptions[key] ? target : (deep || (deep = {})))[key] = src[key];
			}
		}
		if( deep ){
			jQuery.extend(true, target, deep);
		}
	}

	jQuery.fn.load = function( url, params, callback ){
		if( typeof url !== "string" && _load ){
			return _load.apply(this, arguments);
		}

		// Don't do a request if no elements are being requested
		if( !this.length ){
			return this;
		}

		var selector, type, response, self = this, off = url.indexOf(" ");

		if( off >= 0 ){
			selector = url.slice(off, url.length);
			url = url.slice(0, off);
		}

		// If it's a function
		if( jQuery.isFunction(params) ){

			// We assume that it's the callback
			callback = params;
			params = undefined;

			// Otherwise, build a param string
		} else if( params && typeof params === "object" ){
			type = "POST";
		}

		// Request the remote document
		jQuery.ajax({
			url: url,

			// if "type" variable is undefined, then "GET" method will be used
			type: type,
			dataType: "html",
			data: params,
			complete: function( jqXHR, status ){
				if( callback ){
					self.each(callback, response || [jqXHR.responseText, status, jqXHR]);
				}
			}
		}).done(function( responseText ){

				// Save response for use in complete callback
				response = arguments;

				// See if a selector was specified
				self.html(selector ?

					// Create a dummy div to hold the results
					jQuery("<div>")

						// inject the contents of the document in, removing the scripts
						// to avoid any 'Permission Denied' errors in IE
						.append(responseText.replace(rscript, ""))

						// Locate the specified elements
						.find(selector) :

					// If not, just inject the full result
					responseText);

			});

		return this;
	};

	// Attach a bunch of functions for handling common AJAX events
	jQuery.each("ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split(" "), function( i, o ){
		jQuery.fn[o] = function( f ){
			return this.on(o, f);
		};
	});

	jQuery.each(["get", "post"], function( i, method ){
		jQuery[method] = function( url, data, callback, type ){
			// shift arguments if data argument was omitted
			if( jQuery.isFunction(data) ){
				type = type || callback;
				callback = data;
				data = undefined;
			}

			return jQuery.ajax({
				type: method,
				url: url,
				data: data,
				success: callback,
				dataType: type
			});
		};
	});

	jQuery.extend({

		getScript: function( url, callback ){
			return jQuery.get(url, undefined, callback, "script");
		},

		getJSON: function( url, data, callback ){
			return jQuery.get(url, data, callback, "json");
		},

		// Creates a full fledged settings object into target
		// with both ajaxSettings and settings fields.
		// If target is omitted, writes into ajaxSettings.
		ajaxSetup: function( target, settings ){
			if( settings ){
				// Building a settings object
				ajaxExtend(target, jQuery.ajaxSettings);
			} else{
				// Extending ajaxSettings
				settings = target;
				target = jQuery.ajaxSettings;
			}
			ajaxExtend(target, settings);
			return target;
		},

		ajaxSettings: {
			url: ajaxLocation,
			isLocal: rlocalProtocol.test(ajaxLocParts[1]),
			global: true,
			type: "GET",
			contentType: "application/x-www-form-urlencoded; charset=UTF-8",
			processData: true,
			async: true,
			/*
			 timeout: 0,
			 data: null,
			 dataType: null,
			 username: null,
			 password: null,
			 cache: null,
			 throws: false,
			 traditional: false,
			 headers: {},
			 */

			accepts: {
				xml: "application/xml, text/xml",
				html: "text/html",
				text: "text/plain",
				json: "application/json, text/javascript",
				"*": allTypes
			},

			contents: {
				xml: /xml/,
				html: /html/,
				json: /json/
			},

			responseFields: {
				xml: "responseXML",
				text: "responseText"
			},

			// List of data converters
			// 1) key format is "source_type destination_type" (a single space in-between)
			// 2) the catchall symbol "*" can be used for source_type
			converters: {

				// Convert anything to text
				"* text": window.String,

				// Text to html (true = no transformation)
				"text html": true,

				// Evaluate text as a json expression
				"text json": jQuery.parseJSON,

				// Parse text as xml
				"text xml": jQuery.parseXML
			},

			// For options that shouldn't be deep extended:
			// you can add your own custom options here if
			// and when you create one that shouldn't be
			// deep extended (see ajaxExtend)
			flatOptions: {
				context: true,
				url: true
			}
		},

		ajaxPrefilter: addToPrefiltersOrTransports(prefilters),
		ajaxTransport: addToPrefiltersOrTransports(transports),

		// Main method
		ajax: function( url, options ){

			// If url is an object, simulate pre-1.5 signature
			if( typeof url === "object" ){
				options = url;
				url = undefined;
			}

			// Force options to be an object
			options = options || {};

			var // ifModified key
				ifModifiedKey, // Response headers
				responseHeadersString, responseHeaders, // transport
				transport, // timeout handle
				timeoutTimer, // Cross-domain detection vars
				parts, // To know if global events are to be dispatched
				fireGlobals, // Loop variable
				i, // Create the final options object
				s = jQuery.ajaxSetup({}, options), // Callbacks context
				callbackContext = s.context || s, // Context for global events
			// It's the callbackContext if one was provided in the options
			// and if it's a DOM node or a jQuery collection
				globalEventContext = callbackContext !== s && (callbackContext.nodeType || callbackContext instanceof jQuery) ? jQuery(callbackContext) : jQuery.event, // Deferreds
				deferred = jQuery.Deferred(), completeDeferred = jQuery.Callbacks("once memory"), // Status-dependent callbacks
				statusCode = s.statusCode || {}, // Headers (they are sent all at once)
				requestHeaders = {}, requestHeadersNames = {}, // The jqXHR state
				state = 0, // Default abort message
				strAbort = "canceled", // Fake xhr
				jqXHR = {

					readyState: 0,

					// Caches the header
					setRequestHeader: function( name, value ){
						if( !state ){
							var lname = name.toLowerCase();
							name = requestHeadersNames[lname] = requestHeadersNames[lname] || name;
							requestHeaders[name] = value;
						}
						return this;
					},

					// Raw string
					getAllResponseHeaders: function(){
						return state === 2 ? responseHeadersString : null;
					},

					// Builds headers hashtable if needed
					getResponseHeader: function( key ){
						var match;
						if( state === 2 ){
							if( !responseHeaders ){
								responseHeaders = {};
								while( (match = rheaders.exec(responseHeadersString)) ){
									responseHeaders[match[1].toLowerCase()] = match[2];
								}
							}
							match = responseHeaders[key.toLowerCase()];
						}
						return match === undefined ? null : match;
					},

					// Overrides response content-type header
					overrideMimeType: function( type ){
						if( !state ){
							s.mimeType = type;
						}
						return this;
					},

					// Cancel the request
					abort: function( statusText ){
						statusText = statusText || strAbort;
						if( transport ){
							transport.abort(statusText);
						}
						done(0, statusText);
						return this;
					}
				};

			// Callback for when everything is done
			// It is defined here because jslint complains if it is declared
			// at the end of the function (which would be more logical and readable)
			function done( status, nativeStatusText, responses, headers ){
				var isSuccess, success, error, response, modified, statusText = nativeStatusText;

				// Called once
				if( state === 2 ){
					return;
				}

				// State is "done" now
				state = 2;

				// Clear timeout if it exists
				if( timeoutTimer ){
					clearTimeout(timeoutTimer);
				}

				// Dereference transport for early garbage collection
				// (no matter how long the jqXHR object will be used)
				transport = undefined;

				// Cache response headers
				responseHeadersString = headers || "";

				// Set readyState
				jqXHR.readyState = status > 0 ? 4 : 0;

				// Get response data
				if( responses ){
					response = ajaxHandleResponses(s, jqXHR, responses);
				}

				// If successful, handle type chaining
				if( status >= 200 && status < 300 || status === 304 ){

					// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
					if( s.ifModified ){

						modified = jqXHR.getResponseHeader("Last-Modified");
						if( modified ){
							jQuery.lastModified[ifModifiedKey] = modified;
						}
						modified = jqXHR.getResponseHeader("Etag");
						if( modified ){
							jQuery.etag[ifModifiedKey] = modified;
						}
					}

					// If not modified
					if( status === 304 ){

						statusText = "notmodified";
						isSuccess = true;

						// If we have data
					} else{

						isSuccess = ajaxConvert(s, response);
						statusText = isSuccess.state;
						success = isSuccess.data;
						error = isSuccess.error;
						isSuccess = !error;
					}
				} else{
					// We extract error from statusText
					// then normalize statusText and status for non-aborts
					error = statusText;
					if( !statusText || status ){
						statusText = "error";
						if( status < 0 ){
							status = 0;
						}
					}
				}

				// Set data for the fake xhr object
				jqXHR.status = status;
				jqXHR.statusText = (nativeStatusText || statusText) + "";

				// Success/Error
				if( isSuccess ){
					deferred.resolveWith(callbackContext, [success, statusText, jqXHR]);
				} else{
					deferred.rejectWith(callbackContext, [jqXHR, statusText, error]);
				}

				// Status-dependent callbacks
				jqXHR.statusCode(statusCode);
				statusCode = undefined;

				if( fireGlobals ){
					globalEventContext.trigger("ajax" + (isSuccess ? "Success" : "Error"), [jqXHR, s, isSuccess ? success : error]);
				}

				// Complete
				completeDeferred.fireWith(callbackContext, [jqXHR, statusText]);

				if( fireGlobals ){
					globalEventContext.trigger("ajaxComplete", [jqXHR, s]);
					// Handle the global AJAX counter
					if( !(--jQuery.active) ){
						jQuery.event.trigger("ajaxStop");
					}
				}
			}

			// Attach deferreds
			deferred.promise(jqXHR);
			jqXHR.success = jqXHR.done;
			jqXHR.error = jqXHR.fail;
			jqXHR.complete = completeDeferred.add;

			// Status-dependent callbacks
			jqXHR.statusCode = function( map ){
				if( map ){
					var tmp;
					if( state < 2 ){
						for( tmp in map ){
							statusCode[tmp] = [statusCode[tmp], map[tmp]];
						}
					} else{
						tmp = map[jqXHR.status];
						jqXHR.always(tmp);
					}
				}
				return this;
			};

			// Remove hash character (#7531: and string promotion)
			// Add protocol if not provided (#5866: IE7 issue with protocol-less urls)
			// We also use the url parameter if available
			s.url = ((url || s.url) + "").replace(rhash, "").replace(rprotocol, ajaxLocParts[1] + "//");

			// Extract dataTypes list
			s.dataTypes = jQuery.trim(s.dataType || "*").toLowerCase().split(core_rspace);

			// A cross-domain request is in order when we have a protocol:host:port mismatch
			if( s.crossDomain == null ){
				parts = rurl.exec(s.url.toLowerCase());
				s.crossDomain = !!(parts && (parts[1] !== ajaxLocParts[1] || parts[2] !== ajaxLocParts[2] || (parts[3] || (parts[1] === "http:" ? 80 : 443)) != (ajaxLocParts[3] || (ajaxLocParts[1] === "http:" ? 80 : 443)))
					);
			}

			// Convert data if not already a string
			if( s.data && s.processData && typeof s.data !== "string" ){
				s.data = jQuery.param(s.data, s.traditional);
			}

			// Apply prefilters
			inspectPrefiltersOrTransports(prefilters, s, options, jqXHR);

			// If request was aborted inside a prefilter, stop there
			if( state === 2 ){
				return jqXHR;
			}

			// We can fire global events as of now if asked to
			fireGlobals = s.global;

			// Uppercase the type
			s.type = s.type.toUpperCase();

			// Determine if request has content
			s.hasContent = !rnoContent.test(s.type);

			// Watch for a new set of requests
			if( fireGlobals && jQuery.active++ === 0 ){
				jQuery.event.trigger("ajaxStart");
			}

			// More options handling for requests with no content
			if( !s.hasContent ){

				// If data is available, append data to url
				if( s.data ){
					s.url += (rquery.test(s.url) ? "&" : "?") + s.data;
					// #9682: remove data so that it's not used in an eventual retry
					delete s.data;
				}

				// Get ifModifiedKey before adding the anti-cache parameter
				ifModifiedKey = s.url;

				// Add anti-cache in url if needed
				if( s.cache === false ){

					var ts = jQuery.now(), // try replacing _= if it is there
						ret = s.url.replace(rts, "$1_=" + ts);

					// if nothing was replaced, add timestamp to the end
					s.url = ret + ((ret === s.url) ? (rquery.test(s.url) ? "&" : "?") + "_=" + ts : "");
				}
			}

			// Set the correct header, if data is being sent
			if( s.data && s.hasContent && s.contentType !== false || options.contentType ){
				jqXHR.setRequestHeader("Content-Type", s.contentType);
			}

			// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
			if( s.ifModified ){
				ifModifiedKey = ifModifiedKey || s.url;
				if( jQuery.lastModified[ifModifiedKey] ){
					jqXHR.setRequestHeader("If-Modified-Since", jQuery.lastModified[ifModifiedKey]);
				}
				if( jQuery.etag[ifModifiedKey] ){
					jqXHR.setRequestHeader("If-None-Match", jQuery.etag[ifModifiedKey]);
				}
			}

			// Set the Accepts header for the server, depending on the dataType
			jqXHR.setRequestHeader("Accept", s.dataTypes[0] && s.accepts[s.dataTypes[0]] ? s.accepts[s.dataTypes[0]] + (s.dataTypes[0] !== "*" ? ", " + allTypes + "; q=0.01" : "") : s.accepts["*"]);

			// Check for headers option
			for( i in s.headers ){
				jqXHR.setRequestHeader(i, s.headers[i]);
			}

			// Allow custom headers/mimetypes and early abort
			if( s.beforeSend && (s.beforeSend.call(callbackContext, jqXHR, s) === false || state === 2) ){
				// Abort if not done already and return
				return jqXHR.abort();

			}

			// aborting is no longer a cancellation
			strAbort = "abort";

			// Install callbacks on deferreds
			for( i in { success: 1, error: 1, complete: 1 } ){
				jqXHR[i](s[i]);
			}

			// Get transport
			transport = inspectPrefiltersOrTransports(transports, s, options, jqXHR);

			// If no transport, we auto-abort
			if( !transport ){
				done(-1, "No Transport");
			} else{
				jqXHR.readyState = 1;
				// Send global event
				if( fireGlobals ){
					globalEventContext.trigger("ajaxSend", [jqXHR, s]);
				}
				// Timeout
				if( s.async && s.timeout > 0 ){
					timeoutTimer = setTimeout(function(){
						jqXHR.abort("timeout");
					}, s.timeout);
				}

				try {
					state = 1;
					transport.send(requestHeaders, done);
				} catch( e ) {
					// Propagate exception as error if not done
					if( state < 2 ){
						done(-1, e);
						// Simply rethrow otherwise
					} else{
						throw e;
					}
				}
			}

			return jqXHR;
		},

		// Counter for holding the number of active queries
		active: 0,

		// Last-Modified header cache for next request
		lastModified: {},
		etag: {}

	});

	/* Handles responses to an ajax request:
	 * - sets all responseXXX fields accordingly
	 * - finds the right dataType (mediates between content-type and expected dataType)
	 * - returns the corresponding response
	 */
	function ajaxHandleResponses( s, jqXHR, responses ){

		var ct, type, finalDataType, firstDataType, contents = s.contents, dataTypes = s.dataTypes, responseFields = s.responseFields;

		// Fill responseXXX fields
		for( type in responseFields ){
			if( type in responses ){
				jqXHR[responseFields[type]] = responses[type];
			}
		}

		// Remove auto dataType and get content-type in the process
		while( dataTypes[0] === "*" ){
			dataTypes.shift();
			if( ct === undefined ){
				ct = s.mimeType || jqXHR.getResponseHeader("content-type");
			}
		}

		// Check if we're dealing with a known content-type
		if( ct ){
			for( type in contents ){
				if( contents[type] && contents[type].test(ct) ){
					dataTypes.unshift(type);
					break;
				}
			}
		}

		// Check to see if we have a response for the expected dataType
		if( dataTypes[0] in responses ){
			finalDataType = dataTypes[0];
		} else{
			// Try convertible dataTypes
			for( type in responses ){
				if( !dataTypes[0] || s.converters[type + " " + dataTypes[0]] ){
					finalDataType = type;
					break;
				}
				if( !firstDataType ){
					firstDataType = type;
				}
			}
			// Or just use first one
			finalDataType = finalDataType || firstDataType;
		}

		// If we found a dataType
		// We add the dataType to the list if needed
		// and return the corresponding response
		if( finalDataType ){
			if( finalDataType !== dataTypes[0] ){
				dataTypes.unshift(finalDataType);
			}
			return responses[finalDataType];
		}
	}

	// Chain conversions given the request and the original response
	function ajaxConvert( s, response ){

		var conv, conv2, current, tmp, // Work with a copy of dataTypes in case we need to modify it for conversion
			dataTypes = s.dataTypes.slice(), prev = dataTypes[0], converters = {}, i = 0;

		// Apply the dataFilter if provided
		if( s.dataFilter ){
			response = s.dataFilter(response, s.dataType);
		}

		// Create converters map with lowercased keys
		if( dataTypes[1] ){
			for( conv in s.converters ){
				converters[conv.toLowerCase()] = s.converters[conv];
			}
		}

		// Convert to each sequential dataType, tolerating list modification
		for( ; (current = dataTypes[++i]); ){

			// There's only work to do if current dataType is non-auto
			if( current !== "*" ){

				// Convert response if prev dataType is non-auto and differs from current
				if( prev !== "*" && prev !== current ){

					// Seek a direct converter
					conv = converters[prev + " " + current] || converters["* " + current];

					// If none found, seek a pair
					if( !conv ){
						for( conv2 in converters ){

							// If conv2 outputs current
							tmp = conv2.split(" ");
							if( tmp[1] === current ){

								// If prev can be converted to accepted input
								conv = converters[prev + " " + tmp[0]] || converters["* " + tmp[0]];
								if( conv ){
									// Condense equivalence converters
									if( conv === true ){
										conv = converters[conv2];

										// Otherwise, insert the intermediate dataType
									} else if( converters[conv2] !== true ){
										current = tmp[0];
										dataTypes.splice(i--, 0, current);
									}

									break;
								}
							}
						}
					}

					// Apply converter (if not an equivalence)
					if( conv !== true ){

						// Unless errors are allowed to bubble, catch and return them
						if( conv && s["throws"] ){
							response = conv(response);
						} else{
							try {
								response = conv(response);
							} catch( e ) {
								return { state: "parsererror", error: conv ? e : "No conversion from " + prev + " to " + current };
							}
						}
					}
				}

				// Update prev for next iteration
				prev = current;
			}
		}

		return { state: "success", data: response };
	}

	var oldCallbacks = [], rquestion = /\?/, rjsonp = /(=)\?(?=&|$)|\?\?/, nonce = jQuery.now();

	// Default jsonp settings
	jQuery.ajaxSetup({
		jsonp: "callback",
		jsonpCallback: function(){
			var callback = oldCallbacks.pop() || (jQuery.expando + "_" + (nonce++));
			this[callback] = true;
			return callback;
		}
	});

	// Detect, normalize options and install callbacks for jsonp requests
	jQuery.ajaxPrefilter("json jsonp", function( s, originalSettings, jqXHR ){

		var callbackName, overwritten, responseContainer, data = s.data, url = s.url, hasCallback = s.jsonp !== false, replaceInUrl = hasCallback && rjsonp.test(url), replaceInData = hasCallback && !replaceInUrl && typeof data === "string" && !(s.contentType || "").indexOf("application/x-www-form-urlencoded") && rjsonp.test(data);

		// Handle iff the expected data type is "jsonp" or we have a parameter to set
		if( s.dataTypes[0] === "jsonp" || replaceInUrl || replaceInData ){

			// Get callback name, remembering preexisting value associated with it
			callbackName = s.jsonpCallback = jQuery.isFunction(s.jsonpCallback) ? s.jsonpCallback() : s.jsonpCallback;
			overwritten = window[callbackName];

			// Insert callback into url or form data
			if( replaceInUrl ){
				s.url = url.replace(rjsonp, "$1" + callbackName);
			} else if( replaceInData ){
				s.data = data.replace(rjsonp, "$1" + callbackName);
			} else if( hasCallback ){
				s.url += (rquestion.test(url) ? "&" : "?") + s.jsonp + "=" + callbackName;
			}

			// Use data converter to retrieve json after script execution
			s.converters["script json"] = function(){
				if( !responseContainer ){
					jQuery.error(callbackName + " was not called");
				}
				return responseContainer[0];
			};

			// force json dataType
			s.dataTypes[0] = "json";

			// Install callback
			window[callbackName] = function(){
				responseContainer = arguments;
			};

			// Clean-up function (fires after converters)
			jqXHR.always(function(){
				// Restore preexisting value
				window[callbackName] = overwritten;

				// Save back as free
				if( s[callbackName] ){
					// make sure that re-using the options doesn't screw things around
					s.jsonpCallback = originalSettings.jsonpCallback;

					// save the callback name for future use
					oldCallbacks.push(callbackName);
				}

				// Call if it was a function and we have a response
				if( responseContainer && jQuery.isFunction(overwritten) ){
					overwritten(responseContainer[0]);
				}

				responseContainer = overwritten = undefined;
			});

			// Delegate to script
			return "script";
		}
	});
	// Install script dataType
	jQuery.ajaxSetup({
		accepts: {
			script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
		},
		contents: {
			script: /javascript|ecmascript/
		},
		converters: {
			"text script": function( text ){
				jQuery.globalEval(text);
				return text;
			}
		}
	});

	// Handle cache's special case and global
	jQuery.ajaxPrefilter("script", function( s ){
		if( s.cache === undefined ){
			s.cache = false;
		}
		if( s.crossDomain ){
			s.type = "GET";
			s.global = false;
		}
	});

	// Bind script tag hack transport
	jQuery.ajaxTransport("script", function( s ){

		// This transport only deals with cross domain requests
		if( s.crossDomain ){

			var script, head = document.head || document.getElementsByTagName("head")[0] || document.documentElement;

			return {

				send: function( _, callback ){

					script = document.createElement("script");

					script.async = "async";

					if( s.scriptCharset ){
						script.charset = s.scriptCharset;
					}

					script.src = s.url;

					// Attach handlers for all browsers
					script.onload = script.onreadystatechange = function( _, isAbort ){

						if( isAbort || !script.readyState || /loaded|complete/.test(script.readyState) ){

							// Handle memory leak in IE
							script.onload = script.onreadystatechange = null;

							// Remove the script
							if( head && script.parentNode ){
								head.removeChild(script);
							}

							// Dereference the script
							script = undefined;

							// Callback if not abort
							if( !isAbort ){
								callback(200, "success");
							}
						}
					};
					// Use insertBefore instead of appendChild  to circumvent an IE6 bug.
					// This arises when a base node is used (#2709 and #4378).
					head.insertBefore(script, head.firstChild);
				},

				abort: function(){
					if( script ){
						script.onload(0, 1);
					}
				}
			};
		}
	});
	var xhrCallbacks, // #5280: Internet Explorer will keep connections alive if we don't abort on unload
		xhrOnUnloadAbort = window.ActiveXObject ? function(){
			// Abort all pending requests
			for( var key in xhrCallbacks ){
				xhrCallbacks[key](0, 1);
			}
		} : false, xhrId = 0;

	// Functions to create xhrs
	function createStandardXHR(){
		try {
			return new window.XMLHttpRequest();
		} catch( e ) {
		}
	}

	function createActiveXHR(){
		try {
			return new window.ActiveXObject("Microsoft.XMLHTTP");
		} catch( e ) {
		}
	}

	// Create the request object
	// (This is still attached to ajaxSettings for backward compatibility)
	jQuery.ajaxSettings.xhr = window.ActiveXObject ? /* Microsoft failed to properly
	 * implement the XMLHttpRequest in IE7 (can't request local files),
	 * so we use the ActiveXObject when it is available
	 * Additionally XMLHttpRequest can be disabled in IE7/IE8 so
	 * we need a fallback.
	 */
		function(){
			return !this.isLocal && createStandardXHR() || createActiveXHR();
		} : // For all other browsers, use the standard XMLHttpRequest object
		createStandardXHR;

	// Determine support properties
	(function( xhr ){
		jQuery.extend(jQuery.support, {
			ajax: !!xhr,
			cors: !!xhr && ("withCredentials" in xhr)
		});
	})(jQuery.ajaxSettings.xhr());

	// Create transport if the browser can provide an xhr
	if( jQuery.support.ajax ){

		jQuery.ajaxTransport(function( s ){
			// Cross domain only allowed if supported through XMLHttpRequest
			if( !s.crossDomain || jQuery.support.cors ){

				var callback;

				return {
					send: function( headers, complete ){

						// Get a new xhr
						var handle, i, xhr = s.xhr();

						// Open the socket
						// Passing null username, generates a login popup on Opera (#2865)
						if( s.username ){
							xhr.open(s.type, s.url, s.async, s.username, s.password);
						} else{
							xhr.open(s.type, s.url, s.async);
						}

						// Apply custom fields if provided
						if( s.xhrFields ){
							for( i in s.xhrFields ){
								xhr[i] = s.xhrFields[i];
							}
						}

						// Override mime type if needed
						if( s.mimeType && xhr.overrideMimeType ){
							xhr.overrideMimeType(s.mimeType);
						}

						// X-Requested-With header
						// For cross-domain requests, seeing as conditions for a preflight are
						// akin to a jigsaw puzzle, we simply never set it to be sure.
						// (it can always be set on a per-request basis or even using ajaxSetup)
						// For same-domain requests, won't change header if already provided.
						if( !s.crossDomain && !headers["X-Requested-With"] ){
							headers["X-Requested-With"] = "XMLHttpRequest";
						}

						// Need an extra try/catch for cross domain requests in Firefox 3
						try {
							for( i in headers ){
								xhr.setRequestHeader(i, headers[i]);
							}
						} catch( _ ) {
						}

						// Do send the request
						// This may raise an exception which is actually
						// handled in jQuery.ajax (so no try/catch here)
						xhr.send((s.hasContent && s.data) || null);

						// Listener
						callback = function( _, isAbort ){

							var status, statusText, responseHeaders, responses, xml;

							// Firefox throws exceptions when accessing properties
							// of an xhr when a network error occurred
							// http://helpful.knobs-dials.com/index.php/Component_returned_failure_code:_0x80040111_(NS_ERROR_NOT_AVAILABLE)
							try {

								// Was never called and is aborted or complete
								if( callback && (isAbort || xhr.readyState === 4) ){

									// Only called once
									callback = undefined;

									// Do not keep as active anymore
									if( handle ){
										xhr.onreadystatechange = jQuery.noop;
										if( xhrOnUnloadAbort ){
											delete xhrCallbacks[handle];
										}
									}

									// If it's an abort
									if( isAbort ){
										// Abort it manually if needed
										if( xhr.readyState !== 4 ){
											xhr.abort();
										}
									} else{
										status = xhr.status;
										responseHeaders = xhr.getAllResponseHeaders();
										responses = {};
										xml = xhr.responseXML;

										// Construct response list
										if( xml && xml.documentElement /* #4958 */ ){
											responses.xml = xml;
										}

										// When requesting binary data, IE6-9 will throw an exception
										// on any attempt to access responseText (#11426)
										try {
											responses.text = xhr.responseText;
										} catch( e ) {
										}

										// Firefox throws an exception when accessing
										// statusText for faulty cross-domain requests
										try {
											statusText = xhr.statusText;
										} catch( e ) {
											// We normalize with Webkit giving an empty statusText
											statusText = "";
										}

										// Filter status for non standard behaviors

										// If the request is local and we have data: assume a success
										// (success with no data won't get notified, that's the best we
										// can do given current implementations)
										if( !status && s.isLocal && !s.crossDomain ){
											status = responses.text ? 200 : 404;
											// IE - #1450: sometimes returns 1223 when it should be 204
										} else if( status === 1223 ){
											status = 204;
										}
									}
								}
							} catch( firefoxAccessException ) {
								if( !isAbort ){
									complete(-1, firefoxAccessException);
								}
							}

							// Call complete if needed
							if( responses ){
								complete(status, statusText, responses, responseHeaders);
							}
						};

						if( !s.async ){
							// if we're in sync mode we fire the callback
							callback();
						} else if( xhr.readyState === 4 ){
							// (IE6 & IE7) if it's in cache and has been
							// retrieved directly we need to fire the callback
							setTimeout(callback, 0);
						} else{
							handle = ++xhrId;
							if( xhrOnUnloadAbort ){
								// Create the active xhrs callbacks list if needed
								// and attach the unload handler
								if( !xhrCallbacks ){
									xhrCallbacks = {};
									jQuery(window).unload(xhrOnUnloadAbort);
								}
								// Add to list of active xhrs callbacks
								xhrCallbacks[handle] = callback;
							}
							xhr.onreadystatechange = callback;
						}
					},

					abort: function(){
						if( callback ){
							callback(0, 1);
						}
					}
				};
			}
		});
	}
	var fxNow, timerId, rfxtypes = /^(?:toggle|show|hide)$/, rfxnum = new RegExp("^(?:([-+])=|)(" + core_pnum + ")([a-z%]*)$", "i"), rrun = /queueHooks$/, animationPrefilters = [defaultPrefilter], tweeners = {
			"*": [function( prop, value ){
				var end, unit, tween = this.createTween(prop, value), parts = rfxnum.exec(value), target = tween.cur(), start = +target || 0, scale = 1, maxIterations = 20;

				if( parts ){
					end = +parts[2];
					unit = parts[3] || (jQuery.cssNumber[prop] ? "" : "px");

					// We need to compute starting value
					if( unit !== "px" && start ){
						// Iteratively approximate from a nonzero starting point
						// Prefer the current property, because this process will be trivial if it uses the same units
						// Fallback to end or a simple constant
						start = jQuery.css(tween.elem, prop, true) || end || 1;

						do {
							// If previous iteration zeroed out, double until we get *something*
							// Use a string for doubling factor so we don't accidentally see scale as unchanged below
							scale = scale || ".5";

							// Adjust and apply
							start = start / scale;
							jQuery.style(tween.elem, prop, start + unit);

							// Update scale, tolerating zero or NaN from tween.cur()
							// And breaking the loop if scale is unchanged or perfect, or if we've just had enough
						} while( scale !== (scale = tween.cur() / target) && scale !== 1 && --maxIterations );
					}

					tween.unit = unit;
					tween.start = start;
					// If a +=/-= token was provided, we're doing a relative animation
					tween.end = parts[1] ? start + (parts[1] + 1) * end : end;
				}
				return tween;
			}]
		};

	// Animations created synchronously will run synchronously
	function createFxNow(){
		setTimeout(function(){
			fxNow = undefined;
		}, 0);
		return (fxNow = jQuery.now());
	}

	function createTweens( animation, props ){
		jQuery.each(props, function( prop, value ){
			var collection = (tweeners[prop] || []).concat(tweeners["*"]), index = 0, length = collection.length;
			for( ; index < length; index++ ){
				if( collection[index].call(animation, prop, value) ){

					// we're done with this property
					return;
				}
			}
		});
	}

	function Animation( elem, properties, options ){
		var result, index = 0, tweenerIndex = 0, length = animationPrefilters.length, deferred = jQuery.Deferred().always(function(){
				// don't match elem in the :animated selector
				delete tick.elem;
			}), tick = function(){
				var currentTime = fxNow || createFxNow(), remaining = Math.max(0, animation.startTime + animation.duration - currentTime), // archaic crash bug won't allow us to use 1 - ( 0.5 || 0 ) (#12497)
					temp = remaining / animation.duration || 0, percent = 1 - temp, index = 0, length = animation.tweens.length;

				for( ; index < length; index++ ){
					animation.tweens[index].run(percent);
				}

				deferred.notifyWith(elem, [animation, percent, remaining]);

				if( percent < 1 && length ){
					return remaining;
				} else{
					deferred.resolveWith(elem, [animation]);
					return false;
				}
			}, animation = deferred.promise({
				elem: elem,
				props: jQuery.extend({}, properties),
				opts: jQuery.extend(true, { specialEasing: {} }, options),
				originalProperties: properties,
				originalOptions: options,
				startTime: fxNow || createFxNow(),
				duration: options.duration,
				tweens: [],
				createTween: function( prop, end, easing ){
					var tween = jQuery.Tween(elem, animation.opts, prop, end, animation.opts.specialEasing[prop] || animation.opts.easing);
					animation.tweens.push(tween);
					return tween;
				},
				stop: function( gotoEnd ){
					var index = 0, // if we are going to the end, we want to run all the tweens
					// otherwise we skip this part
						length = gotoEnd ? animation.tweens.length : 0;

					for( ; index < length; index++ ){
						animation.tweens[index].run(1);
					}

					// resolve when we played the last frame
					// otherwise, reject
					if( gotoEnd ){
						deferred.resolveWith(elem, [animation, gotoEnd]);
					} else{
						deferred.rejectWith(elem, [animation, gotoEnd]);
					}
					return this;
				}
			}), props = animation.props;

		propFilter(props, animation.opts.specialEasing);

		for( ; index < length; index++ ){
			result = animationPrefilters[index].call(animation, elem, props, animation.opts);
			if( result ){
				return result;
			}
		}

		createTweens(animation, props);

		if( jQuery.isFunction(animation.opts.start) ){
			animation.opts.start.call(elem, animation);
		}

		jQuery.fx.timer(jQuery.extend(tick, {
			anim: animation,
			queue: animation.opts.queue,
			elem: elem
		}));

		// attach callbacks from options
		return animation.progress(animation.opts.progress).done(animation.opts.done, animation.opts.complete).fail(animation.opts.fail).always(animation.opts.always);
	}

	function propFilter( props, specialEasing ){
		var index, name, easing, value, hooks;

		// camelCase, specialEasing and expand cssHook pass
		for( index in props ){
			name = jQuery.camelCase(index);
			easing = specialEasing[name];
			value = props[index];
			if( jQuery.isArray(value) ){
				easing = value[1];
				value = props[index] = value[0];
			}

			if( index !== name ){
				props[name] = value;
				delete props[index];
			}

			hooks = jQuery.cssHooks[name];
			if( hooks && "expand" in hooks ){
				value = hooks.expand(value);
				delete props[name];

				// not quite $.extend, this wont overwrite keys already present.
				// also - reusing 'index' from above because we have the correct "name"
				for( index in value ){
					if( !(index in props) ){
						props[index] = value[index];
						specialEasing[index] = easing;
					}
				}
			} else{
				specialEasing[name] = easing;
			}
		}
	}

	jQuery.Animation = jQuery.extend(Animation, {

		tweener: function( props, callback ){
			if( jQuery.isFunction(props) ){
				callback = props;
				props = ["*"];
			} else{
				props = props.split(" ");
			}

			var prop, index = 0, length = props.length;

			for( ; index < length; index++ ){
				prop = props[index];
				tweeners[prop] = tweeners[prop] || [];
				tweeners[prop].unshift(callback);
			}
		},

		prefilter: function( callback, prepend ){
			if( prepend ){
				animationPrefilters.unshift(callback);
			} else{
				animationPrefilters.push(callback);
			}
		}
	});

	function defaultPrefilter( elem, props, opts ){
		var index, prop, value, length, dataShow, toggle, tween, hooks, oldfire, anim = this, style = elem.style, orig = {}, handled = [], hidden = elem.nodeType && isHidden(elem);

		// handle queue: false promises
		if( !opts.queue ){
			hooks = jQuery._queueHooks(elem, "fx");
			if( hooks.unqueued == null ){
				hooks.unqueued = 0;
				oldfire = hooks.empty.fire;
				hooks.empty.fire = function(){
					if( !hooks.unqueued ){
						oldfire();
					}
				};
			}
			hooks.unqueued++;

			anim.always(function(){
				// doing this makes sure that the complete handler will be called
				// before this completes
				anim.always(function(){
					hooks.unqueued--;
					if( !jQuery.queue(elem, "fx").length ){
						hooks.empty.fire();
					}
				});
			});
		}

		// height/width overflow pass
		if( elem.nodeType === 1 && ("height" in props || "width" in props) ){
			// Make sure that nothing sneaks out
			// Record all 3 overflow attributes because IE does not
			// change the overflow attribute when overflowX and
			// overflowY are set to the same value
			opts.overflow = [style.overflow, style.overflowX, style.overflowY];

			// Set display property to inline-block for height/width
			// animations on inline elements that are having width/height animated
			if( jQuery.css(elem, "display") === "inline" && jQuery.css(elem, "float") === "none" ){

				// inline-level elements accept inline-block;
				// block-level elements need to be inline with layout
				if( !jQuery.support.inlineBlockNeedsLayout || css_defaultDisplay(elem.nodeName) === "inline" ){
					style.display = "inline-block";

				} else{
					style.zoom = 1;
				}
			}
		}

		if( opts.overflow ){
			style.overflow = "hidden";
			if( !jQuery.support.shrinkWrapBlocks ){
				anim.done(function(){
					style.overflow = opts.overflow[0];
					style.overflowX = opts.overflow[1];
					style.overflowY = opts.overflow[2];
				});
			}
		}


		// show/hide pass
		for( index in props ){
			value = props[index];
			if( rfxtypes.exec(value) ){
				delete props[index];
				toggle = toggle || value === "toggle";
				if( value === (hidden ? "hide" : "show") ){
					continue;
				}
				handled.push(index);
			}
		}

		length = handled.length;
		if( length ){
			dataShow = jQuery._data(elem, "fxshow") || jQuery._data(elem, "fxshow", {});
			if( "hidden" in dataShow ){
				hidden = dataShow.hidden;
			}

			// store state if its toggle - enables .stop().toggle() to "reverse"
			if( toggle ){
				dataShow.hidden = !hidden;
			}
			if( hidden ){
				jQuery(elem).show();
			} else{
				anim.done(function(){
					jQuery(elem).hide();
				});
			}
			anim.done(function(){
				var prop;
				jQuery.removeData(elem, "fxshow", true);
				for( prop in orig ){
					jQuery.style(elem, prop, orig[prop]);
				}
			});
			for( index = 0; index < length; index++ ){
				prop = handled[index];
				tween = anim.createTween(prop, hidden ? dataShow[prop] : 0);
				orig[prop] = dataShow[prop] || jQuery.style(elem, prop);

				if( !(prop in dataShow) ){
					dataShow[prop] = tween.start;
					if( hidden ){
						tween.end = tween.start;
						tween.start = prop === "width" || prop === "height" ? 1 : 0;
					}
				}
			}
		}
	}

	function Tween( elem, options, prop, end, easing ){
		return new Tween.prototype.init(elem, options, prop, end, easing);
	}

	jQuery.Tween = Tween;

	Tween.prototype = {
		constructor: Tween,
		init: function( elem, options, prop, end, easing, unit ){
			this.elem = elem;
			this.prop = prop;
			this.easing = easing || "swing";
			this.options = options;
			this.start = this.now = this.cur();
			this.end = end;
			this.unit = unit || (jQuery.cssNumber[prop] ? "" : "px");
		},
		cur: function(){
			var hooks = Tween.propHooks[this.prop];

			return hooks && hooks.get ? hooks.get(this) : Tween.propHooks._default.get(this);
		},
		run: function( percent ){
			var eased, hooks = Tween.propHooks[this.prop];

			if( this.options.duration ){
				this.pos = eased = jQuery.easing[this.easing](percent, this.options.duration * percent, 0, 1, this.options.duration);
			} else{
				this.pos = eased = percent;
			}
			this.now = (this.end - this.start) * eased + this.start;

			if( this.options.step ){
				this.options.step.call(this.elem, this.now, this);
			}

			if( hooks && hooks.set ){
				hooks.set(this);
			} else{
				Tween.propHooks._default.set(this);
			}
			return this;
		}
	};

	Tween.prototype.init.prototype = Tween.prototype;

	Tween.propHooks = {
		_default: {
			get: function( tween ){
				var result;

				if( tween.elem[tween.prop] != null && (!tween.elem.style || tween.elem.style[tween.prop] == null) ){
					return tween.elem[tween.prop];
				}

				// passing any value as a 4th parameter to .css will automatically
				// attempt a parseFloat and fallback to a string if the parse fails
				// so, simple values such as "10px" are parsed to Float.
				// complex values such as "rotate(1rad)" are returned as is.
				result = jQuery.css(tween.elem, tween.prop, false, "");
				// Empty strings, null, undefined and "auto" are converted to 0.
				return !result || result === "auto" ? 0 : result;
			},
			set: function( tween ){
				// use step hook for back compat - use cssHook if its there - use .style if its
				// available and use plain properties where available
				if( jQuery.fx.step[tween.prop] ){
					jQuery.fx.step[tween.prop](tween);
				} else if( tween.elem.style && (tween.elem.style[jQuery.cssProps[tween.prop]] != null || jQuery.cssHooks[tween.prop]) ){
					jQuery.style(tween.elem, tween.prop, tween.now + tween.unit);
				} else{
					tween.elem[tween.prop] = tween.now;
				}
			}
		}
	};

	// Remove in 2.0 - this supports IE8's panic based approach
	// to setting things on disconnected nodes

	Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
		set: function( tween ){
			if( tween.elem.nodeType && tween.elem.parentNode ){
				tween.elem[tween.prop] = tween.now;
			}
		}
	};

	jQuery.each(["toggle", "show", "hide"], function( i, name ){
		var cssFn = jQuery.fn[name];
		jQuery.fn[name] = function( speed, easing, callback ){
			return speed == null || typeof speed === "boolean" || // special check for .toggle( handler, handler, ... )
				(!i && jQuery.isFunction(speed) && jQuery.isFunction(easing)) ? cssFn.apply(this, arguments) : this.animate(genFx(name, true), speed, easing, callback);
		};
	});

	jQuery.fn.extend({
		fadeTo: function( speed, to, easing, callback ){

			// show any hidden elements after setting opacity to 0
			return this.filter(isHidden).css("opacity", 0).show()

				// animate to the value specified
				.end().animate({ opacity: to }, speed, easing, callback);
		},
		animate: function( prop, speed, easing, callback ){
			var empty = jQuery.isEmptyObject(prop), optall = jQuery.speed(speed, easing, callback), doAnimation = function(){
					// Operate on a copy of prop so per-property easing won't be lost
					var anim = Animation(this, jQuery.extend({}, prop), optall);

					// Empty animations resolve immediately
					if( empty ){
						anim.stop(true);
					}
				};

			return empty || optall.queue === false ? this.each(doAnimation) : this.queue(optall.queue, doAnimation);
		},
		stop: function( type, clearQueue, gotoEnd ){
			var stopQueue = function( hooks ){
				var stop = hooks.stop;
				delete hooks.stop;
				stop(gotoEnd);
			};

			if( typeof type !== "string" ){
				gotoEnd = clearQueue;
				clearQueue = type;
				type = undefined;
			}
			if( clearQueue && type !== false ){
				this.queue(type || "fx", []);
			}

			return this.each(function(){
				var dequeue = true, index = type != null && type + "queueHooks", timers = jQuery.timers, data = jQuery._data(this);

				if( index ){
					if( data[index] && data[index].stop ){
						stopQueue(data[index]);
					}
				} else{
					for( index in data ){
						if( data[index] && data[index].stop && rrun.test(index) ){
							stopQueue(data[index]);
						}
					}
				}

				for( index = timers.length; index--; ){
					if( timers[index].elem === this && (type == null || timers[index].queue === type) ){
						timers[index].anim.stop(gotoEnd);
						dequeue = false;
						timers.splice(index, 1);
					}
				}

				// start the next in the queue if the last step wasn't forced
				// timers currently will call their complete callbacks, which will dequeue
				// but only if they were gotoEnd
				if( dequeue || !gotoEnd ){
					jQuery.dequeue(this, type);
				}
			});
		}
	});

	// Generate parameters to create a standard animation
	function genFx( type, includeWidth ){
		var which, attrs = { height: type }, i = 0;

		// if we include width, step value is 1 to do all cssExpand values,
		// if we don't include width, step value is 2 to skip over Left and Right
		includeWidth = includeWidth ? 1 : 0;
		for( ; i < 4; i += 2 - includeWidth ){
			which = cssExpand[i];
			attrs["margin" + which] = attrs["padding" + which] = type;
		}

		if( includeWidth ){
			attrs.opacity = attrs.width = type;
		}

		return attrs;
	}

	// Generate shortcuts for custom animations
	jQuery.each({
		slideDown: genFx("show"),
		slideUp: genFx("hide"),
		slideToggle: genFx("toggle"),
		fadeIn: { opacity: "show" },
		fadeOut: { opacity: "hide" },
		fadeToggle: { opacity: "toggle" }
	}, function( name, props ){
		jQuery.fn[name] = function( speed, easing, callback ){
			return this.animate(props, speed, easing, callback);
		};
	});

	jQuery.speed = function( speed, easing, fn ){
		var opt = speed && typeof speed === "object" ? jQuery.extend({}, speed) : {
			complete: fn || !fn && easing || jQuery.isFunction(speed) && speed,
			duration: speed,
			easing: fn && easing || easing && !jQuery.isFunction(easing) && easing
		};

		opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration : opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[opt.duration] : jQuery.fx.speeds._default;

		// normalize opt.queue - true/undefined/null -> "fx"
		if( opt.queue == null || opt.queue === true ){
			opt.queue = "fx";
		}

		// Queueing
		opt.old = opt.complete;

		opt.complete = function(){
			if( jQuery.isFunction(opt.old) ){
				opt.old.call(this);
			}

			if( opt.queue ){
				jQuery.dequeue(this, opt.queue);
			}
		};

		return opt;
	};

	jQuery.easing = {
		linear: function( p ){
			return p;
		},
		swing: function( p ){
			return 0.5 - Math.cos(p * Math.PI) / 2;
		}
	};

	jQuery.timers = [];
	jQuery.fx = Tween.prototype.init;
	jQuery.fx.tick = function(){
		var timer, timers = jQuery.timers, i = 0;

		fxNow = jQuery.now();

		for( ; i < timers.length; i++ ){
			timer = timers[i];
			// Checks the timer has not already been removed
			if( !timer() && timers[i] === timer ){
				timers.splice(i--, 1);
			}
		}

		if( !timers.length ){
			jQuery.fx.stop();
		}
		fxNow = undefined;
	};

	jQuery.fx.timer = function( timer ){
		if( timer() && jQuery.timers.push(timer) && !timerId ){
			timerId = setInterval(jQuery.fx.tick, jQuery.fx.interval);
		}
	};

	jQuery.fx.interval = 13;

	jQuery.fx.stop = function(){
		clearInterval(timerId);
		timerId = null;
	};

	jQuery.fx.speeds = {
		slow: 600,
		fast: 200,
		// Default speed
		_default: 400
	};

	// Back Compat <1.8 extension point
	jQuery.fx.step = {};

	if( jQuery.expr && jQuery.expr.filters ){
		jQuery.expr.filters.animated = function( elem ){
			return jQuery.grep(jQuery.timers,function( fn ){
				return elem === fn.elem;
			}).length;
		};
	}
	var rroot = /^(?:body|html)$/i;

	jQuery.fn.offset = function( options ){
		if( arguments.length ){
			return options === undefined ? this : this.each(function( i ){
				jQuery.offset.setOffset(this, options, i);
			});
		}

		var docElem, body, win, clientTop, clientLeft, scrollTop, scrollLeft, box = { top: 0, left: 0 }, elem = this[0], doc = elem && elem.ownerDocument;

		if( !doc ){
			return;
		}

		if( (body = doc.body) === elem ){
			return jQuery.offset.bodyOffset(elem);
		}

		docElem = doc.documentElement;

		// Make sure it's not a disconnected DOM node
		if( !jQuery.contains(docElem, elem) ){
			return box;
		}

		// If we don't have gBCR, just use 0,0 rather than error
		// BlackBerry 5, iOS 3 (original iPhone)
		if( typeof elem.getBoundingClientRect !== "undefined" ){
			box = elem.getBoundingClientRect();
		}
		win = getWindow(doc);
		clientTop = docElem.clientTop || body.clientTop || 0;
		clientLeft = docElem.clientLeft || body.clientLeft || 0;
		scrollTop = win.pageYOffset || docElem.scrollTop;
		scrollLeft = win.pageXOffset || docElem.scrollLeft;
		return {
			top: box.top + scrollTop - clientTop,
			left: box.left + scrollLeft - clientLeft
		};
	};

	jQuery.offset = {

		bodyOffset: function( body ){
			var top = body.offsetTop, left = body.offsetLeft;

			if( jQuery.support.doesNotIncludeMarginInBodyOffset ){
				top += parseFloat(jQuery.css(body, "marginTop")) || 0;
				left += parseFloat(jQuery.css(body, "marginLeft")) || 0;
			}

			return { top: top, left: left };
		},

		setOffset: function( elem, options, i ){
			var position = jQuery.css(elem, "position");

			// set position first, in-case top/left are set even on static elem
			if( position === "static" ){
				elem.style.position = "relative";
			}

			var curElem = jQuery(elem), curOffset = curElem.offset(), curCSSTop = jQuery.css(elem, "top"), curCSSLeft = jQuery.css(elem, "left"), calculatePosition = (position === "absolute" || position === "fixed") && jQuery.inArray("auto", [curCSSTop, curCSSLeft]) > -1, props = {}, curPosition = {}, curTop, curLeft;

			// need to be able to calculate position if either top or left is auto and position is either absolute or fixed
			if( calculatePosition ){
				curPosition = curElem.position();
				curTop = curPosition.top;
				curLeft = curPosition.left;
			} else{
				curTop = parseFloat(curCSSTop) || 0;
				curLeft = parseFloat(curCSSLeft) || 0;
			}

			if( jQuery.isFunction(options) ){
				options = options.call(elem, i, curOffset);
			}

			if( options.top != null ){
				props.top = (options.top - curOffset.top) + curTop;
			}
			if( options.left != null ){
				props.left = (options.left - curOffset.left) + curLeft;
			}

			if( "using" in options ){
				options.using.call(elem, props);
			} else{
				curElem.css(props);
			}
		}
	};


	jQuery.fn.extend({

		position: function(){
			if( !this[0] ){
				return;
			}

			var elem = this[0],

			// Get *real* offsetParent
				offsetParent = this.offsetParent(),

			// Get correct offsets
				offset = this.offset(), parentOffset = rroot.test(offsetParent[0].nodeName) ? { top: 0, left: 0 } : offsetParent.offset();

			// Subtract element margins
			// note: when an element has margin: auto the offsetLeft and marginLeft
			// are the same in Safari causing offset.left to incorrectly be 0
			offset.top -= parseFloat(jQuery.css(elem, "marginTop")) || 0;
			offset.left -= parseFloat(jQuery.css(elem, "marginLeft")) || 0;

			// Add offsetParent borders
			parentOffset.top += parseFloat(jQuery.css(offsetParent[0], "borderTopWidth")) || 0;
			parentOffset.left += parseFloat(jQuery.css(offsetParent[0], "borderLeftWidth")) || 0;

			// Subtract the two offsets
			return {
				top: offset.top - parentOffset.top,
				left: offset.left - parentOffset.left
			};
		},

		offsetParent: function(){
			return this.map(function(){
				var offsetParent = this.offsetParent || document.body;
				while( offsetParent && (!rroot.test(offsetParent.nodeName) && jQuery.css(offsetParent, "position") === "static") ){
					offsetParent = offsetParent.offsetParent;
				}
				return offsetParent || document.body;
			});
		}
	});


	// Create scrollLeft and scrollTop methods
	jQuery.each({ scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function( method, prop ){
		var top = /Y/.test(prop);

		jQuery.fn[method] = function( val ){
			return jQuery.access(this, function( elem, method, val ){
				var win = getWindow(elem);

				if( val === undefined ){
					return win ? (prop in win) ? win[prop] : win.document.documentElement[method] : elem[method];
				}

				if( win ){
					win.scrollTo(!top ? val : jQuery(win).scrollLeft(), top ? val : jQuery(win).scrollTop());

				} else{
					elem[method] = val;
				}
			}, method, val, arguments.length, null);
		};
	});

	function getWindow( elem ){
		return jQuery.isWindow(elem) ? elem : elem.nodeType === 9 ? elem.defaultView || elem.parentWindow : false;
	}

	// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
	jQuery.each({ Height: "height", Width: "width" }, function( name, type ){
		jQuery.each({ padding: "inner" + name, content: type, "": "outer" + name }, function( defaultExtra, funcName ){
			// margin is only for outerHeight, outerWidth
			jQuery.fn[funcName] = function( margin, value ){
				var chainable = arguments.length && (defaultExtra || typeof margin !== "boolean"), extra = defaultExtra || (margin === true || value === true ? "margin" : "border");

				return jQuery.access(this, function( elem, type, value ){
					var doc;

					if( jQuery.isWindow(elem) ){
						// As of 5/8/2012 this will yield incorrect results for Mobile Safari, but there
						// isn't a whole lot we can do. See pull request at this URL for discussion:
						// https://github.com/jquery/jquery/pull/764
						return elem.document.documentElement["client" + name];
					}

					// Get document width or height
					if( elem.nodeType === 9 ){
						doc = elem.documentElement;

						// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height], whichever is greatest
						// unfortunately, this causes bug #3838 in IE6/8 only, but there is currently no good, small way to fix it.
						return Math.max(elem.body["scroll" + name], doc["scroll" + name], elem.body["offset" + name], doc["offset" + name], doc["client" + name]);
					}

					return value === undefined ? // Get width or height on the element, requesting but not forcing parseFloat
						jQuery.css(elem, type, value, extra) :

						// Set width or height on the element
						jQuery.style(elem, type, value, extra);
				}, type, chainable ? margin : undefined, chainable, null);
			};
		});
	});
	// Expose jQuery to the global object
	window.jQuery = window.$ = jQuery;

	// Expose jQuery as an AMD module, but only for AMD loaders that
	// understand the issues with loading multiple versions of jQuery
	// in a page that all might call define(). The loader will indicate
	// they have special allowances for multiple jQuery versions by
	// specifying define.amd.jQuery = true. Register as a named module,
	// since jQuery can be concatenated with other files that may use define,
	// but not use a proper concatenation script that understands anonymous
	// AMD modules. A named AMD is safest and most robust way to register.
	// Lowercase jquery is used because AMD module names are derived from
	// file names, and jQuery is normally delivered in a lowercase file name.
	// Do this after creating the global so that if an AMD module wants to call
	// noConflict to hide this version of jQuery, it will work.
	if( typeof define === "function" && define.amd && define.amd.jQuery ){
		define("jquery", [], function(){
			return jQuery;
		});
	}

})(window);



/*
 * jQuery Mobile v1.3.2
 * http://jquerymobile.com
 *
 * Copyright 2010, 2013 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 */


// This plugin is an experiment for abstracting away the touch and mouse
// events so that developers don't have to worry about which method of input
// the device their document is loaded on supports.
//
// The idea here is to allow the developer to register listeners for the
// basic mouse events, such as mousedown, mousemove, mouseup, and click,
// and the plugin will take care of registering the correct listeners
// behind the scenes to invoke the listener at the fastest possible time
// for that device, while still retaining the order of event firing in
// the traditional mouse environment, should multiple handlers be registered
// on the same element for different events.
//
// The current version exposes the following virtual events to jQuery bind methods:
// "vmouseover vmousedown vmousemove vmouseup vclick vmouseout vmousecancel"

(function( $, window, document, undefined ){

	var dataPropertyName = "virtualMouseBindings", touchTargetPropertyName = "virtualTouchID", virtualEventNames = "vmouseover vmousedown vmousemove vmouseup vclick vmouseout vmousecancel".split(" "), touchEventProps = "clientX clientY pageX pageY screenX screenY".split(" "), mouseHookProps = $.event.mouseHooks ? $.event.mouseHooks.props : [], mouseEventProps = $.event.props.concat(mouseHookProps), activeDocHandlers = {}, resetTimerID = 0, startX = 0, startY = 0, didScroll = false, clickBlockList = [], blockMouseTriggers = false, blockTouchTriggers = false, eventCaptureSupported = "addEventListener" in document, $document = $(document), nextTouchID = 1, lastTouchID = 0, threshold;

	$.vmouse = {
		moveDistanceThreshold: 10,
		clickDistanceThreshold: 10,
		resetTimerDuration: 1500
	};

	function getNativeEvent( event ){

		while( event && typeof event.originalEvent !== "undefined" ){
			event = event.originalEvent;
		}
		return event;
	}

	function createVirtualEvent( event, eventType ){

		var t = event.type, oe, props, ne, prop, ct, touch, i, j, len;

		event = $.Event(event);
		event.type = eventType;

		oe = event.originalEvent;
		props = $.event.props;

		// addresses separation of $.event.props in to $.event.mouseHook.props and Issue 3280
		// https://github.com/jquery/jquery-mobile/issues/3280
		if( t.search(/^(mouse|click)/) > -1 ){
			props = mouseEventProps;
		}

		// copy original event properties over to the new event
		// this would happen if we could call $.event.fix instead of $.Event
		// but we don't have a way to force an event to be fixed multiple times
		if( oe ){
			for( i = props.length, prop; i; ){
				prop = props[ --i ];
				event[ prop ] = oe[ prop ];
			}
		}

		// make sure that if the mouse and click virtual events are generated
		// without a .which one is defined
		if( t.search(/mouse(down|up)|click/) > -1 && !event.which ){
			event.which = 1;
		}

		if( t.search(/^touch/) !== -1 ){
			ne = getNativeEvent(oe);
			t = ne.touches;
			ct = ne.changedTouches;
			touch = ( t && t.length ) ? t[0] : ( ( ct && ct.length ) ? ct[ 0 ] : undefined );

			if( touch ){
				for( j = 0, len = touchEventProps.length; j < len; j++ ){
					prop = touchEventProps[ j ];
					event[ prop ] = touch[ prop ];
				}
			}
		}

		return event;
	}

	function getVirtualBindingFlags( element ){

		var flags = {}, b, k;

		while( element ){

			b = $.data(element, dataPropertyName);

			for( k in b ){
				if( b[ k ] ){
					flags[ k ] = flags.hasVirtualBinding = true;
				}
			}
			element = element.parentNode;
		}
		return flags;
	}

	function getClosestElementWithVirtualBinding( element, eventType ){
		var b;
		while( element ){

			b = $.data(element, dataPropertyName);

			if( b && ( !eventType || b[ eventType ] ) ){
				return element;
			}
			element = element.parentNode;
		}
		return null;
	}

	function enableTouchBindings(){
		blockTouchTriggers = false;
	}

	function disableTouchBindings(){
		blockTouchTriggers = true;
	}

	function enableMouseBindings(){
		lastTouchID = 0;
		clickBlockList.length = 0;
		blockMouseTriggers = false;

		// When mouse bindings are enabled, our
		// touch bindings are disabled.
		disableTouchBindings();
	}

	function disableMouseBindings(){
		// When mouse bindings are disabled, our
		// touch bindings are enabled.
		enableTouchBindings();
	}

	function startResetTimer(){
		clearResetTimer();
		resetTimerID = setTimeout(function(){
			resetTimerID = 0;
			enableMouseBindings();
		}, $.vmouse.resetTimerDuration);
	}

	function clearResetTimer(){
		if( resetTimerID ){
			clearTimeout(resetTimerID);
			resetTimerID = 0;
		}
	}

	function triggerVirtualEvent( eventType, event, flags ){
		var ve;

		if( ( flags && flags[ eventType ] ) || ( !flags && getClosestElementWithVirtualBinding(event.target, eventType) ) ){

			ve = createVirtualEvent(event, eventType);

			$(event.target).trigger(ve);
		}

		return ve;
	}

	function mouseEventCallback( event ){
		var touchID = $.data(event.target, touchTargetPropertyName);

		if( !blockMouseTriggers && ( !lastTouchID || lastTouchID !== touchID ) ){
			var ve = triggerVirtualEvent("v" + event.type, event);
			if( ve ){
				if( ve.isDefaultPrevented() ){
					event.preventDefault();
				}
				if( ve.isPropagationStopped() ){
					event.stopPropagation();
				}
				if( ve.isImmediatePropagationStopped() ){
					event.stopImmediatePropagation();
				}
			}
		}
	}

	function handleTouchStart( event ){

		var touches = getNativeEvent(event).touches, target, flags;

		if( touches && touches.length === 1 ){

			target = event.target;
			flags = getVirtualBindingFlags(target);

			if( flags.hasVirtualBinding ){

				lastTouchID = nextTouchID++;
				$.data(target, touchTargetPropertyName, lastTouchID);

				clearResetTimer();

				disableMouseBindings();
				didScroll = false;

				var t = getNativeEvent(event).touches[ 0 ];
				startX = t.pageX;
				startY = t.pageY;

				triggerVirtualEvent("vmouseover", event, flags);
				triggerVirtualEvent("vmousedown", event, flags);
			}
		}
	}

	function handleScroll( event ){
		if( blockTouchTriggers ){
			return;
		}

		if( !didScroll ){
			triggerVirtualEvent("vmousecancel", event, getVirtualBindingFlags(event.target));
		}

		didScroll = true;
		startResetTimer();
	}

	function handleTouchMove( event ){
		if( blockTouchTriggers ){
			return;
		}

		var t = getNativeEvent(event).touches[ 0 ], didCancel = didScroll, moveThreshold = $.vmouse.moveDistanceThreshold, flags = getVirtualBindingFlags(event.target);

		didScroll = didScroll || ( Math.abs(t.pageX - startX) > moveThreshold || Math.abs(t.pageY - startY) > moveThreshold );


		if( didScroll && !didCancel ){
			triggerVirtualEvent("vmousecancel", event, flags);
		}

		triggerVirtualEvent("vmousemove", event, flags);
		startResetTimer();
	}

	function handleTouchEnd( event ){
		if( blockTouchTriggers ){
			return;
		}

		disableTouchBindings();

		var flags = getVirtualBindingFlags(event.target), t;
		triggerVirtualEvent("vmouseup", event, flags);

		if( !didScroll ){
			var ve = triggerVirtualEvent("vclick", event, flags);
			if( ve && ve.isDefaultPrevented() ){
				// The target of the mouse events that follow the touchend
				// event don't necessarily match the target used during the
				// touch. This means we need to rely on coordinates for blocking
				// any click that is generated.
				t = getNativeEvent(event).changedTouches[ 0 ];
				clickBlockList.push({
					touchID: lastTouchID,
					x: t.clientX,
					y: t.clientY
				});

				// Prevent any mouse events that follow from triggering
				// virtual event notifications.
				blockMouseTriggers = true;
			}
		}
		triggerVirtualEvent("vmouseout", event, flags);
		didScroll = false;

		startResetTimer();
	}

	function hasVirtualBindings( ele ){
		var bindings = $.data(ele, dataPropertyName), k;

		if( bindings ){
			for( k in bindings ){
				if( bindings[ k ] ){
					return true;
				}
			}
		}
		return false;
	}

	function dummyMouseHandler(){
	}

	function getSpecialEventObject( eventType ){
		var realType = eventType.substr(1);

		return {
			setup: function( data, namespace ){
				// If this is the first virtual mouse binding for this element,
				// add a bindings object to its data.

				if( !hasVirtualBindings(this) ){
					$.data(this, dataPropertyName, {});
				}

				// If setup is called, we know it is the first binding for this
				// eventType, so initialize the count for the eventType to zero.
				var bindings = $.data(this, dataPropertyName);
				bindings[ eventType ] = true;

				// If this is the first virtual mouse event for this type,
				// register a global handler on the document.

				activeDocHandlers[ eventType ] = ( activeDocHandlers[ eventType ] || 0 ) + 1;

				if( activeDocHandlers[ eventType ] === 1 ){
					$document.bind(realType, mouseEventCallback);
				}

				// Some browsers, like Opera Mini, won't dispatch mouse/click events
				// for elements unless they actually have handlers registered on them.
				// To get around this, we register dummy handlers on the elements.

				$(this).bind(realType, dummyMouseHandler);

				// For now, if event capture is not supported, we rely on mouse handlers.
				if( eventCaptureSupported ){
					// If this is the first virtual mouse binding for the document,
					// register our touchstart handler on the document.

					activeDocHandlers[ "touchstart" ] = ( activeDocHandlers[ "touchstart" ] || 0) + 1;

					if( activeDocHandlers[ "touchstart" ] === 1 ){
						$document.bind("touchstart", handleTouchStart).bind("touchend", handleTouchEnd)

							// On touch platforms, touching the screen and then dragging your finger
							// causes the window content to scroll after some distance threshold is
							// exceeded. On these platforms, a scroll prevents a click event from being
							// dispatched, and on some platforms, even the touchend is suppressed. To
							// mimic the suppression of the click event, we need to watch for a scroll
							// event. Unfortunately, some platforms like iOS don't dispatch scroll
							// events until *AFTER* the user lifts their finger (touchend). This means
							// we need to watch both scroll and touchmove events to figure out whether
							// or not a scroll happenens before the touchend event is fired.

							.bind("touchmove", handleTouchMove).bind("scroll", handleScroll);
					}
				}
			},

			teardown: function( data, namespace ){
				// If this is the last virtual binding for this eventType,
				// remove its global handler from the document.

				--activeDocHandlers[ eventType ];

				if( !activeDocHandlers[ eventType ] ){
					$document.unbind(realType, mouseEventCallback);
				}

				if( eventCaptureSupported ){
					// If this is the last virtual mouse binding in existence,
					// remove our document touchstart listener.

					--activeDocHandlers[ "touchstart" ];

					if( !activeDocHandlers[ "touchstart" ] ){
						$document.unbind("touchstart", handleTouchStart).unbind("touchmove", handleTouchMove).unbind("touchend", handleTouchEnd).unbind("scroll", handleScroll);
					}
				}

				var $this = $(this), bindings = $.data(this, dataPropertyName);

				// teardown may be called when an element was
				// removed from the DOM. If this is the case,
				// jQuery core may have already stripped the element
				// of any data bindings so we need to check it before
				// using it.
				if( bindings ){
					bindings[ eventType ] = false;
				}

				// Unregister the dummy event handler.

				$this.unbind(realType, dummyMouseHandler);

				// If this is the last virtual mouse binding on the
				// element, remove the binding data from the element.

				if( !hasVirtualBindings(this) ){
					$this.removeData(dataPropertyName);
				}
			}
		};
	}

	// Expose our custom events to the jQuery bind/unbind mechanism.

	for( var i = 0; i < virtualEventNames.length; i++ ){
		$.event.special[ virtualEventNames[ i ] ] = getSpecialEventObject(virtualEventNames[ i ]);
	}

	// Add a capture click handler to block clicks.
	// Note that we require event capture support for this so if the device
	// doesn't support it, we punt for now and rely solely on mouse events.
	if( eventCaptureSupported ){
		document.addEventListener("click", function( e ){
			var cnt = clickBlockList.length, target = e.target, x, y, ele, i, o, touchID;

			if( cnt ){
				x = e.clientX;
				y = e.clientY;
				threshold = $.vmouse.clickDistanceThreshold;

				// The idea here is to run through the clickBlockList to see if
				// the current click event is in the proximity of one of our
				// vclick events that had preventDefault() called on it. If we find
				// one, then we block the click.
				//
				// Why do we have to rely on proximity?
				//
				// Because the target of the touch event that triggered the vclick
				// can be different from the target of the click event synthesized
				// by the browser. The target of a mouse/click event that is syntehsized
				// from a touch event seems to be implementation specific. For example,
				// some browsers will fire mouse/click events for a link that is near
				// a touch event, even though the target of the touchstart/touchend event
				// says the user touched outside the link. Also, it seems that with most
				// browsers, the target of the mouse/click event is not calculated until the
				// time it is dispatched, so if you replace an element that you touched
				// with another element, the target of the mouse/click will be the new
				// element underneath that point.
				//
				// Aside from proximity, we also check to see if the target and any
				// of its ancestors were the ones that blocked a click. This is necessary
				// because of the strange mouse/click target calculation done in the
				// Android 2.1 browser, where if you click on an element, and there is a
				// mouse/click handler on one of its ancestors, the target will be the
				// innermost child of the touched element, even if that child is no where
				// near the point of touch.

				ele = target;

				while( ele ){
					for( i = 0; i < cnt; i++ ){
						o = clickBlockList[ i ];
						touchID = 0;

						if( ( ele === target && Math.abs(o.x - x) < threshold && Math.abs(o.y - y) < threshold ) || $.data(ele, touchTargetPropertyName) === o.touchID ){
							// XXX: We may want to consider removing matches from the block list
							//      instead of waiting for the reset timer to fire.
							e.preventDefault();
							e.stopPropagation();
							return;
						}
					}
					ele = ele.parentNode;
				}
			}
		}, true);
	}
})(jQuery, window, document);

(function( $ ){
	$.mobile = {};
}(jQuery));
(function( $, undefined ){
	var support = {
		touch: "ontouchend" in document
	};

	$.mobile.support = $.mobile.support || {};
	$.extend($.support, support);
	$.extend($.mobile.support, support);
}(jQuery));


(function( $, window, undefined ){
	var $document = $(document);

	// add new event shortcuts
	$.each(( "touchstart touchmove touchend " + "tap taphold " + "swipe swipeleft swiperight " + "scrollstart scrollstop" ).split(" "), function( i, name ){

		$.fn[ name ] = function( fn ){
			return fn ? this.bind(name, fn) : this.trigger(name);
		};

		// jQuery < 1.8
		if( $.attrFn ){
			$.attrFn[ name ] = true;
		}
	});

	var supportTouch = $.mobile.support.touch, scrollEvent = "touchmove scroll", touchStartEvent = supportTouch ? "touchstart" : "mousedown", touchStopEvent = supportTouch ? "touchend" : "mouseup", touchMoveEvent = supportTouch ? "touchmove" : "mousemove";

	function triggerCustomEvent( obj, eventType, event ){
		var originalType = event.type;
		event.type = eventType;
		$.event.dispatch.call(obj, event);
		event.type = originalType;
	}

	// also handles scrollstop
	$.event.special.scrollstart = {

		enabled: true,

		setup: function(){

			var thisObject = this, $this = $(thisObject), scrolling, timer;

			function trigger( event, state ){
				scrolling = state;
				triggerCustomEvent(thisObject, scrolling ? "scrollstart" : "scrollstop", event);
			}

			// iPhone triggers scroll after a small delay; use touchmove instead
			$this.bind(scrollEvent, function( event ){

				if( !$.event.special.scrollstart.enabled ){
					return;
				}

				if( !scrolling ){
					trigger(event, true);
				}

				clearTimeout(timer);
				timer = setTimeout(function(){
					trigger(event, false);
				}, 50);
			});
		}
	};

	// also handles taphold
	$.event.special.tap = {
		tapholdThreshold: 750,

		setup: function(){
			var thisObject = this, $this = $(thisObject);

			$this.bind("vmousedown", function( event ){

				if( event.which && event.which !== 1 ){
					return false;
				}

				var origTarget = event.target, origEvent = event.originalEvent, timer;

				function clearTapTimer(){
					clearTimeout(timer);
				}

				function clearTapHandlers(){
					clearTapTimer();

					$this.unbind("vclick", clickHandler).unbind("vmouseup", clearTapTimer);
					$document.unbind("vmousecancel", clearTapHandlers);
				}

				function clickHandler( event ){
					clearTapHandlers();

					// ONLY trigger a 'tap' event if the start target is
					// the same as the stop target.
					if( origTarget === event.target ){
						triggerCustomEvent(thisObject, "tap", event);
					}
				}

				$this.bind("vmouseup", clearTapTimer).bind("vclick", clickHandler);
				$document.bind("vmousecancel", clearTapHandlers);

				timer = setTimeout(function(){
					triggerCustomEvent(thisObject, "taphold", $.Event("taphold", { target: origTarget }));
				}, $.event.special.tap.tapholdThreshold);
			});
		}
	};

	// also handles swipeleft, swiperight
	$.event.special.swipe = {
		scrollSupressionThreshold: 30, // More than this horizontal displacement, and we will suppress scrolling.

		durationThreshold: 1000, // More time than this, and it isn't a swipe.

		horizontalDistanceThreshold: 30,  // Swipe horizontal displacement must be more than this.

		verticalDistanceThreshold: 75,  // Swipe vertical displacement must be less than this.

		start: function( event ){
			var data = event.originalEvent.touches ? event.originalEvent.touches[ 0 ] : event;
			return {
				time: ( new Date() ).getTime(),
				coords: [ data.pageX, data.pageY ],
				origin: $(event.target)
			};
		},

		stop: function( event ){
			var data = event.originalEvent.touches ? event.originalEvent.touches[ 0 ] : event;
			return {
				time: ( new Date() ).getTime(),
				coords: [ data.pageX, data.pageY ]
			};
		},

		handleSwipe: function( start, stop ){
			if( stop.time - start.time < $.event.special.swipe.durationThreshold && Math.abs(start.coords[ 0 ] - stop.coords[ 0 ]) > $.event.special.swipe.horizontalDistanceThreshold && Math.abs(start.coords[ 1 ] - stop.coords[ 1 ]) < $.event.special.swipe.verticalDistanceThreshold ){

				start.origin.trigger("swipe").trigger(start.coords[0] > stop.coords[ 0 ] ? "swipeleft" : "swiperight");
			}
		},

		setup: function(){
			var thisObject = this, $this = $(thisObject);

			$this.bind(touchStartEvent, function( event ){
				var start = $.event.special.swipe.start(event), stop;

				function moveHandler( event ){
					if( !start ){
						return;
					}

					stop = $.event.special.swipe.stop(event);

					// prevent scrolling
					if( Math.abs(start.coords[ 0 ] - stop.coords[ 0 ]) > $.event.special.swipe.scrollSupressionThreshold ){
						event.preventDefault();
					}
				}

				$this.bind(touchMoveEvent, moveHandler).one(touchStopEvent, function(){
						$this.unbind(touchMoveEvent, moveHandler);

						if( start && stop ){
							$.event.special.swipe.handleSwipe(start, stop);
						}
						start = stop = undefined;
					});
			});
		}
	};
	$.each({
		scrollstop: "scrollstart",
		taphold: "tap",
		swipeleft: "swipe",
		swiperight: "swipe"
	}, function( event, sourceEvent ){

		$.event.special[ event ] = {
			setup: function(){
				$(this).bind(sourceEvent, $.noop);
			}
		};
	});

})(jQuery, this);
// Knockout JavaScript library v3.0.0
// (c) Steven Sanderson - http://knockoutjs.com/
// License: MIT (http://www.opensource.org/licenses/mit-license.php)

(function(){
	var DEBUG=true;
	(function(undefined){
		// (0, eval)('this') is a robust way of getting a reference to the global object
		// For details, see http://stackoverflow.com/questions/14119988/return-this-0-evalthis/14120023#14120023
		var window = this || (0, eval)('this'),
			document = window['document'],
			navigator = window['navigator'],
			jQuery = window["jQuery"],
			JSON = window["JSON"];
		(function(factory) {
			// Support three module loading scenarios
			if (typeof require === 'function' && typeof exports === 'object' && typeof module === 'object') {
				// [1] CommonJS/Node.js
				var target = module['exports'] || exports; // module.exports is for Node.js
				factory(target);
			} else if (typeof define === 'function' && define['amd']) {
				// [2] AMD anonymous module
				define('knockout',['exports'], factory);
			} else {
				// [3] No module loader (plain <script> tag) - put directly in global namespace
				factory(window['ko'] = {});
			}
		}(function(koExports){
// Internally, all KO objects are attached to koExports (even the non-exported ones whose names will be minified by the closure compiler).
// In the future, the following "ko" variable may be made distinct from "koExports" so that private objects are not externally reachable.
			var ko = typeof koExports !== 'undefined' ? koExports : {};
// Google Closure Compiler helpers (used only to make the minified file smaller)
			ko.exportSymbol = function(koPath, object) {
				var tokens = koPath.split(".");

				// In the future, "ko" may become distinct from "koExports" (so that non-exported objects are not reachable)
				// At that point, "target" would be set to: (typeof koExports !== "undefined" ? koExports : ko)
				var target = ko;

				for (var i = 0; i < tokens.length - 1; i++)
					target = target[tokens[i]];
				target[tokens[tokens.length - 1]] = object;
			};
			ko.exportProperty = function(owner, publicName, object) {
				owner[publicName] = object;
			};
			ko.version = "3.0.0";

			ko.exportSymbol('version', ko.version);
			ko.utils = (function () {
				var objectForEach = function(obj, action) {
					for (var prop in obj) {
						if (obj.hasOwnProperty(prop)) {
							action(prop, obj[prop]);
						}
					}
				};

				// Represent the known event types in a compact way, then at runtime transform it into a hash with event name as key (for fast lookup)
				var knownEvents = {}, knownEventTypesByEventName = {};
				var keyEventTypeName = (navigator && /Firefox\/2/i.test(navigator.userAgent)) ? 'KeyboardEvent' : 'UIEvents';
				knownEvents[keyEventTypeName] = ['keyup', 'keydown', 'keypress'];
				knownEvents['MouseEvents'] = ['click', 'dblclick', 'mousedown', 'mouseup', 'mousemove', 'mouseover', 'mouseout', 'mouseenter', 'mouseleave'];
				objectForEach(knownEvents, function(eventType, knownEventsForType) {
					if (knownEventsForType.length) {
						for (var i = 0, j = knownEventsForType.length; i < j; i++)
							knownEventTypesByEventName[knownEventsForType[i]] = eventType;
					}
				});
				var eventsThatMustBeRegisteredUsingAttachEvent = { 'propertychange': true }; // Workaround for an IE9 issue - https://github.com/SteveSanderson/knockout/issues/406

				// Detect IE versions for bug workarounds (uses IE conditionals, not UA string, for robustness)
				// Note that, since IE 10 does not support conditional comments, the following logic only detects IE < 10.
				// Currently this is by design, since IE 10+ behaves correctly when treated as a standard browser.
				// If there is a future need to detect specific versions of IE10+, we will amend this.
				var ieVersion = document && (function() {
					var version = 3, div = document.createElement('div'), iElems = div.getElementsByTagName('i');

					// Keep constructing conditional HTML blocks until we hit one that resolves to an empty fragment
					while (
						div.innerHTML = '<!--[if gt IE ' + (++version) + ']><i></i><![endif]-->',
							iElems[0]
						) {}
					return version > 4 ? version : undefined;
				}());
				var isIe6 = ieVersion === 6,
					isIe7 = ieVersion === 7;

				function isClickOnCheckableElement(element, eventType) {
					if ((ko.utils.tagNameLower(element) !== "input") || !element.type) return false;
					if (eventType.toLowerCase() != "click") return false;
					var inputType = element.type;
					return (inputType == "checkbox") || (inputType == "radio");
				}

				return {
					fieldsIncludedWithJsonPost: ['authenticity_token', /^__RequestVerificationToken(_.*)?$/],

					arrayForEach: function (array, action) {
						for (var i = 0, j = array.length; i < j; i++)
							action(array[i]);
					},

					arrayIndexOf: function (array, item) {
						if (typeof Array.prototype.indexOf == "function")
							return Array.prototype.indexOf.call(array, item);
						for (var i = 0, j = array.length; i < j; i++)
							if (array[i] === item)
								return i;
						return -1;
					},

					arrayFirst: function (array, predicate, predicateOwner) {
						for (var i = 0, j = array.length; i < j; i++)
							if (predicate.call(predicateOwner, array[i]))
								return array[i];
						return null;
					},

					arrayRemoveItem: function (array, itemToRemove) {
						var index = ko.utils.arrayIndexOf(array, itemToRemove);
						if (index >= 0)
							array.splice(index, 1);
					},

					arrayGetDistinctValues: function (array) {
						array = array || [];
						var result = [];
						for (var i = 0, j = array.length; i < j; i++) {
							if (ko.utils.arrayIndexOf(result, array[i]) < 0)
								result.push(array[i]);
						}
						return result;
					},

					arrayMap: function (array, mapping) {
						array = array || [];
						var result = [];
						for (var i = 0, j = array.length; i < j; i++)
							result.push(mapping(array[i]));
						return result;
					},

					arrayFilter: function (array, predicate) {
						array = array || [];
						var result = [];
						for (var i = 0, j = array.length; i < j; i++)
							if (predicate(array[i]))
								result.push(array[i]);
						return result;
					},

					arrayPushAll: function (array, valuesToPush) {
						if (valuesToPush instanceof Array)
							array.push.apply(array, valuesToPush);
						else
							for (var i = 0, j = valuesToPush.length; i < j; i++)
								array.push(valuesToPush[i]);
						return array;
					},

					addOrRemoveItem: function(array, value, included) {
						var existingEntryIndex = ko.utils.arrayIndexOf(ko.utils.peekObservable(array), value);
						if (existingEntryIndex < 0) {
							if (included)
								array.push(value);
						} else {
							if (!included)
								array.splice(existingEntryIndex, 1);
						}
					},

					extend: function (target, source) {
						if (source) {
							for(var prop in source) {
								if(source.hasOwnProperty(prop)) {
									target[prop] = source[prop];
								}
							}
						}
						return target;
					},

					objectForEach: objectForEach,

					objectMap: function(source, mapping) {
						if (!source)
							return source;
						var target = {};
						for (var prop in source) {
							if (source.hasOwnProperty(prop)) {
								target[prop] = mapping(source[prop], prop, source);
							}
						}
						return target;
					},

					emptyDomNode: function (domNode) {
						while (domNode.firstChild) {
							ko.removeNode(domNode.firstChild);
						}
					},

					moveCleanedNodesToContainerElement: function(nodes) {
						// Ensure it's a real array, as we're about to reparent the nodes and
						// we don't want the underlying collection to change while we're doing that.
						var nodesArray = ko.utils.makeArray(nodes);

						var container = document.createElement('div');
						for (var i = 0, j = nodesArray.length; i < j; i++) {
							container.appendChild(ko.cleanNode(nodesArray[i]));
						}
						return container;
					},

					cloneNodes: function (nodesArray, shouldCleanNodes) {
						for (var i = 0, j = nodesArray.length, newNodesArray = []; i < j; i++) {
							var clonedNode = nodesArray[i].cloneNode(true);
							newNodesArray.push(shouldCleanNodes ? ko.cleanNode(clonedNode) : clonedNode);
						}
						return newNodesArray;
					},

					setDomNodeChildren: function (domNode, childNodes) {
						ko.utils.emptyDomNode(domNode);
						if (childNodes) {
							for (var i = 0, j = childNodes.length; i < j; i++)
								domNode.appendChild(childNodes[i]);
						}
					},

					replaceDomNodes: function (nodeToReplaceOrNodeArray, newNodesArray) {
						var nodesToReplaceArray = nodeToReplaceOrNodeArray.nodeType ? [nodeToReplaceOrNodeArray] : nodeToReplaceOrNodeArray;
						if (nodesToReplaceArray.length > 0) {
							var insertionPoint = nodesToReplaceArray[0];
							var parent = insertionPoint.parentNode;
							for (var i = 0, j = newNodesArray.length; i < j; i++)
								parent.insertBefore(newNodesArray[i], insertionPoint);
							for (var i = 0, j = nodesToReplaceArray.length; i < j; i++) {
								ko.removeNode(nodesToReplaceArray[i]);
							}
						}
					},

					fixUpContinuousNodeArray: function(continuousNodeArray, parentNode) {
						// Before acting on a set of nodes that were previously outputted by a template function, we have to reconcile
						// them against what is in the DOM right now. It may be that some of the nodes have already been removed, or that
						// new nodes might have been inserted in the middle, for example by a binding. Also, there may previously have been
						// leading comment nodes (created by rewritten string-based templates) that have since been removed during binding.
						// So, this function translates the old "map" output array into its best guess of the set of current DOM nodes.
						//
						// Rules:
						//   [A] Any leading nodes that have been removed should be ignored
						//       These most likely correspond to memoization nodes that were already removed during binding
						//       See https://github.com/SteveSanderson/knockout/pull/440
						//   [B] We want to output a continuous series of nodes. So, ignore any nodes that have already been removed,
						//       and include any nodes that have been inserted among the previous collection

						if (continuousNodeArray.length) {
							// The parent node can be a virtual element; so get the real parent node
							parentNode = (parentNode.nodeType === 8 && parentNode.parentNode) || parentNode;

							// Rule [A]
							while (continuousNodeArray.length && continuousNodeArray[0].parentNode !== parentNode)
								continuousNodeArray.splice(0, 1);

							// Rule [B]
							if (continuousNodeArray.length > 1) {
								var current = continuousNodeArray[0], last = continuousNodeArray[continuousNodeArray.length - 1];
								// Replace with the actual new continuous node set
								continuousNodeArray.length = 0;
								while (current !== last) {
									continuousNodeArray.push(current);
									current = current.nextSibling;
									if (!current) // Won't happen, except if the developer has manually removed some DOM elements (then we're in an undefined scenario)
										return;
								}
								continuousNodeArray.push(last);
							}
						}
						return continuousNodeArray;
					},

					setOptionNodeSelectionState: function (optionNode, isSelected) {
						// IE6 sometimes throws "unknown error" if you try to write to .selected directly, whereas Firefox struggles with setAttribute. Pick one based on browser.
						if (ieVersion < 7)
							optionNode.setAttribute("selected", isSelected);
						else
							optionNode.selected = isSelected;
					},

					stringTrim: function (string) {
						return string === null || string === undefined ? '' :
							string.trim ?
								string.trim() :
								string.toString().replace(/^[\s\xa0]+|[\s\xa0]+$/g, '');
					},

					stringTokenize: function (string, delimiter) {
						var result = [];
						var tokens = (string || "").split(delimiter);
						for (var i = 0, j = tokens.length; i < j; i++) {
							var trimmed = ko.utils.stringTrim(tokens[i]);
							if (trimmed !== "")
								result.push(trimmed);
						}
						return result;
					},

					stringStartsWith: function (string, startsWith) {
						string = string || "";
						if (startsWith.length > string.length)
							return false;
						return string.substring(0, startsWith.length) === startsWith;
					},

					domNodeIsContainedBy: function (node, containedByNode) {
						if (node === containedByNode)
							return true;
						if (node.nodeType === 11)
							return false; // Fixes issue #1162 - can't use node.contains for document fragments on IE8
						if (containedByNode.contains)
							return containedByNode.contains(node.nodeType === 3 ? node.parentNode : node);
						if (containedByNode.compareDocumentPosition)
							return (containedByNode.compareDocumentPosition(node) & 16) == 16;
						while (node && node != containedByNode) {
							node = node.parentNode;
						}
						return !!node;
					},

					domNodeIsAttachedToDocument: function (node) {
						return ko.utils.domNodeIsContainedBy(node, node.ownerDocument.documentElement);
					},

					anyDomNodeIsAttachedToDocument: function(nodes) {
						return !!ko.utils.arrayFirst(nodes, ko.utils.domNodeIsAttachedToDocument);
					},

					tagNameLower: function(element) {
						// For HTML elements, tagName will always be upper case; for XHTML elements, it'll be lower case.
						// Possible future optimization: If we know it's an element from an XHTML document (not HTML),
						// we don't need to do the .toLowerCase() as it will always be lower case anyway.
						return element && element.tagName && element.tagName.toLowerCase();
					},

					registerEventHandler: function (element, eventType, handler) {
						var mustUseAttachEvent = ieVersion && eventsThatMustBeRegisteredUsingAttachEvent[eventType];
						if (!mustUseAttachEvent && typeof jQuery != "undefined") {
							if (isClickOnCheckableElement(element, eventType)) {
								// For click events on checkboxes, jQuery interferes with the event handling in an awkward way:
								// it toggles the element checked state *after* the click event handlers run, whereas native
								// click events toggle the checked state *before* the event handler.
								// Fix this by intecepting the handler and applying the correct checkedness before it runs.
								var originalHandler = handler;
								handler = function(event, eventData) {
									var jQuerySuppliedCheckedState = this.checked;
									if (eventData)
										this.checked = eventData.checkedStateBeforeEvent !== true;
									originalHandler.call(this, event);
									this.checked = jQuerySuppliedCheckedState; // Restore the state jQuery applied
								};
							}
							jQuery(element)['bind'](eventType, handler);
						} else if (!mustUseAttachEvent && typeof element.addEventListener == "function")
							element.addEventListener(eventType, handler, false);
						else if (typeof element.attachEvent != "undefined") {
							var attachEventHandler = function (event) { handler.call(element, event); },
								attachEventName = "on" + eventType;
							element.attachEvent(attachEventName, attachEventHandler);

							// IE does not dispose attachEvent handlers automatically (unlike with addEventListener)
							// so to avoid leaks, we have to remove them manually. See bug #856
							ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
								element.detachEvent(attachEventName, attachEventHandler);
							});
						} else
							throw new Error("Browser doesn't support addEventListener or attachEvent");
					},

					triggerEvent: function (element, eventType) {
						if (!(element && element.nodeType))
							throw new Error("element must be a DOM node when calling triggerEvent");

						if (typeof jQuery != "undefined") {
							var eventData = [];
							if (isClickOnCheckableElement(element, eventType)) {
								// Work around the jQuery "click events on checkboxes" issue described above by storing the original checked state before triggering the handler
								eventData.push({ checkedStateBeforeEvent: element.checked });
							}
							jQuery(element)['trigger'](eventType, eventData);
						} else if (typeof document.createEvent == "function") {
							if (typeof element.dispatchEvent == "function") {
								var eventCategory = knownEventTypesByEventName[eventType] || "HTMLEvents";
								var event = document.createEvent(eventCategory);
								event.initEvent(eventType, true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, element);
								element.dispatchEvent(event);
							}
							else
								throw new Error("The supplied element doesn't support dispatchEvent");
						} else if (typeof element.fireEvent != "undefined") {
							// Unlike other browsers, IE doesn't change the checked state of checkboxes/radiobuttons when you trigger their "click" event
							// so to make it consistent, we'll do it manually here
							if (isClickOnCheckableElement(element, eventType))
								element.checked = element.checked !== true;
							element.fireEvent("on" + eventType);
						}
						else
							throw new Error("Browser doesn't support triggering events");
					},

					unwrapObservable: function (value) {
						return ko.isObservable(value) ? value() : value;
					},

					peekObservable: function (value) {
						return ko.isObservable(value) ? value.peek() : value;
					},

					toggleDomNodeCssClass: function (node, classNames, shouldHaveClass) {
						if (classNames) {
							var cssClassNameRegex = /\S+/g,
								currentClassNames = node.className.match(cssClassNameRegex) || [];
							ko.utils.arrayForEach(classNames.match(cssClassNameRegex), function(className) {
								ko.utils.addOrRemoveItem(currentClassNames, className, shouldHaveClass);
							});
							node.className = currentClassNames.join(" ");
						}
					},

					setTextContent: function(element, textContent) {
						var value = ko.utils.unwrapObservable(textContent);
						if ((value === null) || (value === undefined))
							value = "";

						// We need there to be exactly one child: a text node.
						// If there are no children, more than one, or if it's not a text node,
						// we'll clear everything and create a single text node.
						var innerTextNode = ko.virtualElements.firstChild(element);
						if (!innerTextNode || innerTextNode.nodeType != 3 || ko.virtualElements.nextSibling(innerTextNode)) {
							ko.virtualElements.setDomNodeChildren(element, [document.createTextNode(value)]);
						} else {
							innerTextNode.data = value;
						}

						ko.utils.forceRefresh(element);
					},

					setElementName: function(element, name) {
						element.name = name;

						// Workaround IE 6/7 issue
						// - https://github.com/SteveSanderson/knockout/issues/197
						// - http://www.matts411.com/post/setting_the_name_attribute_in_ie_dom/
						if (ieVersion <= 7) {
							try {
								element.mergeAttributes(document.createElement("<input name='" + element.name + "'/>"), false);
							}
							catch(e) {} // For IE9 with doc mode "IE9 Standards" and browser mode "IE9 Compatibility View"
						}
					},

					forceRefresh: function(node) {
						// Workaround for an IE9 rendering bug - https://github.com/SteveSanderson/knockout/issues/209
						if (ieVersion >= 9) {
							// For text nodes and comment nodes (most likely virtual elements), we will have to refresh the container
							var elem = node.nodeType == 1 ? node : node.parentNode;
							if (elem.style)
								elem.style.zoom = elem.style.zoom;
						}
					},

					ensureSelectElementIsRenderedCorrectly: function(selectElement) {
						// Workaround for IE9 rendering bug - it doesn't reliably display all the text in dynamically-added select boxes unless you force it to re-render by updating the width.
						// (See https://github.com/SteveSanderson/knockout/issues/312, http://stackoverflow.com/questions/5908494/select-only-shows-first-char-of-selected-option)
						// Also fixes IE7 and IE8 bug that causes selects to be zero width if enclosed by 'if' or 'with'. (See issue #839)
						if (ieVersion) {
							var originalWidth = selectElement.style.width;
							selectElement.style.width = 0;
							selectElement.style.width = originalWidth;
						}
					},

					range: function (min, max) {
						min = ko.utils.unwrapObservable(min);
						max = ko.utils.unwrapObservable(max);
						var result = [];
						for (var i = min; i <= max; i++)
							result.push(i);
						return result;
					},

					makeArray: function(arrayLikeObject) {
						var result = [];
						for (var i = 0, j = arrayLikeObject.length; i < j; i++) {
							result.push(arrayLikeObject[i]);
						};
						return result;
					},

					isIe6 : isIe6,
					isIe7 : isIe7,
					ieVersion : ieVersion,

					getFormFields: function(form, fieldName) {
						var fields = ko.utils.makeArray(form.getElementsByTagName("input")).concat(ko.utils.makeArray(form.getElementsByTagName("textarea")));
						var isMatchingField = (typeof fieldName == 'string')
							? function(field) { return field.name === fieldName }
							: function(field) { return fieldName.test(field.name) }; // Treat fieldName as regex or object containing predicate
						var matches = [];
						for (var i = fields.length - 1; i >= 0; i--) {
							if (isMatchingField(fields[i]))
								matches.push(fields[i]);
						};
						return matches;
					},

					parseJson: function (jsonString) {
						if (typeof jsonString == "string") {
							jsonString = ko.utils.stringTrim(jsonString);
							if (jsonString) {
								if (JSON && JSON.parse) // Use native parsing where available
									return JSON.parse(jsonString);
								return (new Function("return " + jsonString))(); // Fallback on less safe parsing for older browsers
							}
						}
						return null;
					},

					stringifyJson: function (data, replacer, space) {   // replacer and space are optional
						if (!JSON || !JSON.stringify)
							throw new Error("Cannot find JSON.stringify(). Some browsers (e.g., IE < 8) don't support it natively, but you can overcome this by adding a script reference to json2.js, downloadable from http://www.json.org/json2.js");
						return JSON.stringify(ko.utils.unwrapObservable(data), replacer, space);
					},

					postJson: function (urlOrForm, data, options) {
						options = options || {};
						var params = options['params'] || {};
						var includeFields = options['includeFields'] || this.fieldsIncludedWithJsonPost;
						var url = urlOrForm;

						// If we were given a form, use its 'action' URL and pick out any requested field values
						if((typeof urlOrForm == 'object') && (ko.utils.tagNameLower(urlOrForm) === "form")) {
							var originalForm = urlOrForm;
							url = originalForm.action;
							for (var i = includeFields.length - 1; i >= 0; i--) {
								var fields = ko.utils.getFormFields(originalForm, includeFields[i]);
								for (var j = fields.length - 1; j >= 0; j--)
									params[fields[j].name] = fields[j].value;
							}
						}

						data = ko.utils.unwrapObservable(data);
						var form = document.createElement("form");
						form.style.display = "none";
						form.action = url;
						form.method = "post";
						for (var key in data) {
							// Since 'data' this is a model object, we include all properties including those inherited from its prototype
							var input = document.createElement("input");
							input.name = key;
							input.value = ko.utils.stringifyJson(ko.utils.unwrapObservable(data[key]));
							form.appendChild(input);
						}
						objectForEach(params, function(key, value) {
							var input = document.createElement("input");
							input.name = key;
							input.value = value;
							form.appendChild(input);
						});
						document.body.appendChild(form);
						options['submitter'] ? options['submitter'](form) : form.submit();
						setTimeout(function () { form.parentNode.removeChild(form); }, 0);
					}
				}
			}());

			ko.exportSymbol('utils', ko.utils);
			ko.exportSymbol('utils.arrayForEach', ko.utils.arrayForEach);
			ko.exportSymbol('utils.arrayFirst', ko.utils.arrayFirst);
			ko.exportSymbol('utils.arrayFilter', ko.utils.arrayFilter);
			ko.exportSymbol('utils.arrayGetDistinctValues', ko.utils.arrayGetDistinctValues);
			ko.exportSymbol('utils.arrayIndexOf', ko.utils.arrayIndexOf);
			ko.exportSymbol('utils.arrayMap', ko.utils.arrayMap);
			ko.exportSymbol('utils.arrayPushAll', ko.utils.arrayPushAll);
			ko.exportSymbol('utils.arrayRemoveItem', ko.utils.arrayRemoveItem);
			ko.exportSymbol('utils.extend', ko.utils.extend);
			ko.exportSymbol('utils.fieldsIncludedWithJsonPost', ko.utils.fieldsIncludedWithJsonPost);
			ko.exportSymbol('utils.getFormFields', ko.utils.getFormFields);
			ko.exportSymbol('utils.peekObservable', ko.utils.peekObservable);
			ko.exportSymbol('utils.postJson', ko.utils.postJson);
			ko.exportSymbol('utils.parseJson', ko.utils.parseJson);
			ko.exportSymbol('utils.registerEventHandler', ko.utils.registerEventHandler);
			ko.exportSymbol('utils.stringifyJson', ko.utils.stringifyJson);
			ko.exportSymbol('utils.range', ko.utils.range);
			ko.exportSymbol('utils.toggleDomNodeCssClass', ko.utils.toggleDomNodeCssClass);
			ko.exportSymbol('utils.triggerEvent', ko.utils.triggerEvent);
			ko.exportSymbol('utils.unwrapObservable', ko.utils.unwrapObservable);
			ko.exportSymbol('utils.objectForEach', ko.utils.objectForEach);
			ko.exportSymbol('utils.addOrRemoveItem', ko.utils.addOrRemoveItem);
			ko.exportSymbol('unwrap', ko.utils.unwrapObservable); // Convenient shorthand, because this is used so commonly

			if (!Function.prototype['bind']) {
				// Function.prototype.bind is a standard part of ECMAScript 5th Edition (December 2009, http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-262.pdf)
				// In case the browser doesn't implement it natively, provide a JavaScript implementation. This implementation is based on the one in prototype.js
				Function.prototype['bind'] = function (object) {
					var originalFunction = this, args = Array.prototype.slice.call(arguments), object = args.shift();
					return function () {
						return originalFunction.apply(object, args.concat(Array.prototype.slice.call(arguments)));
					};
				};
			}

			ko.utils.domData = new (function () {
				var uniqueId = 0;
				var dataStoreKeyExpandoPropertyName = "__ko__" + (new Date).getTime();
				var dataStore = {};

				function getAll(node, createIfNotFound) {
					var dataStoreKey = node[dataStoreKeyExpandoPropertyName];
					var hasExistingDataStore = dataStoreKey && (dataStoreKey !== "null") && dataStore[dataStoreKey];
					if (!hasExistingDataStore) {
						if (!createIfNotFound)
							return undefined;
						dataStoreKey = node[dataStoreKeyExpandoPropertyName] = "ko" + uniqueId++;
						dataStore[dataStoreKey] = {};
					}
					return dataStore[dataStoreKey];
				}

				return {
					get: function (node, key) {
						var allDataForNode = getAll(node, false);
						return allDataForNode === undefined ? undefined : allDataForNode[key];
					},
					set: function (node, key, value) {
						if (value === undefined) {
							// Make sure we don't actually create a new domData key if we are actually deleting a value
							if (getAll(node, false) === undefined)
								return;
						}
						var allDataForNode = getAll(node, true);
						allDataForNode[key] = value;
					},
					clear: function (node) {
						var dataStoreKey = node[dataStoreKeyExpandoPropertyName];
						if (dataStoreKey) {
							delete dataStore[dataStoreKey];
							node[dataStoreKeyExpandoPropertyName] = null;
							return true; // Exposing "did clean" flag purely so specs can infer whether things have been cleaned up as intended
						}
						return false;
					},

					nextKey: function () {
						return (uniqueId++) + dataStoreKeyExpandoPropertyName;
					}
				};
			})();

			ko.exportSymbol('utils.domData', ko.utils.domData);
			ko.exportSymbol('utils.domData.clear', ko.utils.domData.clear); // Exporting only so specs can clear up after themselves fully

			ko.utils.domNodeDisposal = new (function () {
				var domDataKey = ko.utils.domData.nextKey();
				var cleanableNodeTypes = { 1: true, 8: true, 9: true };       // Element, Comment, Document
				var cleanableNodeTypesWithDescendants = { 1: true, 9: true }; // Element, Document

				function getDisposeCallbacksCollection(node, createIfNotFound) {
					var allDisposeCallbacks = ko.utils.domData.get(node, domDataKey);
					if ((allDisposeCallbacks === undefined) && createIfNotFound) {
						allDisposeCallbacks = [];
						ko.utils.domData.set(node, domDataKey, allDisposeCallbacks);
					}
					return allDisposeCallbacks;
				}
				function destroyCallbacksCollection(node) {
					ko.utils.domData.set(node, domDataKey, undefined);
				}

				function cleanSingleNode(node) {
					// Run all the dispose callbacks
					var callbacks = getDisposeCallbacksCollection(node, false);
					if (callbacks) {
						callbacks = callbacks.slice(0); // Clone, as the array may be modified during iteration (typically, callbacks will remove themselves)
						for (var i = 0; i < callbacks.length; i++)
							callbacks[i](node);
					}

					// Also erase the DOM data
					ko.utils.domData.clear(node);

					// Special support for jQuery here because it's so commonly used.
					// Many jQuery plugins (including jquery.tmpl) store data using jQuery's equivalent of domData
					// so notify it to tear down any resources associated with the node & descendants here.
					if ((typeof jQuery == "function") && (typeof jQuery['cleanData'] == "function"))
						jQuery['cleanData']([node]);

					// Also clear any immediate-child comment nodes, as these wouldn't have been found by
					// node.getElementsByTagName("*") in cleanNode() (comment nodes aren't elements)
					if (cleanableNodeTypesWithDescendants[node.nodeType])
						cleanImmediateCommentTypeChildren(node);
				}

				function cleanImmediateCommentTypeChildren(nodeWithChildren) {
					var child, nextChild = nodeWithChildren.firstChild;
					while (child = nextChild) {
						nextChild = child.nextSibling;
						if (child.nodeType === 8)
							cleanSingleNode(child);
					}
				}

				return {
					addDisposeCallback : function(node, callback) {
						if (typeof callback != "function")
							throw new Error("Callback must be a function");
						getDisposeCallbacksCollection(node, true).push(callback);
					},

					removeDisposeCallback : function(node, callback) {
						var callbacksCollection = getDisposeCallbacksCollection(node, false);
						if (callbacksCollection) {
							ko.utils.arrayRemoveItem(callbacksCollection, callback);
							if (callbacksCollection.length == 0)
								destroyCallbacksCollection(node);
						}
					},

					cleanNode : function(node) {
						// First clean this node, where applicable
						if (cleanableNodeTypes[node.nodeType]) {
							cleanSingleNode(node);

							// ... then its descendants, where applicable
							if (cleanableNodeTypesWithDescendants[node.nodeType]) {
								// Clone the descendants list in case it changes during iteration
								var descendants = [];
								ko.utils.arrayPushAll(descendants, node.getElementsByTagName("*"));
								for (var i = 0, j = descendants.length; i < j; i++)
									cleanSingleNode(descendants[i]);
							}
						}
						return node;
					},

					removeNode : function(node) {
						ko.cleanNode(node);
						if (node.parentNode)
							node.parentNode.removeChild(node);
					}
				}
			})();
			ko.cleanNode = ko.utils.domNodeDisposal.cleanNode; // Shorthand name for convenience
			ko.removeNode = ko.utils.domNodeDisposal.removeNode; // Shorthand name for convenience
			ko.exportSymbol('cleanNode', ko.cleanNode);
			ko.exportSymbol('removeNode', ko.removeNode);
			ko.exportSymbol('utils.domNodeDisposal', ko.utils.domNodeDisposal);
			ko.exportSymbol('utils.domNodeDisposal.addDisposeCallback', ko.utils.domNodeDisposal.addDisposeCallback);
			ko.exportSymbol('utils.domNodeDisposal.removeDisposeCallback', ko.utils.domNodeDisposal.removeDisposeCallback);
			(function () {
				var leadingCommentRegex = /^(\s*)<!--(.*?)-->/;

				function simpleHtmlParse(html) {
					// Based on jQuery's "clean" function, but only accounting for table-related elements.
					// If you have referenced jQuery, this won't be used anyway - KO will use jQuery's "clean" function directly

					// Note that there's still an issue in IE < 9 whereby it will discard comment nodes that are the first child of
					// a descendant node. For example: "<div><!-- mycomment -->abc</div>" will get parsed as "<div>abc</div>"
					// This won't affect anyone who has referenced jQuery, and there's always the workaround of inserting a dummy node
					// (possibly a text node) in front of the comment. So, KO does not attempt to workaround this IE issue automatically at present.

					// Trim whitespace, otherwise indexOf won't work as expected
					var tags = ko.utils.stringTrim(html).toLowerCase(), div = document.createElement("div");

					// Finds the first match from the left column, and returns the corresponding "wrap" data from the right column
					var wrap = tags.match(/^<(thead|tbody|tfoot)/)              && [1, "<table>", "</table>"] ||
						!tags.indexOf("<tr")                             && [2, "<table><tbody>", "</tbody></table>"] ||
						(!tags.indexOf("<td") || !tags.indexOf("<th"))   && [3, "<table><tbody><tr>", "</tr></tbody></table>"] ||
						/* anything else */                                 [0, "", ""];

					// Go to html and back, then peel off extra wrappers
					// Note that we always prefix with some dummy text, because otherwise, IE<9 will strip out leading comment nodes in descendants. Total madness.
					var markup = "ignored<div>" + wrap[1] + html + wrap[2] + "</div>";
					if (typeof window['innerShiv'] == "function") {
						div.appendChild(window['innerShiv'](markup));
					} else {
						div.innerHTML = markup;
					}

					// Move to the right depth
					while (wrap[0]--)
						div = div.lastChild;

					return ko.utils.makeArray(div.lastChild.childNodes);
				}

				function jQueryHtmlParse(html) {
					// jQuery's "parseHTML" function was introduced in jQuery 1.8.0 and is a documented public API.
					if (jQuery['parseHTML']) {
						return jQuery['parseHTML'](html) || []; // Ensure we always return an array and never null
					} else {
						// For jQuery < 1.8.0, we fall back on the undocumented internal "clean" function.
						var elems = jQuery['clean']([html]);

						// As of jQuery 1.7.1, jQuery parses the HTML by appending it to some dummy parent nodes held in an in-memory document fragment.
						// Unfortunately, it never clears the dummy parent nodes from the document fragment, so it leaks memory over time.
						// Fix this by finding the top-most dummy parent element, and detaching it from its owner fragment.
						if (elems && elems[0]) {
							// Find the top-most parent element that's a direct child of a document fragment
							var elem = elems[0];
							while (elem.parentNode && elem.parentNode.nodeType !== 11 /* i.e., DocumentFragment */)
								elem = elem.parentNode;
							// ... then detach it
							if (elem.parentNode)
								elem.parentNode.removeChild(elem);
						}

						return elems;
					}
				}

				ko.utils.parseHtmlFragment = function(html) {
					return typeof jQuery != 'undefined' ? jQueryHtmlParse(html)   // As below, benefit from jQuery's optimisations where possible
						: simpleHtmlParse(html);  // ... otherwise, this simple logic will do in most common cases.
				};

				ko.utils.setHtml = function(node, html) {
					ko.utils.emptyDomNode(node);

					// There's no legitimate reason to display a stringified observable without unwrapping it, so we'll unwrap it
					html = ko.utils.unwrapObservable(html);

					if ((html !== null) && (html !== undefined)) {
						if (typeof html != 'string')
							html = html.toString();

						// jQuery contains a lot of sophisticated code to parse arbitrary HTML fragments,
						// for example <tr> elements which are not normally allowed to exist on their own.
						// If you've referenced jQuery we'll use that rather than duplicating its code.
						if (typeof jQuery != 'undefined') {
							jQuery(node)['html'](html);
						} else {
							// ... otherwise, use KO's own parsing logic.
							var parsedNodes = ko.utils.parseHtmlFragment(html);
							for (var i = 0; i < parsedNodes.length; i++)
								node.appendChild(parsedNodes[i]);
						}
					}
				};
			})();

			ko.exportSymbol('utils.parseHtmlFragment', ko.utils.parseHtmlFragment);
			ko.exportSymbol('utils.setHtml', ko.utils.setHtml);

			ko.memoization = (function () {
				var memos = {};

				function randomMax8HexChars() {
					return (((1 + Math.random()) * 0x100000000) | 0).toString(16).substring(1);
				}
				function generateRandomId() {
					return randomMax8HexChars() + randomMax8HexChars();
				}
				function findMemoNodes(rootNode, appendToArray) {
					if (!rootNode)
						return;
					if (rootNode.nodeType == 8) {
						var memoId = ko.memoization.parseMemoText(rootNode.nodeValue);
						if (memoId != null)
							appendToArray.push({ domNode: rootNode, memoId: memoId });
					} else if (rootNode.nodeType == 1) {
						for (var i = 0, childNodes = rootNode.childNodes, j = childNodes.length; i < j; i++)
							findMemoNodes(childNodes[i], appendToArray);
					}
				}

				return {
					memoize: function (callback) {
						if (typeof callback != "function")
							throw new Error("You can only pass a function to ko.memoization.memoize()");
						var memoId = generateRandomId();
						memos[memoId] = callback;
						return "<!--[ko_memo:" + memoId + "]-->";
					},

					unmemoize: function (memoId, callbackParams) {
						var callback = memos[memoId];
						if (callback === undefined)
							throw new Error("Couldn't find any memo with ID " + memoId + ". Perhaps it's already been unmemoized.");
						try {
							callback.apply(null, callbackParams || []);
							return true;
						}
						finally { delete memos[memoId]; }
					},

					unmemoizeDomNodeAndDescendants: function (domNode, extraCallbackParamsArray) {
						var memos = [];
						findMemoNodes(domNode, memos);
						for (var i = 0, j = memos.length; i < j; i++) {
							var node = memos[i].domNode;
							var combinedParams = [node];
							if (extraCallbackParamsArray)
								ko.utils.arrayPushAll(combinedParams, extraCallbackParamsArray);
							ko.memoization.unmemoize(memos[i].memoId, combinedParams);
							node.nodeValue = ""; // Neuter this node so we don't try to unmemoize it again
							if (node.parentNode)
								node.parentNode.removeChild(node); // If possible, erase it totally (not always possible - someone else might just hold a reference to it then call unmemoizeDomNodeAndDescendants again)
						}
					},

					parseMemoText: function (memoText) {
						var match = memoText.match(/^\[ko_memo\:(.*?)\]$/);
						return match ? match[1] : null;
					}
				};
			})();

			ko.exportSymbol('memoization', ko.memoization);
			ko.exportSymbol('memoization.memoize', ko.memoization.memoize);
			ko.exportSymbol('memoization.unmemoize', ko.memoization.unmemoize);
			ko.exportSymbol('memoization.parseMemoText', ko.memoization.parseMemoText);
			ko.exportSymbol('memoization.unmemoizeDomNodeAndDescendants', ko.memoization.unmemoizeDomNodeAndDescendants);
			ko.extenders = {
				'throttle': function(target, timeout) {
					// Throttling means two things:

					// (1) For dependent observables, we throttle *evaluations* so that, no matter how fast its dependencies
					//     notify updates, the target doesn't re-evaluate (and hence doesn't notify) faster than a certain rate
					target['throttleEvaluation'] = timeout;

					// (2) For writable targets (observables, or writable dependent observables), we throttle *writes*
					//     so the target cannot change value synchronously or faster than a certain rate
					var writeTimeoutInstance = null;
					return ko.dependentObservable({
						'read': target,
						'write': function(value) {
							clearTimeout(writeTimeoutInstance);
							writeTimeoutInstance = setTimeout(function() {
								target(value);
							}, timeout);
						}
					});
				},

				'notify': function(target, notifyWhen) {
					target["equalityComparer"] = notifyWhen == "always" ?
						null :  // null equalityComparer means to always notify
						valuesArePrimitiveAndEqual;
				}
			};

			var primitiveTypes = { 'undefined':1, 'boolean':1, 'number':1, 'string':1 };
			function valuesArePrimitiveAndEqual(a, b) {
				var oldValueIsPrimitive = (a === null) || (typeof(a) in primitiveTypes);
				return oldValueIsPrimitive ? (a === b) : false;
			}

			function applyExtenders(requestedExtenders) {
				var target = this;
				if (requestedExtenders) {
					ko.utils.objectForEach(requestedExtenders, function(key, value) {
						var extenderHandler = ko.extenders[key];
						if (typeof extenderHandler == 'function') {
							target = extenderHandler(target, value) || target;
						}
					});
				}
				return target;
			}

			ko.exportSymbol('extenders', ko.extenders);

			ko.subscription = function (target, callback, disposeCallback) {
				this.target = target;
				this.callback = callback;
				this.disposeCallback = disposeCallback;
				ko.exportProperty(this, 'dispose', this.dispose);
			};
			ko.subscription.prototype.dispose = function () {
				this.isDisposed = true;
				this.disposeCallback();
			};

			ko.subscribable = function () {
				this._subscriptions = {};

				ko.utils.extend(this, ko.subscribable['fn']);
				ko.exportProperty(this, 'subscribe', this.subscribe);
				ko.exportProperty(this, 'extend', this.extend);
				ko.exportProperty(this, 'getSubscriptionsCount', this.getSubscriptionsCount);
			}

			var defaultEvent = "change";

			ko.subscribable['fn'] = {
				subscribe: function (callback, callbackTarget, event) {
					event = event || defaultEvent;
					var boundCallback = callbackTarget ? callback.bind(callbackTarget) : callback;

					var subscription = new ko.subscription(this, boundCallback, function () {
						ko.utils.arrayRemoveItem(this._subscriptions[event], subscription);
					}.bind(this));

					if (!this._subscriptions[event])
						this._subscriptions[event] = [];
					this._subscriptions[event].push(subscription);
					return subscription;
				},

				"notifySubscribers": function (valueToNotify, event) {
					event = event || defaultEvent;
					if (this.hasSubscriptionsForEvent(event)) {
						try {
							ko.dependencyDetection.begin();
							for (var a = this._subscriptions[event].slice(0), i = 0, subscription; subscription = a[i]; ++i) {
								// In case a subscription was disposed during the arrayForEach cycle, check
								// for isDisposed on each subscription before invoking its callback
								if (subscription && (subscription.isDisposed !== true))
									subscription.callback(valueToNotify);
							}
						} finally {
							ko.dependencyDetection.end();
						}
					}
				},

				hasSubscriptionsForEvent: function(event) {
					return this._subscriptions[event] && this._subscriptions[event].length;
				},

				getSubscriptionsCount: function () {
					var total = 0;
					ko.utils.objectForEach(this._subscriptions, function(eventName, subscriptions) {
						total += subscriptions.length;
					});
					return total;
				},

				extend: applyExtenders
			};


			ko.isSubscribable = function (instance) {
				return instance != null && typeof instance.subscribe == "function" && typeof instance["notifySubscribers"] == "function";
			};

			ko.exportSymbol('subscribable', ko.subscribable);
			ko.exportSymbol('isSubscribable', ko.isSubscribable);

			ko.dependencyDetection = (function () {
				var _frames = [];

				return {
					begin: function (callback) {
						_frames.push(callback && { callback: callback, distinctDependencies:[] });
					},

					end: function () {
						_frames.pop();
					},

					registerDependency: function (subscribable) {
						if (!ko.isSubscribable(subscribable))
							throw new Error("Only subscribable things can act as dependencies");
						if (_frames.length > 0) {
							var topFrame = _frames[_frames.length - 1];
							if (!topFrame || ko.utils.arrayIndexOf(topFrame.distinctDependencies, subscribable) >= 0)
								return;
							topFrame.distinctDependencies.push(subscribable);
							topFrame.callback(subscribable);
						}
					},

					ignore: function(callback, callbackTarget, callbackArgs) {
						try {
							_frames.push(null);
							return callback.apply(callbackTarget, callbackArgs || []);
						} finally {
							_frames.pop();
						}
					}
				};
			})();
			ko.observable = function (initialValue) {
				var _latestValue = initialValue;

				function observable() {
					if (arguments.length > 0) {
						// Write

						// Ignore writes if the value hasn't changed
						if (!observable['equalityComparer'] || !observable['equalityComparer'](_latestValue, arguments[0])) {
							observable.valueWillMutate();
							_latestValue = arguments[0];
							if (DEBUG) observable._latestValue = _latestValue;
							observable.valueHasMutated();
						}
						return this; // Permits chained assignments
					}
					else {
						// Read
						ko.dependencyDetection.registerDependency(observable); // The caller only needs to be notified of changes if they did a "read" operation
						return _latestValue;
					}
				}
				if (DEBUG) observable._latestValue = _latestValue;
				ko.subscribable.call(observable);
				observable.peek = function() { return _latestValue };
				observable.valueHasMutated = function () { observable["notifySubscribers"](_latestValue); }
				observable.valueWillMutate = function () { observable["notifySubscribers"](_latestValue, "beforeChange"); }
				ko.utils.extend(observable, ko.observable['fn']);

				ko.exportProperty(observable, 'peek', observable.peek);
				ko.exportProperty(observable, "valueHasMutated", observable.valueHasMutated);
				ko.exportProperty(observable, "valueWillMutate", observable.valueWillMutate);

				return observable;
			}

			ko.observable['fn'] = {
				"equalityComparer": valuesArePrimitiveAndEqual
			};

			var protoProperty = ko.observable.protoProperty = "__ko_proto__";
			ko.observable['fn'][protoProperty] = ko.observable;

			ko.hasPrototype = function(instance, prototype) {
				if ((instance === null) || (instance === undefined) || (instance[protoProperty] === undefined)) return false;
				if (instance[protoProperty] === prototype) return true;
				return ko.hasPrototype(instance[protoProperty], prototype); // Walk the prototype chain
			};

			ko.isObservable = function (instance) {
				return ko.hasPrototype(instance, ko.observable);
			}
			ko.isWriteableObservable = function (instance) {
				// Observable
				if ((typeof instance == "function") && instance[protoProperty] === ko.observable)
					return true;
				// Writeable dependent observable
				if ((typeof instance == "function") && (instance[protoProperty] === ko.dependentObservable) && (instance.hasWriteFunction))
					return true;
				// Anything else
				return false;
			}


			ko.exportSymbol('observable', ko.observable);
			ko.exportSymbol('isObservable', ko.isObservable);
			ko.exportSymbol('isWriteableObservable', ko.isWriteableObservable);
			ko.observableArray = function (initialValues) {
				initialValues = initialValues || [];

				if (typeof initialValues != 'object' || !('length' in initialValues))
					throw new Error("The argument passed when initializing an observable array must be an array, or null, or undefined.");

				var result = ko.observable(initialValues);
				ko.utils.extend(result, ko.observableArray['fn']);
				return result.extend({'trackArrayChanges':true});
			};

			ko.observableArray['fn'] = {
				'remove': function (valueOrPredicate) {
					var underlyingArray = this.peek();
					var removedValues = [];
					var predicate = typeof valueOrPredicate == "function" && !ko.isObservable(valueOrPredicate) ? valueOrPredicate : function (value) { return value === valueOrPredicate; };
					for (var i = 0; i < underlyingArray.length; i++) {
						var value = underlyingArray[i];
						if (predicate(value)) {
							if (removedValues.length === 0) {
								this.valueWillMutate();
							}
							removedValues.push(value);
							underlyingArray.splice(i, 1);
							i--;
						}
					}
					if (removedValues.length) {
						this.valueHasMutated();
					}
					return removedValues;
				},

				'removeAll': function (arrayOfValues) {
					// If you passed zero args, we remove everything
					if (arrayOfValues === undefined) {
						var underlyingArray = this.peek();
						var allValues = underlyingArray.slice(0);
						this.valueWillMutate();
						underlyingArray.splice(0, underlyingArray.length);
						this.valueHasMutated();
						return allValues;
					}
					// If you passed an arg, we interpret it as an array of entries to remove
					if (!arrayOfValues)
						return [];
					return this['remove'](function (value) {
						return ko.utils.arrayIndexOf(arrayOfValues, value) >= 0;
					});
				},

				'destroy': function (valueOrPredicate) {
					var underlyingArray = this.peek();
					var predicate = typeof valueOrPredicate == "function" && !ko.isObservable(valueOrPredicate) ? valueOrPredicate : function (value) { return value === valueOrPredicate; };
					this.valueWillMutate();
					for (var i = underlyingArray.length - 1; i >= 0; i--) {
						var value = underlyingArray[i];
						if (predicate(value))
							underlyingArray[i]["_destroy"] = true;
					}
					this.valueHasMutated();
				},

				'destroyAll': function (arrayOfValues) {
					// If you passed zero args, we destroy everything
					if (arrayOfValues === undefined)
						return this['destroy'](function() { return true });

					// If you passed an arg, we interpret it as an array of entries to destroy
					if (!arrayOfValues)
						return [];
					return this['destroy'](function (value) {
						return ko.utils.arrayIndexOf(arrayOfValues, value) >= 0;
					});
				},

				'indexOf': function (item) {
					var underlyingArray = this();
					return ko.utils.arrayIndexOf(underlyingArray, item);
				},

				'replace': function(oldItem, newItem) {
					var index = this['indexOf'](oldItem);
					if (index >= 0) {
						this.valueWillMutate();
						this.peek()[index] = newItem;
						this.valueHasMutated();
					}
				}
			};

// Populate ko.observableArray.fn with read/write functions from native arrays
// Important: Do not add any additional functions here that may reasonably be used to *read* data from the array
// because we'll eval them without causing subscriptions, so ko.computed output could end up getting stale
			ko.utils.arrayForEach(["pop", "push", "reverse", "shift", "sort", "splice", "unshift"], function (methodName) {
				ko.observableArray['fn'][methodName] = function () {
					// Use "peek" to avoid creating a subscription in any computed that we're executing in the context of
					// (for consistency with mutating regular observables)
					var underlyingArray = this.peek();
					this.valueWillMutate();
					this.cacheDiffForKnownOperation(underlyingArray, methodName, arguments);
					var methodCallResult = underlyingArray[methodName].apply(underlyingArray, arguments);
					this.valueHasMutated();
					return methodCallResult;
				};
			});

// Populate ko.observableArray.fn with read-only functions from native arrays
			ko.utils.arrayForEach(["slice"], function (methodName) {
				ko.observableArray['fn'][methodName] = function () {
					var underlyingArray = this();
					return underlyingArray[methodName].apply(underlyingArray, arguments);
				};
			});

			ko.exportSymbol('observableArray', ko.observableArray);
			var arrayChangeEventName = 'arrayChange';
			ko.extenders['trackArrayChanges'] = function(target) {
				// Only modify the target observable once
				if (target.cacheDiffForKnownOperation) {
					return;
				}
				var trackingChanges = false,
					cachedDiff = null,
					pendingNotifications = 0,
					underlyingSubscribeFunction = target.subscribe;

				// Intercept "subscribe" calls, and for array change events, ensure change tracking is enabled
				target.subscribe = target['subscribe'] = function(callback, callbackTarget, event) {
					if (event === arrayChangeEventName) {
						trackChanges();
					}
					return underlyingSubscribeFunction.apply(this, arguments);
				};

				function trackChanges() {
					// Calling 'trackChanges' multiple times is the same as calling it once
					if (trackingChanges) {
						return;
					}

					trackingChanges = true;

					// Intercept "notifySubscribers" to track how many times it was called.
					var underlyingNotifySubscribersFunction = target['notifySubscribers'];
					target['notifySubscribers'] = function(valueToNotify, event) {
						if (!event || event === defaultEvent) {
							++pendingNotifications;
						}
						return underlyingNotifySubscribersFunction.apply(this, arguments);
					};

					// Each time the array changes value, capture a clone so that on the next
					// change it's possible to produce a diff
					var previousContents = [].concat(target.peek() || []);
					cachedDiff = null;
					target.subscribe(function(currentContents) {
						// Make a copy of the current contents and ensure it's an array
						currentContents = [].concat(currentContents || []);

						// Compute the diff and issue notifications, but only if someone is listening
						if (target.hasSubscriptionsForEvent(arrayChangeEventName)) {
							var changes = getChanges(previousContents, currentContents);
							if (changes.length) {
								target['notifySubscribers'](changes, arrayChangeEventName);
							}
						}

						// Eliminate references to the old, removed items, so they can be GCed
						previousContents = currentContents;
						cachedDiff = null;
						pendingNotifications = 0;
					});
				}

				function getChanges(previousContents, currentContents) {
					// We try to re-use cached diffs.
					// The only scenario where pendingNotifications > 1 is when using the KO 'deferred updates' plugin,
					// which without this check would not be compatible with arrayChange notifications. Without that
					// plugin, notifications are always issued immediately so we wouldn't be queueing up more than one.
					if (!cachedDiff || pendingNotifications > 1) {
						cachedDiff = ko.utils.compareArrays(previousContents, currentContents, { 'sparse': true });
					}

					return cachedDiff;
				}

				target.cacheDiffForKnownOperation = function(rawArray, operationName, args) {
					// Only run if we're currently tracking changes for this observable array
					// and there aren't any pending deferred notifications.
					if (!trackingChanges || pendingNotifications) {
						return;
					}
					var diff = [],
						arrayLength = rawArray.length,
						argsLength = args.length,
						offset = 0;

					function pushDiff(status, value, index) {
						diff.push({ 'status': status, 'value': value, 'index': index });
					}
					switch (operationName) {
						case 'push':
							offset = arrayLength;
						case 'unshift':
							for (var index = 0; index < argsLength; index++) {
								pushDiff('added', args[index], offset + index);
							}
							break;

						case 'pop':
							offset = arrayLength - 1;
						case 'shift':
							if (arrayLength) {
								pushDiff('deleted', rawArray[offset], offset);
							}
							break;

						case 'splice':
							// Negative start index means 'from end of array'. After that we clamp to [0...arrayLength].
							// See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice
							var startIndex = Math.min(Math.max(0, args[0] < 0 ? arrayLength + args[0] : args[0]), arrayLength),
								endDeleteIndex = argsLength === 1 ? arrayLength : Math.min(startIndex + (args[1] || 0), arrayLength),
								endAddIndex = startIndex + argsLength - 2,
								endIndex = Math.max(endDeleteIndex, endAddIndex);
							for (var index = startIndex, argsIndex = 2; index < endIndex; ++index, ++argsIndex) {
								if (index < endDeleteIndex)
									pushDiff('deleted', rawArray[index], index);
								if (index < endAddIndex)
									pushDiff('added', args[argsIndex], index);
							}
							break;

						default:
							return;
					}
					cachedDiff = diff;
				};
			};
			ko.dependentObservable = function (evaluatorFunctionOrOptions, evaluatorFunctionTarget, options) {
				var _latestValue,
					_hasBeenEvaluated = false,
					_isBeingEvaluated = false,
					_suppressDisposalUntilDisposeWhenReturnsFalse = false,
					readFunction = evaluatorFunctionOrOptions;

				if (readFunction && typeof readFunction == "object") {
					// Single-parameter syntax - everything is on this "options" param
					options = readFunction;
					readFunction = options["read"];
				} else {
					// Multi-parameter syntax - construct the options according to the params passed
					options = options || {};
					if (!readFunction)
						readFunction = options["read"];
				}
				if (typeof readFunction != "function")
					throw new Error("Pass a function that returns the value of the ko.computed");

				function addSubscriptionToDependency(subscribable) {
					_subscriptionsToDependencies.push(subscribable.subscribe(evaluatePossiblyAsync));
				}

				function disposeAllSubscriptionsToDependencies() {
					ko.utils.arrayForEach(_subscriptionsToDependencies, function (subscription) {
						subscription.dispose();
					});
					_subscriptionsToDependencies = [];
				}

				function evaluatePossiblyAsync() {
					var throttleEvaluationTimeout = dependentObservable['throttleEvaluation'];
					if (throttleEvaluationTimeout && throttleEvaluationTimeout >= 0) {
						clearTimeout(evaluationTimeoutInstance);
						evaluationTimeoutInstance = setTimeout(evaluateImmediate, throttleEvaluationTimeout);
					} else
						evaluateImmediate();
				}

				function evaluateImmediate() {
					if (_isBeingEvaluated) {
						// If the evaluation of a ko.computed causes side effects, it's possible that it will trigger its own re-evaluation.
						// This is not desirable (it's hard for a developer to realise a chain of dependencies might cause this, and they almost
						// certainly didn't intend infinite re-evaluations). So, for predictability, we simply prevent ko.computeds from causing
						// their own re-evaluation. Further discussion at https://github.com/SteveSanderson/knockout/pull/387
						return;
					}

					if (disposeWhen && disposeWhen()) {
						// See comment below about _suppressDisposalUntilDisposeWhenReturnsFalse
						if (!_suppressDisposalUntilDisposeWhenReturnsFalse) {
							dispose();
							_hasBeenEvaluated = true;
							return;
						}
					} else {
						// It just did return false, so we can stop suppressing now
						_suppressDisposalUntilDisposeWhenReturnsFalse = false;
					}

					_isBeingEvaluated = true;
					try {
						// Initially, we assume that none of the subscriptions are still being used (i.e., all are candidates for disposal).
						// Then, during evaluation, we cross off any that are in fact still being used.
						var disposalCandidates = ko.utils.arrayMap(_subscriptionsToDependencies, function(item) {return item.target;});

						ko.dependencyDetection.begin(function(subscribable) {
							var inOld;
							if ((inOld = ko.utils.arrayIndexOf(disposalCandidates, subscribable)) >= 0)
								disposalCandidates[inOld] = undefined; // Don't want to dispose this subscription, as it's still being used
							else
								addSubscriptionToDependency(subscribable); // Brand new subscription - add it
						});

						var newValue = evaluatorFunctionTarget ? readFunction.call(evaluatorFunctionTarget) : readFunction();

						// For each subscription no longer being used, remove it from the active subscriptions list and dispose it
						for (var i = disposalCandidates.length - 1; i >= 0; i--) {
							if (disposalCandidates[i])
								_subscriptionsToDependencies.splice(i, 1)[0].dispose();
						}
						_hasBeenEvaluated = true;

						if (!dependentObservable['equalityComparer'] || !dependentObservable['equalityComparer'](_latestValue, newValue)) {
							dependentObservable["notifySubscribers"](_latestValue, "beforeChange");

							_latestValue = newValue;
							if (DEBUG) dependentObservable._latestValue = _latestValue;
							dependentObservable["notifySubscribers"](_latestValue);
						}
					} finally {
						ko.dependencyDetection.end();
						_isBeingEvaluated = false;
					}

					if (!_subscriptionsToDependencies.length)
						dispose();
				}

				function dependentObservable() {
					if (arguments.length > 0) {
						if (typeof writeFunction === "function") {
							// Writing a value
							writeFunction.apply(evaluatorFunctionTarget, arguments);
						} else {
							throw new Error("Cannot write a value to a ko.computed unless you specify a 'write' option. If you wish to read the current value, don't pass any parameters.");
						}
						return this; // Permits chained assignments
					} else {
						// Reading the value
						if (!_hasBeenEvaluated)
							evaluateImmediate();
						ko.dependencyDetection.registerDependency(dependentObservable);
						return _latestValue;
					}
				}

				function peek() {
					if (!_hasBeenEvaluated)
						evaluateImmediate();
					return _latestValue;
				}

				function isActive() {
					return !_hasBeenEvaluated || _subscriptionsToDependencies.length > 0;
				}

				// By here, "options" is always non-null
				var writeFunction = options["write"],
					disposeWhenNodeIsRemoved = options["disposeWhenNodeIsRemoved"] || options.disposeWhenNodeIsRemoved || null,
					disposeWhenOption = options["disposeWhen"] || options.disposeWhen,
					disposeWhen = disposeWhenOption,
					dispose = disposeAllSubscriptionsToDependencies,
					_subscriptionsToDependencies = [],
					evaluationTimeoutInstance = null;

				if (!evaluatorFunctionTarget)
					evaluatorFunctionTarget = options["owner"];

				dependentObservable.peek = peek;
				dependentObservable.getDependenciesCount = function () { return _subscriptionsToDependencies.length; };
				dependentObservable.hasWriteFunction = typeof options["write"] === "function";
				dependentObservable.dispose = function () { dispose(); };
				dependentObservable.isActive = isActive;

				ko.subscribable.call(dependentObservable);
				ko.utils.extend(dependentObservable, ko.dependentObservable['fn']);

				ko.exportProperty(dependentObservable, 'peek', dependentObservable.peek);
				ko.exportProperty(dependentObservable, 'dispose', dependentObservable.dispose);
				ko.exportProperty(dependentObservable, 'isActive', dependentObservable.isActive);
				ko.exportProperty(dependentObservable, 'getDependenciesCount', dependentObservable.getDependenciesCount);

				// Add a "disposeWhen" callback that, on each evaluation, disposes if the node was removed without using ko.removeNode.
				if (disposeWhenNodeIsRemoved) {
					// Since this computed is associated with a DOM node, and we don't want to dispose the computed
					// until the DOM node is *removed* from the document (as opposed to never having been in the document),
					// we'll prevent disposal until "disposeWhen" first returns false.
					_suppressDisposalUntilDisposeWhenReturnsFalse = true;

					// Only watch for the node's disposal if the value really is a node. It might not be,
					// e.g., { disposeWhenNodeIsRemoved: true } can be used to opt into the "only dispose
					// after first false result" behaviour even if there's no specific node to watch. This
					// technique is intended for KO's internal use only and shouldn't be documented or used
					// by application code, as it's likely to change in a future version of KO.
					if (disposeWhenNodeIsRemoved.nodeType) {
						disposeWhen = function () {
							return !ko.utils.domNodeIsAttachedToDocument(disposeWhenNodeIsRemoved) || (disposeWhenOption && disposeWhenOption());
						};
					}
				}

				// Evaluate, unless deferEvaluation is true
				if (options['deferEvaluation'] !== true)
					evaluateImmediate();

				// Attach a DOM node disposal callback so that the computed will be proactively disposed as soon as the node is
				// removed using ko.removeNode. But skip if isActive is false (there will never be any dependencies to dispose).
				if (disposeWhenNodeIsRemoved && isActive()) {
					dispose = function() {
						ko.utils.domNodeDisposal.removeDisposeCallback(disposeWhenNodeIsRemoved, dispose);
						disposeAllSubscriptionsToDependencies();
					};
					ko.utils.domNodeDisposal.addDisposeCallback(disposeWhenNodeIsRemoved, dispose);
				}

				return dependentObservable;
			};

			ko.isComputed = function(instance) {
				return ko.hasPrototype(instance, ko.dependentObservable);
			};

			var protoProp = ko.observable.protoProperty; // == "__ko_proto__"
			ko.dependentObservable[protoProp] = ko.observable;

			ko.dependentObservable['fn'] = {
				"equalityComparer": valuesArePrimitiveAndEqual
			};
			ko.dependentObservable['fn'][protoProp] = ko.dependentObservable;

			ko.exportSymbol('dependentObservable', ko.dependentObservable);
			ko.exportSymbol('computed', ko.dependentObservable); // Make "ko.computed" an alias for "ko.dependentObservable"
			ko.exportSymbol('isComputed', ko.isComputed);

			(function() {
				var maxNestedObservableDepth = 10; // Escape the (unlikely) pathalogical case where an observable's current value is itself (or similar reference cycle)

				ko.toJS = function(rootObject) {
					if (arguments.length == 0)
						throw new Error("When calling ko.toJS, pass the object you want to convert.");

					// We just unwrap everything at every level in the object graph
					return mapJsObjectGraph(rootObject, function(valueToMap) {
						// Loop because an observable's value might in turn be another observable wrapper
						for (var i = 0; ko.isObservable(valueToMap) && (i < maxNestedObservableDepth); i++)
							valueToMap = valueToMap();
						return valueToMap;
					});
				};

				ko.toJSON = function(rootObject, replacer, space) {     // replacer and space are optional
					var plainJavaScriptObject = ko.toJS(rootObject);
					return ko.utils.stringifyJson(plainJavaScriptObject, replacer, space);
				};

				function mapJsObjectGraph(rootObject, mapInputCallback, visitedObjects) {
					visitedObjects = visitedObjects || new objectLookup();

					rootObject = mapInputCallback(rootObject);
					var canHaveProperties = (typeof rootObject == "object") && (rootObject !== null) && (rootObject !== undefined) && (!(rootObject instanceof Date)) && (!(rootObject instanceof String)) && (!(rootObject instanceof Number)) && (!(rootObject instanceof Boolean));
					if (!canHaveProperties)
						return rootObject;

					var outputProperties = rootObject instanceof Array ? [] : {};
					visitedObjects.save(rootObject, outputProperties);

					visitPropertiesOrArrayEntries(rootObject, function(indexer) {
						var propertyValue = mapInputCallback(rootObject[indexer]);

						switch (typeof propertyValue) {
							case "boolean":
							case "number":
							case "string":
							case "function":
								outputProperties[indexer] = propertyValue;
								break;
							case "object":
							case "undefined":
								var previouslyMappedValue = visitedObjects.get(propertyValue);
								outputProperties[indexer] = (previouslyMappedValue !== undefined)
									? previouslyMappedValue
									: mapJsObjectGraph(propertyValue, mapInputCallback, visitedObjects);
								break;
						}
					});

					return outputProperties;
				}

				function visitPropertiesOrArrayEntries(rootObject, visitorCallback) {
					if (rootObject instanceof Array) {
						for (var i = 0; i < rootObject.length; i++)
							visitorCallback(i);

						// For arrays, also respect toJSON property for custom mappings (fixes #278)
						if (typeof rootObject['toJSON'] == 'function')
							visitorCallback('toJSON');
					} else {
						for (var propertyName in rootObject) {
							visitorCallback(propertyName);
						}
					}
				};

				function objectLookup() {
					this.keys = [];
					this.values = [];
				};

				objectLookup.prototype = {
					constructor: objectLookup,
					save: function(key, value) {
						var existingIndex = ko.utils.arrayIndexOf(this.keys, key);
						if (existingIndex >= 0)
							this.values[existingIndex] = value;
						else {
							this.keys.push(key);
							this.values.push(value);
						}
					},
					get: function(key) {
						var existingIndex = ko.utils.arrayIndexOf(this.keys, key);
						return (existingIndex >= 0) ? this.values[existingIndex] : undefined;
					}
				};
			})();

			ko.exportSymbol('toJS', ko.toJS);
			ko.exportSymbol('toJSON', ko.toJSON);
			(function () {
				var hasDomDataExpandoProperty = '__ko__hasDomDataOptionValue__';

				// Normally, SELECT elements and their OPTIONs can only take value of type 'string' (because the values
				// are stored on DOM attributes). ko.selectExtensions provides a way for SELECTs/OPTIONs to have values
				// that are arbitrary objects. This is very convenient when implementing things like cascading dropdowns.
				ko.selectExtensions = {
					readValue : function(element) {
						switch (ko.utils.tagNameLower(element)) {
							case 'option':
								if (element[hasDomDataExpandoProperty] === true)
									return ko.utils.domData.get(element, ko.bindingHandlers.options.optionValueDomDataKey);
								return ko.utils.ieVersion <= 7
									? (element.getAttributeNode('value') && element.getAttributeNode('value').specified ? element.value : element.text)
									: element.value;
							case 'select':
								return element.selectedIndex >= 0 ? ko.selectExtensions.readValue(element.options[element.selectedIndex]) : undefined;
							default:
								return element.value;
						}
					},

					writeValue: function(element, value) {
						switch (ko.utils.tagNameLower(element)) {
							case 'option':
								switch(typeof value) {
									case "string":
										ko.utils.domData.set(element, ko.bindingHandlers.options.optionValueDomDataKey, undefined);
										if (hasDomDataExpandoProperty in element) { // IE <= 8 throws errors if you delete non-existent properties from a DOM node
											delete element[hasDomDataExpandoProperty];
										}
										element.value = value;
										break;
									default:
										// Store arbitrary object using DomData
										ko.utils.domData.set(element, ko.bindingHandlers.options.optionValueDomDataKey, value);
										element[hasDomDataExpandoProperty] = true;

										// Special treatment of numbers is just for backward compatibility. KO 1.2.1 wrote numerical values to element.value.
										element.value = typeof value === "number" ? value : "";
										break;
								}
								break;
							case 'select':
								if (value === "")
									value = undefined;
								if (value === null || value === undefined)
									element.selectedIndex = -1;
								for (var i = element.options.length - 1; i >= 0; i--) {
									if (ko.selectExtensions.readValue(element.options[i]) == value) {
										element.selectedIndex = i;
										break;
									}
								}
								// for drop-down select, ensure first is selected
								if (!(element.size > 1) && element.selectedIndex === -1) {
									element.selectedIndex = 0;
								}
								break;
							default:
								if ((value === null) || (value === undefined))
									value = "";
								element.value = value;
								break;
						}
					}
				};
			})();

			ko.exportSymbol('selectExtensions', ko.selectExtensions);
			ko.exportSymbol('selectExtensions.readValue', ko.selectExtensions.readValue);
			ko.exportSymbol('selectExtensions.writeValue', ko.selectExtensions.writeValue);
			ko.expressionRewriting = (function () {
				var javaScriptReservedWords = ["true", "false", "null", "undefined"];

				// Matches something that can be assigned to--either an isolated identifier or something ending with a property accessor
				// This is designed to be simple and avoid false negatives, but could produce false positives (e.g., a+b.c).
				// This also will not properly handle nested brackets (e.g., obj1[obj2['prop']]; see #911).
				var javaScriptAssignmentTarget = /^(?:[$_a-z][$\w]*|(.+)(\.\s*[$_a-z][$\w]*|\[.+\]))$/i;

				function getWriteableValue(expression) {
					if (ko.utils.arrayIndexOf(javaScriptReservedWords, expression) >= 0)
						return false;
					var match = expression.match(javaScriptAssignmentTarget);
					return match === null ? false : match[1] ? ('Object(' + match[1] + ')' + match[2]) : expression;
				}

				// The following regular expressions will be used to split an object-literal string into tokens

				// These two match strings, either with double quotes or single quotes
				var stringDouble = '"(?:[^"\\\\]|\\\\.)*"',
					stringSingle = "'(?:[^'\\\\]|\\\\.)*'",
				// Matches a regular expression (text enclosed by slashes), but will also match sets of divisions
				// as a regular expression (this is handled by the parsing loop below).
					stringRegexp = '/(?:[^/\\\\]|\\\\.)*/\w*',
				// These characters have special meaning to the parser and must not appear in the middle of a
				// token, except as part of a string.
					specials = ',"\'{}()/:[\\]',
				// Match text (at least two characters) that does not contain any of the above special characters,
				// although some of the special characters are allowed to start it (all but the colon and comma).
				// The text can contain spaces, but leading or trailing spaces are skipped.
					everyThingElse = '[^\\s:,/][^' + specials + ']*[^\\s' + specials + ']',
				// Match any non-space character not matched already. This will match colons and commas, since they're
				// not matched by "everyThingElse", but will also match any other single character that wasn't already
				// matched (for example: in "a: 1, b: 2", each of the non-space characters will be matched by oneNotSpace).
					oneNotSpace = '[^\\s]',

				// Create the actual regular expression by or-ing the above strings. The order is important.
					bindingToken = RegExp(stringDouble + '|' + stringSingle + '|' + stringRegexp + '|' + everyThingElse + '|' + oneNotSpace, 'g'),

				// Match end of previous token to determine whether a slash is a division or regex.
					divisionLookBehind = /[\])"'A-Za-z0-9_$]+$/,
					keywordRegexLookBehind = {'in':1,'return':1,'typeof':1};

				function parseObjectLiteral(objectLiteralString) {
					// Trim leading and trailing spaces from the string
					var str = ko.utils.stringTrim(objectLiteralString);

					// Trim braces '{' surrounding the whole object literal
					if (str.charCodeAt(0) === 123) str = str.slice(1, -1);

					// Split into tokens
					var result = [], toks = str.match(bindingToken), key, values, depth = 0;

					if (toks) {
						// Append a comma so that we don't need a separate code block to deal with the last item
						toks.push(',');

						for (var i = 0, tok; tok = toks[i]; ++i) {
							var c = tok.charCodeAt(0);
							// A comma signals the end of a key/value pair if depth is zero
							if (c === 44) { // ","
								if (depth <= 0) {
									if (key)
										result.push(values ? {key: key, value: values.join('')} : {'unknown': key});
									key = values = depth = 0;
									continue;
								}
								// Simply skip the colon that separates the name and value
							} else if (c === 58) { // ":"
								if (!values)
									continue;
								// A set of slashes is initially matched as a regular expression, but could be division
							} else if (c === 47 && i && tok.length > 1) {  // "/"
								// Look at the end of the previous token to determine if the slash is actually division
								var match = toks[i-1].match(divisionLookBehind);
								if (match && !keywordRegexLookBehind[match[0]]) {
									// The slash is actually a division punctuator; re-parse the remainder of the string (not including the slash)
									str = str.substr(str.indexOf(tok) + 1);
									toks = str.match(bindingToken);
									toks.push(',');
									i = -1;
									// Continue with just the slash
									tok = '/';
								}
								// Increment depth for parentheses, braces, and brackets so that interior commas are ignored
							} else if (c === 40 || c === 123 || c === 91) { // '(', '{', '['
								++depth;
							} else if (c === 41 || c === 125 || c === 93) { // ')', '}', ']'
								--depth;
								// The key must be a single token; if it's a string, trim the quotes
							} else if (!key && !values) {
								key = (c === 34 || c === 39) /* '"', "'" */ ? tok.slice(1, -1) : tok;
								continue;
							}
							if (values)
								values.push(tok);
							else
								values = [tok];
						}
					}
					return result;
				}

				// Two-way bindings include a write function that allow the handler to update the value even if it's not an observable.
				var twoWayBindings = {};

				function preProcessBindings(bindingsStringOrKeyValueArray, bindingOptions) {
					bindingOptions = bindingOptions || {};

					function processKeyValue(key, val) {
						var writableVal;
						function callPreprocessHook(obj) {
							return (obj && obj['preprocess']) ? (val = obj['preprocess'](val, key, processKeyValue)) : true;
						}
						if (!callPreprocessHook(ko['getBindingHandler'](key)))
							return;

						if (twoWayBindings[key] && (writableVal = getWriteableValue(val))) {
							// For two-way bindings, provide a write method in case the value
							// isn't a writable observable.
							propertyAccessorResultStrings.push("'" + key + "':function(_z){" + writableVal + "=_z}");
						}

						// Values are wrapped in a function so that each value can be accessed independently
						if (makeValueAccessors) {
							val = 'function(){return ' + val + ' }';
						}
						resultStrings.push("'" + key + "':" + val);
					}

					var resultStrings = [],
						propertyAccessorResultStrings = [],
						makeValueAccessors = bindingOptions['valueAccessors'],
						keyValueArray = typeof bindingsStringOrKeyValueArray === "string" ?
							parseObjectLiteral(bindingsStringOrKeyValueArray) : bindingsStringOrKeyValueArray;

					ko.utils.arrayForEach(keyValueArray, function(keyValue) {
						processKeyValue(keyValue.key || keyValue['unknown'], keyValue.value);
					});

					if (propertyAccessorResultStrings.length)
						processKeyValue('_ko_property_writers', "{" + propertyAccessorResultStrings.join(",") + "}");

					return resultStrings.join(",");
				}

				return {
					bindingRewriteValidators: [],

					twoWayBindings: twoWayBindings,

					parseObjectLiteral: parseObjectLiteral,

					preProcessBindings: preProcessBindings,

					keyValueArrayContainsKey: function(keyValueArray, key) {
						for (var i = 0; i < keyValueArray.length; i++)
							if (keyValueArray[i]['key'] == key)
								return true;
						return false;
					},

					// Internal, private KO utility for updating model properties from within bindings
					// property:            If the property being updated is (or might be) an observable, pass it here
					//                      If it turns out to be a writable observable, it will be written to directly
					// allBindings:         An object with a get method to retrieve bindings in the current execution context.
					//                      This will be searched for a '_ko_property_writers' property in case you're writing to a non-observable
					// key:                 The key identifying the property to be written. Example: for { hasFocus: myValue }, write to 'myValue' by specifying the key 'hasFocus'
					// value:               The value to be written
					// checkIfDifferent:    If true, and if the property being written is a writable observable, the value will only be written if
					//                      it is !== existing value on that writable observable
					writeValueToProperty: function(property, allBindings, key, value, checkIfDifferent) {
						if (!property || !ko.isObservable(property)) {
							var propWriters = allBindings.get('_ko_property_writers');
							if (propWriters && propWriters[key])
								propWriters[key](value);
						} else if (ko.isWriteableObservable(property) && (!checkIfDifferent || property.peek() !== value)) {
							property(value);
						}
					}
				};
			})();

			ko.exportSymbol('expressionRewriting', ko.expressionRewriting);
			ko.exportSymbol('expressionRewriting.bindingRewriteValidators', ko.expressionRewriting.bindingRewriteValidators);
			ko.exportSymbol('expressionRewriting.parseObjectLiteral', ko.expressionRewriting.parseObjectLiteral);
			ko.exportSymbol('expressionRewriting.preProcessBindings', ko.expressionRewriting.preProcessBindings);

// Making bindings explicitly declare themselves as "two way" isn't ideal in the long term (it would be better if
// all bindings could use an official 'property writer' API without needing to declare that they might). However,
// since this is not, and has never been, a public API (_ko_property_writers was never documented), it's acceptable
// as an internal implementation detail in the short term.
// For those developers who rely on _ko_property_writers in their custom bindings, we expose _twoWayBindings as an
// undocumented feature that makes it relatively easy to upgrade to KO 3.0. However, this is still not an official
// public API, and we reserve the right to remove it at any time if we create a real public property writers API.
			ko.exportSymbol('expressionRewriting._twoWayBindings', ko.expressionRewriting.twoWayBindings);

// For backward compatibility, define the following aliases. (Previously, these function names were misleading because
// they referred to JSON specifically, even though they actually work with arbitrary JavaScript object literal expressions.)
			ko.exportSymbol('jsonExpressionRewriting', ko.expressionRewriting);
			ko.exportSymbol('jsonExpressionRewriting.insertPropertyAccessorsIntoJson', ko.expressionRewriting.preProcessBindings);
			(function() {
				// "Virtual elements" is an abstraction on top of the usual DOM API which understands the notion that comment nodes
				// may be used to represent hierarchy (in addition to the DOM's natural hierarchy).
				// If you call the DOM-manipulating functions on ko.virtualElements, you will be able to read and write the state
				// of that virtual hierarchy
				//
				// The point of all this is to support containerless templates (e.g., <!-- ko foreach:someCollection -->blah<!-- /ko -->)
				// without having to scatter special cases all over the binding and templating code.

				// IE 9 cannot reliably read the "nodeValue" property of a comment node (see https://github.com/SteveSanderson/knockout/issues/186)
				// but it does give them a nonstandard alternative property called "text" that it can read reliably. Other browsers don't have that property.
				// So, use node.text where available, and node.nodeValue elsewhere
				var commentNodesHaveTextProperty = document && document.createComment("test").text === "<!--test-->";

				var startCommentRegex = commentNodesHaveTextProperty ? /^<!--\s*ko(?:\s+([\s\S]+))?\s*-->$/ : /^\s*ko(?:\s+([\s\S]+))?\s*$/;
				var endCommentRegex =   commentNodesHaveTextProperty ? /^<!--\s*\/ko\s*-->$/ : /^\s*\/ko\s*$/;
				var htmlTagsWithOptionallyClosingChildren = { 'ul': true, 'ol': true };

				function isStartComment(node) {
					return (node.nodeType == 8) && startCommentRegex.test(commentNodesHaveTextProperty ? node.text : node.nodeValue);
				}

				function isEndComment(node) {
					return (node.nodeType == 8) && endCommentRegex.test(commentNodesHaveTextProperty ? node.text : node.nodeValue);
				}

				function getVirtualChildren(startComment, allowUnbalanced) {
					var currentNode = startComment;
					var depth = 1;
					var children = [];
					while (currentNode = currentNode.nextSibling) {
						if (isEndComment(currentNode)) {
							depth--;
							if (depth === 0)
								return children;
						}

						children.push(currentNode);

						if (isStartComment(currentNode))
							depth++;
					}
					if (!allowUnbalanced)
						throw new Error("Cannot find closing comment tag to match: " + startComment.nodeValue);
					return null;
				}

				function getMatchingEndComment(startComment, allowUnbalanced) {
					var allVirtualChildren = getVirtualChildren(startComment, allowUnbalanced);
					if (allVirtualChildren) {
						if (allVirtualChildren.length > 0)
							return allVirtualChildren[allVirtualChildren.length - 1].nextSibling;
						return startComment.nextSibling;
					} else
						return null; // Must have no matching end comment, and allowUnbalanced is true
				}

				function getUnbalancedChildTags(node) {
					// e.g., from <div>OK</div><!-- ko blah --><span>Another</span>, returns: <!-- ko blah --><span>Another</span>
					//       from <div>OK</div><!-- /ko --><!-- /ko -->,             returns: <!-- /ko --><!-- /ko -->
					var childNode = node.firstChild, captureRemaining = null;
					if (childNode) {
						do {
							if (captureRemaining)                   // We already hit an unbalanced node and are now just scooping up all subsequent nodes
								captureRemaining.push(childNode);
							else if (isStartComment(childNode)) {
								var matchingEndComment = getMatchingEndComment(childNode, /* allowUnbalanced: */ true);
								if (matchingEndComment)             // It's a balanced tag, so skip immediately to the end of this virtual set
									childNode = matchingEndComment;
								else
									captureRemaining = [childNode]; // It's unbalanced, so start capturing from this point
							} else if (isEndComment(childNode)) {
								captureRemaining = [childNode];     // It's unbalanced (if it wasn't, we'd have skipped over it already), so start capturing
							}
						} while (childNode = childNode.nextSibling);
					}
					return captureRemaining;
				}

				ko.virtualElements = {
					allowedBindings: {},

					childNodes: function(node) {
						return isStartComment(node) ? getVirtualChildren(node) : node.childNodes;
					},

					emptyNode: function(node) {
						if (!isStartComment(node))
							ko.utils.emptyDomNode(node);
						else {
							var virtualChildren = ko.virtualElements.childNodes(node);
							for (var i = 0, j = virtualChildren.length; i < j; i++)
								ko.removeNode(virtualChildren[i]);
						}
					},

					setDomNodeChildren: function(node, childNodes) {
						if (!isStartComment(node))
							ko.utils.setDomNodeChildren(node, childNodes);
						else {
							ko.virtualElements.emptyNode(node);
							var endCommentNode = node.nextSibling; // Must be the next sibling, as we just emptied the children
							for (var i = 0, j = childNodes.length; i < j; i++)
								endCommentNode.parentNode.insertBefore(childNodes[i], endCommentNode);
						}
					},

					prepend: function(containerNode, nodeToPrepend) {
						if (!isStartComment(containerNode)) {
							if (containerNode.firstChild)
								containerNode.insertBefore(nodeToPrepend, containerNode.firstChild);
							else
								containerNode.appendChild(nodeToPrepend);
						} else {
							// Start comments must always have a parent and at least one following sibling (the end comment)
							containerNode.parentNode.insertBefore(nodeToPrepend, containerNode.nextSibling);
						}
					},

					insertAfter: function(containerNode, nodeToInsert, insertAfterNode) {
						if (!insertAfterNode) {
							ko.virtualElements.prepend(containerNode, nodeToInsert);
						} else if (!isStartComment(containerNode)) {
							// Insert after insertion point
							if (insertAfterNode.nextSibling)
								containerNode.insertBefore(nodeToInsert, insertAfterNode.nextSibling);
							else
								containerNode.appendChild(nodeToInsert);
						} else {
							// Children of start comments must always have a parent and at least one following sibling (the end comment)
							containerNode.parentNode.insertBefore(nodeToInsert, insertAfterNode.nextSibling);
						}
					},

					firstChild: function(node) {
						if (!isStartComment(node))
							return node.firstChild;
						if (!node.nextSibling || isEndComment(node.nextSibling))
							return null;
						return node.nextSibling;
					},

					nextSibling: function(node) {
						if (isStartComment(node))
							node = getMatchingEndComment(node);
						if (node.nextSibling && isEndComment(node.nextSibling))
							return null;
						return node.nextSibling;
					},

					hasBindingValue: isStartComment,

					virtualNodeBindingValue: function(node) {
						var regexMatch = (commentNodesHaveTextProperty ? node.text : node.nodeValue).match(startCommentRegex);
						return regexMatch ? regexMatch[1] : null;
					},

					normaliseVirtualElementDomStructure: function(elementVerified) {
						// Workaround for https://github.com/SteveSanderson/knockout/issues/155
						// (IE <= 8 or IE 9 quirks mode parses your HTML weirdly, treating closing </li> tags as if they don't exist, thereby moving comment nodes
						// that are direct descendants of <ul> into the preceding <li>)
						if (!htmlTagsWithOptionallyClosingChildren[ko.utils.tagNameLower(elementVerified)])
							return;

						// Scan immediate children to see if they contain unbalanced comment tags. If they do, those comment tags
						// must be intended to appear *after* that child, so move them there.
						var childNode = elementVerified.firstChild;
						if (childNode) {
							do {
								if (childNode.nodeType === 1) {
									var unbalancedTags = getUnbalancedChildTags(childNode);
									if (unbalancedTags) {
										// Fix up the DOM by moving the unbalanced tags to where they most likely were intended to be placed - *after* the child
										var nodeToInsertBefore = childNode.nextSibling;
										for (var i = 0; i < unbalancedTags.length; i++) {
											if (nodeToInsertBefore)
												elementVerified.insertBefore(unbalancedTags[i], nodeToInsertBefore);
											else
												elementVerified.appendChild(unbalancedTags[i]);
										}
									}
								}
							} while (childNode = childNode.nextSibling);
						}
					}
				};
			})();
			ko.exportSymbol('virtualElements', ko.virtualElements);
			ko.exportSymbol('virtualElements.allowedBindings', ko.virtualElements.allowedBindings);
			ko.exportSymbol('virtualElements.emptyNode', ko.virtualElements.emptyNode);
//ko.exportSymbol('virtualElements.firstChild', ko.virtualElements.firstChild);     // firstChild is not minified
			ko.exportSymbol('virtualElements.insertAfter', ko.virtualElements.insertAfter);
//ko.exportSymbol('virtualElements.nextSibling', ko.virtualElements.nextSibling);   // nextSibling is not minified
			ko.exportSymbol('virtualElements.prepend', ko.virtualElements.prepend);
			ko.exportSymbol('virtualElements.setDomNodeChildren', ko.virtualElements.setDomNodeChildren);
			(function() {
				var defaultBindingAttributeName = "data-bind";

				ko.bindingProvider = function() {
					this.bindingCache = {};
				};

				ko.utils.extend(ko.bindingProvider.prototype, {
					'nodeHasBindings': function(node) {
						switch (node.nodeType) {
							case 1: return node.getAttribute(defaultBindingAttributeName) != null;   // Element
							case 8: return ko.virtualElements.hasBindingValue(node); // Comment node
							default: return false;
						}
					},

					'getBindings': function(node, bindingContext) {
						var bindingsString = this['getBindingsString'](node, bindingContext);
						return bindingsString ? this['parseBindingsString'](bindingsString, bindingContext, node) : null;
					},

					'getBindingAccessors': function(node, bindingContext) {
						var bindingsString = this['getBindingsString'](node, bindingContext);
						return bindingsString ? this['parseBindingsString'](bindingsString, bindingContext, node, {'valueAccessors':true}) : null;
					},

					// The following function is only used internally by this default provider.
					// It's not part of the interface definition for a general binding provider.
					'getBindingsString': function(node, bindingContext) {
						switch (node.nodeType) {
							case 1: return node.getAttribute(defaultBindingAttributeName);   // Element
							case 8: return ko.virtualElements.virtualNodeBindingValue(node); // Comment node
							default: return null;
						}
					},

					// The following function is only used internally by this default provider.
					// It's not part of the interface definition for a general binding provider.
					'parseBindingsString': function(bindingsString, bindingContext, node, options) {
						try {
							var bindingFunction = createBindingsStringEvaluatorViaCache(bindingsString, this.bindingCache, options);
							return bindingFunction(bindingContext, node);
						} catch (ex) {
							ex.message = "Unable to parse bindings.\nBindings value: " + bindingsString + "\nMessage: " + ex.message;
							throw ex;
						}
					}
				});

				ko.bindingProvider['instance'] = new ko.bindingProvider();

				function createBindingsStringEvaluatorViaCache(bindingsString, cache, options) {
					var cacheKey = bindingsString + (options && options['valueAccessors'] || '');
					return cache[cacheKey]
						|| (cache[cacheKey] = createBindingsStringEvaluator(bindingsString, options));
				}

				function createBindingsStringEvaluator(bindingsString, options) {
					// Build the source for a function that evaluates "expression"
					// For each scope variable, add an extra level of "with" nesting
					// Example result: with(sc1) { with(sc0) { return (expression) } }
					var rewrittenBindings = ko.expressionRewriting.preProcessBindings(bindingsString, options),
						functionBody = "with($context){with($data||{}){return{" + rewrittenBindings + "}}}";
					return new Function("$context", "$element", functionBody);
				}
			})();

			ko.exportSymbol('bindingProvider', ko.bindingProvider);
			(function () {
				ko.bindingHandlers = {};

				// The following element types will not be recursed into during binding. In the future, we
				// may consider adding <template> to this list, because such elements' contents are always
				// intended to be bound in a different context from where they appear in the document.
				var bindingDoesNotRecurseIntoElementTypes = {
					// Don't want bindings that operate on text nodes to mutate <script> contents,
					// because it's unexpected and a potential XSS issue
					'script': true
				};

				// Use an overridable method for retrieving binding handlers so that a plugins may support dynamically created handlers
				ko['getBindingHandler'] = function(bindingKey) {
					return ko.bindingHandlers[bindingKey];
				};

				// The ko.bindingContext constructor is only called directly to create the root context. For child
				// contexts, use bindingContext.createChildContext or bindingContext.extend.
				ko.bindingContext = function(dataItemOrAccessor, parentContext, dataItemAlias, extendCallback) {

					// The binding context object includes static properties for the current, parent, and root view models.
					// If a view model is actually stored in an observable, the corresponding binding context object, and
					// any child contexts, must be updated when the view model is changed.
					function updateContext() {
						// Most of the time, the context will directly get a view model object, but if a function is given,
						// we call the function to retrieve the view model. If the function accesses any obsevables (or is
						// itself an observable), the dependency is tracked, and those observables can later cause the binding
						// context to be updated.
						var dataItem = isFunc ? dataItemOrAccessor() : dataItemOrAccessor;

						if (parentContext) {
							// When a "parent" context is given, register a dependency on the parent context. Thus whenever the
							// parent context is updated, this context will also be updated.
							if (parentContext._subscribable)
								parentContext._subscribable();

							// Copy $root and any custom properties from the parent context
							ko.utils.extend(self, parentContext);

							// Because the above copy overwrites our own properties, we need to reset them.
							// During the first execution, "subscribable" isn't set, so don't bother doing the update then.
							if (subscribable) {
								self._subscribable = subscribable;
							}
						} else {
							self['$parents'] = [];
							self['$root'] = dataItem;

							// Export 'ko' in the binding context so it will be available in bindings and templates
							// even if 'ko' isn't exported as a global, such as when using an AMD loader.
							// See https://github.com/SteveSanderson/knockout/issues/490
							self['ko'] = ko;
						}
						self['$rawData'] = dataItemOrAccessor;
						self['$data'] = dataItem;
						if (dataItemAlias)
							self[dataItemAlias] = dataItem;

						// The extendCallback function is provided when creating a child context or extending a context.
						// It handles the specific actions needed to finish setting up the binding context. Actions in this
						// function could also add dependencies to this binding context.
						if (extendCallback)
							extendCallback(self, parentContext, dataItem);

						return self['$data'];
					}
					function disposeWhen() {
						return nodes && !ko.utils.anyDomNodeIsAttachedToDocument(nodes);
					}

					var self = this,
						isFunc = typeof(dataItemOrAccessor) == "function",
						nodes,
						subscribable = ko.dependentObservable(updateContext, null, { disposeWhen: disposeWhen, disposeWhenNodeIsRemoved: true });

					// At this point, the binding context has been initialized, and the "subscribable" computed observable is
					// subscribed to any observables that were accessed in the process. If there is nothing to track, the
					// computed will be inactive, and we can safely throw it away. If it's active, the computed is stored in
					// the context object.
					if (subscribable.isActive()) {
						self._subscribable = subscribable;

						// Always notify because even if the model ($data) hasn't changed, other context properties might have changed
						subscribable['equalityComparer'] = null;

						// We need to be able to dispose of this computed observable when it's no longer needed. This would be
						// easy if we had a single node to watch, but binding contexts can be used by many different nodes, and
						// we cannot assume that those nodes have any relation to each other. So instead we track any node that
						// the context is attached to, and dispose the computed when all of those nodes have been cleaned.

						// Add properties to *subscribable* instead of *self* because any properties added to *self* may be overwritten on updates
						nodes = [];
						subscribable._addNode = function(node) {
							nodes.push(node);
							ko.utils.domNodeDisposal.addDisposeCallback(node, function(node) {
								ko.utils.arrayRemoveItem(nodes, node);
								if (!nodes.length) {
									subscribable.dispose();
									self._subscribable = subscribable = undefined;
								}
							});
						};
					}
				}

				// Extend the binding context hierarchy with a new view model object. If the parent context is watching
				// any obsevables, the new child context will automatically get a dependency on the parent context.
				// But this does not mean that the $data value of the child context will also get updated. If the child
				// view model also depends on the parent view model, you must provide a function that returns the correct
				// view model on each update.
				ko.bindingContext.prototype['createChildContext'] = function (dataItemOrAccessor, dataItemAlias, extendCallback) {
					return new ko.bindingContext(dataItemOrAccessor, this, dataItemAlias, function(self, parentContext) {
						// Extend the context hierarchy by setting the appropriate pointers
						self['$parentContext'] = parentContext;
						self['$parent'] = parentContext['$data'];
						self['$parents'] = (parentContext['$parents'] || []).slice(0);
						self['$parents'].unshift(self['$parent']);
						if (extendCallback)
							extendCallback(self);
					});
				};

				// Extend the binding context with new custom properties. This doesn't change the context hierarchy.
				// Similarly to "child" contexts, provide a function here to make sure that the correct values are set
				// when an observable view model is updated.
				ko.bindingContext.prototype['extend'] = function(properties) {
					return new ko.bindingContext(this['$rawData'], this, null, function(self) {
						ko.utils.extend(self, typeof(properties) == "function" ? properties() : properties);
					});
				};

				// Returns the valueAccesor function for a binding value
				function makeValueAccessor(value) {
					return function() {
						return value;
					};
				}

				// Returns the value of a valueAccessor function
				function evaluateValueAccessor(valueAccessor) {
					return valueAccessor();
				}

				// Given a function that returns bindings, create and return a new object that contains
				// binding value-accessors functions. Each accessor function calls the original function
				// so that it always gets the latest value and all dependencies are captured. This is used
				// by ko.applyBindingsToNode and getBindingsAndMakeAccessors.
				function makeAccessorsFromFunction(callback) {
					return ko.utils.objectMap(ko.dependencyDetection.ignore(callback), function(value, key) {
						return function() {
							return callback()[key];
						};
					});
				}

				// Given a bindings function or object, create and return a new object that contains
				// binding value-accessors functions. This is used by ko.applyBindingsToNode.
				function makeBindingAccessors(bindings, context, node) {
					if (typeof bindings === 'function') {
						return makeAccessorsFromFunction(bindings.bind(null, context, node));
					} else {
						return ko.utils.objectMap(bindings, makeValueAccessor);
					}
				}

				// This function is used if the binding provider doesn't include a getBindingAccessors function.
				// It must be called with 'this' set to the provider instance.
				function getBindingsAndMakeAccessors(node, context) {
					return makeAccessorsFromFunction(this['getBindings'].bind(this, node, context));
				}

				function validateThatBindingIsAllowedForVirtualElements(bindingName) {
					var validator = ko.virtualElements.allowedBindings[bindingName];
					if (!validator)
						throw new Error("The binding '" + bindingName + "' cannot be used with virtual elements")
				}

				function applyBindingsToDescendantsInternal (bindingContext, elementOrVirtualElement, bindingContextsMayDifferFromDomParentElement) {
					var currentChild,
						nextInQueue = ko.virtualElements.firstChild(elementOrVirtualElement),
						provider = ko.bindingProvider['instance'],
						preprocessNode = provider['preprocessNode'];

					// Preprocessing allows a binding provider to mutate a node before bindings are applied to it. For example it's
					// possible to insert new siblings after it, and/or replace the node with a different one. This can be used to
					// implement custom binding syntaxes, such as {{ value }} for string interpolation, or custom element types that
					// trigger insertion of <template> contents at that point in the document.
					if (preprocessNode) {
						while (currentChild = nextInQueue) {
							nextInQueue = ko.virtualElements.nextSibling(currentChild);
							preprocessNode.call(provider, currentChild);
						}
						// Reset nextInQueue for the next loop
						nextInQueue = ko.virtualElements.firstChild(elementOrVirtualElement);
					}

					while (currentChild = nextInQueue) {
						// Keep a record of the next child *before* applying bindings, in case the binding removes the current child from its position
						nextInQueue = ko.virtualElements.nextSibling(currentChild);
						applyBindingsToNodeAndDescendantsInternal(bindingContext, currentChild, bindingContextsMayDifferFromDomParentElement);
					}
				}

				function applyBindingsToNodeAndDescendantsInternal (bindingContext, nodeVerified, bindingContextMayDifferFromDomParentElement) {
					var shouldBindDescendants = true;

					// Perf optimisation: Apply bindings only if...
					// (1) We need to store the binding context on this node (because it may differ from the DOM parent node's binding context)
					//     Note that we can't store binding contexts on non-elements (e.g., text nodes), as IE doesn't allow expando properties for those
					// (2) It might have bindings (e.g., it has a data-bind attribute, or it's a marker for a containerless template)
					var isElement = (nodeVerified.nodeType === 1);
					if (isElement) // Workaround IE <= 8 HTML parsing weirdness
						ko.virtualElements.normaliseVirtualElementDomStructure(nodeVerified);

					var shouldApplyBindings = (isElement && bindingContextMayDifferFromDomParentElement)             // Case (1)
						|| ko.bindingProvider['instance']['nodeHasBindings'](nodeVerified);       // Case (2)
					if (shouldApplyBindings)
						shouldBindDescendants = applyBindingsToNodeInternal(nodeVerified, null, bindingContext, bindingContextMayDifferFromDomParentElement)['shouldBindDescendants'];

					if (shouldBindDescendants && !bindingDoesNotRecurseIntoElementTypes[ko.utils.tagNameLower(nodeVerified)]) {
						// We're recursing automatically into (real or virtual) child nodes without changing binding contexts. So,
						//  * For children of a *real* element, the binding context is certainly the same as on their DOM .parentNode,
						//    hence bindingContextsMayDifferFromDomParentElement is false
						//  * For children of a *virtual* element, we can't be sure. Evaluating .parentNode on those children may
						//    skip over any number of intermediate virtual elements, any of which might define a custom binding context,
						//    hence bindingContextsMayDifferFromDomParentElement is true
						applyBindingsToDescendantsInternal(bindingContext, nodeVerified, /* bindingContextsMayDifferFromDomParentElement: */ !isElement);
					}
				}

				var boundElementDomDataKey = ko.utils.domData.nextKey();


				function topologicalSortBindings(bindings) {
					// Depth-first sort
					var result = [],                // The list of key/handler pairs that we will return
						bindingsConsidered = {},    // A temporary record of which bindings are already in 'result'
						cyclicDependencyStack = []; // Keeps track of a depth-search so that, if there's a cycle, we know which bindings caused it
					ko.utils.objectForEach(bindings, function pushBinding(bindingKey) {
						if (!bindingsConsidered[bindingKey]) {
							var binding = ko['getBindingHandler'](bindingKey);
							if (binding) {
								// First add dependencies (if any) of the current binding
								if (binding['after']) {
									cyclicDependencyStack.push(bindingKey);
									ko.utils.arrayForEach(binding['after'], function(bindingDependencyKey) {
										if (bindings[bindingDependencyKey]) {
											if (ko.utils.arrayIndexOf(cyclicDependencyStack, bindingDependencyKey) !== -1) {
												throw Error("Cannot combine the following bindings, because they have a cyclic dependency: " + cyclicDependencyStack.join(", "));
											} else {
												pushBinding(bindingDependencyKey);
											}
										}
									});
									cyclicDependencyStack.pop();
								}
								// Next add the current binding
								result.push({ key: bindingKey, handler: binding });
							}
							bindingsConsidered[bindingKey] = true;
						}
					});

					return result;
				}

				function applyBindingsToNodeInternal(node, sourceBindings, bindingContext, bindingContextMayDifferFromDomParentElement) {
					// Prevent multiple applyBindings calls for the same node, except when a binding value is specified
					var alreadyBound = ko.utils.domData.get(node, boundElementDomDataKey);
					if (!sourceBindings) {
						if (alreadyBound) {
							throw Error("You cannot apply bindings multiple times to the same element.");
						}
						ko.utils.domData.set(node, boundElementDomDataKey, true);
					}

					// Optimization: Don't store the binding context on this node if it's definitely the same as on node.parentNode, because
					// we can easily recover it just by scanning up the node's ancestors in the DOM
					// (note: here, parent node means "real DOM parent" not "virtual parent", as there's no O(1) way to find the virtual parent)
					if (!alreadyBound && bindingContextMayDifferFromDomParentElement)
						ko.storedBindingContextForNode(node, bindingContext);

					// Use bindings if given, otherwise fall back on asking the bindings provider to give us some bindings
					var bindings;
					if (sourceBindings && typeof sourceBindings !== 'function') {
						bindings = sourceBindings;
					} else {
						var provider = ko.bindingProvider['instance'],
							getBindings = provider['getBindingAccessors'] || getBindingsAndMakeAccessors;

						if (sourceBindings || bindingContext._subscribable) {
							// When an obsevable view model is used, the binding context will expose an observable _subscribable value.
							// Get the binding from the provider within a computed observable so that we can update the bindings whenever
							// the binding context is updated.
							var bindingsUpdater = ko.dependentObservable(
								function() {
									bindings = sourceBindings ? sourceBindings(bindingContext, node) : getBindings.call(provider, node, bindingContext);
									// Register a dependency on the binding context
									if (bindings && bindingContext._subscribable)
										bindingContext._subscribable();
									return bindings;
								},
								null, { disposeWhenNodeIsRemoved: node }
							);

							if (!bindings || !bindingsUpdater.isActive())
								bindingsUpdater = null;
						} else {
							bindings = ko.dependencyDetection.ignore(getBindings, provider, [node, bindingContext]);
						}
					}

					var bindingHandlerThatControlsDescendantBindings;
					if (bindings) {
						// Return the value accessor for a given binding. When bindings are static (won't be updated because of a binding
						// context update), just return the value accessor from the binding. Otherwise, return a function that always gets
						// the latest binding value and registers a dependency on the binding updater.
						var getValueAccessor = bindingsUpdater
							? function(bindingKey) {
							return function() {
								return evaluateValueAccessor(bindingsUpdater()[bindingKey]);
							};
						} : function(bindingKey) {
							return bindings[bindingKey];
						};

						// Use of allBindings as a function is maintained for backwards compatibility, but its use is deprecated
						function allBindings() {
							return ko.utils.objectMap(bindingsUpdater ? bindingsUpdater() : bindings, evaluateValueAccessor);
						}
						// The following is the 3.x allBindings API
						allBindings['get'] = function(key) {
							return bindings[key] && evaluateValueAccessor(getValueAccessor(key));
						};
						allBindings['has'] = function(key) {
							return key in bindings;
						};

						// First put the bindings into the right order
						var orderedBindings = topologicalSortBindings(bindings);

						// Go through the sorted bindings, calling init and update for each
						ko.utils.arrayForEach(orderedBindings, function(bindingKeyAndHandler) {
							// Note that topologicalSortBindings has already filtered out any nonexistent binding handlers,
							// so bindingKeyAndHandler.handler will always be nonnull.
							var handlerInitFn = bindingKeyAndHandler.handler["init"],
								handlerUpdateFn = bindingKeyAndHandler.handler["update"],
								bindingKey = bindingKeyAndHandler.key;

							if (node.nodeType === 8) {
								validateThatBindingIsAllowedForVirtualElements(bindingKey);
							}

							try {
								// Run init, ignoring any dependencies
								if (typeof handlerInitFn == "function") {
									ko.dependencyDetection.ignore(function() {
										var initResult = handlerInitFn(node, getValueAccessor(bindingKey), allBindings, bindingContext['$data'], bindingContext);

										// If this binding handler claims to control descendant bindings, make a note of this
										if (initResult && initResult['controlsDescendantBindings']) {
											if (bindingHandlerThatControlsDescendantBindings !== undefined)
												throw new Error("Multiple bindings (" + bindingHandlerThatControlsDescendantBindings + " and " + bindingKey + ") are trying to control descendant bindings of the same element. You cannot use these bindings together on the same element.");
											bindingHandlerThatControlsDescendantBindings = bindingKey;
										}
									});
								}

								// Run update in its own computed wrapper
								if (typeof handlerUpdateFn == "function") {
									ko.dependentObservable(
										function() {
											handlerUpdateFn(node, getValueAccessor(bindingKey), allBindings, bindingContext['$data'], bindingContext);
										},
										null,
										{ disposeWhenNodeIsRemoved: node }
									);
								}
							} catch (ex) {
								ex.message = "Unable to process binding \"" + bindingKey + ": " + bindings[bindingKey] + "\"\nMessage: " + ex.message;
								throw ex;
							}
						});
					}

					return {
						'shouldBindDescendants': bindingHandlerThatControlsDescendantBindings === undefined
					};
				};

				var storedBindingContextDomDataKey = ko.utils.domData.nextKey();
				ko.storedBindingContextForNode = function (node, bindingContext) {
					if (arguments.length == 2) {
						ko.utils.domData.set(node, storedBindingContextDomDataKey, bindingContext);
						if (bindingContext._subscribable)
							bindingContext._subscribable._addNode(node);
					} else {
						return ko.utils.domData.get(node, storedBindingContextDomDataKey);
					}
				}

				function getBindingContext(viewModelOrBindingContext) {
					return viewModelOrBindingContext && (viewModelOrBindingContext instanceof ko.bindingContext)
						? viewModelOrBindingContext
						: new ko.bindingContext(viewModelOrBindingContext);
				}

				ko.applyBindingAccessorsToNode = function (node, bindings, viewModelOrBindingContext) {
					if (node.nodeType === 1) // If it's an element, workaround IE <= 8 HTML parsing weirdness
						ko.virtualElements.normaliseVirtualElementDomStructure(node);
					return applyBindingsToNodeInternal(node, bindings, getBindingContext(viewModelOrBindingContext), true);
				};

				ko.applyBindingsToNode = function (node, bindings, viewModelOrBindingContext) {
					var context = getBindingContext(viewModelOrBindingContext);
					return ko.applyBindingAccessorsToNode(node, makeBindingAccessors(bindings, context, node), context);
				};

				ko.applyBindingsToDescendants = function(viewModelOrBindingContext, rootNode) {
					if (rootNode.nodeType === 1 || rootNode.nodeType === 8)
						applyBindingsToDescendantsInternal(getBindingContext(viewModelOrBindingContext), rootNode, true);
				};

				ko.applyBindings = function (viewModelOrBindingContext, rootNode) {
					if (rootNode && (rootNode.nodeType !== 1) && (rootNode.nodeType !== 8))
						throw new Error("ko.applyBindings: first parameter should be your view model; second parameter should be a DOM node");
					rootNode = rootNode || window.document.body; // Make "rootNode" parameter optional

					applyBindingsToNodeAndDescendantsInternal(getBindingContext(viewModelOrBindingContext), rootNode, true);
				};

				// Retrieving binding context from arbitrary nodes
				ko.contextFor = function(node) {
					// We can only do something meaningful for elements and comment nodes (in particular, not text nodes, as IE can't store domdata for them)
					switch (node.nodeType) {
						case 1:
						case 8:
							var context = ko.storedBindingContextForNode(node);
							if (context) return context;
							if (node.parentNode) return ko.contextFor(node.parentNode);
							break;
					}
					return undefined;
				};
				ko.dataFor = function(node) {
					var context = ko.contextFor(node);
					return context ? context['$data'] : undefined;
				};

				ko.exportSymbol('bindingHandlers', ko.bindingHandlers);
				ko.exportSymbol('applyBindings', ko.applyBindings);
				ko.exportSymbol('applyBindingsToDescendants', ko.applyBindingsToDescendants);
				ko.exportSymbol('applyBindingAccessorsToNode', ko.applyBindingAccessorsToNode);
				ko.exportSymbol('applyBindingsToNode', ko.applyBindingsToNode);
				ko.exportSymbol('contextFor', ko.contextFor);
				ko.exportSymbol('dataFor', ko.dataFor);
			})();
			var attrHtmlToJavascriptMap = { 'class': 'className', 'for': 'htmlFor' };
			ko.bindingHandlers['attr'] = {
				'update': function(element, valueAccessor, allBindings) {
					var value = ko.utils.unwrapObservable(valueAccessor()) || {};
					ko.utils.objectForEach(value, function(attrName, attrValue) {
						attrValue = ko.utils.unwrapObservable(attrValue);

						// To cover cases like "attr: { checked:someProp }", we want to remove the attribute entirely
						// when someProp is a "no value"-like value (strictly null, false, or undefined)
						// (because the absence of the "checked" attr is how to mark an element as not checked, etc.)
						var toRemove = (attrValue === false) || (attrValue === null) || (attrValue === undefined);
						if (toRemove)
							element.removeAttribute(attrName);

						// In IE <= 7 and IE8 Quirks Mode, you have to use the Javascript property name instead of the
						// HTML attribute name for certain attributes. IE8 Standards Mode supports the correct behavior,
						// but instead of figuring out the mode, we'll just set the attribute through the Javascript
						// property for IE <= 8.
						if (ko.utils.ieVersion <= 8 && attrName in attrHtmlToJavascriptMap) {
							attrName = attrHtmlToJavascriptMap[attrName];
							if (toRemove)
								element.removeAttribute(attrName);
							else
								element[attrName] = attrValue;
						} else if (!toRemove) {
							element.setAttribute(attrName, attrValue.toString());
						}

						// Treat "name" specially - although you can think of it as an attribute, it also needs
						// special handling on older versions of IE (https://github.com/SteveSanderson/knockout/pull/333)
						// Deliberately being case-sensitive here because XHTML would regard "Name" as a different thing
						// entirely, and there's no strong reason to allow for such casing in HTML.
						if (attrName === "name") {
							ko.utils.setElementName(element, toRemove ? "" : attrValue.toString());
						}
					});
				}
			};
			(function() {

				ko.bindingHandlers['checked'] = {
					'after': ['value', 'attr'],
					'init': function (element, valueAccessor, allBindings) {
						function checkedValue() {
							return allBindings['has']('checkedValue')
								? ko.utils.unwrapObservable(allBindings.get('checkedValue'))
								: element.value;
						}

						function updateModel() {
							// This updates the model value from the view value.
							// It runs in response to DOM events (click) and changes in checkedValue.
							var isChecked = element.checked,
								elemValue = useCheckedValue ? checkedValue() : isChecked;

							// When we're first setting up this computed, don't change any model state.
							if (!shouldSet) {
								return;
							}

							// We can ignore unchecked radio buttons, because some other radio
							// button will be getting checked, and that one can take care of updating state.
							if (isRadio && !isChecked) {
								return;
							}

							var modelValue = ko.dependencyDetection.ignore(valueAccessor);
							if (isValueArray) {
								if (oldElemValue !== elemValue) {
									// When we're responding to the checkedValue changing, and the element is
									// currently checked, replace the old elem value with the new elem value
									// in the model array.
									if (isChecked) {
										ko.utils.addOrRemoveItem(modelValue, elemValue, true);
										ko.utils.addOrRemoveItem(modelValue, oldElemValue, false);
									}

									oldElemValue = elemValue;
								} else {
									// When we're responding to the user having checked/unchecked a checkbox,
									// add/remove the element value to the model array.
									ko.utils.addOrRemoveItem(modelValue, elemValue, isChecked);
								}
							} else {
								ko.expressionRewriting.writeValueToProperty(modelValue, allBindings, 'checked', elemValue, true);
							}
						};

						function updateView() {
							// This updates the view value from the model value.
							// It runs in response to changes in the bound (checked) value.
							var modelValue = ko.utils.unwrapObservable(valueAccessor());

							if (isValueArray) {
								// When a checkbox is bound to an array, being checked represents its value being present in that array
								element.checked = ko.utils.arrayIndexOf(modelValue, checkedValue()) >= 0;
							} else if (isCheckbox) {
								// When a checkbox is bound to any other value (not an array), being checked represents the value being trueish
								element.checked = modelValue;
							} else {
								// For radio buttons, being checked means that the radio button's value corresponds to the model value
								element.checked = (checkedValue() === modelValue);
							}
						};

						var isCheckbox = element.type == "checkbox",
							isRadio = element.type == "radio";

						// Only bind to check boxes and radio buttons
						if (!isCheckbox && !isRadio) {
							return;
						}

						var isValueArray = isCheckbox && (ko.utils.unwrapObservable(valueAccessor()) instanceof Array),
							oldElemValue = isValueArray ? checkedValue() : undefined,
							useCheckedValue = isRadio || isValueArray,
							shouldSet = false;

						// IE 6 won't allow radio buttons to be selected unless they have a name
						if (isRadio && !element.name)
							ko.bindingHandlers['uniqueName']['init'](element, function() { return true });

						// Set up two computeds to update the binding:

						// The first responds to changes in the checkedValue value and to element clicks
						ko.dependentObservable(updateModel, null, { disposeWhenNodeIsRemoved: element });
						ko.utils.registerEventHandler(element, "click", updateModel);

						// The second responds to changes in the model value (the one associated with the checked binding)
						ko.dependentObservable(updateView, null, { disposeWhenNodeIsRemoved: element });

						shouldSet = true;
					}
				};
				ko.expressionRewriting.twoWayBindings['checked'] = true;

				ko.bindingHandlers['checkedValue'] = {
					'update': function (element, valueAccessor) {
						element.value = ko.utils.unwrapObservable(valueAccessor());
					}
				};

			})();var classesWrittenByBindingKey = '__ko__cssValue';
			ko.bindingHandlers['css'] = {
				'update': function (element, valueAccessor) {
					var value = ko.utils.unwrapObservable(valueAccessor());
					if (typeof value == "object") {
						ko.utils.objectForEach(value, function(className, shouldHaveClass) {
							shouldHaveClass = ko.utils.unwrapObservable(shouldHaveClass);
							ko.utils.toggleDomNodeCssClass(element, className, shouldHaveClass);
						});
					} else {
						value = String(value || ''); // Make sure we don't try to store or set a non-string value
						ko.utils.toggleDomNodeCssClass(element, element[classesWrittenByBindingKey], false);
						element[classesWrittenByBindingKey] = value;
						ko.utils.toggleDomNodeCssClass(element, value, true);
					}
				}
			};
			ko.bindingHandlers['enable'] = {
				'update': function (element, valueAccessor) {
					var value = ko.utils.unwrapObservable(valueAccessor());
					if (value && element.disabled)
						element.removeAttribute("disabled");
					else if ((!value) && (!element.disabled))
						element.disabled = true;
				}
			};

			ko.bindingHandlers['disable'] = {
				'update': function (element, valueAccessor) {
					ko.bindingHandlers['enable']['update'](element, function() { return !ko.utils.unwrapObservable(valueAccessor()) });
				}
			};
// For certain common events (currently just 'click'), allow a simplified data-binding syntax
// e.g. click:handler instead of the usual full-length event:{click:handler}
			function makeEventHandlerShortcut(eventName) {
				ko.bindingHandlers[eventName] = {
					'init': function(element, valueAccessor, allBindings, viewModel, bindingContext) {
						var newValueAccessor = function () {
							var result = {};
							result[eventName] = valueAccessor();
							return result;
						};
						return ko.bindingHandlers['event']['init'].call(this, element, newValueAccessor, allBindings, viewModel, bindingContext);
					}
				}
			}

			ko.bindingHandlers['event'] = {
				'init' : function (element, valueAccessor, allBindings, viewModel, bindingContext) {
					var eventsToHandle = valueAccessor() || {};
					ko.utils.objectForEach(eventsToHandle, function(eventName) {
						if (typeof eventName == "string") {
							ko.utils.registerEventHandler(element, eventName, function (event) {
								var handlerReturnValue;
								var handlerFunction = valueAccessor()[eventName];
								if (!handlerFunction)
									return;

								try {
									// Take all the event args, and prefix with the viewmodel
									var argsForHandler = ko.utils.makeArray(arguments);
									viewModel = bindingContext['$data'];
									argsForHandler.unshift(viewModel);
									handlerReturnValue = handlerFunction.apply(viewModel, argsForHandler);
								} finally {
									if (handlerReturnValue !== true) { // Normally we want to prevent default action. Developer can override this be explicitly returning true.
										if (event.preventDefault)
											event.preventDefault();
										else
											event.returnValue = false;
									}
								}

								var bubble = allBindings.get(eventName + 'Bubble') !== false;
								if (!bubble) {
									event.cancelBubble = true;
									if (event.stopPropagation)
										event.stopPropagation();
								}
							});
						}
					});
				}
			};
// "foreach: someExpression" is equivalent to "template: { foreach: someExpression }"
// "foreach: { data: someExpression, afterAdd: myfn }" is equivalent to "template: { foreach: someExpression, afterAdd: myfn }"
			ko.bindingHandlers['foreach'] = {
				makeTemplateValueAccessor: function(valueAccessor) {
					return function() {
						var modelValue = valueAccessor(),
							unwrappedValue = ko.utils.peekObservable(modelValue);    // Unwrap without setting a dependency here

						// If unwrappedValue is the array, pass in the wrapped value on its own
						// The value will be unwrapped and tracked within the template binding
						// (See https://github.com/SteveSanderson/knockout/issues/523)
						if ((!unwrappedValue) || typeof unwrappedValue.length == "number")
							return { 'foreach': modelValue, 'templateEngine': ko.nativeTemplateEngine.instance };

						// If unwrappedValue.data is the array, preserve all relevant options and unwrap again value so we get updates
						ko.utils.unwrapObservable(modelValue);
						return {
							'foreach': unwrappedValue['data'],
							'as': unwrappedValue['as'],
							'includeDestroyed': unwrappedValue['includeDestroyed'],
							'afterAdd': unwrappedValue['afterAdd'],
							'beforeRemove': unwrappedValue['beforeRemove'],
							'afterRender': unwrappedValue['afterRender'],
							'beforeMove': unwrappedValue['beforeMove'],
							'afterMove': unwrappedValue['afterMove'],
							'templateEngine': ko.nativeTemplateEngine.instance
						};
					};
				},
				'init': function(element, valueAccessor, allBindings, viewModel, bindingContext) {
					return ko.bindingHandlers['template']['init'](element, ko.bindingHandlers['foreach'].makeTemplateValueAccessor(valueAccessor));
				},
				'update': function(element, valueAccessor, allBindings, viewModel, bindingContext) {
					return ko.bindingHandlers['template']['update'](element, ko.bindingHandlers['foreach'].makeTemplateValueAccessor(valueAccessor), allBindings, viewModel, bindingContext);
				}
			};
			ko.expressionRewriting.bindingRewriteValidators['foreach'] = false; // Can't rewrite control flow bindings
			ko.virtualElements.allowedBindings['foreach'] = true;
			var hasfocusUpdatingProperty = '__ko_hasfocusUpdating';
			var hasfocusLastValue = '__ko_hasfocusLastValue';
			ko.bindingHandlers['hasfocus'] = {
				'init': function(element, valueAccessor, allBindings) {
					var handleElementFocusChange = function(isFocused) {
						// Where possible, ignore which event was raised and determine focus state using activeElement,
						// as this avoids phantom focus/blur events raised when changing tabs in modern browsers.
						// However, not all KO-targeted browsers (Firefox 2) support activeElement. For those browsers,
						// prevent a loss of focus when changing tabs/windows by setting a flag that prevents hasfocus
						// from calling 'blur()' on the element when it loses focus.
						// Discussion at https://github.com/SteveSanderson/knockout/pull/352
						element[hasfocusUpdatingProperty] = true;
						var ownerDoc = element.ownerDocument;
						if ("activeElement" in ownerDoc) {
							var active;
							try {
								active = ownerDoc.activeElement;
							} catch(e) {
								// IE9 throws if you access activeElement during page load (see issue #703)
								active = ownerDoc.body;
							}
							isFocused = (active === element);
						}
						var modelValue = valueAccessor();
						ko.expressionRewriting.writeValueToProperty(modelValue, allBindings, 'hasfocus', isFocused, true);

						//cache the latest value, so we can avoid unnecessarily calling focus/blur in the update function
						element[hasfocusLastValue] = isFocused;
						element[hasfocusUpdatingProperty] = false;
					};
					var handleElementFocusIn = handleElementFocusChange.bind(null, true);
					var handleElementFocusOut = handleElementFocusChange.bind(null, false);

					ko.utils.registerEventHandler(element, "focus", handleElementFocusIn);
					ko.utils.registerEventHandler(element, "focusin", handleElementFocusIn); // For IE
					ko.utils.registerEventHandler(element, "blur",  handleElementFocusOut);
					ko.utils.registerEventHandler(element, "focusout",  handleElementFocusOut); // For IE
				},
				'update': function(element, valueAccessor) {
					var value = !!ko.utils.unwrapObservable(valueAccessor()); //force boolean to compare with last value
					if (!element[hasfocusUpdatingProperty] && element[hasfocusLastValue] !== value) {
						value ? element.focus() : element.blur();
						ko.dependencyDetection.ignore(ko.utils.triggerEvent, null, [element, value ? "focusin" : "focusout"]); // For IE, which doesn't reliably fire "focus" or "blur" events synchronously
					}
				}
			};
			ko.expressionRewriting.twoWayBindings['hasfocus'] = true;

			ko.bindingHandlers['hasFocus'] = ko.bindingHandlers['hasfocus']; // Make "hasFocus" an alias
			ko.expressionRewriting.twoWayBindings['hasFocus'] = true;
			ko.bindingHandlers['html'] = {
				'init': function() {
					// Prevent binding on the dynamically-injected HTML (as developers are unlikely to expect that, and it has security implications)
					return { 'controlsDescendantBindings': true };
				},
				'update': function (element, valueAccessor) {
					// setHtml will unwrap the value if needed
					ko.utils.setHtml(element, valueAccessor());
				}
			};
			var withIfDomDataKey = ko.utils.domData.nextKey();
// Makes a binding like with or if
			function makeWithIfBinding(bindingKey, isWith, isNot, makeContextCallback) {
				ko.bindingHandlers[bindingKey] = {
					'init': function(element) {
						ko.utils.domData.set(element, withIfDomDataKey, {});
						return { 'controlsDescendantBindings': true };
					},
					'update': function(element, valueAccessor, allBindings, viewModel, bindingContext) {
						var withIfData = ko.utils.domData.get(element, withIfDomDataKey),
							dataValue = ko.utils.unwrapObservable(valueAccessor()),
							shouldDisplay = !isNot !== !dataValue, // equivalent to isNot ? !dataValue : !!dataValue
							isFirstRender = !withIfData.savedNodes,
							needsRefresh = isFirstRender || isWith || (shouldDisplay !== withIfData.didDisplayOnLastUpdate);

						if (needsRefresh) {
							if (isFirstRender) {
								withIfData.savedNodes = ko.utils.cloneNodes(ko.virtualElements.childNodes(element), true /* shouldCleanNodes */);
							}

							if (shouldDisplay) {
								if (!isFirstRender) {
									ko.virtualElements.setDomNodeChildren(element, ko.utils.cloneNodes(withIfData.savedNodes));
								}
								ko.applyBindingsToDescendants(makeContextCallback ? makeContextCallback(bindingContext, dataValue) : bindingContext, element);
							} else {
								ko.virtualElements.emptyNode(element);
							}

							withIfData.didDisplayOnLastUpdate = shouldDisplay;
						}
					}
				};
				ko.expressionRewriting.bindingRewriteValidators[bindingKey] = false; // Can't rewrite control flow bindings
				ko.virtualElements.allowedBindings[bindingKey] = true;
			}

// Construct the actual binding handlers
			makeWithIfBinding('if');
			makeWithIfBinding('ifnot', false /* isWith */, true /* isNot */);
			makeWithIfBinding('with', true /* isWith */, false /* isNot */,
				function(bindingContext, dataValue) {
					return bindingContext['createChildContext'](dataValue);
				}
			);
			ko.bindingHandlers['options'] = {
				'init': function(element) {
					if (ko.utils.tagNameLower(element) !== "select")
						throw new Error("options binding applies only to SELECT elements");

					// Remove all existing <option>s.
					while (element.length > 0) {
						element.remove(0);
					}

					// Ensures that the binding processor doesn't try to bind the options
					return { 'controlsDescendantBindings': true };
				},
				'update': function (element, valueAccessor, allBindings) {
					function selectedOptions() {
						return ko.utils.arrayFilter(element.options, function (node) { return node.selected; });
					}

					var selectWasPreviouslyEmpty = element.length == 0;
					var previousScrollTop = (!selectWasPreviouslyEmpty && element.multiple) ? element.scrollTop : null;

					var unwrappedArray = ko.utils.unwrapObservable(valueAccessor());
					var includeDestroyed = allBindings.get('optionsIncludeDestroyed');
					var captionPlaceholder = {};
					var captionValue;
					var previousSelectedValues;
					if (element.multiple) {
						previousSelectedValues = ko.utils.arrayMap(selectedOptions(), ko.selectExtensions.readValue);
					} else {
						previousSelectedValues = element.selectedIndex >= 0 ? [ ko.selectExtensions.readValue(element.options[element.selectedIndex]) ] : [];
					}

					if (unwrappedArray) {
						if (typeof unwrappedArray.length == "undefined") // Coerce single value into array
							unwrappedArray = [unwrappedArray];

						// Filter out any entries marked as destroyed
						var filteredArray = ko.utils.arrayFilter(unwrappedArray, function(item) {
							return includeDestroyed || item === undefined || item === null || !ko.utils.unwrapObservable(item['_destroy']);
						});

						// If caption is included, add it to the array
						if (allBindings['has']('optionsCaption')) {
							captionValue = ko.utils.unwrapObservable(allBindings.get('optionsCaption'));
							// If caption value is null or undefined, don't show a caption
							if (captionValue !== null && captionValue !== undefined) {
								filteredArray.unshift(captionPlaceholder);
							}
						}
					} else {
						// If a falsy value is provided (e.g. null), we'll simply empty the select element
						unwrappedArray = [];
					}

					function applyToObject(object, predicate, defaultValue) {
						var predicateType = typeof predicate;
						if (predicateType == "function")    // Given a function; run it against the data value
							return predicate(object);
						else if (predicateType == "string") // Given a string; treat it as a property name on the data value
							return object[predicate];
						else                                // Given no optionsText arg; use the data value itself
							return defaultValue;
					}

					// The following functions can run at two different times:
					// The first is when the whole array is being updated directly from this binding handler.
					// The second is when an observable value for a specific array entry is updated.
					// oldOptions will be empty in the first case, but will be filled with the previously generated option in the second.
					var itemUpdate = false;
					function optionForArrayItem(arrayEntry, index, oldOptions) {
						if (oldOptions.length) {
							previousSelectedValues = oldOptions[0].selected ? [ ko.selectExtensions.readValue(oldOptions[0]) ] : [];
							itemUpdate = true;
						}
						var option = document.createElement("option");
						if (arrayEntry === captionPlaceholder) {
							ko.utils.setTextContent(option, allBindings.get('optionsCaption'));
							ko.selectExtensions.writeValue(option, undefined);
						} else {
							// Apply a value to the option element
							var optionValue = applyToObject(arrayEntry, allBindings.get('optionsValue'), arrayEntry);
							ko.selectExtensions.writeValue(option, ko.utils.unwrapObservable(optionValue));

							// Apply some text to the option element
							var optionText = applyToObject(arrayEntry, allBindings.get('optionsText'), optionValue);
							ko.utils.setTextContent(option, optionText);
						}
						return [option];
					}

					function setSelectionCallback(arrayEntry, newOptions) {
						// IE6 doesn't like us to assign selection to OPTION nodes before they're added to the document.
						// That's why we first added them without selection. Now it's time to set the selection.
						if (previousSelectedValues.length) {
							var isSelected = ko.utils.arrayIndexOf(previousSelectedValues, ko.selectExtensions.readValue(newOptions[0])) >= 0;
							ko.utils.setOptionNodeSelectionState(newOptions[0], isSelected);

							// If this option was changed from being selected during a single-item update, notify the change
							if (itemUpdate && !isSelected)
								ko.dependencyDetection.ignore(ko.utils.triggerEvent, null, [element, "change"]);
						}
					}

					var callback = setSelectionCallback;
					if (allBindings['has']('optionsAfterRender')) {
						callback = function(arrayEntry, newOptions) {
							setSelectionCallback(arrayEntry, newOptions);
							ko.dependencyDetection.ignore(allBindings.get('optionsAfterRender'), null, [newOptions[0], arrayEntry !== captionPlaceholder ? arrayEntry : undefined]);
						}
					}

					ko.utils.setDomNodeChildrenFromArrayMapping(element, filteredArray, optionForArrayItem, null, callback);

					// Determine if the selection has changed as a result of updating the options list
					var selectionChanged;
					if (element.multiple) {
						// For a multiple-select box, compare the new selection count to the previous one
						// But if nothing was selected before, the selection can't have changed
						selectionChanged = previousSelectedValues.length && selectedOptions().length < previousSelectedValues.length;
					} else {
						// For a single-select box, compare the current value to the previous value
						// But if nothing was selected before or nothing is selected now, just look for a change in selection
						selectionChanged = (previousSelectedValues.length && element.selectedIndex >= 0)
							? (ko.selectExtensions.readValue(element.options[element.selectedIndex]) !== previousSelectedValues[0])
							: (previousSelectedValues.length || element.selectedIndex >= 0);
					}

					// Ensure consistency between model value and selected option.
					// If the dropdown was changed so that selection is no longer the same,
					// notify the value or selectedOptions binding.
					if (selectionChanged)
						ko.dependencyDetection.ignore(ko.utils.triggerEvent, null, [element, "change"]);

					// Workaround for IE bug
					ko.utils.ensureSelectElementIsRenderedCorrectly(element);

					if (previousScrollTop && Math.abs(previousScrollTop - element.scrollTop) > 20)
						element.scrollTop = previousScrollTop;
				}
			};
			ko.bindingHandlers['options'].optionValueDomDataKey = ko.utils.domData.nextKey();
			ko.bindingHandlers['selectedOptions'] = {
				'after': ['options', 'foreach'],
				'init': function (element, valueAccessor, allBindings) {
					ko.utils.registerEventHandler(element, "change", function () {
						var value = valueAccessor(), valueToWrite = [];
						ko.utils.arrayForEach(element.getElementsByTagName("option"), function(node) {
							if (node.selected)
								valueToWrite.push(ko.selectExtensions.readValue(node));
						});
						ko.expressionRewriting.writeValueToProperty(value, allBindings, 'selectedOptions', valueToWrite);
					});
				},
				'update': function (element, valueAccessor) {
					if (ko.utils.tagNameLower(element) != "select")
						throw new Error("values binding applies only to SELECT elements");

					var newValue = ko.utils.unwrapObservable(valueAccessor());
					if (newValue && typeof newValue.length == "number") {
						ko.utils.arrayForEach(element.getElementsByTagName("option"), function(node) {
							var isSelected = ko.utils.arrayIndexOf(newValue, ko.selectExtensions.readValue(node)) >= 0;
							ko.utils.setOptionNodeSelectionState(node, isSelected);
						});
					}
				}
			};
			ko.expressionRewriting.twoWayBindings['selectedOptions'] = true;
			ko.bindingHandlers['style'] = {
				'update': function (element, valueAccessor) {
					var value = ko.utils.unwrapObservable(valueAccessor() || {});
					ko.utils.objectForEach(value, function(styleName, styleValue) {
						styleValue = ko.utils.unwrapObservable(styleValue);
						element.style[styleName] = styleValue || ""; // Empty string removes the value, whereas null/undefined have no effect
					});
				}
			};
			ko.bindingHandlers['submit'] = {
				'init': function (element, valueAccessor, allBindings, viewModel, bindingContext) {
					if (typeof valueAccessor() != "function")
						throw new Error("The value for a submit binding must be a function");
					ko.utils.registerEventHandler(element, "submit", function (event) {
						var handlerReturnValue;
						var value = valueAccessor();
						try { handlerReturnValue = value.call(bindingContext['$data'], element); }
						finally {
							if (handlerReturnValue !== true) { // Normally we want to prevent default action. Developer can override this be explicitly returning true.
								if (event.preventDefault)
									event.preventDefault();
								else
									event.returnValue = false;
							}
						}
					});
				}
			};
			ko.bindingHandlers['text'] = {
				'init': function() {
					// Prevent binding on the dynamically-injected text node (as developers are unlikely to expect that, and it has security implications).
					// It should also make things faster, as we no longer have to consider whether the text node might be bindable.
					return { 'controlsDescendantBindings': true };
				},
				'update': function (element, valueAccessor) {
					ko.utils.setTextContent(element, valueAccessor());
				}
			};
			ko.virtualElements.allowedBindings['text'] = true;
			ko.bindingHandlers['uniqueName'] = {
				'init': function (element, valueAccessor) {
					if (valueAccessor()) {
						var name = "ko_unique_" + (++ko.bindingHandlers['uniqueName'].currentIndex);
						ko.utils.setElementName(element, name);
					}
				}
			};
			ko.bindingHandlers['uniqueName'].currentIndex = 0;
			ko.bindingHandlers['value'] = {
				'after': ['options', 'foreach'],
				'init': function (element, valueAccessor, allBindings) {
					// Always catch "change" event; possibly other events too if asked
					var eventsToCatch = ["change"];
					var requestedEventsToCatch = allBindings.get("valueUpdate");
					var propertyChangedFired = false;
					if (requestedEventsToCatch) {
						if (typeof requestedEventsToCatch == "string") // Allow both individual event names, and arrays of event names
							requestedEventsToCatch = [requestedEventsToCatch];
						ko.utils.arrayPushAll(eventsToCatch, requestedEventsToCatch);
						eventsToCatch = ko.utils.arrayGetDistinctValues(eventsToCatch);
					}

					var valueUpdateHandler = function() {
						propertyChangedFired = false;
						var modelValue = valueAccessor();
						var elementValue = ko.selectExtensions.readValue(element);
						ko.expressionRewriting.writeValueToProperty(modelValue, allBindings, 'value', elementValue);
					}

					// Workaround for https://github.com/SteveSanderson/knockout/issues/122
					// IE doesn't fire "change" events on textboxes if the user selects a value from its autocomplete list
					var ieAutoCompleteHackNeeded = ko.utils.ieVersion && element.tagName.toLowerCase() == "input" && element.type == "text"
						&& element.autocomplete != "off" && (!element.form || element.form.autocomplete != "off");
					if (ieAutoCompleteHackNeeded && ko.utils.arrayIndexOf(eventsToCatch, "propertychange") == -1) {
						ko.utils.registerEventHandler(element, "propertychange", function () { propertyChangedFired = true });
						ko.utils.registerEventHandler(element, "blur", function() {
							if (propertyChangedFired) {
								valueUpdateHandler();
							}
						});
					}

					ko.utils.arrayForEach(eventsToCatch, function(eventName) {
						// The syntax "after<eventname>" means "run the handler asynchronously after the event"
						// This is useful, for example, to catch "keydown" events after the browser has updated the control
						// (otherwise, ko.selectExtensions.readValue(this) will receive the control's value *before* the key event)
						var handler = valueUpdateHandler;
						if (ko.utils.stringStartsWith(eventName, "after")) {
							handler = function() { setTimeout(valueUpdateHandler, 0) };
							eventName = eventName.substring("after".length);
						}
						ko.utils.registerEventHandler(element, eventName, handler);
					});
				},
				'update': function (element, valueAccessor) {
					var valueIsSelectOption = ko.utils.tagNameLower(element) === "select";
					var newValue = ko.utils.unwrapObservable(valueAccessor());
					var elementValue = ko.selectExtensions.readValue(element);
					var valueHasChanged = (newValue !== elementValue);

					if (valueHasChanged) {
						var applyValueAction = function () { ko.selectExtensions.writeValue(element, newValue); };
						applyValueAction();

						if (valueIsSelectOption) {
							if (newValue !== ko.selectExtensions.readValue(element)) {
								// If you try to set a model value that can't be represented in an already-populated dropdown, reject that change,
								// because you're not allowed to have a model value that disagrees with a visible UI selection.
								ko.dependencyDetection.ignore(ko.utils.triggerEvent, null, [element, "change"]);
							} else {
								// Workaround for IE6 bug: It won't reliably apply values to SELECT nodes during the same execution thread
								// right after you've changed the set of OPTION nodes on it. So for that node type, we'll schedule a second thread
								// to apply the value as well.
								setTimeout(applyValueAction, 0);
							}
						}
					}
				}
			};
			ko.expressionRewriting.twoWayBindings['value'] = true;
			ko.bindingHandlers['visible'] = {
				'update': function (element, valueAccessor) {
					var value = ko.utils.unwrapObservable(valueAccessor());
					var isCurrentlyVisible = !(element.style.display == "none");
					if (value && !isCurrentlyVisible)
						element.style.display = "";
					else if ((!value) && isCurrentlyVisible)
						element.style.display = "none";
				}
			};
// 'click' is just a shorthand for the usual full-length event:{click:handler}
			makeEventHandlerShortcut('click');
// If you want to make a custom template engine,
//
// [1] Inherit from this class (like ko.nativeTemplateEngine does)
// [2] Override 'renderTemplateSource', supplying a function with this signature:
//
//        function (templateSource, bindingContext, options) {
//            // - templateSource.text() is the text of the template you should render
//            // - bindingContext.$data is the data you should pass into the template
//            //   - you might also want to make bindingContext.$parent, bindingContext.$parents,
//            //     and bindingContext.$root available in the template too
//            // - options gives you access to any other properties set on "data-bind: { template: options }"
//            //
//            // Return value: an array of DOM nodes
//        }
//
// [3] Override 'createJavaScriptEvaluatorBlock', supplying a function with this signature:
//
//        function (script) {
//            // Return value: Whatever syntax means "Evaluate the JavaScript statement 'script' and output the result"
//            //               For example, the jquery.tmpl template engine converts 'someScript' to '${ someScript }'
//        }
//
//     This is only necessary if you want to allow data-bind attributes to reference arbitrary template variables.
//     If you don't want to allow that, you can set the property 'allowTemplateRewriting' to false (like ko.nativeTemplateEngine does)
//     and then you don't need to override 'createJavaScriptEvaluatorBlock'.

			ko.templateEngine = function () { };

			ko.templateEngine.prototype['renderTemplateSource'] = function (templateSource, bindingContext, options) {
				throw new Error("Override renderTemplateSource");
			};

			ko.templateEngine.prototype['createJavaScriptEvaluatorBlock'] = function (script) {
				throw new Error("Override createJavaScriptEvaluatorBlock");
			};

			ko.templateEngine.prototype['makeTemplateSource'] = function(template, templateDocument) {
				// Named template
				if (typeof template == "string") {
					templateDocument = templateDocument || document;
					var elem = templateDocument.getElementById(template);
					if (!elem)
						throw new Error("Cannot find template with ID " + template);
					return new ko.templateSources.domElement(elem);
				} else if ((template.nodeType == 1) || (template.nodeType == 8)) {
					// Anonymous template
					return new ko.templateSources.anonymousTemplate(template);
				} else
					throw new Error("Unknown template type: " + template);
			};

			ko.templateEngine.prototype['renderTemplate'] = function (template, bindingContext, options, templateDocument) {
				var templateSource = this['makeTemplateSource'](template, templateDocument);
				return this['renderTemplateSource'](templateSource, bindingContext, options);
			};

			ko.templateEngine.prototype['isTemplateRewritten'] = function (template, templateDocument) {
				// Skip rewriting if requested
				if (this['allowTemplateRewriting'] === false)
					return true;
				return this['makeTemplateSource'](template, templateDocument)['data']("isRewritten");
			};

			ko.templateEngine.prototype['rewriteTemplate'] = function (template, rewriterCallback, templateDocument) {
				var templateSource = this['makeTemplateSource'](template, templateDocument);
				var rewritten = rewriterCallback(templateSource['text']());
				templateSource['text'](rewritten);
				templateSource['data']("isRewritten", true);
			};

			ko.exportSymbol('templateEngine', ko.templateEngine);

			ko.templateRewriting = (function () {
				var memoizeDataBindingAttributeSyntaxRegex = /(<([a-z]+\d*)(?:\s+(?!data-bind\s*=\s*)[a-z0-9\-]+(?:=(?:\"[^\"]*\"|\'[^\']*\'))?)*\s+)data-bind\s*=\s*(["'])([\s\S]*?)\3/gi;
				var memoizeVirtualContainerBindingSyntaxRegex = /<!--\s*ko\b\s*([\s\S]*?)\s*-->/g;

				function validateDataBindValuesForRewriting(keyValueArray) {
					var allValidators = ko.expressionRewriting.bindingRewriteValidators;
					for (var i = 0; i < keyValueArray.length; i++) {
						var key = keyValueArray[i]['key'];
						if (allValidators.hasOwnProperty(key)) {
							var validator = allValidators[key];

							if (typeof validator === "function") {
								var possibleErrorMessage = validator(keyValueArray[i]['value']);
								if (possibleErrorMessage)
									throw new Error(possibleErrorMessage);
							} else if (!validator) {
								throw new Error("This template engine does not support the '" + key + "' binding within its templates");
							}
						}
					}
				}

				function constructMemoizedTagReplacement(dataBindAttributeValue, tagToRetain, nodeName, templateEngine) {
					var dataBindKeyValueArray = ko.expressionRewriting.parseObjectLiteral(dataBindAttributeValue);
					validateDataBindValuesForRewriting(dataBindKeyValueArray);
					var rewrittenDataBindAttributeValue = ko.expressionRewriting.preProcessBindings(dataBindKeyValueArray, {'valueAccessors':true});

					// For no obvious reason, Opera fails to evaluate rewrittenDataBindAttributeValue unless it's wrapped in an additional
					// anonymous function, even though Opera's built-in debugger can evaluate it anyway. No other browser requires this
					// extra indirection.
					var applyBindingsToNextSiblingScript =
						"ko.__tr_ambtns(function($context,$element){return(function(){return{ " + rewrittenDataBindAttributeValue + " } })()},'" + nodeName.toLowerCase() + "')";
					return templateEngine['createJavaScriptEvaluatorBlock'](applyBindingsToNextSiblingScript) + tagToRetain;
				}

				return {
					ensureTemplateIsRewritten: function (template, templateEngine, templateDocument) {
						if (!templateEngine['isTemplateRewritten'](template, templateDocument))
							templateEngine['rewriteTemplate'](template, function (htmlString) {
								return ko.templateRewriting.memoizeBindingAttributeSyntax(htmlString, templateEngine);
							}, templateDocument);
					},

					memoizeBindingAttributeSyntax: function (htmlString, templateEngine) {
						return htmlString.replace(memoizeDataBindingAttributeSyntaxRegex, function () {
							return constructMemoizedTagReplacement(/* dataBindAttributeValue: */ arguments[4], /* tagToRetain: */ arguments[1], /* nodeName: */ arguments[2], templateEngine);
						}).replace(memoizeVirtualContainerBindingSyntaxRegex, function() {
							return constructMemoizedTagReplacement(/* dataBindAttributeValue: */ arguments[1], /* tagToRetain: */ "<!-- ko -->", /* nodeName: */ "#comment", templateEngine);
						});
					},

					applyMemoizedBindingsToNextSibling: function (bindings, nodeName) {
						return ko.memoization.memoize(function (domNode, bindingContext) {
							var nodeToBind = domNode.nextSibling;
							if (nodeToBind && nodeToBind.nodeName.toLowerCase() === nodeName) {
								ko.applyBindingAccessorsToNode(nodeToBind, bindings, bindingContext);
							}
						});
					}
				}
			})();


// Exported only because it has to be referenced by string lookup from within rewritten template
			ko.exportSymbol('__tr_ambtns', ko.templateRewriting.applyMemoizedBindingsToNextSibling);
			(function() {
				// A template source represents a read/write way of accessing a template. This is to eliminate the need for template loading/saving
				// logic to be duplicated in every template engine (and means they can all work with anonymous templates, etc.)
				//
				// Two are provided by default:
				//  1. ko.templateSources.domElement       - reads/writes the text content of an arbitrary DOM element
				//  2. ko.templateSources.anonymousElement - uses ko.utils.domData to read/write text *associated* with the DOM element, but
				//                                           without reading/writing the actual element text content, since it will be overwritten
				//                                           with the rendered template output.
				// You can implement your own template source if you want to fetch/store templates somewhere other than in DOM elements.
				// Template sources need to have the following functions:
				//   text() 			- returns the template text from your storage location
				//   text(value)		- writes the supplied template text to your storage location
				//   data(key)			- reads values stored using data(key, value) - see below
				//   data(key, value)	- associates "value" with this template and the key "key". Is used to store information like "isRewritten".
				//
				// Optionally, template sources can also have the following functions:
				//   nodes()            - returns a DOM element containing the nodes of this template, where available
				//   nodes(value)       - writes the given DOM element to your storage location
				// If a DOM element is available for a given template source, template engines are encouraged to use it in preference over text()
				// for improved speed. However, all templateSources must supply text() even if they don't supply nodes().
				//
				// Once you've implemented a templateSource, make your template engine use it by subclassing whatever template engine you were
				// using and overriding "makeTemplateSource" to return an instance of your custom template source.

				ko.templateSources = {};

				// ---- ko.templateSources.domElement -----

				ko.templateSources.domElement = function(element) {
					this.domElement = element;
				}

				ko.templateSources.domElement.prototype['text'] = function(/* valueToWrite */) {
					var tagNameLower = ko.utils.tagNameLower(this.domElement),
						elemContentsProperty = tagNameLower === "script" ? "text"
							: tagNameLower === "textarea" ? "value"
							: "innerHTML";

					if (arguments.length == 0) {
						return this.domElement[elemContentsProperty];
					} else {
						var valueToWrite = arguments[0];
						if (elemContentsProperty === "innerHTML")
							ko.utils.setHtml(this.domElement, valueToWrite);
						else
							this.domElement[elemContentsProperty] = valueToWrite;
					}
				};

				var dataDomDataPrefix = ko.utils.domData.nextKey() + "_";
				ko.templateSources.domElement.prototype['data'] = function(key /*, valueToWrite */) {
					if (arguments.length === 1) {
						return ko.utils.domData.get(this.domElement, dataDomDataPrefix + key);
					} else {
						ko.utils.domData.set(this.domElement, dataDomDataPrefix + key, arguments[1]);
					}
				};

				// ---- ko.templateSources.anonymousTemplate -----
				// Anonymous templates are normally saved/retrieved as DOM nodes through "nodes".
				// For compatibility, you can also read "text"; it will be serialized from the nodes on demand.
				// Writing to "text" is still supported, but then the template data will not be available as DOM nodes.

				var anonymousTemplatesDomDataKey = ko.utils.domData.nextKey();
				ko.templateSources.anonymousTemplate = function(element) {
					this.domElement = element;
				}
				ko.templateSources.anonymousTemplate.prototype = new ko.templateSources.domElement();
				ko.templateSources.anonymousTemplate.prototype.constructor = ko.templateSources.anonymousTemplate;
				ko.templateSources.anonymousTemplate.prototype['text'] = function(/* valueToWrite */) {
					if (arguments.length == 0) {
						var templateData = ko.utils.domData.get(this.domElement, anonymousTemplatesDomDataKey) || {};
						if (templateData.textData === undefined && templateData.containerData)
							templateData.textData = templateData.containerData.innerHTML;
						return templateData.textData;
					} else {
						var valueToWrite = arguments[0];
						ko.utils.domData.set(this.domElement, anonymousTemplatesDomDataKey, {textData: valueToWrite});
					}
				};
				ko.templateSources.domElement.prototype['nodes'] = function(/* valueToWrite */) {
					if (arguments.length == 0) {
						var templateData = ko.utils.domData.get(this.domElement, anonymousTemplatesDomDataKey) || {};
						return templateData.containerData;
					} else {
						var valueToWrite = arguments[0];
						ko.utils.domData.set(this.domElement, anonymousTemplatesDomDataKey, {containerData: valueToWrite});
					}
				};

				ko.exportSymbol('templateSources', ko.templateSources);
				ko.exportSymbol('templateSources.domElement', ko.templateSources.domElement);
				ko.exportSymbol('templateSources.anonymousTemplate', ko.templateSources.anonymousTemplate);
			})();
			(function () {
				var _templateEngine;
				ko.setTemplateEngine = function (templateEngine) {
					if ((templateEngine != undefined) && !(templateEngine instanceof ko.templateEngine))
						throw new Error("templateEngine must inherit from ko.templateEngine");
					_templateEngine = templateEngine;
				}

				function invokeForEachNodeInContinuousRange(firstNode, lastNode, action) {
					var node, nextInQueue = firstNode, firstOutOfRangeNode = ko.virtualElements.nextSibling(lastNode);
					while (nextInQueue && ((node = nextInQueue) !== firstOutOfRangeNode)) {
						nextInQueue = ko.virtualElements.nextSibling(node);
						action(node, nextInQueue);
					}
				}

				function activateBindingsOnContinuousNodeArray(continuousNodeArray, bindingContext) {
					// To be used on any nodes that have been rendered by a template and have been inserted into some parent element
					// Walks through continuousNodeArray (which *must* be continuous, i.e., an uninterrupted sequence of sibling nodes, because
					// the algorithm for walking them relies on this), and for each top-level item in the virtual-element sense,
					// (1) Does a regular "applyBindings" to associate bindingContext with this node and to activate any non-memoized bindings
					// (2) Unmemoizes any memos in the DOM subtree (e.g., to activate bindings that had been memoized during template rewriting)

					if (continuousNodeArray.length) {
						var firstNode = continuousNodeArray[0],
							lastNode = continuousNodeArray[continuousNodeArray.length - 1],
							parentNode = firstNode.parentNode,
							provider = ko.bindingProvider['instance'],
							preprocessNode = provider['preprocessNode'];

						if (preprocessNode) {
							invokeForEachNodeInContinuousRange(firstNode, lastNode, function(node, nextNodeInRange) {
								var nodePreviousSibling = node.previousSibling;
								var newNodes = preprocessNode.call(provider, node);
								if (newNodes) {
									if (node === firstNode)
										firstNode = newNodes[0] || nextNodeInRange;
									if (node === lastNode)
										lastNode = newNodes[newNodes.length - 1] || nodePreviousSibling;
								}
							});

							// Because preprocessNode can change the nodes, including the first and last nodes, update continuousNodeArray to match.
							// We need the full set, including inner nodes, because the unmemoize step might remove the first node (and so the real
							// first node needs to be in the array).
							continuousNodeArray.length = 0;
							if (!firstNode) { // preprocessNode might have removed all the nodes, in which case there's nothing left to do
								return;
							}
							if (firstNode === lastNode) {
								continuousNodeArray.push(firstNode);
							} else {
								continuousNodeArray.push(firstNode, lastNode);
								ko.utils.fixUpContinuousNodeArray(continuousNodeArray, parentNode);
							}
						}

						// Need to applyBindings *before* unmemoziation, because unmemoization might introduce extra nodes (that we don't want to re-bind)
						// whereas a regular applyBindings won't introduce new memoized nodes
						invokeForEachNodeInContinuousRange(firstNode, lastNode, function(node) {
							if (node.nodeType === 1 || node.nodeType === 8)
								ko.applyBindings(bindingContext, node);
						});
						invokeForEachNodeInContinuousRange(firstNode, lastNode, function(node) {
							if (node.nodeType === 1 || node.nodeType === 8)
								ko.memoization.unmemoizeDomNodeAndDescendants(node, [bindingContext]);
						});

						// Make sure any changes done by applyBindings or unmemoize are reflected in the array
						ko.utils.fixUpContinuousNodeArray(continuousNodeArray, parentNode);
					}
				}

				function getFirstNodeFromPossibleArray(nodeOrNodeArray) {
					return nodeOrNodeArray.nodeType ? nodeOrNodeArray
						: nodeOrNodeArray.length > 0 ? nodeOrNodeArray[0]
						: null;
				}

				function executeTemplate(targetNodeOrNodeArray, renderMode, template, bindingContext, options) {
					options = options || {};
					var firstTargetNode = targetNodeOrNodeArray && getFirstNodeFromPossibleArray(targetNodeOrNodeArray);
					var templateDocument = firstTargetNode && firstTargetNode.ownerDocument;
					var templateEngineToUse = (options['templateEngine'] || _templateEngine);
					ko.templateRewriting.ensureTemplateIsRewritten(template, templateEngineToUse, templateDocument);
					var renderedNodesArray = templateEngineToUse['renderTemplate'](template, bindingContext, options, templateDocument);

					// Loosely check result is an array of DOM nodes
					if ((typeof renderedNodesArray.length != "number") || (renderedNodesArray.length > 0 && typeof renderedNodesArray[0].nodeType != "number"))
						throw new Error("Template engine must return an array of DOM nodes");

					var haveAddedNodesToParent = false;
					switch (renderMode) {
						case "replaceChildren":
							ko.virtualElements.setDomNodeChildren(targetNodeOrNodeArray, renderedNodesArray);
							haveAddedNodesToParent = true;
							break;
						case "replaceNode":
							ko.utils.replaceDomNodes(targetNodeOrNodeArray, renderedNodesArray);
							haveAddedNodesToParent = true;
							break;
						case "ignoreTargetNode": break;
						default:
							throw new Error("Unknown renderMode: " + renderMode);
					}

					if (haveAddedNodesToParent) {
						activateBindingsOnContinuousNodeArray(renderedNodesArray, bindingContext);
						if (options['afterRender'])
							ko.dependencyDetection.ignore(options['afterRender'], null, [renderedNodesArray, bindingContext['$data']]);
					}

					return renderedNodesArray;
				}

				ko.renderTemplate = function (template, dataOrBindingContext, options, targetNodeOrNodeArray, renderMode) {
					options = options || {};
					if ((options['templateEngine'] || _templateEngine) == undefined)
						throw new Error("Set a template engine before calling renderTemplate");
					renderMode = renderMode || "replaceChildren";

					if (targetNodeOrNodeArray) {
						var firstTargetNode = getFirstNodeFromPossibleArray(targetNodeOrNodeArray);

						var whenToDispose = function () { return (!firstTargetNode) || !ko.utils.domNodeIsAttachedToDocument(firstTargetNode); }; // Passive disposal (on next evaluation)
						var activelyDisposeWhenNodeIsRemoved = (firstTargetNode && renderMode == "replaceNode") ? firstTargetNode.parentNode : firstTargetNode;

						return ko.dependentObservable( // So the DOM is automatically updated when any dependency changes
							function () {
								// Ensure we've got a proper binding context to work with
								var bindingContext = (dataOrBindingContext && (dataOrBindingContext instanceof ko.bindingContext))
									? dataOrBindingContext
									: new ko.bindingContext(ko.utils.unwrapObservable(dataOrBindingContext));

								// Support selecting template as a function of the data being rendered
								var templateName = typeof(template) == 'function' ? template(bindingContext['$data'], bindingContext) : template;

								var renderedNodesArray = executeTemplate(targetNodeOrNodeArray, renderMode, templateName, bindingContext, options);
								if (renderMode == "replaceNode") {
									targetNodeOrNodeArray = renderedNodesArray;
									firstTargetNode = getFirstNodeFromPossibleArray(targetNodeOrNodeArray);
								}
							},
							null,
							{ disposeWhen: whenToDispose, disposeWhenNodeIsRemoved: activelyDisposeWhenNodeIsRemoved }
						);
					} else {
						// We don't yet have a DOM node to evaluate, so use a memo and render the template later when there is a DOM node
						return ko.memoization.memoize(function (domNode) {
							ko.renderTemplate(template, dataOrBindingContext, options, domNode, "replaceNode");
						});
					}
				};

				ko.renderTemplateForEach = function (template, arrayOrObservableArray, options, targetNode, parentBindingContext) {
					// Since setDomNodeChildrenFromArrayMapping always calls executeTemplateForArrayItem and then
					// activateBindingsCallback for added items, we can store the binding context in the former to use in the latter.
					var arrayItemContext;

					// This will be called by setDomNodeChildrenFromArrayMapping to get the nodes to add to targetNode
					var executeTemplateForArrayItem = function (arrayValue, index) {
						// Support selecting template as a function of the data being rendered
						arrayItemContext = parentBindingContext['createChildContext'](arrayValue, options['as'], function(context) {
							context['$index'] = index;
						});
						var templateName = typeof(template) == 'function' ? template(arrayValue, arrayItemContext) : template;
						return executeTemplate(null, "ignoreTargetNode", templateName, arrayItemContext, options);
					}

					// This will be called whenever setDomNodeChildrenFromArrayMapping has added nodes to targetNode
					var activateBindingsCallback = function(arrayValue, addedNodesArray, index) {
						activateBindingsOnContinuousNodeArray(addedNodesArray, arrayItemContext);
						if (options['afterRender'])
							options['afterRender'](addedNodesArray, arrayValue);
					};

					return ko.dependentObservable(function () {
						var unwrappedArray = ko.utils.unwrapObservable(arrayOrObservableArray) || [];
						if (typeof unwrappedArray.length == "undefined") // Coerce single value into array
							unwrappedArray = [unwrappedArray];

						// Filter out any entries marked as destroyed
						var filteredArray = ko.utils.arrayFilter(unwrappedArray, function(item) {
							return options['includeDestroyed'] || item === undefined || item === null || !ko.utils.unwrapObservable(item['_destroy']);
						});

						// Call setDomNodeChildrenFromArrayMapping, ignoring any observables unwrapped within (most likely from a callback function).
						// If the array items are observables, though, they will be unwrapped in executeTemplateForArrayItem and managed within setDomNodeChildrenFromArrayMapping.
						ko.dependencyDetection.ignore(ko.utils.setDomNodeChildrenFromArrayMapping, null, [targetNode, filteredArray, executeTemplateForArrayItem, options, activateBindingsCallback]);

					}, null, { disposeWhenNodeIsRemoved: targetNode });
				};

				var templateComputedDomDataKey = ko.utils.domData.nextKey();
				function disposeOldComputedAndStoreNewOne(element, newComputed) {
					var oldComputed = ko.utils.domData.get(element, templateComputedDomDataKey);
					if (oldComputed && (typeof(oldComputed.dispose) == 'function'))
						oldComputed.dispose();
					ko.utils.domData.set(element, templateComputedDomDataKey, (newComputed && newComputed.isActive()) ? newComputed : undefined);
				}

				ko.bindingHandlers['template'] = {
					'init': function(element, valueAccessor) {
						// Support anonymous templates
						var bindingValue = ko.utils.unwrapObservable(valueAccessor());
						if (typeof bindingValue == "string" || bindingValue['name']) {
							// It's a named template - clear the element
							ko.virtualElements.emptyNode(element);
						} else {
							// It's an anonymous template - store the element contents, then clear the element
							var templateNodes = ko.virtualElements.childNodes(element),
								container = ko.utils.moveCleanedNodesToContainerElement(templateNodes); // This also removes the nodes from their current parent
							new ko.templateSources.anonymousTemplate(element)['nodes'](container);
						}
						return { 'controlsDescendantBindings': true };
					},
					'update': function (element, valueAccessor, allBindings, viewModel, bindingContext) {
						var templateName = ko.utils.unwrapObservable(valueAccessor()),
							options = {},
							shouldDisplay = true,
							dataValue,
							templateComputed = null;

						if (typeof templateName != "string") {
							options = templateName;
							templateName = ko.utils.unwrapObservable(options['name']);

							// Support "if"/"ifnot" conditions
							if ('if' in options)
								shouldDisplay = ko.utils.unwrapObservable(options['if']);
							if (shouldDisplay && 'ifnot' in options)
								shouldDisplay = !ko.utils.unwrapObservable(options['ifnot']);

							dataValue = ko.utils.unwrapObservable(options['data']);
						}

						if ('foreach' in options) {
							// Render once for each data point (treating data set as empty if shouldDisplay==false)
							var dataArray = (shouldDisplay && options['foreach']) || [];
							templateComputed = ko.renderTemplateForEach(templateName || element, dataArray, options, element, bindingContext);
						} else if (!shouldDisplay) {
							ko.virtualElements.emptyNode(element);
						} else {
							// Render once for this single data point (or use the viewModel if no data was provided)
							var innerBindingContext = ('data' in options) ?
								bindingContext['createChildContext'](dataValue, options['as']) :  // Given an explitit 'data' value, we create a child binding context for it
								bindingContext;                                                        // Given no explicit 'data' value, we retain the same binding context
							templateComputed = ko.renderTemplate(templateName || element, innerBindingContext, options, element);
						}

						// It only makes sense to have a single template computed per element (otherwise which one should have its output displayed?)
						disposeOldComputedAndStoreNewOne(element, templateComputed);
					}
				};

				// Anonymous templates can't be rewritten. Give a nice error message if you try to do it.
				ko.expressionRewriting.bindingRewriteValidators['template'] = function(bindingValue) {
					var parsedBindingValue = ko.expressionRewriting.parseObjectLiteral(bindingValue);

					if ((parsedBindingValue.length == 1) && parsedBindingValue[0]['unknown'])
						return null; // It looks like a string literal, not an object literal, so treat it as a named template (which is allowed for rewriting)

					if (ko.expressionRewriting.keyValueArrayContainsKey(parsedBindingValue, "name"))
						return null; // Named templates can be rewritten, so return "no error"
					return "This template engine does not support anonymous templates nested within its templates";
				};

				ko.virtualElements.allowedBindings['template'] = true;
			})();

			ko.exportSymbol('setTemplateEngine', ko.setTemplateEngine);
			ko.exportSymbol('renderTemplate', ko.renderTemplate);

			ko.utils.compareArrays = (function () {
				var statusNotInOld = 'added', statusNotInNew = 'deleted';

				// Simple calculation based on Levenshtein distance.
				function compareArrays(oldArray, newArray, options) {
					// For backward compatibility, if the third arg is actually a bool, interpret
					// it as the old parameter 'dontLimitMoves'. Newer code should use { dontLimitMoves: true }.
					options = (typeof options === 'boolean') ? { 'dontLimitMoves': options } : (options || {});
					oldArray = oldArray || [];
					newArray = newArray || [];

					if (oldArray.length <= newArray.length)
						return compareSmallArrayToBigArray(oldArray, newArray, statusNotInOld, statusNotInNew, options);
					else
						return compareSmallArrayToBigArray(newArray, oldArray, statusNotInNew, statusNotInOld, options);
				}

				function compareSmallArrayToBigArray(smlArray, bigArray, statusNotInSml, statusNotInBig, options) {
					var myMin = Math.min,
						myMax = Math.max,
						editDistanceMatrix = [],
						smlIndex, smlIndexMax = smlArray.length,
						bigIndex, bigIndexMax = bigArray.length,
						compareRange = (bigIndexMax - smlIndexMax) || 1,
						maxDistance = smlIndexMax + bigIndexMax + 1,
						thisRow, lastRow,
						bigIndexMaxForRow, bigIndexMinForRow;

					for (smlIndex = 0; smlIndex <= smlIndexMax; smlIndex++) {
						lastRow = thisRow;
						editDistanceMatrix.push(thisRow = []);
						bigIndexMaxForRow = myMin(bigIndexMax, smlIndex + compareRange);
						bigIndexMinForRow = myMax(0, smlIndex - 1);
						for (bigIndex = bigIndexMinForRow; bigIndex <= bigIndexMaxForRow; bigIndex++) {
							if (!bigIndex)
								thisRow[bigIndex] = smlIndex + 1;
							else if (!smlIndex)  // Top row - transform empty array into new array via additions
								thisRow[bigIndex] = bigIndex + 1;
							else if (smlArray[smlIndex - 1] === bigArray[bigIndex - 1])
								thisRow[bigIndex] = lastRow[bigIndex - 1];                  // copy value (no edit)
							else {
								var northDistance = lastRow[bigIndex] || maxDistance;       // not in big (deletion)
								var westDistance = thisRow[bigIndex - 1] || maxDistance;    // not in small (addition)
								thisRow[bigIndex] = myMin(northDistance, westDistance) + 1;
							}
						}
					}

					var editScript = [], meMinusOne, notInSml = [], notInBig = [];
					for (smlIndex = smlIndexMax, bigIndex = bigIndexMax; smlIndex || bigIndex;) {
						meMinusOne = editDistanceMatrix[smlIndex][bigIndex] - 1;
						if (bigIndex && meMinusOne === editDistanceMatrix[smlIndex][bigIndex-1]) {
							notInSml.push(editScript[editScript.length] = {     // added
								'status': statusNotInSml,
								'value': bigArray[--bigIndex],
								'index': bigIndex });
						} else if (smlIndex && meMinusOne === editDistanceMatrix[smlIndex - 1][bigIndex]) {
							notInBig.push(editScript[editScript.length] = {     // deleted
								'status': statusNotInBig,
								'value': smlArray[--smlIndex],
								'index': smlIndex });
						} else {
							--bigIndex;
							--smlIndex;
							if (!options['sparse']) {
								editScript.push({
									'status': "retained",
									'value': bigArray[bigIndex] });
							}
						}
					}

					if (notInSml.length && notInBig.length) {
						// Set a limit on the number of consecutive non-matching comparisons; having it a multiple of
						// smlIndexMax keeps the time complexity of this algorithm linear.
						var limitFailedCompares = smlIndexMax * 10, failedCompares,
							a, d, notInSmlItem, notInBigItem;
						// Go through the items that have been added and deleted and try to find matches between them.
						for (failedCompares = a = 0; (options['dontLimitMoves'] || failedCompares < limitFailedCompares) && (notInSmlItem = notInSml[a]); a++) {
							for (d = 0; notInBigItem = notInBig[d]; d++) {
								if (notInSmlItem['value'] === notInBigItem['value']) {
									notInSmlItem['moved'] = notInBigItem['index'];
									notInBigItem['moved'] = notInSmlItem['index'];
									notInBig.splice(d,1);       // This item is marked as moved; so remove it from notInBig list
									failedCompares = d = 0;     // Reset failed compares count because we're checking for consecutive failures
									break;
								}
							}
							failedCompares += d;
						}
					}
					return editScript.reverse();
				}

				return compareArrays;
			})();

			ko.exportSymbol('utils.compareArrays', ko.utils.compareArrays);

			(function () {
				// Objective:
				// * Given an input array, a container DOM node, and a function from array elements to arrays of DOM nodes,
				//   map the array elements to arrays of DOM nodes, concatenate together all these arrays, and use them to populate the container DOM node
				// * Next time we're given the same combination of things (with the array possibly having mutated), update the container DOM node
				//   so that its children is again the concatenation of the mappings of the array elements, but don't re-map any array elements that we
				//   previously mapped - retain those nodes, and just insert/delete other ones

				// "callbackAfterAddingNodes" will be invoked after any "mapping"-generated nodes are inserted into the container node
				// You can use this, for example, to activate bindings on those nodes.

				function mapNodeAndRefreshWhenChanged(containerNode, mapping, valueToMap, callbackAfterAddingNodes, index) {
					// Map this array value inside a dependentObservable so we re-map when any dependency changes
					var mappedNodes = [];
					var dependentObservable = ko.dependentObservable(function() {
						var newMappedNodes = mapping(valueToMap, index, ko.utils.fixUpContinuousNodeArray(mappedNodes, containerNode)) || [];

						// On subsequent evaluations, just replace the previously-inserted DOM nodes
						if (mappedNodes.length > 0) {
							ko.utils.replaceDomNodes(mappedNodes, newMappedNodes);
							if (callbackAfterAddingNodes)
								ko.dependencyDetection.ignore(callbackAfterAddingNodes, null, [valueToMap, newMappedNodes, index]);
						}

						// Replace the contents of the mappedNodes array, thereby updating the record
						// of which nodes would be deleted if valueToMap was itself later removed
						mappedNodes.splice(0, mappedNodes.length);
						ko.utils.arrayPushAll(mappedNodes, newMappedNodes);
					}, null, { disposeWhenNodeIsRemoved: containerNode, disposeWhen: function() { return !ko.utils.anyDomNodeIsAttachedToDocument(mappedNodes); } });
					return { mappedNodes : mappedNodes, dependentObservable : (dependentObservable.isActive() ? dependentObservable : undefined) };
				}

				var lastMappingResultDomDataKey = ko.utils.domData.nextKey();

				ko.utils.setDomNodeChildrenFromArrayMapping = function (domNode, array, mapping, options, callbackAfterAddingNodes) {
					// Compare the provided array against the previous one
					array = array || [];
					options = options || {};
					var isFirstExecution = ko.utils.domData.get(domNode, lastMappingResultDomDataKey) === undefined;
					var lastMappingResult = ko.utils.domData.get(domNode, lastMappingResultDomDataKey) || [];
					var lastArray = ko.utils.arrayMap(lastMappingResult, function (x) { return x.arrayEntry; });
					var editScript = ko.utils.compareArrays(lastArray, array, options['dontLimitMoves']);

					// Build the new mapping result
					var newMappingResult = [];
					var lastMappingResultIndex = 0;
					var newMappingResultIndex = 0;

					var nodesToDelete = [];
					var itemsToProcess = [];
					var itemsForBeforeRemoveCallbacks = [];
					var itemsForMoveCallbacks = [];
					var itemsForAfterAddCallbacks = [];
					var mapData;

					function itemMovedOrRetained(editScriptIndex, oldPosition) {
						mapData = lastMappingResult[oldPosition];
						if (newMappingResultIndex !== oldPosition)
							itemsForMoveCallbacks[editScriptIndex] = mapData;
						// Since updating the index might change the nodes, do so before calling fixUpContinuousNodeArray
						mapData.indexObservable(newMappingResultIndex++);
						ko.utils.fixUpContinuousNodeArray(mapData.mappedNodes, domNode);
						newMappingResult.push(mapData);
						itemsToProcess.push(mapData);
					}

					function callCallback(callback, items) {
						if (callback) {
							for (var i = 0, n = items.length; i < n; i++) {
								if (items[i]) {
									ko.utils.arrayForEach(items[i].mappedNodes, function(node) {
										callback(node, i, items[i].arrayEntry);
									});
								}
							}
						}
					}

					for (var i = 0, editScriptItem, movedIndex; editScriptItem = editScript[i]; i++) {
						movedIndex = editScriptItem['moved'];
						switch (editScriptItem['status']) {
							case "deleted":
								if (movedIndex === undefined) {
									mapData = lastMappingResult[lastMappingResultIndex];

									// Stop tracking changes to the mapping for these nodes
									if (mapData.dependentObservable)
										mapData.dependentObservable.dispose();

									// Queue these nodes for later removal
									nodesToDelete.push.apply(nodesToDelete, ko.utils.fixUpContinuousNodeArray(mapData.mappedNodes, domNode));
									if (options['beforeRemove']) {
										itemsForBeforeRemoveCallbacks[i] = mapData;
										itemsToProcess.push(mapData);
									}
								}
								lastMappingResultIndex++;
								break;

							case "retained":
								itemMovedOrRetained(i, lastMappingResultIndex++);
								break;

							case "added":
								if (movedIndex !== undefined) {
									itemMovedOrRetained(i, movedIndex);
								} else {
									mapData = { arrayEntry: editScriptItem['value'], indexObservable: ko.observable(newMappingResultIndex++) };
									newMappingResult.push(mapData);
									itemsToProcess.push(mapData);
									if (!isFirstExecution)
										itemsForAfterAddCallbacks[i] = mapData;
								}
								break;
						}
					}

					// Call beforeMove first before any changes have been made to the DOM
					callCallback(options['beforeMove'], itemsForMoveCallbacks);

					// Next remove nodes for deleted items (or just clean if there's a beforeRemove callback)
					ko.utils.arrayForEach(nodesToDelete, options['beforeRemove'] ? ko.cleanNode : ko.removeNode);

					// Next add/reorder the remaining items (will include deleted items if there's a beforeRemove callback)
					for (var i = 0, nextNode = ko.virtualElements.firstChild(domNode), lastNode, node; mapData = itemsToProcess[i]; i++) {
						// Get nodes for newly added items
						if (!mapData.mappedNodes)
							ko.utils.extend(mapData, mapNodeAndRefreshWhenChanged(domNode, mapping, mapData.arrayEntry, callbackAfterAddingNodes, mapData.indexObservable));

						// Put nodes in the right place if they aren't there already
						for (var j = 0; node = mapData.mappedNodes[j]; nextNode = node.nextSibling, lastNode = node, j++) {
							if (node !== nextNode)
								ko.virtualElements.insertAfter(domNode, node, lastNode);
						}

						// Run the callbacks for newly added nodes (for example, to apply bindings, etc.)
						if (!mapData.initialized && callbackAfterAddingNodes) {
							callbackAfterAddingNodes(mapData.arrayEntry, mapData.mappedNodes, mapData.indexObservable);
							mapData.initialized = true;
						}
					}

					// If there's a beforeRemove callback, call it after reordering.
					// Note that we assume that the beforeRemove callback will usually be used to remove the nodes using
					// some sort of animation, which is why we first reorder the nodes that will be removed. If the
					// callback instead removes the nodes right away, it would be more efficient to skip reordering them.
					// Perhaps we'll make that change in the future if this scenario becomes more common.
					callCallback(options['beforeRemove'], itemsForBeforeRemoveCallbacks);

					// Finally call afterMove and afterAdd callbacks
					callCallback(options['afterMove'], itemsForMoveCallbacks);
					callCallback(options['afterAdd'], itemsForAfterAddCallbacks);

					// Store a copy of the array items we just considered so we can difference it next time
					ko.utils.domData.set(domNode, lastMappingResultDomDataKey, newMappingResult);
				}
			})();

			ko.exportSymbol('utils.setDomNodeChildrenFromArrayMapping', ko.utils.setDomNodeChildrenFromArrayMapping);
			ko.nativeTemplateEngine = function () {
				this['allowTemplateRewriting'] = false;
			}

			ko.nativeTemplateEngine.prototype = new ko.templateEngine();
			ko.nativeTemplateEngine.prototype.constructor = ko.nativeTemplateEngine;
			ko.nativeTemplateEngine.prototype['renderTemplateSource'] = function (templateSource, bindingContext, options) {
				var useNodesIfAvailable = !(ko.utils.ieVersion < 9), // IE<9 cloneNode doesn't work properly
					templateNodesFunc = useNodesIfAvailable ? templateSource['nodes'] : null,
					templateNodes = templateNodesFunc ? templateSource['nodes']() : null;

				if (templateNodes) {
					return ko.utils.makeArray(templateNodes.cloneNode(true).childNodes);
				} else {
					var templateText = templateSource['text']();
					return ko.utils.parseHtmlFragment(templateText);
				}
			};

			ko.nativeTemplateEngine.instance = new ko.nativeTemplateEngine();
			ko.setTemplateEngine(ko.nativeTemplateEngine.instance);

			ko.exportSymbol('nativeTemplateEngine', ko.nativeTemplateEngine);
			(function() {
				ko.jqueryTmplTemplateEngine = function () {
					// Detect which version of jquery-tmpl you're using. Unfortunately jquery-tmpl
					// doesn't expose a version number, so we have to infer it.
					// Note that as of Knockout 1.3, we only support jQuery.tmpl 1.0.0pre and later,
					// which KO internally refers to as version "2", so older versions are no longer detected.
					var jQueryTmplVersion = this.jQueryTmplVersion = (function() {
						if ((typeof(jQuery) == "undefined") || !(jQuery['tmpl']))
							return 0;
						// Since it exposes no official version number, we use our own numbering system. To be updated as jquery-tmpl evolves.
						try {
							if (jQuery['tmpl']['tag']['tmpl']['open'].toString().indexOf('__') >= 0) {
								// Since 1.0.0pre, custom tags should append markup to an array called "__"
								return 2; // Final version of jquery.tmpl
							}
						} catch(ex) { /* Apparently not the version we were looking for */ }

						return 1; // Any older version that we don't support
					})();

					function ensureHasReferencedJQueryTemplates() {
						if (jQueryTmplVersion < 2)
							throw new Error("Your version of jQuery.tmpl is too old. Please upgrade to jQuery.tmpl 1.0.0pre or later.");
					}

					function executeTemplate(compiledTemplate, data, jQueryTemplateOptions) {
						return jQuery['tmpl'](compiledTemplate, data, jQueryTemplateOptions);
					}

					this['renderTemplateSource'] = function(templateSource, bindingContext, options) {
						options = options || {};
						ensureHasReferencedJQueryTemplates();

						// Ensure we have stored a precompiled version of this template (don't want to reparse on every render)
						var precompiled = templateSource['data']('precompiled');
						if (!precompiled) {
							var templateText = templateSource['text']() || "";
							// Wrap in "with($whatever.koBindingContext) { ... }"
							templateText = "{{ko_with $item.koBindingContext}}" + templateText + "{{/ko_with}}";

							precompiled = jQuery['template'](null, templateText);
							templateSource['data']('precompiled', precompiled);
						}

						var data = [bindingContext['$data']]; // Prewrap the data in an array to stop jquery.tmpl from trying to unwrap any arrays
						var jQueryTemplateOptions = jQuery['extend']({ 'koBindingContext': bindingContext }, options['templateOptions']);

						var resultNodes = executeTemplate(precompiled, data, jQueryTemplateOptions);
						resultNodes['appendTo'](document.createElement("div")); // Using "appendTo" forces jQuery/jQuery.tmpl to perform necessary cleanup work

						jQuery['fragments'] = {}; // Clear jQuery's fragment cache to avoid a memory leak after a large number of template renders
						return resultNodes;
					};

					this['createJavaScriptEvaluatorBlock'] = function(script) {
						return "{{ko_code ((function() { return " + script + " })()) }}";
					};

					this['addTemplate'] = function(templateName, templateMarkup) {
						document.write("<script type='text/html' id='" + templateName + "'>" + templateMarkup + "<" + "/script>");
					};

					if (jQueryTmplVersion > 0) {
						jQuery['tmpl']['tag']['ko_code'] = {
							open: "__.push($1 || '');"
						};
						jQuery['tmpl']['tag']['ko_with'] = {
							open: "with($1) {",
							close: "} "
						};
					}
				};

				ko.jqueryTmplTemplateEngine.prototype = new ko.templateEngine();
				ko.jqueryTmplTemplateEngine.prototype.constructor = ko.jqueryTmplTemplateEngine;

				// Use this one by default *only if jquery.tmpl is referenced*
				var jqueryTmplTemplateEngineInstance = new ko.jqueryTmplTemplateEngine();
				if (jqueryTmplTemplateEngineInstance.jQueryTmplVersion > 0)
					ko.setTemplateEngine(jqueryTmplTemplateEngineInstance);

				ko.exportSymbol('jqueryTmplTemplateEngine', ko.jqueryTmplTemplateEngine);
			})();
		}));
	}());
})();
define('app/util/ByteSizeParser',["require", "exports"], function (require, exports) {
    var ByteSizeParser = (function () {
        function ByteSizeParser() {
        }
        ByteSizeParser.parse = function (size) {
            return parseInt(size.toLowerCase()['replace'](/([\d.]+)(k|m|g|t)?/gmi, function (match, size, multiplier) {
                return (parseFloat(size) * ByteSizeParser._sizeMap[multiplier]).toString();
            }), 10);
        };
        ByteSizeParser.format = function (size) {
            return size.toLowerCase()['replace'](/([\d.]+)(k|m|g|t)?/gmi, function (match, size, multiplier) {
                return (size + ' ' + ByteSizeParser._formatMap[multiplier || 'empty']).toString();
            });
        };
        ByteSizeParser._sizeMap = {
            'k': Math.pow(1024, 1),
            'm': Math.pow(1024, 2),
            'g': Math.pow(1024, 3),
            't': Math.pow(1024, 4)
        };
        ByteSizeParser._formatMap = {
            'empty': 'bytes',
            'k': 'KB',
            'm': 'MB',
            'g': 'GB',
            't': 'TB'
        };
        return ByteSizeParser;
    })();
    return ByteSizeParser;
});

///<reference path="../../lib/definitions/definitions.d.ts" />
define('app/util/Parser',["require", "exports", 'app/util/ByteSizeParser'], function (require, exports, ByteSizeParser) {
    var Parser = (function () {
        function Parser() {
        }
        Parser.parseTable = function ($el) {
            var items = [];
            var rows = $('tr', $el).toArray();
            // skip headers
            rows = rows.slice(1);
            // parent dir
            var first = rows.shift();
            // rows
            rows.forEach(function (row) {
                var fields = $('td', row).toArray();
                var itm = {
                    isDir: $('img', fields[0]).attr('alt') == '[DIR]',
                    type: $('img', fields[0]).attr('alt'),
                    name: $('a', fields[1]).text().trim(),
                    label: $('a', fields[1]).text().trim(),
                    link: $('a', fields[1]).attr('href').trim(),
                    date: $(fields[2]).text().trim(),
                    size: $(fields[3]).text().trim(),
                    sizeValue: 0,
                    dateValue: 0,
                    ext: ''
                };
                console.log(itm.name);
                itm.ext = itm.name.split('.').pop().toLowerCase();
                itm.sizeValue = ByteSizeParser.parse(itm.size);
                if (itm.date != '') {
                    itm.dateValue = moment().diff(moment(itm.date));
                }
                items.push(itm);
            });
            return items;
        };
        Parser.parsePath = function ($el) {
            var path = $el.text();
            if (path.split('').pop() == '/') {
                path = path.substr(0, path.length - 1);
            }
            var pathItems = path.split('/');
            pathItems[0] = 'root';
            var link = '/';
            return pathItems.map(function (item, index) {
                if (index == 0) {
                    return {
                        name: item,
                        label: 'root',
                        link: link,
                        isDir: true
                    };
                }
                else {
                    link += item + '/';
                    return {
                        name: item,
                        label: item,
                        link: link,
                        isDir: true
                    };
                }
            });
        };
        return Parser;
    })();
    return Parser;
});

///<reference path="../lib/definitions/definitions.d.ts" />
define('app/MainViewModel',["require", "exports", 'knockout', 'app/util/ByteSizeParser'], function (require, exports, ko, ByteSizeParser) {
    var MainViewModel = (function () {
        function MainViewModel(controller) {
            var _this = this;
            this.commandQueue = [];
            this.commandIndex = 0;
            this.previousFilteredItemsLength = 0;
            this.controller = controller;
            this.parentLink = '';
            this.favs = [
                {
                    isDir: true,
                    type: '[DIR]',
                    name: 'MediaMonks projects',
                    link: '/projects/mediamonks/',
                    date: '',
                    size: 0
                },
                {
                    isDir: true,
                    type: '[DIR]',
                    name: 'ThaNarie projects',
                    link: '/projects/thanarie/',
                    date: '',
                    size: 0
                }
            ];
            this.items = ko.observableArray([]);
            this.pathItems = ko.observableArray([]);
            this.previousPathItems = ko.observableArray([]);
            this.search = ko.observable('');
            this.selectedIndex = ko.observable(-1);
            this.selectedItem = ko.observable(null);
            this.activeFilter = ko.observable('type');
            this.activeFilterDirection = ko.observable(true);
            this.searchMode = ko.observable('search');
            this.selectedSearchText = ko.computed(function () {
                if (_this.searchMode() != 'filter') {
                    return _this.search().length || _this.selectedIndex() > 0 ? 'press "tab" or "enter" to select' : 'type to search - "Ctrl+Shift+F" to filter';
                }
                if (_this.search() == '') {
                    $('#search').css('padding-left', '');
                    return 'type to filter';
                }
                if (_this.filteredItems().length == 0) {
                    $('#search').css('padding-left', '');
                    return _this.search() + ' - no results';
                }
                var text = _this.filteredItems()[Math.max(0, Math.min(_this.filteredItems().length - 1, _this.selectedIndex()))].name;
                text = text.replace(new RegExp(_this.search(), 'i'), '<span class="hidden">' + _this.search() + '</span>') + ' - press "enter" to select';
                setTimeout(function () {
                    if (_this.filteredItems().length == 0) {
                        $('#search').css('padding-left', '');
                        return;
                    }
                    $('#search').css('padding-left', $('.search-selected span').position().left + 'px');
                    _this.selectedIndex(Math.max(0, Math.min(_this.filteredItems().length - 1, _this.selectedIndex())));
                }, 1);
                return text;
            });
            this.sortedItems = ko.computed(function () {
                var filter = _this.activeFilter();
                var dir = _this.activeFilterDirection();
                var items = _this.items();
                items.sort(function (a, b) {
                    if (filter == 'name') {
                        if (a.name.toLowerCase() == b.name.toLowerCase())
                            return 0;
                        return (a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1) * (dir ? 1 : -1);
                    }
                    else if (filter == 'size') {
                        if (a.sizeValue == b.sizeValue)
                            return 0;
                        return (a.sizeValue > b.sizeValue ? -1 : 1) * (dir ? 1 : -1);
                    }
                    else if (filter == 'type') {
                        if (a.name == '..' || b.name == '..') {
                            return (a.name == '..' ? -1 : 1) * (dir ? 1 : -1);
                        }
                        else if (a.isDir && b.isDir) {
                            if (a.name.toLowerCase() == b.name.toLowerCase())
                                return 0;
                            return (a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1) * (dir ? 1 : -1);
                        }
                        else if (a.isDir || b.isDir) {
                            return (a.isDir ? -1 : 1) * (dir ? 1 : -1);
                        }
                        else {
                            if (a.ext == b.ext)
                                return 0;
                            return (a.ext < b.ext ? -1 : 1) * (dir ? 1 : -1);
                        }
                    }
                    else if (filter == 'date') {
                        if (a.dateValue == b.dateValue)
                            return 0;
                        return (a.dateValue < b.dateValue ? -1 : 1) * (dir ? 1 : -1);
                    }
                    return 1;
                });
                return items;
            });
            this.filteredItems = ko.computed(function () {
                if (_this.search() == '' || _this.searchMode() == 'search') {
                    return _this.sortedItems();
                }
                else {
                    var dir = _this.activeFilterDirection();
                    var lSearch = _this.search().toLowerCase();
                    var filtered = _this.sortedItems().filter(function (item) {
                        return item.name.toLowerCase().indexOf(lSearch) != -1;
                    });
                    filtered.sort(function (a, b) {
                        var ia = a.name.toLowerCase().indexOf(lSearch);
                        var ib = b.name.toLowerCase().indexOf(lSearch);
                        if (ia == ib) {
                            if (a.name.toLowerCase() == b.name.toLowerCase())
                                return 0;
                            return (a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1) * (dir ? 1 : -1);
                        }
                        else {
                            return ia < ib ? -1 : 1;
                        }
                    });
                    return filtered;
                }
            });
        }
        MainViewModel.prototype.getSizeNumber = function (size) {
            return Math.min(50, Math.pow(size, 1 / 5));
        };
        MainViewModel.prototype.getDateNumber = function (date) {
            if (date == '') {
                return 0;
            }
            var secAway = moment().diff(moment(date)) / 1000;
            return Math.max(0, (100 - Math.pow(secAway, 1 / 2.5)) * 1.3);
        };
        MainViewModel.prototype.getSize = function (size) {
            return ByteSizeParser.format(size);
        };
        MainViewModel.prototype.getDate = function (date) {
            if (date == '') {
                return '';
            }
            return moment(date).fromNow();
        };
        MainViewModel.prototype.getIcon = function (data) {
            if (data.link == '..') {
                return 'parent';
            }
            else if (data.isDir) {
                return 'dir';
            }
            else {
                return 'file';
            }
        };
        return MainViewModel;
    })();
    return MainViewModel;
});

///<reference path="../lib/definitions/definitions.d.ts" />
define('app/Main',["require", "exports", 'knockout', 'app/util/Parser', 'app/MainViewModel'], function (require, exports, ko, Parser, MainViewModel) {
    var Main = (function () {
        function Main() {
            this.basePath = $('.autolisting-path').text();
            if (this.basePath.split('').pop() != '/') {
                this.basePath += '/';
            }
            window['ko'] = ko;
            this.viewModel = new MainViewModel(this);
            this.viewModel.items(Parser.parseTable($('.autolisting-table')));
            ko.applyBindings(this.viewModel, $('.wrapper')[0]);
            this.init();
            this.viewModel.pathItems(Parser.parsePath($('.autolisting-path')));
            this.viewModel.selectedIndex(0);
        }
        Main.prototype.init = function () {
            var _this = this;
            this.viewModel.selectedIndex.subscribe(function (newValue) {
                var $selectedItem = $('.items li:nth-child(' + (_this.viewModel.selectedIndex() + 1) + ')');
                if ($selectedItem.length > 0) {
                    $(window).scrollTop($selectedItem.offset().top - $(window).height() + ($(window).height() / 3));
                }
                // keep item selected instead of the index
                _this.viewModel.selectedItem(_this.viewModel.filteredItems()[_this.viewModel.selectedIndex()]);
            });
            this.viewModel.filteredItems.subscribe(function (newValue) {
                // if we filter down, always select top result
                if (newValue.length < _this.viewModel.previousFilteredItemsLength) {
                    _this.viewModel.selectedIndex(0);
                }
                else if (_this.viewModel.selectedItem()) {
                    _this.viewModel.selectedIndex(_this.viewModel.filteredItems().indexOf(_this.viewModel.selectedItem()));
                }
                _this.viewModel.previousFilteredItemsLength = newValue.length;
            });
            this.viewModel.pathItems.subscribe(function (newValue) {
                if (_this.viewModel.pathItems().length < _this.viewModel.previousPathItems().length) {
                    var recentFolder = _this.viewModel.previousPathItems.pop();
                    var recentItem = _this.viewModel.filteredItems().filter(function (item) {
                        return item.name == (recentFolder.name + '/');
                    })[0];
                    _this.viewModel.selectedIndex(_this.viewModel.filteredItems().indexOf(recentItem));
                }
                else {
                    _this.viewModel.selectedIndex(0);
                }
                _this.viewModel.previousPathItems(_this.viewModel.pathItems());
            });
            this.viewModel.search.subscribe(function (newValue) {
                if (newValue.length == 0 || _this.viewModel.searchMode() != 'search') {
                    return;
                }
                clearInterval(_this.searchTimeout);
                _this.searchTimeout = setTimeout(function () {
                    _this.viewModel.search('');
                    _this.viewModel.commandIndex = 0;
                }, 2000);
                var searchValue = newValue.split('');
                //console.log(newValue);
                // check if we repeatedly pressed the first letter to cycle trough the results
                var reduced = searchValue.reduce(function (prev, current) {
                    return prev == current ? prev : prev + current;
                });
                var options;
                // if cycle
                if (reduced.length == 1) {
                    options = _this.viewModel.sortedItems().filter(function (item) {
                        return item.name.toLowerCase().indexOf(reduced) == 0;
                    });
                    if (options[_this.viewModel.commandIndex] == _this.viewModel.selectedItem()) {
                        _this.viewModel.commandIndex = (_this.viewModel.commandIndex + 1) % options.length;
                    }
                    _this.viewModel.selectedIndex(_this.viewModel.filteredItems().indexOf(options[_this.viewModel.commandIndex]));
                    _this.viewModel.commandIndex = (_this.viewModel.commandIndex + 1) % options.length;
                }
                else {
                    _this.viewModel.commandIndex = 0;
                    options = _this.viewModel.sortedItems().filter(function (item) {
                        return item.name.toLowerCase().indexOf(searchValue.join('')) == 0;
                    });
                    // if we have options, select the first occurrence, otherwise do nothing
                    if (options.length > 0) {
                        _this.viewModel.selectedIndex(_this.viewModel.filteredItems().indexOf(options[_this.viewModel.commandIndex]));
                    }
                }
            });
            $('body').on('keydown', function (event) {
                var data = _this.viewModel.filteredItems()[_this.viewModel.selectedIndex()];
                //console.log(event);
                //  ctrl + backspace || shift + tab
                if (event.keyCode == 8 && event.ctrlKey || (event.keyCode == 9 && event.shiftKey)) {
                    _this.gotoPath({ isDir: true, link: '../' });
                }
                else if (event.keyCode == 13 && event.shiftKey) {
                    _this.openPath(_this.basePath + data.link);
                }
                else if (event.keyCode == 13 && event.altKey) {
                    _this.openNewPath(_this.basePath + data.link);
                }
                else if (event.keyCode == 9 || event.keyCode == 13) {
                    if (event.keyCode == 9) {
                        event.preventDefault();
                    }
                    if (_this.viewModel.filteredItems().length == 0) {
                        return;
                    }
                    _this.gotoPath(data);
                    event.preventDefault();
                }
                else if (event.keyCode == 27) {
                    _this.viewModel.search('');
                    _this.viewModel.commandQueue = [];
                    _this.viewModel.commandIndex = 0;
                    _this.closeHelp();
                    event.preventDefault();
                }
                else if (event.keyCode == 38) {
                    _this.viewModel.selectedIndex(Math.max(0, _this.viewModel.selectedIndex() - 1));
                    event.preventDefault();
                }
                else if (event.keyCode == 40) {
                    _this.viewModel.selectedIndex(Math.min(_this.viewModel.filteredItems().length - 1, _this.viewModel.selectedIndex() + 1));
                    event.preventDefault();
                }
                else if (event.keyCode == 36) {
                    _this.viewModel.selectedIndex(0);
                    event.preventDefault();
                }
                else if (event.keyCode == 35) {
                    _this.viewModel.selectedIndex(_this.viewModel.filteredItems().length - 1);
                    event.preventDefault();
                }
                else if (event.keyCode == 70 && event.ctrlKey && event.shiftKey) {
                    clearInterval(_this.searchTimeout);
                    _this.viewModel.search('');
                    _this.viewModel.commandIndex = 0;
                    _this.viewModel.searchMode(_this.viewModel.searchMode() == 'search' ? 'filter' : 'search');
                    event.preventDefault();
                }
                else if (event.keyCode == 191 && event.shiftKey) {
                    if ($('.help-open').length > 0) {
                        _this.closeHelp();
                    }
                    else {
                        _this.openHelp();
                    }
                    event.preventDefault();
                }
                else if (_this.viewModel.searchMode() == 'search') {
                }
            });
            $('.listing').on('click', 'li a', function (event) {
                if (event.ctrlKey) {
                    return;
                }
                event.preventDefault();
                var data = ko.dataFor(event.currentTarget);
                _this.gotoPath(data);
            });
            if (!isMobile) {
                $('#search').on('blur', function (event) {
                    setTimeout(function () {
                        $('#search').focus();
                    }, 10);
                });
                $('#search').focus();
            }
            $('.sort').on('click', 'a', function (event) {
                event.preventDefault();
                _this.viewModel.activeFilterDirection(_this.viewModel.activeFilter() != $(event.currentTarget).attr('data-filter') ? true : !_this.viewModel.activeFilterDirection());
                _this.viewModel.activeFilter($(event.currentTarget).attr('data-filter'));
            });
            $(window).on('scroll', function (event) {
                if (isMobile) {
                    return;
                }
                if ($('.favs').length == 0) {
                    return;
                }
                if ($(window).scrollTop() > ($('.favs').offset().top + $('.favs').height() - $('.info').height())) {
                    $('.search-wrapper').addClass('fixed');
                    $('.content').addClass('fixed');
                }
                else {
                    $('.search-wrapper').removeClass('fixed');
                    $('.content').removeClass('fixed');
                }
            });
            $(window).on('mousemove', function (event) {
                if (event.clientX > $(window).width() - 120) {
                    $('.items').addClass('stats');
                }
                else {
                    $('.items').removeClass('stats');
                }
            });
            $('.listing').removeClass('disabled');
        };
        Main.prototype.onPathItemClick = function (vm, event) {
            this.gotoPath(vm);
        };
        Main.prototype.expandPathOnMobile = function () {
            $('.info').addClass('expanded');
        };
        Main.prototype.collapsePathOnMobile = function () {
            $('.info').removeClass('expanded');
        };
        Main.prototype.openHelp = function () {
            $('body').addClass('help-open');
        };
        Main.prototype.closeHelp = function () {
            $('body').removeClass('help-open');
        };
        Main.prototype.gotoPath = function (data) {
            var _this = this;
            this.collapsePathOnMobile();
            var link = (data.link.charAt(0) == '/') ? data.link : (this.basePath + data.link);
            if (data.isDir) {
                var $div = $('<div>');
                $div.load(link + '?xhr=true .autolisting-container', function () {
                    if ($div.find('.autolisting-table').length == 0) {
                        _this.openPath(link);
                    }
                    else {
                        _this.viewModel.search('');
                        _this.viewModel.selectedIndex(0);
                        _this.viewModel.selectedItem(null);
                        _this.viewModel.items(Parser.parseTable($('.autolisting-table', $div)));
                        _this.viewModel.pathItems(Parser.parsePath($('.autolisting-path', $div)));
                        _this.viewModel.selectedItem(_this.viewModel.filteredItems()[_this.viewModel.selectedIndex()]);
                        _this.basePath = $('.autolisting-path', $div).text();
                        if (_this.basePath.split('').pop() != '/') {
                            _this.basePath += '/';
                        }
                        history.pushState(null, document.title, _this.basePath);
                    }
                });
            }
            else {
                this.openPath(link);
            }
        };
        Main.prototype.openPath = function (path) {
            $('.listing').addClass('disabled');
            setTimeout(function () {
                document.location.href = path;
            }, 100);
        };
        Main.prototype.openNewPath = function (path) {
            window.open(path);
        };
        return Main;
    })();
    return Main;
});

/*
 ---
 MooTools: the javascript framework

 web build:
 - http://mootools.net/core/808b52b16ab14fd31500681483f7d48f

 packager build:
 - packager build Core/Array Core/String Core/Number Core/Function Core/Object Core/Browser Core/Request Core/Request.HTML Core/Request.JSON

 ...
 */

/*
 ---

 name: Core

 description: The heart of MooTools.

 license: MIT-style license.

 copyright: Copyright (c) 2006-2012 [Valerio Proietti](http://mad4milk.net/).

 authors: The MooTools production team (http://mootools.net/developers/)

 inspiration:
 - Class implementation inspired by [Base.js](http://dean.edwards.name/weblog/2006/03/base/) Copyright (c) 2006 Dean Edwards, [GNU Lesser General Public License](http://opensource.org/licenses/lgpl-license.php)
 - Some functionality inspired by [Prototype.js](http://prototypejs.org) Copyright (c) 2005-2007 Sam Stephenson, [MIT License](http://opensource.org/licenses/mit-license.php)

 provides: [Core, MooTools, Type, typeOf, instanceOf, Native]

 ...
 */

(function(){

	this.MooTools = {
		version: '1.4.5',
		build: 'ab8ea8824dc3b24b6666867a2c4ed58ebb762cf0'
	};

	// typeOf, instanceOf

	var typeOf = this.typeOf = function( item ){
		if( item == null ) return 'null';
		if( item.$family != null ) return item.$family();

		if( item.nodeName ){
			if( item.nodeType == 1 ) return 'element';
			if( item.nodeType == 3 ) return (/\S/).test(item.nodeValue) ? 'textnode' : 'whitespace';
		} else if( typeof item.length == 'number' ){
			if( item.callee ) return 'arguments';
			if( 'item' in item ) return 'collection';
		}

		return typeof item;
	};

	var instanceOf = this.instanceOf = function( item, object ){
		if( item == null ) return false;
		var constructor = item.$constructor || item.constructor;
		while( constructor ){
			if( constructor === object ) return true;
			constructor = constructor.parent;
		}
		/*<ltIE8>*/
		if( !item.hasOwnProperty ) return false;
		/*</ltIE8>*/
		return item instanceof object;
	};

	// Function overloading

	var Function = this.Function;

	var enumerables = true;
	for( var i in {toString: 1} ) enumerables = null;
	if( enumerables ) enumerables = ['hasOwnProperty', 'valueOf', 'isPrototypeOf', 'propertyIsEnumerable', 'toLocaleString', 'toString', 'constructor'];

	Function.prototype.overloadSetter = function( usePlural ){
		var self = this;
		return function( a, b ){
			if( a == null ) return this;
			if( usePlural || typeof a != 'string' ){
				for( var k in a ) self.call(this, k, a[k]);
				if( enumerables ) for( var i = enumerables.length; i--; ){
					k = enumerables[i];
					if( a.hasOwnProperty(k) ) self.call(this, k, a[k]);
				}
			} else{
				self.call(this, a, b);
			}
			return this;
		};
	};

	Function.prototype.overloadGetter = function( usePlural ){
		var self = this;
		return function( a ){
			var args, result;
			if( typeof a != 'string' ) args = a; else if( arguments.length > 1 ) args = arguments; else if( usePlural ) args = [a];
			if( args ){
				result = {};
				for( var i = 0; i < args.length; i++ ) result[args[i]] = self.call(this, args[i]);
			} else{
				result = self.call(this, a);
			}
			return result;
		};
	};

	Function.prototype.extend = function( key, value ){
		this[key] = value;
	}.overloadSetter();

	Function.prototype.implement = function( key, value ){
		this.prototype[key] = value;
	}.overloadSetter();

	// From

	var slice = Array.prototype.slice;

	Function.from = function( item ){
		return (typeOf(item) == 'function') ? item : function(){
			return item;
		};
	};

	Array.from = function( item ){
		if( item == null ) return [];
		return (Type.isEnumerable(item) && typeof item != 'string') ? (typeOf(item) == 'array') ? item : slice.call(item) : [item];
	};

	Number.from = function( item ){
		var number = parseFloat(item);
		return isFinite(number) ? number : null;
	};

	String.from = function( item ){
		return item + '';
	};

	// hide, protect

	Function.implement({

		hide: function(){
			this.$hidden = true;
			return this;
		},

		protect: function(){
			this.$protected = true;
			return this;
		}

	});

	// Type

	var Type = this.Type = function( name, object ){
		if( name ){
			var lower = name.toLowerCase();
			var typeCheck = function( item ){
				return (typeOf(item) == lower);
			};

			Type['is' + name] = typeCheck;
			if( object != null ){
				object.prototype.$family = (function(){
					return lower;
				}).hide();

			}
		}

		if( object == null ) return null;

		object.extend(this);
		object.$constructor = Type;
		object.prototype.$constructor = object;

		return object;
	};

	var toString = Object.prototype.toString;

	Type.isEnumerable = function( item ){
		return (item != null && typeof item.length == 'number' && toString.call(item) != '[object Function]' );
	};

	var hooks = {};

	var hooksOf = function( object ){
		var type = typeOf(object.prototype);
		return hooks[type] || (hooks[type] = []);
	};

	var implement = function( name, method ){
		if( method && method.$hidden ) return;

		var hooks = hooksOf(this);

		for( var i = 0; i < hooks.length; i++ ){
			var hook = hooks[i];
			if( typeOf(hook) == 'type' ) implement.call(hook, name, method); else hook.call(this, name, method);
		}

		var previous = this.prototype[name];
		if( previous == null || !previous.$protected ) this.prototype[name] = method;

		if( this[name] == null && typeOf(method) == 'function' ) extend.call(this, name, function( item ){
			return method.apply(item, slice.call(arguments, 1));
		});
	};

	var extend = function( name, method ){
		if( method && method.$hidden ) return;
		var previous = this[name];
		if( previous == null || !previous.$protected ) this[name] = method;
	};

	Type.implement({

		implement: implement.overloadSetter(),

		extend: extend.overloadSetter(),

		alias: function( name, existing ){
			implement.call(this, name, this.prototype[existing]);
		}.overloadSetter(),

		mirror: function( hook ){
			hooksOf(this).push(hook);
			return this;
		}

	});

	new Type('Type', Type);

	// Default Types

	var force = function( name, object, methods ){
		var isType = (object != Object), prototype = object.prototype;

		if( isType ) object = new Type(name, object);

		for( var i = 0, l = methods.length; i < l; i++ ){
			var key = methods[i], generic = object[key], proto = prototype[key];

			if( generic ) generic.protect();
			if( isType && proto ) object.implement(key, proto.protect());
		}

		if( isType ){
			var methodsEnumerable = prototype.propertyIsEnumerable(methods[0]);
			object.forEachMethod = function( fn ){
				if( !methodsEnumerable ) for( var i = 0, l = methods.length; i < l; i++ ){
					fn.call(prototype, prototype[methods[i]], methods[i]);
				}
				for( var key in prototype ) fn.call(prototype, prototype[key], key)
			};
		}

		return force;
	};

	force('String', String, [
		'charAt', 'charCodeAt', 'concat', 'indexOf', 'lastIndexOf', 'match', 'quote', 'replace', 'search', 'slice', 'split', 'substr', 'substring', 'trim', 'toLowerCase', 'toUpperCase'
	])('Array', Array, [
			'pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift', 'concat', 'join', 'slice', 'indexOf', 'lastIndexOf', 'filter', 'forEach', 'every', 'map', 'some', 'reduce', 'reduceRight'
		])('Number', Number, [
			'toExponential', 'toFixed', 'toLocaleString', 'toPrecision'
		])('Function', Function, [
			'apply', 'call', 'bind'
		])('RegExp', RegExp, [
			'exec', 'test'
		])('Object', Object, [
			'create', 'defineProperty', 'defineProperties', 'keys', 'getPrototypeOf', 'getOwnPropertyDescriptor', 'getOwnPropertyNames', 'preventExtensions', 'isExtensible', 'seal', 'isSealed', 'freeze', 'isFrozen'
		])('Date', Date, ['now']);

	Object.extend = extend.overloadSetter();

	Date.extend('now', function(){
		return +(new Date);
	});

//	new Type('boolean', bool);

	// fixes NaN returning as Number

	Number.prototype.$family = function(){
		return isFinite(this) ? 'number' : 'null';
	}.hide();

	// Number.random

	Number.extend('random', function( min, max ){
		return Math.floor(Math.random() * (max - min + 1) + min);
	});

	// forEach, each

	var hasOwnProperty = Object.prototype.hasOwnProperty;
	Object.extend('forEach', function( object, fn, bind ){
		for( var key in object ){
			if( hasOwnProperty.call(object, key) ) fn.call(bind, object[key], key, object);
		}
	});

	Object.each = Object.forEach;

	Array.implement({

		forEach: function( fn, bind ){
			for( var i = 0, l = this.length; i < l; i++ ){
				if( i in this ) fn.call(bind, this[i], i, this);
			}
		},

		each: function( fn, bind ){
			Array.forEach(this, fn, bind);
			return this;
		}

	});

	// Array & Object cloning, Object merging and appending

	var cloneOf = function( item ){
		switch( typeOf(item) ){
			case 'array':
				return item.clone();
			case 'object':
				return Object.clone(item);
			default:
				return item;
		}
	};

	Array.implement('clone', function(){
		var i = this.length, clone = new Array(i);
		while( i-- ) clone[i] = cloneOf(this[i]);
		return clone;
	});

	var mergeOne = function( source, key, current ){
		switch( typeOf(current) ){
			case 'object':
				if( typeOf(source[key]) == 'object' ) Object.merge(source[key], current); else source[key] = Object.clone(current);
				break;
			case 'array':
				source[key] = current.clone();
				break;
			default:
				source[key] = current;
		}
		return source;
	};

	Object.extend({

		merge: function( source, k, v ){
			if( typeOf(k) == 'string' ) return mergeOne(source, k, v);
			for( var i = 1, l = arguments.length; i < l; i++ ){
				var object = arguments[i];
				for( var key in object ) mergeOne(source, key, object[key]);
			}
			return source;
		},

		clone: function( object ){
			var clone = {};
			for( var key in object ) clone[key] = cloneOf(object[key]);
			return clone;
		},

		append: function( original ){
			for( var i = 1, l = arguments.length; i < l; i++ ){
				var extended = arguments[i] || {};
				for( var key in extended ) original[key] = extended[key];
			}
			return original;
		}

	});

	// Object-less types

	['Object', 'WhiteSpace', 'TextNode', 'Collection', 'Arguments'].each(function( name ){
		new Type(name);
	});

	// Unique ID

	var UID = Date.now();

	String.extend('uniqueID', function(){
		return (UID++).toString(36);
	});


})();


/*
 ---

 name: Array

 description: Contains Array Prototypes like each, contains, and erase.

 license: MIT-style license.

 requires: Type

 provides: Array

 ...
 */

Array.implement({

	/*<!ES5>*/
	every: function( fn, bind ){
		for( var i = 0, l = this.length >>> 0; i < l; i++ ){
			if( (i in this) && !fn.call(bind, this[i], i, this) ) return false;
		}
		return true;
	},

	filter: function( fn, bind ){
		var results = [];
		for( var value, i = 0, l = this.length >>> 0; i < l; i++ ) if( i in this ){
			value = this[i];
			if( fn.call(bind, value, i, this) ) results.push(value);
		}
		return results;
	},

	indexOf: function( item, from ){
		var length = this.length >>> 0;
		for( var i = (from < 0) ? Math.max(0, length + from) : from || 0; i < length; i++ ){
			if( this[i] === item ) return i;
		}
		return -1;
	},

	map: function( fn, bind ){
		var length = this.length >>> 0, results = Array(length);
		for( var i = 0; i < length; i++ ){
			if( i in this ) results[i] = fn.call(bind, this[i], i, this);
		}
		return results;
	},

	some: function( fn, bind ){
		for( var i = 0, l = this.length >>> 0; i < l; i++ ){
			if( (i in this) && fn.call(bind, this[i], i, this) ) return true;
		}
		return false;
	},
	/*</!ES5>*/

	clean: function(){
		return this.filter(function( item ){
			return item != null;
		});
	},

	invoke: function( methodName ){
		var args = Array.slice(arguments, 1);
		return this.map(function( item ){
			return item[methodName].apply(item, args);
		});
	},

	associate: function( keys ){
		var obj = {}, length = Math.min(this.length, keys.length);
		for( var i = 0; i < length; i++ ) obj[keys[i]] = this[i];
		return obj;
	},

	link: function( object ){
		var result = {};
		for( var i = 0, l = this.length; i < l; i++ ){
			for( var key in object ){
				if( object[key](this[i]) ){
					result[key] = this[i];
					delete object[key];
					break;
				}
			}
		}
		return result;
	},

	contains: function( item, from ){
		return this.indexOf(item, from) != -1;
	},

	append: function( array ){
		this.push.apply(this, array);
		return this;
	},

	getLast: function(){
		return (this.length) ? this[this.length - 1] : null;
	},

	getRandom: function(){
		return (this.length) ? this[Number.random(0, this.length - 1)] : null;
	},

	include: function( item ){
		if( !this.contains(item) ) this.push(item);
		return this;
	},

	combine: function( array ){
		for( var i = 0, l = array.length; i < l; i++ ) this.include(array[i]);
		return this;
	},

	erase: function( item ){
		for( var i = this.length; i--; ){
			if( this[i] === item ) this.splice(i, 1);
		}
		return this;
	},

	empty: function(){
		this.length = 0;
		return this;
	},

	flatten: function(){
		var array = [];
		for( var i = 0, l = this.length; i < l; i++ ){
			var type = typeOf(this[i]);
			if( type == 'null' ) continue;
			array = array.concat((type == 'array' || type == 'collection' || type == 'arguments' || instanceOf(this[i], Array)) ? Array.flatten(this[i]) : this[i]);
		}
		return array;
	},

	pick: function(){
		for( var i = 0, l = this.length; i < l; i++ ){
			if( this[i] != null ) return this[i];
		}
		return null;
	},

	hexToRgb: function( array ){
		if( this.length != 3 ) return null;
		var rgb = this.map(function( value ){
			if( value.length == 1 ) value += value;
			return value.toInt(16);
		});
		return (array) ? rgb : 'rgb(' + rgb + ')';
	},

	rgbToHex: function( array ){
		if( this.length < 3 ) return null;
		if( this.length == 4 && this[3] == 0 && !array ) return 'transparent';
		var hex = [];
		for( var i = 0; i < 3; i++ ){
			var bit = (this[i] - 0).toString(16);
			hex.push((bit.length == 1) ? '0' + bit : bit);
		}
		return (array) ? hex : '#' + hex.join('');
	}

});


/*
 ---

 name: String

 description: Contains String Prototypes like camelCase, capitalize, test, and toInt.

 license: MIT-style license.

 requires: Type

 provides: String

 ...
 */

String.implement({

	test: function( regex, params ){
		return ((typeOf(regex) == 'regexp') ? regex : new RegExp('' + regex, params)).test(this);
	},

	contains: function( string, separator ){
		return (separator) ? (separator + this + separator).indexOf(separator + string + separator) > -1 : String(this).indexOf(string) > -1;
	},

	trim: function(){
		return String(this).replace(/^\s+|\s+$/g, '');
	},

	clean: function(){
		return String(this).replace(/\s+/g, ' ').trim();
	},

	camelCase: function(){
		return String(this).replace(/-\D/g, function( match ){
			return match.charAt(1).toUpperCase();
		});
	},

	hyphenate: function(){
		return String(this).replace(/[A-Z]/g, function( match ){
			return ('-' + match.charAt(0).toLowerCase());
		});
	},

	capitalize: function(){
		return String(this).replace(/\b[a-z]/g, function( match ){
			return match.toUpperCase();
		});
	},

	escapeRegExp: function(){
		return String(this).replace(/([-.*+?^${}()|[\]\/\\])/g, '\\$1');
	},

	toInt: function( base ){
		return parseInt(this, base || 10);
	},

	toFloat: function(){
		return parseFloat(this);
	},

	hexToRgb: function( array ){
		var hex = String(this).match(/^#?(\w{1,2})(\w{1,2})(\w{1,2})$/);
		return (hex) ? hex.slice(1).hexToRgb(array) : null;
	},

	rgbToHex: function( array ){
		var rgb = String(this).match(/\d{1,3}/g);
		return (rgb) ? rgb.rgbToHex(array) : null;
	},

	substitute: function( object, regexp ){
		return String(this).replace(regexp || (/\\?\{([^{}]+)\}/g), function( match, name ){
			if( match.charAt(0) == '\\' ) return match.slice(1);
			return (object[name] != null) ? object[name] : '';
		});
	}

});


/*
 ---

 name: Number

 description: Contains Number Prototypes like limit, round, times, and ceil.

 license: MIT-style license.

 requires: Type

 provides: Number

 ...
 */

Number.implement({

	limit: function( min, max ){
		return Math.min(max, Math.max(min, this));
	},

	round: function( precision ){
		precision = Math.pow(10, precision || 0).toFixed(precision < 0 ? -precision : 0);
		return Math.round(this * precision) / precision;
	},

	times: function( fn, bind ){
		for( var i = 0; i < this; i++ ) fn.call(bind, i, this);
	},

	toFloat: function(){
		return parseFloat(this);
	},

	toInt: function( base ){
		return parseInt(this, base || 10);
	}

});

Number.alias('each', 'times');

(function( math ){
	var methods = {};
	math.each(function( name ){
		if( !Number[name] ) methods[name] = function(){
			return Math[name].apply(null, [this].concat(Array.from(arguments)));
		};
	});
	Number.implement(methods);
})(['abs', 'acos', 'asin', 'atan', 'atan2', 'ceil', 'cos', 'exp', 'floor', 'log', 'max', 'min', 'pow', 'sin', 'sqrt', 'tan']);


/*
 ---

 name: Function

 description: Contains Function Prototypes like create, bind, pass, and delay.

 license: MIT-style license.

 requires: Type

 provides: Function

 ...
 */

Function.extend({

	attempt: function(){
		for( var i = 0, l = arguments.length; i < l; i++ ){
			try {
				return arguments[i]();
			} catch( e ) {
			}
		}
		return null;
	}

});

Function.implement({

	attempt: function( args, bind ){
		try {
			return this.apply(bind, Array.from(args));
		} catch( e ) {
		}

		return null;
	},

	/*<!ES5-bind>*/
	bind: function( that ){
		var self = this, args = arguments.length > 1 ? Array.slice(arguments, 1) : null, F = function(){
			};

		var bound = function(){
			var context = that, length = arguments.length;
			if( this instanceof bound ){
				F.prototype = self.prototype;
				context = new F;
			}
			var result = (!args && !length) ? self.call(context) : self.apply(context, args && length ? args.concat(Array.slice(arguments)) : args || arguments);
			return context == that ? result : context;
		};
		return bound;
	},
	/*</!ES5-bind>*/

	pass: function( args, bind ){
		var self = this;
		if( args != null ) args = Array.from(args);
		return function(){
			return self.apply(bind, args || arguments);
		};
	},

	delay: function( delay, bind, args ){
		return setTimeout(this.pass((args == null ? [] : args), bind), delay);
	},

	periodical: function( periodical, bind, args ){
		return setInterval(this.pass((args == null ? [] : args), bind), periodical);
	}

});


/*
 ---

 name: Object

 description: Object generic methods

 license: MIT-style license.

 requires: Type

 provides: [Object, Hash]

 ...
 */

(function(){

	var hasOwnProperty = Object.prototype.hasOwnProperty;

	Object.extend({

		subset: function( object, keys ){
			var results = {};
			for( var i = 0, l = keys.length; i < l; i++ ){
				var k = keys[i];
				if( k in object ) results[k] = object[k];
			}
			return results;
		},

		map: function( object, fn, bind ){
			var results = {};
			for( var key in object ){
				if( hasOwnProperty.call(object, key) ) results[key] = fn.call(bind, object[key], key, object);
			}
			return results;
		},

		filter: function( object, fn, bind ){
			var results = {};
			for( var key in object ){
				var value = object[key];
				if( hasOwnProperty.call(object, key) && fn.call(bind, value, key, object) ) results[key] = value;
			}
			return results;
		},

		every: function( object, fn, bind ){
			for( var key in object ){
				if( hasOwnProperty.call(object, key) && !fn.call(bind, object[key], key) ) return false;
			}
			return true;
		},

		some: function( object, fn, bind ){
			for( var key in object ){
				if( hasOwnProperty.call(object, key) && fn.call(bind, object[key], key) ) return true;
			}
			return false;
		},

		keys: function( object ){
			var keys = [];
			for( var key in object ){
				if( hasOwnProperty.call(object, key) ) keys.push(key);
			}
			return keys;
		},

		values: function( object ){
			var values = [];
			for( var key in object ){
				if( hasOwnProperty.call(object, key) ) values.push(object[key]);
			}
			return values;
		},

		getLength: function( object ){
			return Object.keys(object).length;
		},

		keyOf: function( object, value ){
			for( var key in object ){
				if( hasOwnProperty.call(object, key) && object[key] === value ) return key;
			}
			return null;
		},

		contains: function( object, value ){
			return Object.keyOf(object, value) != null;
		},

		toQueryString: function( object, base ){
			var queryString = [];

			Object.each(object, function( value, key ){
				if( base ) key = base + '[' + key + ']';
				var result;
				switch( typeOf(value) ){
					case 'object':
						result = Object.toQueryString(value, key);
						break;
					case 'array':
						var qs = {};
						value.each(function( val, i ){
							qs[i] = val;
						});
						result = Object.toQueryString(qs, key);
						break;
					default:
						result = key + '=' + encodeURIComponent(value);
				}
				if( value != null ) queryString.push(result);
			});

			return queryString.join('&');
		}

	});

})();


/*
 ---

 name: Browser

 description: The Browser Object. Contains Browser initialization, Window and Document, and the Browser Hash.

 license: MIT-style license.

 requires: [Array, Function, Number, String]

 provides: [Browser, Window, Document]

 ...
 */

(function(){

	var document = this.document;
	var window = document.window = this;

	var ua = navigator.userAgent.toLowerCase(), platform = navigator.platform.toLowerCase(), UA = ua.match(/(opera|ie|firefox|chrome|version)[\s\/:]([\w\d\.]+)?.*?(safari|version[\s\/:]([\w\d\.]+)|$)/) || [null, 'unknown', 0], mode = UA[1] == 'ie' && document.documentMode;

	var Browser = this.Browser = {

		extend: Function.prototype.extend,

		name: (UA[1] == 'version') ? UA[3] : UA[1],

		version: mode || parseFloat((UA[1] == 'opera' && UA[4]) ? UA[4] : UA[2]),

		Platform: {
			name: ua.match(/ip(?:ad|od|hone)/) ? 'ios' : (ua.match(/(?:webos|android)/) || platform.match(/mac|win|linux/) || ['other'])[0]
		},

		Features: {
			xpath: !!(document.evaluate),
			air: !!(window.runtime),
			query: !!(document.querySelector),
			json: !!(window.JSON)
		},

		Plugins: {}

	};

	Browser[Browser.name] = true;
	Browser[Browser.name + parseInt(Browser.version, 10)] = true;
	Browser.Platform[Browser.Platform.name] = true;

	// Request

	Browser.Request = (function(){

		var XMLHTTP = function(){
			return new XMLHttpRequest();
		};

		var MSXML2 = function(){
			return new ActiveXObject('MSXML2.XMLHTTP');
		};

		var MSXML = function(){
			return new ActiveXObject('Microsoft.XMLHTTP');
		};

		return Function.attempt(function(){
			XMLHTTP();
			return XMLHTTP;
		}, function(){
			MSXML2();
			return MSXML2;
		}, function(){
			MSXML();
			return MSXML;
		});

	})();

	Browser.Features.xhr = !!(Browser.Request);

	// Flash detection

	var version = (Function.attempt(function(){
		return navigator.plugins['Shockwave Flash'].description;
	}, function(){
		return new ActiveXObject('ShockwaveFlash.ShockwaveFlash').GetVariable('$version');
	}) || '0 r0').match(/\d+/g);

	Browser.Plugins.Flash = {
		version: Number(version[0] || '0.' + version[1]) || 0,
		build: Number(version[2]) || 0
	};

	// String scripts

	Browser.exec = function( text ){
		if( !text ) return text;
		if( window.execScript ){
			window.execScript(text);
		} else{
			var script = document.createElement('script');
			script.setAttribute('type', 'text/javascript');
			script.text = text;
			document.head.appendChild(script);
			document.head.removeChild(script);
		}
		return text;
	};

	String.implement('stripScripts', function( exec ){
		var scripts = '';
		var text = this.replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, function( all, code ){
			scripts += code + '\n';
			return '';
		});
		if( exec === true ) Browser.exec(scripts); else if( typeOf(exec) == 'function' ) exec(scripts, text);
		return text;
	});

	// Window, Document

	Browser.extend({
		Document: this.Document,
		Window: this.Window,
		Element: this.Element,
		Event: this.Event
	});

	this.Window = this.$constructor = new Type('Window', function(){
	});

	this.$family = Function.from('window').hide();

	Window.mirror(function( name, method ){
		window[name] = method;
	});

	this.Document = document.$constructor = new Type('Document', function(){
	});

	document.$family = Function.from('document').hide();

	Document.mirror(function( name, method ){
		document[name] = method;
	});

	document.html = document.documentElement;
	if( !document.head ) document.head = document.getElementsByTagName('head')[0];

	if( document.execCommand ) try {
		document.execCommand("BackgroundImageCache", false, true);
	} catch( e ) {
	}

	/*<ltIE9>*/
	if( this.attachEvent && !this.addEventListener ){
		var unloadEvent = function(){
			this.detachEvent('onunload', unloadEvent);
			document.head = document.html = document.window = null;
		};
		this.attachEvent('onunload', unloadEvent);
	}

	// IE fails on collections and <select>.options (refers to <select>)
	var arrayFrom = Array.from;
	try {
		arrayFrom(document.html.childNodes);
	} catch( e ) {
		Array.from = function( item ){
			if( typeof item != 'string' && Type.isEnumerable(item) && typeOf(item) != 'array' ){
				var i = item.length, array = new Array(i);
				while( i-- ) array[i] = item[i];
				return array;
			}
			return arrayFrom(item);
		};

		var prototype = Array.prototype, slice = prototype.slice;
		['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift', 'concat', 'join', 'slice'].each(function( name ){
			var method = prototype[name];
			Array[name] = function( item ){
				return method.apply(Array.from(item), slice.call(arguments, 1));
			};
		});
	}
	/*</ltIE9>*/


})();


/*
 ---
 name: Slick.Parser
 description: Standalone CSS3 Selector parser
 provides: Slick.Parser
 ...
 */

;
(function(){

	var parsed, separatorIndex, combinatorIndex, reversed, cache = {}, reverseCache = {}, reUnescape = /\\/g;

	var parse = function( expression, isReversed ){
		if( expression == null ) return null;
		if( expression.Slick === true ) return expression;
		expression = ('' + expression).replace(/^\s+|\s+$/g, '');
		reversed = !!isReversed;
		var currentCache = (reversed) ? reverseCache : cache;
		if( currentCache[expression] ) return currentCache[expression];
		parsed = {
			Slick: true,
			expressions: [],
			raw: expression,
			reverse: function(){
				return parse(this.raw, true);
			}
		};
		separatorIndex = -1;
		while( expression != (expression = expression.replace(regexp, parser)) );
		parsed.length = parsed.expressions.length;
		return currentCache[parsed.raw] = (reversed) ? reverse(parsed) : parsed;
	};

	var reverseCombinator = function( combinator ){
		if( combinator === '!' ) return ' '; else if( combinator === ' ' ) return '!'; else if( (/^!/).test(combinator) ) return combinator.replace(/^!/, ''); else return '!' + combinator;
	};

	var reverse = function( expression ){
		var expressions = expression.expressions;
		for( var i = 0; i < expressions.length; i++ ){
			var exp = expressions[i];
			var last = {parts: [], tag: '*', combinator: reverseCombinator(exp[0].combinator)};

			for( var j = 0; j < exp.length; j++ ){
				var cexp = exp[j];
				if( !cexp.reverseCombinator ) cexp.reverseCombinator = ' ';
				cexp.combinator = cexp.reverseCombinator;
				delete cexp.reverseCombinator;
			}

			exp.reverse().push(last);
		}
		return expression;
	};

	var escapeRegExp = function( string ){// Credit: XRegExp 0.6.1 (c) 2007-2008 Steven Levithan <http://stevenlevithan.com/regex/xregexp/> MIT License
		return string.replace(/[-[\]{}()*+?.\\^$|,#\s]/g, function( match ){
			return '\\' + match;
		});
	};

	var regexp = new RegExp(/*
	 #!/usr/bin/env ruby
	 puts "\t\t" + DATA.read.gsub(/\(\?x\)|\s+#.*$|\s+|\\$|\\n/,'')
	 __END__
	 "(?x)^(?:\
	 \\s* ( , ) \\s*               # Separator          \n\
	 | \\s* ( <combinator>+ ) \\s*   # Combinator         \n\
	 |      ( \\s+ )                 # CombinatorChildren \n\
	 |      ( <unicode>+ | \\* )     # Tag                \n\
	 | \\#  ( <unicode>+       )     # ID                 \n\
	 | \\.  ( <unicode>+       )     # ClassName          \n\
	 |                               # Attribute          \n\
	 \\[  \
	 \\s* (<unicode1>+)  (?:  \
	 \\s* ([*^$!~|]?=)  (?:  \
	 \\s* (?:\
	 ([\"']?)(.*?)\\9 \
	 )\
	 )  \
	 )?  \\s*  \
	 \\](?!\\]) \n\
	 |   :+ ( <unicode>+ )(?:\
	 \\( (?:\
	 (?:([\"'])([^\\12]*)\\12)|((?:\\([^)]+\\)|[^()]*)+)\
	 ) \\)\
	 )?\
	 )"
	 */
		"^(?:\\s*(,)\\s*|\\s*(<combinator>+)\\s*|(\\s+)|(<unicode>+|\\*)|\\#(<unicode>+)|\\.(<unicode>+)|\\[\\s*(<unicode1>+)(?:\\s*([*^$!~|]?=)(?:\\s*(?:([\"']?)(.*?)\\9)))?\\s*\\](?!\\])|(:+)(<unicode>+)(?:\\((?:(?:([\"'])([^\\13]*)\\13)|((?:\\([^)]+\\)|[^()]*)+))\\))?)".replace(/<combinator>/, '[' + escapeRegExp(">+~`!@$%^&={}\\;</") + ']').replace(/<unicode>/g, '(?:[\\w\\u00a1-\\uFFFF-]|\\\\[^\\s0-9a-f])').replace(/<unicode1>/g, '(?:[:\\w\\u00a1-\\uFFFF-]|\\\\[^\\s0-9a-f])'));

	function parser( rawMatch, separator, combinator, combinatorChildren, tagName, id, className, attributeKey, attributeOperator, attributeQuote, attributeValue, pseudoMarker, pseudoClass, pseudoQuote, pseudoClassQuotedValue, pseudoClassValue ){
		if( separator || separatorIndex === -1 ){
			parsed.expressions[++separatorIndex] = [];
			combinatorIndex = -1;
			if( separator ) return '';
		}

		if( combinator || combinatorChildren || combinatorIndex === -1 ){
			combinator = combinator || ' ';
			var currentSeparator = parsed.expressions[separatorIndex];
			if( reversed && currentSeparator[combinatorIndex] )
				currentSeparator[combinatorIndex].reverseCombinator = reverseCombinator(combinator);
			currentSeparator[++combinatorIndex] = {combinator: combinator, tag: '*'};
		}

		var currentParsed = parsed.expressions[separatorIndex][combinatorIndex];

		if( tagName ){
			currentParsed.tag = tagName.replace(reUnescape, '');

		} else if( id ){
			currentParsed.id = id.replace(reUnescape, '');

		} else if( className ){
			className = className.replace(reUnescape, '');

			if( !currentParsed.classList ) currentParsed.classList = [];
			if( !currentParsed.classes ) currentParsed.classes = [];
			currentParsed.classList.push(className);
			currentParsed.classes.push({
				value: className,
				regexp: new RegExp('(^|\\s)' + escapeRegExp(className) + '(\\s|$)')
			});

		} else if( pseudoClass ){
			pseudoClassValue = pseudoClassValue || pseudoClassQuotedValue;
			pseudoClassValue = pseudoClassValue ? pseudoClassValue.replace(reUnescape, '') : null;

			if( !currentParsed.pseudos ) currentParsed.pseudos = [];
			currentParsed.pseudos.push({
				key: pseudoClass.replace(reUnescape, ''),
				value: pseudoClassValue,
				type: pseudoMarker.length == 1 ? 'class' : 'element'
			});

		} else if( attributeKey ){
			attributeKey = attributeKey.replace(reUnescape, '');
			attributeValue = (attributeValue || '').replace(reUnescape, '');

			var test, regexp;

			switch( attributeOperator ){
				case '^=' :
					regexp = new RegExp('^' + escapeRegExp(attributeValue));
					break;
				case '$=' :
					regexp = new RegExp(escapeRegExp(attributeValue) + '$');
					break;
				case '~=' :
					regexp = new RegExp('(^|\\s)' + escapeRegExp(attributeValue) + '(\\s|$)');
					break;
				case '|=' :
					regexp = new RegExp('^' + escapeRegExp(attributeValue) + '(-|$)');
					break;
				case  '=' :
					test = function( value ){
						return attributeValue == value;
					};
					break;
				case '*=' :
					test = function( value ){
						return value && value.indexOf(attributeValue) > -1;
					};
					break;
				case '!=' :
					test = function( value ){
						return attributeValue != value;
					};
					break;
				default   :
					test = function( value ){
						return !!value;
					};
			}

			if( attributeValue == '' && (/^[*$^]=$/).test(attributeOperator) ) test = function(){
				return false;
			};

			if( !test ) test = function( value ){
				return value && regexp.test(value);
			};

			if( !currentParsed.attributes ) currentParsed.attributes = [];
			currentParsed.attributes.push({
				key: attributeKey,
				operator: attributeOperator,
				value: attributeValue,
				test: test
			});

		}

		return '';
	};

	// Slick NS

	var Slick = (this.Slick || {});

	Slick.parse = function( expression ){
		return parse(expression);
	};

	Slick.escapeRegExp = escapeRegExp;

	if( !this.Slick ) this.Slick = Slick;

}).apply(/*<CommonJS>*/(typeof exports != 'undefined') ? exports : /*</CommonJS>*/this);


/*
 ---
 name: Slick.Finder
 description: The new, superfast css selector engine.
 provides: Slick.Finder
 requires: Slick.Parser
 ...
 */

;
(function(){

	var local = {}, featuresCache = {}, toString = Object.prototype.toString;

	// Feature / Bug detection

	local.isNativeCode = function( fn ){
		return (/\{\s*\[native code\]\s*\}/).test('' + fn);
	};

	local.isXML = function( document ){
		return (!!document.xmlVersion) || (!!document.xml) || (toString.call(document) == '[object XMLDocument]') || (document.nodeType == 9 && document.documentElement.nodeName != 'HTML');
	};

	local.setDocument = function( document ){

		// convert elements / window arguments to document. if document cannot be extrapolated, the function returns.
		var nodeType = document.nodeType;
		if( nodeType == 9 ); // document
		else if( nodeType ) document = document.ownerDocument; // node
		else if( document.navigator ) document = document.document; // window
		else return;

		// check if it's the old document

		if( this.document === document ) return;
		this.document = document;

		// check if we have done feature detection on this document before

		var root = document.documentElement, rootUid = this.getUIDXML(root), features = featuresCache[rootUid], feature;

		if( features ){
			for( feature in features ){
				this[feature] = features[feature];
			}
			return;
		}

		features = featuresCache[rootUid] = {};

		features.root = root;
		features.isXMLDocument = this.isXML(document);

		features.brokenStarGEBTN = features.starSelectsClosedQSA = features.idGetsName = features.brokenMixedCaseQSA = features.brokenGEBCN = features.brokenCheckedQSA = features.brokenEmptyAttributeQSA = features.isHTMLDocument = features.nativeMatchesSelector = false;

		var starSelectsClosed, starSelectsComments, brokenSecondClassNameGEBCN, cachedGetElementsByClassName, brokenFormAttributeGetter;

		var selected, id = 'slick_uniqueid';
		var testNode = document.createElement('div');

		var testRoot = document.body || document.getElementsByTagName('body')[0] || root;
		testRoot.appendChild(testNode);

		// on non-HTML documents innerHTML and getElementsById doesnt work properly
		try {
			testNode.innerHTML = '<a id="' + id + '"></a>';
			features.isHTMLDocument = !!document.getElementById(id);
		} catch( e ) {
		}
		;

		if( features.isHTMLDocument ){

			testNode.style.display = 'none';

			// IE returns comment nodes for getElementsByTagName('*') for some documents
			testNode.appendChild(document.createComment(''));
			starSelectsComments = (testNode.getElementsByTagName('*').length > 1);

			// IE returns closed nodes (EG:"</foo>") for getElementsByTagName('*') for some documents
			try {
				testNode.innerHTML = 'foo</foo>';
				selected = testNode.getElementsByTagName('*');
				starSelectsClosed = (selected && !!selected.length && selected[0].nodeName.charAt(0) == '/');
			} catch( e ) {
			}
			;

			features.brokenStarGEBTN = starSelectsComments || starSelectsClosed;

			// IE returns elements with the name instead of just id for getElementsById for some documents
			try {
				testNode.innerHTML = '<a name="' + id + '"></a><b id="' + id + '"></b>';
				features.idGetsName = document.getElementById(id) === testNode.firstChild;
			} catch( e ) {
			}
			;

			if( testNode.getElementsByClassName ){

				// Safari 3.2 getElementsByClassName caches results
				try {
					testNode.innerHTML = '<a class="f"></a><a class="b"></a>';
					testNode.getElementsByClassName('b').length;
					testNode.firstChild.className = 'b';
					cachedGetElementsByClassName = (testNode.getElementsByClassName('b').length != 2);
				} catch( e ) {
				}
				;

				// Opera 9.6 getElementsByClassName doesnt detects the class if its not the first one
				try {
					testNode.innerHTML = '<a class="a"></a><a class="f b a"></a>';
					brokenSecondClassNameGEBCN = (testNode.getElementsByClassName('a').length != 2);
				} catch( e ) {
				}
				;

				features.brokenGEBCN = cachedGetElementsByClassName || brokenSecondClassNameGEBCN;
			}

			if( testNode.querySelectorAll ){
				// IE 8 returns closed nodes (EG:"</foo>") for querySelectorAll('*') for some documents
				try {
					testNode.innerHTML = 'foo</foo>';
					selected = testNode.querySelectorAll('*');
					features.starSelectsClosedQSA = (selected && !!selected.length && selected[0].nodeName.charAt(0) == '/');
				} catch( e ) {
				}
				;

				// Safari 3.2 querySelectorAll doesnt work with mixedcase on quirksmode
				try {
					testNode.innerHTML = '<a class="MiX"></a>';
					features.brokenMixedCaseQSA = !testNode.querySelectorAll('.MiX').length;
				} catch( e ) {
				}
				;

				// Webkit and Opera dont return selected options on querySelectorAll
				try {
					testNode.innerHTML = '<select><option selected="selected">a</option></select>';
					features.brokenCheckedQSA = (testNode.querySelectorAll(':checked').length == 0);
				} catch( e ) {
				}
				;

				// IE returns incorrect results for attr[*^$]="" selectors on querySelectorAll
				try {
					testNode.innerHTML = '<a class=""></a>';
					features.brokenEmptyAttributeQSA = (testNode.querySelectorAll('[class*=""]').length != 0);
				} catch( e ) {
				}
				;

			}

			// IE6-7, if a form has an input of id x, form.getAttribute(x) returns a reference to the input
			try {
				testNode.innerHTML = '<form action="s"><input id="action"/></form>';
				brokenFormAttributeGetter = (testNode.firstChild.getAttribute('action') != 's');
			} catch( e ) {
			}
			;

			// native matchesSelector function

			features.nativeMatchesSelector = root.matchesSelector || /*root.msMatchesSelector ||*/ root.mozMatchesSelector || root.webkitMatchesSelector;
			if( features.nativeMatchesSelector ) try {
				// if matchesSelector trows errors on incorrect sintaxes we can use it
				features.nativeMatchesSelector.call(root, ':slick');
				features.nativeMatchesSelector = null;
			} catch( e ) {
			}
			;

		}

		try {
			root.slick_expando = 1;
			delete root.slick_expando;
			features.getUID = this.getUIDHTML;
		} catch( e ) {
			features.getUID = this.getUIDXML;
		}

		testRoot.removeChild(testNode);
		testNode = selected = testRoot = null;

		// getAttribute

		features.getAttribute = (features.isHTMLDocument && brokenFormAttributeGetter) ? function( node, name ){
			var method = this.attributeGetters[name];
			if( method ) return method.call(node);
			var attributeNode = node.getAttributeNode(name);
			return (attributeNode) ? attributeNode.nodeValue : null;
		} : function( node, name ){
			var method = this.attributeGetters[name];
			return (method) ? method.call(node) : node.getAttribute(name);
		};

		// hasAttribute

		features.hasAttribute = (root && this.isNativeCode(root.hasAttribute)) ? function( node, attribute ){
			return node.hasAttribute(attribute);
		} : function( node, attribute ){
			node = node.getAttributeNode(attribute);
			return !!(node && (node.specified || node.nodeValue));
		};

		// contains
		// FIXME: Add specs: local.contains should be different for xml and html documents?
		var nativeRootContains = root && this.isNativeCode(root.contains), nativeDocumentContains = document && this.isNativeCode(document.contains);

		features.contains = (nativeRootContains && nativeDocumentContains) ? function( context, node ){
			return context.contains(node);
		} : (nativeRootContains && !nativeDocumentContains) ? function( context, node ){
			// IE8 does not have .contains on document.
			return context === node || ((context === document) ? document.documentElement : context).contains(node);
		} : (root && root.compareDocumentPosition) ? function( context, node ){
			return context === node || !!(context.compareDocumentPosition(node) & 16);
		} : function( context, node ){
			if( node ) do {
				if( node === context ) return true;
			} while( (node = node.parentNode) );
			return false;
		};

		// document order sorting
		// credits to Sizzle (http://sizzlejs.com/)

		features.documentSorter = (root.compareDocumentPosition) ? function( a, b ){
			if( !a.compareDocumentPosition || !b.compareDocumentPosition ) return 0;
			return a.compareDocumentPosition(b) & 4 ? -1 : a === b ? 0 : 1;
		} : ('sourceIndex' in root) ? function( a, b ){
			if( !a.sourceIndex || !b.sourceIndex ) return 0;
			return a.sourceIndex - b.sourceIndex;
		} : (document.createRange) ? function( a, b ){
			if( !a.ownerDocument || !b.ownerDocument ) return 0;
			var aRange = a.ownerDocument.createRange(), bRange = b.ownerDocument.createRange();
			aRange.setStart(a, 0);
			aRange.setEnd(a, 0);
			bRange.setStart(b, 0);
			bRange.setEnd(b, 0);
			return aRange.compareBoundaryPoints(Range.START_TO_END, bRange);
		} : null;

		root = null;

		for( feature in features ){
			this[feature] = features[feature];
		}
	};

	// Main Method

	var reSimpleSelector = /^([#.]?)((?:[\w-]+|\*))$/, reEmptyAttribute = /\[.+[*$^]=(?:""|'')?\]/, qsaFailExpCache = {};

	local.search = function( context, expression, append, first ){

		var found = this.found = (first) ? null : (append || []);

		if( !context ) return found; else if( context.navigator ) context = context.document; // Convert the node from a window to a document
		else if( !context.nodeType ) return found;

		// setup

		var parsed, i, uniques = this.uniques = {}, hasOthers = !!(append && append.length), contextIsDocument = (context.nodeType == 9);

		if( this.document !== (contextIsDocument ? context : context.ownerDocument) ) this.setDocument(context);

		// avoid duplicating items already in the append array
		if( hasOthers ) for( i = found.length; i--; ) uniques[this.getUID(found[i])] = true;

		// expression checks

		if( typeof expression == 'string' ){ // expression is a string

			/*<simple-selectors-override>*/
			var simpleSelector = expression.match(reSimpleSelector);
			simpleSelectors: if( simpleSelector ){

				var symbol = simpleSelector[1], name = simpleSelector[2], node, nodes;

				if( !symbol ){

					if( name == '*' && this.brokenStarGEBTN ) break simpleSelectors;
					nodes = context.getElementsByTagName(name);
					if( first ) return nodes[0] || null;
					for( i = 0; node = nodes[i++]; ){
						if( !(hasOthers && uniques[this.getUID(node)]) ) found.push(node);
					}

				} else if( symbol == '#' ){

					if( !this.isHTMLDocument || !contextIsDocument ) break simpleSelectors;
					node = context.getElementById(name);
					if( !node ) return found;
					if( this.idGetsName && node.getAttributeNode('id').nodeValue != name ) break simpleSelectors;
					if( first ) return node || null;
					if( !(hasOthers && uniques[this.getUID(node)]) ) found.push(node);

				} else if( symbol == '.' ){

					if( !this.isHTMLDocument || ((!context.getElementsByClassName || this.brokenGEBCN) && context.querySelectorAll) ) break simpleSelectors;
					if( context.getElementsByClassName && !this.brokenGEBCN ){
						nodes = context.getElementsByClassName(name);
						if( first ) return nodes[0] || null;
						for( i = 0; node = nodes[i++]; ){
							if( !(hasOthers && uniques[this.getUID(node)]) ) found.push(node);
						}
					} else{
						var matchClass = new RegExp('(^|\\s)' + Slick.escapeRegExp(name) + '(\\s|$)');
						nodes = context.getElementsByTagName('*');
						for( i = 0; node = nodes[i++]; ){
							className = node.className;
							if( !(className && matchClass.test(className)) ) continue;
							if( first ) return node;
							if( !(hasOthers && uniques[this.getUID(node)]) ) found.push(node);
						}
					}

				}

				if( hasOthers ) this.sort(found);
				return (first) ? null : found;

			}
			/*</simple-selectors-override>*/

			/*<query-selector-override>*/
			querySelector: if( context.querySelectorAll ){

				if( !this.isHTMLDocument || qsaFailExpCache[expression]
					//TODO: only skip when expression is actually mixed case
					|| this.brokenMixedCaseQSA || (this.brokenCheckedQSA && expression.indexOf(':checked') > -1) || (this.brokenEmptyAttributeQSA && reEmptyAttribute.test(expression)) || (!contextIsDocument //Abort when !contextIsDocument and...
					//  there are multiple expressions in the selector
					//  since we currently only fix non-document rooted QSA for single expression selectors
					&& expression.indexOf(',') > -1
					) || Slick.disableQSA ) break querySelector;

				var _expression = expression, _context = context;
				if( !contextIsDocument ){
					// non-document rooted QSA
					// credits to Andrew Dupont
					var currentId = _context.getAttribute('id'), slickid = 'slickid__';
					_context.setAttribute('id', slickid);
					_expression = '#' + slickid + ' ' + _expression;
					context = _context.parentNode;
				}

				try {
					if( first ) return context.querySelector(_expression) || null; else nodes = context.querySelectorAll(_expression);
				} catch( e ) {
					qsaFailExpCache[expression] = 1;
					break querySelector;
				} finally {
					if( !contextIsDocument ){
						if( currentId ) _context.setAttribute('id', currentId); else _context.removeAttribute('id');
						context = _context;
					}
				}

				if( this.starSelectsClosedQSA ) for( i = 0; node = nodes[i++]; ){
					if( node.nodeName > '@' && !(hasOthers && uniques[this.getUID(node)]) ) found.push(node);
				} else for( i = 0; node = nodes[i++]; ){
					if( !(hasOthers && uniques[this.getUID(node)]) ) found.push(node);
				}

				if( hasOthers ) this.sort(found);
				return found;

			}
			/*</query-selector-override>*/

			parsed = this.Slick.parse(expression);
			if( !parsed.length ) return found;
		} else if( expression == null ){ // there is no expression
			return found;
		} else if( expression.Slick ){ // expression is a parsed Slick object
			parsed = expression;
		} else if( this.contains(context.documentElement || context, expression) ){ // expression is a node
			(found) ? found.push(expression) : found = expression;
			return found;
		} else{ // other junk
			return found;
		}

		/*<pseudo-selectors>*/
		/*<nth-pseudo-selectors>*/

		// cache elements for the nth selectors

		this.posNTH = {};
		this.posNTHLast = {};
		this.posNTHType = {};
		this.posNTHTypeLast = {};

		/*</nth-pseudo-selectors>*/
		/*</pseudo-selectors>*/

		// if append is null and there is only a single selector with one expression use pushArray, else use pushUID
		this.push = (!hasOthers && (first || (parsed.length == 1 && parsed.expressions[0].length == 1))) ? this.pushArray : this.pushUID;

		if( found == null ) found = [];

		// default engine

		var j, m, n;
		var combinator, tag, id, classList, classes, attributes, pseudos;
		var currentItems, currentExpression, currentBit, lastBit, expressions = parsed.expressions;

		search: for( i = 0; (currentExpression = expressions[i]); i++ ) for( j = 0; (currentBit = currentExpression[j]); j++ ){

			combinator = 'combinator:' + currentBit.combinator;
			if( !this[combinator] ) continue search;

			tag = (this.isXMLDocument) ? currentBit.tag : currentBit.tag.toUpperCase();
			id = currentBit.id;
			classList = currentBit.classList;
			classes = currentBit.classes;
			attributes = currentBit.attributes;
			pseudos = currentBit.pseudos;
			lastBit = (j === (currentExpression.length - 1));

			this.bitUniques = {};

			if( lastBit ){
				this.uniques = uniques;
				this.found = found;
			} else{
				this.uniques = {};
				this.found = [];
			}

			if( j === 0 ){
				this[combinator](context, tag, id, classes, attributes, pseudos, classList);
				if( first && lastBit && found.length ) break search;
			} else{
				if( first && lastBit ) for( m = 0, n = currentItems.length; m < n; m++ ){
					this[combinator](currentItems[m], tag, id, classes, attributes, pseudos, classList);
					if( found.length ) break search;
				} else for( m = 0, n = currentItems.length; m < n; m++ ) this[combinator](currentItems[m], tag, id, classes, attributes, pseudos, classList);
			}

			currentItems = this.found;
		}

		// should sort if there are nodes in append and if you pass multiple expressions.
		if( hasOthers || (parsed.expressions.length > 1) ) this.sort(found);

		return (first) ? (found[0] || null) : found;
	};

	// Utils

	local.uidx = 1;
	local.uidk = 'slick-uniqueid';

	local.getUIDXML = function( node ){
		var uid = node.getAttribute(this.uidk);
		if( !uid ){
			uid = this.uidx++;
			node.setAttribute(this.uidk, uid);
		}
		return uid;
	};

	local.getUIDHTML = function( node ){
		return node.uniqueNumber || (node.uniqueNumber = this.uidx++);
	};

	// sort based on the setDocument documentSorter method.

	local.sort = function( results ){
		if( !this.documentSorter ) return results;
		results.sort(this.documentSorter);
		return results;
	};

	/*<pseudo-selectors>*/
	/*<nth-pseudo-selectors>*/

	local.cacheNTH = {};

	local.matchNTH = /^([+-]?\d*)?([a-z]+)?([+-]\d+)?$/;

	local.parseNTHArgument = function( argument ){
		var parsed = argument.match(this.matchNTH);
		if( !parsed ) return false;
		var special = parsed[2] || false;
		var a = parsed[1] || 1;
		if( a == '-' ) a = -1;
		var b = +parsed[3] || 0;
		parsed = (special == 'n') ? {a: a, b: b} : (special == 'odd') ? {a: 2, b: 1} : (special == 'even') ? {a: 2, b: 0} : {a: 0, b: a};

		return (this.cacheNTH[argument] = parsed);
	};

	local.createNTHPseudo = function( child, sibling, positions, ofType ){
		return function( node, argument ){
			var uid = this.getUID(node);
			if( !this[positions][uid] ){
				var parent = node.parentNode;
				if( !parent ) return false;
				var el = parent[child], count = 1;
				if( ofType ){
					var nodeName = node.nodeName;
					do {
						if( el.nodeName != nodeName ) continue;
						this[positions][this.getUID(el)] = count++;
					} while( (el = el[sibling]) );
				} else{
					do {
						if( el.nodeType != 1 ) continue;
						this[positions][this.getUID(el)] = count++;
					} while( (el = el[sibling]) );
				}
			}
			argument = argument || 'n';
			var parsed = this.cacheNTH[argument] || this.parseNTHArgument(argument);
			if( !parsed ) return false;
			var a = parsed.a, b = parsed.b, pos = this[positions][uid];
			if( a == 0 ) return b == pos;
			if( a > 0 ){
				if( pos < b ) return false;
			} else{
				if( b < pos ) return false;
			}
			return ((pos - b) % a) == 0;
		};
	};

	/*</nth-pseudo-selectors>*/
	/*</pseudo-selectors>*/

	local.pushArray = function( node, tag, id, classes, attributes, pseudos ){
		if( this.matchSelector(node, tag, id, classes, attributes, pseudos) ) this.found.push(node);
	};

	local.pushUID = function( node, tag, id, classes, attributes, pseudos ){
		var uid = this.getUID(node);
		if( !this.uniques[uid] && this.matchSelector(node, tag, id, classes, attributes, pseudos) ){
			this.uniques[uid] = true;
			this.found.push(node);
		}
	};

	local.matchNode = function( node, selector ){
		if( this.isHTMLDocument && this.nativeMatchesSelector ){
			try {
				return this.nativeMatchesSelector.call(node, selector.replace(/\[([^=]+)=\s*([^'"\]]+?)\s*\]/g, '[$1="$2"]'));
			} catch( matchError ) {
			}
		}

		var parsed = this.Slick.parse(selector);
		if( !parsed ) return true;

		// simple (single) selectors
		var expressions = parsed.expressions, simpleExpCounter = 0, i;
		for( i = 0; (currentExpression = expressions[i]); i++ ){
			if( currentExpression.length == 1 ){
				var exp = currentExpression[0];
				if( this.matchSelector(node, (this.isXMLDocument) ? exp.tag : exp.tag.toUpperCase(), exp.id, exp.classes, exp.attributes, exp.pseudos) ) return true;
				simpleExpCounter++;
			}
		}

		if( simpleExpCounter == parsed.length ) return false;

		var nodes = this.search(this.document, parsed), item;
		for( i = 0; item = nodes[i++]; ){
			if( item === node ) return true;
		}
		return false;
	};

	local.matchPseudo = function( node, name, argument ){
		var pseudoName = 'pseudo:' + name;
		if( this[pseudoName] ) return this[pseudoName](node, argument);
		var attribute = this.getAttribute(node, name);
		return (argument) ? argument == attribute : !!attribute;
	};

	local.matchSelector = function( node, tag, id, classes, attributes, pseudos ){
		if( tag ){
			var nodeName = (this.isXMLDocument) ? node.nodeName : node.nodeName.toUpperCase();
			if( tag == '*' ){
				if( nodeName < '@' ) return false; // Fix for comment nodes and closed nodes
			} else{
				if( nodeName != tag ) return false;
			}
		}

		if( id && node.getAttribute('id') != id ) return false;

		var i, part, cls;
		if( classes ) for( i = classes.length; i--; ){
			cls = this.getAttribute(node, 'class');
			if( !(cls && classes[i].regexp.test(cls)) ) return false;
		}
		if( attributes ) for( i = attributes.length; i--; ){
			part = attributes[i];
			if( part.operator ? !part.test(this.getAttribute(node, part.key)) : !this.hasAttribute(node, part.key) ) return false;
		}
		if( pseudos ) for( i = pseudos.length; i--; ){
			part = pseudos[i];
			if( !this.matchPseudo(node, part.key, part.value) ) return false;
		}
		return true;
	};

	var combinators = {

		' ': function( node, tag, id, classes, attributes, pseudos, classList ){ // all child nodes, any level

			var i, item, children;

			if( this.isHTMLDocument ){
				getById: if( id ){
					item = this.document.getElementById(id);
					if( (!item && node.all) || (this.idGetsName && item && item.getAttributeNode('id').nodeValue != id) ){
						// all[id] returns all the elements with that name or id inside node
						// if theres just one it will return the element, else it will be a collection
						children = node.all[id];
						if( !children ) return;
						if( !children[0] ) children = [children];
						for( i = 0; item = children[i++]; ){
							var idNode = item.getAttributeNode('id');
							if( idNode && idNode.nodeValue == id ){
								this.push(item, tag, null, classes, attributes, pseudos);
								break;
							}
						}
						return;
					}
					if( !item ){
						// if the context is in the dom we return, else we will try GEBTN, breaking the getById label
						if( this.contains(this.root, node) ) return; else break getById;
					} else if( this.document !== node && !this.contains(node, item) ) return;
					this.push(item, tag, null, classes, attributes, pseudos);
					return;
				}
				getByClass: if( classes && node.getElementsByClassName && !this.brokenGEBCN ){
					children = node.getElementsByClassName(classList.join(' '));
					if( !(children && children.length) ) break getByClass;
					for( i = 0; item = children[i++]; ) this.push(item, tag, id, null, attributes, pseudos);
					return;
				}
			}
			getByTag: {
				children = node.getElementsByTagName(tag);
				if( !(children && children.length) ) break getByTag;
				if( !this.brokenStarGEBTN ) tag = null;
				for( i = 0; item = children[i++]; ) this.push(item, tag, id, classes, attributes, pseudos);
			}
		},

		'>': function( node, tag, id, classes, attributes, pseudos ){ // direct children
			if( (node = node.firstChild) ) do {
				if( node.nodeType == 1 ) this.push(node, tag, id, classes, attributes, pseudos);
			} while( (node = node.nextSibling) );
		},

		'+': function( node, tag, id, classes, attributes, pseudos ){ // next sibling
			while( (node = node.nextSibling) ) if( node.nodeType == 1 ){
				this.push(node, tag, id, classes, attributes, pseudos);
				break;
			}
		},

		'^': function( node, tag, id, classes, attributes, pseudos ){ // first child
			node = node.firstChild;
			if( node ){
				if( node.nodeType == 1 ) this.push(node, tag, id, classes, attributes, pseudos); else this['combinator:+'](node, tag, id, classes, attributes, pseudos);
			}
		},

		'~': function( node, tag, id, classes, attributes, pseudos ){ // next siblings
			while( (node = node.nextSibling) ){
				if( node.nodeType != 1 ) continue;
				var uid = this.getUID(node);
				if( this.bitUniques[uid] ) break;
				this.bitUniques[uid] = true;
				this.push(node, tag, id, classes, attributes, pseudos);
			}
		},

		'++': function( node, tag, id, classes, attributes, pseudos ){ // next sibling and previous sibling
			this['combinator:+'](node, tag, id, classes, attributes, pseudos);
			this['combinator:!+'](node, tag, id, classes, attributes, pseudos);
		},

		'~~': function( node, tag, id, classes, attributes, pseudos ){ // next siblings and previous siblings
			this['combinator:~'](node, tag, id, classes, attributes, pseudos);
			this['combinator:!~'](node, tag, id, classes, attributes, pseudos);
		},

		'!': function( node, tag, id, classes, attributes, pseudos ){ // all parent nodes up to document
			while( (node = node.parentNode) ) if( node !== this.document ) this.push(node, tag, id, classes, attributes, pseudos);
		},

		'!>': function( node, tag, id, classes, attributes, pseudos ){ // direct parent (one level)
			node = node.parentNode;
			if( node !== this.document ) this.push(node, tag, id, classes, attributes, pseudos);
		},

		'!+': function( node, tag, id, classes, attributes, pseudos ){ // previous sibling
			while( (node = node.previousSibling) ) if( node.nodeType == 1 ){
				this.push(node, tag, id, classes, attributes, pseudos);
				break;
			}
		},

		'!^': function( node, tag, id, classes, attributes, pseudos ){ // last child
			node = node.lastChild;
			if( node ){
				if( node.nodeType == 1 ) this.push(node, tag, id, classes, attributes, pseudos); else this['combinator:!+'](node, tag, id, classes, attributes, pseudos);
			}
		},

		'!~': function( node, tag, id, classes, attributes, pseudos ){ // previous siblings
			while( (node = node.previousSibling) ){
				if( node.nodeType != 1 ) continue;
				var uid = this.getUID(node);
				if( this.bitUniques[uid] ) break;
				this.bitUniques[uid] = true;
				this.push(node, tag, id, classes, attributes, pseudos);
			}
		}

	};

	for( var c in combinators ) local['combinator:' + c] = combinators[c];

	var pseudos = {

		/*<pseudo-selectors>*/

		'empty': function( node ){
			var child = node.firstChild;
			return !(child && child.nodeType == 1) && !(node.innerText || node.textContent || '').length;
		},

		'not': function( node, expression ){
			return !this.matchNode(node, expression);
		},

		'contains': function( node, text ){
			return (node.innerText || node.textContent || '').indexOf(text) > -1;
		},

		'first-child': function( node ){
			while( (node = node.previousSibling) ) if( node.nodeType == 1 ) return false;
			return true;
		},

		'last-child': function( node ){
			while( (node = node.nextSibling) ) if( node.nodeType == 1 ) return false;
			return true;
		},

		'only-child': function( node ){
			var prev = node;
			while( (prev = prev.previousSibling) ) if( prev.nodeType == 1 ) return false;
			var next = node;
			while( (next = next.nextSibling) ) if( next.nodeType == 1 ) return false;
			return true;
		},

		/*<nth-pseudo-selectors>*/

		'nth-child': local.createNTHPseudo('firstChild', 'nextSibling', 'posNTH'),

		'nth-last-child': local.createNTHPseudo('lastChild', 'previousSibling', 'posNTHLast'),

		'nth-of-type': local.createNTHPseudo('firstChild', 'nextSibling', 'posNTHType', true),

		'nth-last-of-type': local.createNTHPseudo('lastChild', 'previousSibling', 'posNTHTypeLast', true),

		'index': function( node, index ){
			return this['pseudo:nth-child'](node, '' + (index + 1));
		},

		'even': function( node ){
			return this['pseudo:nth-child'](node, '2n');
		},

		'odd': function( node ){
			return this['pseudo:nth-child'](node, '2n+1');
		},

		/*</nth-pseudo-selectors>*/

		/*<of-type-pseudo-selectors>*/

		'first-of-type': function( node ){
			var nodeName = node.nodeName;
			while( (node = node.previousSibling) ) if( node.nodeName == nodeName ) return false;
			return true;
		},

		'last-of-type': function( node ){
			var nodeName = node.nodeName;
			while( (node = node.nextSibling) ) if( node.nodeName == nodeName ) return false;
			return true;
		},

		'only-of-type': function( node ){
			var prev = node, nodeName = node.nodeName;
			while( (prev = prev.previousSibling) ) if( prev.nodeName == nodeName ) return false;
			var next = node;
			while( (next = next.nextSibling) ) if( next.nodeName == nodeName ) return false;
			return true;
		},

		/*</of-type-pseudo-selectors>*/

		// custom pseudos

		'enabled': function( node ){
			return !node.disabled;
		},

		'disabled': function( node ){
			return node.disabled;
		},

		'checked': function( node ){
			return node.checked || node.selected;
		},

		'focus': function( node ){
			return this.isHTMLDocument && this.document.activeElement === node && (node.href || node.type || this.hasAttribute(node, 'tabindex'));
		},

		'root': function( node ){
			return (node === this.root);
		},

		'selected': function( node ){
			return node.selected;
		}

		/*</pseudo-selectors>*/
	};

	for( var p in pseudos ) local['pseudo:' + p] = pseudos[p];

	// attributes methods

	var attributeGetters = local.attributeGetters = {

		'for': function(){
			return ('htmlFor' in this) ? this.htmlFor : this.getAttribute('for');
		},

		'href': function(){
			return ('href' in this) ? this.getAttribute('href', 2) : this.getAttribute('href');
		},

		'style': function(){
			return (this.style) ? this.style.cssText : this.getAttribute('style');
		},

		'tabindex': function(){
			var attributeNode = this.getAttributeNode('tabindex');
			return (attributeNode && attributeNode.specified) ? attributeNode.nodeValue : null;
		},

		'type': function(){
			return this.getAttribute('type');
		},

		'maxlength': function(){
			var attributeNode = this.getAttributeNode('maxLength');
			return (attributeNode && attributeNode.specified) ? attributeNode.nodeValue : null;
		}

	};

	attributeGetters.MAXLENGTH = attributeGetters.maxLength = attributeGetters.maxlength;

	// Slick

	var Slick = local.Slick = (this.Slick || {});

	Slick.version = '1.1.7';

	// Slick finder

	Slick.search = function( context, expression, append ){
		return local.search(context, expression, append);
	};

	Slick.find = function( context, expression ){
		return local.search(context, expression, null, true);
	};

	// Slick containment checker

	Slick.contains = function( container, node ){
		local.setDocument(container);
		return local.contains(container, node);
	};

	// Slick attribute getter

	Slick.getAttribute = function( node, name ){
		local.setDocument(node);
		return local.getAttribute(node, name);
	};

	Slick.hasAttribute = function( node, name ){
		local.setDocument(node);
		return local.hasAttribute(node, name);
	};

	// Slick matcher

	Slick.match = function( node, selector ){
		if( !(node && selector) ) return false;
		if( !selector || selector === node ) return true;
		local.setDocument(node);
		return local.matchNode(node, selector);
	};

	// Slick attribute accessor

	Slick.defineAttributeGetter = function( name, fn ){
		local.attributeGetters[name] = fn;
		return this;
	};

	Slick.lookupAttributeGetter = function( name ){
		return local.attributeGetters[name];
	};

	// Slick pseudo accessor

	Slick.definePseudo = function( name, fn ){
		local['pseudo:' + name] = function( node, argument ){
			return fn.call(node, argument);
		};
		return this;
	};

	Slick.lookupPseudo = function( name ){
		var pseudo = local['pseudo:' + name];
		if( pseudo ) return function( argument ){
			return pseudo.call(this, argument);
		};
		return null;
	};

	// Slick overrides accessor

	Slick.override = function( regexp, fn ){
		local.override(regexp, fn);
		return this;
	};

	Slick.isXML = local.isXML;

	Slick.uidOf = function( node ){
		return local.getUIDHTML(node);
	};

	if( !this.Slick ) this.Slick = Slick;

}).apply(/*<CommonJS>*/(typeof exports != 'undefined') ? exports : /*</CommonJS>*/this);


/*
 ---

 name: Element

 description: One of the most important items in MooTools. Contains the dollar function, the dollars function, and an handful of cross-browser, time-saver methods to let you easily work with HTML Elements.

 license: MIT-style license.

 requires: [Window, Document, Array, String, Function, Object, Number, Slick.Parser, Slick.Finder]

 provides: [Element, Elements, $, $$, Iframe, Selectors]

 ...
 */

var Element = function( tag, props ){
	var konstructor = Element.Constructors[tag];
	if( konstructor ) return konstructor(props);
	if( typeof tag != 'string' ) return document.id(tag).set(props);

	if( !props ) props = {};

	if( !(/^[\w-]+$/).test(tag) ){
		var parsed = Slick.parse(tag).expressions[0][0];
		tag = (parsed.tag == '*') ? 'div' : parsed.tag;
		if( parsed.id && props.id == null ) props.id = parsed.id;

		var attributes = parsed.attributes;
		if( attributes ) for( var attr, i = 0, l = attributes.length; i < l; i++ ){
			attr = attributes[i];
			if( props[attr.key] != null ) continue;

			if( attr.value != null && attr.operator == '=' ) props[attr.key] = attr.value; else if( !attr.value && !attr.operator ) props[attr.key] = true;
		}

		if( parsed.classList && props['class'] == null ) props['class'] = parsed.classList.join(' ');
	}

	return document.newElement(tag, props);
};


if( Browser.Element ){
	Element.prototype = Browser.Element.prototype;
	// IE8 and IE9 require the wrapping.
	Element.prototype._fireEvent = (function( fireEvent ){
		return function( type, event ){
			return fireEvent.call(this, type, event);
		};
	})(Element.prototype.fireEvent);
}

new Type('Element', Element).mirror(function( name ){
	if( Array.prototype[name] ) return;

	var obj = {};
	obj[name] = function(){
		var results = [], args = arguments, elements = true;
		for( var i = 0, l = this.length; i < l; i++ ){
			var element = this[i], result = results[i] = element[name].apply(element, args);
			elements = (elements && typeOf(result) == 'element');
		}
		return (elements) ? new Elements(results) : results;
	};

	Elements.implement(obj);
});

if( !Browser.Element ){
	Element.parent = Object;

	Element.Prototype = {
		'$constructor': Element,
		'$family': Function.from('element').hide()
	};

	Element.mirror(function( name, method ){
		Element.Prototype[name] = method;
	});
}

Element.Constructors = {};


var IFrame = new Type('IFrame', function(){
	var params = Array.link(arguments, {
		properties: Type.isObject,
		iframe: function( obj ){
			return (obj != null);
		}
	});

	var props = params.properties || {}, iframe;
	if( params.iframe ) iframe = document.id(params.iframe);
	var onload = props.onload || function(){
	};
	delete props.onload;
	props.id = props.name = [props.id, props.name, iframe ? (iframe.id || iframe.name) : 'IFrame_' + String.uniqueID()].pick();
	iframe = new Element(iframe || 'iframe', props);

	var onLoad = function(){
		onload.call(iframe.contentWindow);
	};

	if( window.frames[props.id] ) onLoad(); else iframe.addListener('load', onLoad);
	return iframe;
});

var Elements = this.Elements = function( nodes ){
	if( nodes && nodes.length ){
		var uniques = {}, node;
		for( var i = 0; node = nodes[i++]; ){
			var uid = Slick.uidOf(node);
			if( !uniques[uid] ){
				uniques[uid] = true;
				this.push(node);
			}
		}
	}
};

Elements.prototype = {length: 0};
Elements.parent = Array;

new Type('Elements', Elements).implement({

	filter: function( filter, bind ){
		if( !filter ) return this;
		return new Elements(Array.filter(this, (typeOf(filter) == 'string') ? function( item ){
			return item.match(filter);
		} : filter, bind));
	}.protect(),

	push: function(){
		var length = this.length;
		for( var i = 0, l = arguments.length; i < l; i++ ){
			var item = document.id(arguments[i]);
			if( item ) this[length++] = item;
		}
		return (this.length = length);
	}.protect(),

	unshift: function(){
		var items = [];
		for( var i = 0, l = arguments.length; i < l; i++ ){
			var item = document.id(arguments[i]);
			if( item ) items.push(item);
		}
		return Array.prototype.unshift.apply(this, items);
	}.protect(),

	concat: function(){
		var newElements = new Elements(this);
		for( var i = 0, l = arguments.length; i < l; i++ ){
			var item = arguments[i];
			if( Type.isEnumerable(item) ) newElements.append(item); else newElements.push(item);
		}
		return newElements;
	}.protect(),

	append: function( collection ){
		for( var i = 0, l = collection.length; i < l; i++ ) this.push(collection[i]);
		return this;
	}.protect(),

	empty: function(){
		while( this.length ) delete this[--this.length];
		return this;
	}.protect()

});


(function(){

	// FF, IE
	var splice = Array.prototype.splice, object = {'0': 0, '1': 1, length: 2};

	splice.call(object, 1, 1);
	if( object[1] == 1 ) Elements.implement('splice', function(){
		var length = this.length;
		var result = splice.apply(this, arguments);
		while( length >= this.length ) delete this[length--];
		return result;
	}.protect());

	Array.forEachMethod(function( method, name ){
		Elements.implement(name, method);
	});

	Array.mirror(Elements);

	/*<ltIE8>*/
	var createElementAcceptsHTML;
	try {
		createElementAcceptsHTML = (document.createElement('<input name=x>').name == 'x');
	} catch( e ) {
	}

	var escapeQuotes = function( html ){
		return ('' + html).replace(/&/g, '&amp;').replace(/"/g, '&quot;');
	};
	/*</ltIE8>*/

	Document.implement({

		newElement: function( tag, props ){
			if( props && props.checked != null ) props.defaultChecked = props.checked;
			/*<ltIE8>*/// Fix for readonly name and type properties in IE < 8
			if( createElementAcceptsHTML && props ){
				tag = '<' + tag;
				if( props.name ) tag += ' name="' + escapeQuotes(props.name) + '"';
				if( props.type ) tag += ' type="' + escapeQuotes(props.type) + '"';
				tag += '>';
				delete props.name;
				delete props.type;
			}
			/*</ltIE8>*/
			return this.id(this.createElement(tag)).set(props);
		}

	});

})();

(function(){

	Slick.uidOf(window);
	Slick.uidOf(document);

	Document.implement({

		newTextNode: function( text ){
			return this.createTextNode(text);
		},

		getDocument: function(){
			return this;
		},

		getWindow: function(){
			return this.window;
		},

		id: (function(){

			var types = {

				string: function( id, nocash, doc ){
					id = Slick.find(doc, '#' + id.replace(/(\W)/g, '\\$1'));
					return (id) ? types.element(id, nocash) : null;
				},

				element: function( el, nocash ){
					Slick.uidOf(el);
					if( !nocash && !el.$family && !(/^(?:object|embed)$/i).test(el.tagName) ){
						var fireEvent = el.fireEvent;
						// wrapping needed in IE7, or else crash
						el._fireEvent = function( type, event ){
							return fireEvent(type, event);
						};
						Object.append(el, Element.Prototype);
					}
					return el;
				},

				object: function( obj, nocash, doc ){
					if( obj.toElement ) return types.element(obj.toElement(doc), nocash);
					return null;
				}

			};

			types.textnode = types.whitespace = types.window = types.document = function( zero ){
				return zero;
			};

			return function( el, nocash, doc ){
				if( el && el.$family && el.uniqueNumber ) return el;
				var type = typeOf(el);
				return (types[type]) ? types[type](el, nocash, doc || document) : null;
			};

		})()

	});

	if( window.$ == null ) Window.implement('$', function( el, nc ){
		return document.id(el, nc, this.document);
	});

	Window.implement({

		getDocument: function(){
			return this.document;
		},

		getWindow: function(){
			return this;
		}

	});

	[Document, Element].invoke('implement', {

		getElements: function( expression ){
			return Slick.search(this, expression, new Elements);
		},

		getElement: function( expression ){
			return document.id(Slick.find(this, expression));
		}

	});

	var contains = {contains: function( element ){
		return Slick.contains(this, element);
	}};

	if( !document.contains ) Document.implement(contains);
	if( !document.createElement('div').contains ) Element.implement(contains);


	// tree walking

	var injectCombinator = function( expression, combinator ){
		if( !expression ) return combinator;

		expression = Object.clone(Slick.parse(expression));

		var expressions = expression.expressions;
		for( var i = expressions.length; i--; )
			expressions[i][0].combinator = combinator;

		return expression;
	};

	Object.forEach({
		getNext: '~',
		getPrevious: '!~',
		getParent: '!'
	}, function( combinator, method ){
		Element.implement(method, function( expression ){
			return this.getElement(injectCombinator(expression, combinator));
		});
	});

	Object.forEach({
		getAllNext: '~',
		getAllPrevious: '!~',
		getSiblings: '~~',
		getChildren: '>',
		getParents: '!'
	}, function( combinator, method ){
		Element.implement(method, function( expression ){
			return this.getElements(injectCombinator(expression, combinator));
		});
	});

	Element.implement({

		getFirst: function( expression ){
			return document.id(Slick.search(this, injectCombinator(expression, '>'))[0]);
		},

		getLast: function( expression ){
			return document.id(Slick.search(this, injectCombinator(expression, '>')).getLast());
		},

		getWindow: function(){
			return this.ownerDocument.window;
		},

		getDocument: function(){
			return this.ownerDocument;
		},

		getElementById: function( id ){
			return document.id(Slick.find(this, '#' + ('' + id).replace(/(\W)/g, '\\$1')));
		},

		match: function( expression ){
			return !expression || Slick.match(this, expression);
		}

	});


	if( window.$$ == null ) Window.implement('$$', function( selector ){
		if( arguments.length == 1 ){
			if( typeof selector == 'string' ) return Slick.search(this.document, selector, new Elements); else if( Type.isEnumerable(selector) ) return new Elements(selector);
		}
		return new Elements(arguments);
	});

	// Inserters

	var inserters = {

		before: function( context, element ){
			var parent = element.parentNode;
			if( parent ) parent.insertBefore(context, element);
		},

		after: function( context, element ){
			var parent = element.parentNode;
			if( parent ) parent.insertBefore(context, element.nextSibling);
		},

		bottom: function( context, element ){
			element.appendChild(context);
		},

		top: function( context, element ){
			element.insertBefore(context, element.firstChild);
		}

	};

	inserters.inside = inserters.bottom;


	// getProperty / setProperty

	var propertyGetters = {}, propertySetters = {};

	// properties

	var properties = {};
	Array.forEach([
		'type', 'value', 'defaultValue', 'accessKey', 'cellPadding', 'cellSpacing', 'colSpan', 'frameBorder', 'rowSpan', 'tabIndex', 'useMap'
	], function( property ){
		properties[property.toLowerCase()] = property;
	});

	properties.html = 'innerHTML';
	properties.text = (document.createElement('div').textContent == null) ? 'innerText' : 'textContent';

	Object.forEach(properties, function( real, key ){
		propertySetters[key] = function( node, value ){
			node[real] = value;
		};
		propertyGetters[key] = function( node ){
			return node[real];
		};
	});

	// booleans

	var booleans = [
		'compact', 'nowrap', 'ismap', 'declare', 'noshade', 'checked', 'disabled', 'readOnly', 'multiple', 'selected', 'noresize', 'defer', 'defaultChecked', 'autofocus', 'controls', 'autoplay', 'loop'
	];

	var booleans = {};
	Array.forEach(booleans, function( boolean ){
		var lower = boolean.toLowerCase();
		booleans[lower] = boolean;
		propertySetters[lower] = function( node, value ){
			node[boolean] = !!value;
		};
		propertyGetters[lower] = function( node ){
			return !!node[boolean];
		};
	});

	// Special cases

	Object.append(propertySetters, {

		'class': function( node, value ){
			('className' in node) ? node.className = (value || '') : node.setAttribute('class', value);
		},

		'for': function( node, value ){
			('htmlFor' in node) ? node.htmlFor = value : node.setAttribute('for', value);
		},

		'style': function( node, value ){
			(node.style) ? node.style.cssText = value : node.setAttribute('style', value);
		},

		'value': function( node, value ){
			node.value = (value != null) ? value : '';
		}

	});

	propertyGetters['class'] = function( node ){
		return ('className' in node) ? node.className || null : node.getAttribute('class');
	};

	/* <webkit> */
	var el = document.createElement('button');
	// IE sets type as readonly and throws
	try {
		el.type = 'button';
	} catch( e ) {
	}
	if( el.type != 'button' ) propertySetters.type = function( node, value ){
		node.setAttribute('type', value);
	};
	el = null;
	/* </webkit> */

	/*<IE>*/
	var input = document.createElement('input');
	input.value = 't';
	input.type = 'submit';
	if( input.value != 't' ) propertySetters.type = function( node, type ){
		var value = node.value;
		node.type = type;
		node.value = value;
	};
	input = null;
	/*</IE>*/

	/* getProperty, setProperty */

	/* <ltIE9> */
	var pollutesGetAttribute = (function( div ){
		div.random = 'attribute';
		return (div.getAttribute('random') == 'attribute');
	})(document.createElement('div'));

	/* <ltIE9> */

	Element.implement({

		setProperty: function( name, value ){
			var setter = propertySetters[name.toLowerCase()];
			if( setter ){
				setter(this, value);
			} else{
				/* <ltIE9> */
				if( pollutesGetAttribute ) var attributeWhiteList = this.retrieve('$attributeWhiteList', {});
				/* </ltIE9> */

				if( value == null ){
					this.removeAttribute(name);
					/* <ltIE9> */
					if( pollutesGetAttribute ) delete attributeWhiteList[name];
					/* </ltIE9> */
				} else{
					this.setAttribute(name, '' + value);
					/* <ltIE9> */
					if( pollutesGetAttribute ) attributeWhiteList[name] = true;
					/* </ltIE9> */
				}
			}
			return this;
		},

		setProperties: function( attributes ){
			for( var attribute in attributes ) this.setProperty(attribute, attributes[attribute]);
			return this;
		},

		getProperty: function( name ){
			var getter = propertyGetters[name.toLowerCase()];
			if( getter ) return getter(this);
			/* <ltIE9> */
			if( pollutesGetAttribute ){
				var attr = this.getAttributeNode(name), attributeWhiteList = this.retrieve('$attributeWhiteList', {});
				if( !attr ) return null;
				if( attr.expando && !attributeWhiteList[name] ){
					var outer = this.outerHTML;
					// segment by the opening tag and find mention of attribute name
					if( outer.substr(0, outer.search(/\/?['"]?>(?![^<]*<['"])/)).indexOf(name) < 0 ) return null;
					attributeWhiteList[name] = true;
				}
			}
			/* </ltIE9> */
			var result = Slick.getAttribute(this, name);
			return (!result && !Slick.hasAttribute(this, name)) ? null : result;
		},

		getProperties: function(){
			var args = Array.from(arguments);
			return args.map(this.getProperty, this).associate(args);
		},

		removeProperty: function( name ){
			return this.setProperty(name, null);
		},

		removeProperties: function(){
			Array.each(arguments, this.removeProperty, this);
			return this;
		},

		set: function( prop, value ){
			var property = Element.Properties[prop];
			(property && property.set) ? property.set.call(this, value) : this.setProperty(prop, value);
		}.overloadSetter(),

		get: function( prop ){
			var property = Element.Properties[prop];
			return (property && property.get) ? property.get.apply(this) : this.getProperty(prop);
		}.overloadGetter(),

		erase: function( prop ){
			var property = Element.Properties[prop];
			(property && property.erase) ? property.erase.apply(this) : this.removeProperty(prop);
			return this;
		},

		hasClass: function( className ){
			return this.className.clean().contains(className, ' ');
		},

		addClass: function( className ){
			if( !this.hasClass(className) ) this.className = (this.className + ' ' + className).clean();
			return this;
		},

		removeClass: function( className ){
			this.className = this.className.replace(new RegExp('(^|\\s)' + className + '(?:\\s|$)'), '$1');
			return this;
		},

		toggleClass: function( className, force ){
			if( force == null ) force = !this.hasClass(className);
			return (force) ? this.addClass(className) : this.removeClass(className);
		},

		adopt: function(){
			var parent = this, fragment, elements = Array.flatten(arguments), length = elements.length;
			if( length > 1 ) parent = fragment = document.createDocumentFragment();

			for( var i = 0; i < length; i++ ){
				var element = document.id(elements[i], true);
				if( element ) parent.appendChild(element);
			}

			if( fragment ) this.appendChild(fragment);

			return this;
		},

		appendText: function( text, where ){
			return this.grab(this.getDocument().newTextNode(text), where);
		},

		grab: function( el, where ){
			inserters[where || 'bottom'](document.id(el, true), this);
			return this;
		},

		inject: function( el, where ){
			inserters[where || 'bottom'](this, document.id(el, true));
			return this;
		},

		replaces: function( el ){
			el = document.id(el, true);
			el.parentNode.replaceChild(this, el);
			return this;
		},

		wraps: function( el, where ){
			el = document.id(el, true);
			return this.replaces(el).grab(el, where);
		},

		getSelected: function(){
			this.selectedIndex; // Safari 3.2.1
			return new Elements(Array.from(this.options).filter(function( option ){
				return option.selected;
			}));
		},

		toQueryString: function(){
			var queryString = [];
			this.getElements('input, select, textarea').each(function( el ){
				var type = el.type;
				if( !el.name || el.disabled || type == 'submit' || type == 'reset' || type == 'file' || type == 'image' ) return;

				var value = (el.get('tag') == 'select') ? el.getSelected().map(function( opt ){
					// IE
					return document.id(opt).get('value');
				}) : ((type == 'radio' || type == 'checkbox') && !el.checked) ? null : el.get('value');

				Array.from(value).each(function( val ){
					if( typeof val != 'undefined' ) queryString.push(encodeURIComponent(el.name) + '=' + encodeURIComponent(val));
				});
			});
			return queryString.join('&');
		}

	});

	var collected = {}, storage = {};

	var get = function( uid ){
		return (storage[uid] || (storage[uid] = {}));
	};

	var clean = function( item ){
		var uid = item.uniqueNumber;
		if( item.removeEvents ) item.removeEvents();
		if( item.clearAttributes ) item.clearAttributes();
		if( uid != null ){
			delete collected[uid];
			delete storage[uid];
		}
		return item;
	};

	var formProps = {input: 'checked', option: 'selected', textarea: 'value'};

	Element.implement({

		destroy: function(){
			var children = clean(this).getElementsByTagName('*');
			Array.each(children, clean);
			Element.dispose(this);
			return null;
		},

		empty: function(){
			Array.from(this.childNodes).each(Element.dispose);
			return this;
		},

		dispose: function(){
			return (this.parentNode) ? this.parentNode.removeChild(this) : this;
		},

		clone: function( contents, keepid ){
			contents = contents !== false;
			var clone = this.cloneNode(contents), ce = [clone], te = [this], i;

			if( contents ){
				ce.append(Array.from(clone.getElementsByTagName('*')));
				te.append(Array.from(this.getElementsByTagName('*')));
			}

			for( i = ce.length; i--; ){
				var node = ce[i], element = te[i];
				if( !keepid ) node.removeAttribute('id');
				/*<ltIE9>*/
				if( node.clearAttributes ){
					node.clearAttributes();
					node.mergeAttributes(element);
					node.removeAttribute('uniqueNumber');
					if( node.options ){
						var no = node.options, eo = element.options;
						for( var j = no.length; j--; ) no[j].selected = eo[j].selected;
					}
				}
				/*</ltIE9>*/
				var prop = formProps[element.tagName.toLowerCase()];
				if( prop && element[prop] ) node[prop] = element[prop];
			}

			/*<ltIE9>*/
			if( Browser.ie ){
				var co = clone.getElementsByTagName('object'), to = this.getElementsByTagName('object');
				for( i = co.length; i--; ) co[i].outerHTML = to[i].outerHTML;
			}
			/*</ltIE9>*/
			return document.id(clone);
		}

	});

	[Element, Window, Document].invoke('implement', {

		addListener: function( type, fn ){
			if( type == 'unload' ){
				var old = fn, self = this;
				fn = function(){
					self.removeListener('unload', fn);
					old();
				};
			} else{
				collected[Slick.uidOf(this)] = this;
			}
			if( this.addEventListener ) this.addEventListener(type, fn, !!arguments[2]); else this.attachEvent('on' + type, fn);
			return this;
		},

		removeListener: function( type, fn ){
			if( this.removeEventListener ) this.removeEventListener(type, fn, !!arguments[2]); else this.detachEvent('on' + type, fn);
			return this;
		},

		retrieve: function( property, dflt ){
			var storage = get(Slick.uidOf(this)), prop = storage[property];
			if( dflt != null && prop == null ) prop = storage[property] = dflt;
			return prop != null ? prop : null;
		},

		store: function( property, value ){
			var storage = get(Slick.uidOf(this));
			storage[property] = value;
			return this;
		},

		eliminate: function( property ){
			var storage = get(Slick.uidOf(this));
			delete storage[property];
			return this;
		}

	});

	/*<ltIE9>*/
	if( window.attachEvent && !window.addEventListener ) window.addListener('unload', function(){
		Object.each(collected, clean);
		if( window.CollectGarbage ) CollectGarbage();
	});
	/*</ltIE9>*/

	Element.Properties = {};


	Element.Properties.style = {

		set: function( style ){
			this.style.cssText = style;
		},

		get: function(){
			return this.style.cssText;
		},

		erase: function(){
			this.style.cssText = '';
		}

	};

	Element.Properties.tag = {

		get: function(){
			return this.tagName.toLowerCase();
		}

	};

	Element.Properties.html = {

		set: function( html ){
			if( html == null ) html = ''; else if( typeOf(html) == 'array' ) html = html.join('');
			this.innerHTML = html;
		},

		erase: function(){
			this.innerHTML = '';
		}

	};

	/*<ltIE9>*/
	// technique by jdbarlett - http://jdbartlett.com/innershiv/
	var div = document.createElement('div');
	div.innerHTML = '<nav></nav>';
	var supportsHTML5Elements = (div.childNodes.length == 1);
	if( !supportsHTML5Elements ){
		var tags = 'abbr article aside audio canvas datalist details figcaption figure footer header hgroup mark meter nav output progress section summary time video'.split(' '), fragment = document.createDocumentFragment(), l = tags.length;
		while( l-- ) fragment.createElement(tags[l]);
	}
	div = null;
	/*</ltIE9>*/

	/*<IE>*/
	var supportsTableInnerHTML = Function.attempt(function(){
		var table = document.createElement('table');
		table.innerHTML = '<tr><td></td></tr>';
		return true;
	});

	/*<ltFF4>*/
	var tr = document.createElement('tr'), html = '<td></td>';
	tr.innerHTML = html;
	var supportsTRInnerHTML = (tr.innerHTML == html);
	tr = null;
	/*</ltFF4>*/

	if( !supportsTableInnerHTML || !supportsTRInnerHTML || !supportsHTML5Elements ){

		Element.Properties.html.set = (function( set ){

			var translations = {
				table: [1, '<table>', '</table>'],
				select: [1, '<select>', '</select>'],
				tbody: [2, '<table><tbody>', '</tbody></table>'],
				tr: [3, '<table><tbody><tr>', '</tr></tbody></table>']
			};

			translations.thead = translations.tfoot = translations.tbody;

			return function( html ){
				var wrap = translations[this.get('tag')];
				if( !wrap && !supportsHTML5Elements ) wrap = [0, '', ''];
				if( !wrap ) return set.call(this, html);

				var level = wrap[0], wrapper = document.createElement('div'), target = wrapper;
				if( !supportsHTML5Elements ) fragment.appendChild(wrapper);
				wrapper.innerHTML = [wrap[1], html, wrap[2]].flatten().join('');
				while( level-- ) target = target.firstChild;
				this.empty().adopt(target.childNodes);
				if( !supportsHTML5Elements ) fragment.removeChild(wrapper);
				wrapper = null;
			};

		})(Element.Properties.html.set);
	}
	/*</IE>*/

	/*<ltIE9>*/
	var testForm = document.createElement('form');
	testForm.innerHTML = '<select><option>s</option></select>';

	if( testForm.firstChild.value != 's' ) Element.Properties.value = {

		set: function( value ){
			var tag = this.get('tag');
			if( tag != 'select' ) return this.setProperty('value', value);
			var options = this.getElements('option');
			for( var i = 0; i < options.length; i++ ){
				var option = options[i], attr = option.getAttributeNode('value'), optionValue = (attr && attr.specified) ? option.value : option.get('text');
				if( optionValue == value ) return option.selected = true;
			}
		},

		get: function(){
			var option = this, tag = option.get('tag');

			if( tag != 'select' && tag != 'option' ) return this.getProperty('value');

			if( tag == 'select' && !(option = option.getSelected()[0]) ) return '';

			var attr = option.getAttributeNode('value');
			return (attr && attr.specified) ? option.value : option.get('text');
		}

	};
	testForm = null;
	/*</ltIE9>*/

	/*<IE>*/
	if( document.createElement('div').getAttributeNode('id') ) Element.Properties.id = {
		set: function( id ){
			this.id = this.getAttributeNode('id').value = id;
		},
		get: function(){
			return this.id || null;
		},
		erase: function(){
			this.id = this.getAttributeNode('id').value = '';
		}
	};
	/*</IE>*/

})();


/*
 ---

 name: Class

 description: Contains the Class Function for easily creating, extending, and implementing reusable Classes.

 license: MIT-style license.

 requires: [Array, String, Function, Number]

 provides: Class

 ...
 */

(function(){

	var Class = this.Class = new Type('Class', function( params ){
		if( instanceOf(params, Function) ) params = {initialize: params};

		var newClass = function(){
			reset(this);
			if( newClass.$prototyping ) return this;
			this.$caller = null;
			var value = (this.initialize) ? this.initialize.apply(this, arguments) : this;
			this.$caller = this.caller = null;
			return value;
		}.extend(this).implement(params);

		newClass.$constructor = Class;
		newClass.prototype.$constructor = newClass;
		newClass.prototype.parent = parent;

		return newClass;
	});

	var parent = function(){
		if( !this.$caller ) throw new Error('The method "parent" cannot be called.');
		var name = this.$caller.$name, parent = this.$caller.$owner.parent, previous = (parent) ? parent.prototype[name] : null;
		if( !previous ) throw new Error('The method "' + name + '" has no parent.');
		return previous.apply(this, arguments);
	};

	var reset = function( object ){
		for( var key in object ){
			var value = object[key];
			switch( typeOf(value) ){
				case 'object':
					var F = function(){
					};
					F.prototype = value;
					object[key] = reset(new F);
					break;
				case 'array':
					object[key] = value.clone();
					break;
			}
		}
		return object;
	};

	var wrap = function( self, key, method ){
		if( method.$origin ) method = method.$origin;
		var wrapper = function(){
			if( method.$protected && this.$caller == null ) throw new Error('The method "' + key + '" cannot be called.');
			var caller = this.caller, current = this.$caller;
			this.caller = current;
			this.$caller = wrapper;
			var result = method.apply(this, arguments);
			this.$caller = current;
			this.caller = caller;
			return result;
		}.extend({$owner: self, $origin: method, $name: key});
		return wrapper;
	};

	var implement = function( key, value, retain ){
		if( Class.Mutators.hasOwnProperty(key) ){
			value = Class.Mutators[key].call(this, value);
			if( value == null ) return this;
		}

		if( typeOf(value) == 'function' ){
			if( value.$hidden ) return this;
			this.prototype[key] = (retain) ? value : wrap(this, key, value);
		} else{
			Object.merge(this.prototype, key, value);
		}

		return this;
	};

	var getInstance = function( klass ){
		klass.$prototyping = true;
		var proto = new klass;
		delete klass.$prototyping;
		return proto;
	};

	Class.implement('implement', implement.overloadSetter());

	Class.Mutators = {

		Extends: function( parent ){
			this.parent = parent;
			this.prototype = getInstance(parent);
		},

		Implements: function( items ){
			Array.from(items).each(function( item ){
				var instance = new item;
				for( var key in instance ) implement.call(this, key, instance[key], true);
			}, this);
		}
	};

})();


/*
 ---

 name: Class.Extras

 description: Contains Utility Classes that can be implemented into your own Classes to ease the execution of many common tasks.

 license: MIT-style license.

 requires: Class

 provides: [Class.Extras, Chain, Events, Options]

 ...
 */

(function(){

	this.Chain = new Class({

		$chain: [],

		chain: function(){
			this.$chain.append(Array.flatten(arguments));
			return this;
		},

		callChain: function(){
			return (this.$chain.length) ? this.$chain.shift().apply(this, arguments) : false;
		},

		clearChain: function(){
			this.$chain.empty();
			return this;
		}

	});

	var removeOn = function( string ){
		return string.replace(/^on([A-Z])/, function( full, first ){
			return first.toLowerCase();
		});
	};

	this.Events = new Class({

		$events: {},

		addEvent: function( type, fn, internal ){
			type = removeOn(type);


			this.$events[type] = (this.$events[type] || []).include(fn);
			if( internal ) fn.internal = true;
			return this;
		},

		addEvents: function( events ){
			for( var type in events ) this.addEvent(type, events[type]);
			return this;
		},

		fireEvent: function( type, args, delay ){
			type = removeOn(type);
			var events = this.$events[type];
			if( !events ) return this;
			args = Array.from(args);
			events.each(function( fn ){
				if( delay ) fn.delay(delay, this, args); else fn.apply(this, args);
			}, this);
			return this;
		},

		removeEvent: function( type, fn ){
			type = removeOn(type);
			var events = this.$events[type];
			if( events && !fn.internal ){
				var index = events.indexOf(fn);
				if( index != -1 ) delete events[index];
			}
			return this;
		},

		removeEvents: function( events ){
			var type;
			if( typeOf(events) == 'object' ){
				for( type in events ) this.removeEvent(type, events[type]);
				return this;
			}
			if( events ) events = removeOn(events);
			for( type in this.$events ){
				if( events && events != type ) continue;
				var fns = this.$events[type];
				for( var i = fns.length; i--; ) if( i in fns ){
					this.removeEvent(type, fns[i]);
				}
			}
			return this;
		}

	});

	this.Options = new Class({

		setOptions: function(){
			var options = this.options = Object.merge.apply(null, [
				{},
				this.options
			].append(arguments));
			if( this.addEvent ) for( var option in options ){
				if( typeOf(options[option]) != 'function' || !(/^on[A-Z]/).test(option) ) continue;
				this.addEvent(option, options[option]);
				delete options[option];
			}
			return this;
		}

	});

})();


/*
 ---

 name: Request

 description: Powerful all purpose Request Class. Uses XMLHTTPRequest.

 license: MIT-style license.

 requires: [Object, Element, Chain, Events, Options, Browser]

 provides: Request

 ...
 */

(function(){

	var empty = function(){
		}, progressSupport = ('onprogress' in new Browser.Request);

	var Request = this.Request = new Class({

		Implements: [Chain, Events, Options],

		options: {/*
		 onRequest: function(){},
		 onLoadstart: function(event, xhr){},
		 onProgress: function(event, xhr){},
		 onComplete: function(){},
		 onCancel: function(){},
		 onSuccess: function(responseText, responseXML){},
		 onFailure: function(xhr){},
		 onException: function(headerName, value){},
		 onTimeout: function(){},
		 user: '',
		 password: '',*/
			url: '',
			data: '',
			headers: {
				'X-Requested-With': 'XMLHttpRequest',
				'Accept': 'text/javascript, text/html, application/xml, text/xml, */*'
			},
			async: true,
			format: false,
			method: 'post',
			link: 'ignore',
			isSuccess: null,
			emulation: true,
			urlEncoded: true,
			encoding: 'utf-8',
			evalScripts: false,
			evalResponse: false,
			timeout: 0,
			noCache: false
		},

		initialize: function( options ){
			this.xhr = new Browser.Request();
			this.setOptions(options);
			this.headers = this.options.headers;
		},

		onStateChange: function(){
			var xhr = this.xhr;
			if( xhr.readyState != 4 || !this.running ) return;
			this.running = false;
			this.status = 0;
			Function.attempt(function(){
				var status = xhr.status;
				this.status = (status == 1223) ? 204 : status;
			}.bind(this));
			xhr.onreadystatechange = empty;
			if( progressSupport ) xhr.onprogress = xhr.onloadstart = empty;
			clearTimeout(this.timer);

			this.response = {text: this.xhr.responseText || '', xml: this.xhr.responseXML};
			if( this.options.isSuccess.call(this, this.status) )
				this.success(this.response.text, this.response.xml); else
				this.failure();
		},

		isSuccess: function(){
			var status = this.status;
			return (status >= 200 && status < 300);
		},

		isRunning: function(){
			return !!this.running;
		},

		processScripts: function( text ){
			if( this.options.evalResponse || (/(ecma|java)script/).test(this.getHeader('Content-type')) ) return Browser.exec(text);
			return text.stripScripts(this.options.evalScripts);
		},

		success: function( text, xml ){
			this.onSuccess(this.processScripts(text), xml);
		},

		onSuccess: function(){
			this.fireEvent('complete', arguments).fireEvent('success', arguments).callChain();
		},

		failure: function(){
			this.onFailure();
		},

		onFailure: function(){
			this.fireEvent('complete').fireEvent('failure', this.xhr);
		},

		loadstart: function( event ){
			this.fireEvent('loadstart', [event, this.xhr]);
		},

		progress: function( event ){
			this.fireEvent('progress', [event, this.xhr]);
		},

		timeout: function(){
			this.fireEvent('timeout', this.xhr);
		},

		setHeader: function( name, value ){
			this.headers[name] = value;
			return this;
		},

		getHeader: function( name ){
			return Function.attempt(function(){
				return this.xhr.getResponseHeader(name);
			}.bind(this));
		},

		check: function(){
			if( !this.running ) return true;
			switch( this.options.link ){
				case 'cancel':
					this.cancel();
					return true;
				case 'chain':
					this.chain(this.caller.pass(arguments, this));
					return false;
			}
			return false;
		},

		send: function( options ){
			if( !this.check(options) ) return this;

			this.options.isSuccess = this.options.isSuccess || this.isSuccess;
			this.running = true;

			var type = typeOf(options);
			if( type == 'string' || type == 'element' ) options = {data: options};

			var old = this.options;
			options = Object.append({data: old.data, url: old.url, method: old.method}, options);
			var data = options.data, url = String(options.url), method = options.method.toLowerCase();

			switch( typeOf(data) ){
				case 'element':
					data = document.id(data).toQueryString();
					break;
				case 'object':
				case 'hash':
					data = Object.toQueryString(data);
			}

			if( this.options.format ){
				var format = 'format=' + this.options.format;
				data = (data) ? format + '&' + data : format;
			}

			if( this.options.emulation && !['get', 'post'].contains(method) ){
				var _method = '_method=' + method;
				data = (data) ? _method + '&' + data : _method;
				method = 'post';
			}

			if( this.options.urlEncoded && ['post', 'put'].contains(method) ){
				var encoding = (this.options.encoding) ? '; charset=' + this.options.encoding : '';
				this.headers['Content-type'] = 'application/x-www-form-urlencoded' + encoding;
			}

			if( !url ) url = document.location.pathname;

			var trimPosition = url.lastIndexOf('/');
			if( trimPosition > -1 && (trimPosition = url.indexOf('#')) > -1 ) url = url.substr(0, trimPosition);

			if( this.options.noCache )
				url += (url.contains('?') ? '&' : '?') + String.uniqueID();

			if( data && method == 'get' ){
				url += (url.contains('?') ? '&' : '?') + data;
				data = null;
			}

			var xhr = this.xhr;
			if( progressSupport ){
				xhr.onloadstart = this.loadstart.bind(this);
				xhr.onprogress = this.progress.bind(this);
			}

			xhr.open(method.toUpperCase(), url, this.options.async, this.options.user, this.options.password);
			if( this.options.user && 'withCredentials' in xhr ) xhr.withCredentials = true;

			xhr.onreadystatechange = this.onStateChange.bind(this);

			Object.each(this.headers, function( value, key ){
				try {
					xhr.setRequestHeader(key, value);
				} catch( e ) {
					this.fireEvent('exception', [key, value]);
				}
			}, this);

			this.fireEvent('request');
			xhr.send(data);
			if( !this.options.async ) this.onStateChange(); else if( this.options.timeout ) this.timer = this.timeout.delay(this.options.timeout, this);
			return this;
		},

		cancel: function(){
			if( !this.running ) return this;
			this.running = false;
			var xhr = this.xhr;
			xhr.abort();
			clearTimeout(this.timer);
			xhr.onreadystatechange = empty;
			if( progressSupport ) xhr.onprogress = xhr.onloadstart = empty;
			this.xhr = new Browser.Request();
			this.fireEvent('cancel');
			return this;
		}

	});

	var methods = {};
	['get', 'post', 'put', 'delete', 'GET', 'POST', 'PUT', 'DELETE'].each(function( method ){
		methods[method] = function( data ){
			var object = {
				method: method
			};
			if( data != null ) object.data = data;
			return this.send(object);
		};
	});

	Request.implement(methods);

	Element.Properties.send = {

		set: function( options ){
			var send = this.get('send').cancel();
			send.setOptions(options);
			return this;
		},

		get: function(){
			var send = this.retrieve('send');
			if( !send ){
				send = new Request({
					data: this, link: 'cancel', method: this.get('method') || 'post', url: this.get('action')
				});
				this.store('send', send);
			}
			return send;
		}

	};

	Element.implement({

		send: function( url ){
			var sender = this.get('send');
			sender.send({data: this, url: url || sender.options.url});
			return this;
		}

	});

})();


/*
 ---

 name: Request.HTML

 description: Extends the basic Request Class with additional methods for interacting with HTML responses.

 license: MIT-style license.

 requires: [Element, Request]

 provides: Request.HTML

 ...
 */

Request.HTML = new Class({

	Extends: Request,

	options: {
		update: false,
		append: false,
		evalScripts: true,
		filter: false,
		headers: {
			Accept: 'text/html, application/xml, text/xml, */*'
		}
	},

	success: function( text ){
		var options = this.options, response = this.response;

		response.html = text.stripScripts(function( script ){
			response.javascript = script;
		});

		var match = response.html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
		if( match ) response.html = match[1];
		var temp = new Element('div').set('html', response.html);

		response.tree = temp.childNodes;
		response.elements = temp.getElements(options.filter || '*');

		if( options.filter ) response.tree = response.elements;
		if( options.update ){
			var update = document.id(options.update).empty();
			if( options.filter ) update.adopt(response.elements); else update.set('html', response.html);
		} else if( options.append ){
			var append = document.id(options.append);
			if( options.filter ) response.elements.reverse().inject(append); else append.adopt(temp.getChildren());
		}
		if( options.evalScripts ) Browser.exec(response.javascript);

		this.onSuccess(response.tree, response.elements, response.html, response.javascript);
	}

});

Element.Properties.load = {

	set: function( options ){
		var load = this.get('load').cancel();
		load.setOptions(options);
		return this;
	},

	get: function(){
		var load = this.retrieve('load');
		if( !load ){
			load = new Request.HTML({data: this, link: 'cancel', update: this, method: 'get'});
			this.store('load', load);
		}
		return load;
	}

};

//Element.implement({
//
//	load: function(){
//		this.get('load').send(Array.link(arguments, {data: Type.isObject, url: Type.isString}));
//		return this;
//	}
//
//});


/*
 ---

 name: JSON

 description: JSON encoder and decoder.

 license: MIT-style license.

 SeeAlso: <http://www.json.org/>

 requires: [Array, String, Number, Function]

 provides: JSON

 ...
 */

if( typeof JSON == 'undefined' ) this.JSON = {};


(function(){

	var special = {'\b': '\\b', '\t': '\\t', '\n': '\\n', '\f': '\\f', '\r': '\\r', '"': '\\"', '\\': '\\\\'};

	var escape = function( chr ){
		return special[chr] || '\\u' + ('0000' + chr.charCodeAt(0).toString(16)).slice(-4);
	};

	JSON.validate = function( string ){
		string = string.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').replace(/(?:^|:|,)(?:\s*\[)+/g, '');

		return (/^[\],:{}\s]*$/).test(string);
	};

	JSON.encode = JSON.stringify ? function( obj ){
		return JSON.stringify(obj);
	} : function( obj ){
		if( obj && obj.toJSON ) obj = obj.toJSON();

		switch( typeOf(obj) ){
			case 'string':
				return '"' + obj.replace(/[\x00-\x1f\\"]/g, escape) + '"';
			case 'array':
				return '[' + obj.map(JSON.encode).clean() + ']';
			case 'object':
			case 'hash':
				var string = [];
				Object.each(obj, function( value, key ){
					var json = JSON.encode(value);
					if( json ) string.push(JSON.encode(key) + ':' + json);
				});
				return '{' + string + '}';
			case 'number':
			case 'boolean':
				return '' + obj;
			case 'null':
				return 'null';
		}

		return null;
	};

	JSON.decode = function( string, secure ){
		if( !string || typeOf(string) != 'string' ) return null;

		if( secure || JSON.secure ){
			if( JSON.parse ) return JSON.parse(string);
			if( !JSON.validate(string) ) throw new Error('JSON could not decode the input; security is enabled and the value is not secure.');
		}

		return eval('(' + string + ')');
	};

})();


/*
 ---

 name: Request.JSON

 description: Extends the basic Request Class with additional methods for sending and receiving JSON data.

 license: MIT-style license.

 requires: [Request, JSON]

 provides: Request.JSON

 ...
 */

Request.JSON = new Class({

	Extends: Request,

	options: {
		/*onError: function(text, error){},*/
		secure: true
	},

	initialize: function( options ){
		this.parent(options);
		Object.append(this.headers, {
			'Accept': 'application/json',
			'X-Request': 'JSON'
		});
	},

	success: function( text ){
		var json;
		try {
			json = this.response.json = JSON.decode(text, this.options.secure);
		} catch( error ) {
			this.fireEvent('error', [text, error]);
			return;
		}
		if( json == null ) this.onFailure(); else this.onSuccess(json, text);
	}

});


define("mootools", function(){});

/**
 * @license Knockout.Punches
 * Enhanced binding syntaxes for Knockout 3+
 * (c) Michael Best
 * License: MIT (http://www.opensource.org/licenses/mit-license.php)
 * Version 0.3.0
 */
(function (factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD. Register as an anonymous module.
		define('lib/knockout/knockout.punches',['knockout'], factory);
	} else {
		// Browser globals
		factory(ko);
	}
}(function(ko) {
// Add a preprocess funtion to a binding handler.
	function setBindingPreprocessor(bindingKeyOrHandler, preprocessFn) {
		return chainPreprocessor(getOrCreateHandler(bindingKeyOrHandler), 'preprocess', preprocessFn);
	}

// These utility functions are separated out because they're also used by
// preprocessBindingProperty

// Get the binding handler or create a new, empty one
	function getOrCreateHandler(bindingKeyOrHandler) {
		return typeof bindingKeyOrHandler === 'object' ? bindingKeyOrHandler :
			(ko.getBindingHandler(bindingKeyOrHandler) || (ko.bindingHandlers[bindingKeyOrHandler] = {}));
	}
// Add a preprocess function
	function chainPreprocessor(obj, prop, fn) {
		if (obj[prop]) {
			// If the handler already has a preprocess function, chain the new
			// one after the existing one. If the previous function in the chain
			// returns a falsy value (to remove the binding), the chain ends. This
			// method allows each function to modify and return the binding value.
			var previousFn = obj[prop];
			obj[prop] = function(value, binding, addBinding) {
				value = previousFn.call(this, value, binding, addBinding);
				if (value)
					return fn.call(this, value, binding, addBinding);
			};
		} else {
			obj[prop] = fn;
		}
		return obj;
	}

// Add a preprocessNode function to the binding provider. If a
// function already exists, chain the new one after it. This calls
// each function in the chain until one modifies the node. This
// method allows only one function to modify the node.
	function setNodePreprocessor(preprocessFn) {
		var provider = ko.bindingProvider.instance;
		if (provider.preprocessNode) {
			var previousPreprocessFn = provider.preprocessNode;
			provider.preprocessNode = function(node) {
				var newNodes = previousPreprocessFn.call(this, node);
				if (!newNodes)
					newNodes = preprocessFn.call(this, node);
				return newNodes;
			};
		} else {
			provider.preprocessNode = preprocessFn;
		}
	}

	function setBindingHandlerCreator(matchRegex, callbackFn) {
		var oldGetHandler = ko.getBindingHandler;
		ko.getBindingHandler = function(bindingKey) {
			var match;
			return oldGetHandler(bindingKey) || ((match = bindingKey.match(matchRegex)) && callbackFn(match, bindingKey));
		};
	}

// Create "punches" object and export utility functions
	var ko_punches = ko.punches = {
		utils: {
			setBindingPreprocessor: setBindingPreprocessor,
			setNodePreprocessor: setNodePreprocessor,
			setBindingHandlerCreator: setBindingHandlerCreator
		}
	};

	ko_punches.enableAll = function () {
		// Enable interpolation markup
		enableInterpolationMarkup();

		// Enable auto-namspacing of attr, css, event, and style
		enableAutoNamespacedSyntax('attr');
		enableAutoNamespacedSyntax('css');
		enableAutoNamespacedSyntax('event');
		enableAutoNamespacedSyntax('style');

		// Enable filter syntax for text and attr
		enableTextFilter('text');
		setDefaultNamespacedBindingPreprocessor('attr', filterPreprocessor);

		// Enable wrapped callbacks for click, submit, event, optionsAfterRender, and template options
		enableWrappedCallback('click');
		enableWrappedCallback('submit');
		enableWrappedCallback('optionsAfterRender');
		setDefaultNamespacedBindingPreprocessor('event', wrappedCallbackPreprocessor);
		setBindingPropertyPreprocessor('template', 'beforeRemove', wrappedCallbackPreprocessor);
		setBindingPropertyPreprocessor('template', 'afterAdd', wrappedCallbackPreprocessor);
		setBindingPropertyPreprocessor('template', 'afterRender', wrappedCallbackPreprocessor);
	};
// Convert input in the form of `expression | filter1 | filter2:arg1:arg2` to a function call format
// with filters accessed as ko.filters.filter1, etc.
	function filterPreprocessor(input) {
		// Check if the input contains any | characters; if not, just return
		if (input.indexOf('|') === -1)
			return input;

		// Split the input into tokens, in which | and : are individual tokens, quoted strings are ignored, and all tokens are space-trimmed
		var tokens = input.match(/"([^"\\]|\\.)*"|'([^'\\]|\\.)*'|\|\||[|:]|[^\s|:"'][^|:"']*[^\s|:"']|[^\s|:"']/g);
		if (tokens && tokens.length > 1) {
			// Append a line so that we don't need a separate code block to deal with the last item
			tokens.push('|');
			input = tokens[0];
			var lastToken, token, inFilters = false, nextIsFilter = false;
			for (var i = 1, token; token = tokens[i]; ++i) {
				if (token === '|') {
					if (inFilters) {
						if (lastToken === ':')
							input += "undefined";
						input += ')';
					}
					nextIsFilter = true;
					inFilters = true;
				} else {
					if (nextIsFilter) {
						input = "ko.filters['" + token + "'](" + input;
					} else if (inFilters && token === ':') {
						if (lastToken === ':')
							input += "undefined";
						input += ",";
					} else {
						input += token;
					}
					nextIsFilter = false;
				}
				lastToken = token;
			}
		}

		return input;
	}

// Set the filter preprocessor for a specific binding
	function enableTextFilter(bindingKeyOrHandler) {
		setBindingPreprocessor(bindingKeyOrHandler, filterPreprocessor);
	}

	var filters = {};

// Convert value to uppercase
	filters.uppercase = function(value) {
		return String.prototype.toUpperCase.call(value);
	};

// Convert value to lowercase
	filters.lowercase = function(value) {
		return String.prototype.toLowerCase.call(value);
	};

// Return default value if the input value is blank or null
	filters['default'] = function(value, defaultValue) {
		return (value === '' || value == null) ? defaultValue : value;
	};

// Return the value with the search string replaced with the replacement string
	filters.replace = function(value, search, replace) {
		return String.prototype.replace.call(value, search, replace);
	};

	filters.fit = function(value, length, replacement, trimWhere) {
		if (length && ('' + value).length > length) {
			replacement = '' + (replacement || '...');
			length = length - replacement.length;
			value = '' + value;
			switch (trimWhere) {
				case 'left':
					return replacement + value.slice(-length);
				case 'middle':
					var leftLen = Math.ceil(length / 2);
					return value.substr(0, leftLen) + replacement + value.slice(leftLen-length);
				default:
					return value.substr(0, length) + replacement;
			}
		} else {
			return value;
		}
	};

// Convert a model object to JSON
	filters.json = function(rootObject, space, replacer) {     // replacer and space are optional
		return ko.toJSON(rootObject, replacer, space);
	};

// Format a number using the browser's toLocaleString
	filters.number = function(value) {
		return (+value).toLocaleString();
	};

// Export the filters object for general access
	ko.filters = filters;

// Export the preprocessor functions
	ko_punches.textFilter = {
		preprocessor: filterPreprocessor,
		enableForBinding: enableTextFilter
	};
// Support dynamically-created, namespaced bindings. The binding key syntax is
// "namespace.binding". Within a certain namespace, we can dynamically create the
// handler for any binding. This is particularly useful for bindings that work
// the same way, but just set a different named value, such as for element
// attributes or CSS classes.
	var namespacedBindingMatch = /([^\.]+)\.(.+)/, namespaceDivider = '.';
	setBindingHandlerCreator(namespacedBindingMatch, function (match, bindingKey) {
		var namespace = match[1],
			namespaceHandler = ko.bindingHandlers[namespace];
		if (namespaceHandler) {
			var bindingName = match[2],
				handlerFn = namespaceHandler.getNamespacedHandler || defaultGetNamespacedHandler,
				handler = handlerFn.call(namespaceHandler, bindingName, namespace, bindingKey);
			ko.bindingHandlers[bindingKey] = handler;
			return handler;
		}
	});

// Knockout's built-in bindings "attr", "event", "css" and "style" include the idea of
// namespaces, representing it using a single binding that takes an object map of names
// to values. This default handler translates a binding of "namespacedName: value"
// to "namespace: {name: value}" to automatically support those built-in bindings.
	function defaultGetNamespacedHandler(name, namespace, namespacedName) {
		var handler = ko.utils.extend({}, this);
		function setHandlerFunction(funcName) {
			if (handler[funcName]) {
				handler[funcName] = function(element, valueAccessor) {
					function subValueAccessor() {
						var result = {};
						result[name] = valueAccessor();
						return result;
					}
					var args = Array.prototype.slice.call(arguments, 0);
					args[1] = subValueAccessor;
					return ko.bindingHandlers[namespace][funcName].apply(this, args);
				};
			}
		}
		// Set new init and update functions that wrap the originals
		setHandlerFunction('init');
		setHandlerFunction('update');
		// Clear any preprocess function since preprocessing of the new binding would need to be different
		if (handler.preprocess)
			handler.preprocess = null;
		if (ko.virtualElements.allowedBindings[namespace])
			ko.virtualElements.allowedBindings[namespacedName] = true;
		return handler;
	}

// Sets a preprocess function for every generated namespace.x binding. This can
// be called multiple times for the same binding, and the preprocess functions will
// be chained. If the binding has a custom getNamespacedHandler method, make sure that
// it's set before this function is used.
	function setDefaultNamespacedBindingPreprocessor(namespace, preprocessFn) {
		var handler = ko.getBindingHandler(namespace);
		if (handler) {
			var previousHandlerFn = handler.getNamespacedHandler || defaultGetNamespacedHandler;
			handler.getNamespacedHandler = function() {
				return setBindingPreprocessor(previousHandlerFn.apply(this, arguments), preprocessFn);
			};
		}
	}

	function autoNamespacedPreprocessor(value, binding, addBinding) {
		if (value.charAt(0) !== "{")
			return value;

		// Handle two-level binding specified as "binding: {key: value}" by parsing inner
		// object and converting to "binding.key: value"
		var subBindings = ko.expressionRewriting.parseObjectLiteral(value);
		ko.utils.arrayForEach(subBindings, function(keyValue) {
			addBinding(binding + namespaceDivider + keyValue.key, keyValue.value);
		});
	}

// Set the namespaced preprocessor for a specific binding
	function enableAutoNamespacedSyntax(bindingKeyOrHandler) {
		setBindingPreprocessor(bindingKeyOrHandler, autoNamespacedPreprocessor);
	}

// Export the preprocessor functions
	ko_punches.namespacedBinding = {
		defaultGetHandler: defaultGetNamespacedHandler,
		setDefaultBindingPreprocessor: setDefaultNamespacedBindingPreprocessor,
		preprocessor: autoNamespacedPreprocessor,
		enableForBinding: enableAutoNamespacedSyntax
	};
// Wrap a callback function in an anonymous function so that it is called with the appropriate
// "this" value.
	function wrappedCallbackPreprocessor(val) {
		// Matches either an isolated identifier or something ending with a property accessor
		if (/^([$_a-z][$\w]*|.+(\.\s*[$_a-z][$\w]*|\[.+\]))$/i.test(val)) {
			return 'function(_x,_y,_z){return(' + val + ')(_x,_y,_z);}';
		} else {
			return val;
		}
	}

// Set the wrappedCallback preprocessor for a specific binding
	function enableWrappedCallback(bindingKeyOrHandler) {
		setBindingPreprocessor(bindingKeyOrHandler, wrappedCallbackPreprocessor);
	}

// Export the preprocessor functions
	ko_punches.wrappedCallback = {
		preprocessor: wrappedCallbackPreprocessor,
		enableForBinding: enableWrappedCallback
	};
// Attach a preprocess function to a specific property of a binding. This allows you to
// preprocess binding "options" using the same preprocess functions that work for bindings.
	function setBindingPropertyPreprocessor(bindingKeyOrHandler, property, preprocessFn) {
		var handler = getOrCreateHandler(bindingKeyOrHandler);
		if (!handler._propertyPreprocessors) {
			// Initialize the binding preprocessor
			chainPreprocessor(handler, 'preprocess', propertyPreprocessor);
			handler._propertyPreprocessors = {};
		}
		// Add the property preprocess function
		chainPreprocessor(handler._propertyPreprocessors, property, preprocessFn);
	}

// In order to preprocess a binding property, we have to preprocess the binding itself.
// This preprocess function splits up the binding value and runs each property's preprocess
// function if it's set.
	function propertyPreprocessor(value, binding, addBinding) {
		if (value.charAt(0) !== "{")
			return value;

		var subBindings = ko.expressionRewriting.parseObjectLiteral(value),
			resultStrings = [],
			propertyPreprocessors = this._propertyPreprocessors || {};
		ko.utils.arrayForEach(subBindings, function(keyValue) {
			var prop = keyValue.key, propVal = keyValue.value;
			if (propertyPreprocessors[prop]) {
				propVal = propertyPreprocessors[prop](propVal, prop, addBinding);
			}
			if (propVal) {
				resultStrings.push("'" + prop + "':" + propVal);
			}
		});
		return "{" + resultStrings.join(",") + "}";
	}

// Export the preprocessor functions
	ko_punches.preprocessBindingProperty = {
		setPreprocessor: setBindingPropertyPreprocessor
	};
// Wrap an expression in an anonymous function so that it is called when the event happens
	function makeExpressionCallbackPreprocessor(args) {
		return function expressionCallbackPreprocessor(val) {
			return 'function('+args+'){return(' + val + ');}';
		};
	}

	var eventExpressionPreprocessor = makeExpressionCallbackPreprocessor("$data,$event");

// Set the expressionCallback preprocessor for a specific binding
	function enableExpressionCallback(bindingKeyOrHandler, args) {
		var args = Array.prototype.slice.call(arguments, 1).join();
		setBindingPreprocessor(bindingKeyOrHandler, makeExpressionCallbackPreprocessor(args));
	}

// Export the preprocessor functions
	ko_punches.expressionCallback = {
		makePreprocessor: makeExpressionCallbackPreprocessor,
		eventPreprocessor: eventExpressionPreprocessor,
		enableForBinding: enableExpressionCallback
	};

// Create an "on" namespace for events to use the expression method
	ko.bindingHandlers.on = {
		getNamespacedHandler: function(eventName) {
			var handler = ko.getBindingHandler('event' + namespaceDivider + eventName);
			return setBindingPreprocessor(handler, eventExpressionPreprocessor);
		}
	};
// Performance comparison at http://jsperf.com/markup-interpolation-comparison
	function parseInterpolationMarkup(textToParse, outerTextCallback, expressionCallback) {
		function innerParse(text) {
			var innerMatch = text.match(/^([\s\S]*?)}}([\s\S]*)\{\{([\s\S]*)$/);
			if (innerMatch) {
				expressionCallback(innerMatch[1]);
				outerParse(innerMatch[2]);
				expressionCallback(innerMatch[3]);
			} else {
				expressionCallback(text);
			}
		}
		function outerParse(text) {
			var outerMatch = text.match(/^([\s\S]*?)\{\{([\s\S]*)}}([\s\S]*)$/);
			if (outerMatch) {
				outerTextCallback(outerMatch[1]);
				innerParse(outerMatch[2]);
				outerTextCallback(outerMatch[3]);
			} else {
				outerTextCallback(text);
			}
		}
		outerParse(textToParse);
	}

	function interpolationMarkupPreprocessor(node) {
		// only needs to work with text nodes
		if (node.nodeType === 3 && node.nodeValue && node.nodeValue.indexOf('{{') !== -1) {
			var nodes = [];
			function addTextNode(text) {
				if (text)
					nodes.push(document.createTextNode(text));
			}
			function wrapExpr(expressionText) {
				if (expressionText)
					nodes.push.apply(nodes, ko_punches_interpolationMarkup.wrapExpresssion(expressionText));
			}
			parseInterpolationMarkup(node.nodeValue, addTextNode, wrapExpr)

			if (nodes.length > 1) {
				if (node.parentNode) {
					for (var i = 0; i < nodes.length; i++) {
						node.parentNode.insertBefore(nodes[i], node);
					}
					node.parentNode.removeChild(node);
				}
				return nodes;
			}
		}
	}

	function wrapExpresssion(expressionText) {
		return [
			document.createComment("ko text:" + expressionText),
			document.createComment("/ko")
		];
	};

	function enableInterpolationMarkup() {
		setNodePreprocessor(interpolationMarkupPreprocessor);
	}

// Export the preprocessor functions
	var ko_punches_interpolationMarkup = ko_punches.interpolationMarkup = {
		preprocessor: interpolationMarkupPreprocessor,
		enable: enableInterpolationMarkup,
		wrapExpresssion: wrapExpresssion
	};


	var dataBind = 'data-bind';
	function attributeInterpolationMarkerPreprocessor(node) {
		if (node.nodeType === 1 && node.attributes.length) {
			var dataBindAttribute = node.getAttribute(dataBind);
			for (var attrs = node.attributes, i = attrs.length-1; i >= 0; --i) {
				var attr = attrs[i];
				if (attr.specified && attr.name != dataBind && attr.value.indexOf('{{') !== -1) {
					var parts = [], attrBinding = 0;
					function addText(text) {
						if (text)
							parts.push('"' + text.replace(/"/g, '\\"') + '"');
					}
					function addExpr(expressionText) {
						if (expressionText) {
							attrBinding = expressionText;
							parts.push('ko.unwrap(' + expressionText + ')');
						}
					}
					parseInterpolationMarkup(attr.value, addText, addExpr);

					if (parts.length > 1) {
						attrBinding = '""+' + parts.join('+');
					}

					if (attrBinding) {
						attrBinding = 'attr.' + attr.name + ':' + attrBinding;
						if (!dataBindAttribute) {
							dataBindAttribute = attrBinding
						} else {
							dataBindAttribute += ',' + attrBinding;
						}
						node.setAttribute(dataBind, dataBindAttribute);
						node.removeAttributeNode(attr);
					}
				}
			}
		}
	}

	function enableAttributeInterpolationMarkup() {
		setNodePreprocessor(attributeInterpolationMarkerPreprocessor);
	}

	var ko_punches_attributeInterpolationMarkup = ko_punches.attributeInterpolationMarkup = {
		preprocessor: attributeInterpolationMarkerPreprocessor,
		enable: enableAttributeInterpolationMarkup
	};
}));
// moment.js
// version : 2.0.0
// author : Tim Wood
// license : MIT
// momentjs.com

(function( undefined ){

	/************************************
	 Constants
	 ************************************/

	var moment, VERSION = "2.0.0", round = Math.round, i, // internal storage for language config files
		languages = {},

	// check for nodeJS
		hasModule = (typeof module !== 'undefined' && module.exports),

	// ASP.NET json date format regex
		aspNetJsonRegex = /^\/?Date\((\-?\d+)/i,

	// format tokens
		formattingTokens = /(\[[^\[]*\])|(\\)?(Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|YYYYY|YYYY|YY|a|A|hh?|HH?|mm?|ss?|SS?S?|X|zz?|ZZ?|.)/g, localFormattingTokens = /(\[[^\[]*\])|(\\)?(LT|LL?L?L?|l{1,4})/g,

	// parsing tokens
		parseMultipleFormatChunker = /([0-9a-zA-Z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)/gi,

	// parsing token regexes
		parseTokenOneOrTwoDigits = /\d\d?/, // 0 - 99
		parseTokenOneToThreeDigits = /\d{1,3}/, // 0 - 999
		parseTokenThreeDigits = /\d{3}/, // 000 - 999
		parseTokenFourDigits = /\d{1,4}/, // 0 - 9999
		parseTokenSixDigits = /[+\-]?\d{1,6}/, // -999,999 - 999,999
		parseTokenWord = /[0-9]*[a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF]+\s*?[\u0600-\u06FF]+/i, // any word (or two) characters or numbers including two word month in arabic.
		parseTokenTimezone = /Z|[\+\-]\d\d:?\d\d/i, // +00:00 -00:00 +0000 -0000 or Z
		parseTokenT = /T/i, // T (ISO seperator)
		parseTokenTimestampMs = /[\+\-]?\d+(\.\d{1,3})?/, // 123456789 123456789.123

	// preliminary iso regex
	// 0000-00-00 + T + 00 or 00:00 or 00:00:00 or 00:00:00.000 + +00:00 or +0000
		isoRegex = /^\s*\d{4}-\d\d-\d\d((T| )(\d\d(:\d\d(:\d\d(\.\d\d?\d?)?)?)?)?([\+\-]\d\d:?\d\d)?)?/, isoFormat = 'YYYY-MM-DDTHH:mm:ssZ',

	// iso time formats and regexes
		isoTimes = [
			['HH:mm:ss.S', /(T| )\d\d:\d\d:\d\d\.\d{1,3}/],
			['HH:mm:ss', /(T| )\d\d:\d\d:\d\d/],
			['HH:mm', /(T| )\d\d:\d\d/],
			['HH', /(T| )\d\d/]
		],

	// timezone chunker "+10:00" > ["10", "00"] or "-1530" > ["-15", "30"]
		parseTimezoneChunker = /([\+\-]|\d\d)/gi,

	// getter and setter names
		proxyGettersAndSetters = 'Month|Date|Hours|Minutes|Seconds|Milliseconds'.split('|'), unitMillisecondFactors = {
			'Milliseconds': 1,
			'Seconds': 1e3,
			'Minutes': 6e4,
			'Hours': 36e5,
			'Days': 864e5,
			'Months': 2592e6,
			'Years': 31536e6
		},

	// format function strings
		formatFunctions = {},

	// tokens to ordinalize and pad
		ordinalizeTokens = 'DDD w W M D d'.split(' '), paddedTokens = 'M D H h m s w W'.split(' '),

		formatTokenFunctions = {
			M: function(){
				return this.month() + 1;
			},
			MMM: function( format ){
				return this.lang().monthsShort(this, format);
			},
			MMMM: function( format ){
				return this.lang().months(this, format);
			},
			D: function(){
				return this.date();
			},
			DDD: function(){
				return this.dayOfYear();
			},
			d: function(){
				return this.day();
			},
			dd: function( format ){
				return this.lang().weekdaysMin(this, format);
			},
			ddd: function( format ){
				return this.lang().weekdaysShort(this, format);
			},
			dddd: function( format ){
				return this.lang().weekdays(this, format);
			},
			w: function(){
				return this.week();
			},
			W: function(){
				return this.isoWeek();
			},
			YY: function(){
				return leftZeroFill(this.year() % 100, 2);
			},
			YYYY: function(){
				return leftZeroFill(this.year(), 4);
			},
			YYYYY: function(){
				return leftZeroFill(this.year(), 5);
			},
			a: function(){
				return this.lang().meridiem(this.hours(), this.minutes(), true);
			},
			A: function(){
				return this.lang().meridiem(this.hours(), this.minutes(), false);
			},
			H: function(){
				return this.hours();
			},
			h: function(){
				return this.hours() % 12 || 12;
			},
			m: function(){
				return this.minutes();
			},
			s: function(){
				return this.seconds();
			},
			S: function(){
				return ~~(this.milliseconds() / 100);
			},
			SS: function(){
				return leftZeroFill(~~(this.milliseconds() / 10), 2);
			},
			SSS: function(){
				return leftZeroFill(this.milliseconds(), 3);
			},
			Z: function(){
				var a = -this.zone(), b = "+";
				if( a < 0 ){
					a = -a;
					b = "-";
				}
				return b + leftZeroFill(~~(a / 60), 2) + ":" + leftZeroFill(~~a % 60, 2);
			},
			ZZ: function(){
				var a = -this.zone(), b = "+";
				if( a < 0 ){
					a = -a;
					b = "-";
				}
				return b + leftZeroFill(~~(10 * a / 6), 4);
			},
			X: function(){
				return this.unix();
			}
		};

	function padToken( func, count ){
		return function( a ){
			return leftZeroFill(func.call(this, a), count);
		};
	}

	function ordinalizeToken( func ){
		return function( a ){
			return this.lang().ordinal(func.call(this, a));
		};
	}

	while( ordinalizeTokens.length ){
		i = ordinalizeTokens.pop();
		formatTokenFunctions[i + 'o'] = ordinalizeToken(formatTokenFunctions[i]);
	}
	while( paddedTokens.length ){
		i = paddedTokens.pop();
		formatTokenFunctions[i + i] = padToken(formatTokenFunctions[i], 2);
	}
	formatTokenFunctions.DDDD = padToken(formatTokenFunctions.DDD, 3);


	/************************************
	 Constructors
	 ************************************/

	function Language(){

	}

	// Moment prototype object
	function Moment( config ){
		extend(this, config);
	}

	// Duration Constructor
	function Duration( duration ){
		var data = this._data = {}, years = duration.years || duration.year || duration.y || 0, months = duration.months || duration.month || duration.M || 0, weeks = duration.weeks || duration.week || duration.w || 0, days = duration.days || duration.day || duration.d || 0, hours = duration.hours || duration.hour || duration.h || 0, minutes = duration.minutes || duration.minute || duration.m || 0, seconds = duration.seconds || duration.second || duration.s || 0, milliseconds = duration.milliseconds || duration.millisecond || duration.ms || 0;

		// representation for dateAddRemove
		this._milliseconds = milliseconds + seconds * 1e3 + // 1000
			minutes * 6e4 + // 1000 * 60
			hours * 36e5; // 1000 * 60 * 60
		// Because of dateAddRemove treats 24 hours as different from a
		// day when working around DST, we need to store them separately
		this._days = days + weeks * 7;
		// It is impossible translate months into days without knowing
		// which months you are are talking about, so we have to store
		// it separately.
		this._months = months + years * 12;

		// The following code bubbles up values, see the tests for
		// examples of what that means.
		data.milliseconds = milliseconds % 1000;
		seconds += absRound(milliseconds / 1000);

		data.seconds = seconds % 60;
		minutes += absRound(seconds / 60);

		data.minutes = minutes % 60;
		hours += absRound(minutes / 60);

		data.hours = hours % 24;
		days += absRound(hours / 24);

		days += weeks * 7;
		data.days = days % 30;

		months += absRound(days / 30);

		data.months = months % 12;
		years += absRound(months / 12);

		data.years = years;
	}


	/************************************
	 Helpers
	 ************************************/


	function extend( a, b ){
		for( var i in b ){
			if( b.hasOwnProperty(i) ){
				a[i] = b[i];
			}
		}
		return a;
	}

	function absRound( number ){
		if( number < 0 ){
			return Math.ceil(number);
		} else{
			return Math.floor(number);
		}
	}

	// left zero fill a number
	// see http://jsperf.com/left-zero-filling for performance comparison
	function leftZeroFill( number, targetLength ){
		var output = number + '';
		while( output.length < targetLength ){
			output = '0' + output;
		}
		return output;
	}

	// helper function for _.addTime and _.subtractTime
	function addOrSubtractDurationFromMoment( mom, duration, isAdding ){
		var ms = duration._milliseconds, d = duration._days, M = duration._months, currentDate;

		if( ms ){
			mom._d.setTime(+mom + ms * isAdding);
		}
		if( d ){
			mom.date(mom.date() + d * isAdding);
		}
		if( M ){
			currentDate = mom.date();
			mom.date(1).month(mom.month() + M * isAdding).date(Math.min(currentDate, mom.daysInMonth()));
		}
	}

	// check if is an array
	function isArray( input ){
		return Object.prototype.toString.call(input) === '[object Array]';
	}

	// compare two arrays, return the number of differences
	function compareArrays( array1, array2 ){
		var len = Math.min(array1.length, array2.length), lengthDiff = Math.abs(array1.length - array2.length), diffs = 0, i;
		for( i = 0; i < len; i++ ){
			if( ~~array1[i] !== ~~array2[i] ){
				diffs++;
			}
		}
		return diffs + lengthDiff;
	}


	/************************************
	 Languages
	 ************************************/


	Language.prototype = {
		set: function( config ){
			var prop, i;
			for( i in config ){
				prop = config[i];
				if( typeof prop === 'function' ){
					this[i] = prop;
				} else{
					this['_' + i] = prop;
				}
			}
		},

		_months: "January_February_March_April_May_June_July_August_September_October_November_December".split("_"),
		months: function( m ){
			return this._months[m.month()];
		},

		_monthsShort: "Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),
		monthsShort: function( m ){
			return this._monthsShort[m.month()];
		},

		monthsParse: function( monthName ){
			var i, mom, regex, output;

			if( !this._monthsParse ){
				this._monthsParse = [];
			}

			for( i = 0; i < 12; i++ ){
				// make the regex if we don't have it already
				if( !this._monthsParse[i] ){
					mom = moment([2000, i]);
					regex = '^' + this.months(mom, '') + '|^' + this.monthsShort(mom, '');
					this._monthsParse[i] = new RegExp(regex.replace('.', ''), 'i');
				}
				// test the regex
				if( this._monthsParse[i].test(monthName) ){
					return i;
				}
			}
		},

		_weekdays: "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),
		weekdays: function( m ){
			return this._weekdays[m.day()];
		},

		_weekdaysShort: "Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),
		weekdaysShort: function( m ){
			return this._weekdaysShort[m.day()];
		},

		_weekdaysMin: "Su_Mo_Tu_We_Th_Fr_Sa".split("_"),
		weekdaysMin: function( m ){
			return this._weekdaysMin[m.day()];
		},

		_longDateFormat: {
			LT: "h:mm A",
			L: "MM/DD/YYYY",
			LL: "MMMM D YYYY",
			LLL: "MMMM D YYYY LT",
			LLLL: "dddd, MMMM D YYYY LT"
		},
		longDateFormat: function( key ){
			var output = this._longDateFormat[key];
			if( !output && this._longDateFormat[key.toUpperCase()] ){
				output = this._longDateFormat[key.toUpperCase()].replace(/MMMM|MM|DD|dddd/g, function( val ){
					return val.slice(1);
				});
				this._longDateFormat[key] = output;
			}
			return output;
		},

		meridiem: function( hours, minutes, isLower ){
			if( hours > 11 ){
				return isLower ? 'pm' : 'PM';
			} else{
				return isLower ? 'am' : 'AM';
			}
		},

		_calendar: {
			sameDay: '[Today at] LT',
			nextDay: '[Tomorrow at] LT',
			nextWeek: 'dddd [at] LT',
			lastDay: '[Yesterday at] LT',
			lastWeek: '[last] dddd [at] LT',
			sameElse: 'L'
		},
		calendar: function( key, mom ){
			var output = this._calendar[key];
			return typeof output === 'function' ? output.apply(mom) : output;
		},

		_relativeTime: {
			future: "in %s",
			past: "%s ago",
			s: "a few seconds",
			m: "a minute",
			mm: "%d minutes",
			h: "an hour",
			hh: "%d hours",
			d: "a day",
			dd: "%d days",
			M: "a month",
			MM: "%d months",
			y: "a year",
			yy: "%d years"
		},
		relativeTime: function( number, withoutSuffix, string, isFuture ){
			var output = this._relativeTime[string];
			return (typeof output === 'function') ? output(number, withoutSuffix, string, isFuture) : output.replace(/%d/i, number);
		},
		pastFuture: function( diff, output ){
			var format = this._relativeTime[diff > 0 ? 'future' : 'past'];
			return typeof format === 'function' ? format(output) : format.replace(/%s/i, output);
		},

		ordinal: function( number ){
			return this._ordinal.replace("%d", number);
		},
		_ordinal: "%d",

		preparse: function( string ){
			return string;
		},

		postformat: function( string ){
			return string;
		},

		week: function( mom ){
			return weekOfYear(mom, this._week.dow, this._week.doy);
		},
		_week: {
			dow: 0, // Sunday is the first day of the week.
			doy: 6  // The week that contains Jan 1st is the first week of the year.
		}
	};

	// Loads a language definition into the `languages` cache.  The function
	// takes a key and optionally values.  If not in the browser and no values
	// are provided, it will load the language file module.  As a convenience,
	// this function also returns the language values.
	function loadLang( key, values ){
		values.abbr = key;
		if( !languages[key] ){
			languages[key] = new Language();
		}
		languages[key].set(values);
		return languages[key];
	}

	// Determines which language definition to use and returns it.
	//
	// With no parameters, it will return the global language.  If you
	// pass in a language key, such as 'en', it will return the
	// definition for 'en', so long as 'en' has already been loaded using
	// moment.lang.
	function getLangDefinition( key ){
		if( !key ){
			return moment.fn._lang;
		}
		if( !languages[key] && hasModule ){
			require('./lang/' + key);
		}
		return languages[key];
	}


	/************************************
	 Formatting
	 ************************************/


	function removeFormattingTokens( input ){
		if( input.match(/\[.*\]/) ){
			return input.replace(/^\[|\]$/g, "");
		}
		return input.replace(/\\/g, "");
	}

	function makeFormatFunction( format ){
		var array = format.match(formattingTokens), i, length;

		for( i = 0, length = array.length; i < length; i++ ){
			if( formatTokenFunctions[array[i]] ){
				array[i] = formatTokenFunctions[array[i]];
			} else{
				array[i] = removeFormattingTokens(array[i]);
			}
		}

		return function( mom ){
			var output = "";
			for( i = 0; i < length; i++ ){
				output += typeof array[i].call === 'function' ? array[i].call(mom, format) : array[i];
			}
			return output;
		};
	}

	// format date using native date object
	function formatMoment( m, format ){
		var i = 5;

		function replaceLongDateFormatTokens( input ){
			return m.lang().longDateFormat(input) || input;
		}

		while( i-- && localFormattingTokens.test(format) ){
			format = format.replace(localFormattingTokens, replaceLongDateFormatTokens);
		}

		if( !formatFunctions[format] ){
			formatFunctions[format] = makeFormatFunction(format);
		}

		return formatFunctions[format](m);
	}


	/************************************
	 Parsing
	 ************************************/


		// get the regex to find the next token
	function getParseRegexForToken( token ){
		switch( token ){
			case 'DDDD':
				return parseTokenThreeDigits;
			case 'YYYY':
				return parseTokenFourDigits;
			case 'YYYYY':
				return parseTokenSixDigits;
			case 'S':
			case 'SS':
			case 'SSS':
			case 'DDD':
				return parseTokenOneToThreeDigits;
			case 'MMM':
			case 'MMMM':
			case 'dd':
			case 'ddd':
			case 'dddd':
			case 'a':
			case 'A':
				return parseTokenWord;
			case 'X':
				return parseTokenTimestampMs;
			case 'Z':
			case 'ZZ':
				return parseTokenTimezone;
			case 'T':
				return parseTokenT;
			case 'MM':
			case 'DD':
			case 'YY':
			case 'HH':
			case 'hh':
			case 'mm':
			case 'ss':
			case 'M':
			case 'D':
			case 'd':
			case 'H':
			case 'h':
			case 'm':
			case 's':
				return parseTokenOneOrTwoDigits;
			default :
				return new RegExp(token.replace('\\', ''));
		}
	}

	// function to convert string input to date
	function addTimeToArrayFromToken( token, input, config ){
		var a, b, datePartArray = config._a;

		switch( token ){
			// MONTH
			case 'M' : // fall through to MM
			case 'MM' :
				datePartArray[1] = (input == null) ? 0 : ~~input - 1;
				break;
			case 'MMM' : // fall through to MMMM
			case 'MMMM' :
				a = getLangDefinition(config._l).monthsParse(input);
				// if we didn't find a month name, mark the date as invalid.
				if( a != null ){
					datePartArray[1] = a;
				} else{
					config._isValid = false;
				}
				break;
			// DAY OF MONTH
			case 'D' : // fall through to DDDD
			case 'DD' : // fall through to DDDD
			case 'DDD' : // fall through to DDDD
			case 'DDDD' :
				if( input != null ){
					datePartArray[2] = ~~input;
				}
				break;
			// YEAR
			case 'YY' :
				datePartArray[0] = ~~input + (~~input > 68 ? 1900 : 2000);
				break;
			case 'YYYY' :
			case 'YYYYY' :
				datePartArray[0] = ~~input;
				break;
			// AM / PM
			case 'a' : // fall through to A
			case 'A' :
				config._isPm = ((input + '').toLowerCase() === 'pm');
				break;
			// 24 HOUR
			case 'H' : // fall through to hh
			case 'HH' : // fall through to hh
			case 'h' : // fall through to hh
			case 'hh' :
				datePartArray[3] = ~~input;
				break;
			// MINUTE
			case 'm' : // fall through to mm
			case 'mm' :
				datePartArray[4] = ~~input;
				break;
			// SECOND
			case 's' : // fall through to ss
			case 'ss' :
				datePartArray[5] = ~~input;
				break;
			// MILLISECOND
			case 'S' :
			case 'SS' :
			case 'SSS' :
				datePartArray[6] = ~~(('0.' + input) * 1000);
				break;
			// UNIX TIMESTAMP WITH MS
			case 'X':
				config._d = new Date(parseFloat(input) * 1000);
				break;
			// TIMEZONE
			case 'Z' : // fall through to ZZ
			case 'ZZ' :
				config._useUTC = true;
				a = (input + '').match(parseTimezoneChunker);
				if( a && a[1] ){
					config._tzh = ~~a[1];
				}
				if( a && a[2] ){
					config._tzm = ~~a[2];
				}
				// reverse offsets
				if( a && a[0] === '+' ){
					config._tzh = -config._tzh;
					config._tzm = -config._tzm;
				}
				break;
		}

		// if the input is null, the date is not valid
		if( input == null ){
			config._isValid = false;
		}
	}

	// convert an array to a date.
	// the array should mirror the parameters below
	// note: all values past the year are optional and will default to the lowest possible value.
	// [year, month, day , hour, minute, second, millisecond]
	function dateFromArray( config ){
		var i, date, input = [];

		if( config._d ){
			return;
		}

		for( i = 0; i < 7; i++ ){
			config._a[i] = input[i] = (config._a[i] == null) ? (i === 2 ? 1 : 0) : config._a[i];
		}

		// add the offsets to the time to be parsed so that we can have a clean array for checking isValid
		input[3] += config._tzh || 0;
		input[4] += config._tzm || 0;

		date = new Date(0);

		if( config._useUTC ){
			date.setUTCFullYear(input[0], input[1], input[2]);
			date.setUTCHours(input[3], input[4], input[5], input[6]);
		} else{
			date.setFullYear(input[0], input[1], input[2]);
			date.setHours(input[3], input[4], input[5], input[6]);
		}

		config._d = date;
	}

	// date from string and format string
	function makeDateFromStringAndFormat( config ){
		// This array is used to make a Date, either with `new Date` or `Date.UTC`
		var tokens = config._f.match(formattingTokens), string = config._i, i, parsedInput;

		config._a = [];

		for( i = 0; i < tokens.length; i++ ){
			parsedInput = (getParseRegexForToken(tokens[i]).exec(string) || [])[0];
			if( parsedInput ){
				string = string.slice(string.indexOf(parsedInput) + parsedInput.length);
			}
			// don't parse if its not a known token
			if( formatTokenFunctions[tokens[i]] ){
				addTimeToArrayFromToken(tokens[i], parsedInput, config);
			}
		}
		// handle am pm
		if( config._isPm && config._a[3] < 12 ){
			config._a[3] += 12;
		}
		// if is 12 am, change hours to 0
		if( config._isPm === false && config._a[3] === 12 ){
			config._a[3] = 0;
		}
		// return
		dateFromArray(config);
	}

	// date from string and array of format strings
	function makeDateFromStringAndArray( config ){
		var tempConfig, tempMoment, bestMoment,

			scoreToBeat = 99, i, currentDate, currentScore;

		while( config._f.length ){
			tempConfig = extend({}, config);
			tempConfig._f = config._f.pop();
			makeDateFromStringAndFormat(tempConfig);
			tempMoment = new Moment(tempConfig);

			if( tempMoment.isValid() ){
				bestMoment = tempMoment;
				break;
			}

			currentScore = compareArrays(tempConfig._a, tempMoment.toArray());

			if( currentScore < scoreToBeat ){
				scoreToBeat = currentScore;
				bestMoment = tempMoment;
			}
		}

		extend(config, bestMoment);
	}

	// date from iso format
	function makeDateFromString( config ){
		var i, string = config._i;
		if( isoRegex.exec(string) ){
			config._f = 'YYYY-MM-DDT';
			for( i = 0; i < 4; i++ ){
				if( isoTimes[i][1].exec(string) ){
					config._f += isoTimes[i][0];
					break;
				}
			}
			if( parseTokenTimezone.exec(string) ){
				config._f += " Z";
			}
			makeDateFromStringAndFormat(config);
		} else{
			config._d = new Date(string);
		}
	}

	function makeDateFromInput( config ){
		var input = config._i, matched = aspNetJsonRegex.exec(input);

		if( input === undefined ){
			config._d = new Date();
		} else if( matched ){
			config._d = new Date(+matched[1]);
		} else if( typeof input === 'string' ){
			makeDateFromString(config);
		} else if( isArray(input) ){
			config._a = input.slice(0);
			dateFromArray(config);
		} else{
			config._d = input instanceof Date ? new Date(+input) : new Date(input);
		}
	}


	/************************************
	 Relative Time
	 ************************************/


		// helper function for moment.fn.from, moment.fn.fromNow, and moment.duration.fn.humanize
	function substituteTimeAgo( string, number, withoutSuffix, isFuture, lang ){
		return lang.relativeTime(number || 1, !!withoutSuffix, string, isFuture);
	}

	function relativeTime( milliseconds, withoutSuffix, lang ){
		var seconds = round(Math.abs(milliseconds) / 1000), minutes = round(seconds / 60), hours = round(minutes / 60), days = round(hours / 24), years = round(days / 365), args = seconds < 45 && ['s', seconds] || minutes === 1 && ['m'] || minutes < 45 && ['mm', minutes] || hours === 1 && ['h'] || hours < 22 && ['hh', hours] || days === 1 && ['d'] || days <= 25 && ['dd', days] || days <= 45 && ['M'] || days < 345 && ['MM', round(days / 30)] || years === 1 && ['y'] || ['yy', years];
		args[2] = withoutSuffix;
		args[3] = milliseconds > 0;
		args[4] = lang;
		return substituteTimeAgo.apply({}, args);
	}


	/************************************
	 Week of Year
	 ************************************/


		// firstDayOfWeek       0 = sun, 6 = sat
		//                      the day of the week that starts the week
		//                      (usually sunday or monday)
		// firstDayOfWeekOfYear 0 = sun, 6 = sat
		//                      the first week is the week that contains the first
		//                      of this day of the week
		//                      (eg. ISO weeks use thursday (4))
	function weekOfYear( mom, firstDayOfWeek, firstDayOfWeekOfYear ){
		var end = firstDayOfWeekOfYear - firstDayOfWeek, daysToDayOfWeek = firstDayOfWeekOfYear - mom.day();


		if( daysToDayOfWeek > end ){
			daysToDayOfWeek -= 7;
		}

		if( daysToDayOfWeek < end - 7 ){
			daysToDayOfWeek += 7;
		}

		return Math.ceil(moment(mom).add('d', daysToDayOfWeek).dayOfYear() / 7);
	}


	/************************************
	 Top Level Functions
	 ************************************/

	function makeMoment( config ){
		var input = config._i, format = config._f;

		if( input === null || input === '' ){
			return null;
		}

		if( typeof input === 'string' ){
			config._i = input = getLangDefinition().preparse(input);
		}

		if( moment.isMoment(input) ){
			config = extend({}, input);
			config._d = new Date(+input._d);
		} else if( format ){
			if( isArray(format) ){
				makeDateFromStringAndArray(config);
			} else{
				makeDateFromStringAndFormat(config);
			}
		} else{
			makeDateFromInput(config);
		}

		return new Moment(config);
	}

	moment = function( input, format, lang ){
		return makeMoment({
			_i: input,
			_f: format,
			_l: lang,
			_isUTC: false
		});
	};

	// creating with utc
	moment.utc = function( input, format, lang ){
		return makeMoment({
			_useUTC: true,
			_isUTC: true,
			_l: lang,
			_i: input,
			_f: format
		});
	};

	// creating with unix timestamp (in seconds)
	moment.unix = function( input ){
		return moment(input * 1000);
	};

	// duration
	moment.duration = function( input, key ){
		var isDuration = moment.isDuration(input), isNumber = (typeof input === 'number'), duration = (isDuration ? input._data : (isNumber ? {} : input)), ret;

		if( isNumber ){
			if( key ){
				duration[key] = input;
			} else{
				duration.milliseconds = input;
			}
		}

		ret = new Duration(duration);

		if( isDuration && input.hasOwnProperty('_lang') ){
			ret._lang = input._lang;
		}

		return ret;
	};

	// version number
	moment.version = VERSION;

	// default format
	moment.defaultFormat = isoFormat;

	// This function will load languages and then set the global language.  If
	// no arguments are passed in, it will simply return the current global
	// language key.
	moment.lang = function( key, values ){
		var i;

		if( !key ){
			return moment.fn._lang._abbr;
		}
		if( values ){
			loadLang(key, values);
		} else if( !languages[key] ){
			getLangDefinition(key);
		}
		moment.duration.fn._lang = moment.fn._lang = getLangDefinition(key);
	};

	// returns language data
	moment.langData = function( key ){
		if( key && key._lang && key._lang._abbr ){
			key = key._lang._abbr;
		}
		return getLangDefinition(key);
	};

	// compare moment object
	moment.isMoment = function( obj ){
		return obj instanceof Moment;
	};

	// for typechecking Duration objects
	moment.isDuration = function( obj ){
		return obj instanceof Duration;
	};


	/************************************
	 Moment Prototype
	 ************************************/


	moment.fn = Moment.prototype = {

		clone: function(){
			return moment(this);
		},

		valueOf: function(){
			return +this._d;
		},

		unix: function(){
			return Math.floor(+this._d / 1000);
		},

		toString: function(){
			return this.format("ddd MMM DD YYYY HH:mm:ss [GMT]ZZ");
		},

		toDate: function(){
			return this._d;
		},

		toJSON: function(){
			return moment.utc(this).format('YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
		},

		toArray: function(){
			var m = this;
			return [
				m.year(), m.month(), m.date(), m.hours(), m.minutes(), m.seconds(), m.milliseconds()
			];
		},

		isValid: function(){
			if( this._isValid == null ){
				if( this._a ){
					this._isValid = !compareArrays(this._a, (this._isUTC ? moment.utc(this._a) : moment(this._a)).toArray());
				} else{
					this._isValid = !isNaN(this._d.getTime());
				}
			}
			return !!this._isValid;
		},

		utc: function(){
			this._isUTC = true;
			return this;
		},

		local: function(){
			this._isUTC = false;
			return this;
		},

		format: function( inputString ){
			var output = formatMoment(this, inputString || moment.defaultFormat);
			return this.lang().postformat(output);
		},

		add: function( input, val ){
			var dur;
			// switch args to support add('s', 1) and add(1, 's')
			if( typeof input === 'string' ){
				dur = moment.duration(+val, input);
			} else{
				dur = moment.duration(input, val);
			}
			addOrSubtractDurationFromMoment(this, dur, 1);
			return this;
		},

		subtract: function( input, val ){
			var dur;
			// switch args to support subtract('s', 1) and subtract(1, 's')
			if( typeof input === 'string' ){
				dur = moment.duration(+val, input);
			} else{
				dur = moment.duration(input, val);
			}
			addOrSubtractDurationFromMoment(this, dur, -1);
			return this;
		},

		diff: function( input, units, asFloat ){
			var that = this._isUTC ? moment(input).utc() : moment(input).local(), zoneDiff = (this.zone() - that.zone()) * 6e4, diff, output;

			if( units ){
				// standardize on singular form
				units = units.replace(/s$/, '');
			}

			if( units === 'year' || units === 'month' ){
				diff = (this.daysInMonth() + that.daysInMonth()) * 432e5; // 24 * 60 * 60 * 1000 / 2
				output = ((this.year() - that.year()) * 12) + (this.month() - that.month());
				output += ((this - moment(this).startOf('month')) - (that - moment(that).startOf('month'))) / diff;
				if( units === 'year' ){
					output = output / 12;
				}
			} else{
				diff = (this - that) - zoneDiff;
				output = units === 'second' ? diff / 1e3 : // 1000
					units === 'minute' ? diff / 6e4 : // 1000 * 60
						units === 'hour' ? diff / 36e5 : // 1000 * 60 * 60
							units === 'day' ? diff / 864e5 : // 1000 * 60 * 60 * 24
								units === 'week' ? diff / 6048e5 : // 1000 * 60 * 60 * 24 * 7
									diff;
			}
			return asFloat ? output : absRound(output);
		},

		from: function( time, withoutSuffix ){
			return moment.duration(this.diff(time)).lang(this.lang()._abbr).humanize(!withoutSuffix);
		},

		fromNow: function( withoutSuffix ){
			return this.from(moment(), withoutSuffix);
		},

		calendar: function(){
			var diff = this.diff(moment().startOf('day'), 'days', true), format = diff < -6 ? 'sameElse' : diff < -1 ? 'lastWeek' : diff < 0 ? 'lastDay' : diff < 1 ? 'sameDay' : diff < 2 ? 'nextDay' : diff < 7 ? 'nextWeek' : 'sameElse';
			return this.format(this.lang().calendar(format, this));
		},

		isLeapYear: function(){
			var year = this.year();
			return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
		},

		isDST: function(){
			return (this.zone() < moment([this.year()]).zone() || this.zone() < moment([this.year(), 5]).zone());
		},

		day: function( input ){
			var day = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
			return input == null ? day : this.add({ d: input - day });
		},

		startOf: function( units ){
			units = units.replace(/s$/, '');
			// the following switch intentionally omits break keywords
			// to utilize falling through the cases.
			switch( units ){
				case 'year':
					this.month(0);
				/* falls through */
				case 'month':
					this.date(1);
				/* falls through */
				case 'week':
				case 'day':
					this.hours(0);
				/* falls through */
				case 'hour':
					this.minutes(0);
				/* falls through */
				case 'minute':
					this.seconds(0);
				/* falls through */
				case 'second':
					this.milliseconds(0);
				/* falls through */
			}

			// weeks are a special case
			if( units === 'week' ){
				this.day(0);
			}

			return this;
		},

		endOf: function( units ){
			return this.startOf(units).add(units.replace(/s?$/, 's'), 1).subtract('ms', 1);
		},

		isAfter: function( input, units ){
			units = typeof units !== 'undefined' ? units : 'millisecond';
			return +this.clone().startOf(units) > +moment(input).startOf(units);
		},

		isBefore: function( input, units ){
			units = typeof units !== 'undefined' ? units : 'millisecond';
			return +this.clone().startOf(units) < +moment(input).startOf(units);
		},

		isSame: function( input, units ){
			units = typeof units !== 'undefined' ? units : 'millisecond';
			return +this.clone().startOf(units) === +moment(input).startOf(units);
		},

		zone: function(){
			return this._isUTC ? 0 : this._d.getTimezoneOffset();
		},

		daysInMonth: function(){
			return moment.utc([this.year(), this.month() + 1, 0]).date();
		},

		dayOfYear: function( input ){
			var dayOfYear = round((moment(this).startOf('day') - moment(this).startOf('year')) / 864e5) + 1;
			return input == null ? dayOfYear : this.add("d", (input - dayOfYear));
		},

		isoWeek: function( input ){
			var week = weekOfYear(this, 1, 4);
			return input == null ? week : this.add("d", (input - week) * 7);
		},

		week: function( input ){
			var week = this.lang().week(this);
			return input == null ? week : this.add("d", (input - week) * 7);
		},

		// If passed a language key, it will set the language for this
		// instance.  Otherwise, it will return the language configuration
		// variables for this instance.
		lang: function( key ){
			if( key === undefined ){
				return this._lang;
			} else{
				this._lang = getLangDefinition(key);
				return this;
			}
		}
	};

	// helper for adding shortcuts
	function makeGetterAndSetter( name, key ){
		moment.fn[name] = moment.fn[name + 's'] = function( input ){
			var utc = this._isUTC ? 'UTC' : '';
			if( input != null ){
				this._d['set' + utc + key](input);
				return this;
			} else{
				return this._d['get' + utc + key]();
			}
		};
	}

	// loop through and add shortcuts (Month, Date, Hours, Minutes, Seconds, Milliseconds)
	for( i = 0; i < proxyGettersAndSetters.length; i++ ){
		makeGetterAndSetter(proxyGettersAndSetters[i].toLowerCase().replace(/s$/, ''), proxyGettersAndSetters[i]);
	}

	// add shortcut for year (uses different syntax than the getter/setter 'year' == 'FullYear')
	makeGetterAndSetter('year', 'FullYear');

	// add plural methods
	moment.fn.days = moment.fn.day;
	moment.fn.weeks = moment.fn.week;
	moment.fn.isoWeeks = moment.fn.isoWeek;

	/************************************
	 Duration Prototype
	 ************************************/


	moment.duration.fn = Duration.prototype = {
		weeks: function(){
			return absRound(this.days() / 7);
		},

		valueOf: function(){
			return this._milliseconds + this._days * 864e5 + this._months * 2592e6;
		},

		humanize: function( withSuffix ){
			var difference = +this, output = relativeTime(difference, !withSuffix, this.lang());

			if( withSuffix ){
				output = this.lang().pastFuture(difference, output);
			}

			return this.lang().postformat(output);
		},

		lang: moment.fn.lang
	};

	function makeDurationGetter( name ){
		moment.duration.fn[name] = function(){
			return this._data[name];
		};
	}

	function makeDurationAsGetter( name, factor ){
		moment.duration.fn['as' + name] = function(){
			return +this / factor;
		};
	}

	for( i in unitMillisecondFactors ){
		if( unitMillisecondFactors.hasOwnProperty(i) ){
			makeDurationAsGetter(i, unitMillisecondFactors[i]);
			makeDurationGetter(i.toLowerCase());
		}
	}

	makeDurationAsGetter('Weeks', 6048e5);


	/************************************
	 Default Lang
	 ************************************/


		// Set default language, other languages will inherit from English.
	moment.lang('en', {
		ordinal: function( number ){
			var b = number % 10, output = (~~(number % 100 / 10) === 1) ? 'th' : (b === 1) ? 'st' : (b === 2) ? 'nd' : (b === 3) ? 'rd' : 'th';
			return number + output;
		}
	});


	/************************************
	 Exposing Moment
	 ************************************/


	// CommonJS module is defined
	if( hasModule ){
		module.exports = moment;
	}
	/*global ender:false */
	if( typeof ender === 'undefined' ){
		// here, `this` means `window` in the browser, or `global` on the server
		// add `moment` as a global object via a string identifier,
		// for Closure Compiler "advanced" mode
		this['moment'] = moment;
	}
	/*global define:false */
	if( typeof define === "function" && define.amd ){
		define("moment", [], function(){
			return moment;
		});
	}
}).call(this);

/*!
 * jQuery Cookie Plugin v1.3
 * https://github.com/carhartl/jquery-cookie
 *
 * Copyright 2011, Klaus Hartl
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.opensource.org/licenses/GPL-2.0
 */
define('cookie',['jquery'], function(){
	(function( $, document, undefined ){

		var pluses = /\+/g;

		function raw( s ){
			return s;
		}

		function decoded( s ){
			return decodeURIComponent(s.replace(pluses, ' '));
		}

		var config = $.cookie = function( key, value, options ){

			// write
			if( value !== undefined ){
				options = $.extend({}, config.defaults, options);

				if( value === null ){
					options.expires = -1;
				}

				if( typeof options.expires === 'number' ){
					var days = options.expires, t = options.expires = new Date();
					t.setDate(t.getDate() + days);
				}

				value = config.json ? JSON.stringify(value) : String(value);

				return (document.cookie = [
					encodeURIComponent(key), '=', config.raw ? value : encodeURIComponent(value), options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
					options.path ? '; path=' + options.path : '', options.domain ? '; domain=' + options.domain : '', options.secure ? '; secure' : ''
				].join(''));
			}

			// read
			var decode = config.raw ? raw : decoded;
			var cookies = document.cookie.split('; ');
			for( var i = 0, l = cookies.length; i < l; i++ ){
				var parts = cookies[i].split('=');
				if( decode(parts.shift()) === key ){
					var cookie = decode(parts.join('='));
					return config.json ? JSON.parse(cookie) : cookie;
				}
			}

			return null;
		};

		config.defaults = {};

		$.removeCookie = function( key, options ){
			if( $.cookie(key) !== null ){
				$.cookie(key, null, options);
				return true;
			}
			return false;
		};

	})($, document);
});
///<reference path="definitions/definitions.d.ts" />
define('lib/externals',[
    'mootools',
    'jquery',
    'knockout',
    'lib/knockout/knockout.punches',
    'moment',
    'cookie'
], function (mootools, $, ko) {
    ko.punches.interpolationMarkup.enable();
    ko.punches.attributeInterpolationMarkup.enable();
    ko.punches.textFilter.enableForBinding('text');
    ko.punches.textFilter.enableForBinding('foreach');
    // Custom filter can be used like "| append: 'xyz'"
    ko.filters['filter'] = function (value, search) {
        return ko.unwrap(value).filter(function (element) {
            return ko.unwrap(element).indexOf(ko.unwrap(search)) != -1;
        });
    };
    ko.bindingHandlers['live'] = {
        preprocess: function (value, name, addBindingsCallback) {
            addBindingsCallback('value', value);
            addBindingsCallback('valueUpdate', "['afterkeydown', 'keyup', 'input']");
        }
    };
    ko.punches.utils.setNodePreprocessor(function (node) {
        if (node.nodeType !== 1) {
            return;
        }
        var name = node.tagName.toLowerCase();
        if (name.substr(0, 2) == 'x-') {
            var templateName = name.substr(2);
            var data = $(node).attr('data');
            var template = $('#' + templateName)[0];
            if (template) {
                var $newNode = $('<div/>');
                $newNode.attr('data-bind', "template: {name: '" + templateName + "'" + (data ? ', data: ' + data : '') + '}');
                $(node).replaceWith($newNode);
            }
        }
    });
});

///<reference path="../lib/definitions/definitions.d.ts" />
requirejs.config({
    baseUrl: 'inc/script',
    waitSeconds: 15,
    paths: {
        jquery: 'lib/jquery/jquery',
        cookie: 'lib/jquery/cookie',
        mootools: 'lib/mootools/mootools.utils',
        knockout: 'lib/knockout/knockout',
        text: 'lib/require/text',
        TweenMax: "lib/gsap/TweenMax.min",
        TweenLite: "lib/gsap/TweenLite.min",
        CSSPlugin: "lib/gsap/plugins/CSSPlugin.min",
        TimelineLite: "lib/gsap/TimelineLite.min",
        TimelineMax: "lib/gsap/TimelineMax.min",
        EasePack: "lib/gsap/easing/EasePack.min",
        moment: 'lib/moment/moment'
    },
    map: {},
    shim: {
        'history': ['mootools'],
        'knockout': ['jquery']
    }
});
requirejs(['app/Main', 'lib/externals'], function (Main) {
    new Main();
});

define("app/Bootstrap", function(){});
