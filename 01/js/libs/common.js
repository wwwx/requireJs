define(function(){

	// 数据请求
	var Ajax = {
		needLoading: false,
		execute: function (options) {
			var _default = {
				type: 'GET'
				,url: ''
				,async: true
				,cache: false
				,timeout: 3000
				,jsonp: ''
				,jsonpCallback: ''
				,headers: {}
				,data: {}
				,success: function() {}
				,complete: function () {}
			};
			var o = $.extend({}, _default, options);
			$.ajax({
				type: 'POST'
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
				,jsonp: o.jsonp
				,jsonpCallback: o.jsonpCallback
				,headers: o.headers
				,success: function (data) {
					o.success(data);
					// if (data.error_code) {
					// 	toast(data.error_msg);
					// } else {
					// 	if (data.data) {
					// 		data = data.data;
					// 	}
					// 	o.success(data);
					// }
				}
				,error: this.errorHandler
				,complete: function () {
					Ajax.needLoading = false;
					$('.loading').hide();
					o.complete();
				}
			});
		},
		errorHandler: function (status) {
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
		Ajax: Ajax
	}
})
