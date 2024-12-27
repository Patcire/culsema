import {chromium} from "playwright"
import { writeFile } from 'fs'

const browser = await chromium.launch({headless: false})
const page = await browser.newPage()
await page.goto('https://www.pcineestudio.es/en-cartel')
await page.click('.N24JKK.bqbmwD.Pg7AcP.KiIMJv.Mm8Lm6')

await page.waitForSelector('div.Zc7IjY', { timeout: 5000 })

const films = await page.$$eval('div.Zc7IjY', results =>{
    return results.map((movie) =>{
        const poster = movie.querySelector('.MazNVa.comp-lrtqkqs4.wixui-image img')?.src || null
        //const dateInfo = Array.from(movie.querySelector('.HcOXKn.c9GqVL.QxJLC3.lq2cno.YQcXTT.comp-lsoxamr8.wixui-rich-text > span')?.
        //textContent.split('<br>').forEach() || null)
        // substring start at 15 because web put before real title next text: "Título Original"
        // font_8 wixui-rich-text__text --> selector of all movie info
        const filmTitle = movie.innerText.split('\n')[0]
        // substring start at 9 because web put before real title next text: "Dirección"
        const director = movie.textContent.split('\n')[4].substring(9) || null
        const linkToPurchase = movie.querySelector('.wixui-button.StylableButton2545352419__link')?.
            getAttribute('href') || null

        return { filmTitle, director, /*dateInfo*/ poster, linkToPurchase}
    })
})

await browser.close()
writeFile('films.json', JSON.stringify(films, null, 2), 'utf8', (error)=>{})