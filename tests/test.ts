import { expect, test } from '@playwright/test'

test('footer 标签中应该包含备案信息', async ({ page }) => {
    await page.goto('/')
    const beian = await page.locator(
        'footer a[href="https://beian.miit.gov.cn/"]',
    )
    await expect(beian).toBeVisible()
    await expect(beian).toHaveText('粤ICP备2022140595号-1')
})
