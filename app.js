const express = require('express')
const bodyParser = require('body-parser')
const { API_URL, API_KEY } = require('./secret.js')
const fetch = require('node-fetch')
const app = express().use(bodyParser.json())
const url = `${API_URL}recruitment/vacancies?page=1`
const options = {
	method: 'GET',
	headers: {
		accept: 'application/x-www-form-urlencoded',
		'X-API-KEY': API_KEY
	}
}
async function fn(indexPage) {
	const url = `${API_URL}recruitment/vacancies?page=${indexPage}`
	const res = await fetch(url, options)
	const { data } = await res.json()
	return data
}
async function init() {
	const res = await fetch(url, options)
	const { data, metadata } = await res.json()
	const pages = metadata.pagination.pages
	let store = data
	const arr = new Array(parseInt(pages))
	for await (let [index, value] of arr.entries()) {
		if (index > 0) {
			const res = await fn(index)
			store = store.concat(res)
		}
	}
	const posts = store.filter(item => item.state === 'opened')
	return posts
}
app.get('/', async (req, res) => {
	const response = await init()
	res.json(response)
})
app.listen(3001, () => console.log('[People force api] is listening'))
