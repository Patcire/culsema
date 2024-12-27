import {chromium} from "playwright"
import { writeFile } from 'fs'

const browser = await chromium.launch({headless: false})
const page = await browser.newPage()
await page.goto('https://www.pcineestudio.es/en-cartel')

// wixui-rich-text__text

const films = await page.$$eval('span.wixui-rich-text__text', results =>{
    return results.map((movie) =>{
        const poster = movie.querySelector('span.wixui-rich-text__text')?.split('<br>')[] || null
        const dateInfo = movie.querySelector('span.wixui-rich-text__text')?.split('<br>')[] || null
        // substring start at 15 because web put before real title next text: "Título Original"
        const filmTitle = movie.querySelector('span.wixui-rich-text__text')?.split('<br>')[0].substring(15) || null
        // substring start at 9 because web put before real title next text: "Dirección"
        const director = movie.querySelector('span.wixui-rich-text__text')?.split('<br>')[4].substring(9) || null
        const linkToPurchase = movie.querySelector('.wixui-button.StylableButton2545352419__link')?.getAttribute('href') || null

        return { filmTitle, director, dateInfo, poster, linkToPurchase}
    })
})