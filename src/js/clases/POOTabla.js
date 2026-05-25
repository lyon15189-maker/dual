import React from 'react';

class TableConfig {
  constructor() {
    this.columnsConfig = [];
    this.tableData = [];
    this._setTableData = () => { };
    this.paginatorConfig = {
      rows: 15,
      rowsPerPageOptions: [10, 15, 30, 60],
      paginatorTemplate:
        'FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown',
      currentPageReportTemplate: 'Registros {first} a {last} de {totalRecords}',
    };
    this.selectedRows = [];
    this.checks = true;
    this.dataKey = "";
    this._accionRecarga = null; // 👈 nueva propiedad para guardar la función
  }

  // --- Nueva función para registrar la acción de recarga
  accionRecarga(callback) {
    if (typeof callback === 'function') {
      this._accionRecarga = callback;
    }
    return this;
  }

  ejecutarAccionRecarga(...args) {
    if (this._accionRecarga) {
      this._accionRecarga(...args);
    } else {
      console.warn('⚠️ No hay acción de recarga definida');
    }
  }

  addCol(
    field,
    header,
    sortable = false,
    filter = false,
    custom,
    frozen,
    width
  ) {
    const column = {
      field,
      header,
      sortable,
      filter,
      frozen,
      width,
    };

    if (custom) {
      column.custom = {
        ...custom,
        label: custom.label || (custom.modal ? custom.modal[1] : 'Ver'),
      };

      if (custom.style) {
        column.style = custom.style;
      }

      if (custom.body) {
        column.body = custom.body;
      } else if (custom.type === 'text') {
        column.body = (rowData) => (
          <span style={custom.style}>{rowData[field] || 'N/A'}</span>
        );
      }
    }

    this.columnsConfig.push(column);
    return this; // permite encadenamiento
  }
  toogleChecks(estado) {
    this.checks = estado
  }
  addContenidoPersonalizado(template) {
    this.rowExpansionTemplate = template;
    return this;
  }

  addData(data) {
    this.tableData = data;
    this._setTableData(data);
    return this;
  }

  addDataKey(dataKey) {
    this.dataKey = dataKey;
    return this;
  }

  setColumnsConfig(columnsConfig) {
    this.columnsConfig = columnsConfig;
    return this;
  }

  setRowExpansionTemplate(template) {
    this.rowExpansionTemplate = template;
    return this;
  }

  setData(data) {
    this.tableData = data;
    this._setTableData(data);
    return this;
  }

  set setTableData(setter) {
    this._setTableData = setter;
  }

  setPaginatorConfig(paginatorConfig) {
    this.paginatorConfig = paginatorConfig;
    return this;
  }

  setOnRowToggle(onRowToggle) {
    this.onRowToggle = onRowToggle;
    return this;
  }

  setSelectedRows(rows) {
    this.selectedRows = rows;
    return this;
  }

  getConfig() {
    return {
      checks: this.checks,
      columnsConfig: this.columnsConfig,
      rowExpansionTemplate: this.rowExpansionTemplate,
      data: this.tableData,
      actions: { setData: this._setTableData },
      paginatorConfig: this.paginatorConfig,
      onRowToggle: this.onRowToggle,
      selectedRows: this.selectedRows,
      accionRecarga: this._accionRecarga, // 👈 se expone por si se requiere
      dataKey: this.dataKey
    };
  }
}

export default TableConfig;
