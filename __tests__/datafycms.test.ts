import { DatafyCMS } from '../src/datafycms';

describe('Test DatafyCMS', () => {
  const token = '123';

  beforeEach(() => {
    DatafyCMS.setupAPI(token);
  });

  it('Should set the API Token', () => {
    expect(DatafyCMS.getToken()).toEqual(token);
  });

  it('Should get token raise error if no token is set', () => {
    DatafyCMS.setupAPI('');
    expect(() => DatafyCMS.getToken()).toThrow('API Token is not set');
  });

  it('Should Auth Header return the right header', () => {
    const header = {
      'X-API-TOKEN': token,
    };

    expect(DatafyCMS.authHeader()).toEqual(header);
  });
});
