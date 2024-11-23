import {chromium} from "playwright"
import { writeFile } from 'fs'

const browser = await chromium.launch({headless: false})
const page = await browser.newPage()
await page.goto('https://cine.entradas.com/cine/madrid/sala-berlanga/sesiones')
await page.locator('button.button-primary.button-sm').nth(2).click()

let initialPosition = 0
let finalPosition = 999999999

const scrollTo = (startPosition, EndPosition) =>{
    window.scrollTo(startPosition, EndPosition)
}

const scrollPositions = async () => {
    await page.evaluate(() => {
        initialPosition = window.scrollY
        scrollTo(initialPosition, document.body.scrollHeight)
        finalPosition = window.scrollY
    })
}

while (initialPosition !== finalPosition) {
    scrollPositions()
}