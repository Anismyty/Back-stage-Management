//路由模块
const express = require("express");
const router = express.Router();
const article_handler = require("../router_handler/article");

//1.验证数据的中间件
const expressJoi = require("@escook/express-joi");

//2.导入需要的验证规则
//这个得到的是一个对象，但是我们只需要里面的verify_LoginRegister，所以需要解构赋值
const { addcate, delcate, updataCate } = require("../schema/user");

//获取分类列表
router.get("/cates", article_handler.getArticle);

//添加类目
router.post("/addcates", expressJoi(addcate), article_handler.addArticle);

//删除类目【:】后面表示id是自动生成的
router.get("/deletecate/:id", expressJoi(delcate), article_handler.delCate);

//根据ID获取文章分类
router.get("/cates/:id", expressJoi(delcate), article_handler.getCateId);

//根据ID更新文章分类
router.post("/updatecate", expressJoi(updataCate), article_handler.updateCate);



module.exports = router;
