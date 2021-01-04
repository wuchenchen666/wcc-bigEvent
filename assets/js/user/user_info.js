$(function() {
    //创建表单验证规则
    var form = layui.form;
    form.verify({
        nickname:function(value) {
            if(value.length > 6){
                return '昵称长度必须在1~6个字符之间！'
            }
        }
    });

    //初始化用户信息
    initUserInfo();
    var layer = layui.layer;
    function initUserInfo() {
        $.ajax({
            type: 'GET',
            url: '/my/userinfo',
            success: function(res) {
                if(res.status !== 0) {
                    return layer.msg('获取用户信息失败！');
                }
                
                //调用form.val()方法快速给表单赋值
                form.val('formUserInfo', res.data);
            }
        })
    }

    //重置按钮点击事件
    $('#btnReset').on('click',function(e) {
        //组织表单默认重置行为
        e.preventDefault();
        //重新初始化
        initUserInfo();
    })

    //提交修改按钮点击事件
    $('.layui-form').on('submit',function(e) {
        //组织表单默认提交行为
        e.preventDefault();
        //获取表单数据
        var data = $(this).serialize();
        $.ajax({
            type: 'POST',
            url: '/my/userinfo',
            data: data,
            success: function(res) {
                if(res.status !== 0) {
                    return layer.msg('更新用户信息失败！');
                }
                layer.msg('更新用户信息成功！');
                //调用父页面的函数 重新渲染index.html的用户信息和头像
                window.parent.getUserinfo();
            }
        });
    })
})