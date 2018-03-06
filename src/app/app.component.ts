import { Component } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Category } from './category.model';
import { CategoryService } from './category.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  model = new Category;
  categories: Category[] = [];
  submitted = false;


  constructor(private afs: AngularFirestore, public categoryService: CategoryService) {
  }

  ngOnInit() {

    this.categoryService.getCategories().subscribe(
      (category: Category[]) => {
        this.categories = category;
        console.log(this.categories);
      }
    );
  }

  onSubmit() {
    this.submitted = true;
    this.categoryService.addCategory({ name: this.model.name });
  }

  delete(user) {
    this.categoryService.deleteCategory(user);
  }

  edit(data, index) {
    this.model = data;
  }

  update(index) {
    console.log(this.model)
  }
}
