import { test } from '@playwright/test';
import fs from 'fs';

test.describe('Notice Page Tests', () => {
    test('Fetch Notice Data', async ({ page }) => {
        const result: { passed: boolean; data: Array<Record<string, string | string[]>>; error?: string } = {
            passed: false,
            data: [],
        };

        try {
            // 공지사항 페이지로 이동
            await page.goto('https://thirtymall.com/');
            const noticeButton = page.locator("div.mui-k008qs a", { hasText: "공지사항" });
            await noticeButton.click();

            // 공지사항 목록 가져오기
            await page.waitForSelector("div.mui-1xnox0e a.mui-dpunb4", { timeout: 5000 });
            const notices = page.locator("div.mui-1xnox0e a.mui-dpunb4");
            const noticeCount = Math.min(await notices.count(), 5);

            console.log(`공지사항 개수: ${noticeCount}`); // 디버깅용 로그

            for (let i = 0; i < noticeCount; i++) {
                const singleNotice: Record<string, string | string[]> = {};

                const notice = notices.nth(i);
                if (!(await notice.isVisible())) {
                    console.error(`공지사항 ${i + 1}이 보이지 않습니다.`);
                    continue;
                }
                console.log(`공지사항 ${i + 1} 클릭 중...`);
                singleNotice.pageNotice = await notice.textContent() || '';
                await notice.click();

                // 공지사항 상세 데이터 가져오기
                const detailTitle = page.locator("h6.mui-gu01b3");
                await detailTitle.isVisible();
                singleNotice.noticeTitle = await detailTitle.textContent() || '';

                const detailDate = page.locator("span.mui-1fjo7ut").nth(2);
                if (await detailDate.isVisible()) {
                    singleNotice.noticeDate = await detailDate.textContent() || '';
                }

                const detailViews = page.locator("span.mui-zulz1m");
                if (await detailViews.isVisible()) {
                    singleNotice.noticeViews = await detailViews.textContent() || '';
                }

                // 공지사항 내용 가져오기
                const spans = page.locator("h6.mui-9wbbi4 span");
                const spanCount = await spans.count();
                const allTexts: string[] = [];

                for (let j = 0; j < spanCount; j++) {
                    const text = await spans.nth(j).textContent();
                    if (text) {
                        allTexts.push(text);
                    }
                }

                singleNotice.noticeContent = allTexts;
                result.data.push(singleNotice);

                console.log(`공지사항 ${i + 1} 처리 완료.`);

                // 이전 페이지로 돌아가기
                await page.goBack();

                // 공지사항 목록 다시 가져오기
                await page.waitForSelector("div.mui-1xnox0e a.mui-dpunb4", { timeout: 5000 });
            }

            result.passed = true;

        } catch (error) {
            console.error("테스트 중 오류 발생:", error);
            result.error = (error as Error).message;
        }

        // 결과를 JSON 파일에 저장
        fs.writeFileSync('notice_test_results.json', JSON.stringify(result, null, 4), {
            encoding: 'utf-8',
        });
        console.log("Test results have been saved to 'notice_test_results.json'");
    });
});
