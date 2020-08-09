const Koa = require('koa');

const app = new Koa();


app.use(async (ctx, next) => {
	console.log(1);
	await next();
	// next();
	console.log(6)
})
app.use(async (ctx, next) => {
	console.log(2);
	await next();
	// next();
	console.log(5)
})
app.use(async (ctx, next) => {
	console.log(3);
	// await next();
	ctx.status = 500;
	ctx.body = 'hello world';
	console.log(4)
})

app.listen(3001, function () {
	console.log('running');
})