function makeBookmarksArray() {
    return [
      {
        id: 1,
        title: 'First bookmark post!',
        url: 'Mario_Page.org',
        description: 'This is a red bookmark that resembles mario',
        rating: '10'
      },
      {
        id: 2,
        title: 'Second bookmark post!',
        url: 'Peach_Page.org',
        description: 'This is a pink bookmark that resembles peach',
        rating: '7'
      },
      {
        id: 3,
        title: 'Third bookmark post!',
        url: 'Toad_Page.org',
        description: 'This is a blue bookmark that resembles toad',
        rating: '4'
      },
      {
        id: 4,
        title: 'Fourth bookmark post!',
        url: 'Koopa_Page.org',
        description: 'This is a orange bookmark that resembles koopa king',
        rating: '8'
      },
    ];
  }
  function makeMeanieBookmark() {
    const meanieBookmark = {
      id: 911,
      rating: 'Negative 10 for trying to hack :c',
      url: 'Stop_Being_A_Meanie.org',
      title: 'Naughty naughty very naughty <script>alert("xss");</script>',
      description: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`
    }
    const expectedBookmark = {
      ...meanieBookmark,
      title: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
      description: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`
    }
    return {
      meanieBookmark,
      expectedBookmark,
    }
  }
  
  module.exports = {
    makeBookmarksArray,
    makeMeanieBookmark,
  }