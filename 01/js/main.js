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
	var uleUrl = location.host.substring(location.host.indexOf('.') + 1);
	var ulecdn = uleUrl.indexOf('beta') > -1 ? 'beta.ulecdn.com' : 'ulecdn.com';
    var url = location.href;
  	var __global__ = {
  		date: '11.1-11.11',
  		isHideDate: false,
  		bottomAdKey: ''
  	};

    // 列表模板
    var item_li_0 = '<li class="{isHide}"><a href="{itemUrl}">\
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
	        shopUrl: '//m.ule.com/item/detail/', //定义跳转到shop页面
			api: {
	            queryCouponList: "//prize." + uleUrl + "/mc/m/api/v2/base/coupon/couponListBySearch?",
	            receiveCoupon: "//prize." + uleUrl + "/mc/m/api/v2/base/coupon/receiveCoupon",
	            getPrdsUrl: "//static-content.ulecdn.com/mobilead/recommond/dwRecommond.do?restype=2001",
	            getStoresUrl: "//static-content.ulecdn.com/mobilead/recommond/dwRecommond.do?restype=2002"
	        },
	        keys: {
	        	prds: ["11_pro_2_jxw", "11_pro_3_cp"],
	        	stores: ["11_pro_3_rule"]
	        },
	        oDatas: {
	        	prdsData: {},
	        	storesData: {}
	        },
	        rules: [],
	        bottomAds: []
		},
		created: function() {

		},
		filters: {
			capitalize: function (value) {
				if (!value) return ''
				value = value.toString()
				return value.charAt(0).toUpperCase() + value.slice(1)
			},
			noHttp: function(value) {
				return value.replace(/^http(s)?:/, '');
			}
		},
		methods: {
			init: function() {
				var m = this;
				m.province = url.getQueryValue('province');
				if (m.province === 'jiangsu') {
					__global__.bottomAdKey = '919_pro_js_bottom';
					m.keys.stores.push(__global__.bottomAdKey);
				}
				if (m.province === 'jilin') {
					__global__.isHideDate = true;
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
	                	// console.log(obj)

	                	for (var k in obj) {
							var data = obj[k],
								items = '',
								container = '';
							// 判断商品列表对应的父元素
							switch (k) {
								case m.keys.prds[0]:
									container = '#shop01';
									break;
								case m.keys.prds[1]: 
									container = '#shop02';
									break;
								default: ;
							}
							// data.length = 4;
							for (var i=0, len=data.length; i<len; i+=1) {
								var item 		= data[i];
                       			item.isHide 	= i > 5 ? 'hide' : '';
			                    item.itemUrl 	= m.shopUrl + item.listingId;
			                    item.imgUrl 	= item.imgUrl.replace(/^http(s)?:/, '');
			                    items += item_li_0.substitute(item);
							}

							// console.log(items)
							// 商品少于6个， 移除更多商品按钮
		                    if (data.length <= 6) {
		                        $(container).find('.listMore').remove();
		                    }
							$(container).show().find('ul').html(items);
							$('.img').picLazyLoad({
								effect: 'fadeIn',
								threshold: '420'
							})
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
	                	(callback && typeof callback === 'function') && callback.call(this);
	                }
				})
			},
			renderStores: function() { 
				var m = this;
				m.bottomAdList(); 
				m.ruleList();  

			},
			// 其他活动banner
			bottomAdList: function() {
				var m = this;
				m.bottomAds = m.oDatas.storesData[__global__.bottomAdKey];

			},
			// 活动规则
			ruleList: function() {
				var m = this;
				var oRules = m.oDatas.storesData[m.keys.stores[0]];
            	oRules.forEach(function(item, i){
            		item.title = item.title.replace(/&/g, '<br>');
            	});
            	m.rules = oRules;
			}
		},
		components: {
			// 活动日期显示
		  	'date-component': {
				template: '<div class="act-date abs" v-bind:class="{ hide: isHideDate }">'
					  	+   '活动时间<br>{{ date }}'
					  	+ '</div>',
				data: function() {
					return __global__;
				}
			},
			// 商品列表展开按钮
			'list-more-btn': {
				template: '<a class="listMore" v-bind:class="{ checked: isChecked }" @click="toggleBtn">'
						+	'<span>{{ btnTxt }}</span><i class="icon icon-arr-down"></i>'
						+ '</a>',
				data: function() {
					return {
						isChecked: false,
						btnTxt: '更多商品'
					}
				},
				methods: {
					toggleBtn: function() {
	                    var items  = $(this.$el).prev().find('li');
	                    var list_h = $(this.$el).prev().height();
	                    var btn_t  = $(this.$el).offset().top;
	                    console.log(btn_t, list_h)
						this.isChecked = !this.isChecked;
						if (!this.isChecked) {
							this.btnTxt = '更多商品';
							$('html, body').scrollTop(btn_t - list_h + 400);
						} else {
							this.btnTxt = '收起商品';
						}
	                    for (var i=6, len=items.length; i<len; i++) {
	                        var item = $(items[i]);
	                        if (item.hasClass('hide')) {
	                            item.removeClass('hide');
	                        } else {
	                            item.addClass('hide');
	                        }
	                    }
					}
				}
			}
		},
		mounted: function() {
			this.init();
		}
	})

});







