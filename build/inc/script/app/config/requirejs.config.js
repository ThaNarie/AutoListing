var require = {
	baseUrl: 'inc/script',
	waitSeconds: 15,
	paths: {
		jquery: 'lib/jquery/jquery',
		cookie: 'lib/jquery/cookie',
		mootools: 'lib/mootools/mootools.utils',
		knockout: 'lib/knockout/knockout',
		text: 'lib/require/text',
		TweenMax:  "lib/gsap/TweenMax.min",
		TweenLite: "lib/gsap/TweenLite.min",
		CSSPlugin: "lib/gsap/plugins/CSSPlugin.min",
		TimelineLite: "lib/gsap/TimelineLite.min",
		TimelineMax: "lib/gsap/TimelineMax.min",
		EasePack: "lib/gsap/easing/EasePack.min"
	},
	map: {
	},
	shim: {
		'history': ['mootools'],
		'knockout': ['jquery']
	}
};