import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'seller',
        data: { pageTitle: 'marbleApp.seller.home.title' },
        loadChildren: () => import('./seller/seller.module').then(m => m.SellerModule),
      },
      {
        path: 'marble',
        data: { pageTitle: 'marbleApp.marble.home.title' },
        loadChildren: () => import('./marble/marble.module').then(m => m.MarbleModule),
      },
      {
        path: 'blog',
        data: { pageTitle: 'marbleApp.blog.home.title' },
        loadChildren: () => import('./blog/blog.module').then(m => m.BlogModule),
      },
      {
        path: 'comment',
        data: { pageTitle: 'marbleApp.comment.home.title' },
        loadChildren: () => import('./comment/comment.module').then(m => m.CommentModule),
      },
      {
        path: 'favorites',
        data: { pageTitle: 'marbleApp.favorites.home.title' },
        loadChildren: () => import('./favorites/favorites.module').then(m => m.FavoritesModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
