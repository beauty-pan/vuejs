/**身份证验证**/
function IdentityCodeValid(code) {
    var city = {
        11: "北京",
        12: "天津",
        13: "河北",
        14: "山西",
        15: "内蒙古",
        21: "辽宁",
        22: "吉林",
        23: "黑龙江 ",
        31: "上海",
        32: "江苏",
        33: "浙江",
        34: "安徽",
        35: "福建",
        36: "江西",
        37: "山东",
        41: "河南",
        42: "湖北 ",
        43: "湖南",
        44: "广东",
        45: "广西",
        46: "海南",
        50: "重庆",
        51: "四川",
        52: "贵州",
        53: "云南",
        54: "西藏 ",
        61: "陕西",
        62: "甘肃",
        63: "青海",
        64: "宁夏",
        65: "新疆",
        71: "台湾",
        81: "香港",
        82: "澳门",
        91: "国外 "
    };
    var tip = "";
    var pass = true;

    var borithyear = code.substring(6, 10);
    var borithmoth = code.substring(10, 12);
    var borithday = code.substring(12, 14);
    var dateStr = borithyear + '-' + borithmoth + '-' + borithday;
    if (formatDate(new Date(dateStr)) != dateStr) {
        pass = false;
    }

    else if (!city[code.substr(0, 2)]) {
        tip = "地址编码错误";
        pass = false;
    }
    else {
        //18位身份证需要验证最后一位校验位
        if (code.length == 18) {
            code = code.split('');
            //∑(ai×Wi)(mod 11)
            //加权因子
            var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
            //校验位
            var parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
            var sum = 0;
            var ai = 0;
            var wi = 0;
            for (var i = 0; i < 17; i++) {
                ai = code[i];
                wi = factor[i];
                sum += ai * wi;
            }
            var last = parity[sum % 11];
            if (parity[sum % 11] != code[17]) {
                tip = "身份证号码填写错误";
                pass = false;
            }
        }
//      } else if (code.length == '15') {
//          var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
//          var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
//          var cardTemp = 0, i;
//          code = code.substr(0, 6) + '19' + code.substr(6, code.length - 6);
//          for (i = 0; i < 17; i++) {
//              cardTemp += code.substr(i, 1) * arrInt[i];
//          }
//          code += arrCh[cardTemp % 11];
//          return code;
//      }
        else {
            pass = false;
        }

    }
    return pass;
}
/**格式化时间**/
function formatDate(date, format) {
    if (!date) return;
    if (!format) format = "yyyy-MM-dd";
    switch (typeof date) {
        case "string":
            date = new Date(date.replace(/-/, "/"));
            break;
        case "number":
            date = new Date(date);
            break;
    }
    if (!date instanceof Date) return;
    var dict = {
        "yyyy": date.getFullYear(),
        "M": date.getMonth() + 1,
        "d": date.getDate(),
        "H": date.getHours(),
        "m": date.getMinutes(),
        "s": date.getSeconds(),
        "MM": ("" + (date.getMonth() + 101)).substr(1),
        "dd": ("" + (date.getDate() + 100)).substr(1),
        "HH": ("" + (date.getHours() + 100)).substr(1),
        "mm": ("" + (date.getMinutes() + 100)).substr(1),
        "ss": ("" + (date.getSeconds() + 100)).substr(1)
    };
    return format.replace(/(yyyy|MM?|dd?|HH?|ss?|mm?)/g, function () {
        return dict[arguments[0]];
    });
}
function queryString(key){
    return (document.location.search.match(new RegExp("(?:^\\?|&)"+key+"=(.*?)(?=&|$)"))||['',null])[1];
}
function getCookie(name){
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
    if(arr=document.cookie.match(reg)){
        return unescape(arr[2]);
    }else{
        return null;
    }
}
function validateInfo(vm){
    var insuredName1 = $(".policyHolderContext-contents>li input").eq(0).val();
    var identifyNumber1 = $(".policyHolderContext-contents>li input").eq(1).val();
    var mobile = $(".policyHolderContext-contents>li input").eq(2).val();
    var emailcontent = $(".policyHolderContext-contents>li input").eq(3).val();

    if ($(".myselfData").eq(0).attr("data-bind-value") == '01' && $(".myselfData").eq(0).hasClass("on")==true) {
        var identifyNumber2 = $(".policyHolderContext-contents>li input").eq(1).val();
        var insuredName2 = insuredName1;
    } else {
        var identifyNumber2 = $(".insuredContext-contents>li input").eq(1).val();
        var insuredName2 = $(".insuredContext-contents>li input").eq(0).val();
    }
    var reg=/^[\u0391-\uFFE5]+$/;
    var phone = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
    var email = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
    if(insuredName1==""){
        nativeView.toast("投保人姓名不能为空");
    } else if(identifyNumber1==""){
        nativeView.toast("投保人身份证号码不能为空");
    } else if(mobile==""){
        nativeView.toast("投保人手机号码不能为空");
    } else if(insuredName2==""){
        nativeView.toast("被保人姓名不能为空");
    } else if(!reg.test(insuredName2)){
        nativeView.toast("被保人姓名必须为中文字符，请重新输入");
    }else if(identifyNumber2==""){
        nativeView.toast("被保人身份证号码不能为空");
    } //else if(!reg.test($("#insuredName1").val()) || !reg.test($("#insuredName2").val())){
    else if(!reg.test(insuredName1)){
        nativeView.toast("投保人及被保人姓名必须为中文字符，请重新输入");
    } else if(insuredName1.length > 6 || insuredName2.length>6 || insuredName1.length <2 || insuredName2.length <2){
        nativeView.toast("投保人或被保人姓名长度不符合要求，请重新输入");
    } else if(/[*]/.test(identifyNumber1) && /[*]/.test(mobile)){
    		if(!$(".myselfData").eq(0).hasClass("on")){
    			if(!IdentityCodeValid(identifyNumber2)){
    				nativeView.toast("被保人身份证号码输入有误，请重新输入");
    				return;
    			}
	    } vm.getQuickQuote("pressBtn");	
    } else if(/[*]/.test(identifyNumber1) && !(/[*]/.test(mobile))){
        if(!(/^(((13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/.test(mobile))){
            nativeView.toast("投保人手机号码输入有误，请重新输入");
        }else if(!reg.test(insuredName1)){
            nativeView.toast("投保人及被保人姓名必须为中文字符，请重新输入");
        }else if(!email.test(emailcontent)){
            nativeView.toast("投保人邮箱输入有误，请重新输入");
        }else{
            vm.getQuickQuote("pressBtn");
        }
    } else if((!/[*]/.test(identifyNumber1) && (/[*]/.test(mobile)))){
        if(!IdentityCodeValid(identifyNumber1)){
            nativeView.toast("投保人身份证号码输入有误，请重新输入");
        }else if(!reg.test(insuredName1)){
            nativeView.toast("投保人及被保人姓名必须为中文字符，请重新输入");
        }else if(!email.test(emailcontent)){
            nativeView.toast("投保人邮箱输入有误，请重新输入");
        }else if(!IdentityCodeValid(identifyNumber2)){
			nativeView.toast("被保人身份证号码输入有误，请重新输入");
		}else{
            vm.getQuickQuote("pressBtn");
        }
    } else if(!(/^(((13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/.test(mobile))){
        nativeView.toast("投保人手机号码输入有误，请重新输入");
    } else if(!IdentityCodeValid(identifyNumber1)){
        nativeView.toast("投保人身份证号码输入有误，请重新输入");
    } else if(!email.test(emailcontent)){
        nativeView.toast("投保人邮箱输入有误，请重新输入");
    } else if(!IdentityCodeValid(identifyNumber2)){
        nativeView.toast("被保人身份证号码输入有误，请重新输入");
    } else{
    		console.log(4);
        vm.getQuickQuote("pressBtn");
        //window.location="Health_tips.html";
    }
}