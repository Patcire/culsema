import { chromium } from "playwright"
import { writeFile } from 'fs'

const browser = await chromium.launch({ headless: true })
const page = await browser.newPage()
await page.goto('https://cine.entradas.com/cine/madrid/sala-berlanga/sesiones')
await page.locator('button.button-primary.button-sm').nth(2).click()

const scrollToEnd = async () => {
    await page.evaluate(async () => {
        while (window.innerHeight + window.scrollY < document.body.scrollHeight) {
            window.scrollBy(0, window.innerHeight)
            await new Promise(resolve => setTimeout(resolve, 500))
        }
    })
}

await scrollToEnd()
await page.waitForTimeout(1000)

const films = await page.$$eval('div.py-6', results => {
    return results.map(movie => {
        const poster = movie.querySelector('img.transition-opacity')?.src || null
        const dateInfo = Array.from(
            movie.querySelectorAll('.w-full.items-center.space-y-3.text-center')).map(day =>
            day.querySelector('.w-full.items-center.space-y-3.text-center > div').textContent || null
        )
        const filmTitle = movie.querySelector('.text-dark.space-x-2.text-xl.font-medium.leading-tight')?.textContent || ''
        const director = null // the web don't show it
        const linkToPurchase = Array.from(
            movie.querySelectorAll('.space-y-2 > a'))?.map(a =>
            'https://cine.entradas.com'+a.getAttribute('href') || null
        )
        return { poster, filmTitle, director, dateInfo, linkToPurchase }
    })
})

console.log(films)

writeFile('films.json', JSON.stringify(films, null, 2), 'utf8', (error) => {})

await browser.close()
