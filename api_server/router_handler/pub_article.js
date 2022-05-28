const db = require("../db/index");
const path = require("path");

//添加文章
const addStr = "insert into ev_article set ? ";

//更新文章
const updateStr = `update ev_article set ? where id =?`;

//获取文章列表
const jointQuery = `SELECT r.Id,r.title,r.pub_date,r.state,l.Id,l.name as cate_name
FROM ev_article as r 
LEFT JOIN ev_article_cate as l 
ON r.cate_id=l.Id
where r.is_delete=0 AND l.is_delete=0`;

//条件判断
const getStr = `SELECT r.Id,r.title,r.pub_date,r.state,l.name as cate_name
FROM ev_article as r 
LEFT JOIN ev_article_cate as l 
ON r.cate_id=l.Id
where r.is_delete=0 AND l.is_delete=0 and r.state=? and l.Id=? limit ?,?`;

const getStr2 = `SELECT r.Id,r.title,r.pub_date,r.state,l.name as cate_name
FROM ev_article as r 
LEFT JOIN ev_article_cate as l 
ON r.cate_id=l.Id
where r.is_delete=0 AND l.is_delete=0 and l.Id=? limit ?,?`;

const getStr3 = `SELECT r.Id,r.title,r.pub_date,r.state,l.name as cate_name
FROM ev_article as r 
LEFT JOIN ev_article_cate as l 
ON r.cate_id=l.Id
where r.is_delete=0 AND l.is_delete=0 and r.state=? limit ?,?`;

const getStr4 = `SELECT r.Id,r.title,r.pub_date,r.state,l.name as cate_name
FROM ev_article as r 
LEFT JOIN ev_article_cate as l 
ON r.cate_id=l.Id
where r.is_delete=0 AND l.is_delete=0 limit ?,?`;

//根据id删除文章
const delStr = `update ev_article set is_delete=1 where id =?`;

//根据id获取文章详情
const detailStr = `select * from ev_article where id=?`;

//分割线————————————————分割线

//添加文章
exports.addArticle = (req, res) => {
  //joi只能校验body或者params格式的数据，file里的数据只能通过if语句判断
  if (!req.file || req.file.fieldname !== "cover_img")
    return res.cc("请上传文章封面！");
  const articleInfo = {
    ...req.body,
    cover_img: path.join("/uploads", req.file.filename),
    pub_date: new Date(),
    author_id: req.user.id,
  };
  db.query(addStr, articleInfo, (err, results) => {
    if (err) return res.cc(err);
    if (results.affectedRows !== 1) return res.cc("发布文章失败！");
    res.cc("新增文章成功！", 0);
  });
};

//获取文章列表
exports.getArticleList = (req, res) => {
  //多表联合查询
  /* db.query(jointQuery, (err, results) => {
    if (err) res.cc(err);
    if (results.length <= 0) return res.cc("文章列表不存在！");
    const numAritle = results.length;
    const a = req.query.pagenum;
    const b = req.query.pagesize;
    //查询出条数后再根据条件查询【太繁琐了！】
    if (req.query.cate_id !== "" && req.query.state !== "") {
      db.query(
        getStr,
        [req.query.state, req.query.cate_id, b * (a - 1), b],
        (err, results) => {
          res.send({
            status: 0,
            msg: "获取文章列表成功！",
            data: results,
            total: results.length,
          });
        }
      );
    } else if (req.query.cate_id !== "") {
      db.query(getStr2, [req.query.cate_id, b * (a - 1), b], (err, results) => {
        res.send({
          status: 0,
          msg: "获取文章列表成功！",
          data: results,
          total: numAritle,
        });
      });
    } else if (req.query.state !== "") {
      db.query(getStr3, [req.query.state, b * (a - 1), b], (err, results) => {
        res.send({
          status: 0,
          msg: "获取文章列表成功！",
          data: results,
          total: numAritle,
        });
      });
    } else {
      db.query(getStr4, [b * (a - 1), b], (err, results) => {
        res.send({
          status: 0,
          msg: "获取文章列表成功！",
          data: results,
          total: numAritle,
        });
      });
    }
  }); */
  //封装到函数里调用，比较清晰【虽然还是一样的麻烦！】
  const num = req.query.pagenum;
  const size = req.query.pagesize;
  Simple(req.query.cate_id, req.query.state, num, size, res);
};

