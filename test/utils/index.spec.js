import { isNumber } from '../../app/utils/index';

describe( 'Testing Utils file', () => {

  it( 'if providing number returns true', () => {
  	const num = isNumber(100);
  	expect(num).toBe(true);
  });

  it( 'if providing float returns true', () => {
  	const num = isNumber(123.456);
  	expect(num).toBe(true);
  });

  it( 'if providing string returns false', () => {
  	const num = isNumber('I am not a number');
  	expect(num).toBe(false);
  });

});
