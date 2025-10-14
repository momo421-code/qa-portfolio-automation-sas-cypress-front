import "../../../page-objects/pages/results.page";
import { When } from "@badeball/cypress-cucumber-preprocessor";
import { PaginationComponent } from "../../../page-objects/components/searchPage/pagination.component";
import { LoaderComponent } from "../../../page-objects/components/searchPage/loader.component";

When("il navigue dans les résultats jusqu'à la dernière page", (): void => {
  LoaderComponent.waitForDisappearing();
  PaginationComponent.goToLastPage();
});
When("il navigue dans les résultats jusqu'à la première page", (): void => {
  LoaderComponent.waitForDisappearing();
  PaginationComponent.goToFirstPage();
});

When("il navigue dans les résultats à la page suivante", (): void => {
  LoaderComponent.waitForDisappearing();
  PaginationComponent.goToNextPage();
});

When(
  "il navigue dans les résultats à la page {int}",
  (pageNumber: number): void => {
    PaginationComponent.gotoPageNumber(pageNumber);
  },
);
