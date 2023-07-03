import imagemin from 'imagemin';
import imageminSharp from 'imagemin-sharp';
import imageminWebp from 'imagemin-webp';
import fs from 'fs';
import path from 'path';
import {globby} from 'globby';
const MAX_SIZE = 5000;

let warnedFiles = []; // 초과하는 이미지 파일 이름을 저장할 배열

async function optimizeImages(files, folderPath, plugin) {
  const promises = files.map(async (filePath) => {
    const ext = path.extname(filePath).toLowerCase();
    if (!['.jpg', '.png', '.jpeg'].includes(ext)) {
      console.log(`⛔️ ${filePath}은 지원하지 않는 파일 형식입니다.`);
      return;
    }

    if (plugin === 'sharp') {
      try {
        const result = await imagemin([filePath], {
          destination: folderPath,
          plugins: [
            imageminSharp({
              chainSharp: async (sharp) => {
                const meta = await sharp.metadata();
                if (meta.width > MAX_SIZE) {
                  const fileName = path.basename(filePath);
                  if (!warnedFiles.includes(fileName)) {
                    warnedFiles.push(fileName);
                  }
                }
                return sharp;
              },
            }),
          ],
        });
        console.log(`🪄 ${filePath}의 이미지 압축이 완료되었습니다.`);
        return result;
      } catch (error) {
        console.error(`🚨 Error optimizing image:`, error);
      }
    } else if (plugin === 'webp') {
      const webpOutput = path.join(folderPath, 'webp');
      fs.mkdirSync(webpOutput, { recursive: true });

      const webpFilePath = path.join(webpOutput, path.basename(filePath, ext) + '.webp');
      try {
        const result = await imagemin([filePath], {
          destination: webpOutput,
          plugins: [
            imageminWebp({
              quality: 75,
            }),
          ],
        });
        console.log(`💎 ${filePath}의 WebP 변환 및 저장이 완료되었습니다.`);
        return result;
      } catch (error) {
        console.error(`🚨 Error converting to WebP:`, error);
      }
    }
  });

  return Promise.all(promises);
}

function formatFileList(fileList) {
  return fileList.map((fileName) => `'${fileName}'`).join(', ');
}

async function optimizeFolder(folderName, plugin) {
  const folderPath = path.join('imgs', folderName);

  if (!fs.existsSync(folderPath)) {
    console.error(`🚧 Error: '${folderName}' 폴더가 존재하지 않습니다.`);
    return;
  }

  const files = await globby(path.join(folderPath, '**/*.{jpg,png,jpeg}'));

  try {
    await optimizeImages(files, folderPath, plugin);

    // 초과하는 이미지 파일 리스트 출력
    if (warnedFiles.length > 0) {
      const fileListString = formatFileList(warnedFiles);
      console.warn(`🚨 주의 : width 값이 ${MAX_SIZE}px을 초과하는 이미지가 있습니다. (${fileListString})`);
    }
  } catch (error) {
    console.error(`🚨 Error optimizing images:`, error);
  }
}

if ((process.argv[2] === 'build:sharp' || process.argv[2] === 'build:webp') && process.argv.length >= 4) {
  const folderName = process.argv[3];
  let plugin;

  if (process.argv[2] === 'build:sharp') {
    plugin = 'sharp';
  } else if (process.argv[2] === 'build:webp') {
    plugin = 'webp';
  }

  optimizeFolder(folderName, plugin);
} else {
  console.error('🚧 Error: 폴더명이 누락되었습니다.');
}
