module.exports = {
	set body (val) {
		console.log('set body')
		this._body = val;  // this = ctx.response
	},
	get body () {
		return this._body;
	},
	get status () {
		return this.res.statusCode
	},
	set status (statusCode) {
		console.log('statusCode', statusCode);
		if (typeof statusCode !== 'number') {
			throw new Error('Something is wrong!')
		}
		this.res.statusCode = statusCode;
	}
}