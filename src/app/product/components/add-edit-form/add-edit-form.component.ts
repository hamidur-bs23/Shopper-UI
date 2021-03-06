import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { first, forkJoin, map, Subscription } from 'rxjs';

import { CategoryService } from 'src/app/category/services/category.service';
import { ProductService } from '../../services/product.service';

import { Product } from 'src/app/models/product.model';

@Component({
  selector: 'app-add-edit-form',
  templateUrl: './add-edit-form.component.html',
  styleUrls: ['./add-edit-form.component.scss']
})
export class AddEditFormComponent implements OnInit, OnDestroy {

  form: FormGroup;

  id: number;
  categories: any[] = [];
  isEditMode: boolean;
  isLoading: boolean = false;
  isSubmitted: boolean = false;

  idSubscription: Subscription;
  categorySubscription: Subscription;
  productSubscription: Subscription;
  

  @Output('addEvent') addEvent = new EventEmitter<any>();
  @Output('editEvent') editEvent = new EventEmitter<any>();

  get f() { return this.form.controls; }

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private productService: ProductService,
    private categoryService: CategoryService) {

    

  }

  ngOnInit(): void {

    this.createForm();

    this.idSubscription = this.route.paramMap
    .subscribe({
      next: (params: any) => {

        this.id = params.get('id');

        if (this.id) {
          this.isEditMode = true;
        } else {
          this.isEditMode = false;
        }

        console.log(this.isEditMode, this.id);

      },
      error: (err) => {
        console.log(err);
      }
    });

    this.categorySubscription = this.categoryService.getAllCategories()
    .subscribe({
      next: (response: any)=>{
        this.categories = response.Data;
        //console.log(this.categories);
      },
      error: (err)=>{
        console.log(err);
      }
    })


    
    

    if (this.isEditMode) {
      this.productService.getProductById(this.id)
        .pipe(first())
        .subscribe({
          next: (data: any) => {
            this.form.patchValue({
              name: data.Name,
              price: data.Price,
              quantity: data.StockInHand,
              description: data.Description,
              categoryId: data.CategoryId,
              id: this.id
            });
          },
          error: (err) => {
            console.log(err);
          }
        });

    }
  }

  ngOnDestroy(): void {
    if (this.idSubscription)
      this.idSubscription.unsubscribe();
  }

  createForm() {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      price: ['', [Validators.required]],
      quantity: ['', [Validators.required]],
      description: ['', [Validators.required]],
      categoryId: ['', [Validators.required]],
      id: ['']
    });
  }

  onSubmit() {

    if (this.form.valid) {
      console.log("Submitted", this.form.value);

      if (this.isEditMode) {
        this.edit();
      } else {
        this.add();
      }

    }
    return;
  }

  private add() {
    console.log("ADD - ", this.form.value);

    this.addEvent.emit(this.form.value);
  }

  private edit() {
    console.log("EDIT - ", this.form.value);

    this.editEvent.emit(this.form.value);
  }
}
