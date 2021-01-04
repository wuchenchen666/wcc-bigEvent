$(function () {
    //自定义校验规则
    //从layui里面获取form对象
    var form = layui.form;
    var layer = layui.layer;

    //通过 form.verify()函数自定义校验规则
    form.verify({
        //密码校验格式
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        //校验两次密码是否一致
        rePwd: function (value) {
            if ($('[name=newPwd]').val() !== value) {
                return '两次密码输入不一致！'
            }
        },
        //新旧密码不能相同
        samePwd: function(value) {
            if ($('[name=oldPwd]').val() === value) {
                return '新旧密码不能相同!'
            }
        }

    });

    //重置密码
    $('.layui-form').on('submit',function(e) {
        e.preventDefault();
        $.ajax({
            type: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function(res) {
                if(res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg(res.message);
                //清空密码框
                $('.layui-form')[0].reset();
            }
        });
    });
})