import { DEFAULT_DETECTION_SETTINGS } from '../constants/keywordRules';

/**
 *
 * @param {*} file
 * @param {*} settings
 * @returns
 */
export async function analyzeDocument(file, settings = DEFAULT_DETECTION_SETTINGS) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('settings', JSON.stringify(settings));

  const res = await fetch('http://localhost:5000/api/analyze', {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    throw new Error('문서 분석 실패');
  }

  return res.json();
}
