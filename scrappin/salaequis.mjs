import {chromium} from "playwright"
import { writeFile } from 'fs'

const browser = await chromium.launch({headless: true})
const page = await browser.newPage()
await page.goto('https://www.filmaffinity.com/es/theater-showtimes.php?id=1261')
await page.locator('button.css-113jtbf').nth(1).click()

let selectors = page.locator('.see-more')
let count = await selectors.count()

for (let i = 0; i<count; i++){

    await selectors.nth(i).scrollIntoViewIfNeeded()
    await selectors.nth(i).waitFor({ state: 'visible', timeout: 15000 })
    await selectors.nth(i).click({timeout: 5000})
    await page.waitForTimeout(5000)

    selectors = page.locator('.btn.see-more')
    count =  await selectors.count()

}

const films = await page.$$eval('.movie', results =>{
    return results.map(movie =>{
            const poster = movie.querySelector('img')?.src || ''
            const dateInfo = Array.from(
                movie.querySelectorAll('.row.g-0.mb-2')).map(day =>
                day.getAttribute('data-sess-date') || null,
            )
            const filmTitle = movie.querySelector('.fs-5')?.textContent || null
            const director = Array.from(movie.querySelectorAll('.mc-flex .mc-info-container .mc-director a')).map(dir => dir.textContent.trim() || '')
            const linkToPurchase = movie.querySelector('.btn.btn-sm.btn-outline-secondary')?.href || ''
            return { filmTitle, director, dateInfo, poster, linkToPurchase}
        })
})

await browser.close()
writeFile('films.json',
    JSON.stringify(films, null, 2), 'utf8', (error) =>{})



