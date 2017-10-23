Vue.component('tips',{
    template:`<div id="app">
            <div class="container-fluid">
                <div class="health-tip-cnt">
                </div>
                <div class="health-tip-btn row">
                    <div class="col-xs-6"><a href="Order.html?back=1">有部分情况</a></div><div class="col-xs-6"><a id="toPay">没问题，去支付</a></div>
                </div>
            </div>
            <!-- 支付跳转div 孙黎明添加 -->
            <div id="payDIv">
            </div>
        </div>`,
    data(){
        return{

        }
    }
})