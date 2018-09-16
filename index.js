const main = async argv => await require('./bin/clean-mark')(argv);
module.exports = main;

main({
  _: [
    'https://medium.com/s/story/7-things-you-need-to-stop-doing-to-be-more-productive-backed-by-science-a988c17383a6'
  ],
  o: 'blabla'
});
