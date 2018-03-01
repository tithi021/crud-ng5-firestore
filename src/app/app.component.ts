import { Component } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Category } from './category.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  model = new Category;
  categories: Category[];
  submitted = false;

  constructor(private afs: AngularFirestore) {
    this.categories = [
      {
        id: 1,
        name: "Angular5"
      }
    ]
  }

  onSubmit() {
    this.submitted = true;
    this.model.id = this.categories.length + 1;
    this.categories.push({ id: this.model.id, name: this.model.name });
  }

  delete(index) {
    this.categories.splice(1, index);
  }

  edit(data, index) {
    this.model = data;
  }

  update(index) {
    console.log(this.model)
  }
}
