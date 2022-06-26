// 获取提交信息
const msg = require('fs').readFileSync('.git/COMMIT_EDITMSG', 'utf-8').trim()

// 符合type(scope): message的格式，如 feat(component): add Button.vue
const commitReg = /^(revert: )?(feat|fix|docs|dx|style|refactor|perf|test|workflow|build|ci|chore|types|wip|release)(\(.+\))?: .{1,50}/

const mergeReg = /^(Merge pull request|Merge branch)/

if (!commitReg.test(msg)) {
  if (!mergeReg.test(msg)) {
    console.error('husky(git): Failed to validate git commit message. Please view [scripts/verifyCommit.js] to confirm the validation process.')
    process.exit(1)
  }
} else {
  console.log('husky(git): Git commit message validation success.')
}
