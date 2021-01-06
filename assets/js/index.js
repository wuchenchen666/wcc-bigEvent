
var layer = layui.layer;

//获取用户数据
getUserinfo();

//封装获取用户数据函数getUserinfo()
function getUserinfo() {
    $.ajax({
        type: 'GET',
        url: '/my/userinfo',
        success: function (res) {
            if (res.status !== 0) {
                return layer.msg('获取用户信息失败！');
            }
            //调用rederAvatar渲染用户头像
            rederAvatar(res.data);
        }

    });
}

//封装渲染用户头像函数
function rederAvatar(data) {
    var name = data.nickname || data.username;
    $('.welcome').html('欢迎&nbsp;&nbsp;' + name);
    if (data.user_pic !== null) {
        $('.layui-nav-img').attr('src', data.user_pic).show();
        $('.text-avatar').hide();

    } else {
        $('.layui-nav-img').hide();
        $('.text-avatar').html(name[0].toUpperCase()).show();
    }
}

//退出登录
$('#btnLogout').on('click', function () {
    //弹出confirm询问框
    layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function (index) {
        //清空本地存储中的token
        localStorage.removeItem('token');
        //跳转到登录页面
        location.href = '/login.html';
        //点击确定关闭confirm弹出框
        layer.close(index);
    });
});


