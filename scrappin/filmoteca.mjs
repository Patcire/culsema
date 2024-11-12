import {chromium} from "playwright"
import { writeFile } from 'fs'

const browser = await chromium.launch({
        headless: true
})

const page = await browser.newPage()

await page.goto('https://entradasfilmoteca.gob.es/listaPeliculas.aspx')

const films = await page.$$eval('.thumbnail', results =>{
        return results.map(el =>{
            const poster = el.querySelector('input')?.src || ''
            const dayInfo = el.querySelector('h2')?.textContent.replace(/\s*\n\s*/g, ' ').trim().trim() || ''
            const filmTitle = el.querySelector('.linkPelicula')?.textContent.replace(/\s*\n\s*/g, ' ').trim() || ''
            const director = el.querySelector('h3')?.textContent.replace(/\s*\n\s*/g, ' ').trim() || ''

            return {poster, dayInfo, filmTitle, director}
        })
})

await browser.close()
writeFile('films.json',
    JSON.stringify(films, null, 2), 'utf8', (error) =>{})



