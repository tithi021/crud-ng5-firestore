import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { Category } from './category.model';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/scan';
import 'rxjs/add/operator/take';

@Injectable()
export class CategoryService {

  // Source data
  private _done = new BehaviorSubject(false);
  private _loading = new BehaviorSubject(false);
  private _data = new BehaviorSubject([]);

  // Observable data
  data: Observable<any>;
  done: Observable<boolean> = this._done.asObservable();
  loading: Observable<boolean> = this._loading.asObservable();

  categories: Observable<Category[]>;
  categoryCollection: AngularFirestoreCollection<Category>;
  categoryDoc: AngularFirestoreDocument<Category>;

  query: {
    prepend: false
  }
  constructor(public _afs: AngularFirestore) {
    // this.query.prepend = false;
  }




  // Maps the snapshot to usable format the updates source
  private mapAndUpdate(col: AngularFirestoreCollection<any>) {
    this.query = {
      prepend: false
    }

    if (this._done.value || this._loading.value) { return };

    // loading
    this._loading.next(true)

    // Map snapshot with doc ref (needed for cursor)
    return col.snapshotChanges()
      .do(arr => {
        let values = arr.map(snap => {
          const data = snap.payload.doc.data()
          const doc = snap.payload.doc
          return { ...data, doc }
        })

        // If prepending, reverse the batch order
        values = this.query.prepend ? values.reverse() : values;

        console.log(values)
        // update source with new values, done loading
        this._data.next(values)
        this._loading.next(false)

        // no more values, mark done
        if (!values.length) {
          this._done.next(true)
        }
      })
      .take(1)
      .subscribe()

  }

  getCategories(offset, startKey?) {
    // this.categoryCollection = this._afs.collection('categories', x => x.orderBy('name', 'asc').limit(offset));
    // return this.categories = this.categoryCollection.snapshotChanges().map(
    //   changes => {
    //     return changes.map(
    //       a => {
    //         const data = a.payload.doc.data() as Category;
    //         data.id = a.payload.doc.id;
    //         return data;
    //       });

    //   });

    const first = this._afs.collection('categories', ref => {
      return ref
        .orderBy('name', 'asc')
        .limit(offset)
    })

    console.log(first)
    this.mapAndUpdate(first)

    // Create the observable array for consumption in components
    this.data = this._data.asObservable()
      .scan((acc, val) => {
        return this.query.prepend ? val.concat(acc) : acc.concat(val)
      })
  }

  // Retrieves additional data from firestore
  more() {
    const cursor = this.getCursor()

    const more = this._afs.collection('categories', ref => {
      return ref
        .orderBy('name', 'asc')
        .limit(2)
        .startAfter(cursor)
    })
    this.mapAndUpdate(more)
  }


  // Determines the doc snapshot to paginate query 
  private getCursor() {
    const current = this._data.value
    if (current.length) {
      return this.query.prepend ? current[0].doc : current[current.length - 1].doc
    }
    return null
  }

  addCategory(category) {
    this.categoryCollection.add(category);
  }

  deleteCategory(category) {
    this.categoryDoc = this._afs.doc(`categories/${category.id}`);
    this.categoryDoc.delete();
  }

}
