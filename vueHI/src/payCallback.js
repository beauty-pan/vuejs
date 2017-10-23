var agreementId = localStorage.myagreementId;

Vue.component('payCallback', {
			template: `<div class="container-fluid padding-container applayResult">
	<div class="pay-callback">
		<!-- success S -->
		<div id="paySuccess" v-if="agreementStatus=='Payed'">
			<div class="pay-callback-state pay-callback-success"><i></i></div>
			<div class="pay-callback-detail">
				<div class="pay-callback-detail-t applay-title">
					<h4>{{ insuredPerson.insuranceName }}</h4>
					<h3>￥{{ insuredPerson.totalPremium }}</h3>
				</div>
				<ul class="pay-callback-detail-list">
					<li class="row">
						<div class="col-xs-5">支付方式</div><div class="col-xs-7 applay-type">{{ insuredPerson.payType }}</div>
					</li>
					<li class="row">
						<div class="col-xs-5">交易单号</div><div class="col-xs-7 applay-number">{{ insuredPerson.policyNum }}</div>
					</li>
					<li class="row">
						<div class="col-xs-5">下单时间</div><div class="col-xs-7 applay-time">{{ insuredPerson.payTime }}</div>
					</li>
					<li class="row">
						<div class="col-xs-5">投保人</div><div class="col-xs-7 applay-name">{{ policyHolder.insuredName }}</div>
					</li>
				</ul>
				<div class="pay-callback-detail-prod">
					<div class="pay-callback-prod-logo"><img src="../../images/allianz_logo.png" /></div>
					<div class="pay-callback-prod-info">安联财产保险</div>
				</div>
			</div>
		</div>
		<!-- success E -->
		<!-- fail S -->
		<div id="payFail" v-if="agreementStatus=='Payed_Error'">
			<div class="pay-callback-state pay-callback-fail">
				<i></i>
				<h4>支付失败</h4>
				<h5 id="failReason">交易已关闭</h5>
			</div>
			<div class="pay-callback-btn">
				<a class="btn" id="toPayBtn">去支付</a>
			</div>
		</div>
		<!-- fail E -->
		<!-- wating S -->
		<div id="payWating" v-if="agreementStatus=='Payed_Pending'">
			<div class="pay-callback-state pay-callback-fail">
				<i></i>
				<h4>支付结果确认中</h4>
				<h5>聪聪正在玩命确认中，请过会儿刷新查看</h5>
			</div>
			<div class="pay-callback-btn row">
				<div class="col-xs-6"><a class="btn">催促确认</a></div>
				<div class="col-xs-6"><a class="btn" href="javascript:location.reload();">刷新</a></div>
			</div>
		</div>
		<!-- wating E -->
	</div>
</div>`,
			data() {
				return {
					title: "支付结果",
					insuredPerson:{},
					agreementStatus:{}
				}
			},
			created() {
				var requestUrl =  BAF.contextPath + "/sgw/v1/agreements/ayb/" + agreementId + "?agreementId=" + agreementId;
				var callback_=this;
				doGet(requestUrl, null).done(function(res) {
					callback_.insuredPerson = JSON.parse(res.aybAgreementInfo.aybPolicy);
					callback_.policyHolder = callback_.insuredPerson.policyHolder;
					callback_.agreementStatus = res.aybAgreementInfo.agreementStatus;
				}).fail(function(msg) {
					console.log(msg);
					alertDefault(JSON.stringify(msg));
				});
			}
		});