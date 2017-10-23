/**定义路由，加载组件**/
const orderLists = {template:"<orderLists></orderLists>" }
const Bar = {template:'<div>12121212</div>'}
const orderDetails = {template:'<orderDetail></orderDetail>'}
/*const products={template:"<Products></Products>"}*/
const productsCopy={template:"<productsCopy></productsCopy>"}
/*const Insurance={template:"<Insurance></Insurance>"}*/
const InsuranceCopy={template:"<InsuranceCopy></InsuranceCopy>"}
const payCallback={template:"<payCallback></payCallback>"}
const flow={template:"<flow></flow>"}
/*const detailCopy={template:'<detailCopy></detailCopy>'}*/

const routes = [
    { path: '/', component: productsCopy },
    { path: '/orderLists', component: orderLists },
    { path:'/flow', component:flow},
    { path: '/bar', component: Bar },
    {path:'/orderDetail', component:orderDetails},
   /* {path:'/Products',component:products},*/
/*    {path:'/Insurance',component:Insurance}*/,
    { path:'/payCallback', component:payCallback},
    { path:'/productsCopy', component:productsCopy},
    { path:'/insuranceCopy', component:InsuranceCopy},
/*    { path:'/orderDetailCopy', component:detailCopy}*/

]
const router = new VueRouter({
    routes
})
const app = new Vue({
    router,
    el:"#vueApp"
})