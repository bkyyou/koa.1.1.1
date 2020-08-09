// const Koa = require('koa');
// const http = require('http');

// http.createServer((req, res) => {
// 	res.end('hello');
// }).listen(3000, () => {
// 	console.log('running');
// })


const Koa = require('./lib/application');

const app = new Koa();

// app.use((req, res) => {
// 	res.end('hello world');
// });

// function getClientIP (req) {
// 	console.log("req.headers['x-real-ip']", req.headers['x-real-ip']);
// 	return req.headers['x-forwarded-for'] || // 判断是否有反向代理 IP
// 		req.connection.remoteAddress || // 判断 connection 的远程 IP
// 		req.socket.remoteAddress || // 判断后端的 socket 的 IP
// 		req.connection.socket.remoteAddress;
// };

app.use(async (ctx, next) => {
	// ctx.body = 'hello world';
	// throw new Error('hello err');
	console.log(1);
	// console.log(getClientIP(ctx.req));
	await next();
	console.log(6)
});

app.use(async (ctx, next) => {
	console.log(2);
	await next();
	console.log(5)
});

app.use((ctx, next) => {
	console.log(3);
	// ctx.status = 500;
	ctx.body = 'hello world';
	console.log('ctx.body', ctx.body);
	console.log(4);
	// console.log('next', next.toString());
});

app.listen(3000, () => {
	console.log('running');
})

// app.use((ctx, next) => {
// 	// ctx.body = 'hello world';
// 	console.log(1);
// 	next();
// 	console.log(6)
// });

// app.use((ctx, next) => {
// 	console.log(2);
// 	next();
// 	console.log(5)
// });

// app.use((ctx, next) => {
// 	console.log(3);
// 	ctx.body = 'hello world';
// 	console.log(4);
// 	console.log('next', next);
// });

// app.listen(3000, () => {
// 	console.log('running');
// })