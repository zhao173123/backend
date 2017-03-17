/**
 * Created by ivyguo on 2016/8/10.
 */
backStart.factory('DateInit', function(){

    return {
        normalDate:{
            format: 'YYYY-MM-DD'

        },
        timeAndDate:{
            format: 'YYYY-MM-DD hh:mm:ss',
            istime: true,
            min:laydate.now(0,"YYYY-MM-DD hh:mm:ss")   //今天此时此刻开始
        }
    }
})