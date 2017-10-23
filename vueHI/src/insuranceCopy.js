/**
 *
 * 主要逻辑说明
 * 1、清空页面数据 重置数据， 去支付按钮为灰色，不可点击
 * 2、查询被保人信息
 * 3、填写投被保人信息后，重新计算保单价格（调用接口）
 * 4、保费重新计算后
 *
 * 投被保人数据发生改变时，清空保费字段，变为--
 * 支付按钮监听保费数据，如果非零才可点击，其他情况都不可点击
 *
 */
var header={"content-type":"application/json","AppId":appId}
var insuredRelation="01"; //01:本人，02:父母，03:配偶，04代表子女
Vue.component('InsuranceCopy',{
    template:`<div id="app">
	<div class="container-fluid padding-container">
		<div class="order-tit">{{ baseInfo.insuranceName }}</div>

		<!-- 投保人信息 S-->
		<div class="order-form">
			<h4><em class="policyHolderContext-title">{{ policyHolder.title }}</em><span class="clear-form"><i></i>清空</span></h4>
			<ul class="policyHolderContext-contents">
				<li class="row" v-for="k in policyHolderInput">
					<div class="col-xs-3">{{ k.title }}</div>
					<div class="col-xs-9 input-text-clear">
						<input v-bind:type="k.type" class="insuredValue" v-bind:placeholder="k.placeHolder" v-bind:maxLength="k.maxLength"/>
					</div>
				</li>
			</ul>
		</div>
		<!-- 投保人信息 E-->

		<!-- 被保人信息 S-->
		<div class="order-form">
			<h4><em class="insuredContext-title">{{ insured.title }}</em><span class="clear-form" id="applicant"><i></i>清空</span></h4>
			<h5 class="insuredContext-title2">{{ relations.subTitle }}</h5>

			<!-- 被保人与投保人关系 S -->
			<div class="relashionship-list row readData">
				<div class="col-xs-3" v-for="reArr in involverLists" v-if="reArr.default== 'true'">
                        <a  v-bind:data-bind-value="reArr.code"  v-bind:class="reArr.disabled"  v-bind:defualt="reArr.default" class="myselfData on">{{reArr.name}}</a>
				</div>
				<div class="col-xs-3" v-for="reArr in involverLists" v-if="reArr.default!='true'">
					<a  v-bind:data-bind-value="reArr.code"  v-bind:class="reArr.disabled"  v-bind:defualt="reArr.default" class="myselfData">{{reArr.name}}</a>
				</div>
			</div>
			<!-- 被保人与投保人关系 E -->
			<ul class="insuredContext-contents">
				<li class="row others" v-for="j in insuredInput">
					<div class="col-xs-3">{{ j.title }}</div>
					<div class="col-xs-9 input-text-clear">
						<input v-bind:type="j.type" class="insuredValue" v-bind:placeholder="j.placeHolder" />
					</div>
				</li>
			</ul>
		</div>
		<!-- 被保人信息 E-->
		<div class="order-form">
			<ul>
				<li class="row" v-for="m in external">
					<div class="col-xs-3">{{ m.name }}</div>
					<div class="col-xs-9">{{ m.value }}</div>
				</li>
			</ul>
		</div>
		<div class="order-check">
			<label><input type="checkbox" id="orderCheck" /></label>
			<span class="checkConfirm">我已阅读并同意<a>【安易宝】相关协议</a></span>
		</div>
	</div>

	<footer>
		<div class="row">
			<div class="col-xs-12"><a class="btn btn-danger" id="toPayBtn">￥<span id="premium">--</span> 去支付</a></div>
		</div>
	</footer>

	<!-- 条款勾选遮罩 S-->
	<div class="win" id="orderCheckTipWin" style="display: none;">
		<div class="win-shadow"></div>
	</div>
	<div class="order-check-tip">
		<div class="order-check-tip-text"><i></i><p>我已阅读并同意以下内容，<br />勾选后才能支付哦~</p></div>
		<div class="order-check-tip-box">
			<label><input type="checkbox" /></label>
			<span v-if="productDetail_tmpl.length==1">我已阅读并同意<a  v-bind:href="productDetail_tmpl[0].url" target="_blank">【安易宝】相关协议</a></span>
		    <span>我已阅读并同意<a href="javascript:void(0);">【安易宝】相关协议</a></span>
		</div>
	</div>
	<!-- 条款勾选遮罩 E-->

	<!-- 支付弹层 -->
	<div id="payDIv"></div>

	<!-- 条款列表 S-->
	<div class="win terms-list" style="display: none;"  v-if="productDetail_tmpl.length>1">
		<div class="win-shadow"></div>
		<ul >
		    <li v-for="terms in productDetail_tmpl"><a v-bind:href="terms.url" target="_blank">{{terms.name}}</a></li>
			<li><a href="javascript:$('.terms-list').hide()">取消</a></li>
		</ul>
	</div>
	<!-- 条款列表 E-->
	<!--健康提示内容s-->
	<div style="display:none" id="healthTips">
		<div class="health-tip-cnt">
		</div>
		<div class="health-tip-btn row">
			<div class="col-xs-6" v-on:click="closeTips"><a href="javascript:void(0);" >有部分情况</a></div><div class="col-xs-6"><a id="toPay">没问题，去支付</a></div>
		</div>
	</div>
	<!--健康提示内容e-->
</div>`,
    data(){
        /**
         * 创建模板接收器
         * */
        return{
            baseInfo:{},
            policyHolder:{},
            insured:{},
            relations:{},
            policyHolderInput:{},
            insuredInput:{},
            external:[],
            premium:"",
            involverLists:[],
            healthTips:'',
            productDetail_tmpl:{},
            selectCodes: this.$route.query,
        }
    },
    created: function(){
        /**
         * 读取产品信息*
         * */
        var  requestUrl=BAF.contextPath+"/sgw/v1/products/queryProductProperties";
        var vm=this;
        doGet(requestUrl,{"productCode": "AYB0021"}).done(function(res){  //接口返回数据
            console.log(res);
            vm.baseInfo=JSON.parse(res.AYB0021_productDetail_tmpl).insurance; //绑定产品基础信息
            vm.policyHolder=JSON.parse(res.AYB0021_orderInput_tmpl).policyHolderContext; //绑定投保人输入域
            vm.insured=JSON.parse(res.AYB0021_orderInput_tmpl).insuredContext; //绑定被保人输入域
            vm.relations=vm.insured.relations; //绑定被保人与投保人关系
            vm.healthTips = JSON.parse(res.AYB0021_productDetail_tmpl).healthNotification.value;
            vm.productDetail_tmpl = JSON.parse(res.AYB0021_productDetail_tmpl).protocols;//安易宝先关协议
            $(".health-tip-cnt").html(vm.healthTips) //获取健康须知内容
            vm.involverLists=vm.insured.relations.involverList
            vm.policyHolderInput=vm.policyHolder.inputBox;
            vm.insuredInput=vm.insured.inputBox;
            vm.external=JSON.parse(res.AYB0021_productDetail_tmpl).external;

            $("#premium").text(vm.selectCodes.premium); //从产品详情页获取保费
            $("#toPay").on("touchend",function(){ //调取支付
                createQuote();
            });
            $(".checkConfirm").on('touchend',function(e){ //显示条款
                e.preventDefault();
                $(".terms-list").show();
            });
        }).fail(function(jqXHR){
            alertDefault(jqXHR+textStatus+textStatus);
        });
    },
    updated(){
        /*
         *tab选择，判断是否为本人并计算保费*
         * */
        var vm=this;
        $(".relashionship-list").find("a").bind("touchend",function(){
            var $me=$(this);
            if($(this).hasClass("on") || $(this).hasClass("disabled")){ //当前为选中，或者不可选时，阻止向下执行
                return;
            } else {
                $(".relashionship-list").find("a").removeClass("on");
                $(this).addClass("on");
                if($(this).parent(".col-xs-3").index()!=0){ //被保人非本人
                    $(".insuredContext-contents>li input").eq(0).val("");
                    $(".insuredContext-contents>li input").eq(1).val("");
                    switch($(this).parent(".col-xs-3").index()) {
                        case 1:
                            insuredRelation="02";
                            break;
                        case 2:
                            insuredRelation="03";
                            break;
                        case 3:
                            insuredRelation="04";
                            break;
                    }
                    $(".others").show();
                    if(getParameter("back")!=1){
                        $("#premium").text("--");
                    } else {
                        $("#premium").text("--");
                    }
                    var identifyNumber2= $(".insuredContext-contents>li input").eq(1).val();
                    var insuredName2=$(".insuredContext-contents>li input").eq(0).val();
                } else { //被保人为本人
                    $(".others").hide();
                    $(".insuredContext-contents>li input").eq(0).val($(".policyHolderContext-contents>li input").eq(0).val());
                    $(".insuredContext-contents>li input").eq(1).val($(".policyHolderContext-contents>li input").eq(1).val());
                   // ageCode=ageCode;
                    ageCode=vm.selectCodes.ageCode
                    idNumber=$(".policyHolderContext-contents>li input").eq(1).val();
                    insuredRelation="01";
                    vm.getQuickQuote();
                }
            }
        });
        /**读取本人信息**/
        this.getRelationsInfo();
        /*
         *实时监测退格键，当有星号时，点击退格清除输入框内容
         * */
        $(".policyHolderContext-contents>li input:eq(1)").keydown(function(e){
            e = e || window.event;
            if(/[*]/.test($(".policyHolderContext-contents>li input").eq(1).val())){
                if(e.keyCode == 8){
                    $(".policyHolderContext-contents>li input").eq(1).val("");
                    $(".policyHolderContext-contents>li input").eq(1).next("em").remove();
                }
            }
        });
        $(".policyHolderContext-contents>li input:eq(2)").keydown(function(e){
            e = e || window.event;
            if(/[*]/.test($(".policyHolderContext-contents>li input:eq(2)").val())){
                if(e.keyCode == 8){
                    $(".policyHolderContext-contents>li input:eq(2)").val("");
                    $(".policyHolderContext-contents>li input:eq(2)").next("em").remove();
                }
            }
        });
        formInputClear(); //表单控件[x]调用

        /**
         * 清空按钮
         * */
        $(".clear-form").bind("click",function(){
            $(this).parent("h4").nextAll("ul").find("input").val("");
            $(this).parent("h4").nextAll("ul").find("input").next("em").remove();
            if($(this).attr("id")=="applicant"){
                $(".relashionship-list").find(".col-xs-3:eq(0)").children("a").trigger("touchend");
            } else {
                if($(".myselfData").hasClass("on")){
                    $("#premium").text("--");
                }
            }
        });

        /**
         * 同意条款
         * */
        $(".order-check-tip-box").bind("touchend",function(e){
            e.stopPropagation();
            $("#orderCheckTipWin, .order-check-tip").hide();
            $(".order-check").trigger("touchend");
        });

        $(".win-shadow").bind("touchend",function(){
            $("#orderCheckTipWin, .order-check-tip, .terms-list").hide();
        });

        /**
         *当投被保人为本人时，查询保费
         * */
        $(".policyHolderContext-contents>li input").eq(1).bind('input porpertychange',function(){
            var $me=$(this);
            if($(".myselfData").eq(0).hasClass('on')&&$(".myselfData").eq('0').attr("data-bind-value")=='01'){
                idNumber=$me.val();
                if(IdentityCodeValid(idNumber)){
                    vm.getQuickQuote();
                }
            }
        });
        /**
         *当被保不是本人时，查询保费
         * */
        $(".insuredContext-contents>li input:eq(1)").on("input propertychange",function(){ //被保人身份证输入监听
            var thisVal= $(this).val();
            if(thisVal){
                if(!IdentityCodeValid(thisVal)){ //格式判断
                    $("#premium").text("--");
                } else {
                    idNumber=thisVal;
                    vm.getQuickQuote();
                }
            }
        });

        /**
         * 点击去支付按钮
         * */
        $("#toPayBtn").bind("touchend",function(){
            if($("#orderCheck").prop("checked")==false){ //判断是否同意条款
                $(document).scrollTop($(document).height()-$(window).height());
                var top=$(".order-check").offset().top;
                $("#orderCheckTipWin, .order-check-tip").show();
                $(".order-check-tip").css("top",top-68);
            } else { //条款已勾选

                savePayInfo(vm);
                sessionStorage.refresh = 0;
                /**验证提交投保信息**/
                validateInfo(vm);
            }
        });
    },
    methods: {
        /**
         * 获取投被保人信息
         * */
        getRelationsInfo() {
            var vm=this;
            var requestUrl=BAF.contextPath+"/sgw/v1/security/getRelationsInfo";
            return doGet(requestUrl, null).done(function(msg) {
                var json=eval(msg);
                if(json.resultCode=="success"){
                    console.log(msg);
                    var relation=json.relations[0];
                    $(".policyHolderContext-contents>li input").eq(0).val(relation.insuredName);
                    $(".policyHolderContext-contents>li input").eq(1).val(relation.identifyNumber);
                    $(".policyHolderContext-contents>li input").eq(2).val(relation.mobile);
                    $(".policyHolderContext-contents>li input").eq(3).val(relation.email);
                    $(".insuredContext-contents>li input").eq(0).val(relation.insuredName);
                    $(".insuredContext-contents>li input").eq(1).val(relation.identifyNumber);
                }
                idNumber=relation.identifyNumber;
                vm.getQuickQuote();
                stopLoading();
            }).fail(function (msg) {
                stopLoading();
            });

        },
        /**
         * 查询保障金额接口 用身份证号码重新计算保费
         * */
        getQuickQuote(type) {
            var vm=this;
            var ageCode=vm.selectCodes.ageCode, planCode=vm.selectCodes.planCode, schemeCode=vm.selectCodes.schemeCode
            var setCount=0;
            var ast=setInterval(function(){
                if(!ageCode || !planCode || !schemeCode){
                    setCount++;
                    if(setCount==2){
                        startLoading();
                    }else if(setCount==10){
                        //  nativeView.toast("加载超时,请刷新后重试");
                        location.reload();
                        stopLoading();
                    }
                    console.log(ageCode+"_"+planCode+"_"+schemeCode);
                    return;
                } else {
                    clearInterval(ast);
                    console.log(ageCode+"_"+planCode+"_"+schemeCode);
                    var getQuickQuoteurl = BAF.contextPath + "/sgw/v1/payment/quickQuote"
                    console.log(idNumber);
                    var data = {
                        "schemeCode": schemeCode,  //保障方案 : "P001": "100万", "P002": "300万"
                        "planCode": planCode,    //有无社保：  "A001": "有社保",  "A002": "无社保"
                        "productCode": "AYB0021",//产品代码
                        "ageCode": ageCode,//被保人年龄:"B001": "20-30岁",  "B002": "31-35岁"
                        "idNumber": idNumber //身份证号？ 与ageCode选传其中一个
                    };

                    data = JSON.stringify(data);
                    doPost(getQuickQuoteurl, data, function () {
                    }).done(function (msg) {
                        console.log(msg);
                        stopLoading();
                        $("#premium").text(msg.premium);
                        $("#premium").parent().attr("id","toPayBtn");
                        if (msg.premium != vm.selectCodes.premium && type != 'pressBtn') { //判断当前被保人信息与产品页选择方案是否一致
                            var age_=localStorage.getItem("chooseAge");
                            var  minAge=age_.substring(0,2);
                            var  maxAge=age_.substring(3,5);
                            nativeView.toast("您输入的被保险人年龄与选择的"+minAge+"-"+maxAge+"不一致，保费已更新");
                            $("#premium").text(msg.premium);
                        }
                        if (type == 'pressBtn') {
                            $("#healthTips").show();
                        }
                    }).fail(function (xhr) {
                        stopLoading();
                        var msg = JSON.parse(xhr.responseText);
                        nativeView.toast(msg.resultMessage);
                        if (msg.resultCode == "OpenApiHI100003") {
                            $("#premium").text("--");
                            $("#toPayBtn").attr("id","");
                        }
                    });
                }
            },500);

        },
        /**
         * 点击[有部分情况]，关闭健康须知
         * */
        closeTips(){

            $("#healthTips").css({'display':"none"});
            $("#orderCheck").attr("checked","checked");
            nativeView.toast("被保险人不符合购买此产品的健康要求，暂时无法购买");
            var backOrder=sessionStorage.MyHiOrder,
                relation1=JSON.parse(backOrder).HI.relations[0],
                relation2=JSON.parse(backOrder).HI.relations[1];
            $(".policyHolderContext-contents>li input").eq(0).val(relation1.insuredName);
            $(".policyHolderContext-contents>li input").eq(1).val(relation1.identifyNumber);
            $(".policyHolderContext-contents>li input").eq(2).val(relation1.mobile);
            $(".policyHolderContext-contents>li input").eq(3).val(relation1.email);

            switch(relation2.insuredRelation){
                case "01":
                    $(".relashionship-list").find(".col-xs-3:eq(0)").children("a").trigger("touchend");
                    break;
                case "02":
                    $(".relashionship-list").find(".col-xs-3:eq(1)").children("a").trigger("touchend");
                    break;
                case "03":
                    $(".relashionship-list").find(".col-xs-3:eq(2)").children("a").trigger("touchend");
                    break;
                case "04":
                    $(".relashionship-list").find(".col-xs-3:eq(3)").children("a").trigger("touchend");
                    break;
            }
            $(".insuredContext-contents>li input").eq(0).val(relation2.insuredName);
            $(".insuredContext-contents>li input").eq(1).val(relation2.identifyNumber);
            $("#premium").text(JSON.parse(sessionStorage.MyHiOrder).HI.totalPremium);

        }
    }

})

