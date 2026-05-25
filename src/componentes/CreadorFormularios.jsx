import React, { memo, useRef, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Calendar } from 'primereact/calendar';
import { Checkbox } from 'primereact/checkbox';
import { Dropdown } from 'primereact/dropdown'; // Importar Dropdown
import { InputSwitch } from 'primereact/inputswitch';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { locale, addLocale } from 'primereact/api';
import { MultiSelect } from 'primereact/multiselect';
import { Password } from 'primereact/password';
import { InputNumber } from 'primereact/inputnumber';
import { Chips } from "primereact/chips";

locale('es');
addLocale('es', {
  firstDayOfWeek: 1,
  dayNames: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
  dayNamesShort: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
  dayNamesMin: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
  monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
  monthNamesShort: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
  today: 'Hoy',
  clear: 'Limpiar',
  weekHeader: "N° SM"
  //...
});
const defaultChangeHandler = (e, control, id) => {
  const value = e.target?.value ?? e.value ?? e.checked;
  control((prev) => ({
    ...prev,
    [id]: value,
  }));
};

const defaultBlurHandler = (e, control, id, formatter, formatOn) => {
  if (formatter && formatOn === 'blur') {
    const value = e.target?.value ?? e.value;
    const formattedValue = formatter(value, false) ?? value;
    control((prev) => ({
      ...prev,
      [id]: formattedValue,
    }));
  }
};

const componentMap = {
  text: InputText,
  textArea: InputTextarea,
  calendar: Calendar,
  horario: Calendar,
  rango: Calendar,
  checkbox: Checkbox,
  select: Dropdown,
  selectGroup: Dropdown,
  group: MultiSelect,
  switch: InputSwitch,
  pass: Password,
  number: InputNumber,
  chips: Chips
};

const CreadorFormularios = ({ campos, datos, control, formatters = {}, reporte = false }) => {
  const inputRefs = useRef({});

  // useEffect(() => {
  //   console.log('CreadorFormularios datos:', datos,campos);
  // }, [datos]);

  return (
    <div className="row">
      {campos.map((campo, index) => {
        const {
          id,
          type = 'text',
          title = '',
          classDiv = '',
          classLabel = 'd-block mb-1',
          classError = '',
          required = false,
          error = 'Este campo es requerido',
          placeholder = '',
          timeOnly = false,
          toggleMask = true,
          formato,
          formatOn = 'change',
          change,
          click,
          blur,
          filter,
          disabled = reporte,
          dateFormat = 'dd/mm/yy',
          options = [],
          hourFormat,
          optionValue,
          name,
          inputId,
          display,
          optionLabel,
          optionGroupLabel,
          optionGroupChildren,
          selectionMode = "single",
          readOnlyInput = false,
          hideOnRangeSelection = false,
          minDate = null,
          maxDate = null,
          rows = 5,
          mode = "decimal",
          showButtons,
          min = -1,
          max = 100000000,
          ...rest
        } = campo;

        const formatter = formatters[formato];
        const inputValue = datos[id] ?? (type === 'checkbox' ? false : type === 'select' ? null : type === 'group' ? null : '');
        const displayValue =
          formatter && formatOn === 'change' && type !== 'select' && type !== 'group'
            ? formatter(inputValue, true) ?? inputValue
            : inputValue;
        const inputClass =
          required && (inputValue === '' || inputValue === null || inputValue === undefined)
            ? 'w-100 p-invalid p-filled'
            : 'w-100';

        const FormComponent = componentMap[type] || InputText;

        const commonProps = {
          id,
          value: type !== 'checkbox' && type !== 'select' && type !== 'group' ? displayValue : undefined,
          checked: type === 'checkbox' || type === 'switch' ? !!inputValue : undefined,
          className: type === 'checkbox' || type === 'switch' ? '' : inputClass,
          onChange: (e) =>
            change
              ? changes[change]?.(e) || defaultChangeHandler(e, control, id)
              : defaultChangeHandler(e, control, id),
          onClick: (e) => (click ? clicks[click]?.(e) : null),
          onBlur: (e) =>
            blur
              ? blurs[blur]?.(e) || defaultBlurHandler(e, control, id, formatter, formatOn)
              : defaultBlurHandler(e, control, id, formatter, formatOn),
          disabled,
          required,
          ref: (el) => (inputRefs.current[id] = el),
          ...(type === 'calendar' && {
            dateFormat: dateFormat,
            showWeek: true,
            selectionMode,
            readOnlyInput,
            hideOnRangeSelection,
            minDate,
            maxDate
          }),
          ...(type === 'horario' && {
            timeOnly,
            hourFormat,
            placeholder
          }),
          ...(type === 'chips' && { value: inputValue, placeholder }),
          ...(type === 'text' && { placeholder }),
          ...(type === 'number' && { mode, showButtons, min, max, placeholder }),
          ...(type === 'pass' && { toggleMask, feedback: false, placeholder }),
          ...(type === 'checkbox' && { inputId, name }),
          ...(type === 'textArea' && { placeholder, rows: rest.rows || rows, cols: rest.cols || 30 }),
          ...(type === 'select' && {
            options,
            disabled,
            optionLabel,
            optionValue,
            value: inputValue,
            placeholder: placeholder || 'Seleccione opción',
            filter: true,
          }),
          ...(type === 'selectGroup' && {
            options,
            disabled,
            optionLabel,
            optionValue,
            value: inputValue,
            placeholder: placeholder || 'Seleccione opción',
            filter: true,
            name,
            inputId,
            display: "chip",
            optionGroupLabel,
            optionGroupChildren
          }),
          ...(type === 'group' && {
            options,
            disabled,
            optionLabel,
            optionValue,
            value: inputValue,
            placeholder: placeholder || 'Seleccione opción',
            filter: true,
            name,
            inputId,
            display: "chip",
            optionGroupLabel,
            optionGroupChildren
          }),
          ...rest,
        };

        return (
          <div
            id={`padre${id}`}
            key={`padre${id}${index}`}
            className={classDiv}
          >
            {type !== 'checkbox' || type === 'switch' ? (
              <label htmlFor={id} className={classLabel}>
                {title || id}
              </label>
            ) : null}
            {type === 'checkbox' ? (
              <div className="p-field-checkbox">
                <FormComponent {...commonProps} />
                <label htmlFor={inputId} className={classLabel}>{title || id}</label>
              </div>
            ) : (
              <FormComponent {...commonProps} />
            )}
            {required && selectionMode == "single" && (inputValue === '' || inputValue === null || inputValue === undefined || inputValue < 0) && (
              <small id={`error${id}${index}`} className={`p-error block mt-1 ${classError}`}>
                {error}
              </small>
            )}
            {required && selectionMode == "range" && type == "calendar" && (datos?.[id]?.[0] == null || datos?.[id]?.[1] == null) && (
              <small id={`error${id}${index}`} className={`p-error block mt-1 ${classError}`}>
                {error}
              </small>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CreadorFormularios;