$(function () {
  //点击‘去注册账号’链接
  $('#link-reg').on('click', function () {
    $('.login-box').hide();
    $('.reg-box').show();
  });
  //点击‘去登录’链接
  $('#link-login').on('click', function () {
    $('.login-box').show();
    $('.reg-box').hide();
  });

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
    repwd: function (value) {
      if ($('.reg-box [name=password]').val() !== value) {
        return '两次密码输入不一致！'
      }
    }
  });

  //监听表单提交事件
  //注册
  $('#form-reg').on('submit', function (e) {
    //阻止默认提交行为
    e.preventDefault();
    //发起Ajax的POST请求
    $.post('/api/reguser', {
      username: $('#form-reg [name=username]').val(),
      password: $('#form-reg [name=password]').val()
    }, function (res) {
      if (res.status !== 0) {
        return layer.msg(res.message);
      }
      layer.msg('注册成功，请登录！');
      //跳转到登录页面
      $('#link-login').click();
    });
  });
  //登录
  $('#form-login').submit(function (e) {
    //阻止默认提交行为
    e.preventDefault();
    //发起Ajax的POST请求
    $.ajax({
      type: 'POST',
      url: '/api/login',
      data: $(this).serialize(),
      success: function(res) {
        if(res.status !== 0) {
         return layer.msg('登录失败！'); 
        }
        layer.msg('登录成功！'); 
        //把登录成功的token字符串存储到本地存储 方便后续调用
        localStorage.setItem('token', res.token);
        //跳转到后台主页
        location.href = '/index.html';
      }
    })
  });

  
});