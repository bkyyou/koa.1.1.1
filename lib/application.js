const http = require('http');
const context = require('./context');
const request = require('./request');
const response = require('./response');
const Emitter = require('events');

class application extends Emitter {
	constructor() {
		super();
		this.cb;
		this.middlewaresArr = [];
		this.response = Object.create(response);
		this.request = Object.create(request);
		this.context = Object.create(context);
	}
	use (fn) {
		// this.cb = fn;
		this.middlewaresArr.push(fn);
	}
	listen (...args) {
		http.createServer(this.callback()).listen(...args);
	}
	callback () {

		if (!this.listenerCount('error')) this.on('error', this.onerror);

		return (req, res) => {
			// console.log(this.cb);
			let ctx = this.createContext(req, res);
			let that = this;
			// this.cb(req, res);
			// this.cb(ctx);

			let compose = this.compose();

			let handleResponse = () => that.responseBody(ctx);
			let onerror = (err) => ctx.onerror(err);

			compose(ctx).then(handleResponse).catch(onerror);
			// let result = compose(ctx);
			// console.log('result', result);
			// result.then(handleResponse);

			// compose(ctx);
			// setTimeout(function () {
			// 	handleResponse();
			// })


		}
	}
	createContext (req, res) {
		let ctx = Object.create(this.context);
		/**
		 * ctx.response = {
		 * 	get body() {
		 *  	return this.body;
		 * 	},
		 * 	set body(val) {
		 * 		this.body = val;
		 * 	}
		 * }
		 */
		ctx.request = Object.create(this.request);
		ctx.response = Object.create(this.response);

		ctx.app = ctx.request.app = ctx.response.app = this;

		ctx.req = ctx.request.req = req;
		ctx.res = ctx.response.res = res;

		return ctx;
	}
	responseBody (ctx) {
		let content = ctx.body;
		// console.log('responseBody', ctx)
		if (typeof content === 'string') {
			ctx.res.end(content);
		} else if (typeof content === 'object') {
			ctx.res.end(JSON.stringify(content));
		}
	}
	compose () {
		// console.log(111)
		// let index = 0;
		// let next = () => Promise.resolve();
		// let len = this.middlewaresArr.length;
		// for (let i = len - 1; i >= 0; i--) {
		// 	let currentMiddleware = this.middlewaresArr[i];
		// 	console.log('currentMiddleware', currentMiddleware);
		// 	next = createMiddlewareNext(currentMiddleware, next);
		// }
		// await next();
		// function createMiddlewareNext (currentMiddleware, oldNext) {
		// 	return async () => await currentMiddleware(ctx, oldNext);
		// }

		/* currentMiddleware = (ctx, next) => {
		* 											// ctx.body = 'hello world';
		* 											console.log(1);
		* 											next();
		* 											console.log(6)
		* 										}
		*/


		return async (ctx) => {
			let index = 0;
			let next = async () => {
				console.log('next Promise');
				return Promise.resolve();
			};
			let len = this.middlewaresArr.length;
			for (let i = len - 1; i >= 0; i--) {
				let currentMiddleware = this.middlewaresArr[i];
				// console.log('currentMiddleware', currentMiddleware);
				next = createMiddlewareNext(currentMiddleware, next);
			}
			await next();
			// next();
			function createMiddlewareNext (currentMiddleware, oldNext) {
				return async () => await currentMiddleware(ctx, oldNext);
				// return () => currentMiddleware(ctx, oldNext);
			}
		}

		// return (ctx) => {
		// 	let index = 0;
		// 	let next = () => Promise.resolve();
		// 	let len = this.middlewaresArr.length;

		// 	for (let i = len - 1; i >= 0; i--) {
		// 		let currentMiddleware = this.middlewaresArr[i];
		// 		// console.log('currentMiddleware', currentMiddleware);
		// 		next = createMiddlewareNext(currentMiddleware, next);
		// 	}

		// 	next();

		// 	function createMiddlewareNext (currentMiddleware, oldNext) {
		// 		// return async () => await currentMiddleware(ctx, oldNext);
		// 		return () => currentMiddleware(ctx, oldNext);
		// 	}
		// }

	}
	onerror (err) {
		console.log('application error');
		console.log('err stack', err.stack);
		let msg = err.stack || err.toString();

		// console.error(msg.replace(/^/g, '    '))
		console.error(msg);
	}
}

module.exports = application;  