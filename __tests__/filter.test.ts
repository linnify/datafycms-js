import { Filter, Operator } from '../src/types';

describe('Test Filter', () => {
  it('Should create with params', () => {
    const filter = new Filter('fieldId', Operator.EQ, '10');
    expect(filter).toBeDefined();
  });

  it('Should get param with equal', () => {
    const filter = new Filter('fieldId', Operator.EQ, '10');
    const params = filter.getParam();

    expect(params).toEqual(`fieldId__eq=10`);
  });

  it('Should get param with less then equal', () => {
    const filter = new Filter('fieldId', Operator.LTE, '10');
    const params = filter.getParam();

    expect(params).toEqual(`fieldId__lte=10`);
  });

  it('Should get param with greater', () => {
    const filter = new Filter('fieldId', Operator.GT, '10');
    const params = filter.getParam();

    expect(params).toContain(`fieldId__gt=10`);
  });
});
