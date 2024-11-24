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

scrollToEnd()
