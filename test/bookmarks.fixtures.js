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
  
  module.exports = {
    makeBookmarksArray,
  }