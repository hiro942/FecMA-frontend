// 获取提交信息
// eslint-disable-next-line @typescript-eslint/no-var-requires
const msg = require('fs').readFileSync('.git/COMMIT_EDITMSG', 'utf-8').trim()

// 符合type(scope): message的格式，如 feat(component): add Button.vue
const commitReg = /^(revert: )?(feat|fix|docs|dx|style|refactor|perf|test|workflow|build|ci|chore|types|wip|release)(\(.+\))?: .{1,50}/

const mergeReg = /^(Merge pull request|Merge branch)/

if (!commitReg.test(msg)) {
  if (!mergeReg.test(msg)) {
    console.log('git commit信息校验不通过')
    console.error(
      'git commit的信息格式不对, 具体校验逻辑看 scripts/verifyCommit.js ',
    )
    process.exit(1)
  }
} else {
  console.log('git commit信息校验通过')
}
