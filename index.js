const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)


Validator=function (option) {
    const selectorRules = {}

    function validate (inputElement,rule) {
        const errorElement = inputElement.parentElement.querySelector(".form-msg")
        var Errmsg;
        var rules = selectorRules[rule.selector]
        for( let i = 0; i < rules.length; i++)
        {
            
             Errmsg =  rules[i](inputElement.value)
             if(Errmsg) break;
            
            
        }
        if(Errmsg){
            errorElement.textContent = Errmsg
            inputElement.parentElement.classList.add('invalid')
        }else{
            errorElement.textContent = ""
            inputElement.parentElement.classList.remove('invalid')
        }
        return !Errmsg
        
    }

var formElement = $(option.form)
//lay element cua form
if(formElement){
//xu ly khi submit
        formElement.onsubmit = function (e) {
            e.preventDefault()
            var isFormVlaid = true

            option.rule.forEach((rule, index ,array) => {
                var inputElement = formElement.querySelector(rule.selector)
                var isVlaid= validate(inputElement,rule)
                if(!isVlaid){
                    isFormVlaid = false
                    
                }

            })
            
            if(isFormVlaid)
            {
                if (typeof option.onSubmit === 'function') {
                    var input = formElement.querySelectorAll('[name]')
                    var formValues = Array.from(input).reduce(function (values,input) {
                        values[input.name] = input.value
                        console.log(values[input.name]);
                         return(values);
                   },{})
                   option.onSubmit(formValues)
                }else{
                    formElement.submit()
                }
               
            }
            else{
                console.log('co loi');
            }

            
        }
        //selector cac rules
        option.rule.forEach((rule, index ,array) => {
        var inputElement = formElement.querySelector(rule.selector)
        if (inputElement) {

            if (Array.isArray(selectorRules[rule.selector])) {
                selectorRules[rule.selector].push(rule.test)
            }else{
                selectorRules[rule.selector] = [rule.test]
            }
            //xu ly khi blur
            inputElement.onblur= function (params) {
                validate(inputElement,rule)
            }
            //xu ly khi nguoi dung nhap input
            inputElement.oninput = function (params) {
                const errorElement = inputElement.parentElement.querySelector(".form-msg")
                // var Errmsg=  rule.test(inputElement.value)
                if (inputElement.value) {
                    errorElement.textContent = ""
                }
            }
        }

        });
}

}
//// khi co' loi~ tra ra loi
//// khi hop le ko tra ra cai j ca
Validator.isRequired = function(selector){
    return{
        selector :selector,
        test : (value)=> value.trim() ? undefined : "Vui long nhap truong nay"
    }

}

Validator.isEmail = function(selector){
    return{
        selector :selector,
         test : (value) => {
            var checker = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
            return checker.test(value)? undefined : "Truong nay phai la Email"
         }
    }

}

Validator.minLength = function(selector,min){
    return{
            selector :selector,
            test: function(value){
            return (value).length >=min ? undefined : `Mat khau nhap vao qua ngan, toi thieu ${min} ky tu`
    }

}
}
Validator.isRetypepass = function (selector,getCofirmValue,msg) {
        return {
            selector : selector,
            test : (value)=>{
                if(value == getCofirmValue()){
                    return undefined
                }
                else{

                    return msg ||'Gia tri nhap vao khong dung'
                }
            }
        }
}
//mong muon goi tung` selector rule vao`

Validator(
    {
        form:'#form-1',
        rule:[
            Validator.isRequired('#fullname'),
            Validator.isRequired('#email'),
            Validator.isEmail('#email'),
            Validator.isRequired('#password'),
            Validator.minLength('#password',6),
            Validator.isRequired('#retype-password'),
            Validator.isRetypepass('#retype-password',function () {
                return $("#password").value
            },"Mat khau nhap vao khong chinh xac")
        ],
        onSubmit : function (data) {
            console.log(data)
        }
    }
)