import { createElement, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Add as AddIcon,
  ClearTwoTone as ClearTwoToneIcon,
  Done as DoneIcon,
  FilterList as FilterListIcon,
  Remove as RemoveIcon,
} from '@mui/icons-material';
import {
  Badge,
  Collapse,
  Grid,
  Hidden,
  Typography,
  useMediaQuery,
} from '@mui/material';
import PageLayout from 'App/PageLayout';
import {
  FieldCheckbox,
  FieldCombo,
  FieldDatePicker,
  FieldInput,
  FieldSelect,
  FieldSwitch,
} from 'Components/FormFields';
import { Formik } from 'formik';
import queryString from 'query-string';

import AppButton from '../AppButton';

import { FilterWrapper, Wrapper } from './styled';

const fieldCheckbox = ({ name, options = [], ...props }) => (
  <Grid item>
    <FieldCheckbox name={name} size="small" options={options} {...props} />
  </Grid>
);

const fieldDatepicker = ({
  name,
  label = '',
  placeholder = '',
  required = false,
  shrink = true,
  ...props
}) => (
  <Grid item>
    <FieldDatePicker
      name={name}
      label={label}
      placeholder={placeholder}
      variant="inline"
      autoOk
      inputVariant="outlined"
      format="DD/MM/YYYY"
      margin="normal"
      InputLabelProps={{
        required,
        shrink,
      }}
      KeyboardButtonProps={{
        className: 'datepicker-icon',
      }}
      textFieldProps={{ size: 'small' }}
      {...props}
    />
  </Grid>
);

const fieldSelect = ({
  name,
  label = '',
  placeholder = '',
  options = [],
  required = false,
  shrink = true,
  ...props
}) => (
  <Grid item>
    <FieldSelect
      name={name}
      size="small"
      label={label}
      placeholder={placeholder}
      variant="outlined"
      options={options}
      required={required}
      showNone
      InputLabelProps={{
        shrink,
      }}
      {...props}
    />
  </Grid>
);

const fieldCombo = ({
  name,
  label = '',
  placeholder = '',
  options = [],
  required = false,
  shrink = true,
  ...props
}) => (
  <Grid item>
    <FieldCombo
      name={name}
      label={label}
      placeholder={placeholder}
      variant="outlined"
      options={options}
      required={required}
      InputLabelProps={{
        shrink,
      }}
      {...props}
    />
  </Grid>
);

const fieldSwitch = ({
  name,
  label = '',
  color = 'primary',
  size = 'small',
  labelStyle = {},
  ...props
}) => {
  return (
    <Grid item>
      <Typography variant="body1" component="div" color="textPrimary">
        <div style={labelStyle}>{label}</div>
        <FieldSwitch name={name} color={color} size={size} {...props} />
      </Typography>
    </Grid>
  );
};

const fieldInput = ({
  name,
  label = '',
  placeholder = '',
  shrink = true,
  required = false,
  inputType = 'text',
  ...props
}) => (
  <Grid item>
    <FieldInput
      name={name}
      size="small"
      label={label}
      type={inputType}
      placeholder={placeholder}
      variant="outlined"
      InputLabelProps={{
        required,
        shrink,
      }}
      {...props}
    />
  </Grid>
);

