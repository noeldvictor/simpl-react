/* eslint "no-underscore-dangle": "off" */
import React from 'react';
import { stopSubmit } from 'redux-form';

import _ from 'lodash';
import validator from 'validator';


const verboseValidator = function verboseValidator(validation, value) {
  if (!value) {
    return null;
  }
  const messages = {
    isEmail: `The specified value "${value}" is not a valid email address.`,
    isNumeric: 'The specified value is not an integer.',
    isDecimal: 'The specified value is not a decimal.',
    isLowercase: 'The specified value must be lowercase',
    isUppercase: 'The specified value must be uppercase',
  };

  return validator[validation](value) ? null : messages[validation] || 'Invalid value';
};

/**
 * Convert a value to a string, if possible. Otherwise returns the unchanged
 * value. `null` and `undefined` are coerced to the empty string.
 *
 * @param      {any}   value   The value to coerced
 * @return     {any}  Either the value converted to a string, or the value itself.
 */
const stringValue = function stringValue(value) {
  if (value === null || value === undefined) return '';
  return value.toString !== undefined ? value.toString() : value;
};

/**
 * Options to validate a component
 * @typedef {Object} ValidationOptions
 * @property      {Array<string, function>}   errors  An array of validators
 * that may return an error message. For available strings, see the npm [validator](https://www.npmjs.com/package/validator) package
 * @property      {Array<string, function>}   warnings   An array of validators
 * that may return a warning message. For available strings, see the npm [validator](https://www.npmjs.com/package/validator) package
 * @property      {Array<string, function>}   sanitizers  An array of saniters
 * to modify the field's returned value. For available strings, see the npm [validator](https://www.npmjs.com/package/validator) package
 * @property      {Array<function>}           formatters  An array of saniters
 * to modify the field's rendered value.
 */

/**
 * Add value validation to a single field.
 * @memberof Simpl.decorators.forms
 * @example
 * import React from 'react';
 *
 * import {validates} from 'simpl/lib/decorators/forms/validates';
 * import {FormControl} from 'react-bootstrap';
 *
 * const noSpam = (value, ownProps) => {
 *     // validation logic goes here
 *     if (value.endsWith('@spam.com')) {
 *         return "that's spam"
 *     }
 * };
 *
 * const itsNew = (value, ownProps) => {
 *     if (value === ownProps.previousEmail) {
 *         return "email didn't change"
 *     }
 * };
 *
 * function EmailField(props) {
 *     // all aestethics goes here
 *     return (
 *         <FormControl
 *             type="email"
 *             {...props}
 *         />
 *     )
 * }
 *
 * const ValidatingEmailField = validateField({
 *     errors: ['isEmail', noSpam],
 *     warnings: [itsNew]
 * )(EmailField);
 *
 * class MyComponent extends React.Component {
 *     render() {
 *         return(
 *             <div>
 *                 <ValidatingEmailField
 *                     previousEmail="my@email.com"
 *                     errors={['isRequired']}
 *                 />
 *             </div>
 *         );
 *     }
 * }
 *
 * @param      {ValidationOptions}  options  An object of options
 * @returns    {ReactElement} A React component.
 */
