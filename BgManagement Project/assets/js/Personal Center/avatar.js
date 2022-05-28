$(function () {
  let layer = layui.layer;
  // 配合cropper的代码
  let $image = $("#image");
  const options = {
    aspectRatio: 1,
    // 指定预览区
    preview: ".img-preview ",
  };
  $image.cropper(options);

  // 按钮点击
  $("#btnChoseImg").on("click", function () {
    $("#file").click();
  });

  //获取到input上传的文件，通过change监听
  $("#file").on("change", function (e) {
    let filelist = e.target.files;
    if (filelist.length === 0) {
      return layer.msg("请上传图片", { icon: 5 });
    }

    //获得用户选择的文件
    let form_files = filelist[0];
    //文件选择上传，就脱离了本地存储，暂时存放在浏览器里
    //根据选择的文件创建对应的url地址
    const newImgUrl = URL.createObjectURL(form_files);
    //新的操作
    $image
      .cropper("destroy") //摧毁旧的裁剪区域
      .attr("src", newImgUrl) //重新设置图片路径
      .cropper(options); //重新初始化裁剪区域
  });

  $(".layui-btn-danger").on("click", function () {
    //将裁剪后的image输出为base64格式的字符串
    const dataUrl = $image
      .cropper("getCroppedCanvas", {
        width: 100,
        height: 100,
      })
      .toDataURL("image/png");
    // 发起请求——发送照片
    $.ajax({
      method: "POST",
      url: "/my/update/avatar",
      data: { avatar: dataUrl },
      success: function (res) {
        if (res.status != 0) {
          return layer.msg("更新头像失败", { icon: 5 });
        }
        layer.msg("更新头像成功", { icon: 6 });
        //测试使用
        //console.log(res);
        window.parent.getUserInfo();
        //临时修改头像
        //window.parent.Chanegavator(dataUrl);
      },
    });
  });
});
