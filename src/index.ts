import { Collection } from './collection';
import { DatafyCMS } from './datafycms';

function collections<T>(collection: string): Collection<T> {
  return Collection.createInstance<T>(collection);
}

export default {
  setup: DatafyCMS.setupAPI,
  collections,
};