/**
 * 产品报价接口
 * 拿到合同号，在投保接口中会使用到合同id
 */
function createQuote() {
    var vm=this;
    /**投保数据**/
    var order=sessionStorage.MyHiOrder;
    var _orderInfo=JSON.parse(order);
    if(_orderInfo.HI.ageCode=="" || _orderInfo.HI.ageCode==null){
        _orderInfo.HI.ageCode=vm.selectCodes.ageCode;
        _orderInfo.HI.planCode=vm.selectCodes.planCode;
        _orderInfo.HI.schemeCode=vm.selectCodes.schemeCode;
    }
    //console.log(_orderInfo);
    //合同接口
    var requestUrl=BAF.contextPath+"/sgw/v1/payment/createQuote";
    //投保接口
    var SubmitHIUril=BAF.contextPath+"/sgw/v1/payment/submitQuote";
    //创建合同数据
    var data={"productCode":"AYB0021","excuteType":"sync"};
    // 先调用合同 再调用投保接口
    data=JSON.stringify(data);
    console.log(data);
    stopLoading();
    doPost(
        requestUrl,
        data
    ).done(function(msg) {
        var myagreementId= msg.resultHIInfo.agreementId;//合同号
        localStorage.myagreementId=myagreementId;

        _orderInfo.HI.agreementId=myagreementId;//设置合同号
        var _order=JSON.stringify(_orderInfo);
        console.log(_order);
        //调用投保接口
        doPost(SubmitHIUril,_order).done(function (msg) {
            var json=JSON.stringify(msg);
            /**投保成功情况用户session信息**/
            sessionStorage.setItem("MyHiOrder","");
            var from=msg.payForm;
            //跳转支付
            $("#payDIv").html(from);
            stopLoading();
        }).fail(function (error) {
            stopLoading();
        });

    }).fail(function (error) {
        var json=JSON.stringify(error);
        nativeView.toast(json);
    });
}

