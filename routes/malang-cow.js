var express = require('express');
var router = express.Router();
var firebase = require("firebase");
var dateFormat = require('dateformat');
const axios = require("axios");
const cheerio = require("cheerio");



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



router.get('/index', function(req,res,next){
  res.render('malang-cow/index', {row: ""});
});


router.get('/test2', function(req, res, next) {
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
          res.render('malang-cow/test', {rows: conList});

    });
});


module.exports = router;
