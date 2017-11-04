
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
		"Common": "libs/common",
		"Vue": "libs/vue"
	}
});

require(['Zepto', 'Common', 'Vue'], function ($, __, Vue) {
	// console.log($)
	// console.log(math.add(1,2));

	var uleUrl = location.host.substring(location.host.indexOf('.') + 1);
	var ulecdn = uleUrl.indexOf('beta') > -1 ? 'beta.ulecdn.com' : 'ulecdn.com';
    var url = location.href;
    var shopUrl = '//m.ule.com/item/detail/'; //定义跳转到shop页面

	var vm = new Vue({
		el: '#app',
		data: {
			api: {
	            queryCouponList: "//prize." + uleUrl + "/mc/m/api/v2/base/coupon/couponListBySearch?",
	            receiveCoupon: "//prize." + uleUrl + "/mc/m/api/v2/base/coupon/receiveCoupon",
	            getPrdsUrl: "//static-content."+ ulecdn +"/mobilead/recommond/dwRecommond.do?restype=2001",
	            getStoresUrl: "//static-content."+ ulecdn +"/mobilead/recommond/dwRecommond.do?restype=2002"
	        },
	        codes: {
	        	prd: ["11_pro_2_jxw"]
	        },
			prds: {},
			ads: {}
		},
		created: function() {

		},
		methods: {
			init: function() {
				this.getPrds();
			},
			getPrds: function() {
            	// 定义vm变量，让它指向this,this是当前的Vue实例
				var _vm = this;
				__.Ajax.execute({
					url: this.api.getPrdsUrl,
	                data: {
	                    moduleKeys: this.codes.prd.join(',')
	                },
	                jsonp: "jsonApiCallback",
                	jsonpCallback: "jsonApiCallback1",
	                headers: {
	                    "Accept-Encoding": "gzip,deflate"
	                },
	                cache: true,
	                success: function(res) {
	                	// console.log(data);
	                	// _vm.set(data, 'prd', JSON.parse(res));
	                	_vm.prds = res;
				console.log(_vm.prds)
	                	_vm.renderPrds(res);
	                }
				})
			},
			renderPrds: function(obj) {
				console.log(obj);
			}
		},
		mounted: function() {
			this.init();
		}
	})


})	;







