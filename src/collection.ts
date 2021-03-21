import axios, { AxiosError } from 'axios';
import { Filter, Operator, PaginatedRecords } from './types';

export class Collection<T> {
  private _fields: string[] = [];
  private _filters: Map<string, Filter> = new Map([]);
  private _search: string;
  private _page = 1;
  private _pageSize = 20;
  // private _hasNext: boolean;

  private constructor(private collection: string) {}

  static createInstance<T>(collection: string): Collection<T> {
    return new Collection<T>(collection);
  }

  fields(fields: string[]): Collection<T> {
    this._fields = fields;
    return this;
  }

  filterBy(fieldId: string, operator: Operator, value: boolean | number | string): Collection<T> {
    this._filters.set(fieldId, new Filter(fieldId, operator, value));
    return this;
  }

  search(search: string): Collection<T> {
    this._search = search;
    return this;
  }

  page(page: number): Collection<T> {
    if (page < 1) {
      throw 'Cannot set a page les then 1';
    }

    this._page = page;
    return this;
  }

  pageSize(pageSize: number): Collection<T> {
    if (pageSize > 100) {
      throw 'Page Size cannot be bigger then 100';
    }

    this._pageSize = pageSize;
    return this;
  }

  /*  loadPrevious(): Promise<PaginatedRecords<T>> {
      if (this._page <= 1) {
        throw new Error('Cannot load page 0')
      }

      this._page -= 1;
      return this.list()
    }

    loadNext(): Promise<PaginatedRecords<T>> {
      this._page += 1;
      return this.list();
    }*/

  /**
   * Return the Full URL based on filter, fields, page and page size
   */
  url(): string {
    let url = `/collections/${this.collection}?page=${this._page}&pageSize=${this._pageSize}`;

    if (this._fields.length > 0) {
      const fields = this._fields.join(',');
      url += `&datafy_fields=${fields}`;
    }

    if (this._filters.size > 0) {
      const filters = Array.from(this._filters.values())
        .map((value) => value.getParam())
        .join('&');
      url += `&${filters}`;
    }

    if (this._search) {
      url += `&search=${this._search}`;
    }

    return url;
  }

  /**
   * Load resources based on current configuration
   */
  async list(): Promise<PaginatedRecords<T>> {
    return axios(this.url(), {
      method: 'GET',
      headers: {
        'X-API-TOKEN': '',
      },
    }).then((response) => response.data);
  }
}