export function validateField({ errors, warnings, sanitizers, formatters }) {
  const errorValidators = errors || [];
  const warningValidators = warnings || [];
  const optionsSanitizers = sanitizers || [];
  const optionsFormatters = formatters || [];

  return (Component) => {
    const parentProps = Component.defaultProps;

    class ValidatedComponent extends React.Component {
      constructor(props, context) {
        super(props, context);

        let formattedValue = '';
        if (![undefined, null, ''].includes(this.props.initialValue)) {
          formattedValue = this.format(this.props.initialValue, this.mergedProps(this.props));
        }
        this.state = {
          messages: this.props.messages || [],
          validationState: null,
          value: formattedValue,
          hasReduxForm: context._reduxForm !== undefined,
          name: this.props.name || this.props.input.name,
        };
        this.onChange = this.onChange.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.onFocus = this.onFocus.bind(this);
      }

      componentWillReceiveProps(props) {
        // add value and errors/warnings coming from redux-form

        if (_.isEqual(this.props, props)) {
          return;
        }

        const newState = {
          validationState: null,
          messages: [],
        };

        if (props.meta) {
          if (props.meta.error) {
            newState.validationState = 'error';
            newState.messages.push(props.meta.error);
          } else if (props.meta.warning) {
            newState.validationState = 'warning';
            newState.messages.push(props.meta.warning);
          }
        }

        this.setState(newState);
      }

      onChange(e) {
        this.setState({
          value: e.target.value,
        });

        if (this.state.hasReduxForm) {
        // Update the redux-form state is the field is decorated with `reduxForm'=
          this.context._reduxForm.dispatch(
            this.context._reduxForm.change(this.state.name, e.target.value)
          );
        }

        if (this.props.onChange) {
          this.props.onChange(e);
        }
      }

      onFocus(e) {
        this.setState({
          validationState: null,
          messages: [],
        });

        if (this.props.focus) {
          this.props.focus(e);
        }
      }

      onBlur(e) {
        if (this.props.readOnly === true) {
          if (this.props.blur) {
            this.props.blur(e);
          }
          return;
        }

        const originalValue = e.target.value;

        const { validationState, allErrors, allWarnings } = this.validate(originalValue);

        const messages = [...allErrors, ...allWarnings];

        const sanitizedValue = this.sanitize(originalValue, this.props);
        const formattedValue = this.format(originalValue, this.mergedProps(this.props));

        // If part of a redux form and there are errors, dispatch actions to
        // mark the form as invalid. Warnings will still allow the form to be
        // submitted.
        if (this.state.hasReduxForm) {
          if (sanitizedValue === null || allErrors.length > 0) {
            const reduxFormErrors = { [this.state.name]: allErrors.join(', ') };
            const formName = this.context._reduxForm.form;
            this.context._reduxForm.dispatch(
              stopSubmit(formName, reduxFormErrors)
            );
          }
          this.context._reduxForm.dispatch(
            this.context._reduxForm.blur(this.state.name, e.target.value)
          );
        }

        if (formattedValue !== null) {
          this.setState({
            value: formattedValue,
            validationState,
            messages,
          });
        }

        // the entered value is invalid
        if (sanitizedValue === null) {
          return;
        }

        if (this.props.blur) {
          const sanitizedTarget = Object.assign({}, e.target, { value: sanitizedValue });
          const sanitizedEvent = Object.assign({}, e, { target: sanitizedTarget });
          this.props.blur(sanitizedEvent, formattedValue);
        }
      }

      validate(originalValue) {
        const allErrors = this.mapValidators(
          [...this.props.errors, ...errorValidators], originalValue, this.props
        );
        const allWarnings = this.mapValidators(
          [...this.props.warnings, ...warningValidators], originalValue, this.props
        );

        if (originalValue === '' && this.props.required === true) {
          allErrors.push('This field is required.');
        }

        let validationState = 'success';
        if (allErrors.length) {
          validationState = 'error';
        } else if (allWarnings.length) {
          validationState = 'warning';
        }

        return {
          validationState,
          allErrors,
          allWarnings,
        };
      }

      mergedProps(props) {
        return Object.assign({}, parentProps, props);
      }

      mapValidators(validators, value, props) {
        return validators.map((validation) => {
          if (_.isFunction(validation)) {
            return validation(value, props);
          } else if (_.isString(validation)) {
            return verboseValidator(
              validation,
              stringValue(value)
            );
          }
          return null;
        }).filter((result) => result !== null);
      }

      sanitize(value, props) {
        const allSanitizers = [...props.sanitizers, ...optionsSanitizers];

        // `redux-form` commpatibility
        if (props.normalize) {
          allSanitizers.push(props.normalize);
        }

        const sanitizedValue = allSanitizers.reduce((previousValue, sanitizer) => {
          let sanitizerFunc = sanitizer;
          if (_.isString(sanitizer)) {
            sanitizerFunc = validator[sanitizer];
          }

          const sanitized = sanitizerFunc(stringValue(previousValue));
          if (props.input.type === 'number' && isNaN(sanitized)) {
            return null;
          }
          return sanitized !== null ? sanitized : previousValue;
        }, value);
        return sanitizedValue;
      }

      format(value, props) {
        const allFormatters = [...props.formatters, ...optionsFormatters];
        const formattedValue = allFormatters.reduce(
          (previousValue, formatter) => formatter(previousValue, props) || previousValue
        , value);
        return formattedValue;
      }

      render() {
        return (
          <span>
            <Component
              {...this.state}
              onChange={this.onChange}
              onBlur={this.onBlur}
              onFocus={this.onFocus}
              type={this.props.type}
              name={this.state.name}
              id={this.props.id}
              required={this.props.required}
              readOnly={this.props.readOnly}
            />
          </span>
        );
      }
    }

    ValidatedComponent.defaultProps = {
      errors: [],
      warnings: [],
      sanitizers: [],
      formatters: [],
      required: false,
      readOnly: false,
    };

    ValidatedComponent.contextTypes = {
      _reduxForm: React.PropTypes.object,
    };

    ValidatedComponent.propTypes = {
      name: React.PropTypes.string,
      input: React.PropTypes.object,
      id: React.PropTypes.string,
      required: React.PropTypes.bool,
      readOnly: React.PropTypes.bool,
      initialValue: React.PropTypes.any,
      type: React.PropTypes.string,
      meta: React.PropTypes.object,
      onChange: React.PropTypes.func,
      onBlur: React.PropTypes.func,
      blur: React.PropTypes.func,
      onFocus: React.PropTypes.func,
      messages: React.PropTypes.array,
      errors: React.PropTypes.array,
      warnings: React.PropTypes.array,
      sanitizers: React.PropTypes.array,
      formatters: React.PropTypes.arrayOf(React.PropTypes.func),
    };

    return ValidatedComponent;
  };
}

export default validateField;