/****
 * 保存订单数据
 *
 */
function savePayInfo(vm) {

    var order={
        "HI": {
            "agreementId": "",
            "timeLimit":"一年",
            "effectiveTime":"次日",
            "relations": [
                {
                },
                {
                }
            ],
            "totalPremium":$("#premium").text(),
            "insuranceName":"臻爱医疗保险2017版",
            "coverage": [
                {
                    "kindName": "意外身故及伤残",
                    "modeCode": "最高10万"
                },
                {
                    "kindName": "一般医疗保险金",
                    "modeCode": "最高300万"
                },
                {
                    "kindName": "特定重大疾病医疗保险金",
                    "modeCode": "最高300万"
                }
            ],
            "ageCode": vm.selectCodes.ageCode,
            "planCode": vm.selectCodes.planCode,
            "schemeCode":  vm.selectCodes.schemeCode,
        },
        "isAsync": "false",
        "productCode": "AYB0021"
    };

    var insureName1= $(".policyHolderContext-contents>li input").eq(0).val();
    var relation1={};
    relation1.insuredName=$(".policyHolderContext-contents>li input").eq(0).val();
    relation1.identifyNumber=$(".policyHolderContext-contents>li input").eq(1).val();
    relation1.mobile=$(".policyHolderContext-contents>li input").eq(2).val();
    relation1.email=$(".policyHolderContext-contents>li input").eq(3).val();
    relation1.insuredFlag="01";
    relation1.insuredRelation="01";
    var relation2={};
    if($(".myselfData").eq(0).hasClass('on')&&$(".myselfData").eq(0).attr("data-bind-value")=='01'){
        relation2.insuredName=$(".policyHolderContext-contents>li input").eq(0).val();
    }else{
        relation2.insuredName=$(".insuredContext-contents>li input").eq(0).val();
    }
    if(/[*]/.test($(".policyHolderContext-contents>li input").eq(1).val())){
        if($(".myselfData").eq(0).hasClass('on')&&$(".myselfData").eq(0).attr("data-bind-value")=='01'){
            relation2.identifyNumber=$(".policyHolderContext-contents>li input").eq(1).val();
        }else{
            relation2.identifyNumber=$(".insuredContext-contents>li input").eq(1).val();
        }
    }else{
        if($(".myselfData").eq(0).hasClass('on')&&$(".myselfData").eq(0).attr("data-bind-value")=='01'){
            relation2.identifyNumber=$(".policyHolderContext-contents>li input").eq(1).val();
        }else{
            relation2.identifyNumber=$(".insuredContext-contents>li input").eq(1).val();
        }
    }
    /*   relation2.identifyNumber=$(".insuredContext-contents>li input").eq(1).val();*/
    relation2.mobile= $(".policyHolderContext-contents>li input").eq(2).val();
    relation2.email=$(".policyHolderContext-contents>li input").eq(3).val();
    relation2.insuredFlag="02";
    relation2.insuredRelation=insuredRelation;

    order.HI.relations[0]=relation1;
    order.HI.relations[1]=relation2;
    sessionStorage.MyHiOrder=JSON.stringify(order);
}

//根据输入的信息判断被保人和投保人是否为同一人 该功能暂时不启用
//var lastFourNum="";
function testSamePeople(){
    $(".insuredContext-contents>li input:eq(1)").on("input propertychange",function(){ //被保人身份证输入监听

        var thisVal= $(this).val();
        if(thisVal){
            if(!IdentityCodeValid(thisVal)){ //格式判断
                $("#premium").text("--");
            } else {
                idNumber=thisVal;
                getQuickQuote();
            }
        }
    });

}
//--------- CSS操作
function validateUsername(code) {

    if (/[^*]/.test(username)) {
        return false;
    }
    return true;
}