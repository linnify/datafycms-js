import { Filter, Operator, PaginatedRecords } from './types';
import { DatafyRequest } from './datafycms';

export const collections = <T>(collection: string): Collection<T> => {
  return Collection.createInstance<T>(collection);
};

export class Collection<T> extends DatafyRequest {
  private _fields: string[] = [];
  private _filters: Map<string, Filter> = new Map([]);
  private _search: string;
  private _page = 1;
  private _pageSize = 20;

  private constructor(private collection: string) {
    super();
  }

  static createInstance<T>(collection: string): Collection<T> {
    return new Collection<T>(collection);
  }

  private baseUrl() {
    return `collections/${this.collection}/records`;
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

  record(recordId: string): CollectionRecord<T> {
    const record = new CollectionRecord<T>(this.collection, recordId);
    record.fields(this._fields);

    return record;
  }

  /**
   * Return the Full URL based on filter, fields, page and page size
   */
  url(): string {
    let url = `${this.baseUrl()}?page=${this._page}&pageSize=${this._pageSize}`;

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
    return this.request<PaginatedRecords<T>>(this.url(), 'GET');
  }

  async create(data: T): Promise<T> {
    return this.request<T>(this.url(), 'POST', data);
  }
}

export class CollectionRecord<T> extends DatafyRequest {
  private _fields: string[] = [];

  constructor(private collection: string, private record: string) {
    super();
  }

  private baseUrl() {
    return `collections/${this.collection}/records/${this.record}`;
  }

  getFields(): string[] {
    return this._fields;
  }

  fields(fields: string[]): CollectionRecord<T> {
    this._fields = fields;
    return this;
  }

  url(): string {
    let url = this.baseUrl();

    if (this._fields.length > 0) {
      const fields = this._fields.join(',');
      url += `&datafy_fields=${fields}`;
    }

    return url;
  }

  get(): Promise<T> {
    return this.request<T>(this.url(), 'GET');
  }

  async delete(): Promise<void> {
    return this.request<void>(this.baseUrl(), 'DELETE');
  }

  publish(): Promise<T> {
    const url = `${this.baseUrl()}/publish`;
    return this.request<T>(url, 'POST', {});
  }

  draft(): Promise<T> {
    const url = `${this.baseUrl()}/draft`;
    return this.request<T>(url, 'POST', {});
  }
}
