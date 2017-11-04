
require.config({
	shim: {
		// "math": {
		// 	deps: ["jQuery"],
		// 	exports: "Math"
		// }
	},
	paths: {
		// "jquery": "jquery-3.2.1",
		"Zepto": "libs/zepto.min",
		"Math": "libs/math",
		"Vue": "libs/vue"
	}
});

require(['Zepto', 'Math', 'Vue'], function ($, math, Vue) {
	// console.log($)
	// console.log(math.add(1,2));

	var vm = new Vue({
		el: '#app',
		data: {
			info: {
				name: "Judy",
				age: "23"
			}
		},
		created: function(){

		},
		methods: {
			init: function(){
				console.log(this.info)
			}
		}
	})


})	;







