import React from 'react';
import { FormControl, InputGroup } from 'react-bootstrap';
import { validateField } from '../../decorators/forms/validates';

import { getNumberProps, inputPropTypes } from './props';
import { min, max } from './validators';


function Input(props) {
  const inputProps = getNumberProps(props);
  return (
    <InputGroup>
      <FormControl
        type="number"
        {...inputProps}
      />
    </InputGroup>
  );
}

Input.propTypes = Object.assign({}, inputPropTypes, {
  min: React.PropTypes.number,
  max: React.PropTypes.number,
  step: React.PropTypes.number,
});

export const NumberInput = validateField({
  errors: [min, max],
  sanitizers: ['toFloat'],
})(Input);

export default NumberInput;
