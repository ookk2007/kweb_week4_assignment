const axios = require('axios');
const http = require('http');
const url = require('url');
const queryStr = require('querystring');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
	const parseURL = url.parse(req.url);
	const path = parseURL.pathname;
	const query = queryStr.parse(parseURL.query);
	if(path != '/'){
		res.statusCode = 404;
		res.end('Page Not Found!');
	}
	else if(query && !query.repo){
		res.statusCode = 404;
		res.end('Invalid Query!');
	}
	else{
		async function getCount(){
			try{
				const response = await axios.get(`https://api.github.com/repos/${query.repo}`);
				res.statusCode = 200;
				res.end(`Repo: ${query.repo}\nstargazers_count: ${response.data.stargazers_count}\nopen_issues_count: ${response.data.open_issues_count}`);
			} catch(error){
				res.statusCode = 404;
				res.end('Repository Not Found!');
				console.error(error);
			}
		}
		getCount();
	}	
});

server.listen(port, hostname, () => console.log(`Server ruunning at http://${hostname}:${port}/`));
