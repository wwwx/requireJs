require.config({
	shim: {
		// "math": {
		// 	deps: ["jQuery"],
		// 	exports: "Math"
		// }
	},
	paths: {
		"zepto": "libs/zepto.min",
		"zepto-lazyload": "libs/zepto-lazyload.min",
		"common": "libs/common",
		"vue": "libs/vue"
	}
});

require(['zepto', 'common', 'vue', 'zepto-lazyload'], function ($, __, Vue) {
	
	// 全局变量
    var url = location.href;
	var uleUrl = location.host.substring(location.host.indexOf('.') + 1);
	var ulecdn = uleUrl.indexOf('beta') > -1 ? 'beta.ulecdn.com' : 'ulecdn.com';
    var shopUrl = '//m.ule.com/item/detail/'; //定义跳转到shop页面
  	var __data__ = {
  		date: '11.1-11.11',
  		isHideDate: false,
  		bottomAdKey: '',
  		productsData: {},
  		storesData: {}
  	}

    // 请求接口数据
    var request = {
    	keys: {
	    	prds: ["11_pro_2_jxw", "11_pro_3_cp"],
	    	stores: ["11_pro_3_rule"]
	    },    
		api: {
	        queryCouponList: "//prize." + uleUrl + "/mc/m/api/v2/base/coupon/couponListBySearch?",
	        receiveCoupon: "//prize." + uleUrl + "/mc/m/api/v2/base/coupon/receiveCoupon",
	        getPrdsUrl: "//static-content.ulecdn.com/mobilead/recommond/dwRecommond.do?restype=2001",
	        getStoresUrl: "//static-content.ulecdn.com/mobilead/recommond/dwRecommond.do?restype=2002"
	    },
	    getPrds: function(keyStr) {
	    	var m = this;
    	    __.Ajax.execute({
				url: m.api.getPrdsUrl,
		        data: {	
		            moduleKeys: keyStr
		        },
		        async: false,
		        jsonpCallback: "jsonApiCallback1",
		        success: function(obj) {
		        	 // $.extend(__data__.productsData, obj);
		        }
		    });
	    },
	    getStores: function(keyStr) {
	    	var m = this;
			__.Ajax.execute({
				url: m.api.getStoresUrl,
                data: {	
                    sectionKeys: keyStr
                },
		        async: false,
                jsonpCallback: "jsonApiCallback3",
                success: function(obj) {
		        	// $.extend(__data__.storesData, obj);
                }
			})
	    },
	    init: function(callback) {
			var m = this;
			m.province = url.getQueryValue('province');

			if (m.province === 'jiangsu') {
				__data__.bottomAdKey = '919_pro_js_bottom';
				m.keys.stores.push({}, __data__.bottomAdKey);
			}
			if (m.province === 'jilin') {
				__data__.isHideDate = true;
			}

			// m.getPrds(m.keys.prds.join(','));
			// m.getStores(m.keys.stores.join(','));
			// console.log(__data__.productsData);
			// console.log(__data__.storesData);
			// console.log('=======================1');
			
        	(callback && typeof callback === 'function') && callback.call(this);
	    }
    };
    
    // 数据初始化完成
    // Vue框架渲染页面
    request.init(function(){

    	// console.log(__data__);
    	// console.log(__data__.storesData);
    	// console.log('===================2');

		// 列表模板
	    var item_li_0 = '<li class="{itemClass}"><a href="{itemUrl}">\
		                    <div class="picBox">\
		                        <img class="img" data-original="{imgUrl}" src="//i0.ulecdn.com/ulewap/i/290x290x2x.png"/>\
		                    </div>\
		                    <div class="desc">\
		                        <p class="name">{listingName}</p>\
		                        <p class="price clearfix"><i class="icon icon-price"></i>¥<span class="price-min">{minPrice}</span></p>\
		                        <p class="buy"><span class="btn-buy">立即购买</span></p>\
		                    </div>\
		                </a></li>';



	  	// 实例化Vue
		var vm = new Vue({
			el: '#app',
			data: {
				keys: {
			    	prds: ["11_pro_2_jxw", "11_pro_3_cp"],
			    	stores: ["11_pro_3_rule"]
			    },    
				api: {
			        queryCouponList: "//prize." + uleUrl + "/mc/m/api/v2/base/coupon/couponListBySearch?",
			        receiveCoupon: "//prize." + uleUrl + "/mc/m/api/v2/base/coupon/receiveCoupon",
			        getPrdsUrl: "//static-content.ulecdn.com/mobilead/recommond/dwRecommond.do?restype=2001",
			        getStoresUrl: "//static-content.ulecdn.com/mobilead/recommond/dwRecommond.do?restype=2002"
			    },
			    productsData: {},
			    storesData: {}
			},
			created: function() {
				var m = this;
		      	__.Ajax.execute({
					url: m.api.getPrdsUrl,
	                data: {	
	                    moduleKeys: '11_pro_3_rule'
	                },
			        async: false,
	                jsonpCallback: "jsonApiCallback2",
	                success: function(obj) {
			        	$.extend(m.productsData, obj);
			        	// m.renderPrds();
	                }
				})

		      	__.Ajax.execute({
					url: m.api.getStoresUrl,
	                data: {	
	                    sectionKeys: '11_pro_3_rule'
	                },
			        async: false,
	                jsonpCallback: "jsonApiCallback3",
	                success: function(obj) {
			        	$.extend(m.storesData, obj);
			        	// console.log(__data__.storesData);
			        	// m.renderStores();
	                }
				})
			},
			components: {
			  	'date-component': {
					template: '<div class="act-date abs" v-bind:class="{ hide: isHideDate }">'
						  	+    '活动时间<br>{{ date }}'
						  	+  '</div>',
					data: function() {
						return __data__;
					}
				},
				'ad-component': {
					template: '<section id="bottomAd">'
					      	+	'<div class="list">'
					      	+     '<ul class="ul-style clearfix"></ul>'
					      	+   '</div>'
						    + '</section>',
				    data: function() {
				    	return __data__;
				    }
				},
				'rule-component': {
					template: '<section class="ruleBox">'  
					      	+ 	'<h3 class="ruleTitle">活动规则:</h3>'
					      	+	'<div class="ruleCon">'
					      	+     '<ul class="ruleUl"></ul>'
					      	+   '</div>'
						    + '</section>',
				    data: function() {
				    	return __data__;
				    }
				}
			},
			methods: {
				init: function() {
					// console.log(__data__)
					// this.renderPrds();
					// this.renderStores();
				},
				renderPrds: function() {
	            	// 定义m变量，让它指向this,this是当前的Vue实例
					var m = this,
						d = __data__.productsData;
					for (var k in d) {
						var data = d[k],
							items = '',
							container = '';
							// console.log(data);
						if (!data) {
							break;
						} else if (uleUrl === 'beta.ule.com') {
							data.length = 4;
						}
						// 判断商品列表对应的父元素
						// switch (k) {
						// 	case m.keys.prds[0]:
						// 		container = '#shop01 > .list > ul';
						// 		break;
						// 	case m.keys.prds[1]: 
						// 		container = '#shop02 > .list > ul';
						// 		break;
						// 	default: ;
						// }
						// for (var i=0, len=data.length; i<len; i+=1) {
						// 	var item 		= data[i];
		    //                 item.itemUrl 	= shopUrl + item.listingId;
		    //                 item.imgUrl 	= item.imgUrl.replace(/^http(s)?:/, '');
		    //                 items += item_li_0.substitute(item);
						// }

						// $(container).html(items).show();
						// document.addEventListener('DOMNodeInserted',function(){
						// 	$('.img').picLazyLoad({
						// 		effect: 'fadeIn',
						// 		threshold: '420'
						// 	})
						// },false);
					}
				},
				renderStores: function() { 
					var m = this;
					// m.bottomAdList(); 
					m.ruleList();  

					console.log('1')
					// m.$nextTick(function () {
					//   	// DOM 更新了
					//   	$('.img').picLazyLoad({
					// 		effect: 'fadeIn',
					// 		threshold: '420'
					// 	})
					// });
				},
				bottomAdList: function() {
					var m = this,
						data = __data__.storesData,
	                    items = '';
	                    console.log(data);
	                if (!data) {
	                	return false;
	                }
	                for (var i=0; i<data.length; i++) {
	                    items += '<li><a href="' + data[i].link + '"><img src="' + data[i].imgUrl.replace(/^http(s)?:/, '') + '" width="100%"/></a></li>'
	                }
	                $('#bottomAd ul').html(items);
				},
				ruleList: function() {
					var m = this,
						data = m.storesData;
						rule_li = '';
						console.log(data)
					if (!data) {
	                	return false;
	                }
	                // for (var i=0, len=data.length; i<len; i++) {
	                //     rule_li += '<li>' + data[i].title.replace(/&/g, '<br>') + '</li>'
	                // }
	                // $('.ruleBox').show(200).find('.ruleUl').html(rule_li);
				}
			},
			mounted: function() {
				this.init();
			}
		})
    });

});







