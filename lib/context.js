let proto = {
	onerror (err) {
		console.log('中间件层捕获函数');

		this.app.emit('error', err);

		let msg = '服务器响应错误';

		// console.log('this', this);

		// this.response.status = err.status;
		if ('ENOENT' == err.code) err.status = 404;
		// this.response.status = err.status
		this.response.status = 500;

		this.res.setHeader('Content-Type', 'text/plain;charset=utf-8');
		this.res.setHeader('Content-Length', Buffer.byteLength(msg));

		this.res.end(msg);
	}
};

function delegateSet (property, name) {
	// proto = {
	// 	get body (val) {
	// 		return this.response.body;
	// 	},
	// 	set body (val) {
	// 		this.response.body = val;
	// 	}
	// }

	proto.__defineSetter__(name, function (val) { // proto.body
		this[property][name] = val;
		// this.response.body = val;  // this === proto
	})
}
function delegateGet (property, name) {
	proto.__defineGetter__(name, function () {
		return this[property][name];
	})
}

let responseSet = ['body', 'status'];
let responseGet = responseSet;

let requestSet = [];
let requestGet = ['query'];

responseSet.forEach(val => {
	delegateSet('response', val); // proto.body
})
responseGet.forEach(val => {
	delegateGet('response', val);
})
requestSet.forEach(val => {
	delegateSet('response', val);
})
requestGet.forEach(val => {
	delegateGet('response', val);
})

module.exports = proto;