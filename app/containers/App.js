// @flow
import React, { Fragment } from 'react';
import ErrorHandler from '../components/ErrorHandler';

type Props = {
  children: React.Node
};

export default class App extends React.Component<Props> {
  props: Props;

  render() {
    return (
      <Fragment>
      <ErrorHandler>
        {this.props.children}
       </ErrorHandler>
      </Fragment>
    );
  }
}
