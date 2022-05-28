//验证规则单独一个表
const joi = require("joi");
const { addArticle } = require("../router_handler/article");

//注册登录的验证规则
const username = joi.string().alphanum().min(1).max(10).required();
const password = joi
  .string()
  .pattern(/^[\S]{6,12}$/)
  .required();

//定义更新的验证规则
const id1 = joi.number().integer().min(1).required();
const nickname = joi.string().required();
const email = joi.string().email().required();
//更新密码
const oldPwd = password;
const newPwd = joi.not(joi.ref("oldPwd")).concat(password);
//头像
const avatar = joi.string().dataUri().required();
//文章类目
const cateName = joi
  .string()
  .pattern(/[\u4e00-\u9fa5]/)
  .required();
const alias = joi
  .string()
  .alphanum()
  .pattern(/^[A-Z]/)
  .required();

const delId = joi.number().integer().min(1).required();

//发布文章
const title = joi.string().min(1).required();
const content = joi.string().required().allow("");
const state = joi.string().valid("已发布", "草稿").required();

//获取文章列表
const pagenum = joi.number().integer().min(1).required();
const pagesize = joi.number().integer().min(1).required();
const art_id = joi.string().allow(""); //最好设置允许为空，因为前端是有这个设置的
const state_a = joi.string().allow("").valid("已发布", "草稿");

//定义注册登录的验证对象
exports.verify_LoginRegister = {
  //表示对req.body里面的数据进行验证
  body: {
    username,
    password,
  },
};

exports.update_UserInfo = {
  body: {
    id: id1,
    nickname,
    email,
  },
};

exports.infoUpdatepwd = {
  body: {
    oldPwd,
    newPwd,
  },
};

exports.avatarAdd = {
  body: {
    avatar,
  },
};

//添加文章类目——判断输入类目的合法性
exports.addcate = {
  body: {
    name: cateName,
    alias,
  },
};

//删除类目——判断id合法性
exports.delcate = {
  params: {
    id: delId,
  },
};

//更新文章类目——判断输入类目的合理性
exports.updataCate = {
  body: {
    Id: delId,
    name: cateName,
    alias,
  },
};

//发布文章验证规则
exports.addArticleNeed = {
  body: {
    title,
    cate_id: delId,
    content,
    state,
  },
};

//获取文章列表验证规则
exports.getAriList = {
  query: {
    pagenum,
    pagesize,
    cate_id: art_id,
    state: state_a,
  },
};

//更新文章验证规则
exports.updataArticle = {
  body: {
    Id: delId,
    title,
    cate_id: delId,
    content,
    state,
  },
};
