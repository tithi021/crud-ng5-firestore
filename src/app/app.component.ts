import { Component } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Category } from './category.model';
import { CategoryService } from './category.service';
import * as _ from "lodash";
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  model = new Category;
  categories: any;
  submitted = false;

  offset = 2;
  nextKey: any; // for next button
  prevKeys: any[] = []; // for prev button
  subscription: any;


  constructor(private afs: AngularFirestore, public page: CategoryService) {
  }

  ngOnInit() {
    this.getCategories();
  }

  getCategories(key?) {
    this.page.getCategories(this.offset, key);
    console.log(this.page.data);

    // this.page.getCategories(this.offset, key).subscribe(
    //   (category: Category[]) => {
    //     this.categories = category;
    //     console.log(this.categories);
    //   }
    // );
  }

  onSubmit() {
    this.submitted = true;
    this.page.addCategory({ name: this.model.name });
  }

  delete(user) {
    this.page.deleteCategory(user);
  }

  edit(data, index) {
    this.model = data;
  }

  update(index) {
    console.log(this.model)
  }

  nextPage() {
    console.log('nextPage')
    this.page.more()

    // this.prevKeys.push(_.first(this.categories)['$key']) // set current key as pointer for previous page
    // this.getCategories(this.nextKey)
  }

  prevPage() {
    const prevKey = _.last(this.prevKeys) // use last key in array
    this.prevKeys = _.dropRight(this.prevKeys) // then remove the last key in the array

    this.getCategories(prevKey)
  }

}
