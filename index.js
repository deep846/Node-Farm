const fs = require("fs");
const http = require("http");
const url = require("url");



const port = process.env.port || 3000
const data = fs.readFileSync(__dirname + "/dev-data/data.json", "utf-8");
const overviewtemp = fs.readFileSync(
  __dirname + "/templates/template-overview.html",
  "utf-8"
);
const producttemp = fs.readFileSync(
  __dirname + "/templates/template-product.html",
  "utf-8"
);
const cardtemp = fs.readFileSync(
  __dirname + "/templates/template-card.html",
  "utf-8"
);
const dataobj = JSON.parse(data);

replaceTemplate = (temp, ele) => {
  let output = temp.replace(/{%PRODUCTNAME%}/g, ele.productName);
  output = output.replace(/{%IMAGE%}/g, ele.image);
  output = output.replace(/{%FROM%}/g, ele.from);
  output = output.replace(/{%NUTRIENTS%}/g, ele.nutrients);
  output = output.replace(/{%QUANTITY%}/g, ele.quantity);
  output = output.replace(/{%PRICE%}/g, ele.price);
  output = output.replace(/{%DESCRIPTION%}/g, ele.description);
  output = output.replace(/{%ID%}/g, ele.id);

  if (!ele.organic) {
    output = output = output.replace(/{%NOT_ORGANIC%}/g, "not-organic");
  }
  return output;
};

const server = http.createServer((req, res) => {
  const { pathname, query } = url.parse(req.url, true);

  console.log(req.url);
  if (req.url === "/api") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      "আজকে আমাদের বাড়িতে অনুষ্ঠান এর আয়োজন করা হয়েছে শুধু মাত্র nodejs ডেভেলপার দের জন্য"
    );
  } else if (req.url === "/overview" || req.url === "/") {
    res.writeHead(200, { "content-type": "text/html" });
    const template = dataobj.map((ele) => replaceTemplate(cardtemp, ele));
    const output = overviewtemp.replace(/{%PRODUCT_CARDS%}/g, template);
    // console.log(output);
    res.end(output);
  } else if (pathname === "/product") {
    res.writeHead(200, { "content-type": "text/html" });
    const product = dataobj[query.id];
    const output = replaceTemplate(producttemp, product);
    res.end(output);
  } else {
    res.writeHead(404, { "content-type": "text/html" });
    res.end("<h1>404 Error page do not exists</h1>");
  }
});

server.listen(port, () => {
  console.log("Server on port no 3000");
});
