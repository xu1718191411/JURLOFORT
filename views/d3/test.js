/**
 * Created by xuzhongwei on 12/17/15.
 */


var app = new Vue({
    el: '#ak',
    data: {
        message: 'Hello Vue.js!',
        test_text:'',
        count:0
    },
    methods:{
        countup:function(){
            this.count++
        }

    }
})
