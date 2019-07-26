var express = require('express');
var router = express.Router();
var firebase = require("firebase");
var dateFormat = require('dateformat');
const axios = require("axios");
const cheerio = require("cheerio");
const nodemailer = require('nodemailer');


var config = {
  apiKey: "AIzaSyCjhGDDIg7bUy5SGjp4tytNwH8y71TyEYk",
  authDomain: "gaehyunee-toy.firebaseapp.com",
  databaseURL: "https://gaehyunee-toy.firebaseio.com",
  projectId: "gaehyunee-toy",
  storageBucket: "",
  messagingSenderId: "665024156368"
};

firebase.initializeApp(config);
var db = firebase.firestore();

const getHtml = async () => {
  try {
    return await axios.get("https://festa.io/api/v1/events?page=1&pageSize=4&order=createdAt&excludeExternalEvents=true");
  } catch (error) {
    console.error(error);
  }
};

router.post('/malangSave', function(req, res, next){
  var postData = req.body;
  postData.reg_dt = Date.now();
  var doc = db.collection("user").doc();
  doc.set(postData);
  res.redirect('index');

});

router.get('/malangUser', function(req, res, next){
  db.collection('user').orderBy("reg_dt", "desc").get()
      .then((snapshot) => {
          var rows = [];
          snapshot.forEach((doc) => {
              var childData = doc.data();
              childData.reg_dt = dateFormat(childData.reg_dt, "yyyy-mm-dd");
              rows.push(childData);
          });
          res.render('malang-cow/malangUser', {rows: rows});
      })
      .catch((err) => {
          console.log('Error getting documents', err);
      });
});

router.post('')



router.get('/index', function(req,res,next){
  res.render('malang-cow/index', {row: ""});
});


router.get('/festaList', function(req, res, next) {
  getHtml()
    .then(html => {

          let conList = [];

          var rows = html.data.rows;

          for(var i = 0; i < rows.length; i++){
            conList[i]={
              name : rows[i].name,
              createdAt :  rows[i].createdAt
            }
          }
          res.render('malang-cow/festaList', {rows: conList});

    });
});

router.get("/nodemailerTest", function(req, res, next){
  let email = req.body.email;

  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'gaehyunee@gmail.com',  // gmail 계정 아이디를 입력
      pass: ''          // gmail 계정의 비밀번호를 입력
    }
  });

  let mailOptions = {
    from: 'gaehyunee@gmail.com',    // 발송 메일 주소 (위에서 작성한 gmail 계정 아이디)
    to: email ,                     // 수신 메일 주소
    subject: 'Sending Email using Node.js',   // 제목
    text: 'That was easy!'  // 내용
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    }
    else {
      console.log('Email sent: ' + info.response);
    }
  });

  res.redirect("/");
});


module.exports = router;
