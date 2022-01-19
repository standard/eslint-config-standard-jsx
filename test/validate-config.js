const { ESLint } = require('eslint')
const test = require('tape')

test('load config in eslint to validate all rule syntax is correct', function (t) {
  const cli = new ESLint({
    useEslintrc: false,
    overrideConfigFile: 'eslintrc.json'
  })

  const code = 'var foo = 1\nvar bar = function () {}\nbar(foo)\n'

  t.equal(cli.lintText(code).errorCount, 0)
  t.end()
})

test('space before an opening tag\'s closing bracket should not be allowed', t => {
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

  t.plan(testPlansCount)

  for (const testCase in shouldPass) {
    const { errorCount } = cli.lintText(shouldPass[testCase])
    t.equal(errorCount, 0)
  }

  for (const testCase in shouldFail) {
    const { errorCount } = cli.lintText(shouldFail[testCase])
    t.true(errorCount > 0)
  }
})
