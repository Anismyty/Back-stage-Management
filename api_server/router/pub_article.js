//路由模块
const express = require("express");
const router = express.Router();
const pub_articleHandler = require("../router_handler/pub_article");

//为了解析formdate数据，需要multer
const multer = require("multer");
const path = require("path");
const uploads = multer({ dest: path.join(__dirname, "../uploads") });

//1.验证数据的中间件
const expressJoi = require("@escook/express-joi");

//2.导入需要的验证规则
//这个得到的是一个对象，但是我们只需要里面的verify_LoginRegister，所以需要解构赋值
const {
  addArticleNeed,
  getAriList,
  delcate,
  updataArticle,
} = require("../schema/user");

//发布文章
router.post(
  "/add",
  uploads.single("cover_img"),
  expressJoi(addArticleNeed),
  pub_articleHandler.addArticle
);

//获取文章列表
router.get("/list", expressJoi(getAriList), pub_articleHandler.getArticleList);

//根据id删除文章数据
router.get("/delete/:id", expressJoi(delcate), pub_articleHandler.delArticle);

//根据id获取文章详情
router.get("/:id", expressJoi(delcate), pub_articleHandler.getDetail);

//根据id更新文章信息
router.post(
  "/edit",
  uploads.single("cover_img"),
  expressJoi(updataArticle),
  pub_articleHandler.updateArticle
);

module.exports = router;
