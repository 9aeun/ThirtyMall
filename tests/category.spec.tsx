import { test } from '@playwright/test';

async function processCategory(page, categoryIndex: number): Promise<string> {
    // "전체 카테고리" 버튼 대기 후 클릭
    const categoryButton = page.getByRole("button", { name: "Image 전체카테고리" });
    await categoryButton.isVisible();
    // await categoryButton.click();

    // 큰 카테고리 선택
    const largeCategories = page.locator("div.mui-1rs1pq0 > ul > li");
    const largeCategoriesCount = await largeCategories.count();
    console.log(`큰 카테고리 요소 수: ${largeCategoriesCount}`);

    await largeCategories.nth(categoryIndex).hover();

    // 세부 카테고리 순회
    const subcategories = page.locator("div.mui-rj0dsj > ul > li");
    const subcategoryCount = await subcategories.count();
    await largeCategories.nth(categoryIndex).click();

    for (let j = 0; j < subcategoryCount; j++) {
        console.log(`큰 카테고리 ${categoryIndex + 1} 세부 카테고리 ${j + 1}/${subcategoryCount} 처리 중...`);

        // 세부 카테고리 클릭
        await categoryButton.click();
        await largeCategories.nth(categoryIndex).hover();
        await subcategories.nth(j).hover();

        // 확대 카테고리 순회
        const expandedCategories = page.locator("div.mui-182ep59 > ul > li");
        const expandedCategoryCount = await expandedCategories.count();
        await subcategories.nth(j).click();

        for (let k = 0; k < expandedCategoryCount; k++) {
            console.log(`  확대 카테고리 ${k + 1}/${expandedCategoryCount} 처리 중...`);

            // 확대 카테고리 클릭
            await categoryButton.click();
            await largeCategories.nth(categoryIndex).hover();
            await subcategories.nth(j).hover();
            await expandedCategories.nth(k).click();
        }
    }

    return `큰 카테고리 ${categoryIndex + 1} 완료`;
}

test.describe('Category Functionality', () => {
    test('Process All Categories', async ({ page }) => {
        await page.goto("https://thirtymall.com/");

        // "전체 카테고리" 버튼 대기 후 클릭
        const categoryButton = page.getByRole("button", { name: "Image 전체카테고리" });
        await categoryButton.isVisible();
        await categoryButton.click();

        // 큰 카테고리 가져오기
        const largeCategories = page.locator("div.mui-1rs1pq0 > ul > li");
        const largeCategoryCount = await largeCategories.count();
        console.log(`전체 카테고리 수: ${largeCategoryCount}`);

        const results: string[] = [];
        for (let i = 0; i < largeCategoryCount; i++) {
            console.log(`큰 카테고리 ${i + 1} 처리 시작`);
            const result = await processCategory(page, i);
            results.push(result);
        }

        results.forEach(result => console.log(result));
    });
});
