$(function () {
  //获取id
  let id = localStorage.getItem("id");
  let form = layui.form;

  //图片选择和裁剪
  let $image = $("#image");
  const options = {
    aspectRatio: 400 / 280,
    //设置初始剪裁框大小，作为修改，图片一开始应该和原来是一样的
    autoCropArea: 1,
    // 指定预览区
    preview: ".img-preview ",
  };
  $image.cropper(options);

  //根据id对相应表单赋值
  function fillForm() {
    $.ajax({
      method: "GET",
      url: "/my/article/" + id,
      success: function (res) {
        let title = res.data.title;
        let content = res.data.content;
        let id_d = res.data.cate_id;
        $("input[name='title']").val(title);
        $("#impot").text(content);
        //裁剪图片区域
        $image
          .cropper("destroy") //摧毁旧的裁剪区域
          .attr("src", "http://127.0.0.1:3007" + res.data.cover_img) //重新设置图片路径
          .cropper(options); //重新初始化裁剪区域
        choseCate(id_d);
      },
    });
  }
  fillForm();

  function choseCate(id_d) {
    $.ajax({
      method: "get",
      url: "/my/article/cates/" + id_d,
      success: function (res) {
        // 设置类别选择
        let opts = $("option");
        opts.each((i, v) => {
          let one = $(v).attr("value");
          if (one == id_d) {
            $(".layui-select-title input").val(res.data.name);
            $(v).attr("selected", "selected");
          }
        });
      },
    });
  }
  // 按钮点击
  $("#btnChoseImg").on("click", function () {
    $("#coverFile").click();
  });
  //获取到input上传的文件，通过change监听
  $("#coverFile").on("change", function (e) {
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

  //渲染分类
  function getCategory() {
    $.ajax({
      method: "GET",
      url: "/my/article/cates",
      success: function (res) {
        if (res.status != 0) {
          return layer.msg("获取文章列表失败", { icon: 5 });
        }
        const htmlStr = template("category", res);
        $(".allCategory").html(htmlStr);
        // layui专属的需要打开
        form.render();
      },
    });
  }

  //发布新文章
  function pubAirticle(data) {
    $.ajax({
      method: "POST",
      url: "/my/article/edit",
      data: data,
      //向服务器提交的是FormData格式的文件，必须添加这两个参数
      contentType: false,
      processData: false,

      success: function (res) {
        if (res.status != 0) {
          return layer.msg("发表失败！", { icon: 5 });
        }
        layer.msg("发表成功", { icon: 6 });
        // 跳回列表页面
        location.href = "/home/Article/list.html";
      },
    });
  }

  getCategory();
  initEditor();

  let art_state = "已发布";

  //两个按钮的state交换
  $(".one").on("click", function () {
    art_state = "已发布";
  });
  $(".two").on("click", function () {
    art_state = "草稿";
  });

  //为表单绑定提交事件
  $("#form-pub").on("submit", function (e) {
    e.preventDefault();
    //接口文档要求FormData格式
    let fd = new FormData($(this)[0]);
    //追加state
    fd.append("state", art_state);
    fd.append("Id", id);
    //查看FormData就是需要遍历，直接打印什么也没有
    /*  fd.forEach((v, k) => {
        console.log(k, v);
      }); */

    //将剪裁后的图片输出为文件
    $image
      .cropper("getCroppedCanvas", { width: 400, height: 280 })
      .toBlob(function (blob) {
        //将图片blob也加到fd中
        fd.append("cover_img", blob);
        //提交数据必须放在添加图片blob后面
        //如果放在外面，因为异步函数原因，先执行pubAirticle后才会添加图片的blob

        pubAirticle(fd);
      });
  });
});
