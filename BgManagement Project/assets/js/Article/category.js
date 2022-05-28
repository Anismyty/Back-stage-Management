$(function () {
  const layer = layui.layer;

  //axios一些基础数据，可以封装到二次函数里面
  let Authorization = localStorage.getItem("token");
  let url = "http://127.0.0.1:3007";
  let headers = {
    Authorization,
    "Content-Type": "application/x-www-form-urlencoded",
  };

  //获取类别列表
  async function getInfo() {
    const list = await axios({
      method: "GET",
      url: url + "/my/article/cates",
      headers,
    });
    renderList(list.data);
  }
  getInfo();

  // 把数据传输到后台
  async function addInfo(text) {
    const list = await axios({
      method: "POST",
      url: url + "/my/article/addcates",
      headers,
      data: text,
    });
  }

  // 添加按钮
  $(".layui-btn-normal").on("click", function () {
    layer.prompt({
      //这里依然指定类型是多行文本框，但是在下面content中也可绑定多行文本框
      formType: 2,
      title: "添加类别",
      area: ["300px", "100px"],
      btnAlign: "c",
      content: `<form class="layui-form" action="">
                    <div class="layui-form-item">
                        <label class="layui-form-label">分类名称：</label>
                        <div class="layui-input-block">
                        <input type="text" name="name" placeholder="请输入分类名称" class="layui-input" id="name">
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <label class="layui-form-label">English：</label>
                        <div class="layui-input-block">
                        <input type="text" name="alias" placeholder="请输入分类名称" class="layui-input" id="alias">
                        </div>
                    </div>
                </form>`,
      yes: function (index, layero) {
        //获取多行文本框的值
        let name = $("#name").val();
        let alias = $("#alias").val();
        if (name === "" || alias === "") {
          return alert("请输入内容");
        }
        let content = $(".layui-form").serialize();
        layer.msg("添加成功", { icon: 6 });
        addInfo(content);
        layer.close(index);
        getInfo();
      },
    });
  });

  // 编辑按钮
  $("tbody").on("click", ".edit", function () {
    let id = $(this).attr("id");
    catesId(id);
  });

  // 删除按钮
  $("tbody").on("click", ".del", function () {
    let id = $(this).attr("id");
    if (id != 1 && id != 2) {
      layer.confirm("确定删除？", { icon: 3, title: "提示" }, function (index) {
        delInfo(id);
        layer.close(index);
      });
    } else {
      layer.msg("禁止删除该类目！", { icon: 5 });
    }
  });

  //定义渲染函数
  function renderList(res) {
    if (res.data.length <= 0) {
      return layer.msg("获取列表失败！", { icon: 5 });
    }
    let content = template("model", res);
    $(".layui-table").children("tbody").html(content);
  }

  //删除按钮数据
  async function delInfo(id) {
    const list = await axios({
      method: "GET",
      url: url + "/my/article/deletecate/" + id,
      headers,
    });
    getInfo();
  }

  //编辑按钮获取文章分类数据
  async function catesId(id) {
    const list = await axios({
      method: "GET",
      url: url + "/my/article/cates/" + id,
      headers,
    });
    let name = list.data.data.name;
    let alias = list.data.data.alias;
    layer.prompt({
      //这里依然指定类型是多行文本框，但是在下面content中也可绑定多行文本框
      formType: 2,
      title: "添加类别",
      area: ["300px", "100px"],
      btnAlign: "c",
      content: `<form class="layui-form" action="">
                      <div class="layui-form-item">
                          <label class="layui-form-label">分类名称：</label>
                          <div class="layui-input-block">
                          <input type="text" name="name" value="${name}" class="layui-input" id="name">
                          </div>
                      </div>
                      <div class="layui-form-item">
                          <label class="layui-form-label">English：</label>
                          <div class="layui-input-block">
                          <input type="text" name="alias" value="${alias}" class="layui-input" id="alias">
                          </div>
                      </div>
                  </form>`,
      yes: function (index, layero) {
        //获取多行文本框的值
        let name = $("#name").val();
        let alias = $("#alias").val();
        if (name === "" || alias === "") {
          return alert("请输入内容");
        }
        let content =
          "Id=" + list.data.data.Id + "&" + $(".layui-form").serialize();
        layer.msg("修改成功", { icon: 6 });
        editSend(content);
        layer.close(index);
      },
    });
  }

  //编辑按钮的数据发送
  async function editSend(text) {
    const list = await axios({
      method: "POST",
      url: url + "/my/article/updatecate",
      headers,
      data: text,
    });
    getInfo();
  }

  $("body").on("focus", "input", function () {
    let text = $(this).val();
    $(this).val("");
  });
});
