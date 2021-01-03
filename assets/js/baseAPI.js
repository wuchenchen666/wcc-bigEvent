// 注意：每次调用 $.get() 或 $.post() 或 $.ajax() 的时候，
// 会先调用 ajaxPrefilter 这个函数
// 在这个函数中，可以拿到我们给Ajax提供的配置对象
$.ajaxPrefilter(function(options) {
  // 在发起真正的 Ajax 请求之前，统一拼接请求的根路径
  options.url = 'http://ajax.frontend.itheima.net' + options.url;
  
  //给url以/my/开头的ajax请求添加请求头
  if(options.url.indexOf('/my/') !== -1) {
    options.headers = {
      Authorization: localStorage.getItem('token') || ''
  }
  }

  //全局统一挂载 complete 回调函数
  //无论请求成功与否，都执行complete函数
  options.complete = function (res) {
    //请求失败执行程序
    if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
        //清空本地存储中的token
        localStorage.removeItem('token');
        //跳转到登录页面
        location.href = '/login.html';
    }
}
})

