/**
 * =========================================
 *
 * puppeteer 模块学习爬虫
 *
 * =========================================
 */
const puppeteer = require('puppeteer');
const url = 'https://movie.douban.com/tag/#/';
const sleep = time => new Promise(resolve => {
	setTimeout(resolve, time);
});

;(async ()=> {

	console.log('Start visit the target page');

	// 创建puppeteer浏览器
	let browser = await puppeteer.launch({
		ignoreHTTPSErrors: false, // 是否在导航过程中忽略https错误。默认: false
		headless: true,  // 是否以无头模式运行浏览器 // Defaults to true unless the devtools option is true.
		//executablePath: '',  // 运行chromium或chrome可执行文件的路径，如果是相对路径，则相对当前目录解析。
		//slowMo: 0,   // 使Puppeteer操作减速指定的毫秒数。
		args: ['--no-sandbox'], // 船体给浏览器实例的其它参数。
		ignoreDefaultArgs: false, // 不要使用puppeteer.defaultArgs()。危险选择; 小心使用。默认为false。
		handleSIGINT: true, // ctrl + c 关闭浏览器进程。 默认true
		handleSIGTERM: true, // 在SIGTERM上关闭浏览器进程。默认为true。
		handleSIGHUP: true, // 在SIGHUP上关闭浏览器进程。默认为true。
		timeout: 30000, // 等待浏览器实例启动的最长时间（以毫秒为单位）。默认为30000（30秒）。通过0禁用超时。
		dumpio: false, // 是否将浏览器进程标准输出和标准错误输入process.stdout和process.stderr。默认为false
		// userDataDir: '', //  用户数据目录的路径。
		//env: process.env,  // [Object] 指定浏览器可见的环境变量。默认为process.env。
		devtools: false,  // 是否为每个选项卡自动打开DevTools面板。如果这个选项是true，该headless选项将被设置false。
		pipe: false  // 通过管道而不是WebSocket连接到浏览器。默认为false。
	});


	let page = await browser.newPage();
	await page.goto(url, {
		waitUntil: 'networkidle2' // 当网络加载完毕
	});

	await sleep(3000);

	// 等待下一页按钮出现
	await page.waitForSelector('.more');

	for(let i = 0; i < 1; i++){
		await sleep(3000);

		// 点击下一页按钮
		await page.click('.more');
	}

	let result = await page.evaluate(() => {
		let $ = window.$;
		let items = $('.list-wp a');
		let links = [];

		if(items.length >= 1){
			items.each((index, item) => {
				let it = $(item);
				let doubanID = it.find('div').data('id');
				let title = it.find('.title').text();
				let rate = Number(it.find('.rate').text());
				let thumbnail = it.find('img').attr('src');
				let big_img = thumbnail.replace('s_ratio', 'l_ratio');

				links.push({
					doubanID,
					title,
					rate,
					thumbnail,
					big_img
				});
			});
		}

		return links;
	});

	// 关闭puppeteer浏览器
	browser.close();

	console.log(result);
})();