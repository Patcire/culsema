import {chromium} from "playwright"
import { writeFile } from 'fs'

const browser = await chromium.launch({
    headless: true
})

const page = await browser.newPage()

await page.goto('https://www.cinetecamadrid.com/programacion')

const films = await page.$$eval('.views-row', results =>{
    return results.map(el =>{
        const poster = el.querySelector('')?.src || ''
        const dateInfo = el.querySelector('')?.textContent.replace(/\s*\n\s*/g, ' ').trim().trim() || ''
        const filmTitle = el.querySelector('')?.textContent.replace(/\s*\n\s*/g, ' ').trim() || ''
        const director = el.querySelector('')?.textContent.replace(/\s*\n\s*/g, ' ').trim() || ''
        const linkToPurchase = el.querySelector('')?.src || ''

        return { filmTitle, director, dateInfo, poster, linkToPurchase}

    })
})

await browser.close()
writeFile('films.json',
    JSON.stringify(films, null, 2), 'utf8', (error) =>{})
