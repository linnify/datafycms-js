import { Collection } from '../src/collection';
import { Filter, Operator } from '../src/types';

describe('Test Collection', () => {
  let collection: Collection<never>;

  beforeEach(() => {
    collection = Collection.createInstance('test');
  });

  it('Should set fields with specific url', () => {
    expect(collection).toBeInstanceOf(Collection);
  });

  it('Should set filter', () => {
    const fieldId = 'fieldId';
    const operator = Operator.EQ;
    const value = '10';
    const filter = new Filter(fieldId, operator, value);

    const url = collection.filterBy(fieldId, operator, value).url();

    expect(url).toContain(`&${filter.getParam()}`);
  });

  it('Should set multiple filters filter', () => {
    const firstFilter = new Filter('field1', Operator.EQ, '10');
    const secondFilter = new Filter('field2', Operator.LTE, '10');

    const url = collection
      .filterBy(firstFilter.getFieldId(), firstFilter.getOperator(), firstFilter.getValue())
      .filterBy(secondFilter.getFieldId(), secondFilter.getOperator(), secondFilter.getValue())
      .url();

    expect(url).toContain(`&${firstFilter.getParam()}`);
    expect(url).toContain(`&${secondFilter.getParam()}`);
  });

  it('Should set search', () => {
    const search = 'searchValue';
    const url = collection.search(search).url();

    expect(url).toContain(`&search=${search}`);
  });

  it('Should set page size', () => {
    const pageSize = 50;
    const url = collection.pageSize(pageSize).url();

    expect(url).toContain(`&pageSize=${pageSize}`);
  });

  it('Should throw error when page size is grater than 100', () => {
    const pageSize = 101;

    expect(() => {
      collection.pageSize(pageSize);
    }).toThrow('Page Size cannot be bigger then 100');
  });

  it('Should set page', () => {
    const page = 2;
    const url = collection.page(2).url();

    expect(url).toContain(`page=${page}`);
  });

  it('Should throw error when page is less then 1', () => {
    const page = 0;
    expect(() => {
      collection.page(page);
    }).toThrow('Cannot set a page les then 1');
  });
});
