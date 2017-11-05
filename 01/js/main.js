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
	//
	var uleUrl = location.host.substring(location.host.indexOf('.') + 1);
	var ulecdn = uleUrl.indexOf('beta') > -1 ? 'beta.ulecdn.com' : 'ulecdn.com';
    var url = location.href;

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

	// 全局变量
  	var __global = {
  		Date: '11.1-11.11',
  		isHideDate: false,
  		bottomAdKey: ''
  	}

  	// 实例化Vue
	var vm = new Vue({
		el: '#app',
		data: {
	        keys: {
	        	prds: ["11_pro_2_jxw", "11_pro_3_cp"],
	        	stores: ["11_pro_3_rule"]
	        },
	        oDatas: {
	        	prdsData: {},
	        	storesData: {}
	        },
			api: {
	            queryCouponList: "//prize." + uleUrl + "/mc/m/api/v2/base/coupon/couponListBySearch?",
	            receiveCoupon: "//prize." + uleUrl + "/mc/m/api/v2/base/coupon/receiveCoupon",
	            getPrdsUrl: "//static-content."+ ulecdn +"/mobilead/recommond/dwRecommond.do?restype=2001",
	            getStoresUrl: "//static-content."+ ulecdn +"/mobilead/recommond/dwRecommond.do?restype=2002"
	        },
	        shopUrl: '//m.ule.com/item/detail/', //定义跳转到shop页面
	        
		},
		created: function() {

		},
		methods: {
			init: function() {
				var m = this;
				m.province = url.getQueryValue('province');
				if (m.province === 'jiangsu') {
					__global.bottomAdKey = '919_pro_js_bottom';
					m.keys.stores.push(__global.bottomAdKey);
				}
				if (m.province === 'jilin') {
					__global.isHideDate = true;
				}
				m.getPrds(m.keys.prds.join(','));
				m.getStores(m.keys.stores.join(','), m.renderStores);
			},
			getPrds: function(keyStr) {
            	// 定义m变量，让它指向this,this是当前的Vue实例
				var m = this;
				__.Ajax.execute({
					url: m.api.getPrdsUrl,
	                data: {	
	                    moduleKeys: keyStr
	                },
	                jsonpCallback: "jsonApiCallback1",
	                success: function(obj) {
	                	for (var k in obj) {
							var data = obj[k],
								items = '',
								container = '';
							// 判断商品列表对应的父元素
							switch (k) {
								case m.keys.prds[0]:
									container = '#shop01 > .list > ul';
									break;
								case m.keys.prds[1]: 
									container = '#shop02 > .list > ul';
									break;
								default: ;
							}
							//
							data.length = 4;
							for (var i=0, len=data.length; i<len; i+=1) {
								var item 		= data[i];
			                    item.itemUrl 	= m.shopUrl + item.listingId;
			                    item.imgUrl 	= item.imgUrl.replace(/^http(s)?:/, '');
			                    items += item_li_0.substitute(item);
							}

							$(container).html(items);
							document.addEventListener('DOMNodeInserted',function(){
								$('.img').picLazyLoad({
									effect: 'fadeIn',
									threshold: '420'
								})
							},false);
						}
	                }
				})
			},
			getStores: function(keyStr, callback) {
				var m = this;
				__.Ajax.execute({
					url: m.api.getStoresUrl,
	                data: {	
	                    sectionKeys: keyStr
	                },
	                jsonpCallback: "jsonApiCallback3",
	                success: function(obj) {
	                	$.extend(m.oDatas.storesData, obj);
	                	(typeof callback === 'function') && callback();
	                }
				})
			},
			renderStores: function() { 
				var m = this;
				m.bottomAdList(); 
				m.ruleList();  

				m.$nextTick(function () {
				  	// DOM 更新了
				  	$('.img').picLazyLoad({
						effect: 'fadeIn',
						threshold: '420'
					})
				});
			},
			bottomAdList: function() {
				var m = this,
					data = m.oDatas.storesData[__global.bottomAdKey],
                    items = '';
                if (!data) {
                	return false;
                }
                // for (var i=0; i<data.length; i++) {
                //     items += '<li><a href="' + data[i].link + '"><img src="' + data[i].imgUrl.replace(/^http(s)?:/, '') + '" width="100%"/></a></li>'
                // }
                // $('#bottomAd ul').html(items);
                Vue.component('item-list', {
                	'template': '<ul><li v-for="item in data">{{ item.link }}</li></ul>',
                	data: function() {
                		return data
                	}
                });


			},
			ruleList: function() {
				var m = this,
					data = m.oDatas.storesData['11_pro_3_rule'];
					rule_li = '';
				if (!data) {
                	return false;
                }
                for (var i=0, len=data.length; i<len; i++) {
                    rule_li += '<li>' + data[i].title.replace(/&/g, '<br>') + '</li>'
                }
                $('.ruleBox').show(200).find('.ruleUl').html(rule_li);
			}
		},
		components: {
		  	'date-component': {
				template: '<div class="act-date abs" v-bind:class="{ hide: isHideDate }">'
					  	+    '活动时间<br>{{ Date }}'
					  	+  '</div>',
				data: function() {
					return __global;
				}
			},
			'ad-component': {
				template: '<section id="bottomAd">'
				      	+	'<div class="list">'
				      	+     '<ul class="ul-style clearfix"><item-list></item-list></ul>'
				      	+   '</div>'
					    + '</section>',
			    data: function() {
			    	return __global;
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
			    	return __global;
			    }
			}
		},
		mounted: function() {
			this.init();
		}
	})


});







