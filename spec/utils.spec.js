const { expect } = require('chai');
const {
  formatDates,
  makeRefObj,
  formatComments,
} = require('../db/utils/utils');

describe('formatDates', () => {
  it('returns empty array if given empty array', () => {
    expect(formatDates([])).to.eql([])
  });
  it('returns a timestamp converted into a JS date object when givne single input', () => {
    const list = [{
      body:
        "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
      belongs_to: "They're not exactly dogs, are they?",
      created_by: 'butter_bridge',
      votes: 16,
      created_at: 1511354163389,
    }];
    const actual = formatDates(list);
    const expected = [{
      body:
        "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
      belongs_to: "They're not exactly dogs, are they?",
      created_by: 'butter_bridge',
      votes: 16,
      created_at: new Date(1511354163389),
    }];
    expect(actual).to.eql(expected)
  });
  it('returns multiple objects with each timestamp converted into JS date object AND does not mutate the input', () => {
    const list = [{
      body:
        "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
      belongs_to: "They're not exactly dogs, are they?",
      created_by: 'butter_bridge',
      votes: 16,
      created_at: 1511354163389,
    },
    {
      body:
        'The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.',
      belongs_to: 'Living in the shadow of a great man',
      created_by: 'butter_bridge',
      votes: 14,
      created_at: 1479818163389,
    },
    {
      body:
        'Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — onyou it works.',
      belongs_to: 'Living in the shadow of a great man',
      created_by: 'icellusedkars',
      votes: 100,
      created_at: 1448282163389,
    }];
    const actual = formatDates(list)
    const expected = [{
      body:
        "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
      belongs_to: "They're not exactly dogs, are they?",
      created_by: 'butter_bridge',
      votes: 16,
      created_at: new Date(1511354163389),
    },
    {
      body:
        'The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.',
      belongs_to: 'Living in the shadow of a great man',
      created_by: 'butter_bridge',
      votes: 14,
      created_at: new Date(1479818163389),
    },
    {
      body:
        'Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — onyou it works.',
      belongs_to: 'Living in the shadow of a great man',
      created_by: 'icellusedkars',
      votes: 100,
      created_at: new Date(1448282163389),
    }];
    expect(actual).to.eql(expected)
    expect(actual).to.not.eql(list)
  });
});

describe('makeRefObj', () => {
  it('returns an empty object when given empty array ', () => {
    expect(makeRefObj([])).to.eql({})
  });
  it('returns a new reference object when given a single input', () => {
    const list = [{
      article_id: 1,
      title: 'Living in the shadow of a great man',
      topic: 'mitch',
      author: 'butter_bridge',
      body: 'I find this existence challenging',
      created_at: 1542284514171,
      votes: 100,
    }];
    const actual = makeRefObj(list);
    expected = { 'Living in the shadow of a great man': 1 };
    expect(actual).to.eql(expected)
  });
  it('return a reference object of new key value pairs when given mutiple objects in array', () => {
    const list = [{
      article_id: 1,
      title: 'Living in the shadow of a great man',
      topic: 'mitch',
      author: 'butter_bridge',
      body: 'I find this existence challenging',
      created_at: 1542284514171,
      votes: 100,
    },
    {
      article_id: 2,
      title: 'Sony Vaio; or, The Laptop',
      topic: 'mitch',
      author: 'icellusedkars',
      body:
        'Call me Mitchell.',
      created_at: 1416140514171,
    }];
    const actual = makeRefObj(list);
    const expected = { 'Living in the shadow of a great man': 1, 'Sony Vaio; or, The Laptop': 2 }
    expect(actual).to.eql(expected)
  });
});
describe('formatComments', () => {
  it('return a new array when given empty array', () => {
    expect(formatComments([])).to.eql([]);
  });
  it('changes the key created_by to author', () => {
    const comments = [{
      body:
        "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
      belongs_to: "They're not exactly dogs, are they?",
      created_by: 'butter_bridge',
      votes: 16,
      created_at: 1511354163389,
    }];
    const actual = formatComments(comments, {});
    expect(actual[0]).to.contain.keys('author')
  });
  it('changes the key belongs_to to article_id', () => {
    const comments = [{
      body:
        "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
      belongs_to: "They're not exactly dogs, are they?",
      created_by: 'butter_bridge',
      votes: 16,
      created_at: 1511354163389,
    }];
    const actual = formatComments(comments, {});
    expect(actual[0]).to.contain.keys('article_id')
  });
  it('changes the value of article ID to one taken from reference object', () => {
    const comments = [{
      body:
        "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
      belongs_to: "They're not exactly dogs, are they?",
      created_by: 'butter_bridge',
      votes: 16,
      created_at: 1511354163389,
    }];
    const refObj = { "They're not exactly dogs, are they?": 1 }
    const actual = formatComments(comments, refObj);
    expect(actual[0].article_id).to.equal(1)
  });
  it('changes the timestamp to a JS date object', () => {
    const comments = [{
      body:
        "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
      belongs_to: "They're not exactly dogs, are they?",
      created_by: 'butter_bridge',
      votes: 16,
      created_at: 1511354163389,
    }];
    const refObj = { "They're not exactly dogs, are they?": 1 }
    const actual = formatComments(comments, refObj);
    expect(actual[0].created_at).to.eql(new Date(1511354163389))
  });
  it('renames keys when array has multiple objects, and does not mutate original comment data', () => {
    const comments = [{
      body:
        "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
      belongs_to: "They're not exactly dogs, are they?",
      created_by: 'butter_bridge',
      votes: 16,
      created_at: 1511354163389,
    },
    {
      body:
        'The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.',
      belongs_to: 'Living in the shadow of a great man',
      created_by: 'butter_bridge',
      votes: 14,
      created_at: 1479818163389,
    },
    {
      body:
        'Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — onyou it works.',
      belongs_to: 'Living in the shadow of a great man',
      created_by: 'icellusedkars',
      votes: 100,
      created_at: 1448282163389,
    }];
    const refObj = {"They're not exactly dogs, are they?":1, 'Living in the shadow of a great man':2};
    const actual = formatComments(comments, refObj);
    const expected = [
      {
        author: 'butter_bridge',
        article_id: 1,
        created_at: new Date(1511354163389),
        body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        votes: 16
      },
      {
        author: 'butter_bridge',
        article_id: 2,
        created_at: new Date(1479818163389),
        body: 'The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.',
        votes: 14
      },
      {
        author: 'icellusedkars',
        article_id: 2,
        created_at: new Date(1448282163389),
        body: 'Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — onyou it works.',
        votes: 100
      }
    ];
    expect(actual).to.eql(expected);
    expect(actual).to.not.eql(comments)
  });

});
/*
{
  body:
    "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
  belongs_to: "They're not exactly dogs, are they?",
  created_by: 'butter_bridge',
  votes: 16,
  created_at: 1511354163389,
}
*/