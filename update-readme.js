const fs = require('fs');
const path = require('path');
const RSSReader = require('./rss-reader');

const RSS_FEED_URL = 'https://subscribepage.io/refactor-to-grow/feed';
const README_PATH = path.join(__dirname, 'README.md');

async function updateReadmeWithNewsletter() {
    try {
        const rssReader = new RSSReader(RSS_FEED_URL);
        const newsletterItems = await rssReader.getLatestNewsletterIssues(5);
        
        const readmeContent = fs.readFileSync(README_PATH, 'utf8');
        
        const startMarker = '<!-- NEWSLETTER-LIST:START -->';
        const endMarker = '<!-- NEWSLETTER-LIST:END -->';
        
        const startIndex = readmeContent.indexOf(startMarker);
        const endIndex = readmeContent.indexOf(endMarker);
        
        if (startIndex === -1 || endIndex === -1) {
            console.error('Newsletter markers not found in README.md');
            return;
        }
        
        const beforeMarker = readmeContent.substring(0, startIndex + startMarker.length);
        const afterMarker = readmeContent.substring(endIndex);
        
        const newsletterSection = '\n' + newsletterItems.join('\n') + '\n';
        
        const updatedContent = beforeMarker + newsletterSection + afterMarker;
        
        fs.writeFileSync(README_PATH, updatedContent);
        console.log('README.md updated successfully with latest newsletter issues!');
        
    } catch (error) {
        console.error('Error updating README:', error);
    }
}

if (require.main === module) {
    updateReadmeWithNewsletter();
}

module.exports = { updateReadmeWithNewsletter };