import { test } from '@playwright/test';
// import fs from 'fs';

test('Search "귤" and extract results', async ({ page }) => {
  // 웹사이트 열기
  await page.goto('https://thirtymall.com/');

  // 검색창에 "커피" 입력
  const searchInput = await page.getByPlaceholder('검색어를 입력해 주세요');
  await searchInput.fill('귤');
  await searchInput.press('Enter');
  

  // 검색 결과 대기
  const itemsSelector = page.locator('div.mui-1kg578k'); // 특정 검색 결과의 셀렉터

  // 결과 항목 추출
  const results = await itemsSelector.evaluateAll((items) =>
    items.map((item, index) => ({
      no: index + 1,
      text: item.textContent?.trim() || '텍스트 없음',
    }))
  );

  // 추출한 데이터 확인
  console.log(results);

//   // 결과를 텍스트 파일에 저장
//   fs.writeFileSync('search-results.txt', JSON.stringify(results, null, 2), 'utf-8');
});