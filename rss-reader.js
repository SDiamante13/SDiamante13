const https = require('https');
const { parseString } = require('xml2js');

class RSSReader {
    constructor(feedUrl) {
        this.feedUrl = feedUrl;
    }

    async fetchFeed() {
        return new Promise((resolve, reject) => {
            https.get(this.feedUrl, (response) => {
                let data = '';
                
                response.on('data', (chunk) => {
                    data += chunk;
                });
                
                response.on('end', () => {
                    resolve(data);
                });
            }).on('error', (error) => {
                reject(error);
            });
        });
    }

    async parseRSS(xmlData) {
        return new Promise((resolve, reject) => {
            parseString(xmlData, (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            });
        });
    }

    formatNewsletterItem(item) {
        const title = item.title?.[0] || 'Untitled';
        const link = item.link?.[0] || '#';
        const pubDate = item.pubDate?.[0] || '';
        const date = new Date(pubDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
        
        return `- [${title}](${link}) - ${date}`;
    }

    async getLatestNewsletterIssues(limit = 5) {
        try {
            const xmlData = await this.fetchFeed();
            const parsedData = await this.parseRSS(xmlData);
            
            const items = parsedData.rss?.channel?.[0]?.item || [];
            const latestItems = items.slice(0, limit);
            
            return latestItems.map(item => this.formatNewsletterItem(item));
        } catch (error) {
            console.error('Error fetching RSS feed:', error);
            return ['- Unable to fetch newsletter issues at this time'];
        }
    }
}

module.exports = RSSReader;