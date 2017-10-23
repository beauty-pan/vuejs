Vue.component('orderDetail',{
        template:` <div id="orderdetail">
		<div class="container-fluid padding-container detailContent">

			<div class='ayb-detail-box'>
				<h3><img src='./src/assets/images/ayb_allianz_logo.png' /></h3>
				<ul>
					<li>
						<h4>保单信息</h4>
						<div class='row'><div class='col-xs-4'>保险名称</div>
							<div class='col-xs-8'>{{insuredPerson.insuranceName}}</div>
							<div class='col-xs-4'>保单号</div>
							<div class='col-xs-8'>{{insuredPerson.policyNum}}</div>
							<div class='col-xs-4'>保险期间</div>
							<div class='col-xs-8'>{{infors.effectiveDate}}~{{infors.expirationDate}}</div>
							</div>
					</li>
					<li>
						<h4>投保人</h4>
						<div class='row'>
							<div class='col-xs-6'>投保人姓名</div>
							<div class='col-xs-6'>{{policyHolders.insuredName}}</div>
							<div class='col-xs-6'>身份证号</div>
							<div class='col-xs-6'>{{policyHolders.identifyNumber}}</div>
							<div class='col-xs-6'>手机号</div><div class='col-xs-6'>{{policyHolders.mobile}}</div>
							<div class='col-xs-6'>邮箱</div><div class='col-xs-6'>{{policyHolders.email}}</div>
						</div>
					</li>
					 <li>
						 <h4>被保人</h4>
						 <div class='row'>
								<div class='col-xs-6'>与投保人关系</div>
								<div class='col-xs-6' v-if="insuredLists.policyholderInsuredRelation==01">本人</div>
							 <div class='col-xs-6' v-if="insuredLists.policyholderInsuredRelation==02">父母</div>
							 <div class='col-xs-6' v-if="insuredLists.policyholderInsuredRelation==03">配偶</div>
							 <div class='col-xs-6' v-if="insuredLists.policyholderInsuredRelation==04">儿女</div>
								<div class='col-xs-6'>姓名</div>
								<div class='col-xs-6'>{{insuredLists.insuredName}}</div>
								 <div class='col-xs-6'>身份证号</div>
								<div class='col-xs-6'>{{insuredLists.identifyNumber}}</div>
							</div>
						</li>
					 <li>
						 <h4>保额/保费</h4>
						 <div class="row" v-for="Fee in	insuredPerson.vehicleCoverageList"><div class="col-xs-6">{{Fee.kindName}}</div> <div class="col-xs-6">{{Fee.modeCode}}</div></div>
						</li>
					 </ul>
				<h5 class='row'> <div class='col-xs-6'>保费</div>
					<div class='col-xs-6'>￥{{insuredPerson.totalPremium}}</div></h5></div>
		</div>
		<footer>
			<div class="row">
				<div class="col-xs-12"><div class="btn btn-danger applayFee"
											@click='applayOrder(infors.agreementStatus,infors.aybPolicy)'
											v-if="infors.agreementStatus=='Payed_Pending'">￥{{insuredPerson.totalPremium}}去支付</div></div>
			</div>
		</footer>
		<div id="orderPay"></div>
   </div>`,
        data(){
            return {
                title:"订单详情",
                insuredRelation:{},
                insuredPerson:{},
                infors:"",
                policyHolders:{},
                insuredLists:{},
                orderIds:this.$route.query
            }
        },
    created(){
            var orderDetail_=this;
           // agreementId=sessionStorage.getItem("orderId");
        var agreementId=orderDetail_.orderIds.id;
            var url= BAF.contextPath+"/sgw/v1/agreements/ayb/"+agreementId+"?agreementId="+agreementId;
            doGet(url,null).done(function (msg) {
                stopLoading();
                if(msg){
                    orderDetail_.insuredPerson=JSON.parse(msg.aybAgreementInfo.aybPolicy);
                    orderDetail_.infors=msg.aybAgreementInfo;
                    orderDetail_.insuredRelation=JSON.parse(msg.aybAgreementInfo.aybPolicy).insuredList[0];
                    orderDetail_.policyHolders=JSON.parse(msg.aybAgreementInfo.aybPolicy).policyHolder;//投保人信息
                    orderDetail_.insuredLists=JSON.parse(msg.aybAgreementInfo.aybPolicy).insuredList[0];//被保人信息
                    console.log(JSON.parse(msg.aybAgreementInfo.aybPolicy).form);
                }
            }).fail(function(XMLRequest){
              console.log(XMLRequest);
            })
        },
        methods:{
            applayOrder(status,appUrl){
                    if(status=="Payed_Pending"){ //待支付
                        var fromOrder=JSON.parse(appUrl).form;
                        console.log(fromOrder);
                        localStorage.setItem('payForm',fromOrder);
                        //$("#orderPay").html(from);
                          window.location.href="src/test.html";
                       // $("#payDIv form").attr("target", "_self").submit();
                        alert(fromOrder);
                        stopLoading();

                    }
                }


    //添加引导页
      /*      applay(status,appUrl){
                var UA = navigator.userAgent.toLowerCase();
				if(UA.match(/MicroMessenger/i)=="micromessenger") {
					var wechatPayTipStr = '<div class="wechat-pay-tip" id="wechatPayTip"></div>';
					if(UA.indexOf("iphone") != -1){
						$(document.body).append(wechatPayTipStr);
						$("#wechatPayTip").addClass("pay-tip-ios");
					} else {
						$(document.body).append(wechatPayTipStr);
					}
					$("#wechatPayTip").on("touchend",function(){
						$(this).remove();
					});
				}else if(status=="Payed_Pending"){ //待支付
                    var from=JSON.parse(appUrl).form;
                    $("#payDIv").html(from);
                    stopLoading();

                }
            }*/
        }
});
