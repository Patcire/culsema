import {chromium} from "playwright"
import { writeFile } from 'fs'

const browser = await chromium.launch({headless: false})
const page = await browser.newPage()
await page.goto('https://cine.entradas.com/cine/madrid/sala-berlanga/sesiones')
await page.locator('button.button-primary.button-sm').nth(2).click()
const footer = await page.locator('footer')


const scrollToEnd = async () => {
    await page.evaluate(async () => {
        const isFooterVisible = async () => {
            return footer.evaluate((el) => {
                return el.getBoundingClientRect().bottom <= document.body.scrollHeight
            })
        }

        while ( window.innerHeight + window.scrollY < document.body.scrollHeight
                &&
                !await isFooterVisible() ) {
            await window.scrollBy(0, window.innerHeight)
        }
    })

}

await scrollToEnd()
await page.waitForTimeout(10000)
const films = await page.$$eval('div.py-6', results =>{
    return results.map(movie =>{
        const poster = movie.querySelector('img.transition-opacity')?.src || ''

        return { /*filmTitle, director, dateInfo, */poster, /*linkToPurchase*/ }
    })
})
console.log(films)
await browser.close()
writeFile('films.json',
    JSON.stringify(films, null, 2), 'utf8', (error) =>{})