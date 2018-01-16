var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var PORT = 8080;
var Bitpay = require("bitpay-api");
var bitpay = new Bitpay();
var blockexplorer = require('blockchain.info/blockexplorer'); //another way to get a TXID confirmation

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.listen(PORT, function(){
	console.log("Server started at:" +PORT);
});

app.get("/", (req, res)=>{
	console.log("/");
	bitpay.getBTCBestBidRates(function(err, rates) {
		res.send("Crypto shop\n"+rates[1].name+" : "+ rates[1].rate);
	});
})

app.get("/txid/:TXID", (req, res)=>{
	res.send(blockexplorer.getTx(req.params.TXID));
});