const PageFilter = ({
  initialValues = {},
  filterLabel = '',
  showFilterIcon = true,
  data = [],
  setFilters,
  initialApiCall,
  titleComponent,
  showSelectDC = false,
  initialFilterCount = 4,
  titleHelper,
  children,
  dcFilterFn,
}) => {
  const matches = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  const [filterOpen, setFilterOpen] = useState(true);
  const [values, setValues] = useState(initialValues);
  const [queryStrings, setQueryStrings] = useState({});
  const [showAll, setShowAll] = useState(false);
  const [initialValuesFromQuery, setInitialValuesFromQuery] = useState({});
  const navigate = useNavigate();
  const location = useLocation();
  const didMount = useRef(false);

  const dataMap = data.reduce(
    (acc, { name, type, multiple, options = [], onChangeInput = '' } = {}) => {
      acc[name] = {
        type,
        multiple,
        options,
        ignore: !!onChangeInput,
      };
      return acc;
    },
    {},
  );

  function setQueryValues(queryValues) {
    setValues(
      Object.keys(queryValues).reduce((acc, query) => {
        if (dataMap[query].ignore) {
          return acc;
        }
        if (Array.isArray(queryValues[query])) {
          acc[query] = queryValues[query].map((query) => query.id);
        } else if (typeof queryValues[query] === 'object') {
          acc[query] = queryValues[query].id;
        } else if (
          queryValues[query] ||
          typeof queryValues[query] === 'boolean'
        ) {
          acc[query] = queryValues[query];
        }
        return acc;
      }, {}),
    );
  }

  function generateQueryValues(queryObject) {
    return data.reduce((acc, { name }) => {
      let val = queryObject[name];
      if (!val) return acc;
      if (dataMap[name].type === 'fieldCombo' && dataMap[name].multiple) {
        if (dataMap[name].options?.length) {
          val = typeof val === 'string' ? [val] : val;
          acc[name] = val.map((id) =>
            dataMap[name]?.options.find((data) => data.id == id),
          );
        }
      } else if (
        dataMap[name].type === 'fieldCombo' &&
        !dataMap[name].multiple
      ) {
        acc[name] = dataMap[name]?.options.find((data) => data.id == val);
      } else if (dataMap[name].type === 'fieldSwitch') {
        acc[name] = val === 'true';
      } else if (dataMap[name].type === 'fieldDatepicker') {
        acc[name] = isNaN(val) ? '' : Number(val);
      } else if (val) {
        acc[name] = val;
      }
      return acc;
    }, {});
  }

  useEffect(() => {
    const queryObject = queryString.parse(location.search, {
      arrayFormat: 'separator',
      arrayFormatSeparator: '|',
    });
    if (initialApiCall) {
      setFilters(queryObject);
    } else if (queryObject && Object.keys(queryObject)?.length === 0) {
      setFilters(initialValues);
    }
    setQueryStrings(queryObject);

    const queryValues = generateQueryValues(queryObject);
    setInitialValuesFromQuery(queryValues);
    setQueryValues(queryValues);
  }, []);

  const isEveryQueryValidOptions = (queryValues) => {
    return Object.keys(queryValues).every((key) => {
      if (dataMap[key].type === 'fieldCombo') {
        return !!dataMap[key].options?.length;
      }
      return true;
    });
  };

  useEffect(() => {
    const ignoredInputKeys = Object.keys(dataMap).filter(
      (input) => dataMap[input].ignore === true,
    );
    const disableApiCall = ignoredInputKeys.some(
      (input) => dataMap[input]?.options?.length > 0,
    );

    if (!didMount.current) {
      didMount.current = true;
    } else if (!disableApiCall) {
      const queryValues = generateQueryValues(queryStrings);
      setInitialValuesFromQuery(queryValues);
      setQueryValues(queryValues);
      if (
        Object.keys(queryStrings)?.length &&
        isEveryQueryValidOptions(queryValues)
      ) {
        setFilters(queryValues);
      }
    }
  }, [JSON.stringify(data)]);

  useEffect(() => {
    matches && setFilterOpen(false);
  }, [matches]);

  const componentsMap = {
    fieldDatepicker,
    fieldSelect,
    fieldInput,
    fieldCombo,
    fieldSwitch,
    fieldCheckbox,
  };

  const toggleFilterPanel = () => {
    showFilterIcon && setFilterOpen(!filterOpen);
  };

  const submitFilters = (filters) => {
    const path = `${location.pathname}?${queryString.stringify(values, {
      arrayFormat: 'separator',
      arrayFormatSeparator: '|',
      skipEmptyString: true,
      skipNull: true,
    })}`;
    navigate(path, { replace: true });
    setFilters(filters);
    matches && setFilterOpen(false);
  };

  const updateValuesAndQuery = (id, initialValue, value) => {
    setInitialValuesFromQuery({
      ...initialValuesFromQuery,
      [id]: initialValue,
    });
    if (!dataMap[id].ignore) {
      setValues({
        ...values,
        [id]: value,
      });
    }
  };

  const onValuesChange = (id, onChange) => {
    return (e) => {
      onChange();
      if (dataMap[id].type === 'fieldCombo') {
        updateValuesAndQuery(
          id,
          e,
          dataMap[id].multiple ? e.map((val) => val.id) : e?.id,
        );
      } else if (dataMap[id].type === 'fieldDatepicker') {
        updateValuesAndQuery(id, e, e);
      } else if (dataMap[id].type === 'fieldSwitch') {
        updateValuesAndQuery(id, !values[id], !values[id]);
      } else {
        updateValuesAndQuery(id, e.target.value, e.target.value);
      }
    };
  };

  const onClearFilters = () => {
    navigate(location.pathname, { replace: true });
    setInitialValuesFromQuery({});
    setFilters({});
    setValues(initialValues);
  };

  return (
    <PageLayout
      showSelectDC={showSelectDC}
      dcFilterFn={dcFilterFn}
      title={
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {filterLabel}
          <Badge color="secondary" overlap="circular">
            {showFilterIcon && (
              <Hidden mdUp>
                <FilterListIcon
                  color="primary"
                  onClick={toggleFilterPanel}
                  style={{ cursor: 'pointer' }}
                />
              </Hidden>
            )}
          </Badge>
        </div>
      }
      titleHelper={titleHelper}
      titleComponent={titleComponent}
    >
      <PageLayout.Body>
        <Wrapper>
          <Collapse in={filterOpen} style={{ minHeight: '' }}>
            <FilterWrapper>
              <Formik
                enableReinitialize
                initialValues={{ ...initialValues, ...initialValuesFromQuery }}
                onSubmit={submitFilters}
              >
                {({ handleSubmit }) => (
                  <Grid
                    container
                    direction="row"
                    justifyContent="space-between"
                    style={{ padding: '8px 8px 0 8px' }}
                  >
                    <Grid container md={10} alignItems="flex-start" spacing={2}>
                      {data
                        .filter((d, i) => i < initialFilterCount || showAll)
                        .map(
                          ({
                            type,
                            style = { width: '250px' },
                            name,
                            onChange = () => {},
                            ...rest
                          }) =>
                            createElement(componentsMap[type], {
                              ...rest,
                              style,
                              name,
                              key: name,
                              onChange: onValuesChange(name, onChange),
                            }),
                        )}
                      {data.length > initialFilterCount && (
                        <Grid item>
                          <Grid container alignItems="center">
                            <AppButton
                              variant="text"
                              onClick={() => setShowAll(!showAll)}
                              style={{
                                height: '100%',
                                display: 'flex',
                                justifyContent: 'center',
                              }}
                            >
                              {showAll ? <RemoveIcon /> : <AddIcon />}
                              <Typography variant="subtitle1" color="primary">
                                <strong>{showAll ? 'Hide' : 'More'}</strong>
                              </Typography>
                            </AppButton>
                          </Grid>
                        </Grid>
                      )}
                    </Grid>
                    <Grid
                      item
                      md={2}
                      style={{
                        textAlign: 'end',
                        margin: '4px',
                        display: 'flex',
                      }}
                    >
                      <AppButton
                        color="inherit"
                        className="margin-horizontal"
                        onClick={onClearFilters}
                      >
                        <ClearTwoToneIcon />
                      </AppButton>

                      <AppButton type="submit" onClick={handleSubmit}>
                        <DoneIcon />
                      </AppButton>
                    </Grid>
                  </Grid>
                )}
              </Formik>
            </FilterWrapper>
          </Collapse>
          {children}
        </Wrapper>
      </PageLayout.Body>
    </PageLayout>
  );
};

export default PageFilter;
