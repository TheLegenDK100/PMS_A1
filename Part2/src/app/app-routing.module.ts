import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HelpComponent } from './components/help/help.component';
import { HomeComponent } from './components/home/home.component';
import { ManageItemsComponent } from './components/manage-items/manage-items.component';
import { PrivacySecurityComponent } from './components/privacy-security/privacy-security.component';
import { SearchItemsComponent } from './components/search-items/search-items.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'manage', component: ManageItemsComponent },
  { path: 'search', component: SearchItemsComponent },
  { path: 'privacy-security', component: PrivacySecurityComponent },
  { path: 'help', component: HelpComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
