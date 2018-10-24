import React from 'react';

class BlueForm extends React.Component {
  constructor (props) {
    super(props);
    this.state = Object.assign({}, props.data);
  }
  parseChildren (children) {
    return React.Children.map(children, child => this.transformChild(child));
  }
  transformChild (child) {
    console.log(child);
    if (!child) {
      return child; // amazing :))
    }
    let newChildren = child.props && child.props.children && this.parseChildren(child.props.children);

    let mappedPropsNames = this.mappedPropsNames(child);

    if (!mappedPropsNames.length) {
      // this is not to be watched
      return  newChildren ? React.cloneElement(child, {}, newChildren) : child;
    } else {
      return this.decorate(child, mappedPropsNames, newChildren);
    }
  }

  decorate(child, propNames, newChildren) {
    //map_value = "model_key"
    //map_checked = "model_key"
    //map_action = "true" >>> submit
    let needsChangeHandler = false,
          needsClickHandler = false;
      const newProps ={};

    propNames.forEach(name => {
      let propValue = child.props[name],
      key = name.substr(4); //map_

      if(key === 'action') {
        needsClickHandler = true;
      }else{
        needsChangeHandler = true;
        if(key === "checked" && child.props.hasOwnProperty('value')) {
            newProps[key] = (this.getValue(propValue) === child.props.value);
        }else{
          newProps[key] = this.getValue(propValue);
        }
      }
    });
    needsChangeHandler && this.decorateChangeHandler(child.props, newProps);
    needsClickHandler && this.decorateClickHandler(child.props, newProps);
    console.log(child, newProps, newChildren);
    return React.cloneElement(child, newProps, newChildren);
  }
  getValue(propValue) {
    let tmp = {...this.state},
        segments = propValue.split('.');

    while(segments.length>1) {
      let segment = segments.shift();
      if(!tmp[segment]) {
        tmp[segment] = {};
      }
      tmp = tmp[segment];
    }
     return tmp[segments.shift()] || '';
  }
  decorateChangeHandler (props, newProps) {
    const handler = this.onChangeHandler.bind(this, props);

    newProps.onChange = (e) => {
      handler(e);
      props.onChange && props.onChange(e);
    }
  }
  onChangeHandler (props, e) {
    let value = e.target.hasOwnProperty('checked') ? e.target.checked : e.target.value;
    let propName = props.map_checked ? 'map_checked' : 'map_value';
    let propValue = props[propName];
    let state = Object.assign({}, this.state);
    let tmp = state;

    propValue = propValue.split('.');
    while(propValue.length>1) {
      let segment = propValue.shift()
      if(!tmp[segment]){
        tmp[segment]={};
      }
      tmp = tmp[segment];
    }

     if(propName === 'map_checked' && props.hasOwnProperty('value') && value) {
        tmp[propValue.shift()] = props.value;
     }else{
       tmp[propValue.shift()] = value;
     }

    this.setState(state, () => {
      this.props.onDataChange && (this.props.onDataChange({...this.state}));
    });
  }

  decorateClickHandler (props, newProps) {
    const handler = this.onClickHandler.bind(this, props);

    newProps.onClick = (e) => {
      handler(e);
      props.onClick && props.onClick(e);
    }
  }

  onClickHandler (props, e) {
    e.preventDefault();
    this.props.onSubmit(Object.assign({}, this.state));
  }

  mappedPropsNames (child) {
    const propNames = Object.keys(child.props || {});

    return propNames.filter(propName => propName.match(/^map_/))
  }
  render () {
    const {children, onDataChange, ...formProps} = this.props;
    const newChildren = this.parseChildren(children);

    return (
      <form {...formProps}>
        {newChildren}
      </form>
    )
  }
}

export default BlueForm;
