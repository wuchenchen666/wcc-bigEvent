$(function () {
    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;

    //定义查询列表参数
    var q = {
        pagenum: 1,
        pagesize: 2,
        cate_id: '',
        state: ''
    }

    //定义补零函数
    function padZero(n) {
        return n < 10 ? '0' + n : n;
    }
    //定义梅花时间过滤器
    template.defaults.imports.dataFormat = function (date) {
        var dt = new Date(date);
        var y = dt.getFullYear();
        var m = padZero(dt.getMonth() + 1);
        var d = padZero(dt.getDate());
        var h = padZero(dt.getHours());
        var mm = padZero(dt.getMinutes());
        var s = padZero(dt.getSeconds());
        return y + '-' + m + '-' + d + ' ' + h + ':' + mm + ':' + s;
    }
    //获取文章的列表数据
    getArtList();
    function getArtList() {
        $.ajax({
            type: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);
                //渲染分页
                renderPage(res.total);
            }
        });
    }

    //获取文章分类
    getCate();
    function getCate() {
        $.ajax({
            type: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                var htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr);
                //通知layui重新渲染表单的UI结构
                form.render();
            }
        });
    }

    //监听筛选表单提交事件
    $('#form-search').on('submit', function (e) {
        e.preventDefault();
        q.cate_id = $('[name=cate_id]').val();
        q.state = $('[name=state]').val();
        //根据最新筛选条件重新渲染数据
        getArtList();
    });

    //定义渲染分页的函数
    function renderPage(total) {
        laypage.render({
            elem: 'pageBox', //注意，这里的 test1 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: q.pagesize, //每页几条数据
            curr: q.pagenum,//默认显示第几页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            //当分页进行切换时或laypage.render被调用时，会调用jump回调函数,如果是通过aypage.render被调用时触发，则first值是true,切换分页时，first值是undefined
            jump: function (obj, first) {
                q.pagenum = obj.curr;
                q.pagesize = obj.limit;
                if (!first) { //只有在进行分页切换是菜调用getArtList函数
                    getArtList();
                }
            }
        });
    }

    //删除事件
    $('tbody').on('click', '#btn-delete', function () {
        //获取当前页面中删除按钮的个数
        var len = $('#btn-delete').length;
        var id = $(this).attr('data-id');
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            //发起ajax删除请求
            $.ajax({
                type: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message);
                    }
                    layer.msg(res.message);
                    //根据索引关闭对应的弹出层
                    layer.close(index);
                    //如果len=1表示当前页面只有一个删除按钮，删除后就没有数据了，让页码数-1
                    if (len === 1) {
                        //判断若当前页码值等于1 ，则不再-1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
                    }
                    //重新渲染页面
                    getArtList();
                }
            });
        });
    });
})