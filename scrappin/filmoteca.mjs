import {chromium} from "playwright"
import { writeFile } from 'fs'

const browser = await chromium.launch({
        headless: true
})

const page = await browser.newPage()

await page.goto('https://entradasfilmoteca.gob.es/listaPeliculas.aspx')

const films = await page.$$eval('.thumbnail', results =>{
        return results.map(el =>{
            const poster = el.querySelector('input')?.src || null
            const dateInfo = el.querySelector('h2')?.textContent.replace(/\s*\n\s*/g, ' ').trim().trim() || null
            const filmTitle = el.querySelector('.linkPelicula')?.textContent.replace(/\s*\n\s*/g, ' ').trim() || null
            const director = el.querySelector('h3')?.textContent.replace(/\s*\n\s*/g, ' ').trim() || null
            const linkToPurchase = el.querySelector('input')?.src || null

            return { filmTitle, director, dateInfo, poster, linkToPurchase}

        })
})

await browser.close()
writeFile('films.json',
    JSON.stringify(films, null, 2), 'utf8', (error) =>{})



