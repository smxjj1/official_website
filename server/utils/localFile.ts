import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * 读取本地 JSON 数据
 * @param checkCallback 数据检查回调函数
 */
export function readJsonData<T = any>(checkCallback?: <U extends T = any>(data: U) => boolean): T[] {
  let folderPath: string;
  const result: T[] = [];
  const notPassList: any[] = [];
  if (import.meta.dev) {
    folderPath = join(process.cwd(), 'server/data');
  }
  else {
    if (process.cwd().endsWith('.output')) {
      folderPath = join(process.cwd(), 'server/data');
    }
    else {
      folderPath = join(process.cwd(), '.output/server/data');
    }
  }

  const files = readdirSync(folderPath);

  for (const file of files) {
    if (file.endsWith('.json')) {
      const jsonData = readFileSync(join(folderPath, file), 'utf-8');
      const sourceList = JSON.parse(jsonData);
      sourceList.forEach((item: T) => {
        if (checkCallback) {
          !checkCallback(item) && notPassList.push(item);
        }
        result.push(item);
      });
    }
  }

  console.log('[ReadLocalJSON] Data loading completed!');
  if (notPassList.length > 0) {
    console.log(`${notPassList.length} items failed to pass the data check.`);
    for (const element of notPassList) {
      console.log(element.id);
    }
    console.log('---------------------------------------------');
  }
  return result;
}
