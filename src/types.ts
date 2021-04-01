export class Filter {
  constructor(private fieldId: string, private operator: Operator, private value: number | string | boolean) {}

  getFieldId(): string {
    return this.fieldId;
  }

  getOperator(): Operator {
    return this.operator;
  }

  getValue(): number | string | boolean {
    return this.value;
  }

  /**
   * Return the query parameter for the API request
   */
  getParam(): string {
    return `${this.fieldId}__${this.operator}=${this.value}`;
  }
}

export type PaginatedRecords<T> = {
  results: T[];
  previous: string;
  next: string;
  count: number;
};

export enum Operator {
  EQ = 'eq',
  GT = 'gt',
  GTE = 'gte',
  LT = 'lt',
  LTE = 'lte',
  ISNULL = 'isnull',
  IN = 'in',
}

export class ApiError {
  status: number;
  message: string;
  data?: { [id: string]: unknown };
}
