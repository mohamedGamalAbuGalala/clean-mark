#!/usr/bin/env node

'use strict'

const fs = require('fs')
const path = require('path')
const c = require('../lib/clean')
const s = require('../lib/stats')
const {
  urlPath
} = require('../lib/util')
// const argv;

function getExtension(type) {
  if (type === 'text') {
    return '.txt'
  } else if (type === 'html') {
    return '.html'
  } else {
    return '.md'
  }
}

function getMarker(type) {
  if (type === 'text') {
    return ['', '']
  } else if (type === 'html') {
    return ['<!--', '-->']
  } else {
    return ['---', '---']
  }
}

module.exports = async (argv) => {
  let dict
  const useDb = !argv.nodb
  const type = (argv.t || argv.type || '').toLowerCase()

  //* provide your output file here
  const output = argv.o || argv.output
  // || 'test'
  const ext = getExtension(type)
  const mark = getMarker(type)

  console.log('=>  Processing URL ...')

  //* provide all your links here
  // argv._ = ["https://medium.com/s/story/7-things-you-need-to-stop-doing-to-be-more-productive-backed-by-science-a988c17383a6"]

  // Cycle all provided URLs
  for (const link of argv._) {
    try {
      dict = await c(link, {
        useDatabase: useDb,
        fileType: type
      })
      const stat = `paragraph=${s.paragraphCount(dict.text)} sentences=${s.sentenceCount(dict.text)}, words=${s.wordCount(dict.text)}`
      const text = `${mark[0]}\nlink: ${dict.url}\ntitle: ${dict.title}\ndescription: ${dict.description}\nkeywords: ${dict.keywords}\nauthor: ${dict.author}\ndate: ${dict.date}\npublisher: ${dict.publisher}\nstats: ${stat}\n${mark[1]}\n${dict.text}`
      const path = (output || urlPath(link)) + ext
      console.log('>', path)
      fs.writeFileSync(path, text)
    } catch (err) {
      console.error(err)
    }
  }

  console.log('=>  URL converted!')
};
// = require('minimist')(process.argv.slice(2))

// if (argv.help) {
//   const help = fs.readFileSync(path.join(__dirname, 'usage.txt'), 'utf8')
//   console.log(help.trim())
//   process.exit()
// }

// if (!argv._.length) {
//   console.warn('=>  Please provide a URL to convert.')
//   process.exit()
// }