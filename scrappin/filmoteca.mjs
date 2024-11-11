import {chromium} from "playwright";

const browser = await chromium.launch({
        headless: true
})

const page = await browser.newPage()

await page.goto('https://entradasfilmoteca.gob.es/Calendario.aspx')

const films = await page.$$eval(
    '#Calendario a',
    (results) =>{
        results.map((el) =>{
            const dayNumber = el.querySelector('td > a:first-child').textContent
            const dayOfTheWeek = el.querySelector('.diaSemana').textContent
            const filmTime = el.querySelector('#text:nth-child(1)').textContent
            const filmTitle = el.querySelector('#text:nth-child(2)').textContent
        })
    }
)

