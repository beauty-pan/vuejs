Vue.component('flow',{
    template:` <div class="container-fluid">
	<div class="health-tip-flow-box" style="height:700px;">
		<div class="health-tip-flow">
			<h4>理赔流程</h4>
			<p>
				1. 报案<br />
				拨打安联财险客服热线<a href="tel:400-800-2020">400-800-2020</a>或者发送邮件<a href="mailto:Claims@allianz.cn">Claims@allianz.cn</a>进行报案。
			</p>
			<p>
				2. 快递理赔资料<br />
				请将理赔资料的原件快递至我司(费用自理)<br />
				地址：广州市天河区珠江西路 5 号西塔 34 层 10 单元<br />
				收件人：非车理赔部<br />
				电话：02085132900
			</p>
			<p>3. 保险公司告知理赔决定,保险金将通过转账的方式支付至客户指定账户</p>
			<a href="javascript:history.back();"></a>
		</div>
	</div>
</div>`,
    updated(){
        $(".health-tip-flow-box").height($(window).height());
    }
});
