import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HelpComponent } from './components/help/help.component';
import { HomeComponent } from './components/home/home.component';
import { ManageItemsComponent } from './components/manage-items/manage-items.component';
import { PrivacySecurityComponent } from './components/privacy-security/privacy-security.component';
import { SearchItemsComponent } from './components/search-items/search-items.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ManageItemsComponent,
    SearchItemsComponent,
    PrivacySecurityComponent,
    HelpComponent
  ],
  imports: [BrowserModule, FormsModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
