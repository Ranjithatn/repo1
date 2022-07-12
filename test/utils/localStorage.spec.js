import { set, get } from '../../app/utils/localStorage';

describe( 'Testing localStorage file', () => {

  beforeEach(function() {
    // for testing localstorage
    let localStoragedata = {};
    global.localStorage = {
      data: localStoragedata,
      setItem: (key, val) => {
        return localStoragedata[key] = val;
      },
      getItem: (key) => {
        return localStoragedata[key];
      }
    };
  });


  it( 'calling set sets the data in localStorage', () => {
  	set('username', 'john.doe');
  	expect(localStorage.data.username).toBe('john.doe');
  });

  it( 'calling get fetches the data from localStorage', () => {
    const username = get('username');
    expect(localStorage.data.username).toBe(username);
  });

});
