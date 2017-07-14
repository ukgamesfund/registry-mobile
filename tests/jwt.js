let Wallet = require('ethereumjs-wallet')
let EthUtil = require('ethereumjs-util')
let Request = require('request')
let Web3 = require('web3')

let web3 = new Web3()

let bundle = {
	"version": 3,
	"id": "cf80fac9-39b1-40e5-ada3-2c789e861017",
	"address": "8e5e059c4d8b6de2342a83e6c245747aafa1a7d7",
	"crypto": {
		"ciphertext": "25f22526ed061cfa05a60585ee64b4cd2f3912f3659f18a67b170dbf4dd1567e",
		"cipherparams": {"iv": "8a4c4eea135d3486ba4f7ac17a273cdb"},
		"cipher": "aes-128-ctr",
		"kdf": "scrypt",
		"kdfparams": {
			"dklen": 32,
			"salt": "195f0f00f98de634058cc7e06424142adf9dcd36c713e559e168f3306d987fbb",
			"n": 262144,
			"r": 8,
			"p": 1
		},
		"mac": "f9ed50a296e0384127bd30794ed159e8b402e42fdee5e53dc174eca89a7313f8"
	}
}
let wallet = Wallet.fromV3(bundle, "1234567890")
console.log(wallet.getAddressString())

let privateKey = wallet.getPrivateKeyString()

function strip0x(input) {
	if (typeof(input) !== 'string') {
		return input;
	}
	else if (input.length >= 2 && input.slice(0, 2) === '0x') {
		return input.slice(2);
	}
	else {
		return input;
	}
}

//let backend = "services.dltlab.io"
let backend = "localhost"

let request = Request.defaults({jar: true})
let jar = request.jar()
let url = "http://" + backend + ":8000/v1/id/jwt"
request({url: url + "/8e5e059c4d8b6de2342a83e6c245747aafa1a7d7", jar: jar},
	function (error, response, body) {
		var cookies = jar.getCookies(url);
		console.log(cookies)

		let code = JSON.parse(body).code
		console.log("code: " + code)

		let hash = web3.sha3(code, {encoding: 'hex'});
		console.log("hash: " + hash)

		let sig = EthUtil.ecsign(EthUtil.toBuffer(hash), EthUtil.toBuffer(privateKey))
		console.log(sig)

		let signature = EthUtil.toRpcSig(sig.v, sig.r, sig.s)
		console.log(signature)

		let post = {signature: strip0x(signature)}

		request.post({url: url, jar: jar, json: true, body: post},
			function (error, response, body) {
				console.log(body)
			}
		)
	})

/*
 exports.pubToAddress = exports.publicToAddress = function(pubKey) {
 var hash = new SHA3.SHA3Hash(256)
 hash.update(pubKey.slice(-64))
 return new Buffer(hash.digest('hex').slice(-40), 'hex')
 }
 */

/*
 let personJson = JSON.stringify(person)
 let personHex = EthUtil.bufferToHex(personJson)
 console.log(personHex)

 let hash = web3.sha3(personHex, {encoding: 'hex'});
 console.log(hash)



 let signature = EthUtil.toRpcSig(sig.v, sig.r, sig.s)
 console.log(signature)

 let req = {
 person: person,
 signature: signature
 }

 console.log(JSON.stringify(req, null, 2))

 let publicKey = wallet.getPublicKey()
 console.log(EthUtil.toBuffer(publicKey).toString('hex'))
 */
