import { test, expect } from '@playwright/test';

// 테스트 케이스 정의
const TEST_CASES = [
    { no: "1", search: "사과" },
    { no: "2", search: "포도" },
    { no: "3", search: "과자" },
    { no: "4", search: "딸기" },
    { no: "5", search: "망고" },
];

test.describe('Search Functionality', () => {
    TEST_CASES.forEach(testCase => {
        test(`Test Case ${testCase.no}: Searching for '${testCase.search}'`, async ({ page }) => {
            await page.goto('https://thirtymall.com/');
            await page.fill("input[placeholder='검색어를 입력해 주세요']", testCase.search);
            await page.press("input[placeholder='검색어를 입력해 주세요']", 'Enter');
            await page.waitForSelector('text=검색결과', { timeout: 5000 });

            // 2초 대기
            await page.waitForTimeout(2000);

            const items = await page.locator('div.mui-1kg578k p.mui-l1goj5').allTextContents();

            console.log(`Test Case ${testCase.no} Results:`);
            items.forEach((item, index) => {
                console.log(`${index + 1}: ${item.trim()}`);
            });

            expect(items.length).toBeGreaterThan(0);
        });
    });
});
