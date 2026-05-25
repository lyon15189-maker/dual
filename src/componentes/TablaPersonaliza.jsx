import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { FilterMatchMode } from 'primereact/api';
import TableConfig from '../js/clases/POOTabla';
import { Button } from 'primereact/button';
import { limpiarCaracteres } from '../js/scrips';

const TablaPersonaliza = ({ datos, control, expandedRows, setExpandedRows, recarga, exportar }) => {
  const [data, setData] = useState(datos?.getConfig()?.data || []);

  // console.log("11:", recarga);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    ...Object.fromEntries(
      (datos?.getConfig()?.columnsConfig ?? [])
        .filter(col => col.filter)
        .map(col => [col.field, { value: null, matchMode: FilterMatchMode.CONTAINS }])
    )
  });

  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const dt = useRef(null);

  useEffect(() => {
    if (datos?.getConfig()?.data) {
      setData(datos.getConfig().data);
      if (control) {
        datos.setTableData = setData;
      }
    }
  }, [datos, control]);

  const exportCSV = (selectionOnly) => {
    dt.current?.exportCSV({ selectionOnly });
  };

  const getDynamicFilterFields = (data) => {
    const fields = [];
    const extractFields = (obj, parentKey = '') => {
      if (!obj || typeof obj !== 'object') return;
      Object.keys(obj).forEach(key => {
        const currentKey = parentKey ? `${parentKey}.${key}` : key;
        if (typeof obj[key] !== 'object' && !Array.isArray(obj[key])) {
          fields.push(currentKey);
        }
        if (Array.isArray(obj[key]) && obj[key].length > 0) {
          extractFields(obj[key][0], currentKey);
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
          extractFields(obj[key], currentKey);
        }
      });
    };
    if (data.length > 0) {
      extractFields(data[0]);
    }
    return fields;
  };

  const customGlobalFilter = (data, globalFilter) => {
    if (!globalFilter) return [...data];
    const filterValue = globalFilter.toLowerCase().trim();
    // const fields = getDynamicFilterFields(data);
    // console.log("65", filterValue, fields, data);
    let resultado = []
    data.forEach(e => {
      let objT = limpiarCaracteres(JSON.stringify(e), { caracteresAConservar: [" ", "$", "%", "-", ":", "/", "?", "=", "_"] })
      if (objT.toLowerCase().includes(filterValue)) {
        resultado.push(e)
      }
    });
    // console.log("73", resultado);
    return resultado
  };

  useEffect(() => {
    if (datos?.getConfig()?.data) {
      const filteredData = customGlobalFilter(datos.getConfig().data, globalFilterValue);
      setData(filteredData);
    }
  }, [globalFilterValue, datos]);

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    setGlobalFilterValue(value);
  };

  const header = (
    <div className="flex justify-between items-center">
      <span className="p-input-icon-left w-100">
        <i className="pi pi-search ps-3" />
        <InputText
          value={globalFilterValue}
          onChange={onGlobalFilterChange}
          placeholder="Buscar..."
          className="p-inputtext-sm ps-5"
        />
      </span>
    </div>
  );

  const filterTemplate = (options) => (
    <InputText
      value={options.value || ''}
      onChange={(e) => options.filterApplyCallback(e.target.value)}
      placeholder={`Filtrar por ${options.field}`}
      className="p-inputtext-sm"
    />
  );

  const handleSelectionChange = (e) => {
    // console.log("handleSelectionChange 133:", datos?.getConfig()?.dataKey);
    setSelectedRows(e.value);
    if (control && datos) {
      const updatedTableConfig = new TableConfig();
      updatedTableConfig.setColumnsConfig(datos.getConfig()?.columnsConfig || []);
      updatedTableConfig.setRowExpansionTemplate(datos.getConfig()?.rowExpansionTemplate);
      updatedTableConfig.setData(datos.getConfig()?.data || []);
      updatedTableConfig.setPaginatorConfig(datos.getConfig()?.paginatorConfig || {});
      updatedTableConfig.setOnRowToggle(datos.getConfig()?.onRowToggle);
      updatedTableConfig.setSelectedRows(e.value);
      control(updatedTableConfig);
    }
  };
  // console.log(datos);
  if (recarga !== undefined) {
    var paginatorLeft = <Button type="button" icon="pi pi-refresh" text onClick={() => recarga() || datos?.ejecutarAccionRecarga?.()} />;
  }
  const paginatorRight = exportar == undefined ? <Button type="button" icon="pi pi-download" text onClick={() => exportCSV(false)} data-pr-tooltip="CSV" /> : exportar ? <Button type="button" icon="pi pi-download" text onClick={() => exportCSV(false)} data-pr-tooltip="CSV" /> : <></>;

  return (
    <div className="card">
      {/* {console.log("150:", datos?.getConfig())} */}
      <DataTable
        ref={dt}
        value={data}
        paginatorLeft={paginatorLeft}
        paginatorRight={paginatorRight}
        paginator={!!datos?.getConfig()?.paginatorConfig}
        rows={datos?.getConfig()?.paginatorConfig?.rows || 10}
        rowsPerPageOptions={datos?.getConfig()?.paginatorConfig?.rowsPerPageOptions || [5, 10, 25, 50]}
        paginatorTemplate={datos?.getConfig()?.paginatorConfig?.paginatorTemplate || 'FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown'}
        currentPageReportTemplate={datos?.getConfig()?.paginatorConfig?.currentPageReportTemplate || 'Mostrando {first} a {last} de {totalRecords} registros'}
        filters={filters}
        globalFilterFields={datos?.getConfig()?.data ? getDynamicFilterFields(datos.getConfig().data) : []}
        header={header}
        selection={selectedRows}
        onSelectionChange={handleSelectionChange}
        expandedRows={expandedRows}
        onRowToggle={(e) => {
          setExpandedRows(e.data);
          datos?.getConfig()?.onRowToggle?.(e);
        }}
        rowExpansionTemplate={(rowData) => {
          const template = datos?.getConfig()?.rowExpansionTemplate;
          return template ? template(rowData) : null;
        }}
        emptyMessage="No se encontraron datos"
        className="p-datatable-sm"
        scrollable
        scrollHeight="600px"
        dataKey={'_id'}
      >
        {datos?.getConfig()?.rowExpansionTemplate && (
          <Column expander style={{ width: '3em' }} />
        )}
        {datos?.getConfig()?.checks && (
          <Column selectionMode="multiple" headerStyle={{ width: '3em' }} />
        )}
        {/* {console.log("184:", datos?.getConfig()?.columnsConfig)} */}
        {(datos?.getConfig()?.columnsConfig || []).map((col, index) => (
          <Column
            key={index}
            field={col.field}
            header={col.header}
            sortable={col.sortable}
            className="text-start"
            // filter={col.filter}
            // filterElement={col.filter ? filterTemplate : undefined}
            frozen={col.frozen}
            body={(rowData) => {
              if (col.body) {
                return col.body(rowData);
              }
              if (col.field) {
                const value = col.field.split('.').reduce((obj, key) => obj && obj[key], rowData);
                if (value instanceof Date) {
                  return value.toLocaleDateString(); // o el formato que desees
                }
                return value !== undefined && value !== null ? value : 'N/A';
              }
              return 'N/A';
            }}
            style={col.style ? col.style : { minWidth: col.width || '200px' }}
          />
        ))}
      </DataTable>
    </div>
  );
};

export default TablaPersonaliza;
