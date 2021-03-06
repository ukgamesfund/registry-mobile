const Artifactor = require("truffle-artifactor");
const abi = require('./test-abi.json')

const data =  {
	contract_name: "test",
		abi: [{"constant":false,"inputs":[{"name":"number","type":"uint256"}],"name":"SetNumber","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"Number","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"inputs":[],"payable":false,"type":"constructor"}],
	unlinked_binary: "60606040523415600b57fe5b5b600080555b5b6096806100206000396000f300606060405263ffffffff60e060020a600035041663331bb01b8114602a578063624de72514603c575bfe5b3415603157fe5b603a600435605b565b005b3415604357fe5b60496064565b60408051918252519081900360200190f35b60008190555b50565b600054815600a165627a7a72305820b0572eacc4c978af303b2063b809c3d0105eccc4eca87e9969fce3d0ef5da3ab0029"
}

let artifactor = new Artifactor("./");
artifactor.save(data)

