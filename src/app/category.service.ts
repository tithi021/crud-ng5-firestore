import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { Category } from './category.model';

@Injectable()
export class CategoryService {

  categories: Observable<Category[]>;
  categoryCollection: AngularFirestoreCollection<Category>;
  categoryDoc: AngularFirestoreDocument<Category>;

  constructor(public _afs: AngularFirestore) {

  }

  getCategories(offset, startKey?) {
    // https://firebase.google.com/docs/firestore/query-data/query-cursors
    this.categoryCollection = this._afs.collection('categories', x => x.orderBy('name', 'asc').limit(offset));
    return this.categories = this.categoryCollection.snapshotChanges().map(
      changes => {
        return changes.map(
          a => {
            const data = a.payload.doc.data() as Category;
            data.id = a.payload.doc.id;
            return data;
          });

      });
  }

  addCategory(category) {
    this.categoryCollection.add(category);
  }

  deleteCategory(category) {
    this.categoryDoc = this._afs.doc(`categories/${category.id}`);
    this.categoryDoc.delete();
  }

}
