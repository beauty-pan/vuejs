/*** 定义全局信息* */
var header = { "content-type": "application/json", "AppId": appId };
var quoteData = {},
    schemeCodeNew = "P001",
    planCodeNew = "A001",
    ageCodeNew = "B001";
var firstGet = 1;

Vue.component('ProductsCopy', {
    template: `<div id="app">
	<div class="container-fluid padding-container productScrolls">
		<div class="prod-ayb-banner">
			<img v-bind:src="baseInfo.insuranceUrl" />
			<!--<a class="prod-ayb-group-btn">我的拼团</a>-->
		</div>
		<div class="prod-ayb-line">
			<h4>￥{{ baseInfo.minPrice }}~{{ baseInfo.maxPrice }}</h4>
			<p>{{ baseInfo.feature }}</p>
		</div>
		<!--<div class="prod-ayb-line tag">
			<em>拼团</em>2人即可成团，最多可享8折优惠！<i></i>
		</div>-->
		<div class="prod-ayb-list">
			<h3>{{ detailInfo.ensureName }}</h3>
			<ul>
				<li class="row" v-for="k in coverage">
					<div class="col-xs-8">{{ k.name }}</div><div class="col-xs-4">{{ k.value }}</div>
				</li>
			</ul>
			<h4 id="describes">{{describes}}</h4>
		</div>
		<div class="prod-ayb-list">
			<ul id="properties" v-for="pro in properties">
				<li><em>{{pro.name}}</em>{{pro.value}}</li>
			</ul>
		</div>
		<div class="prod-ayb-line tag" @click="getQuickQuote">
			选择：保障方案/有无社保/保障年龄<i></i>
		</div>
		<div class="prod-ayb-list prod-prod-list " v-on:click="intro()">
			<h3>产品介绍</h3>
			<ul>
				<li>
					<i></i><div class="prod-prod-logo"></div>
					<div class="prod-prod-info"><h5>安联财产保险</h5><p>安联臻爱医疗保险2017版</p></div>
				</li>
			</ul>
		</div>
	</div>

	<footer>
		<div class="row">
	    		<div class="col-xs-12"><div class="btn btn-danger" @click="getQuickQuote">立即投保</div></div>
	    </div>
	</footer>

	<div class="win" id="selPlanWin" style="display: none;">
		<div class="win-shadow" v-on:click="closeWin()"></div>
		<div class="win-box bot-win" id="ansered">
			<div class="win-cnt">
				<template v-for="plan in factor">
					<h5>{{ plan.name }}</h5>
					<ul class="row">
						<li class="col-xs-6" v-for="(list,index) in plan.choice" v-if="index==0" @click="selPlanCondition">
							<a class="on">{{ list.name }}</a><input type="hidden" v-bind:value="list.value" />
						</li>
						<li class="col-xs-6" v-for="(list,index) in plan.choice" v-if="index!=0" @click="selPlanCondition">
							<a>{{ list.name }}</a><input type="hidden" v-bind:value="list.value" />
						</li>
					</ul>
				</template>
			</div>
			<div class="win-bot-btn row">
				<div class="col-xs-6">保费<span>￥<em id="quote">{{ premium }}</em></span></div>
				<!--<a class="btn-danger col-xs-6 disabled" id="confirmQuote" style="background-color:#999;">即将开售</a>-->
				<a class="btn-danger col-xs-6 disabled" id="confirmQuote" v-on:click="subInsurance()">确定</a>
			</div>
		</div>
	</div>
	<div class="proIntrodunce" v-on:click="proInHide()"><img src="src/assets/images/proIntroduce.jpg" /></div>
</div>`,
    data() {
        return {
            title: "产品详情",
            baseInfo: {},
            detailInfo: {},
            coverage: {},
            factor: {},
            premium: "",
            describes: '',
            properties: []

        }
    },
    created() {
        /**
         * 读取产品信息
         * */
        firstGet=1;
        var requestUrl = BAF.contextPath + "/sgw/v1/products/queryProductProperties";
        var Products_ = this;
        doGet(requestUrl, { "productCode": "AYB0021" }).done(function(res) {
            Products_.baseInfo = JSON.parse(res.AYB0021_productDetail_tmpl).insurance; //绑定产品基础信息
            Products_.detailInfo = JSON.parse(res.AYB0021_productDetail_tmpl).ensureContent; //绑定产品详细信息
            var cover = JSON.parse(res.AYB0021_productDetail_tmpl).ensureContent;
            Products_.coverage = cover.coverage; //绑定保障内容
            Products_.factor = JSON.parse(res.AYB0021_productDetail_tmpl).factor; //绑定投保方案
            Products_.describes = JSON.parse(res.AYB0021_productDetail_tmpl).ensureContent.describe;
            Products_.properties = JSON.parse(res.AYB0021_productDetail_tmpl).properties;

        }).fail(function(error) {
            alertDefault(error);
        })
        console.log("这是副本");
    },
    methods: {
        closeWin(){
            $("#selPlanWin").hide();
            $("body").removeClass("productPlanWinConts");
        },
        /**
         * 选择投保方案
         * */

        selPlanCondition: function(e) {
            var vm = this;
            e = e || event;
            $me = $(e.currentTarget);
            $me.children("a").addClass("on");
            $me.siblings("li").children("a").removeClass("on");
            switch($me.parent("ul").prev("h5").text()) { //判断方案条件
                case "保障方案":
                    schemeCodeNew = $me.find("input").val();
                   // sessionStorage.schemeCode = schemeCodeNew;
                    break;
                case "有无社保":
                    planCodeNew = $me.find("input").val();
                   // sessionStorage.planCode = planCodeNew;
                    break;
                case "被保人年龄":
                    ageCodeNew = $me.find("input").val();
                    //sessionStorage.ageCode = ageCodeNew;
                    break;
                default:
                    break;
            }
            if(schemeCodeNew == undefined) {
                schemeCodeNew = "P001";
            }
            if(planCodeNew == undefined) {
                planCodeNew = "A001";
            }
            if(ageCodeNew == undefined) {
                ageCodeNew = "B001";
            }
            quoteData = {
                "schemeCode": schemeCodeNew,
                "planCode": planCodeNew,
                "ageCode": ageCodeNew,
                "productCode": "AYB0021"
            }
            vm.$options.methods.getQuickQuote(quoteData);
            $("#confirmQuote").removeClass("disabled");

        },

        /**
         * 查询保障金额接口
         */
        getQuickQuote: function(quoteData) {
            var vm = this;
                $("body").addClass("productPlanWinConts");
                $("#selPlanWin").show();
              console.log(firstGet);
            if(firstGet == 1) {
                $("#selPlanWin").find("ul >li:first").trigger("click");
                quoteData = {
                    "schemeCode": "P001",
                    "planCode": "A001",
                    "ageCode": "B001",
                    "productCode": "AYB0021"
                }
                firstGet = 0;
            }else{
                quoteData = {
                    "schemeCode":$("#ansered ul:eq(0) .on").next().val(),
                    "planCode": $("#ansered ul:eq(1) .on").next().val(),
                    "ageCode": $("#ansered ul:eq(2) .on").next().val(),
                    "productCode": "AYB0021"
                }
            }
            console.log(quoteData);

            var requestUrl = BAF.contextPath + "/sgw/v1/payment/quickQuote";
            doPost(requestUrl, JSON.stringify(quoteData)).done(function(res) { //接口返回数据
                var res = eval(res);
                var premium = res.premium;
                vm.premium = premium;
                $("#quote").text(premium);

                $("#confirmQuote").removeClass("disabled");
            }).fail(function(error) {
                var json = JSON.stringify(error);
                alertDefault("error:" + json);
            });
        },
        /**跳转至产品介绍页**/
        intro(){
            $(".proIntrodunce").show();
        },
        proInHide(){
            $(".proIntrodunce").hide()
        },
        /***跳转至投保页面**/
        subInsurance(event) {
            if($("#confirmQuote").hasClass("disabled")) {
                return;
            } else {
                $("#selPlanWin").hide();
                $("#vueApp").addClass('deleteSession');
                $("body").removeClass("productPlanWinConts");
                localStorage.setItem("chooseAge",$("#ansered ul:eq(2) .on").text());
                this.$router.push({path: '/InsuranceCopy', query: {schemeCode:$("#ansered ul:eq(0) .on").next().val(),planCode:$("#ansered ul:eq(1) .on").next().val(),ageCode:$("#ansered ul:eq(2) .on").next().val(),premium:$("#quote").text()}});
            }
        },

    }
})