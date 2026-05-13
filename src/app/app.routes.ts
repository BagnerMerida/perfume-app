import { Routes } from '@angular/router';
import { CatalogComponent } from './pages/catalog/catalog.component';
import { ProductDetailComponent } from './pages/product-detail/product-detail.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { CartComponent } from './pages/cart/cart.component';
import { HomeComponent } from './pages/home/home.component';
import { AdminProductImagesComponent } from './pages/admin-product-images/admin-product-images.component';
import { AdminProductFormComponent } from './pages/admin-product-form/admin-product-form.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'catalog', component: CatalogComponent },
    { path: 'checkout', component: CheckoutComponent }, 
    { path: 'cart', component: CartComponent },
    { path: 'product/:slug', component: ProductDetailComponent },

    { path: 'admin/product-images', component: AdminProductImagesComponent },
    { path: 'admin/products/new', component: AdminProductFormComponent }
];
