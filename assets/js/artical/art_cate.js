$(function () {
    var layer = layui.layer;
    var form = layui.form;

    //获取文章分类列表
    initArtCateList();
    function initArtCateList() {
        $.ajax({
            type: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                var htmlStr = template('tpl-table', res);
                $('.layui-table tbody').html(htmlStr);
            }
        });
    }

    //为添加类别按钮绑定点击事件
    var indexAdd = null;
    $('#btnAddCate').on('click', function () {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        });
    });

    //通过事件委托的方式给动态添加的表单监听提交事件
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault();
        $.ajax({
            type: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg(res.message);
                initArtCateList();
                //根据索引关闭对应的弹出层
                layer.close(indexAdd);
            }
        });
    });

    //通过事件委托的方式给动态添加的编辑按钮点击事件
    var indexEdit = null;
    $('tbody').on('click', '#btn-edit', function () {
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        });
        var id = $(this).attr('data-id');
        $.ajax({
            type: 'GET',
            url: '/my/article/cates/' + id,
            success: function (res) {
                form.val('form-edit', res.data);
            }
        });
    });

    //通过事件委托的方式给动态添加的修改分类的表单监听提交事件
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault();
        $.ajax({
            type: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg(res.message);
                //根据索引关闭对应的弹出层
                layer.close(indexEdit);
                //重新渲染页面
                initArtCateList();
            }
        });

    });

    //删除事件
    $('tbody').on('click', '#btn-delete', function () {
        var id = $(this).attr('data-id');
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            //发起ajax删除请求
            $.ajax({
                type: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message);
                    }
                    layer.msg(res.message);
                    //根据索引关闭对应的弹出层
                    layer.close(index);
                    //重新渲染页面
                    initArtCateList();
                }
            });


        });
    });
})