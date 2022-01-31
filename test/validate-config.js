const { ESLint } = require('eslint')
const test = require('tape')

test('load config in eslint to validate all rule syntax is correct', async t => {
  const cli = new ESLint({
    useEslintrc: false,
    overrideConfigFile: 'eslintrc.json'
  })

  const code = 'var foo = 1\nvar bar = function () {}\nbar(foo)\n'

  const result = await cli.lintText(code)

  t.equal(result.length, 1, 'Should return a single result item')
  t.equal(result[0].errorCount, 0, 'The result item should show no errors')
  t.end()
})

test('space before an opening tag\'s closing bracket should not be allowed', async t => {
  const cli = new ESLint({
    useEslintrc: false,
    overrideConfigFile: 'eslintrc.json'
  })

  const shouldPass = {
    selfClosing: '<div />',
    withChildren: `
      <div>
        test
      </div>
    `,
    withChildrenWithPropsMultiLine: `
      <div
        a
        b
      >
        test
      </div>
    `
  }

  const shouldFail = {
    selfClosing: '<div/ >',
    openingTag: `
      <div >
        test
      </div>
    `,
    closingTag: `
      <div>
        test
      </div >
    `
  }

  const testPlansCount = Object.keys(shouldPass).length + Object.keys(shouldFail).length

  t.plan(testPlansCount * 2)

  for (const testCase in shouldPass) {
    const result = await cli.lintText(shouldPass[testCase])
    t.equal(result.length, 1, 'Should return a single result item')
    t.equal(result[0].errorCount, 0, 'The result item should show no errors')
    }

  for (const testCase in shouldFail) {
    const result = await cli.lintText(shouldFail[testCase])
    t.equal(result.length, 1, 'Should return a single result item')
    t.true(result[0].errorCount > 0, 'The result item should have errors')
    }
})
