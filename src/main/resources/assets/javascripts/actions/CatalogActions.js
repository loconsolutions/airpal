import alt from '../alt';
import CatalogApiUtils from '../utils/CatalogApiUtils';
import TableActions from '../actions/TableActions';
import logError from '../utils/logError'

class CatalogActions {
  constructor() {
    this.generateActions(
      'addCatalog',
      'removeCatalog',
      'selectCatalog',
      'unselectCatalog'
    );
  }

  fetchCatalogs() {
    CatalogApiUtils.fetchCatalogs().then((catalogs) => {
      this.dispatch(catalogs);
    }).catch(logError);
  }

  fetchCatalog(catalog) {
    // Fetch the data from the new table
    CatalogApiUtils.fetchCatalogData(catalog).then(
    (tables) => {
      TableActions.receivedTables(tables);
    }
    ).catch(logError);
  }
}

export default alt.createActions(CatalogActions);
