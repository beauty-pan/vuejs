Vue.component('orderLists', {
	template: `<div id="app-2">
                    <div class="container-fluid" style="height: 100%;">
                            <div class="ayb-tab-cnt">
                            <div class="swiper-container">
                            <div class="swiper-wrapper" id="MyAYBList">
                            <div class='swiper-slide' v-for="result in resultLists">
                            <a>
                            <div class='ayb-cnt-top health-cnt-top' v-on:click="orderDetails(result.agreementId)"><h5>{{result.insuranceName}}</h5><h6>由安联财产保险提供保障</h6><i></i>
                        		<div class='ayb-cnt-tag' v-if="result.policyStatus == 4"><span>待支付</span></div>
                            <div class='ayb-cnt-tag' v-if="result.policyStatus == 5"><span class="dashed-border">已投保</span></div>
                            <div class='ayb-cnt-tag' v-if="result.policyStatus == 6"><span>保障中</span></div>
                            <ul class='ayb-cnt-line'>
                            <li class='row insuranceNum'><div class='col-xs-6'>保单号</div><div class='col-xs-6'>{{result.policyNO}}</div></li>
	                        <li class='row'><div class='col-xs-6'>投保人</div><div class='col-xs-6'>{{result.policyRoleList[0].insuredName}}</div></li>
	                        <li class='row'><div class='col-xs-6'>被保险人</div><div class='col-xs-6'>{{result.policyRoleList[1].insuredName}}</div></li>
	                        <li class='row' v-if="result.policyStatus != 4"><div class='col-xs-6'>保障期间</div><div class='col-xs-6'>{{result.effectiveDate}}-{{result.expirationDate}}</div></li>
	                        <li class='row' v-if="result.policyStatus == 4"><div class='col-xs-6'>生效日期</div><div class='col-xs-6'>{{result.effectiveDate}}</div></li>
	                        <li class='row'><div class='col-xs-6'>保费</div><div class='col-xs-6'>￥{{result.premium}}</div></li>
                        </ul>
                        </div>
                        <div class='ayb-cnt-bot health-cnt-bot'>
                            <div class='row'>
                            <div class='col-xs-6 to-AYB-flow' v-on:click="flows()"><i></i><p>理赔流程</p></div>
                            <div class='col-xs-6' v-on:click='orderLoad(result.epolicyUrl)'><i></i><p>电子保单</p></div>
                            </div>
                            </div>
                            </a>
                            </div>
                            </div>
                            <div class="swiper-pagination"></div>
                            <div class="swiper-pagination-index text-center" id="listLenth">1/{{resultListsLength}}</div>
                        <div class="ayb-no-record"><i></i><p>您还没有为您的爱人投保哦~</p></div>
                        </div>
                        </div>
                      <div class="my-ayb-buy-box"><a class="my-ayb-buy" @click="toProductDetail()"><i></i>为爱人投保</a></div>
                    </div>
                   </div>`,
	data() {
		return {
			resultListsLength: '',
			resultLists: []
		}
	},
	created() {
		/**获取用户所有订单**/
		var requestUrl = BAF.contextPath + "/sgw/v1/agreements/aybPolicy?productCode=AYB0021";
		var orderLists_ = this;
		doGet(requestUrl, null).done(function(msg) {
			if(msg.resultList.length==0){
				$(".ayb-no-record").show();
				$("#listLenth").hide();
				return;
			}else {
				orderLists_.resultLists = msg.resultList;
				orderLists_.resultListsLength = msg.resultList.length;
				console.log(msg);
				stopLoading();
			}
		}).fail(function(msg) {
			console.log(msg);
		})
	},
	updated() {
		/**页面数据渲染完毕执行swiper**/
		var orderLists_ = this;
		if(orderLists_.resultListsLength > 5) {
			$(".swiper-pagination").hide();
		} else {
			$(".swiper-pagination-index").hide();
		}
		var swiper = new Swiper('.swiper-container', {
			onSlideChangeStart: function(swiper) {
				$(".swiper-pagination-index").text((parseInt(swiper.activeIndex) + 1) + "/" + orderLists_.resultListsLength);
			},
			pagination: '.swiper-pagination',
			paginationClickable: true
		});
	},
	methods: {

		/**跳转至订单详情页面**/
		orderDetails(orderId) {
			//sessionStorage.setItem("orderId", orderId);
			this.$router.push({ path: '/orderDetail',query: {id:orderId}});
			//window.location.href="../vueHI/src/orderDetail2.html";
		},
		/**跳转至产品详情页面**/
		toProductDetail() {
			this.$router.push({ path: '/Products' });
		},
		/**用户电子保单**/
		orderLoad(urls) {
			window.open(urls);
		},
		/***理赔流程介绍**/
		flows() {
			var orderLists_ = this;
			this.$router.push({ path: '/flow' });
			//  window.location="AYB_flow.html";
		}
	}




});