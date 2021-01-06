$(function () {
    var layer = layui.layer;
    var form = layui.form;

    //初始化文章分类下拉列表
    initArtCateList();
    // 初始化富文本编辑器
    initEditor();

    //获取文章分类列表
    function initArtCateList() {
        $.ajax({
            type: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('初始化文章分类失败！');
                }
                //渲染到页面上
                var htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr);
                //动态获取的元素一定要用form.render()重新渲染一下
                form.render();
            }
        });
    }

    //裁剪图片
    // 1. 初始化图片裁剪器
    var $image = $('#image');
    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    };
    // 3. 初始化裁剪区域
    $image.cropper(options);


    //为选择封面按钮绑定点击事件
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click();
    });
    //监听$('#coverFile')的change事件
    $('#coverFile').on('change', function (e) {
        var file = e.target.files;
        if (file.length === 0) {
            return layer.msg('请选择图片！');
        }
        //更换裁剪的图片
        var newImgURL = URL.createObjectURL(file[0]);
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options);        // 重新初始化裁剪区域

    });

    //定义发表内容的状态
    var art_state = '已发布';

    //给‘存为草稿按钮’绑定点击事件
    $('#btnSave2').on('click', function () {
        art_state = '草稿';
    });

    //监听发表文章表单提交事件
    $('#form-pub').on('submit', function (e) {
        e.preventDefault();
        //获取表单数据
        var fd = new FormData($(this)[0]);
        //追加表单数据
        fd.append('state', art_state);
        //将裁剪后的图片，输出为文件
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append('cover_img', blob);
                //发布新文章
                publishArticle(fd);
            });
        //发起发布新文章请求
        function publishArticle(fd) {
            $.ajax({
                type: 'POST',
                url: '/my/article/add',
                data: fd,
                processData: false,
                contentType: false,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('发布文章失败！');
                    }
                    layer.msg('发布文章成功！');
                    //跳转到文章列表页面
                    location.href = '/artical/art_list.html';

                }
            });
        }
    });

})