define(['zepto'], function(){

	// 扩展Array
	 $.extend(Array.prototype, {
        indexOf: function(val) {
            for (var i = 0; i < this.length; i++) {
                if (this[i] == val)
                    return i
            }
            return -1
        },
        remove: function(val) {
            var index = this.indexOf(val);
            if (index > -1) {
                return this.splice(index, 1)
            }
        }
    });

	// 扩展String 
    $.extend(String.prototype, {
        trim: function() {
            return this.replace(/(^\s*)|(\s*$)/g, '')
        },
        format: function() {
            var result = this;
            if (arguments.length > 0) {
                var parameters = (arguments.length == 1 && $.isArray(arguments[0])) ? arguments[0] : $.makeArray(arguments);
                $.each(parameters, function(i, n) {
                    result = result.replace(new RegExp("\\{" + i + "\\}","g"), n)
                })
            }
            return result
        },
        substitute: function(data) {
            if (data && typeof (data) == 'object') {
                return this.replace(/\{([^{}]+)\}/g, function(match, key) {
                    var value = data[key];
                    return (value !== undefined) ? '' + value : ''
                })
            } else {
                return this.toString()
            }
        },
        parseJSON: function() {
            return (new Function("return " + this.toString()))()
        },
        parseDate: function() {
            return (new Date()).parse(this.toString())
        },
        replaceAll: function(os, ns) {
            return this.replace(new RegExp(os,'gm'), ns)
        },
        parseAttrJSON: function() {
            var d = {}
              , a = this.toString().split(';');
            for (var i = 0; i < a.length; i++) {
                if (a[i].trim() === '' || a[i].indexOf(':') < 1)
                    continue;
                var item = a[i].sliceBefore(':').trim()
                  , val = a[i].sliceAfter(':').trim();
                if (item !== '' && val !== '')
                    d[item.toCamelCase()] = val._toRealValue()
            }
            return d
        },
        padLeft: function(width, ch) {
            if (this.length >= width)
                return this.toString();
            return this._pad(width, ch, 0)
        },
        _pad: function(width, ch, side) {
            var str = [side ? '' : this, side ? this : ''];
            while (str[side].length < (width ? width : 0) && (str[side] = str[1] + (ch || ' ') + str[0]))
                ;
            return str[side]
        },
        isMobile: function() {
            return ( new RegExp(/^(13|14|15|17|18)\d{9}$/).test(this.trim()))
        },
        sliceAfter: function(str) {
            return (this.indexOf(str) >= 0) ? this.substring(this.indexOf(str) + str.length, this.length) : ''
        },
        sliceBefore: function(str) {
            return (this.indexOf(str) >= 0) ? this.substring(0, this.indexOf(str)) : ''
        },
        escapeReg: function() {
            return this.replace(new RegExp("([.*+?^=!:\x24{}()|[\\]\/\\\\])","g"), '\\\x241')
        },
        getQueryValue: function(name) {
            var reg = new RegExp("(^|&|\\?|#)" + name.escapeReg() + "=([^&]*)(&|\x24)","");
            var match = this.match(reg);
            return (match) ? match[2] : ''
        }
    });

    // 判断浏览器类型方法
    $.browser = $.browser || {};
    $.extend($.browser, (function() {
        var ua = navigator.userAgent.toLowerCase(), os, version;
        if (ua.indexOf('uleapp/') > 0) {
            version = ua.sliceAfter('uleapp/').split('_')[3];
            os = ua.sliceAfter('uleapp/').sliceBefore('_');
            if (ua.sliceAfter('uleapp/').split('_')[1] == 'ule') {
                var uappType = {
                    ule: true,
                    ylxd: false,
                    ysh: false,
                    hrysh: false
                }
            } else if (ua.sliceAfter('uleapp/').split('_')[1] == 'ysh') {
                var uappType = {
                    ule: false,
                    ylxd: false,
                    ysh: true,
                    hrysh: false
                }
            } else if (ua.sliceAfter('uleapp/').split('_')[1] == 'hrysh') {
                var uappType = {
                    ule: false,
                    ylxd: false,
                    ysh: false,
                    hrysh: true
                }
            } else {
                var uappType = {
                    ule: false,
                    ylxd: true,
                    ysh: false
                }
            }
            var appobj = $.extend({
                ios: os == 'ios',
                android: os == 'android',
                version: version
            }, uappType);
            return appobj
        } else if (ua.indexOf('uzgapp/') > 0) {
            version = ua.sliceAfter('uzgapp/').split('_')[3];
            os = ua.sliceAfter('uzgapp/').sliceBefore('_');
            return {
                uzg: true,
                wx: false,
                ios: os == 'ios',
                android: os == 'android',
                version: version
            }
        } else {
            return {
                ule: false,
                uzg: false,
                ylxd: false,
                ysh: false,
                hrysh: false,
                wx: ua.match(/micromessenger/i),
                ios: ua.match(/(iphone|ipod|ipad);?/i),
                android: ua.match(/android/i)
            }
        }
    })());

    // 分享
    var shareCall = function() {
        var title = "邮乐爽11购物节，百万爆款随你抢，亿万好券任你领，邀你一起来狂欢！"
          , content = "邮乐爽11购物节，百万爆款随你抢，亿万好券任你领，邀你一起来狂欢！"
          , imgUrl = "//i0.ulecdn.com/i/event/2017/1111/h5index/index_log.jpg"
          , linkUrl = location.href + '&ulespring=true';
        var linkStr = title + "##" + content + "##" + imgUrl + "##" + linkUrl + "&&WX##WF##QQ";
        if ($.browser.android) {
            window.group.jsMethod(linkStr)
        } else if ($.browser.ios) {
            return linkStr
        } else {
            return linkStr
        }
    };
    window.shareCall = shareCall;

    // 黑色小弹框
    var toast = (function(){
        var _toast, _timer;
        return function(msg){
            if(!msg) return;
            _toast && clearTimeout(_timer);
            if(!_toast){
                _toast = $('<div class="toast-wrap"><div class="toast"></div></div>');
                _toast.appendTo('body');
            }
            _toast.show().children('.toast').html(msg).addClass('toast-in');
            _timer = setTimeout(function(){
                if(!_toast) return;
                _toast.children('.toast').removeClass('toast-in');
                setTimeout(function(){
                    _toast.hide();
                }, 500)
            }, 2000)
        }
    }());
    window.toast = toast;

	// 数据请求
	var Ajax = {
		needLoading: false,
		execute: function (options) {
			var o = $.extend({}, {
				type: 'GET'
				,url: ''
				,async: true
				,cache: true
				,timeout: 3000
				,jsonp: ''
				,jsonpCallback: ''
				,headers: {}
				,data: {}
				,success: function() {}
				,complete: function () {}
			}, options);
			$.ajax({
				type: o.type
				,url: o.url
				,cache: o.cache
				,async: o.async
				,beforeSend: function (){
					if (o.loading === true) {
						$('.loading').show();
					} else if (o.loading === false) {
					
					} else {
						Ajax.needLoading = true;
						setTimeout(Ajax.delayLoading, 500);
					}
				}
				,data: o.data
				,dataType: 'jsonp'
                ,jsonp: "jsonApiCallback"
                ,jsonpCallback: o.jsonpCallback
                ,headers: {
                    "Accept-Encoding": "gzip,deflate"
                }
				,timeout: o.timeout
				,success: function (res) {
                    if (typeof res === 'string') {
                        res = JSON.parse(res);
                    }
                    if (res.errorMsg) {
                        tipBox(res.errorMsg)
                    } else {
                        o.success(res);
                    }
				}
				,error: this.errorHandler
				,complete: function () {
					Ajax.needLoading = false;
					$('.loading').hide();
					o.complete();
				}
			});
		},
		errorHandler: function (jqXHR, textStatus, errorThrown) {
			// var errorCodes = {
			// 	2: '接收到了错误的数据类型。'
			// 	,4: '您访问的页面不存在。'
			// 	,5: '系统发生了故障，请再试一次。'
			// };
			// var errorMessage = '网络不通畅。';
			// var status = data.status.toString().charAt(0);
			// if (errorCodes[status])
			// {
			// 	errorMessage = errorCodes[status];
			// }
			// if (errorMessage) {
			// 	toast(errorMessage);
			// }
		},
		delayLoading: function () {
			if (Ajax.needLoading) {
				$('.loading').show();
			}
		}
	};


	return {
		Ajax: 	Ajax,
		toast: toast
	}
})
