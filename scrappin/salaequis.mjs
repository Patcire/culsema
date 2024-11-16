import {chromium} from "playwright"
import { writeFile } from 'fs'

console.log('start')
const browser = await chromium.launch({headless: false})
const page = await browser.newPage()
await page.goto('https://www.filmaffinity.com/es/theater-showtimes.php?id=1261')
await page.locator('button.css-113jtbf').nth(1).click()
const selectors = page.locator('.btn.btn-sm.btn-outline-secondary.d-flex.justify-content-between.see-more')
const count = await selectors.count()
console.log(count)
for (let i = 0; i<count; i++){
    await selectors.nth(i).scrollIntoViewIfNeeded()
    await selectors.nth(i).click()
    await page.waitForTimeout(100)
    console.log('click')
}

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
console.log('cerramos')
await browser.close()
writeFile('films.json',
    JSON.stringify(films, null, 2), 'utf8', (error) =>{})



