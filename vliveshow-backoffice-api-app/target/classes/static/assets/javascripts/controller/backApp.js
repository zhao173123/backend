var backStart = angular.module("backApp",['ui.router', 'ngRoute', 'ngFileUpload']);
backStart.config(['$stateProvider', '$urlRouterProvider', '$httpProvider', function($stateProvider, $urlRouterProvider, $httpProvider){

	$urlRouterProvider.otherwise("/sign_in");
	$stateProvider.state('signIn',{  // sign in
		url:'/sign_in',
		templateUrl: 'sign_in.html',
		// controller: 'loginCtrl'
	}).state('home',{  //home
		url:'/home',
		templateUrl: 'home.html',
		// controller: 'backCtrl'
	}).state('home.relation', {  // 用户关系管理
		url:'/relation:navIndex',
		templateUrl: 'user_center_relation.html',
		// controller: 'relationCtrl'
	}).state('home.anchor', {  // 主播管理
		url:'/anchor:navIndex',
		templateUrl: 'user_center_anchor.html',
		// controller: 'anchorCtrl'
	}).state('home.moreInfoUser', {  // 用户详情
		url:'/moreInfoUser?userId&navIndex',
		templateUrl: 'user_moreInfo.html',
		// controller: 'moreInfoCtrl'
	}).state('home.moreInfoAnchor', {  // 主播详情
		url:'/moreInfoAnchor?userId&navIndex',
		templateUrl: 'anchor_moreInfo.html',
		// controller: 'anchorInfoCtrl'
	}).state('home.hostAudit', {  // 主播审核
		url:'/hostAudit:navIndex',
		templateUrl: 'user_center_audit.html',
		// controller: 'auditCtrl'
	}).state('home.violate', {  // 违禁管理
		url:'/violate:navIndex',
		templateUrl: 'user_center_violate.html',
		// controller: 'mailCtrl'
	}).state('home.mail', {  // 站内信
		url:'/mail:navIndex',
		templateUrl: 'user_center_mail.html',
		// controller: 'mailCtrl'
	}).state('home.notice', {  // 直播间公告
		url:'/notice:navIndex',
		templateUrl: 'user_center_notice.html',
		// controller: 'noticeCtrl'
	}).state('home.flow', {  // 流量监控
		url:'/flow:navIndex',
		templateUrl: 'monitor_flow.html',
		// controller: 'monitorFlowCtrl'
	}).state('home.content', {  // 内容管理
		url:'/content:navIndex',
		templateUrl: 'configure_content.html',
		// controller: 'contentCtrl'
	}).state('home.gift', {  // 礼物管理
		url:'/gift:navIndex',
		templateUrl: 'configure_gift.html',
		// controller: 'giftCtrl'
	}).state('home.bookCreate', {  // 创建订阅
		url:'/bookCreate:navIndex',
		templateUrl: 'booking_create.html',
		// controller: 'bookingCtrl'
	}).state('home.bookResearch', {  // 查询订阅
		url:'/bookResearch:navIndex',
		templateUrl: 'booking_research.html',
		// controller: 'bookingListCtrl'
	}).state('home.bookingInfo', {  // 订阅详情
		url:'/bookingInfo?classId&navIndex',
		templateUrl: 'booking_info.html',
		// controller: 'bookingInfoCtrl'
	}).state('home.financeApply', {  // 结算申请
		url:'/financeApply:navIndex',
		templateUrl: 'finance_apply.html',
		// controller: 'financeApplyCtrl'
	}).state('home.financeOrder', {  // 结算工单
		url:'/financeOrder:navIndex',
		templateUrl: 'finance_order.html',
		// controller: 'financeOrderCtrl'
	});

	$httpProvider.defaults.useXDomain = true;
	delete $httpProvider.defaults.headers
		.common['X-Requested-With'];
	$httpProvider.defaults.headers.post = {
		'Content-Type': 'application/json'
	}
}]);

//backStart.constant('AUTH_EVENTS', {
//	loginSuccess : 'auth-login-success',
//	loginFailed : 'auth-login-failed',
//	logoutSuccess : 'auth-logout-success'
//});

backStart.run(['$rootScope', '$state', '$location', 'AuthService', function($rootScope, $state, $location, AuthService){
	$rootScope.$on('$locationChangeStart', function(event, next){
		if(!AuthService.isLogined()){
			$location.path('/sign_in');
		}
	});
}]);

backStart.constant('NAV_DATA', {
	"navData": [
		{
			"name": "用户中心",
			"active":true,
			"icon":"icon-user",
			"subNav":[
				{
					"name":"用户关系管理",
					"active":true,
					"route":"relation",
					"templateUrl":"user_center_relation.html"
				},{
					"name":"主播管理",
					"active":false,
					"route":"anchor",
					"templateUrl":"user_center_anchor.html"

				},{
					"name":"主播审核",
					"active":false,
					"route":"hostAudit",
					"templateUrl":"user_center_audit.html"

				},{
					"name":"违禁管理",
					"active":false,
					"route":"violate",
					"templateUrl":"user_center_violate.html"

				}
				// ,{
				// 	"name":"站内信",
				// 	"active":false,
				// 	"route":"mail",
				// 	"templateUrl":"user_center_mail.html"
                //
				// },{
				// 	"name":"直播间公告",
				// 	"active":false,
				// 	"route":"notice",
				// 	"templateUrl":"user_center_notice.html"
                //
				// }
			]
		},{
			"name": "监控台",
			"active":false,
			"icon":"icon-desktop",
			"subNav":[
				{
					"name":"流量监控",
					"active":false,
					"route":"flow",
					"templateUrl":"monitor_flow.html"
				}
			]
		},{
			"name": "配置中心",
			"active":false,
			"icon":"icon-cog",
			"subNav":[
				{
					"name":"内容管理",
					"active":false,
					"route":"content",
					"templateUrl":"configure_content.html"
				},{
					"name":"礼物配置",
					"active":false,
					"route":"gift",
					"templateUrl":"configure_gift.html"
				}
			]
		},{
			"name": "课程订阅",
			"active":false,
			"icon":"icon-shopping-cart",
			"subNav":[
				{
					"name":"创建订阅",
					"active":false,
					"route":"bookCreate",
					"templateUrl":"booking_create.html"
				},{
					"name":"查询订阅",
					"active":false,
					"route":"bookResearch",
					"templateUrl":"booking_research.html"
				}
			]
		}
		// ,{
		// 	"name": "财务中心",
		// 	"active":false,
		// 	"icon":"icon-th-large",
		// 	"subNav":[
		// 		{
		// 			"name":"结算申请",
		// 			"active":false,
		// 			"route":"financeApply",
		// 			"templateUrl":"finance_apply.html"
		// 		},{
		// 			"name":"结算工单",
		// 			"active":false,
		// 			"route":"financeOrder",
		// 			"templateUrl":"finance_order.html"
		// 		}
		// 	]
		// }
	]
});