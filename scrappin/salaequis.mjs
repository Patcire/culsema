import {chromium} from "playwright"
import { writeFile } from 'fs'

const browser = await chromium.launch({headless: true})
const context = await browser.newContext({ javaScriptEnabled: false })
const page = await browser.newPage()
await page.goto('https://www.filmaffinity.com/es/theater-showtimes.php?id=1261')
await page.isVisible('button.css-113jtbf')
await page.click('button.css-113jtbf')
await page.waitForSelector('button.css-113jtbf', {state: 'detached'})
await page.click('.see-more' )

const films = await page.$$eval('.movie', results =>{
        return results.map(el =>{
            const poster = el.querySelector('img')?.src || ''
            const dateInfo = Array.from(el.querySelectorAll('.row.g-0.mb-2')).map(day => day.getAttribute('data-sess-date') || '')
            const filmTitle = el.querySelector('.fs-5')?.textContent || ''
            const director = Array.from(el.querySelectorAll('.mc-flex .mc-info-container .mc-director a')).map(dir => dir.textContent.trim() || '')
            const linkToPurchase = el.querySelector('.btn.btn-sm.btn-outline-secondary')?.href || ''
            return {poster, dateInfo, filmTitle, director, linkToPurchase}
        })
})

await browser.close()
writeFile('films.json',
    JSON.stringify(films, null, 2), 'utf8', (error) =>{})



