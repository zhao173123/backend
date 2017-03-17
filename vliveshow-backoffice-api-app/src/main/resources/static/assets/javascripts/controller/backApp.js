var backStart = angular.module("backApp",['ui.router', 'ngRoute', 'ngFileUpload']);
backStart.config(['$stateProvider', '$urlRouterProvider', '$httpProvider', function($stateProvider, $urlRouterProvider, $httpProvider){

	$urlRouterProvider.otherwise("/sign_in");
	$stateProvider.state('signIn',{  // sign in
		url:'/sign_in',
		templateUrl: 'pages/sign_in.html',
		// controller: 'loginCtrl'
	}).state('home',{  //home
		url:'/home',
		templateUrl: 'pages/home.html',
		// controller: 'backCtrl'
	}).state('home.relation', {  // 用户关系管理
		url:'/relation:navIndex',
		templateUrl: 'pages/user/user_center_relation.html',
		// controller: 'relationCtrl'
	}).state('home.anchor', {  // 主播管理
		url:'/anchor:navIndex',
		templateUrl: 'pages/user/user_center_anchor.html',
		// controller: 'anchorCtrl'
	}).state('home.moreInfoUser', {  // 用户详情
		url:'/moreInfoUser?userId&navIndex',
		templateUrl: 'pages/user/user_moreInfo.html',
		// controller: 'moreInfoCtrl'
	}).state('home.moreInfoAnchor', {  // 主播详情
		url:'/moreInfoAnchor?userId&navIndex',
		templateUrl: 'pages/user/anchor_moreInfo.html',
		// controller: 'anchorInfoCtrl'
	}).state('home.hostAudit', {  // 主播审核
		url:'/hostAudit:navIndex',
		templateUrl: 'pages/user/user_center_audit.html',
		// controller: 'auditCtrl'
	}).state('home.violate', {  // 违禁管理
		url:'/violate:navIndex',
		templateUrl: 'pages/user/user_center_violate.html',
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
		templateUrl: 'pages/monitor/monitor_flow.html',
		// controller: 'monitorFlowCtrl'
	}).state('home.priority', {  // 优先级设置
		url:'/priority:navIndex',
		templateUrl: 'pages/cms/priority_set.html',
		// controller: 'prioritySetCtrl'
	}).state('home.content', {  // 内容管理
		url:'/content:navIndex',
		templateUrl: 'pages/cms/configure_content.html',
		// controller: 'contentCtrl'
	}).state('home.gift', {  // 礼物管理
		url:'/gift:navIndex',
		templateUrl: 'pages/cms/configure_gift.html',
		// controller: 'giftCtrl'
	}).state('home.replay', {  // 回放管理
		url:'/replay:navIndex',
		templateUrl: 'pages/cms/configure_replay.html',
		// controller: 'replayCtrl'
	}).state('home.bookCreate', {  // 创建订阅
		url:'/bookCreate:navIndex',
		templateUrl: 'pages/cms/booking_create.html',
		// controller: 'bookingCtrl'
	}).state('home.bookResearch', {  // 查询订阅
		url:'/bookResearch:navIndex',
		templateUrl: 'pages/cms/booking_research.html',
		// controller: 'bookingListCtrl'
	}).state('home.bookingInfo', {  // 订阅详情
		url:'/bookingInfo?classId&navIndex',
		templateUrl: 'pages/cms/booking_info.html',
		// controller: 'bookingInfoCtrl'
	}).state('home.sendMessage', {  // 发送短信
		url:'/sendMessage:navIndex',
		templateUrl: 'pages/tool/send_message.html',
		// controller: 'messageCtrl'
	}).state('home.financeApply', {  // 结算申请
		url:'/financeApply:navIndex',
		templateUrl: 'finance_apply.html',
		// controller: 'financeApplyCtrl'
	}).state('home.financeOrder', {  // 结算工单
		url:'/financeOrder:navIndex',
		templateUrl: 'finance_order.html',
		// controller: 'financeOrderCtrl'
	}).state('home.adsplash', {  // 开屏广告
		url:'/adsplash:navIndex',
		templateUrl: 'pages/cms/tab_adsplash.html'
	}).state('home.autoConfig', {  // 置顶参数配置
		url:'/autoConfig:navIndex',
		templateUrl: 'pages/configuration/configure_autoConfig.html'
	}).state('home.roomTitleSet', {  // 设置直播间标题
        url:'/roomTitleSet:navIndex',
        templateUrl: 'pages/tool/room_title_set.html'
	}).state('home.scoreComment', {  // 直播间评论查询
        url:'/scoreComment:navIndex',
        templateUrl: 'pages/tool/score_comments.html'
	}).state('home.hotRecommend', {  // 热门推荐
        url:'/hotRecommend:navIndex',
        templateUrl: 'pages/cms/hot_recommend.html'
    }).state('home.dutySchedule', {  // 排班
        url:'/dutySchedule:navIndex',
        templateUrl: 'pages/tool/duty_schedule.html'
    });

	$httpProvider.defaults.useXDomain = true;
	$httpProvider.defaults.headers.common = 'Content-Type: application/json';
	delete $httpProvider.defaults.headers.common['X-Requested-With'];
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
			"name": "内容管理",
			"active":false,
			"icon":"icon-cog",
			"subNav":[
				{
					"name":"Banner管理",
					"active":false,
					"route":"content",
					"templateUrl":"configure_content.html"
				},{
					"name":"回放管理",
					"active":false,
					"route":"replay",
					"templateUrl":"configure_replay.html"
				},{
					"name":"优先级设置",
					"active":false,
					"route":"priority",
					"templateUrl":"priority_set.html"
				},{
					"name":"礼物配置",
					"active":false,
					"route":"gift",
					"templateUrl":"configure_gift.html"
				},{
					"name":"创建订阅",
					"active":false,
					"route":"bookCreate",
					"templateUrl":"booking_create.html"
				},{
					"name":"查询订阅",
					"active":false,
					"route":"bookResearch",
					"templateUrl":"booking_research.html"
				},{
					"name":"开屏广告管理",
					"active":false,
					"route":"adsplash",
					"templateUrl":"tab_adsplash.html"
				},{
					"name":"热门推荐",
					"active":false,
					"route":"hotRecommend",
					"templateUrl":"hot_recommend.html"
				}
			]
		},{
			"name": "配置中心",
			"active":false,
			"icon":"icon-sitemap",
			"subNav":[
				{
					"name":"自动置顶参数配置",
					"active":false,
					"route":"autoConfig",
					"templateUrl":"configure_autoConfig.html"
				}
			]
		},{
			"name": "工具中心",
			"active":false,
			"icon":"icon-envelope",
			"subNav":[
				{
					"name":"短信群发",
					"active":false,
					"route":"sendMessage",
					"templateUrl":"send_message.html"
				},{
                    "name":"直播间标题设置",
                    "active":false,
                    "route":"roomTitleSet",
                    "templateUrl":"room_title_set.html"
                },{
					"name":"直播间评论",
					"active":false,
					"route":"scoreComment",
					"templateUrl":"score_comments.html"
				},{
					"name":"排班",
					"active":false,
					"route":"dutySchedule",
					"templateUrl":"duty_schedule.html"
				}
                // ,{
				// 	"name":"周排行榜",
				// 	"active":false,
				// 	"route":"ranking",
				// 	"templateUrl":"tool_rankings.html"
				// }
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