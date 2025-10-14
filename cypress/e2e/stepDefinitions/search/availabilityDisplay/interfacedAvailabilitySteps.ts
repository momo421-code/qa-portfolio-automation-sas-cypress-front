// TODO: SAS-9112
// Then(/^l'ensemble de ses créneaux éditeurs de son lieu d'exercice (\d+) sont présents en page de résultats via l'utilisateur "([^"]*)"$/,
//     function (locationId: number, regulatorAlias: string) {
//         this.psIndivData =
//             IndividualHealthProFixtureUtils.getHealthProData(this.userAlias);
//         this.psIndivHealthLocation =
//             IndividualHealthProFixtureUtils.getHealthProLocationData(
//                 this.psIndivData,
//                 locationId,
//             );
//
//         this.search = `${this.psIndivData.practitioner.lastname} ${this.psIndivData.practitioner.firstnames.join(" ")}`;
//         this.address = `${this.psIndivHealthLocation.line}, ${this.psIndivHealthLocation.postal_code} ${this.psIndivHealthLocation.city}`;
//
//         const editorSlots = CardComponent.getExpectedEditorSlots(
//             IndividualHealthProFixtureUtils.getLocationSlotsStartingTime(this.psIndivHealthLocation),
//             IndividualHealthProFixtureUtils.getLocationSlotsEndingTime(this.psIndivHealthLocation),
//             IndividualHealthProFixtureUtils.getLocationSlotsDuration(this.psIndivHealthLocation),
//             true,
//             currentTimeFormatted
//     );
//
//         LoginPanel.disconnect();
//         cy.logIn(regulatorAlias);
//
//         ResultsPage.navigateToLoadedPage(this.search, this.address);
//
//     });
