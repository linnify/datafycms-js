# DatafyCMS JavaScript Client

[![npm version](https://img.shields.io/npm/v/@datafycms/js-client)](https://www.npmjs.com/package/@datafycms/js-client)
[![codecov](https://codecov.io/gh/linnify/datafycms-js/branch/main/graph/badge.svg)](https://codecov.io/gh/linnify/datafycms-js)
[![Build Status](https://travis-ci.com/linnify/datafycms-js.svg?branch=main)](https://travis-ci.com/linnify/datafycms-js)

JavaScript API Client for interacting with DatafyCMS API.

## Installation

#### NPM
```angular2html
npm install @datafycms/js-client
```

#### YARN
```angular2html
yarn add @datafycms/js-client
```

## Documentation

The library is written fully in TypeScript. The SDK offers to functionalities that will 
let you work with Collections API from DatafyCMS.

1. Set up your Authentication Token
2. Start interacting with Collections API


### Set up the Authentication Token

There are 2 ways to set up your authentication token

#### 1. Automatically
By default, datafyCMS will look over the `DATAFYCMS_API_TOKEN` environment variable,
so you only need to setup your environment variable

```javascript
DATAFYCMS_API_TOKEN=<YOUR_API_TOKEN_HERE>
```

#### 2.Set the API Token manually
To set up manually the authentication token, you need to call the ``setup`` function, before
interacting with the main API!!.

```javascript
import datafyCMS from '@datafycms/js-client';

datafyCMS.setup('YOUR API TOKEN HERE')
```

### Work with Collections API

Collection class has the following method that can be used to build the actual request
 - `fields([field1, field2])` - list of fields
 - `filterBy(fieldId, operator: Operator, value: string | number | boolean)` -> apply filtering
 - `search(searchValue: string)` -> apply search

To create `Collection` instance that can work with the remote API you need to call

```typescript
const yourCollection = datafyCMS.collections<T>('your collection name')
```

`T` represents the shape of your collection.

To retrieve records from a collection you need to call the `.list()` method

```typescript
const response = await datafyCMS.collections<T>('your collection name')
  .list()

// The response will look like this
export interface Response<T> {
  results: T[];
  previous: string;
  next: string;
  count: number;
}
```

To filter the records you need to call the `filterBy` method. The `filterBy` will accept the `fieldId` an `Operator` and the value

Those are all the operators that you can work with
```typescript
export enum Operator {
  EQ = 'eq',
  GT = 'gt',
  GTE = 'gte',
  LT = 'lt',
  LTE = 'lte',
  ISNULL = 'isnull',
  IN = 'in',
}
```

### Work with Record

To work with a specific record and perform:
 - get
 - update
 - delete
 - publish
 - unpublish (draft mode)

You need to create a `CollectionRecord` instance. The `CollectionRecord` can be created from `Collection` instance by calling the `record` method

```typescript
const recordIntance = datafyCMS.collections<T>('articls')
  .fields(['title', 'price'])
  .record('<RECORD_ID OR ANY SLUG_FIELD_VALUE>')
```

When you create a `CollectionRecord` from `Collection` instance all the `fields` that were set on `collection` are automatically transferred on `CollectionRecord` instance. 
You can choose to override those by calling `fields([])` on `CollectionRecord` instance

The `CollectionRecord` instance have the following methods.

```typescript
export class CollectionRecord<T> {
  fields(fields: string[]): CollectionRecord  // Set what fields you want to get for this record

  get(): Promise<T>                           // Getting the record from DatafyCMS API

  update(value: T): Promise<T>                // Update the record with the value parameter

  delete(): Promise<void>                     // Delete the record

  publish(): Promise<T>                       // Publish the record

  draft(): Promise<T>                         // UnPublish the record

}
```


## Usage
This section provides example on how to use this library

Example of selecting only some fields, applying 2 filters and searching by a value
In this example we have the Post resource, and we query the DatafyCMS API to retrieve only
the fields `title` and `created_at` by filtering the `created_at` to be greater than `2020-10-20`
and `views` to be less than equal `120. We also search with a value.

To make the actual call we need to call `list` method

```typescript
import datafyCMS from '@datafycms/js-client';
import { Operator } from "@datafycms/js-client/types";

class Post {
  title: string;
  created_at: string;
  views: number;
  content: string
}

const response = await datafyCMS.collections<Post>('posts')
  .fields(['title', 'created_at'])
  .page(2)  // specify the page number, by default is 1
  .pageSize(8) // specify the page size, by default is 20
  .filterBy('created_at', Operator.GT, '2020-10-20')
  .filterBy('views', Operator.LTE, 120)
  .search('search in the content post')
  .list()
```


To get only one post

```typescript
const article = await datafyCMS.collections<Post>('posts')
  .fields(['title', 'created_at', 'content', 'slug', 'meta_title'])
  .record('this-is-my-slug-value or some record ID')
  .get()
```
