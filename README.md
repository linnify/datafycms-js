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

#### Example
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

## Usage
This section provides example on how to use this library

<b>TBA</b>
