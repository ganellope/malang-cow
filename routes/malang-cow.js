var express = require('express');
var router = express.Router();

const axios = require("axios");
const cheerio = require("cheerio");


const getHtml = async () => {
  try {
    return await axios.get("https://festa.io/api/v1/events?page=1&pageSize=4&order=createdAt&excludeExternalEvents=true");
  } catch (error) {
    console.error(error);
  }
};


router.get('/test', function(req, res, next) {
  getHtml()
    .then(html => {
      let ulList = [];
      const $ = cheerio.load(html.data);
      var jsonData = JSON.parse(html.data);

      if(jsonData.hasOwnProperty('rows'))
      {
      //  $.each(json, function(key, value){
      //    alert('key:' + key + ' / ' + 'value:' + value);
      //  });
      }
      //const $bodyList = $("div.headline-list ul").children("li.section02");
      const $bodyList = $("div.sc-htpNat").children("div.sc-bdVaJa");
      $bodyList.each(function(i, elem) {
        ulList[i] = {
            title: $(this).find('h3.EventCard__Title-sc-1fkxjid-7').text(),
          //  url: $(this).find('strong.news-tl a').attr('href'),
          //  image_url: $(this).find('p.poto a img').attr('src'),
          //  image_alt: $(this).find('p.poto a img').attr('alt'),
        //    summary: $(this).find('p.lead').text().slice(0, -11),
            date: $(this).find('span.EventCard__TimeRow-sc-1fkxjid-6').text()
        };
      });

      const data = ulList.filter(n => n.title);
      res.render('malang-cow/test', {rows: data});
      console.log("이거ㅔ 뭐얌"+jsonData);
    });
});

router.get('/test2', function(req, res, next) {
  getHtml()
    .then(html => {
          console.log("이거ㅔ 뭐얌"+html.data.rows);
          var rows = html.data.rows;
          console.log("변환 전 : "+typeof rows);

          var str =  JSON.stringify(rows);
          console.log("변환 전 : "+typeof str);
          console.log(str);
          res.render('malang-cow/test', {str: str});

          //대괄호 지워라!
          for(key in rows) {
              console.log('key:' + key + ' / ' + 'value:' + rows.name);
          }

        //  var jsonData = JSON.parse(rows);

    });
});


module.exports = router;
