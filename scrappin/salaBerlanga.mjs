import {chromium} from "playwright"
import { writeFile } from 'fs'

const browser = await chromium.launch({headless: false})
const page = await browser.newPage()
await page.goto('https://cine.entradas.com/cine/madrid/sala-berlanga/sesiones')
await page.locator('button.button-primary.button-sm').nth(2).click()

const scrollToEnd = async () => {

    let initialPosition = 0
    let finalPosition = 1
    while (initialPosition !== finalPosition) {
        finalPosition = await page.evaluate(() => {
            initialPosition = window.scrollY
            window.scrollBy(0, window.innerHeight)
            return document.body.innerHeight
        })
    }
}

await scrollToEnd()

const films = await page.$$eval('div.py-6 ', results =>{
    return results.map(el =>{
        const poster = el.querySelector('img.transition-opacity')?.src || ''
       /* const dateInfo = Array.from(
            el.querySelectorAll('')).map(day =>
            day.getAttribute('') || null
        )*/
        const filmTitle = el.querySelector('.text-dark.space-x-2.text-xl.font-medium.leading-tight')?.textContent || null
        /*const director = Array.from(el.querySelectorAll('')).map(dir => dir.textContent.trim() || '')
        const linkToPurchase = el.querySelector('')?.href || ''*/
        return { filmTitle, director, dateInfo, poster, linkToPurchase}
    })
})

await browser.close()
writeFile('films.json',
    JSON.stringify(films, null, 2), 'utf8', (error) =>{})