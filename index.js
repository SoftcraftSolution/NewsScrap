const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const PORT = 3000;
const url = 'https://www.forexlive.com/';

async function scrapeForexLive() {
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        const articles = [];

        $('.article-slot__wrapper').each((index, element) => {
            const title = $(element).find('a').text().trim();
            const link = $(element).find('a').attr('href');
            const image = $(element).find('img').attr('src');
            const article=$(element).find('article').text().trim()

            if (title && link && image) {
                articles.push({
                    title,
                    link: `https://www.forexlive.com${link}`,
                    image,
                    article
                });
            }
        });

        return articles;
    } catch (error) {
        console.error('Error scraping ForexLive:', error);
        return [];
    }
}

app.get('/api/scrape', async (req, res) => {
    const articles = await scrapeForexLive();
    res.json(articles);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
