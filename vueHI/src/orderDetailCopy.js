Vue.component('detailCopy', {
    template: `

                                              <footer style="position:relative;">
			<div class="row">
				<div class="col-xs-12"><div class="btn btn-danger applayFee"
											v-on:click='applayOrder()'
										>去支付1111</div></div>
			</div>


			<div class="row">
				<div class="col-xs-12"><div class="btn btn-danger applayFee"
											v-on:click='applayOrder2()'
										>去支付2222</div></div>
			</div>

			<div class="row">
				<div class="col-xs-12"><div class="btn btn-danger applayFee"
											v-on:click='applayOrder3()'
										>去支付333333</div></div>
			</div>
		</footer>
		>`,
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
        applayOrder(){
            var orderDetail_=this;
            var agreementId="844632104";
            //var agreementId=orderDetail_.orderIds.id;
            var url= BAF.contextPath+"/sgw/v1/agreements/ayb/"+agreementId+"?agreementId="+agreementId;
            doGet(url,null).done(function (msg) {
                if(msg){
                    var fromOrder = JSON.parse(msg.aybAgreementInfo.aybPolicy).form
                    console.log(fromOrder);
                    $("#orderPay").html(fromOrder);
                    alert('111111111走了接口回调');
                    alert(fromOrder);
                    stopLoading();
                }


            })

        },
        applayOrder2(){

            var fromOrder =`<form id="paymentForm" method="get" action="https://wappaygw.alipay.com/service/rest.htm?_input_charset=utf-8"><input type="hidden" name="v" value="2.0"><input type="hidden" name="sec_id" value="MD5"><input type="hidden" name="_input_charset" value="utf-8"><input type="hidden" name="req_data" value="&lt;auth_and_execute_req&gt;&lt;request_token&gt;201707268e23aabc809f9178318642de982b0083&lt;/request_token&gt;&lt;/auth_and_execute_req&gt;"><input type="hidden" name="service" value="alipay.wap.auth.authAndExecute"><input type="hidden" name="partner" value="2088211818012266"><input type="hidden" name="format" value="xml"><input type="hidden" name="sign" value="620177ec213ab3996f2c0a935d3f8f35"></form><script>document.getElementById('paymentForm').submit();`
            console.log(fromOrder);
            $("#orderPay").html(fromOrder);
            alert('222静态');
            alert(fromOrder);
            stopLoading();

        },

        applayOrder3(){

            var fromOrder =`<form id="paymentForm" method="get" action="https://wappaygw.alipay.com/service/rest.htm?_input_charset=utf-8"><input type="hidden" name="v" value="2.0"><input type="hidden" name="sec_id" value="MD5"><input type="hidden" name="_input_charset" value="utf-8"><input type="hidden" name="req_data" value="&lt;auth_and_execute_req&gt;&lt;request_token&gt;201707268e23aabc809f9178318642de982b0083&lt;/request_token&gt;&lt;/auth_and_execute_req&gt;"><input type="hidden" name="service" value="alipay.wap.auth.authAndExecute"><input type="hidden" name="partner" value="2088211818012266"><input type="hidden" name="format" value="xml"><input type="hidden" name="sign" value="620177ec213ab3996f2c0a935d3f8f35"></form><script>document.getElementById('paymentForm').submit();</script>`;

            console.log(fromOrder);
            $("#orderPay").html(fromOrder);
            alert('3333静态url');
            alert(fromOrder);
            stopLoading();

        },
        /**跳转至订单详情页面**/
        orderDetails(orderId) {
            //sessionStorage.setItem("orderId", orderId);
            this.$router.push({ path: '/orderDetailCopy',query: {id:orderId}});
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