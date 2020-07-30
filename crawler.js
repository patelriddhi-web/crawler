/**
 * Created by tushar on 13/09/17.
 */

"use strict";
const cheerio = require("cheerio");
const axios = require("axios");

/**
 * Crawls a website using a start {url}, and returns the lexicographically smallest string.
 * @param url
 * @return {Promise.<string>}
 */
module.exports = (url = "http://localhost:8080") =>
  new Promise(async (resolve, reject) => {
    let links = [];
    let strings = [];

    let result = await axios.get(url).then((res) => res.data);
    //console.log(res.data);
    let $ = cheerio.load(result);
    $(".link").each((_, element) => links.push(url + element.attribs.href));

    $(".codes h1").each((_, element) => strings.push($(element).html()));

    let i = 0;
    while (i < links.length) {
      let tempArr = [];
      let page = await axios.get(links[i]).then((res) => res.data);
      let $ = cheerio.load(page);
      $(".link").each((_, element) => tempArr.push(url + element.attribs.href));
      $(".codes h1").each((_, element) => strings.push($(element).html()));
      links = [...new Set([...links, ...tempArr])];
      ++i;
    }

    let finalResult = strings.sort((a, b) => a.localeCompare(b))[0];
    resolve(finalResult);
  });