//a:req.query.cate_id
//b:req.query.state
function Simple(a, b, c, d, res) {
  if (a !== "" && b !== "") {
    let totalStr = `SELECT r.Id,r.title,r.pub_date,r.state,l.name as cate_name
    FROM ev_article as r 
    LEFT JOIN ev_article_cate as l 
    ON r.cate_id=l.Id
    where r.is_delete=0 AND l.is_delete=0 and l.Id=? and r.state=?`;
    let limitStr = totalStr + ` limit ?,?`;
    db.query(totalStr, [a, b], (err, results) => {
      if (err) res.cc(err);
      const numAritle = results.length;
      db.query(limitStr, [a, b, d * (c - 1), d], (err, results) => {
        res.send({
          status: 0,
          msg: "获取文章列表成功！",
          data: results,
          total: numAritle,
        });
      });
    });
  } else if (a !== "") {
    let totalStr = `SELECT r.Id,r.title,r.pub_date,r.state,l.name as cate_name
    FROM ev_article as r 
    LEFT JOIN ev_article_cate as l 
    ON r.cate_id=l.Id
    where r.is_delete=0 AND l.is_delete=0 and l.Id=?`;
    let limitStr = totalStr + ` limit ?,?`;
    db.query(totalStr, a, (err, results) => {
      if (err) res.cc(err);
      const numAritle = results.length;
      db.query(limitStr, [a, d * (c - 1), d], (err, results) => {
        res.send({
          status: 0,
          msg: "获取文章列表成功！",
          data: results,
          total: numAritle,
        });
      });
    });
  } else if (b !== "") {
    let totalStr = `SELECT r.Id,r.title,r.pub_date,r.state,l.name as cate_name
    FROM ev_article as r 
    LEFT JOIN ev_article_cate as l 
    ON r.cate_id=l.Id
    where r.is_delete=0 AND l.is_delete=0 and r.state=?`;
    let limitStr = totalStr + ` limit ?,?`;
    db.query(totalStr, b, (err, results) => {
      if (err) res.cc(err);
      const numAritle = results.length;
      db.query(limitStr, [b, d * (c - 1), d], (err, results) => {
        res.send({
          status: 0,
          msg: "获取文章列表成功！",
          data: results,
          total: numAritle,
        });
      });
    });
  } else {
    let totalStr = `SELECT r.Id,r.title,r.pub_date,r.state,l.name as cate_name
    FROM ev_article as r 
    LEFT JOIN ev_article_cate as l 
    ON r.cate_id=l.Id
    where r.is_delete=0 AND l.is_delete=0`;
    let limitStr = totalStr + ` limit ?,?`;
    db.query(totalStr, (err, results) => {
      if (err) res.cc(err);
      const numAritle = results.length;
      db.query(limitStr, [d * (c - 1), d], (err, results) => {
        res.send({
          status: 0,
          msg: "获取文章列表成功！",
          data: results,
          total: numAritle,
        });
      });
    });
  }
}

//根据id删除文章
exports.delArticle = (req, res) => {
  db.query(delStr, req.params.id, (err, results) => {
    if (err) return res.cc(err);
    if (results.affectedRows !== 1) return res.cc("删除文章分类失败");
    res.cc("删除文章分类成功！", 0);
  });
};

//根据id获取细节
exports.getDetail = (req, res) => {
  db.query(detailStr, req.params.id, (err, results) => {
    if (err) return res.cc(err);
    if (results.length !== 1) return res.cc("获取文章失败！");
    res.send({
      status: 0,
      msg: "获取文章成功！",
      data: results[0],
    });
  });
};

//修改文章
exports.updateArticle = (req, res) => {
  //joi只能校验body或者params格式的数据，file里的数据只能通过if语句判断
  if (!req.file || req.file.fieldname !== "cover_img")
    return res.cc("请上传文章封面！");
  const articleInfo = {
    title: req.body.title,
    cate_id: req.body.cate_id,
    content: req.body.content,
    state: req.body.state,
    cover_img: path.join("/uploads", req.file.filename),
    pub_date: new Date(),
    author_id: req.user.id,
  };
  db.query(updateStr, [articleInfo, req.body.Id], (err, results) => {
    if (err) return res.cc(err);
    if (results.affectedRows !== 1) return res.cc("文章更新失败！");
    res.cc("文章更新成功！", 0);
  });
};
