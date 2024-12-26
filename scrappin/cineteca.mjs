import {chromium} from "playwright"
import { writeFile } from 'fs'

const browser = await chromium.launch({headless: true})
const page = await browser.newPage()

const urlDinamic = (pageNumber) =>{
    return `https://www.cinetecamadrid.com/programacion?page=${pageNumber}`
}

const getCinetecafilms = async () =>{
    return await page.$$eval('.views-row', results =>{
        return results.map(el =>{
            const poster = el.querySelector('.image-style-miniaturas')?.src || null
            const dateInfo = el.querySelector('.field.field--name-field-dias-de-proyeccion.field--type-datetime.field--label-hidden.field__items')?.textContent.trim().trim() || null
            const filmTitle = el.querySelector('.title')?.textContent.trim() || null
            const director = el.querySelector('.director')?.textContent.trim() || null
            const linkToPurchase = el.querySelector('.title a')?.href || null

            return { filmTitle, director, dateInfo, poster, linkToPurchase}

        })
    })
}

let pageNumber = 0
let films = []
let selectors= 1

while (selectors>0 ){
    films = [...films, ...await getCinetecafilms()]
    await page.goto(urlDinamic(pageNumber++))
    selectors = await page.locator('.views-row').count()
}

await browser.close()
writeFile('films.json',
    JSON.stringify(films, null, 2), 'utf8', (error) =>{})
