$(function () {
  //layui专属的需要
  let form = layui.form;
  const layer = layui.layer;
  const laypage = layui.laypage;
  //数据的最初格式【略微有点鸡肋】
  let q = {
    pagenum: 1, //页码值
    pagesize: 2, //每条显示几条  //方法一总共获取几条信息
    cate_id: "", //文章分类ID
    state: "", //发布状态
  };

  //美化时间过滤器
  template.defaults.imports.dataFormat = function (date) {
    const dt = new Date(date);
    let y = dt.getFullYear();
    let m = padZero(dt.getMonth() + 1);
    let d = padZero(dt.getDate());
    let hh = padZero(dt.getHours());
    let mm = padZero(dt.getMinutes());
    let ss = padZero(dt.getSeconds());

    return y + "-" + m + "-" + d + " " + hh + ":" + mm + ":" + ss;
  };
  // 补0
  function padZero(n) {
    return n > 9 ? n : "0" + n;
  }
  //获取表单区域的分类
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

  // 定义渲染分页方法

  //方法一
  /* function rederPage(res) {
    laypage.render({
      elem: "demo7",
      count: res.total, //需要陈列的数据
      limit: 2, //设置初始的展示条数
      limits: [2, 4, 6], //设置选择页面的数字
      layout: ["count", "limit", "prev", "page", "next", "skip"],
      jump: function (obj) {
        const thisData = res.data
          .concat()
          .splice(obj.curr * obj.limit - obj.limit, obj.limit);
        // 使用模板引擎渲染页面
        const htmlStr = template("model", thisData);
        $("tbody").html(htmlStr);
      },
    });
  } */

  //方法二
  function rederPage(total) {
    laypage.render({
      elem: "demo7",
      count: total, //需要陈列的数据
      limit: q.pagesize, //设置初始的展示条数
      curr: q.pagenum, //同步curr，否则一直为1
      layout: ["count", "limit", "prev", "page", "next", "skip"],
      limits: [2, 4, 6], //设置选择页面的数字
      jump: function (obj, first) {
        q.pagenum = obj.curr;
        q.pagesize = obj.limit;
        if (!first) {
          initTable();
        }
      },
    });
  }

  //渲染整个页面
  function initTable() {
    $.ajax({
      method: "GET",
      url: "/my/article/list",
      data: q,
      success: function (res) {
        if (res.status != 0) {
          return layer.msg("获取文章列表失败", { icon: 5 });
        }
        //方法一
        // 分页和页面渲染结合
        //rederPage(res);

        //渲染列表
        const htmlStr = template("model", res);
        $("tbody").html(htmlStr);
        //方法二
        //单独渲染
        rederPage(res.total);
      },
    });
  }

  //删除文章
  function delList(id, length) {
    $.ajax({
      method: "GET",
      url: "/my/article/delete/" + id,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("删除文章失败！", { icon: 5 });
        }
        layer.msg("删除文章成功！", { icon: 6 });
        length--;
        if (length === 0) {
          q.pagenum--;
          if (q.pagenum === 0) {
            q.pagenum = 1;
          }
        }
        initTable();
      },
    });
  }

  //所有默认方法的调用
  initTable();
  getCategory();

  // 筛选按钮
  $(".layui-form").on("submit", function (e) {
    e.preventDefault();
    q.cate_id = $("[name=cate_id]").val();
    q.state = $("[name=state]").val();
    initTable();
  });

  //删除按钮
  $("tbody").on("click", ".del", function () {
    let id = $(this).attr("id");
    let len = $(".del").length;
    if (id != 1 && id != 2) {
      layer.confirm(
        "确定删除该文章？",
        { icon: 3, title: "提示" },
        function (index) {
          delList(id, len);
          layer.close(index);
        }
      );
    } else {
      layer.msg("禁止删除该类目！", { icon: 5 });
    }
  });

  //编辑按钮
  $("tbody").on("click", ".edit", function () {
    localStorage.removeItem("id");
    let id = $(this).attr("id");
    localStorage.setItem("id", id);
    location.href = "/home/Article/edit.html";
  });
});
