# blue-form
Smarter form for React.
It handles all input changes and binding their properties (including but not only value and checked) to a data object. Binding to properties of properties is possible also by separating the props by dots, checkthe usage section.

# Installation
```bash
npm install blue-form
```

# Usage
```javascript
import Form from 'blue-form';

const LabelCheck = (props) => (
  <React.Fragment>
      <label>{props.label}</label>
      <input type="checkbox" {...props} />
  </React.Fragment>
)

class SomeView extends React.Component {
  handleSubmit(data){
    console.log('submited data', data);
  }
  render(){
    const initialData = {
      name: 'Test',
      isPublic: true,
      option: 'option1',
      selected: 'o2',
      deeper: {
        name: 'Child value'
      }
    };
    return (
      <Form data={initialData} onSubmit={this.handleSubmit.bind(this)}>
          <input type="text" map_value="name" />
          <input type="checkbox" map_checked="isPublic" />
          <input type="radio" map_checked="isPublic" />
          <input type="radio" map_checked="option" value="option1"/>
          <input type="radio" map_checked="option" value="option2"/>
          <select map_value="selected">
            <option value="o1">Option 1</option>
            <option value="o2">Option 2</option>
            <option value="o3">Option 3</option>
            <option value="o4">Option 4</option>
          </select>
          // bind to properties out of the root
          <input type="text" map_value="deeper.name" />
          // bind other properties trough map_{propName} = {key}
          <LabelCheck map_label="name" map_checked="isPublic" />
          <input type="submit" map_action="true" />
      </Form>
    )
  }
}
```
