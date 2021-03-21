import { Collection } from './collection';

function collections<T>(collection: string): Collection<T> {
  return Collection.createInstance<T>(collection);
}

export default {
  collections,
};
