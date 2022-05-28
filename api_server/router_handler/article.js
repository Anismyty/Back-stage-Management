const db = require("../db/index");

//获取列表
const getList = "select * from ev_article_cate where is_delete=0";
//添加类目
const ifRepeat = "select * from ev_article_cate where name =?";
const addCate = "insert into ev_article_cate set?";
const delCate = "update ev_article_cate set is_delete=1 where id=?";
const researchIDCate = "select * from ev_article_cate where id =?";
const updataCate = "update ev_article_cate set ? where Id =?";

//获取列表
exports.getArticle = (req, res) => {
  db.query(getList, (err, results) => {
    if (err) return res.cc(err);
    if (results.length === 0) return res.cc("不存在文章分类！");
    //这里状态判断交给前端
    res.send({
      status: 0,
      msg: "获取列表成功！",
      data: results,
    });
  });
};

//添加类目
exports.addArticle = (req, res) => {
  //先判断类名是否重复
  db.query(ifRepeat, req.body.name, (err, results) => {
    if (err) return res.cc(err);
    if (results.length > 0) return res.cc("该类目已存在，请重新输入类目！");
    //确认类目不重复后添加
    const content = {
      name: req.body.name,
      alias: req.body.alias,
    };
    db.query(addCate, content, (err, results) => {
      if (err) {
        return res.cc(err);
      }
      if (results.affectedRows != 1) {
        return res.cc("添加类目失败，请稍后尝试！");
      }
      return res.cc("新增文章分类成功！", 0);
    });
  });
};

//删除类目
exports.delCate = (req, res) => {
  if (req.params.id === 1 || req.params.id === 2)
    return res.cc("该文章分类不可删除！");
  db.query(delCate, req.params.id, (err, results) => {
    if (err) return res.cc(err);
    if (results.affectedRows !== 1) return res.cc("删除文章分类失败");
    res.cc("删除文章分类成功！", 0);
  });
};

//根据id获取文章分类
exports.getCateId = (req, res) => {
  db.query(researchIDCate, req.params.id, (err, results) => {
    if (err) return res.cc(err);
    if (results[0].is_delete === 1) return res.cc("该类目已删除");
    if (results.length !== 1) return res.cc("获取文章分类失败");
    res.send({
      status: 0,
      msg: "获取文章分类成功！",
      data: results[0],
    });
  });
};

//更新文章类目
exports.updateCate = (req, res) => {
  //第一二条记录不允许修改
  if (req.body.Id === 1 || req.body.Id === 2) return res.cc("该类目不允许修改");
  // 先查询id是否存在
  db.query(researchIDCate, req.body.Id, (err, results) => {
    if (err) return res.cc(err);
    if (results.length !== 1) return res.cc("类目id输入错误");
    //id存在后再进行修改
    db.query(updataCate, [req.body, req.body.Id], (err, results) => {
      if (err) return res.cc(err);
      if (results.affectedRows !== 1) return res.cc("更新文章类目失败！");
      res.cc("更新成功！", 0);
    });
  });
};
