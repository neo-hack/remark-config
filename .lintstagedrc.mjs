export default {
  "**/**/*.{js,ts,tsx,vue,json,md}": ["eslint --fix"],
  // Lint Markdown files with remark
  '**/**/!(*CHANGELOG).md': filenames => [
    `remark ${filenames.join(' ')} -o`,
  ],
}